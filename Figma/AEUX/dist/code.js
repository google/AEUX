/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/code.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/code.ts":
/*!*********************!*\
  !*** ./src/code.ts ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
figma.showUI(__html__, { width: 166, height: 174 });
let hasFrameData;
let frameArr = [];
let imageHashList = [];
let imageBytesList = [];
let prefs = {
    exportRefImage: false,
};
// receive message from the UI
figma.ui.onmessage = message => {
    if (message.type === 'getPrefs') {
        // console.log('get those prefs');
        figma.clientStorage.getAsync('aeux.prefs')
            .then(prefs => {
            if (prefs) {
                figma.ui.postMessage({ type: 'retPrefs', prefs: prefs });
                return prefs;
            }
            else {
                // console.log('gotta save new prefs', message.defaultPrefs);
                figma.clientStorage.setAsync('aeux.prefs', message.defaultPrefs)
                    .then(() => {
                    figma.ui.postMessage({ type: 'retPrefs', prefs: message.defaultPrefs });
                });
                return message.defaultPrefs;
            }
        })
            .then(userPrefs => {
            prefs = userPrefs;
        });
    }
    if (message.type === 'setPrefs') {
        // console.log('save those prefs', message.prefs);
        figma.clientStorage.setAsync('aeux.prefs', message.prefs)
            .then(ret => {
            figma.ui.postMessage(message.prefs);
            prefs = message.prefs; // store the prefs locally
        });
    }
    if (message.type === 'exportSelection') {
        hasFrameData = false;
        frameArr = [];
        imageHashList = [];
        imageBytesList = [];
        let exportJSON = false;
        if (message.exportJSON) {
            exportJSON = true;
        }
        if (figma.currentPage.selection.length < 1) { // nothing selected
            figma.ui.postMessage({ type: 'fetchAEUX', data: null });
            return;
        }
        try {
            let selection = nodeToObj(figma.currentPage.selection);
            if (frameArr[0].children.length < 1) {
                frameArr[0].children = selection;
            }
            console.log('frameArr: ', frameArr);
        }
        catch (error) {
            console.log(error);
            console.log('selected layers need to be inside of a frame');
            figma.ui.postMessage({ type: 'footerMsg', action: 'Layers must be inside of a frame', layerCount: null });
        }
        // if exportRefImage is enabled
        if (prefs.exportRefImage) { // include a reference image with transfer
            let parentFrame = findFrame(figma.currentPage.selection[0]);
            console.log('exportRefImage', prefs.exportRefImage);
            let options = {
                format: "PNG",
                constraint: { type: "SCALE", value: 6 }
            };
            parentFrame.exportAsync(options)
                .then(img => {
                imageHashList.push({
                    hash: figma.createImage(img).hash,
                    id: parentFrame.name + '_reference' /// xxx need an image name
                });
                // needs to export images then send to ui.ts
            })
                .then(() => {
                let parentFrameName = parentFrame.name.replace(/\s*(\/|\\)\s*/g, '-');
                let refImg = {
                    type: 'Image',
                    name: parentFrameName + '_reference',
                    id: parentFrameName + '_reference',
                    frame: { x: parentFrame.width / 2, y: parentFrame.height / 2, width: parentFrame.width, height: parentFrame.height },
                    isVisible: true,
                    opacity: 50,
                    blendMode: 'BlendingMode.NORMAL',
                    isMask: false,
                    rotation: 0,
                    guide: true,
                };
                storeImageData(Array.from(new Set(imageHashList)), frameArr, refImg);
            });
        }
        else {
            // check if images need to export then send message to ui.ts
            if (exportJSON) {
                figma.ui.postMessage({ type: 'exportAEUX', data: frameArr });
            }
            else if (imageHashList.length < 1) {
                figma.ui.postMessage({ type: 'fetchAEUX', data: frameArr });
            }
            else {
                storeImageData(Array.from(new Set(imageHashList)), frameArr, null);
            }
        }
    }
    if (message.type === 'flattenLayers') {
        if (figma.currentPage.selection.length < 1) {
            return;
        } // nothing selected
        // let selection = nodeToObj(figma.currentPage.selection)
        let layerCount = flattenRecursive(figma.currentPage.selection, 0) || 0;
        // reselect layers
        figma.currentPage.selection = figma.currentPage.selection;
        figma.ui.postMessage({ type: 'footerMsg', action: 'flattened', layerCount });
    }
    if (message.type === 'rasterizeSelection') {
        if (figma.currentPage.selection.length < 1) {
            return;
        } // nothing selected
        // let selection = nodeToObj(figma.currentPage.selection)
        let layerCount = rasterizeSelection(figma.currentPage.selection, 0) || 0;
        // console.log('layerCount', layerCount);
        // reselect layers
        figma.currentPage.selection = figma.currentPage.selection;
        figma.ui.postMessage({ type: 'footerMsg', action: 'rasterized', layerCount });
    }
    if (message.type === 'detachComponents') {
        console.log('detachComponents');
        let layerCount = 4;
        figma.ui.postMessage({ type: 'footerMsg', action: 'flattened', layerCount });
    }
    //Communicate back to the UI
    // console.log('send message back to ui');
};
function nodeToObj(nodes) {
    //   console.log('nodes', nodes);
    if (nodes.length < 1) {
        return [];
    }
    // console.log(nodes[0].type);
    let arr = [];
    // look for the parent frame of everything except regular (non-autoLayout) frames and loose components
    if (nodes[0] && ((nodes[0].type === 'FRAME' && nodes[0].parent.type === 'PAGE') ||
        // (nodes[0].type === 'FRAME' && nodes[0].layoutMode === 'NONE') || 
        (nodes[0].type === 'COMPONENT' && nodes[0].parent.type === 'PAGE'))) { // a frame or a component master outside of a frame is directly selected
        console.log('GOT A FRAME');
        // console.log(nodes[0].children);
        hasFrameData = true; // dont need to get the frame data
        frameArr.push(getElement(nodes[0], false));
        nodes = nodes[0].children;
    }
    // get shapes 
    if (nodes.length < 1) {
        return [];
    }
    nodes.forEach(node => {
        // get the frame data
        if (!hasFrameData) {
            if (node.parent.type === 'PAGE') {
                return;
            } // layer is outside of a frame 
            // console.log('get the frame data');
            let frame = findFrame(node);
            // console.log('frame:', frame);
            let frameData = getElement(frame, true); // skip gathering children data
            frameData.children = []; // clear the children of the frame to push them later
            frameArr.push(frameData);
        }
        let obj = getElement(node, false);
        arr.push(obj);
    });
    // console.log('arr: ', arr);
    return arr;
    function getElement(node, skipChildren) {
        // console.log('node', node);
        let obj = {
            children: [],
            type: null,
        };
        for (const key in node) {
            let element = node[key];
            // console.log(element);
            if (key === 'children' && !skipChildren) {
                element = nodeToObj(element);
            }
            if (key === 'backgrounds') {
                element = nodeToObj(element);
            }
            if (key === 'fills' && element.length > 0) {
                collectImageHashes(element, node.id);
            }
            // corner radius
            if (element == figma.mixed && key === 'cornerRadius') {
                element = Math.min(node.topLeftRadius, node.topRightRadius, node.bottomLeftRadius, node.bottomRightRadius);
            }
            // try to get the first value on the text
            if (element == figma.mixed) {
                let str = 'getRange' + key.replace(/^\w/, c => c.toUpperCase());
                try {
                    element = node[str](0, 1);
                }
                catch (error) {
                    continue;
                }
            }
            // layer.fontName !== (figma.mixed)) ? layer.fontName.family : layer.getRangeFontName(0,1).family
            // if (key === 'parent') { console.log(element); }
            obj[key] = element;
        }
        // keep track of Auto-layout frames for alignment of children
        if (node.type === 'FRAME' && node.layoutMode !== 'NONE') {
            obj.type = 'AUTOLAYOUT';
        }
        return obj;
    }
    function collectImageHashes(element, id) {
        // console.log('imageHash', id, element);
        for (const i in element) {
            const fill = element[i];
            if (fill.type == 'IMAGE') {
                imageHashList.push({ hash: fill.imageHash, id });
            }
        }
    }
}
function storeImageData(imageHashList, layers, refImg) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(imageHashList);
        for (const i in imageHashList) {
            // console.log(element[i]);
            const hash = imageHashList[i].hash;
            const name = imageHashList[i].id
                .replace(/:/g, '-') // remove colons
                .replace(/\s*(\/|\\)\s*/g, '-'); // remove slashes
            try {
                let image = figma.getImageByHash(hash);
                let bytes = yield image.getBytesAsync();
                imageBytesList.push({ name, bytes });
                // console.log(bytes);
            }
            catch (error) { }
        }
        if (imageBytesList.length > 0) {
            figma.ui.postMessage({ type: 'fetchImagesAndAEUX', images: imageBytesList, data: layers, refImg });
        }
        else {
            figma.ui.postMessage({ type: 'fetchAEUX', data: layers });
        }
    });
}
function findFrame(node) {
    // console.log('node:', node);
    // console.log('node.type:', node.type);
    if ((node.type !== 'FRAME' && !(node.type === 'COMPONENT' && node.parent.type === 'PAGE'))
        || (node.type === 'FRAME' && node.layoutMode !== 'NONE')
        || (node.type === 'FRAME' && node.parent.type === 'FRAME')) {
        // if (node.type !== 'FRAME' && node.type !== 'COMPONENT') {
        return findFrame(node.parent);
    }
    else {
        hasFrameData = true;
        return node;
    }
}
function flattenRecursive(selection, layerCount) {
    try {
        selection.forEach(shape => {
            console.log('try flattening', shape);
            if (shape.type == 'BOOLEAN_OPERATION') {
                figma.flatten([shape]);
                layerCount++;
            }
            else if (shape.cornerRadius == figma.mixed || shape.cornerRadius > 0) {
                // flatten rounded corners
                figma.flatten([shape]);
                layerCount++;
            }
            else if (shape.children) {
                layerCount = flattenRecursive(shape.children, layerCount);
            }
            else {
                let t = shape.relativeTransform;
                console.log('shape.type', shape.type);
                /// check for transforms
                if (t[0][0].toFixed(6) != 1 ||
                    t[0][1].toFixed(6) != 0 ||
                    t[1][0].toFixed(6) != 0 ||
                    t[1][1].toFixed(6) != 1 ||
                    false) {
                    figma.flatten([shape]);
                    layerCount++;
                }
                else if (shape.type == 'TEXT') {
                    figma.flatten([shape]);
                    layerCount++;
                }
            }
        });
        return layerCount;
    }
    catch (error) {
        console.log(error);
        return layerCount;
    }
}
function rasterizeSelection(selection, layerCount) {
    try {
        let newSelection = [];
        selection.forEach(shape => {
            if (shape.type == 'GROUP') {
                let options = {
                    format: "PNG",
                    constraint: { type: "SCALE", value: 6 }
                };
                let shapeTransform = shape.relativeTransform; // store transform
                let removeTransform = [[1, 0, shape.x], [0, 1, shape.y]];
                shape.relativeTransform = removeTransform;
                shape.exportAsync(options)
                    .then(img => {
                    // console.log(figma.createImage(img));
                    let rect = figma.createRectangle();
                    shape.parent.appendChild(rect);
                    rect.x = shape.x;
                    rect.y = shape.y;
                    rect.relativeTransform = shapeTransform;
                    rect.name = shape.name + '_rasterize';
                    rect.resize(shape.width, shape.height);
                    let fillObj = JSON.parse(JSON.stringify(rect.fills[0]));
                    fillObj.filters = {
                        contrast: 0,
                        exposure: 0,
                        highlights: 0,
                        saturation: 0,
                        shadows: 0,
                        temperature: 0,
                        tint: 0,
                    };
                    fillObj.imageHash = figma.createImage(img).hash;
                    fillObj.imageTransform = [[1, 0, 0], [0, 1, 0]];
                    fillObj.scaleMode = "CROP";
                    fillObj.type = "IMAGE";
                    fillObj.scalingFactor = 0.5,
                        delete fillObj.color;
                    rect.fills = [fillObj];
                    newSelection.push(rect);
                    shape.relativeTransform = shapeTransform;
                });
                layerCount++;
            }
        });
        setTimeout(() => { figma.currentPage.selection = newSelection; }, 50);
        return layerCount;
    }
    catch (error) {
        console.log(error);
        return layerCount;
    }
}
function generateFrameImage() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let firstSelected = figma.currentPage.selection[0];
            let parentFrame = findFrame(figma.currentPage.selection[0]);
            let options = {
                format: "PNG",
                constraint: { type: "SCALE", value: 6 }
            };
            parentFrame.exportAsync(options)
                .then(img => {
                // console.log('hsadjfhjkahsdf', img);
                return figma.createImage(img);
            });
        }
        catch (error) {
            console.log(error);
            return null;
        }
    });
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxpQ0FBaUM7QUFDdkU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Es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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBLDZEQUE2RDtBQUM3RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsU0FBUztBQUNULDBCQUEwQiw0Q0FBNEMsRUFBRTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY29kZS50c1wiKTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAxNjYsIGhlaWdodDogMTc0IH0pO1xubGV0IGhhc0ZyYW1lRGF0YTtcbmxldCBmcmFtZUFyciA9IFtdO1xubGV0IGltYWdlSGFzaExpc3QgPSBbXTtcbmxldCBpbWFnZUJ5dGVzTGlzdCA9IFtdO1xubGV0IHByZWZzID0ge1xuICAgIGV4cG9ydFJlZkltYWdlOiBmYWxzZSxcbn07XG4vLyByZWNlaXZlIG1lc3NhZ2UgZnJvbSB0aGUgVUlcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1lc3NhZ2UgPT4ge1xuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdnZXRQcmVmcycpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2dldCB0aG9zZSBwcmVmcycpO1xuICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKCdhZXV4LnByZWZzJylcbiAgICAgICAgICAgIC50aGVuKHByZWZzID0+IHtcbiAgICAgICAgICAgIGlmIChwcmVmcykge1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3JldFByZWZzJywgcHJlZnM6IHByZWZzIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVmcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdnb3R0YSBzYXZlIG5ldyBwcmVmcycsIG1lc3NhZ2UuZGVmYXVsdFByZWZzKTtcbiAgICAgICAgICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCdhZXV4LnByZWZzJywgbWVzc2FnZS5kZWZhdWx0UHJlZnMpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAncmV0UHJlZnMnLCBwcmVmczogbWVzc2FnZS5kZWZhdWx0UHJlZnMgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2UuZGVmYXVsdFByZWZzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4odXNlclByZWZzID0+IHtcbiAgICAgICAgICAgIHByZWZzID0gdXNlclByZWZzO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3NldFByZWZzJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnc2F2ZSB0aG9zZSBwcmVmcycsIG1lc3NhZ2UucHJlZnMpO1xuICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCdhZXV4LnByZWZzJywgbWVzc2FnZS5wcmVmcylcbiAgICAgICAgICAgIC50aGVuKHJldCA9PiB7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZShtZXNzYWdlLnByZWZzKTtcbiAgICAgICAgICAgIHByZWZzID0gbWVzc2FnZS5wcmVmczsgLy8gc3RvcmUgdGhlIHByZWZzIGxvY2FsbHlcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdleHBvcnRTZWxlY3Rpb24nKSB7XG4gICAgICAgIGhhc0ZyYW1lRGF0YSA9IGZhbHNlO1xuICAgICAgICBmcmFtZUFyciA9IFtdO1xuICAgICAgICBpbWFnZUhhc2hMaXN0ID0gW107XG4gICAgICAgIGltYWdlQnl0ZXNMaXN0ID0gW107XG4gICAgICAgIGxldCBleHBvcnRKU09OID0gZmFsc2U7XG4gICAgICAgIGlmIChtZXNzYWdlLmV4cG9ydEpTT04pIHtcbiAgICAgICAgICAgIGV4cG9ydEpTT04gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24ubGVuZ3RoIDwgMSkgeyAvLyBub3RoaW5nIHNlbGVjdGVkXG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmZXRjaEFFVVgnLCBkYXRhOiBudWxsIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uID0gbm9kZVRvT2JqKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbik7XG4gICAgICAgICAgICBpZiAoZnJhbWVBcnJbMF0uY2hpbGRyZW4ubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIGZyYW1lQXJyWzBdLmNoaWxkcmVuID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2ZyYW1lQXJyOiAnLCBmcmFtZUFycik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZWN0ZWQgbGF5ZXJzIG5lZWQgdG8gYmUgaW5zaWRlIG9mIGEgZnJhbWUnKTtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ0xheWVycyBtdXN0IGJlIGluc2lkZSBvZiBhIGZyYW1lJywgbGF5ZXJDb3VudDogbnVsbCB9KTtcbiAgICAgICAgfVxuICAgICAgICAvLyBpZiBleHBvcnRSZWZJbWFnZSBpcyBlbmFibGVkXG4gICAgICAgIGlmIChwcmVmcy5leHBvcnRSZWZJbWFnZSkgeyAvLyBpbmNsdWRlIGEgcmVmZXJlbmNlIGltYWdlIHdpdGggdHJhbnNmZXJcbiAgICAgICAgICAgIGxldCBwYXJlbnRGcmFtZSA9IGZpbmRGcmFtZShmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ2V4cG9ydFJlZkltYWdlJywgcHJlZnMuZXhwb3J0UmVmSW1hZ2UpO1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiBcIlBOR1wiLFxuICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQ6IHsgdHlwZTogXCJTQ0FMRVwiLCB2YWx1ZTogNiB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcGFyZW50RnJhbWUuZXhwb3J0QXN5bmMob3B0aW9ucylcbiAgICAgICAgICAgICAgICAudGhlbihpbWcgPT4ge1xuICAgICAgICAgICAgICAgIGltYWdlSGFzaExpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgIGhhc2g6IGZpZ21hLmNyZWF0ZUltYWdlKGltZykuaGFzaCxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBhcmVudEZyYW1lLm5hbWUgKyAnX3JlZmVyZW5jZScgLy8vIHh4eCBuZWVkIGFuIGltYWdlIG5hbWVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvLyBuZWVkcyB0byBleHBvcnQgaW1hZ2VzIHRoZW4gc2VuZCB0byB1aS50c1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHBhcmVudEZyYW1lTmFtZSA9IHBhcmVudEZyYW1lLm5hbWUucmVwbGFjZSgvXFxzKihcXC98XFxcXClcXHMqL2csICctJyk7XG4gICAgICAgICAgICAgICAgbGV0IHJlZkltZyA9IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ0ltYWdlJyxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogcGFyZW50RnJhbWVOYW1lICsgJ19yZWZlcmVuY2UnLFxuICAgICAgICAgICAgICAgICAgICBpZDogcGFyZW50RnJhbWVOYW1lICsgJ19yZWZlcmVuY2UnLFxuICAgICAgICAgICAgICAgICAgICBmcmFtZTogeyB4OiBwYXJlbnRGcmFtZS53aWR0aCAvIDIsIHk6IHBhcmVudEZyYW1lLmhlaWdodCAvIDIsIHdpZHRoOiBwYXJlbnRGcmFtZS53aWR0aCwgaGVpZ2h0OiBwYXJlbnRGcmFtZS5oZWlnaHQgfSxcbiAgICAgICAgICAgICAgICAgICAgaXNWaXNpYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiA1MCxcbiAgICAgICAgICAgICAgICAgICAgYmxlbmRNb2RlOiAnQmxlbmRpbmdNb2RlLk5PUk1BTCcsXG4gICAgICAgICAgICAgICAgICAgIGlzTWFzazogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICAgICAgICAgICAgICBndWlkZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHN0b3JlSW1hZ2VEYXRhKEFycmF5LmZyb20obmV3IFNldChpbWFnZUhhc2hMaXN0KSksIGZyYW1lQXJyLCByZWZJbWcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiBpbWFnZXMgbmVlZCB0byBleHBvcnQgdGhlbiBzZW5kIG1lc3NhZ2UgdG8gdWkudHNcbiAgICAgICAgICAgIGlmIChleHBvcnRKU09OKSB7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZXhwb3J0QUVVWCcsIGRhdGE6IGZyYW1lQXJyIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW1hZ2VIYXNoTGlzdC5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZmV0Y2hBRVVYJywgZGF0YTogZnJhbWVBcnIgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdG9yZUltYWdlRGF0YShBcnJheS5mcm9tKG5ldyBTZXQoaW1hZ2VIYXNoTGlzdCkpLCBmcmFtZUFyciwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2ZsYXR0ZW5MYXllcnMnKSB7XG4gICAgICAgIGlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24ubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIG5vdGhpbmcgc2VsZWN0ZWRcbiAgICAgICAgLy8gbGV0IHNlbGVjdGlvbiA9IG5vZGVUb09iaihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pXG4gICAgICAgIGxldCBsYXllckNvdW50ID0gZmxhdHRlblJlY3Vyc2l2ZShmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24sIDApIHx8IDA7XG4gICAgICAgIC8vIHJlc2VsZWN0IGxheWVyc1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ2ZsYXR0ZW5lZCcsIGxheWVyQ291bnQgfSk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdyYXN0ZXJpemVTZWxlY3Rpb24nKSB7XG4gICAgICAgIGlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24ubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIG5vdGhpbmcgc2VsZWN0ZWRcbiAgICAgICAgLy8gbGV0IHNlbGVjdGlvbiA9IG5vZGVUb09iaihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pXG4gICAgICAgIGxldCBsYXllckNvdW50ID0gcmFzdGVyaXplU2VsZWN0aW9uKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiwgMCkgfHwgMDtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xheWVyQ291bnQnLCBsYXllckNvdW50KTtcbiAgICAgICAgLy8gcmVzZWxlY3QgbGF5ZXJzXG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZm9vdGVyTXNnJywgYWN0aW9uOiAncmFzdGVyaXplZCcsIGxheWVyQ291bnQgfSk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdkZXRhY2hDb21wb25lbnRzJykge1xuICAgICAgICBjb25zb2xlLmxvZygnZGV0YWNoQ29tcG9uZW50cycpO1xuICAgICAgICBsZXQgbGF5ZXJDb3VudCA9IDQ7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ2ZsYXR0ZW5lZCcsIGxheWVyQ291bnQgfSk7XG4gICAgfVxuICAgIC8vQ29tbXVuaWNhdGUgYmFjayB0byB0aGUgVUlcbiAgICAvLyBjb25zb2xlLmxvZygnc2VuZCBtZXNzYWdlIGJhY2sgdG8gdWknKTtcbn07XG5mdW5jdGlvbiBub2RlVG9PYmoobm9kZXMpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdub2RlcycsIG5vZGVzKTtcbiAgICBpZiAobm9kZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKG5vZGVzWzBdLnR5cGUpO1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICAvLyBsb29rIGZvciB0aGUgcGFyZW50IGZyYW1lIG9mIGV2ZXJ5dGhpbmcgZXhjZXB0IHJlZ3VsYXIgKG5vbi1hdXRvTGF5b3V0KSBmcmFtZXMgYW5kIGxvb3NlIGNvbXBvbmVudHNcbiAgICBpZiAobm9kZXNbMF0gJiYgKChub2Rlc1swXS50eXBlID09PSAnRlJBTUUnICYmIG5vZGVzWzBdLnBhcmVudC50eXBlID09PSAnUEFHRScpIHx8XG4gICAgICAgIC8vIChub2Rlc1swXS50eXBlID09PSAnRlJBTUUnICYmIG5vZGVzWzBdLmxheW91dE1vZGUgPT09ICdOT05FJykgfHwgXG4gICAgICAgIChub2Rlc1swXS50eXBlID09PSAnQ09NUE9ORU5UJyAmJiBub2Rlc1swXS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSkpIHsgLy8gYSBmcmFtZSBvciBhIGNvbXBvbmVudCBtYXN0ZXIgb3V0c2lkZSBvZiBhIGZyYW1lIGlzIGRpcmVjdGx5IHNlbGVjdGVkXG4gICAgICAgIGNvbnNvbGUubG9nKCdHT1QgQSBGUkFNRScpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhub2Rlc1swXS5jaGlsZHJlbik7XG4gICAgICAgIGhhc0ZyYW1lRGF0YSA9IHRydWU7IC8vIGRvbnQgbmVlZCB0byBnZXQgdGhlIGZyYW1lIGRhdGFcbiAgICAgICAgZnJhbWVBcnIucHVzaChnZXRFbGVtZW50KG5vZGVzWzBdLCBmYWxzZSkpO1xuICAgICAgICBub2RlcyA9IG5vZGVzWzBdLmNoaWxkcmVuO1xuICAgIH1cbiAgICAvLyBnZXQgc2hhcGVzIFxuICAgIGlmIChub2Rlcy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgLy8gZ2V0IHRoZSBmcmFtZSBkYXRhXG4gICAgICAgIGlmICghaGFzRnJhbWVEYXRhKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSAvLyBsYXllciBpcyBvdXRzaWRlIG9mIGEgZnJhbWUgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZ2V0IHRoZSBmcmFtZSBkYXRhJyk7XG4gICAgICAgICAgICBsZXQgZnJhbWUgPSBmaW5kRnJhbWUobm9kZSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZnJhbWU6JywgZnJhbWUpO1xuICAgICAgICAgICAgbGV0IGZyYW1lRGF0YSA9IGdldEVsZW1lbnQoZnJhbWUsIHRydWUpOyAvLyBza2lwIGdhdGhlcmluZyBjaGlsZHJlbiBkYXRhXG4gICAgICAgICAgICBmcmFtZURhdGEuY2hpbGRyZW4gPSBbXTsgLy8gY2xlYXIgdGhlIGNoaWxkcmVuIG9mIHRoZSBmcmFtZSB0byBwdXNoIHRoZW0gbGF0ZXJcbiAgICAgICAgICAgIGZyYW1lQXJyLnB1c2goZnJhbWVEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb2JqID0gZ2V0RWxlbWVudChub2RlLCBmYWxzZSk7XG4gICAgICAgIGFyci5wdXNoKG9iaik7XG4gICAgfSk7XG4gICAgLy8gY29uc29sZS5sb2coJ2FycjogJywgYXJyKTtcbiAgICByZXR1cm4gYXJyO1xuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnQobm9kZSwgc2tpcENoaWxkcmVuKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub2RlJywgbm9kZSk7XG4gICAgICAgIGxldCBvYmogPSB7XG4gICAgICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICB9O1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBub2RlKSB7XG4gICAgICAgICAgICBsZXQgZWxlbWVudCA9IG5vZGVba2V5XTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2NoaWxkcmVuJyAmJiAhc2tpcENoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IG5vZGVUb09iaihlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdiYWNrZ3JvdW5kcycpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gbm9kZVRvT2JqKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbGxzJyAmJiBlbGVtZW50Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb2xsZWN0SW1hZ2VIYXNoZXMoZWxlbWVudCwgbm9kZS5pZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb3JuZXIgcmFkaXVzXG4gICAgICAgICAgICBpZiAoZWxlbWVudCA9PSBmaWdtYS5taXhlZCAmJiBrZXkgPT09ICdjb3JuZXJSYWRpdXMnKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IE1hdGgubWluKG5vZGUudG9wTGVmdFJhZGl1cywgbm9kZS50b3BSaWdodFJhZGl1cywgbm9kZS5ib3R0b21MZWZ0UmFkaXVzLCBub2RlLmJvdHRvbVJpZ2h0UmFkaXVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIHRyeSB0byBnZXQgdGhlIGZpcnN0IHZhbHVlIG9uIHRoZSB0ZXh0XG4gICAgICAgICAgICBpZiAoZWxlbWVudCA9PSBmaWdtYS5taXhlZCkge1xuICAgICAgICAgICAgICAgIGxldCBzdHIgPSAnZ2V0UmFuZ2UnICsga2V5LnJlcGxhY2UoL15cXHcvLCBjID0+IGMudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG5vZGVbc3RyXSgwLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGxheWVyLmZvbnROYW1lICE9PSAoZmlnbWEubWl4ZWQpKSA/IGxheWVyLmZvbnROYW1lLmZhbWlseSA6IGxheWVyLmdldFJhbmdlRm9udE5hbWUoMCwxKS5mYW1pbHlcbiAgICAgICAgICAgIC8vIGlmIChrZXkgPT09ICdwYXJlbnQnKSB7IGNvbnNvbGUubG9nKGVsZW1lbnQpOyB9XG4gICAgICAgICAgICBvYmpba2V5XSA9IGVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgICAgLy8ga2VlcCB0cmFjayBvZiBBdXRvLWxheW91dCBmcmFtZXMgZm9yIGFsaWdubWVudCBvZiBjaGlsZHJlblxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnRlJBTUUnICYmIG5vZGUubGF5b3V0TW9kZSAhPT0gJ05PTkUnKSB7XG4gICAgICAgICAgICBvYmoudHlwZSA9ICdBVVRPTEFZT1VUJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb2xsZWN0SW1hZ2VIYXNoZXMoZWxlbWVudCwgaWQpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2ltYWdlSGFzaCcsIGlkLCBlbGVtZW50KTtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGwgPSBlbGVtZW50W2ldO1xuICAgICAgICAgICAgaWYgKGZpbGwudHlwZSA9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgaW1hZ2VIYXNoTGlzdC5wdXNoKHsgaGFzaDogZmlsbC5pbWFnZUhhc2gsIGlkIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc3RvcmVJbWFnZURhdGEoaW1hZ2VIYXNoTGlzdCwgbGF5ZXJzLCByZWZJbWcpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpbWFnZUhhc2hMaXN0KTtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIGltYWdlSGFzaExpc3QpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnRbaV0pO1xuICAgICAgICAgICAgY29uc3QgaGFzaCA9IGltYWdlSGFzaExpc3RbaV0uaGFzaDtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBpbWFnZUhhc2hMaXN0W2ldLmlkXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLzovZywgJy0nKSAvLyByZW1vdmUgY29sb25zXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xccyooXFwvfFxcXFwpXFxzKi9nLCAnLScpOyAvLyByZW1vdmUgc2xhc2hlc1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgaW1hZ2UgPSBmaWdtYS5nZXRJbWFnZUJ5SGFzaChoYXNoKTtcbiAgICAgICAgICAgICAgICBsZXQgYnl0ZXMgPSB5aWVsZCBpbWFnZS5nZXRCeXRlc0FzeW5jKCk7XG4gICAgICAgICAgICAgICAgaW1hZ2VCeXRlc0xpc3QucHVzaCh7IG5hbWUsIGJ5dGVzIH0pO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGJ5dGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikgeyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGltYWdlQnl0ZXNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2ZldGNoSW1hZ2VzQW5kQUVVWCcsIGltYWdlczogaW1hZ2VCeXRlc0xpc3QsIGRhdGE6IGxheWVycywgcmVmSW1nIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZmV0Y2hBRVVYJywgZGF0YTogbGF5ZXJzIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBmaW5kRnJhbWUobm9kZSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdub2RlOicsIG5vZGUpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdub2RlLnR5cGU6Jywgbm9kZS50eXBlKTtcbiAgICBpZiAoKG5vZGUudHlwZSAhPT0gJ0ZSQU1FJyAmJiAhKG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcgJiYgbm9kZS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSlcbiAgICAgICAgfHwgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2RlLmxheW91dE1vZGUgIT09ICdOT05FJylcbiAgICAgICAgfHwgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2RlLnBhcmVudC50eXBlID09PSAnRlJBTUUnKSkge1xuICAgICAgICAvLyBpZiAobm9kZS50eXBlICE9PSAnRlJBTUUnICYmIG5vZGUudHlwZSAhPT0gJ0NPTVBPTkVOVCcpIHtcbiAgICAgICAgcmV0dXJuIGZpbmRGcmFtZShub2RlLnBhcmVudCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBoYXNGcmFtZURhdGEgPSB0cnVlO1xuICAgICAgICByZXR1cm4gbm9kZTtcbiAgICB9XG59XG5mdW5jdGlvbiBmbGF0dGVuUmVjdXJzaXZlKHNlbGVjdGlvbiwgbGF5ZXJDb3VudCkge1xuICAgIHRyeSB7XG4gICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKHNoYXBlID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0cnkgZmxhdHRlbmluZycsIHNoYXBlKTtcbiAgICAgICAgICAgIGlmIChzaGFwZS50eXBlID09ICdCT09MRUFOX09QRVJBVElPTicpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS5mbGF0dGVuKFtzaGFwZV0pO1xuICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNoYXBlLmNvcm5lclJhZGl1cyA9PSBmaWdtYS5taXhlZCB8fCBzaGFwZS5jb3JuZXJSYWRpdXMgPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gZmxhdHRlbiByb3VuZGVkIGNvcm5lcnNcbiAgICAgICAgICAgICAgICBmaWdtYS5mbGF0dGVuKFtzaGFwZV0pO1xuICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNoYXBlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgbGF5ZXJDb3VudCA9IGZsYXR0ZW5SZWN1cnNpdmUoc2hhcGUuY2hpbGRyZW4sIGxheWVyQ291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHQgPSBzaGFwZS5yZWxhdGl2ZVRyYW5zZm9ybTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2hhcGUudHlwZScsIHNoYXBlLnR5cGUpO1xuICAgICAgICAgICAgICAgIC8vLyBjaGVjayBmb3IgdHJhbnNmb3Jtc1xuICAgICAgICAgICAgICAgIGlmICh0WzBdWzBdLnRvRml4ZWQoNikgIT0gMSB8fFxuICAgICAgICAgICAgICAgICAgICB0WzBdWzFdLnRvRml4ZWQoNikgIT0gMCB8fFxuICAgICAgICAgICAgICAgICAgICB0WzFdWzBdLnRvRml4ZWQoNikgIT0gMCB8fFxuICAgICAgICAgICAgICAgICAgICB0WzFdWzFdLnRvRml4ZWQoNikgIT0gMSB8fFxuICAgICAgICAgICAgICAgICAgICBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS5mbGF0dGVuKFtzaGFwZV0pO1xuICAgICAgICAgICAgICAgICAgICBsYXllckNvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNoYXBlLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oW3NoYXBlXSk7XG4gICAgICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbGF5ZXJDb3VudDtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGxheWVyQ291bnQ7XG4gICAgfVxufVxuZnVuY3Rpb24gcmFzdGVyaXplU2VsZWN0aW9uKHNlbGVjdGlvbiwgbGF5ZXJDb3VudCkge1xuICAgIHRyeSB7XG4gICAgICAgIGxldCBuZXdTZWxlY3Rpb24gPSBbXTtcbiAgICAgICAgc2VsZWN0aW9uLmZvckVhY2goc2hhcGUgPT4ge1xuICAgICAgICAgICAgaWYgKHNoYXBlLnR5cGUgPT0gJ0dST1VQJykge1xuICAgICAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFwiUE5HXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQ6IHsgdHlwZTogXCJTQ0FMRVwiLCB2YWx1ZTogNiB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBsZXQgc2hhcGVUcmFuc2Zvcm0gPSBzaGFwZS5yZWxhdGl2ZVRyYW5zZm9ybTsgLy8gc3RvcmUgdHJhbnNmb3JtXG4gICAgICAgICAgICAgICAgbGV0IHJlbW92ZVRyYW5zZm9ybSA9IFtbMSwgMCwgc2hhcGUueF0sIFswLCAxLCBzaGFwZS55XV07XG4gICAgICAgICAgICAgICAgc2hhcGUucmVsYXRpdmVUcmFuc2Zvcm0gPSByZW1vdmVUcmFuc2Zvcm07XG4gICAgICAgICAgICAgICAgc2hhcGUuZXhwb3J0QXN5bmMob3B0aW9ucylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oaW1nID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZmlnbWEuY3JlYXRlSW1hZ2UoaW1nKSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWN0ID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlLnBhcmVudC5hcHBlbmRDaGlsZChyZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdC54ID0gc2hhcGUueDtcbiAgICAgICAgICAgICAgICAgICAgcmVjdC55ID0gc2hhcGUueTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdC5yZWxhdGl2ZVRyYW5zZm9ybSA9IHNoYXBlVHJhbnNmb3JtO1xuICAgICAgICAgICAgICAgICAgICByZWN0Lm5hbWUgPSBzaGFwZS5uYW1lICsgJ19yYXN0ZXJpemUnO1xuICAgICAgICAgICAgICAgICAgICByZWN0LnJlc2l6ZShzaGFwZS53aWR0aCwgc2hhcGUuaGVpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGZpbGxPYmogPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHJlY3QuZmlsbHNbMF0pKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsbE9iai5maWx0ZXJzID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udHJhc3Q6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBleHBvc3VyZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodHM6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzYXR1cmF0aW9uOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93czogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGludDogMCxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZmlsbE9iai5pbWFnZUhhc2ggPSBmaWdtYS5jcmVhdGVJbWFnZShpbWcpLmhhc2g7XG4gICAgICAgICAgICAgICAgICAgIGZpbGxPYmouaW1hZ2VUcmFuc2Zvcm0gPSBbWzEsIDAsIDBdLCBbMCwgMSwgMF1dO1xuICAgICAgICAgICAgICAgICAgICBmaWxsT2JqLnNjYWxlTW9kZSA9IFwiQ1JPUFwiO1xuICAgICAgICAgICAgICAgICAgICBmaWxsT2JqLnR5cGUgPSBcIklNQUdFXCI7XG4gICAgICAgICAgICAgICAgICAgIGZpbGxPYmouc2NhbGluZ0ZhY3RvciA9IDAuNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSBmaWxsT2JqLmNvbG9yO1xuICAgICAgICAgICAgICAgICAgICByZWN0LmZpbGxzID0gW2ZpbGxPYmpdO1xuICAgICAgICAgICAgICAgICAgICBuZXdTZWxlY3Rpb24ucHVzaChyZWN0KTtcbiAgICAgICAgICAgICAgICAgICAgc2hhcGUucmVsYXRpdmVUcmFuc2Zvcm0gPSBzaGFwZVRyYW5zZm9ybTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBsYXllckNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHsgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gbmV3U2VsZWN0aW9uOyB9LCA1MCk7XG4gICAgICAgIHJldHVybiBsYXllckNvdW50O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICByZXR1cm4gbGF5ZXJDb3VudDtcbiAgICB9XG59XG5mdW5jdGlvbiBnZW5lcmF0ZUZyYW1lSW1hZ2UoKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBmaXJzdFNlbGVjdGVkID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdO1xuICAgICAgICAgICAgbGV0IHBhcmVudEZyYW1lID0gZmluZEZyYW1lKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXSk7XG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IFwiUE5HXCIsXG4gICAgICAgICAgICAgICAgY29uc3RyYWludDogeyB0eXBlOiBcIlNDQUxFXCIsIHZhbHVlOiA2IH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBwYXJlbnRGcmFtZS5leHBvcnRBc3luYyhvcHRpb25zKVxuICAgICAgICAgICAgICAgIC50aGVuKGltZyA9PiB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2hzYWRqZmhqa2Foc2RmJywgaW1nKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmlnbWEuY3JlYXRlSW1hZ2UoaW1nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0=