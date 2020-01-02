var prefs = getPrefs();

const figmaApi = new fdk.FigmaApi({
  clientId: "cWdGmOYOBBVSIuPoFUdjjf",
  clientSecret: "64NFGYGuJ2r0WzHOfUEPzSlUEomVU0",
  redirectUri: "https://figma.aeux.io/callback.html"
});

var loadingGif = 'https://thomas.vanhoutte.be/miniblog/wp-content/uploads/light_blue_material_design_loading.gif';

var vm = new Vue({
  el: "#app",
  data: {
    hasToken: false,
    figmaApiKey: "", // personal access token
    // figmaApiKey: "2368-4b47e390-2b13-4c81-911f-e6d4ade505ac", // personal access token
    fileUrl: "https://www.figma.com/file/WMXYs71NA4zPYT1T9GUPZneu/FimgasExport?node-id=0%3A1&viewport=-399%2C101%2C0.5",
    // fileUrl: "https://www.figma.com/file/a4pdj5zNX8ddxLlIox4Pu3/N_HPRedesign-(Copy)",
    imageIdList: [],
    downloadVersion: '0.6.9',
    svgIdList: [],
    imageUrlList: [],
    aeuxData: {},
    thumbnails: {},
    generatingImagesList: [],
    isPingingFigma: false,
    figmaTree: {},
    figmaPage: 0,
    exportOptionsUnfold: false,
    pageSelectorUnfold: false,
    prefs: prefs,
  },
  methods: {
    // used for the frame background color when not showing a thumbnail
    rgbToHex: function (color) {
        return 'rgb(' + color.r*255 + ',' + color.g*255 + ',' + color.b*255 + ')';
    },
    // for debugging
    manualToken: function() {
      console.log("manual");

      window.localStorage.setItem(
        "figma-access-token-data",
        JSON.stringify({
          token: "0CWd46oGNclmebNEsa9Usj9R5mWVuHzqWOBWreSf",
          expireOnEpoch: 1561647895236
        })
      );
      window.localStorage.setItem(
        "figma-authorization-code-data",
        JSON.stringify({
          code: "r3ADUSPayVU71KXZfluZhdQ80",
          state: "0.47658592781062126"
        })
      );

      this.hasToken = true;
    },
    // deauth figma by removing the auth code from local storage
    clearToken: function() {
      console.log("clear token");

      localStorage.clear();

      this.hasToken = false;
    },
    checkToken: function() {
        figmaApi.getLocalToken().then(token => {
          console.log(token);
          this.figmaApiKey = token;

          if (!token) {
            this.hasToken = false;
          } else {
            this.hasToken = true;
          }
        });
      },
    getToken: function() {
        console.log("getting token");
        figmaApi.startAuth();
        //   figmaApi.getOAuth2Token().then(token => {
        //     console.log(token);
        //     this.figmaApiKey = token;
        //     this.hasToken = true;
        //   });
    },
    toggleDownloadThumbnails: function () {
        if (vm.prefs.downloadThumbnails) { vm.getFigmaDoc() };
        vm.savePrefs();
    },
    savePrefs: function () {
        window.localStorage.setItem( "prefs", JSON.stringify(vm.prefs) );
    },
    getFigmaDoc: function() {
        vm.isPingingFigma = true;
        // console.log('ping');

        var file_key = vm.fileUrl.split("/file/")[1].split("/")[0];
        getJson(file_key).then(figmaPagesJson => {
            // console.log(figmaPagesJson);

            vm.thumbnails.length = 0;
            vm.thumbnails = {};
            figmaPagesJson.forEach(page => {
                page.children.forEach(frame => {
                    frame.isGeneratingImages = false;
                    Vue.set( vm.thumbnails, frame.id, loadingGif )
                });
            });
            vm.figmaTree = figmaPagesJson;

            if (vm.prefs.downloadThumbnails) {
                for (var id in vm.thumbnails) {
                    // console.log(id);
                    if (vm.thumbnails.hasOwnProperty(id)) {
                        storeImage(id);
                    }
                }
            }
            vm.isPingingFigma = false;
        });


        function storeImage(id) {
            getThumbnail(file_key, id).then(imageUrl => {
                // console.log(imageUrl);
                Vue.set( vm.thumbnails, id, imageUrl )
                // console.log(vm.thumbnails);
            });
        }
    },
    aeuxConvert: function(data) {
        // console.log(aeux.convert(data));

        vm.figmaTree = data;
        vm.aeuxData = aeux.convert(data);
    },
    downloadJson: function(frame) {
        vm.imageIdList = [];
        vm.svgIdList = [];
        var aeuxData = aeux.convert(frame);
        // console.log(aeuxData)

        // download images if images in frame
        if (vm.imageIdList.length > 0) {
            // console.log('start image creation')
            downloadImages(vm.imageIdList, frame)
            .then(urls => {
                saveToZip('AEUX_'+ frame.name +'.zip', urls)
            });

            function saveToZip (filename, urls) {
                const zip = new JSZip()
                const folder = zip.folder('AEUX')
                urls.forEach((url)=> {
                    const blobPromise = fetch(url.url).then(r => {
                        if (r.status === 200) return r.blob()
                        return Promise.reject(new Error(r.statusText))
                    })
                    const name = url.name + '.png';
                    folder.file(name, blobPromise);
                })
                folder.file('AEUX_'+ frame.name +'.json', JSON.stringify(aeuxData, false, 2))

                zip.generateAsync({type:"blob"})
                    .then(blob => saveAs(blob, filename))
                    .catch(e => console.log(e));
            }
            // hack to download and parse svg data
        } else if (vm.svgIdList.length > 0) {
            console.log('start svg download')
            // console.log(vm.svgIdList);
            // console.log(aeuxData.find(layer => layer.id == "25:7"));
            downloadSvgs(aeuxData, vm.svgIdList, frame).then(urls => {
                var blob = new Blob([JSON.stringify(aeuxData, false, 2)], {
                    type: "text/plain;charset=ansi"
                  });

                saveAs(blob, 'AEUX_'+ frame.name +'.json');
            });
        } else {
            var blob = new Blob([JSON.stringify(aeuxData, false, 2)], {
                type: "text/plain;charset=ansi"
              });

              saveAs(blob, 'AEUX_'+ frame.name +'.json');
              console.log('save');
        }
    },
  },
    filters: {
        round: function(num) {
            return Math.round(num);
        },
    },
});


