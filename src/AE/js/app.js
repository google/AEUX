// (function () {

//// variables
var cs = new CSInterface();
var fs = require('fs');

// if using AE CC2018+
if (cs.hostEnvironment.appVersion.split('.')[0]>14) {
	var download = require('images-downloader').images;
	var untildify = require('untildify');
	// var untildify = require('../../node_modules/untildify/index.js');
}
var scriptName = 'AEUX';
var devName = 'sumUX';
var toolDocUrl = 'https://aeux.io/';
var figmaUrl = 'https://aeux-55e58.firebaseapp.com';
var versionNumber = 0.67;
var devPath = cs.getSystemPath(SystemPath.USER_DATA) + '/' + devName + '/';
var userPath = devPath + scriptName + '/';


//// load in jsx file on reload to help with dev
function loadJsxFile(scriptName) {
	var f = cs.getSystemPath(SystemPath.EXTENSION) + '/jsx/' + scriptName + '.jsx';
	if (cep.fs.readFile(f).err === 0) {
		cs.evalScript('$.evalFile("'+ f +'")');
	}
	console.log('loaded:', scriptName);
}


//// simplified jsx command call with promise return
function evalScript(funcName, params) {
	var args = JSON.stringify(params);

	if (typeof args === "undefined" || args === "{}") {
		args = "";
	}
	var command = scriptName + '.' + funcName + '(' + args + ')'
	return new Promise(function(resolve, reject) {
		cs.evalScript(command, resolve);
	});
}

//// message to AE to start building layers from JSON
function buildLayers(data, msgOverride) {
	evalScript( 'buildLayers', data ).then(function(results) {
		console.log(JSON.parse(results));

		/// error msg because the json returned nothing
		if (!JSON.parse(results)) {
			vm.footerMessage = 'Open an existing comp first';
			setTimeout(function () {
				vm.footerMessage = null;
			}, 2000);
			return;
		}

		/// show footer message
		var msg = msgOverride || JSON.parse(results).msg;
		vm.footerMessage = parseFooterMessages(msg);
		setTimeout(function () {
			vm.footerMessage = null;
		}, 2500);
	});
	vm.newLayers = false;
}

//// return a set of messages for the footer
function parseFooterMessages(msg) {
	/// reset var
	var messagesToPost = [];

	/// available messages
	var messages = [
		null,
		'Unsupported:\nText gradient fills',
		'Unsupported:\nAngular gradients',
		'Unsupported:\nComp width exceeds 30,000px',
		'Unsupported:\nComp height exceeds 30,000px',
		'Error:\nCan\'t save preset file',
		'Error:\nCan\'t locate image file',
		'Error:\nFigma image downloads CC2018+',
	]

	/// filter out duplicate messages
	var uniqueMessages = msg.filter( onlyUnique );

	/// add all messages into an array
	for (var i = 0; i < uniqueMessages.length; i++) {
		// if (i == 0) {
			// messagesToPost.push('Unsupported:')
		// }
		messagesToPost.push(messages[ uniqueMessages[i] ])
	}

	/// create one string from all the messages
	return messagesToPost.join('\n');

	function onlyUnique(value, index, self) {
	    return self.indexOf(value) === index;
	}
}


