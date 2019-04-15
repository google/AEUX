const figmaApi = new fdk.FigmaApi({
  clientId: "cWdGmOYOBBVSIuPoFUdjjf",
  clientSecret: "64NFGYGuJ2r0WzHOfUEPzSlUEomVU0",
  redirectUri: "https://aeux-55e58.firebaseapp.com/callback.html"
});

var vm = new Vue({
  el: "#app",
  data: {
    hasToken: false,
    figmaApiKey: "", // personal access token
    // figmaApiKey: "2368-4b47e390-2b13-4c81-911f-e6d4ade505ac", // personal access token
    // fileUrl: "https://www.figma.com/file/WMXYs71NA4zPYT1T9GUPZneu/FimgasExport?node-id=0%3A1&viewport=-399%2C101%2C0.5",
    fileUrl: "https://www.figma.com/file/0cRk8qFB9MiCkEtniYatxqc6/Text-tester?node-id=0%3A2&viewport=157%2C112%2C1",
    imageIdList: [],
    imageUrlList: [],
    aeuxData: {},
    thumbnails: [],
    generatingImagesList: [],
    isPingingFigma: false,
    figmaTree: {},
    prefs: {
        downloadThumbnails: false,
    }
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
    getFigmaDoc: function() {
        vm.isPingingFigma = true;
        // console.log('ping');

        var file_key = vm.fileUrl.split("/file/")[1].split("/")[0];
        //   getJson(file_key);
        getJson(file_key).then(figmaJson => {
            // console.log(figmaJson);
            figmaJson.forEach(frame => {
                frame.isGeneratingImages = false;
            });
            vm.figmaTree = figmaJson;
            vm.thumbnails.length = figmaJson.length;
            vm.thumbnails.fill(
            "https://thomas.vanhoutte.be/miniblog/wp-content/uploads/light_blue_material_design_loading.gif"
            );
            if (vm.prefs.downloadThumbnails) {
                // get images
                for (var i = 0; i < figmaJson.length; i++) {
                    storeImage(i, figmaJson);
                }
            }
            vm.isPingingFigma = false;
        });


        function storeImage(i, figmaJson) {
            getThumbnail(file_key, figmaJson[i].id).then(imageUrl => {
                vm.thumbnails.splice(i, 1, imageUrl);
            });
        }
    },
    aeuxConvert: function(data) {
        // console.log(aeux.convert(data));

        vm.aeuxData = aeux.convert(data);
    },
    downloadJson: function(frame) {
        var aeuxData = aeux.convert(frame);
        console.log(aeuxData)

        // download images if images in frame
        if (vm.imageIdList.length > 0) {
            console.log('start image creation')
            downloadImages(vm.imageIdList, frame).then(urls => {
                aeuxData[0].imageUrls = vm.imageUrlList;
                console.log('finished image creation');

                var blob = new Blob([JSON.stringify(aeuxData, false, 2)], {
                    type: "text/plain;charset=ansi"
                  });

                  saveAs(blob, "AEUX.json");
            });
        } else {
            var blob = new Blob([JSON.stringify(aeuxData, false, 2)], {
                type: "text/plain;charset=ansi"
              });

              saveAs(blob, "AEUX.json");
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
  return data.document.children[0].children;
}

async function getThumbnail(figmaId, id) {
//   vm.loading = "loading...";
    console.log("getting image", id);
    // vm.imageUrl = null;
    let result = await fetch(
    "https://api.figma.com/v1/images/" + figmaId + "?ids=" + id + "&scale=1" + "&format=svg",
        {
            method: "GET",
            headers: {
            'Authorization': 'Bearer ' + vm.figmaApiKey      // with OAuth
            // "X-Figma-Token": vm.figmaApiKey // with a personal access token
            }
        }
    );
    let data = await result.json();
    console.log(data);
    return data.images[id];
}
async function downloadImages(ids, frame) {
//   vm.loading = "loading...";
    frame.isGeneratingImages = true;
    var file_key = vm.fileUrl.split("/file/")[1].split("/")[0];
    console.log("loading images", ids);
    let result = await fetch(
    "https://api.figma.com/v1/images/" + file_key + "?ids=" + ids.join(',') + "&scale=4",
        {
            method: "GET",
            headers: {
            'Authorization': 'Bearer ' + vm.figmaApiKey      // with OAuth
            // "X-Figma-Token": vm.figmaApiKey // with a personal access token
            }
        }
    );
    vm.imageUrlList = [];
    let data = await result.json();

    for (var i = 0; i < ids.length; i++) {
        vm.imageUrlList.push({
            url: data.images[ ids[i] ],
            name: ids[i].replace(':', '-'),
        });
        // vm.imageUrlList.push(data.images[ ids[i] ]);
    }
    // console.log(vm.imageUrlList);
    frame.isGeneratingImages = false;
    return vm.imageUrlList;
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
	return obj;
};
