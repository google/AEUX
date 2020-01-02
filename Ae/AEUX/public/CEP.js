var cs = new CSInterface();
var v = new Vulcan();
// var require = require || cep_node.require;
var fs = require('fs');
var path = require('path');
var scriptName = 'AEUX';
// var scriptName = getExtName('AEUX').replace(' ', '');
var isMac = (cs.getOSInformation().substring(0, 3) == 'Mac') ? true : false    

var devName = 'BattleAxe';
var prefs = {};

var devPath = cs.getSystemPath(SystemPath.USER_DATA) + '/' + devName + '/';
var userPath = devPath + scriptName + '/';

function evalScript(funcName, params) {
    console.log(params);
    
    var args = JSON.stringify(params);
    if (typeof args === "undefined" || args === "{}") {
        args = "";
    }
    var command = scriptName + '.' + funcName + '(' + args + ')';
    return new Promise(function(resolve, reject) {
        cs.evalScript(command, resolve);
    });
}

///// switch apps
function switchApps(app) {
	console.log('switch');
    var appName = new RegExp(app + '-\\d');
    var adobeApps = v.getTargetSpecifiers();
    var currentApp;
    var runningApp = false;
    // alert(JSON.stringify(adobeApps, false, 2))

    // find the newest version unless one earlier is running
    for (var i = 0; i < adobeApps.length; i++) {
        if (adobeApps[i].search(appName) != -1 && !runningApp) {
            currentApp = adobeApps[i];
            runningApp = v.isAppRunning(currentApp) ? true : false;
        }
    }

    v.launchApp(currentApp, true);
    console.log(currentApp);
}

////// Vulcan broadcaster
function newVulcanMessage(message, opt_data, opt_nestedData) {
	if (typeof message === 'string') {
		message = {
			cmd: message,
			data: opt_data || null,
			nestedData: opt_nestedData || null,
		}
	}
    var ccMessage = new VulcanMessage (VulcanMessage.TYPE_PREFIX + "com."+ scriptName +".vulcan");
        ccMessage.setPayload(JSON.stringify(message));
    VulcanInterface.dispatchMessage(ccMessage);    
}

///// reads the prefs file outside of the signed extension
function getPrefs() {
    try {
        prefs = fs.readFileSync(userPath + 'config/prefs.json', 'utf8');
        return prefs;
    } catch (error) {
        prefs = {
            outputModule: 'Lossless',
            relativeExport: true,
            relativePath: scriptName,
            licenseKey: '',
            expand: {
                options: false,
                system: false,
            }
        };
        
        savePrefs(prefs);
        // setTimeout(() => {
            return JSON.stringify(prefs);
        // }, 50);
        
    }
}
function savePrefs (prefs) {
	var path = userPath + 'config/';
	checkDir(userPath);
	checkDir(path);
	window.cep.fs.writeFile(path + 'prefs.json', JSON.stringify(prefs, false, 2));
	console.log(prefs);
}
///// insures that a folder exists before saving files
function checkDir(path) {
    var stat = window.cep.fs.stat(path);
    var isDir = stat.err == window.cep.fs.NO_ERROR && stat.data.isDirectory();
	if (!isDir) { window.cep.fs.makedir(path) }
}

function untildify (aePath) {
    console.log('aePath:', aePath)
    
    if (isMac) {    // mac
        if (aePath.charAt(0) !== '~') { aePath = '/Volumes' + aePath }	// append /Volumes to filepath if not on the local drive
        if (aePath.substring(0,2) == '~/') { 
            var homedir = path.join(cs.getSystemPath(SystemPath.USER_DATA), '/../../');
            aePath = aePath.replace('~/', homedir);
        }
    } else {        // windows
        if (aePath.substring(0, 9) == '/Volumes/') {                      // windows drive letter
            var drivePath = aePath.replace('/Volumes/', '');         // remove /Volumes/
            aePath = drivePath.slice(0,1) + ':' + drivePath.slice(1);     // add a colon after the drive letter - f/ becomes f:/
        }
        if ( (/^\/./).test(aePath )) {                      // windows drive letter
            var drivePath = aePath;         // remove /Volumes/
            aePath = drivePath.slice(1,2) + ':' + drivePath.slice(2);     // add a colon after the drive letter - f/ becomes f:/
        }
    }
    


    return aePath;
}

function getExtName(fallbackName) {
    var extId = window.__adobe_cep__.getExtensionId();
    if (extId.split('.').pop() == 'hidden') { return fallbackName }
    var extName = null;
    
    var exts = JSON.parse(window.__adobe_cep__.getExtensions());
    for (var i = 0; i < exts.length; i++) {
        var ext = exts[i];
        if (ext.id == extId) {
            extName = ext.name;
            break;
        }
    }
    return extName;
}