//// Save text to file
function save_text(filePath, text) {
    // window.cep.fs.writeFile(filePath + 'AEUX.json', text);

    fs.writeFile(filePath, text, function(err) {
        if(err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
	console.log(text);
	console.log(filePath);
}


//// make sure that a folder exists before saving files
function checkDir(path) {
    var stat = window.cep.fs.stat(path);
    var isDir = (stat.err == window.cep.fs.NO_ERROR && stat.data.isDirectory() );
	if (!isDir) { window.cep.fs.makedir(path) }
}


//// read the prefs file outside of the signed extension at intitialization
function getPrefs() {
	/// read the layer data file
	fs.readFile(vm.filePath + 'config/prefs.json', 'utf8', function (err, data) {
		console.log(err);

		/// successfully read
		if (err == null) {
			vm.prefs = JSON.parse(data);
			console.log(JSON.parse(data));
		/// prefs defaults
		} else {
			vm.prefs = {
				updateTime: 0,
				autoBuild: false,
				newComp: true,
				precompGroups: false,
				parametrics: true,
				compScale: 3,
				expand: {
					groups: true,
					options: true,
				},
				artboard: null,
			};
			// save to prefs file
			vm.savePrefs();
		}
	});

	/// read the manifest at intitialization
	vm.readManifest();
}

///// Vue.js
var vm = new Vue({
	el: '#app',
	data: {
		prefs: {
			updateTime: 0,
			autoBuild: false,
			newComp: true,
			precompGroups: false,
			parametrics: true,
			compScale: 3,
			expand: {
				groups: true,
				options: true,
			},
			artboard: null,
		},
		showHelp: false,
		compScaleOptions: [
			{text: '1x', value: 1},
			{text: '2x', value: 2},
			{text: '3x', value: 3},
			{text: '4x', value: 4},
			{text: '5x', value: 5},
			{text: '6x', value: 6},
		],
		versionNumber: versionNumber,
		filePath: userPath,
		bgColor: 'rgb(0,0,0)',
		newLayers: false,
		dropHighlight: false,
		footerMessage: null	,
	},
	methods: {
		//// save prefs to disk
		savePrefs: function () {
			var path = vm.filePath + 'config/';
			checkDir(userPath);
			checkDir(path);
			// console.log(JSON.stringify(vm.prefs, false, 2));
			setTimeout(function () {
				window.cep.fs.writeFile(path + 'prefs.json', JSON.stringify(vm.prefs, false, 2));
			}, 100);
		},
		//// collapse/expand panel groups
		fold: function (name) {
			vm.prefs.expand[name] = !vm.prefs.expand[name];
			vm.savePrefs();
		},
		//// show help overlay
		toggleHelp: function (msg) {
            vm.showHelp = !vm.showHelp;
        },
		//// open shared folder
		openAdminFolder: function () {
			cs.evalScript("Folder('"+userPath+"').execute()")
		},
		//// handle switching tabs inside the panel
		switchTab: function (string) {
			vm.prefs.tab = string;
			vm.savePrefs();
		},
		//// set pref and save to prefs file
		setPref: function (pref, value) {
			vm.prefs[pref] = value;
			vm.savePrefs();
		},
		//// DEPRECIATED
		// copyPath: function () {
		// 	var copyText = document.getElementById('file-path');
		// 	copyText.select();
		// 	document.execCommand('copy');
		// },

		//// visual change when dropping JSON file
		highlight: function () {
			vm.dropHighlight = true;
		},
		unhighlight: function () {
			vm.dropHighlight = false;
		},
		//// read a file from disk then send json data to AE to build layers
		buildLayersFromFile: function (path, updateBgFiles) {
			fs.readFile(path, 'utf8', function (err, layerData) {
				var parsedData = JSON.parse(layerData);

				/// compare Ae panel version with Sketch panel version
				if (parsedData[0].aeuxVersion > versionNumber) {
					var msgData = {
						text: parsedData[0].hostApp + ' is using a newer version of AEUX. Please download the updated Ae extension.',
						url: toolDocUrl,
					}
					evalScript('updateAePanel', msgData);
					return;
				}

				/// obj to stringify and send to AE
				var compObj = {
					prefs: {
						newComp: vm.prefs.newComp,
						parametrics: vm.prefs.parametrics,
						compScale: vm.prefs.compScale,
						precompGroups: vm.prefs.precompGroups,
					},
					layerData: parsedData,
					sourcePath: path.split('/').slice(0,-1).join('/'),
				}

				if (parsedData[0].hostApp == 'Figma' &&
					parsedData[0].imageUrls.length > 0) {

					// error message: needs CC2018+
					if (cs.hostEnvironment.appVersion.split('.')[0]>14) {
						evalScript('downloadFigmaImages').then(function(imagePath) {
							if (imagePath == 'null') { buildLayers(compObj); return }		// skip download and build layers
							imagePath = untildify(imagePath)
							// console.log(imagePath);
							// console.log(parsedData[0].imageUrls);

							download(parsedData[0].imageUrls, imagePath)
							///// hack the download lib to accept custom file names
							.then(function(results) {
								compObj.sourcePath = imagePath;
								buildLayers(compObj);
							    console.log('Images downloaded', result);
							})
							.catch(function(error) {console.log("downloaded error", error)})
						});
					} else {
						//error
						buildLayers(compObj, [7]);
						return;
					}
				} else {
					console.log(compObj);
					buildLayers(compObj);
				}


                /// dropping a file to update the admin files
                if (updateBgFiles) {
                    // console.log(parsedData)
                    var updateTime = new Date().getTime();
                    var manifest = {
                        updateTime: updateTime,
                        artboardName: parsedData[0].name,
                        layerCount: parsedData[0].layerCount,
                      }

                    vm.prefs.updateTime = updateTime;
                    vm.prefs.artboard = {
                        name: parsedData[0].name,
                        layerCount: parsedData[0].layerCount,
                    }
                    vm.savePrefs();
                    checkDir(userPath + 'msg/');
                    save_text(userPath + 'msg/manifest.json', JSON.stringify(manifest, false, 2));
                    save_text(userPath + 'msg/aeux.json', layerData);

                    // console.log('save junk')
                }


			});
		},
		downloadImage: function (image, path) {
			var filePath = path + '/' + image.name + '.png';
			console.log('trying to save to', filePath);

			var options = {
				url: image.url,
				dest: filePath
			}

			download.image(options)
			  .then(function() {
			    console.log('File saved to', filePath)
			  })
			  .catch(function(error) {
			    console.error(error)
			  })
		},
		//// simple AE function call
		aeCall: function (funcName) {
			evalScript( funcName );
		},
		//// Main button to start building layers
		readFileAndBuildLayers: function () {
			vm.buildLayersFromFile(vm.filePath + 'msg/aeux.json');
		},

		//// open dialog for reading a file from disk
		openFile: function () {
			var path = window.cep.fs.showOpenDialog(false, false, 'SELECT AEUX.json file', null, ['json']).data[0];
			vm.buildLayersFromFile(path);
		},
		//// open documentation URL
		openDocLink: function () {
			cs.openURLInDefaultBrowser(toolDocUrl);
		},
		openFigmaLink: function () {
			cs.openURLInDefaultBrowser(figmaUrl);
		},
		//// read the manifest file for info about new layers to build
		readManifest: function () {
			fs.readFile(vm.filePath + 'msg/manifest.json', 'utf8', function (err, data) {				/// read the manifest
				manifestData = JSON.parse(data);
				/// data is newer than the time of the last build
				if (manifestData.updateTime > vm.prefs.updateTime) {								/// is the save time
					vm.prefs.updateTime = manifestData.updateTime;									/// update the time pref

					/// is set to auto build, build layers
					if (vm.prefs.autoBuild) {
						fs.readFile(vm.filePath + 'msg/aeux.json', 'utf8', function (err, layerData) {		/// read the layer data file
							console.log('vm.prefs.updateTime', vm.prefs.updateTime);
							var compObj = {
								prefs: {
									newComp: vm.prefs.newComp,
									parametrics: vm.prefs.parametrics,
									compScale: vm.prefs.compScale,
								},
								layerData: JSON.parse(layerData),
								sourcePath: vm.filePath + 'msg/aeux.json',
							}
							buildLayers(compObj);														/// send message to AE to build layers
						});
					/// is NOT set to auto build, so update the panel badges
					} else {
						vm.prefs.artboard = {
							name: manifestData.artboardName,
							layerCount: manifestData.layerCount
						};
						vm.newLayers = true;
						console.log(manifestData);
					}
					vm.savePrefs();
				}
			});
		},
	},
});

//// watch for update to manifest file
fs.watchFile(vm.filePath + 'msg/manifest.json', function () {
	// console.log('file changed');
	vm.readManifest();
});

//// dropzone handler
var dropArea = document.getElementById('app');
	// prevent panel from trying to view the dropped file like a browser
	['dragenter', 'dragover', 'dragleave', 'drop'].forEach(function (eventName) {
		dropArea.addEventListener(eventName, preventDefaults, false);
	});
	// highlight the panel to indicate drop
	['dragenter', 'dragover'].forEach(function (eventName) {
		dropArea.addEventListener(eventName, vm.highlight, false);
	});
	// remove highlight
	['dragleave', 'drop'].forEach(function (eventName) {
		dropArea.addEventListener(eventName, vm.unhighlight, false);
	});

	dropArea.addEventListener('drop', handleDrop, false);

	function preventDefaults (e) {
		e.preventDefault();
		e.stopPropagation();
	}

	function handleDrop(e) {
		var droppedFile = e.dataTransfer.files[0];
		if (droppedFile.type == 'application/json') {
            vm.buildLayersFromFile(droppedFile.path, true);
		} else {
			vm.footerMessage = "Oops that's not a .json file";
			setTimeout(function () {
				vm.footerMessage = null;
			}, 2000);
		}
	}
	function highlight(e) {
		console.log('highlight');
		dropArea.classList.add('drop-highlight')
	}

	function unhighlight(e) {
		console.log('unhighlight');
		dropArea.classList.remove('drop-highlight')
	}



///// Flyout and context menus
var flyoutXML = '<Menu>\
                            <MenuItem Label="---" />\
                            <MenuItem Id="reload" Label="Reload" Enabled="true" Checked="false"/>\
                            <MenuItem Label="---" />\
							<MenuItem Id="help" Label="Help" Enabled="true" Checked="false"/>\
					</Menu>';

	cs.setContextMenu(flyoutXML, function (res) {
		if (res =='settings') {
			cs.requestOpenExtension('com.aeux.modal', '');
		}
		if (res == 'reload') {
			window.location.reload(true);
		}
		if (res == 'help') {
            vm.toggleHelp();
			// cs.openURLInDefaultBrowser('adamplouff.github.io/aeux-doc/');
		}
	});

	cs.setPanelFlyoutMenu(flyoutXML);

	cs.addEventListener('com.adobe.csxs.events.flyoutMenuClicked', function(evt) {
	if (evt.data.menuId == 'settings') {
		cs.requestOpenExtension('com.aeux.modal', '');
	}
	if (evt.data.menuId == 'reload') {
		window.location.reload(true);
	}
	if (evt.data.menuId == 'help') {
        vm.toggleHelp();
		// cs.openURLInDefaultBrowser('adamplouff.github.io/aeux-doc/');
	}
});


//// host app BG Color
cs.addEventListener(CSInterface.THEME_COLOR_CHANGED_EVENT, setBgColor);

	function setBgColor() {
		var appColor = cs.getHostEnvironment().appSkinInfo.panelBackgroundColor.color;
		vm.bgColor = 'rgb('+ Math.floor(appColor.red) + ', ' + Math.floor(appColor.green) + ', ' + Math.floor(appColor.blue) + ')';
	}


//// intitialize
loadJsxFile('script');		// loads the jsx file after the panel loads for easy right-click > Reload to update the panel without closing it or the host app
setBgColor();				// gets the interface color
getPrefs();					// reads available prefs json file that is outside of the signed extensions

// }());
