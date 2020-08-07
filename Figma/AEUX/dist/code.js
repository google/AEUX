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
let prefs = {};
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
            figma.ui.postMessage({ type: 'footerMsg', action: 'selected layers need to be inside of a frame', layerCount: null });
        }
        // if exportRefImage is enabled
        if (prefs.exportRefImage) { // include a reference image with transfer
            let parentFrame = findFrame(figma.currentPage.selection[0]);
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
                storeImageData(Array.from(new Set(imageHashList)), frameArr);
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
            let image = figma.getImageByHash(hash);
            let bytes = yield image.getBytesAsync();
            imageBytesList.push({ name, bytes });
            console.log(bytes);
        }
        figma.ui.postMessage({ type: 'fetchImagesAndAEUX', images: imageBytesList, data: layers, refImg });
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
                console.log('got a group');
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
                    let fillObj = {
                        blendMode: "NORMAL",
                        filters: {
                            contrast: 0,
                            exposure: 0,
                            highlights: 0,
                            saturation: 0,
                            shadows: 0,
                            temperature: 0,
                            tint: 0,
                        },
                        imageHash: figma.createImage(img).hash,
                        imageTransform: [[1, 0, 0], [0, 1, 0]],
                        opacity: 1,
                        scaleMode: "CROP",
                        scalingFactor: 0.5,
                        type: "IMAGE",
                        visible: true,
                    };
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
                console.log('hsadjfhjkahsdf', img);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLGlDQUFpQztBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsZ0RB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLFNBQVM7QUFDVCwwQkFBMEIsNENBQTRDLEVBQUU7QUFDeEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0wiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NvZGUudHNcIik7XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMTY2LCBoZWlnaHQ6IDE3NCB9KTtcbmxldCBoYXNGcmFtZURhdGE7XG5sZXQgZnJhbWVBcnIgPSBbXTtcbmxldCBpbWFnZUhhc2hMaXN0ID0gW107XG5sZXQgaW1hZ2VCeXRlc0xpc3QgPSBbXTtcbmxldCBwcmVmcyA9IHt9O1xuLy8gcmVjZWl2ZSBtZXNzYWdlIGZyb20gdGhlIFVJXG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtZXNzYWdlID0+IHtcbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnZ2V0UHJlZnMnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdnZXQgdGhvc2UgcHJlZnMnKTtcbiAgICAgICAgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYygnYWV1eC5wcmVmcycpXG4gICAgICAgICAgICAudGhlbihwcmVmcyA9PiB7XG4gICAgICAgICAgICBpZiAocHJlZnMpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdyZXRQcmVmcycsIHByZWZzOiBwcmVmcyB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZ290dGEgc2F2ZSBuZXcgcHJlZnMnLCBtZXNzYWdlLmRlZmF1bHRQcmVmcyk7XG4gICAgICAgICAgICAgICAgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygnYWV1eC5wcmVmcycsIG1lc3NhZ2UuZGVmYXVsdFByZWZzKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3JldFByZWZzJywgcHJlZnM6IG1lc3NhZ2UuZGVmYXVsdFByZWZzIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlLmRlZmF1bHRQcmVmcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHVzZXJQcmVmcyA9PiB7XG4gICAgICAgICAgICBwcmVmcyA9IHVzZXJQcmVmcztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdzZXRQcmVmcycpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3NhdmUgdGhvc2UgcHJlZnMnLCBtZXNzYWdlLnByZWZzKTtcbiAgICAgICAgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygnYWV1eC5wcmVmcycsIG1lc3NhZ2UucHJlZnMpXG4gICAgICAgICAgICAudGhlbihyZXQgPT4ge1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UobWVzc2FnZS5wcmVmcyk7XG4gICAgICAgICAgICBwcmVmcyA9IG1lc3NhZ2UucHJlZnM7IC8vIHN0b3JlIHRoZSBwcmVmcyBsb2NhbGx5XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnZXhwb3J0U2VsZWN0aW9uJykge1xuICAgICAgICBoYXNGcmFtZURhdGEgPSBmYWxzZTtcbiAgICAgICAgZnJhbWVBcnIgPSBbXTtcbiAgICAgICAgaW1hZ2VIYXNoTGlzdCA9IFtdO1xuICAgICAgICBpbWFnZUJ5dGVzTGlzdCA9IFtdO1xuICAgICAgICBsZXQgZXhwb3J0SlNPTiA9IGZhbHNlO1xuICAgICAgICBpZiAobWVzc2FnZS5leHBvcnRKU09OKSB7XG4gICAgICAgICAgICBleHBvcnRKU09OID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHsgLy8gbm90aGluZyBzZWxlY3RlZFxuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZmV0Y2hBRVVYJywgZGF0YTogbnVsbCB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbiA9IG5vZGVUb09iaihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgaWYgKGZyYW1lQXJyWzBdLmNoaWxkcmVuLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICBmcmFtZUFyclswXS5jaGlsZHJlbiA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmcmFtZUFycjogJywgZnJhbWVBcnIpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdGVkIGxheWVycyBuZWVkIHRvIGJlIGluc2lkZSBvZiBhIGZyYW1lJyk7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdzZWxlY3RlZCBsYXllcnMgbmVlZCB0byBiZSBpbnNpZGUgb2YgYSBmcmFtZScsIGxheWVyQ291bnQ6IG51bGwgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgZXhwb3J0UmVmSW1hZ2UgaXMgZW5hYmxlZFxuICAgICAgICBpZiAocHJlZnMuZXhwb3J0UmVmSW1hZ2UpIHsgLy8gaW5jbHVkZSBhIHJlZmVyZW5jZSBpbWFnZSB3aXRoIHRyYW5zZmVyXG4gICAgICAgICAgICBsZXQgcGFyZW50RnJhbWUgPSBmaW5kRnJhbWUoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdKTtcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGZvcm1hdDogXCJQTkdcIixcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7IHR5cGU6IFwiU0NBTEVcIiwgdmFsdWU6IDYgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHBhcmVudEZyYW1lLmV4cG9ydEFzeW5jKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLnRoZW4oaW1nID0+IHtcbiAgICAgICAgICAgICAgICBpbWFnZUhhc2hMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICBoYXNoOiBmaWdtYS5jcmVhdGVJbWFnZShpbWcpLmhhc2gsXG4gICAgICAgICAgICAgICAgICAgIGlkOiBwYXJlbnRGcmFtZS5uYW1lICsgJ19yZWZlcmVuY2UnIC8vLyB4eHggbmVlZCBhbiBpbWFnZSBuYW1lXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgLy8gbmVlZHMgdG8gZXhwb3J0IGltYWdlcyB0aGVuIHNlbmQgdG8gdWkudHNcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwYXJlbnRGcmFtZU5hbWUgPSBwYXJlbnRGcmFtZS5uYW1lLnJlcGxhY2UoL1xccyooXFwvfFxcXFwpXFxzKi9nLCAnLScpO1xuICAgICAgICAgICAgICAgIGxldCByZWZJbWcgPSB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdJbWFnZScsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHBhcmVudEZyYW1lTmFtZSArICdfcmVmZXJlbmNlJyxcbiAgICAgICAgICAgICAgICAgICAgaWQ6IHBhcmVudEZyYW1lTmFtZSArICdfcmVmZXJlbmNlJyxcbiAgICAgICAgICAgICAgICAgICAgZnJhbWU6IHsgeDogcGFyZW50RnJhbWUud2lkdGggLyAyLCB5OiBwYXJlbnRGcmFtZS5oZWlnaHQgLyAyLCB3aWR0aDogcGFyZW50RnJhbWUud2lkdGgsIGhlaWdodDogcGFyZW50RnJhbWUuaGVpZ2h0IH0sXG4gICAgICAgICAgICAgICAgICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogNTAsXG4gICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZTogJ0JsZW5kaW5nTW9kZS5OT1JNQUwnLFxuICAgICAgICAgICAgICAgICAgICBpc01hc2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgICAgICAgICAgICAgZ3VpZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzdG9yZUltYWdlRGF0YShBcnJheS5mcm9tKG5ldyBTZXQoaW1hZ2VIYXNoTGlzdCkpLCBmcmFtZUFyciwgcmVmSW1nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgaW1hZ2VzIG5lZWQgdG8gZXhwb3J0IHRoZW4gc2VuZCBtZXNzYWdlIHRvIHVpLnRzXG4gICAgICAgICAgICBpZiAoZXhwb3J0SlNPTikge1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2V4cG9ydEFFVVgnLCBkYXRhOiBmcmFtZUFyciB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGltYWdlSGFzaExpc3QubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2ZldGNoQUVVWCcsIGRhdGE6IGZyYW1lQXJyIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RvcmVJbWFnZURhdGEoQXJyYXkuZnJvbShuZXcgU2V0KGltYWdlSGFzaExpc3QpKSwgZnJhbWVBcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdmbGF0dGVuTGF5ZXJzJykge1xuICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBub3RoaW5nIHNlbGVjdGVkXG4gICAgICAgIC8vIGxldCBzZWxlY3Rpb24gPSBub2RlVG9PYmooZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKVxuICAgICAgICBsZXQgbGF5ZXJDb3VudCA9IGZsYXR0ZW5SZWN1cnNpdmUoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLCAwKSB8fCAwO1xuICAgICAgICAvLyByZXNlbGVjdCBsYXllcnNcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdmbGF0dGVuZWQnLCBsYXllckNvdW50IH0pO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAncmFzdGVyaXplU2VsZWN0aW9uJykge1xuICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBub3RoaW5nIHNlbGVjdGVkXG4gICAgICAgIC8vIGxldCBzZWxlY3Rpb24gPSBub2RlVG9PYmooZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKVxuICAgICAgICBsZXQgbGF5ZXJDb3VudCA9IHJhc3Rlcml6ZVNlbGVjdGlvbihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24sIDApIHx8IDA7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsYXllckNvdW50JywgbGF5ZXJDb3VudCk7XG4gICAgICAgIC8vIHJlc2VsZWN0IGxheWVyc1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ3Jhc3Rlcml6ZWQnLCBsYXllckNvdW50IH0pO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnZGV0YWNoQ29tcG9uZW50cycpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2RldGFjaENvbXBvbmVudHMnKTtcbiAgICAgICAgbGV0IGxheWVyQ291bnQgPSA0O1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdmbGF0dGVuZWQnLCBsYXllckNvdW50IH0pO1xuICAgIH1cbiAgICAvL0NvbW11bmljYXRlIGJhY2sgdG8gdGhlIFVJXG4gICAgLy8gY29uc29sZS5sb2coJ3NlbmQgbWVzc2FnZSBiYWNrIHRvIHVpJyk7XG59O1xuZnVuY3Rpb24gbm9kZVRvT2JqKG5vZGVzKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnbm9kZXMnLCBub2Rlcyk7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhub2Rlc1swXS50eXBlKTtcbiAgICBsZXQgYXJyID0gW107XG4gICAgLy8gbG9vayBmb3IgdGhlIHBhcmVudCBmcmFtZSBvZiBldmVyeXRoaW5nIGV4Y2VwdCByZWd1bGFyIChub24tYXV0b0xheW91dCkgZnJhbWVzIGFuZCBsb29zZSBjb21wb25lbnRzXG4gICAgaWYgKG5vZGVzWzBdICYmICgobm9kZXNbMF0udHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2Rlc1swXS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSB8fFxuICAgICAgICAvLyAobm9kZXNbMF0udHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2Rlc1swXS5sYXlvdXRNb2RlID09PSAnTk9ORScpIHx8IFxuICAgICAgICAobm9kZXNbMF0udHlwZSA9PT0gJ0NPTVBPTkVOVCcgJiYgbm9kZXNbMF0ucGFyZW50LnR5cGUgPT09ICdQQUdFJykpKSB7IC8vIGEgZnJhbWUgb3IgYSBjb21wb25lbnQgbWFzdGVyIG91dHNpZGUgb2YgYSBmcmFtZSBpcyBkaXJlY3RseSBzZWxlY3RlZFxuICAgICAgICBjb25zb2xlLmxvZygnR09UIEEgRlJBTUUnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobm9kZXNbMF0uY2hpbGRyZW4pO1xuICAgICAgICBoYXNGcmFtZURhdGEgPSB0cnVlOyAvLyBkb250IG5lZWQgdG8gZ2V0IHRoZSBmcmFtZSBkYXRhXG4gICAgICAgIGZyYW1lQXJyLnB1c2goZ2V0RWxlbWVudChub2Rlc1swXSwgZmFsc2UpKTtcbiAgICAgICAgbm9kZXMgPSBub2Rlc1swXS5jaGlsZHJlbjtcbiAgICB9XG4gICAgLy8gZ2V0IHNoYXBlcyBcbiAgICBpZiAobm9kZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgIC8vIGdldCB0aGUgZnJhbWUgZGF0YVxuICAgICAgICBpZiAoIWhhc0ZyYW1lRGF0YSkge1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50LnR5cGUgPT09ICdQQUdFJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gLy8gbGF5ZXIgaXMgb3V0c2lkZSBvZiBhIGZyYW1lIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2dldCB0aGUgZnJhbWUgZGF0YScpO1xuICAgICAgICAgICAgbGV0IGZyYW1lID0gZmluZEZyYW1lKG5vZGUpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZyYW1lOicsIGZyYW1lKTtcbiAgICAgICAgICAgIGxldCBmcmFtZURhdGEgPSBnZXRFbGVtZW50KGZyYW1lLCB0cnVlKTsgLy8gc2tpcCBnYXRoZXJpbmcgY2hpbGRyZW4gZGF0YVxuICAgICAgICAgICAgZnJhbWVEYXRhLmNoaWxkcmVuID0gW107IC8vIGNsZWFyIHRoZSBjaGlsZHJlbiBvZiB0aGUgZnJhbWUgdG8gcHVzaCB0aGVtIGxhdGVyXG4gICAgICAgICAgICBmcmFtZUFyci5wdXNoKGZyYW1lRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9iaiA9IGdldEVsZW1lbnQobm9kZSwgZmFsc2UpO1xuICAgICAgICBhcnIucHVzaChvYmopO1xuICAgIH0pO1xuICAgIC8vIGNvbnNvbGUubG9nKCdhcnI6ICcsIGFycik7XG4gICAgcmV0dXJuIGFycjtcbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50KG5vZGUsIHNraXBDaGlsZHJlbikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbm9kZScsIG5vZGUpO1xuICAgICAgICBsZXQgb2JqID0ge1xuICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbm9kZSkge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBub2RlW2tleV07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdjaGlsZHJlbicgJiYgIXNraXBDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBub2RlVG9PYmooZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnYmFja2dyb3VuZHMnKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IG5vZGVUb09iaihlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdmaWxscycgJiYgZWxlbWVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29sbGVjdEltYWdlSGFzaGVzKGVsZW1lbnQsIG5vZGUuaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29ybmVyIHJhZGl1c1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT0gZmlnbWEubWl4ZWQgJiYga2V5ID09PSAnY29ybmVyUmFkaXVzJykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBNYXRoLm1pbihub2RlLnRvcExlZnRSYWRpdXMsIG5vZGUudG9wUmlnaHRSYWRpdXMsIG5vZGUuYm90dG9tTGVmdFJhZGl1cywgbm9kZS5ib3R0b21SaWdodFJhZGl1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0cnkgdG8gZ2V0IHRoZSBmaXJzdCB2YWx1ZSBvbiB0aGUgdGV4dFxuICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT0gZmlnbWEubWl4ZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RyID0gJ2dldFJhbmdlJyArIGtleS5yZXBsYWNlKC9eXFx3LywgYyA9PiBjLnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBub2RlW3N0cl0oMCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBsYXllci5mb250TmFtZSAhPT0gKGZpZ21hLm1peGVkKSkgPyBsYXllci5mb250TmFtZS5mYW1pbHkgOiBsYXllci5nZXRSYW5nZUZvbnROYW1lKDAsMSkuZmFtaWx5XG4gICAgICAgICAgICAvLyBpZiAoa2V5ID09PSAncGFyZW50JykgeyBjb25zb2xlLmxvZyhlbGVtZW50KTsgfVxuICAgICAgICAgICAgb2JqW2tleV0gPSBlbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgQXV0by1sYXlvdXQgZnJhbWVzIGZvciBhbGlnbm1lbnQgb2YgY2hpbGRyZW5cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2RlLmxheW91dE1vZGUgIT09ICdOT05FJykge1xuICAgICAgICAgICAgb2JqLnR5cGUgPSAnQVVUT0xBWU9VVCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29sbGVjdEltYWdlSGFzaGVzKGVsZW1lbnQsIGlkKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbWFnZUhhc2gnLCBpZCwgZWxlbWVudCk7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBlbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBmaWxsID0gZWxlbWVudFtpXTtcbiAgICAgICAgICAgIGlmIChmaWxsLnR5cGUgPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIGltYWdlSGFzaExpc3QucHVzaCh7IGhhc2g6IGZpbGwuaW1hZ2VIYXNoLCBpZCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHN0b3JlSW1hZ2VEYXRhKGltYWdlSGFzaExpc3QsIGxheWVycywgcmVmSW1nKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coaW1hZ2VIYXNoTGlzdCk7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBpbWFnZUhhc2hMaXN0KSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50W2ldKTtcbiAgICAgICAgICAgIGNvbnN0IGhhc2ggPSBpbWFnZUhhc2hMaXN0W2ldLmhhc2g7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gaW1hZ2VIYXNoTGlzdFtpXS5pZFxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC86L2csICctJykgLy8gcmVtb3ZlIGNvbG9uc1xuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHMqKFxcL3xcXFxcKVxccyovZywgJy0nKTsgLy8gcmVtb3ZlIHNsYXNoZXNcbiAgICAgICAgICAgIGxldCBpbWFnZSA9IGZpZ21hLmdldEltYWdlQnlIYXNoKGhhc2gpO1xuICAgICAgICAgICAgbGV0IGJ5dGVzID0geWllbGQgaW1hZ2UuZ2V0Qnl0ZXNBc3luYygpO1xuICAgICAgICAgICAgaW1hZ2VCeXRlc0xpc3QucHVzaCh7IG5hbWUsIGJ5dGVzIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYnl0ZXMpO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2ZldGNoSW1hZ2VzQW5kQUVVWCcsIGltYWdlczogaW1hZ2VCeXRlc0xpc3QsIGRhdGE6IGxheWVycywgcmVmSW1nIH0pO1xuICAgIH0pO1xufVxuZnVuY3Rpb24gZmluZEZyYW1lKG5vZGUpIHtcbiAgICAvLyBjb25zb2xlLmxvZygnbm9kZTonLCBub2RlKTtcbiAgICAvLyBjb25zb2xlLmxvZygnbm9kZS50eXBlOicsIG5vZGUudHlwZSk7XG4gICAgaWYgKChub2RlLnR5cGUgIT09ICdGUkFNRScgJiYgIShub2RlLnR5cGUgPT09ICdDT01QT05FTlQnICYmIG5vZGUucGFyZW50LnR5cGUgPT09ICdQQUdFJykpXG4gICAgICAgIHx8IChub2RlLnR5cGUgPT09ICdGUkFNRScgJiYgbm9kZS5sYXlvdXRNb2RlICE9PSAnTk9ORScpXG4gICAgICAgIHx8IChub2RlLnR5cGUgPT09ICdGUkFNRScgJiYgbm9kZS5wYXJlbnQudHlwZSA9PT0gJ0ZSQU1FJykpIHtcbiAgICAgICAgLy8gaWYgKG5vZGUudHlwZSAhPT0gJ0ZSQU1FJyAmJiBub2RlLnR5cGUgIT09ICdDT01QT05FTlQnKSB7XG4gICAgICAgIHJldHVybiBmaW5kRnJhbWUobm9kZS5wYXJlbnQpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaGFzRnJhbWVEYXRhID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxufVxuZnVuY3Rpb24gZmxhdHRlblJlY3Vyc2l2ZShzZWxlY3Rpb24sIGxheWVyQ291bnQpIHtcbiAgICB0cnkge1xuICAgICAgICBzZWxlY3Rpb24uZm9yRWFjaChzaGFwZSA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygndHJ5IGZsYXR0ZW5pbmcnLCBzaGFwZSk7XG4gICAgICAgICAgICBpZiAoc2hhcGUudHlwZSA9PSAnQk9PTEVBTl9PUEVSQVRJT04nKSB7XG4gICAgICAgICAgICAgICAgZmlnbWEuZmxhdHRlbihbc2hhcGVdKTtcbiAgICAgICAgICAgICAgICBsYXllckNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzaGFwZS5jb3JuZXJSYWRpdXMgPT0gZmlnbWEubWl4ZWQgfHwgc2hhcGUuY29ybmVyUmFkaXVzID4gMCkge1xuICAgICAgICAgICAgICAgIC8vIGZsYXR0ZW4gcm91bmRlZCBjb3JuZXJzXG4gICAgICAgICAgICAgICAgZmlnbWEuZmxhdHRlbihbc2hhcGVdKTtcbiAgICAgICAgICAgICAgICBsYXllckNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChzaGFwZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGxheWVyQ291bnQgPSBmbGF0dGVuUmVjdXJzaXZlKHNoYXBlLmNoaWxkcmVuLCBsYXllckNvdW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCB0ID0gc2hhcGUucmVsYXRpdmVUcmFuc2Zvcm07XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NoYXBlLnR5cGUnLCBzaGFwZS50eXBlKTtcbiAgICAgICAgICAgICAgICAvLy8gY2hlY2sgZm9yIHRyYW5zZm9ybXNcbiAgICAgICAgICAgICAgICBpZiAodFswXVswXS50b0ZpeGVkKDYpICE9IDEgfHxcbiAgICAgICAgICAgICAgICAgICAgdFswXVsxXS50b0ZpeGVkKDYpICE9IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgdFsxXVswXS50b0ZpeGVkKDYpICE9IDAgfHxcbiAgICAgICAgICAgICAgICAgICAgdFsxXVsxXS50b0ZpeGVkKDYpICE9IDEgfHxcbiAgICAgICAgICAgICAgICAgICAgZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEuZmxhdHRlbihbc2hhcGVdKTtcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIGlmIChzaGFwZS50eXBlID09ICdURVhUJykge1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS5mbGF0dGVuKFtzaGFwZV0pO1xuICAgICAgICAgICAgICAgICAgICBsYXllckNvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgcmV0dXJuIGxheWVyQ291bnQ7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIHJldHVybiBsYXllckNvdW50O1xuICAgIH1cbn1cbmZ1bmN0aW9uIHJhc3Rlcml6ZVNlbGVjdGlvbihzZWxlY3Rpb24sIGxheWVyQ291bnQpIHtcbiAgICB0cnkge1xuICAgICAgICBsZXQgbmV3U2VsZWN0aW9uID0gW107XG4gICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKHNoYXBlID0+IHtcbiAgICAgICAgICAgIGlmIChzaGFwZS50eXBlID09ICdHUk9VUCcpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZ290IGEgZ3JvdXAnKTtcbiAgICAgICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcIlBOR1wiLFxuICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7IHR5cGU6IFwiU0NBTEVcIiwgdmFsdWU6IDYgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGV0IHNoYXBlVHJhbnNmb3JtID0gc2hhcGUucmVsYXRpdmVUcmFuc2Zvcm07IC8vIHN0b3JlIHRyYW5zZm9ybVxuICAgICAgICAgICAgICAgIGxldCByZW1vdmVUcmFuc2Zvcm0gPSBbWzEsIDAsIHNoYXBlLnhdLCBbMCwgMSwgc2hhcGUueV1dO1xuICAgICAgICAgICAgICAgIHNoYXBlLnJlbGF0aXZlVHJhbnNmb3JtID0gcmVtb3ZlVHJhbnNmb3JtO1xuICAgICAgICAgICAgICAgIHNoYXBlLmV4cG9ydEFzeW5jKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGltZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZpZ21hLmNyZWF0ZUltYWdlKGltZykpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjdCA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xuICAgICAgICAgICAgICAgICAgICBzaGFwZS5wYXJlbnQuYXBwZW5kQ2hpbGQocmVjdCk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3QueCA9IHNoYXBlLng7XG4gICAgICAgICAgICAgICAgICAgIHJlY3QueSA9IHNoYXBlLnk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3QucmVsYXRpdmVUcmFuc2Zvcm0gPSBzaGFwZVRyYW5zZm9ybTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdC5uYW1lID0gc2hhcGUubmFtZSArICdfcmFzdGVyaXplJztcbiAgICAgICAgICAgICAgICAgICAgcmVjdC5yZXNpemUoc2hhcGUud2lkdGgsIHNoYXBlLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWxsT2JqID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgYmxlbmRNb2RlOiBcIk5PUk1BTFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyYXN0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9zdXJlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhpZ2hsaWdodHM6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2F0dXJhdGlvbjogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dzOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpbnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VIYXNoOiBmaWdtYS5jcmVhdGVJbWFnZShpbWcpLmhhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZVRyYW5zZm9ybTogW1sxLCAwLCAwXSwgWzAsIDEsIDBdXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgICAgICAgICAgICAgICAgICBzY2FsZU1vZGU6IFwiQ1JPUFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGluZ0ZhY3RvcjogMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJJTUFHRVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdC5maWxscyA9IFtmaWxsT2JqXTtcbiAgICAgICAgICAgICAgICAgICAgbmV3U2VsZWN0aW9uLnB1c2gocmVjdCk7XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlLnJlbGF0aXZlVHJhbnNmb3JtID0gc2hhcGVUcmFuc2Zvcm07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5ld1NlbGVjdGlvbjsgfSwgNTApO1xuICAgICAgICByZXR1cm4gbGF5ZXJDb3VudDtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGxheWVyQ291bnQ7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2VuZXJhdGVGcmFtZUltYWdlKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgZmlyc3RTZWxlY3RlZCA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICAgICAgICAgIGxldCBwYXJlbnRGcmFtZSA9IGZpbmRGcmFtZShmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0pO1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiBcIlBOR1wiLFxuICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQ6IHsgdHlwZTogXCJTQ0FMRVwiLCB2YWx1ZTogNiB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcGFyZW50RnJhbWUuZXhwb3J0QXN5bmMob3B0aW9ucylcbiAgICAgICAgICAgICAgICAudGhlbihpbWcgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdoc2FkamZoamthaHNkZicsIGltZyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpZ21hLmNyZWF0ZUltYWdlKGltZyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9