/* Check the local token against the auth'd at initialize*/
vm.checkToken();

async function getJson(figmaId) {
//   vm.loading = "loading...";
  let result = await fetch (
    "https://api.figma.com/v1/files/" + figmaId + "?geometry=paths",
    {
      method: "GET",
      headers: {
        'Authorization': 'Bearer ' + vm.figmaApiKey      // with OAuth
        // "X-Figma-Token": vm.figmaApiKey     // with a personal access token
      }
    }
  );
  let data = await result.json();

  // if figma has revoked access get a new token and remove localstorage
  if (data.status !== undefined) {
      console.log('need to reauth');
      vm.hasToken = false;
      window.localStorage.removeItem('figma-access-token-data');
      return null;
  }

//   vm.projectName = data;
  return data.document.children;    // return pages
  // return data.document.children[0].children;
}

async function getThumbnail(figmaId, id) {
//   vm.loading = "loading...";
    console.log("getting image", id);
    // vm.imageUrl = null;
    let result = await fetch(
    "https://api.figma.com/v1/images/" + figmaId + "?ids=" + id + "&scale=1" + "&format=png",
    // "https://api.figma.com/v1/images/" + figmaId + "?ids=" + id + "&scale=1" + "&format=svg",
        {
            method: "GET",
            headers: {
            'Authorization': 'Bearer ' + vm.figmaApiKey      // with OAuth
            // "X-Figma-Token": vm.figmaApiKey // with a personal access token
            }
        }
    );
    let data = await result.json();
    return data.images[id];
}
async function downloadImages(ids, frame) {
    vm.imageUrlList = [];
    frame.isGeneratingImages = true;

    try {
        console.log('plop');
        
        let file_key = vm.fileUrl.split("/file/")[1].split("/")[0];

        // separate function to make code more clear
        const grabContent = url => fetch(url, {
                method: 'GET',
                headers: {
                'Authorization': 'Bearer ' + vm.figmaApiKey      // with OAuth
                }
            })
            .then(res => res.json())
            .then(data => {
                id = Object.keys(data.images)[0];
                
                vm.imageUrlList.push({
                    url: data.images[ id ],
                    name: id.replace(/:/g, '-'),
                });
                console.log('generated image at', data.images[ id ])
            })
            .catch(error => {
                console.log(error)
            })

        
        let urls = [];

        ids.forEach(id => {
            var fetchURL = "https://api.figma.com/v1/images/" + file_key + "?ids=" + id + "&scale=4";
            urls.push(fetchURL)
        });

        await Promise
            .all(urls.map(grabContent))

        frame.isGeneratingImages = false;
        return vm.imageUrlList; 
    } catch (error) {
        frame.isGeneratingImages = false;
        return vm.imageUrlList; 
    }
    
}
async function downloadSvgs(aeuxData, ids, frame) {
    frame.isGeneratingImages = true;
    var file_key = vm.fileUrl.split("/file/")[1].split("/")[0];
    var fetchURL = "https://api.figma.com/v1/images/" + file_key + "?ids=" + ids.join(',') + "&scale=1" + "&format=svg";

    console.log("loading images", ids);
    let result = await fetch( fetchURL,
        {
            method: "GET",
            headers: {
                'Authorization': 'Bearer ' + vm.figmaApiKey      // with OAuth
            }
        }
    );
    let data = await result.json();

    // override shape data when manually pulling from SVG
    for (var i = 0; i < ids.length; i++) {
        var id = ids[i];
        svgUrl = data.images[ id ];
        console.log(svgUrl);
        let pathObj = await fetchSVG(svgUrl);
        console.log(pathObj);

        var layerObj = findLayerObj(aeuxData, id);
        // var layerObj = aeuxData.find(layer => layer.id == id);

        if (layerObj) {     // found it
            if (pathObj.type == 'Path') {
                console.log('post parsesvg', pathObj.path.d);
                // check if multipath
                var paths = pathObj.path.d.match(/(M|(?<=Z)).*?((?=M)|$)/g);
                if (paths.length > 1) {
                    layerObj.layers = [];
                    layerObj.type = 'CompoundShape';
                    for (var j = 0; j < paths.length-1; j++) {
                        layerObj.layers.push({
                            type: 'Path',
                            frame: {width: 0, height: 0, x: 0, y: 0},
                            path: parseSvg(paths[j]),
                            booleanOperation: 1,        /// xxx
                            rotation: 0,
                            flip: [100,100],
                        });
                    }
                    console.log(layerObj.layers);
                } else {
                    layerObj.path = parseSvg(pathObj.path.d, true);
                }
            } else if (pathObj.type == 'Ellipse') {
                var r = pathObj.path.r;
                var tangent = r/1.810938066;
                layerObj.path = {
                    points: [
                        [r, 0],
                        [r*2, r],
                        [r, r*2],
                        [0, r],
                    ],
                    inTangents: [
                        [-tangent,0],
                        [0,-tangent],
                        [tangent,0],
                        [0,tangent],
                    ],
                    outTangents: [
                        [tangent,0],
                        [0,tangent],
                        [-tangent,0],
                        [0,-tangent],
                    ],
                    closed: true,
                }
                console.log('ellipse', pathObj);
            } else if (pathObj.type == 'Line') {
                layerObj.path = {
                    points: [
                        [parseFloat(pathObj.line.x1 || 0), pathObj.line.y1-layerObj.absoluteBoundingBox.height/2],
                        [parseFloat(pathObj.line.x2 || 0), pathObj.line.y2-layerObj.absoluteBoundingBox.height/2],
                    ],
                    inTangents: [],
                    outTangents: [],
                    closed: false,
                }
            }


            layerObj.rotation = 0;
            layerObj.flip = [100,100];
            // layerObj.frame = {width: 0, height: 0, x: 0, y: 0};

            if (pathObj['stroke-linecap'] == 'round') { layerObj.stroke[0].cap = 1 };
            if (pathObj['stroke-linejoin'] == 'round') { layerObj.stroke[0].join = 1 };

            if (pathObj['stroke-linecap'] == 'square') { layerObj.stroke[0].cap = 2 };
            if (pathObj['stroke-linejoin'] == 'bevel') { layerObj.stroke[0].join = 2 };

            // console.log(layerObj);
        } else {
            console.log('couldnt find it');
        }
    }
    frame.isGeneratingImages = false;

    function findLayerObj(layerList, id) {
        // console.log('looking for', id, 'inside of', layerList);
        for (var i = 0; i < layerList.length; i++) {
            layer = layerList[i];
            // console.log(layer.name, layer.type);
            // console.log(layer, layer.id);
            if (layer.id == id) {
                return layer;
            }
            if (layer.type == 'Group' || layer.type == 'Component') {
                // console.log('looking in group', layer.name);
                // console.log(layer.name, layer.layers);
                // console.log(findLayerObj(layer.layers, id));
                var nestedLayer = findLayerObj(layer.layers, id);
                if (nestedLayer) { return nestedLayer }
            }
        }
    }
}
const fetchSVG = async function(url, el) {
    let response = await fetch(url);
	let data = await response.text();
    var xmlDOM = new DOMParser().parseFromString(data, 'text/xml');

    var svg = xmlToJson(xmlDOM).svg;
    // console.log(url);
    // console.log(svg);
    if (svg !== undefined) {
        if (svg.path) {
            pathObj = {
                type: 'Path',
                path: svg.path['@attributes'],
            }
        } else if (svg.circle) {
            pathObj = {
                type: 'Ellipse',
                path: svg.circle['@attributes'],
            }
        } else if (svg.line) {
            pathObj = {
                type: 'Line',
                line: svg.line['@attributes'],
            }
        }
    } else {
        return {type: null};
    }
    // pathObj = xmlToJson(xmlDOM).svg.path['@attributes'];
    // console.log(pathObj);
    return pathObj;

}
function xmlToJson(xml) {

	// Create the return object
	var obj = {};

	if (xml.nodeType == 1) { // element
		// do attributes
		if (xml.attributes.length > 0) {
		obj["@attributes"] = {};
			for (var j = 0; j < xml.attributes.length; j++) {
				var attribute = xml.attributes.item(j);
				obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
			}
		}
	} else if (xml.nodeType == 3) { // text
		obj = xml.nodeValue;
	}

	// do children
	if (xml.hasChildNodes()) {
		for(var i = 0; i < xml.childNodes.length; i++) {
			var item = xml.childNodes.item(i);
			var nodeName = item.nodeName;
			if (typeof(obj[nodeName]) == "undefined") {
				obj[nodeName] = xmlToJson(item);
			} else {
				if (typeof(obj[nodeName].push) == "undefined") {
					var old = obj[nodeName];
					obj[nodeName] = [];
					obj[nodeName].push(old);
				}
				obj[nodeName].push(xmlToJson(item));
			}
		}
	}
    // console.log(obj);
	return obj;
};
function getPrefs() {
    var prefs = JSON.parse(window.localStorage.getItem('prefs'));

    if (!prefs) {
        prefs = {
            downloadThumbnails: false,
        }
    }

    return prefs;
}


/// modal video
$(document).ready(function(){
    var $videoSrc;
    $('.video-btn').click(function() {
        $videoSrc = $(this).data( "src" );
    });
    console.log($videoSrc);

    // when the modal is opened autoplay it
    $('#myModal').on('shown.bs.modal', function (e) {

    // set the video src to autoplay and not to show related video. Youtube related video is like a box of chocolates... you never know what you're gonna get
    $("#video").attr('src',$videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" );
    })

    // stop playing the youtube video when I close the modal
    $('#myModal').on('hide.bs.modal', function (e) {
        // a poor man's stop video
        $("#video").attr('src',$videoSrc);
    })

});
