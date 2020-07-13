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
                let refImg = {
                    type: 'Image',
                    name: parentFrame.name + '_reference',
                    id: parentFrame.name + '_reference',
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
            const name = imageHashList[i].id.replace(/:/g, '-');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLGlDQUFpQztBQUN2RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsZ0RB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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsMEJBQTBCLDRDQUE0QyxFQUFFO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb2RlLnRzXCIpO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDE2NiwgaGVpZ2h0OiAxNzQgfSk7XG5sZXQgaGFzRnJhbWVEYXRhO1xubGV0IGZyYW1lQXJyID0gW107XG5sZXQgaW1hZ2VIYXNoTGlzdCA9IFtdO1xubGV0IGltYWdlQnl0ZXNMaXN0ID0gW107XG5sZXQgcHJlZnMgPSB7fTtcbi8vIHJlY2VpdmUgbWVzc2FnZSBmcm9tIHRoZSBVSVxuZmlnbWEudWkub25tZXNzYWdlID0gbWVzc2FnZSA9PiB7XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2dldFByZWZzJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnZ2V0IHRob3NlIHByZWZzJyk7XG4gICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoJ2FldXgucHJlZnMnKVxuICAgICAgICAgICAgLnRoZW4ocHJlZnMgPT4ge1xuICAgICAgICAgICAgaWYgKHByZWZzKSB7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAncmV0UHJlZnMnLCBwcmVmczogcHJlZnMgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZWZzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2dvdHRhIHNhdmUgbmV3IHByZWZzJywgbWVzc2FnZS5kZWZhdWx0UHJlZnMpO1xuICAgICAgICAgICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ2FldXgucHJlZnMnLCBtZXNzYWdlLmRlZmF1bHRQcmVmcylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdyZXRQcmVmcycsIHByZWZzOiBtZXNzYWdlLmRlZmF1bHRQcmVmcyB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZS5kZWZhdWx0UHJlZnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbih1c2VyUHJlZnMgPT4ge1xuICAgICAgICAgICAgcHJlZnMgPSB1c2VyUHJlZnM7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnc2V0UHJlZnMnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzYXZlIHRob3NlIHByZWZzJywgbWVzc2FnZS5wcmVmcyk7XG4gICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ2FldXgucHJlZnMnLCBtZXNzYWdlLnByZWZzKVxuICAgICAgICAgICAgLnRoZW4ocmV0ID0+IHtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKG1lc3NhZ2UucHJlZnMpO1xuICAgICAgICAgICAgcHJlZnMgPSBtZXNzYWdlLnByZWZzOyAvLyBzdG9yZSB0aGUgcHJlZnMgbG9jYWxseVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2V4cG9ydFNlbGVjdGlvbicpIHtcbiAgICAgICAgaGFzRnJhbWVEYXRhID0gZmFsc2U7XG4gICAgICAgIGZyYW1lQXJyID0gW107XG4gICAgICAgIGltYWdlSGFzaExpc3QgPSBbXTtcbiAgICAgICAgaW1hZ2VCeXRlc0xpc3QgPSBbXTtcbiAgICAgICAgbGV0IGV4cG9ydEpTT04gPSBmYWxzZTtcbiAgICAgICAgaWYgKG1lc3NhZ2UuZXhwb3J0SlNPTikge1xuICAgICAgICAgICAgZXhwb3J0SlNPTiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5sZW5ndGggPCAxKSB7IC8vIG5vdGhpbmcgc2VsZWN0ZWRcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2ZldGNoQUVVWCcsIGRhdGE6IG51bGwgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb24gPSBub2RlVG9PYmooZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIGlmIChmcmFtZUFyclswXS5jaGlsZHJlbi5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgZnJhbWVBcnJbMF0uY2hpbGRyZW4gPSBzZWxlY3Rpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZnJhbWVBcnI6ICcsIGZyYW1lQXJyKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3RlZCBsYXllcnMgbmVlZCB0byBiZSBpbnNpZGUgb2YgYSBmcmFtZScpO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZm9vdGVyTXNnJywgYWN0aW9uOiAnc2VsZWN0ZWQgbGF5ZXJzIG5lZWQgdG8gYmUgaW5zaWRlIG9mIGEgZnJhbWUnLCBsYXllckNvdW50OiBudWxsIH0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIGlmIGV4cG9ydFJlZkltYWdlIGlzIGVuYWJsZWRcbiAgICAgICAgaWYgKHByZWZzLmV4cG9ydFJlZkltYWdlKSB7IC8vIGluY2x1ZGUgYSByZWZlcmVuY2UgaW1hZ2Ugd2l0aCB0cmFuc2ZlclxuICAgICAgICAgICAgbGV0IHBhcmVudEZyYW1lID0gZmluZEZyYW1lKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXSk7XG4gICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICBmb3JtYXQ6IFwiUE5HXCIsXG4gICAgICAgICAgICAgICAgY29uc3RyYWludDogeyB0eXBlOiBcIlNDQUxFXCIsIHZhbHVlOiA2IH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICBwYXJlbnRGcmFtZS5leHBvcnRBc3luYyhvcHRpb25zKVxuICAgICAgICAgICAgICAgIC50aGVuKGltZyA9PiB7XG4gICAgICAgICAgICAgICAgaW1hZ2VIYXNoTGlzdC5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgaGFzaDogZmlnbWEuY3JlYXRlSW1hZ2UoaW1nKS5oYXNoLFxuICAgICAgICAgICAgICAgICAgICBpZDogcGFyZW50RnJhbWUubmFtZSArICdfcmVmZXJlbmNlJyAvLy8geHh4IG5lZWQgYW4gaW1hZ2UgbmFtZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIC8vIG5lZWRzIHRvIGV4cG9ydCBpbWFnZXMgdGhlbiBzZW5kIHRvIHVpLnRzXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVmSW1nID0ge1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnSW1hZ2UnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lOiBwYXJlbnRGcmFtZS5uYW1lICsgJ19yZWZlcmVuY2UnLFxuICAgICAgICAgICAgICAgICAgICBpZDogcGFyZW50RnJhbWUubmFtZSArICdfcmVmZXJlbmNlJyxcbiAgICAgICAgICAgICAgICAgICAgZnJhbWU6IHsgeDogcGFyZW50RnJhbWUud2lkdGggLyAyLCB5OiBwYXJlbnRGcmFtZS5oZWlnaHQgLyAyLCB3aWR0aDogcGFyZW50RnJhbWUud2lkdGgsIGhlaWdodDogcGFyZW50RnJhbWUuaGVpZ2h0IH0sXG4gICAgICAgICAgICAgICAgICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgb3BhY2l0eTogNTAsXG4gICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZTogJ0JsZW5kaW5nTW9kZS5OT1JNQUwnLFxuICAgICAgICAgICAgICAgICAgICBpc01hc2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgICAgICAgICAgICAgZ3VpZGU6IHRydWUsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBzdG9yZUltYWdlRGF0YShBcnJheS5mcm9tKG5ldyBTZXQoaW1hZ2VIYXNoTGlzdCkpLCBmcmFtZUFyciwgcmVmSW1nKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgaW1hZ2VzIG5lZWQgdG8gZXhwb3J0IHRoZW4gc2VuZCBtZXNzYWdlIHRvIHVpLnRzXG4gICAgICAgICAgICBpZiAoZXhwb3J0SlNPTikge1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2V4cG9ydEFFVVgnLCBkYXRhOiBmcmFtZUFyciB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGltYWdlSGFzaExpc3QubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2ZldGNoQUVVWCcsIGRhdGE6IGZyYW1lQXJyIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RvcmVJbWFnZURhdGEoQXJyYXkuZnJvbShuZXcgU2V0KGltYWdlSGFzaExpc3QpKSwgZnJhbWVBcnIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdmbGF0dGVuTGF5ZXJzJykge1xuICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBub3RoaW5nIHNlbGVjdGVkXG4gICAgICAgIC8vIGxldCBzZWxlY3Rpb24gPSBub2RlVG9PYmooZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKVxuICAgICAgICBsZXQgbGF5ZXJDb3VudCA9IGZsYXR0ZW5SZWN1cnNpdmUoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLCAwKSB8fCAwO1xuICAgICAgICAvLyByZXNlbGVjdCBsYXllcnNcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdmbGF0dGVuZWQnLCBsYXllckNvdW50IH0pO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAncmFzdGVyaXplU2VsZWN0aW9uJykge1xuICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBub3RoaW5nIHNlbGVjdGVkXG4gICAgICAgIC8vIGxldCBzZWxlY3Rpb24gPSBub2RlVG9PYmooZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKVxuICAgICAgICBsZXQgbGF5ZXJDb3VudCA9IHJhc3Rlcml6ZVNlbGVjdGlvbihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24sIDApIHx8IDA7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdsYXllckNvdW50JywgbGF5ZXJDb3VudCk7XG4gICAgICAgIC8vIHJlc2VsZWN0IGxheWVyc1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ3Jhc3Rlcml6ZWQnLCBsYXllckNvdW50IH0pO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnZGV0YWNoQ29tcG9uZW50cycpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2RldGFjaENvbXBvbmVudHMnKTtcbiAgICAgICAgbGV0IGxheWVyQ291bnQgPSA0O1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdmbGF0dGVuZWQnLCBsYXllckNvdW50IH0pO1xuICAgIH1cbiAgICAvL0NvbW11bmljYXRlIGJhY2sgdG8gdGhlIFVJXG4gICAgLy8gY29uc29sZS5sb2coJ3NlbmQgbWVzc2FnZSBiYWNrIHRvIHVpJyk7XG59O1xuZnVuY3Rpb24gbm9kZVRvT2JqKG5vZGVzKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnbm9kZXMnLCBub2Rlcyk7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhub2Rlc1swXS50eXBlKTtcbiAgICBsZXQgYXJyID0gW107XG4gICAgLy8gbG9vayBmb3IgdGhlIHBhcmVudCBmcmFtZSBvZiBldmVyeXRoaW5nIGV4Y2VwdCByZWd1bGFyIChub24tYXV0b0xheW91dCkgZnJhbWVzIGFuZCBsb29zZSBjb21wb25lbnRzXG4gICAgaWYgKG5vZGVzWzBdICYmICgobm9kZXNbMF0udHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2Rlc1swXS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSB8fFxuICAgICAgICAvLyAobm9kZXNbMF0udHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2Rlc1swXS5sYXlvdXRNb2RlID09PSAnTk9ORScpIHx8IFxuICAgICAgICAobm9kZXNbMF0udHlwZSA9PT0gJ0NPTVBPTkVOVCcgJiYgbm9kZXNbMF0ucGFyZW50LnR5cGUgPT09ICdQQUdFJykpKSB7IC8vIGEgZnJhbWUgb3IgYSBjb21wb25lbnQgbWFzdGVyIG91dHNpZGUgb2YgYSBmcmFtZSBpcyBkaXJlY3RseSBzZWxlY3RlZFxuICAgICAgICBjb25zb2xlLmxvZygnR09UIEEgRlJBTUUnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobm9kZXNbMF0uY2hpbGRyZW4pO1xuICAgICAgICBoYXNGcmFtZURhdGEgPSB0cnVlOyAvLyBkb250IG5lZWQgdG8gZ2V0IHRoZSBmcmFtZSBkYXRhXG4gICAgICAgIGZyYW1lQXJyLnB1c2goZ2V0RWxlbWVudChub2Rlc1swXSwgZmFsc2UpKTtcbiAgICAgICAgbm9kZXMgPSBub2Rlc1swXS5jaGlsZHJlbjtcbiAgICB9XG4gICAgLy8gZ2V0IHNoYXBlcyBcbiAgICBpZiAobm9kZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgIC8vIGdldCB0aGUgZnJhbWUgZGF0YVxuICAgICAgICBpZiAoIWhhc0ZyYW1lRGF0YSkge1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50LnR5cGUgPT09ICdQQUdFJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gLy8gbGF5ZXIgaXMgb3V0c2lkZSBvZiBhIGZyYW1lIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2dldCB0aGUgZnJhbWUgZGF0YScpO1xuICAgICAgICAgICAgbGV0IGZyYW1lID0gZmluZEZyYW1lKG5vZGUpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZyYW1lOicsIGZyYW1lKTtcbiAgICAgICAgICAgIGxldCBmcmFtZURhdGEgPSBnZXRFbGVtZW50KGZyYW1lLCB0cnVlKTsgLy8gc2tpcCBnYXRoZXJpbmcgY2hpbGRyZW4gZGF0YVxuICAgICAgICAgICAgZnJhbWVEYXRhLmNoaWxkcmVuID0gW107IC8vIGNsZWFyIHRoZSBjaGlsZHJlbiBvZiB0aGUgZnJhbWUgdG8gcHVzaCB0aGVtIGxhdGVyXG4gICAgICAgICAgICBmcmFtZUFyci5wdXNoKGZyYW1lRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9iaiA9IGdldEVsZW1lbnQobm9kZSwgZmFsc2UpO1xuICAgICAgICBhcnIucHVzaChvYmopO1xuICAgIH0pO1xuICAgIC8vIGNvbnNvbGUubG9nKCdhcnI6ICcsIGFycik7XG4gICAgcmV0dXJuIGFycjtcbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50KG5vZGUsIHNraXBDaGlsZHJlbikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbm9kZScsIG5vZGUpO1xuICAgICAgICBsZXQgb2JqID0ge1xuICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbm9kZSkge1xuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBub2RlW2tleV07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdjaGlsZHJlbicgJiYgIXNraXBDaGlsZHJlbikge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBub2RlVG9PYmooZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnYmFja2dyb3VuZHMnKSB7XG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IG5vZGVUb09iaihlbGVtZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChrZXkgPT09ICdmaWxscycgJiYgZWxlbWVudC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29sbGVjdEltYWdlSGFzaGVzKGVsZW1lbnQsIG5vZGUuaWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29ybmVyIHJhZGl1c1xuICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT0gZmlnbWEubWl4ZWQgJiYga2V5ID09PSAnY29ybmVyUmFkaXVzJykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBNYXRoLm1pbihub2RlLnRvcExlZnRSYWRpdXMsIG5vZGUudG9wUmlnaHRSYWRpdXMsIG5vZGUuYm90dG9tTGVmdFJhZGl1cywgbm9kZS5ib3R0b21SaWdodFJhZGl1cyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyB0cnkgdG8gZ2V0IHRoZSBmaXJzdCB2YWx1ZSBvbiB0aGUgdGV4dFxuICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT0gZmlnbWEubWl4ZWQpIHtcbiAgICAgICAgICAgICAgICBsZXQgc3RyID0gJ2dldFJhbmdlJyArIGtleS5yZXBsYWNlKC9eXFx3LywgYyA9PiBjLnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBub2RlW3N0cl0oMCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBsYXllci5mb250TmFtZSAhPT0gKGZpZ21hLm1peGVkKSkgPyBsYXllci5mb250TmFtZS5mYW1pbHkgOiBsYXllci5nZXRSYW5nZUZvbnROYW1lKDAsMSkuZmFtaWx5XG4gICAgICAgICAgICAvLyBpZiAoa2V5ID09PSAncGFyZW50JykgeyBjb25zb2xlLmxvZyhlbGVtZW50KTsgfVxuICAgICAgICAgICAgb2JqW2tleV0gPSBlbGVtZW50O1xuICAgICAgICB9XG4gICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgQXV0by1sYXlvdXQgZnJhbWVzIGZvciBhbGlnbm1lbnQgb2YgY2hpbGRyZW5cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2RlLmxheW91dE1vZGUgIT09ICdOT05FJykge1xuICAgICAgICAgICAgb2JqLnR5cGUgPSAnQVVUT0xBWU9VVCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29sbGVjdEltYWdlSGFzaGVzKGVsZW1lbnQsIGlkKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbWFnZUhhc2gnLCBpZCwgZWxlbWVudCk7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBlbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBmaWxsID0gZWxlbWVudFtpXTtcbiAgICAgICAgICAgIGlmIChmaWxsLnR5cGUgPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIGltYWdlSGFzaExpc3QucHVzaCh7IGhhc2g6IGZpbGwuaW1hZ2VIYXNoLCBpZCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHN0b3JlSW1hZ2VEYXRhKGltYWdlSGFzaExpc3QsIGxheWVycywgcmVmSW1nKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coaW1hZ2VIYXNoTGlzdCk7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBpbWFnZUhhc2hMaXN0KSB7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50W2ldKTtcbiAgICAgICAgICAgIGNvbnN0IGhhc2ggPSBpbWFnZUhhc2hMaXN0W2ldLmhhc2g7XG4gICAgICAgICAgICBjb25zdCBuYW1lID0gaW1hZ2VIYXNoTGlzdFtpXS5pZC5yZXBsYWNlKC86L2csICctJyk7XG4gICAgICAgICAgICBsZXQgaW1hZ2UgPSBmaWdtYS5nZXRJbWFnZUJ5SGFzaChoYXNoKTtcbiAgICAgICAgICAgIGxldCBieXRlcyA9IHlpZWxkIGltYWdlLmdldEJ5dGVzQXN5bmMoKTtcbiAgICAgICAgICAgIGltYWdlQnl0ZXNMaXN0LnB1c2goeyBuYW1lLCBieXRlcyB9KTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGJ5dGVzKTtcbiAgICAgICAgfVxuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmZXRjaEltYWdlc0FuZEFFVVgnLCBpbWFnZXM6IGltYWdlQnl0ZXNMaXN0LCBkYXRhOiBsYXllcnMsIHJlZkltZyB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZpbmRGcmFtZShub2RlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ25vZGU6Jywgbm9kZSk7XG4gICAgLy8gY29uc29sZS5sb2coJ25vZGUudHlwZTonLCBub2RlLnR5cGUpO1xuICAgIGlmICgobm9kZS50eXBlICE9PSAnRlJBTUUnICYmICEobm9kZS50eXBlID09PSAnQ09NUE9ORU5UJyAmJiBub2RlLnBhcmVudC50eXBlID09PSAnUEFHRScpKVxuICAgICAgICB8fCAobm9kZS50eXBlID09PSAnRlJBTUUnICYmIG5vZGUubGF5b3V0TW9kZSAhPT0gJ05PTkUnKVxuICAgICAgICB8fCAobm9kZS50eXBlID09PSAnRlJBTUUnICYmIG5vZGUucGFyZW50LnR5cGUgPT09ICdGUkFNRScpKSB7XG4gICAgICAgIC8vIGlmIChub2RlLnR5cGUgIT09ICdGUkFNRScgJiYgbm9kZS50eXBlICE9PSAnQ09NUE9ORU5UJykge1xuICAgICAgICByZXR1cm4gZmluZEZyYW1lKG5vZGUucGFyZW50KTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGhhc0ZyYW1lRGF0YSA9IHRydWU7XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGZsYXR0ZW5SZWN1cnNpdmUoc2VsZWN0aW9uLCBsYXllckNvdW50KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgc2VsZWN0aW9uLmZvckVhY2goc2hhcGUgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RyeSBmbGF0dGVuaW5nJywgc2hhcGUpO1xuICAgICAgICAgICAgaWYgKHNoYXBlLnR5cGUgPT0gJ0JPT0xFQU5fT1BFUkFUSU9OJykge1xuICAgICAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oW3NoYXBlXSk7XG4gICAgICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc2hhcGUuY29ybmVyUmFkaXVzID09IGZpZ21hLm1peGVkIHx8IHNoYXBlLmNvcm5lclJhZGl1cyA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBmbGF0dGVuIHJvdW5kZWQgY29ybmVyc1xuICAgICAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oW3NoYXBlXSk7XG4gICAgICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc2hhcGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBsYXllckNvdW50ID0gZmxhdHRlblJlY3Vyc2l2ZShzaGFwZS5jaGlsZHJlbiwgbGF5ZXJDb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgdCA9IHNoYXBlLnJlbGF0aXZlVHJhbnNmb3JtO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzaGFwZS50eXBlJywgc2hhcGUudHlwZSk7XG4gICAgICAgICAgICAgICAgLy8vIGNoZWNrIGZvciB0cmFuc2Zvcm1zXG4gICAgICAgICAgICAgICAgaWYgKHRbMF1bMF0udG9GaXhlZCg2KSAhPSAxIHx8XG4gICAgICAgICAgICAgICAgICAgIHRbMF1bMV0udG9GaXhlZCg2KSAhPSAwIHx8XG4gICAgICAgICAgICAgICAgICAgIHRbMV1bMF0udG9GaXhlZCg2KSAhPSAwIHx8XG4gICAgICAgICAgICAgICAgICAgIHRbMV1bMV0udG9GaXhlZCg2KSAhPSAxIHx8XG4gICAgICAgICAgICAgICAgICAgIGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oW3NoYXBlXSk7XG4gICAgICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hhcGUudHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEuZmxhdHRlbihbc2hhcGVdKTtcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsYXllckNvdW50O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICByZXR1cm4gbGF5ZXJDb3VudDtcbiAgICB9XG59XG5mdW5jdGlvbiByYXN0ZXJpemVTZWxlY3Rpb24oc2VsZWN0aW9uLCBsYXllckNvdW50KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IG5ld1NlbGVjdGlvbiA9IFtdO1xuICAgICAgICBzZWxlY3Rpb24uZm9yRWFjaChzaGFwZSA9PiB7XG4gICAgICAgICAgICBpZiAoc2hhcGUudHlwZSA9PSAnR1JPVVAnKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dvdCBhIGdyb3VwJyk7XG4gICAgICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDogXCJQTkdcIixcbiAgICAgICAgICAgICAgICAgICAgY29uc3RyYWludDogeyB0eXBlOiBcIlNDQUxFXCIsIHZhbHVlOiA2IH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBzaGFwZVRyYW5zZm9ybSA9IHNoYXBlLnJlbGF0aXZlVHJhbnNmb3JtOyAvLyBzdG9yZSB0cmFuc2Zvcm1cbiAgICAgICAgICAgICAgICBsZXQgcmVtb3ZlVHJhbnNmb3JtID0gW1sxLCAwLCBzaGFwZS54XSwgWzAsIDEsIHNoYXBlLnldXTtcbiAgICAgICAgICAgICAgICBzaGFwZS5yZWxhdGl2ZVRyYW5zZm9ybSA9IHJlbW92ZVRyYW5zZm9ybTtcbiAgICAgICAgICAgICAgICBzaGFwZS5leHBvcnRBc3luYyhvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihpbWcgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmaWdtYS5jcmVhdGVJbWFnZShpbWcpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgc2hhcGUucGFyZW50LmFwcGVuZENoaWxkKHJlY3QpO1xuICAgICAgICAgICAgICAgICAgICByZWN0LnggPSBzaGFwZS54O1xuICAgICAgICAgICAgICAgICAgICByZWN0LnkgPSBzaGFwZS55O1xuICAgICAgICAgICAgICAgICAgICByZWN0LnJlbGF0aXZlVHJhbnNmb3JtID0gc2hhcGVUcmFuc2Zvcm07XG4gICAgICAgICAgICAgICAgICAgIHJlY3QubmFtZSA9IHNoYXBlLm5hbWUgKyAnX3Jhc3Rlcml6ZSc7XG4gICAgICAgICAgICAgICAgICAgIHJlY3QucmVzaXplKHNoYXBlLndpZHRoLCBzaGFwZS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsbE9iaiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsZW5kTW9kZTogXCJOT1JNQUxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cmFzdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBvc3VyZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRzOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNhdHVyYXRpb246IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93czogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZW1wZXJhdHVyZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW50OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSGFzaDogZmlnbWEuY3JlYXRlSW1hZ2UoaW1nKS5oYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VUcmFuc2Zvcm06IFtbMSwgMCwgMF0sIFswLCAxLCAwXV0sXG4gICAgICAgICAgICAgICAgICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVNb2RlOiBcIkNST1BcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxpbmdGYWN0b3I6IDAuNSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiSU1BR0VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIHJlY3QuZmlsbHMgPSBbZmlsbE9ial07XG4gICAgICAgICAgICAgICAgICAgIG5ld1NlbGVjdGlvbi5wdXNoKHJlY3QpO1xuICAgICAgICAgICAgICAgICAgICBzaGFwZS5yZWxhdGl2ZVRyYW5zZm9ybSA9IHNoYXBlVHJhbnNmb3JtO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBuZXdTZWxlY3Rpb247IH0sIDUwKTtcbiAgICAgICAgcmV0dXJuIGxheWVyQ291bnQ7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIHJldHVybiBsYXllckNvdW50O1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdlbmVyYXRlRnJhbWVJbWFnZSgpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGZpcnN0U2VsZWN0ZWQgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgICAgICAgICBsZXQgcGFyZW50RnJhbWUgPSBmaW5kRnJhbWUoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdKTtcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGZvcm1hdDogXCJQTkdcIixcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7IHR5cGU6IFwiU0NBTEVcIiwgdmFsdWU6IDYgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHBhcmVudEZyYW1lLmV4cG9ydEFzeW5jKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLnRoZW4oaW1nID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnaHNhZGpmaGprYWhzZGYnLCBpbWcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmaWdtYS5jcmVhdGVJbWFnZShpbWcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==