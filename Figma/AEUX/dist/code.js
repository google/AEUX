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
figma.showUI(__html__, { width: 166, height: 184 });
let hasFrameData;
let shapeTree = [];
let imageHashList = [];
let imageBytesList = [];
let rasterizeList = [];
let prefs = {
    exportRefImage: false,
    imgSaveDialog: false,
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
    if (message.type === 'exportCancel') {
    }
    if (message.type === 'exportSelection') {
        hasFrameData = false;
        shapeTree = [];
        imageHashList = [];
        imageBytesList = [];
        rasterizeList = [];
        let exportJSON = false;
        if (message.exportJSON) {
            exportJSON = true;
        }
        // nothing selected
        if (figma.currentPage.selection.length < 1) {
            figma.ui.postMessage({ type: 'fetchAEUX', data: null });
            return;
        }
        try {
            // pre-process the selected shapes hierarchy
            let selection = nodeToObj(figma.currentPage.selection);
            if (shapeTree[0].children.length < 1) {
                shapeTree[0].children = selection;
            }
            // console.log('shapeTree: ', shapeTree);
        }
        catch (error) {
            console.log(error);
            console.log('selected layers need to be inside of a frame');
            figma.ui.postMessage({ type: 'footerMsg', action: 'Layers must be inside of a frame', layerCount: null });
        }
        let refImg = null, tempGroup, parentFrame;
        if (prefs.exportRefImage) { // include a reference image with transfer
            parentFrame = findFrame(figma.currentPage.selection[0]);
            let parentFrameName = parentFrame.name.replace(/\s*(\/|\\)\s*/g, '-').replace(/^\*\s/, '').replace(/^\*/, '');
            // group and mask
            let mask = figma.createRectangle();
            mask.x = parentFrame.x;
            mask.y = parentFrame.y;
            mask.resize(parentFrame.width, parentFrame.height);
            tempGroup = figma.group([mask], mask.parent);
            tempGroup.appendChild(parentFrame);
            mask.isMask = true;
            rasterizeList.push(parentFrame.id);
            refImg = {
                type: 'Image',
                name: parentFrameName,
                id: parentFrame.id.replace(/:/g, '-'),
                frame: { x: parentFrame.width / 2, y: parentFrame.height / 2, width: parentFrame.width, height: parentFrame.height },
                isVisible: true,
                opacity: 50,
                blendMode: 'BlendingMode.NORMAL',
                isMask: false,
                rotation: 0,
                guide: true,
            };
        }
        if (rasterizeList.length > 0) {
            rasterizeList = [...new Set(rasterizeList)]; // remove duplicates
            // console.log('RASTERIZELIST', rasterizeList);
            let requests = rasterizeList.map((item) => {
                console.log('iten++', item);
                return new Promise((resolve) => {
                    asyncCollectHashes(item, resolve);
                });
            });
            Promise.all(requests)
                .then(() => storeImageData(imageHashList, shapeTree, refImg))
                .then(() => {
                // remove the reference mask
                if (tempGroup) {
                    tempGroup.parent.appendChild(parentFrame);
                    tempGroup.remove();
                }
            });
        }
        else {
            // check if images need to export then send message to ui.ts
            if (exportJSON) {
                figma.ui.postMessage({ type: 'exportAEUX', data: shapeTree });
            }
            else if (imageHashList.length < 1) {
                figma.ui.postMessage({ type: 'fetchAEUX', data: shapeTree });
            }
            else {
                storeImageData(imageHashList, shapeTree, null);
            }
        }
        // console.log('imageHashList', imageHashList);
        function clone(val) {
            return JSON.parse(JSON.stringify(val));
        }
        function asyncCollectHashes(id, cb) {
            setTimeout(() => {
                // console.log('done with', item);
                let shape = figma.getNodeById(id);
                // disable effects
                let effectVisList = []; // to store the effect visibility
                let effects;
                if (shape.effects) {
                    effects = clone(shape.effects);
                    effects.forEach(effect => {
                        effectVisList.push(effect.visible);
                        if (effect.type == 'DROP_SHADOW' || effect.type == 'LAYER_BLUR') {
                            effect.visible = false;
                        }
                    });
                    shape.effects = effects;
                }
                let compMult = 3;
                let imgScale = Math.min(3500 / Math.max(shape.width, shape.height), compMult); // limit it to 4000px
                // console.log('IMAGESCALE', imgScale, shape);
                shape.exportAsync({
                    format: "PNG",
                    useAbsoluteBounds: true,
                    constraint: { type: "SCALE", value: imgScale }
                })
                    .then(img => {
                    imageHashList.push({
                        hash: figma.createImage(img).hash,
                        id: `${shape.name.replace(/^\*\s/, '').replace(/^\*/, '')}_${id}`
                    });
                })
                    .then(() => {
                    // re-enable effects 
                    for (let i = 0; i < effectVisList.length; i++) {
                        effects[i].visible = effectVisList[i];
                    }
                    shape.effects = effects;
                })
                    .then(() => {
                    cb();
                });
            }, 100);
        }
    }
    if (message.type === 'addRasterizeFlag') {
        if (figma.currentPage.selection.length < 1) {
            return;
        } // nothing selected
        // let selection = nodeToObj(figma.currentPage.selection)
        let layerCount = addMagicStar(figma.currentPage.selection, 0) || 0;
        // reselect layers
        figma.currentPage.selection = figma.currentPage.selection;
        figma.ui.postMessage({ type: 'footerMsg', action: 'marked as PNG', layerCount });
    }
    // if (message.type === 'flattenLayers') {
    //     if (figma.currentPage.selection.length < 1) { return }      // nothing selected
    //     // let selection = nodeToObj(figma.currentPage.selection)
    //     let layerCount = flattenRecursive(figma.currentPage.selection, 0) || 0
    //     // reselect layers
    //     figma.currentPage.selection = figma.currentPage.selection
    //     figma.ui.postMessage({type: 'footerMsg', action: 'flattened', layerCount});
    // }
    // if (message.type === 'rasterizeSelection') {
    //     if (figma.currentPage.selection.length < 1) { return }      // nothing selected
    //     // let selection = nodeToObj(figma.currentPage.selection)
    //     let layerCount = rasterizeSelection(figma.currentPage.selection, 0) || 0
    //     // console.log('layerCount', layerCount);
    //     // reselect layers
    //     figma.currentPage.selection = figma.currentPage.selection
    //     figma.ui.postMessage({type: 'footerMsg', action: 'rasterized', layerCount});
    // }
    // if (message.type === 'detachComponents') {
    //     console.log('detachComponents');
    //     let layerCount = 4;
    //     figma.ui.postMessage({type: 'footerMsg', action: 'flattened', layerCount});
    // }
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
        shapeTree.push(getElement(nodes[0], false));
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
            shapeTree.push(frameData);
        }
        let obj = sanitizeValue(getElement(node, false));
        arr.push(obj);
    });
    // console.log('arr: ', arr);
    return arr;
    function getElement(node, skipChildren) {
        // console.log('node', node.name);
        let rasterize = false;
        let obj = {
            children: [],
            type: null,
        };
        if (node.name && node.name.charAt(0) == '*' && node != findFrame(node)) {
            console.log('rasterize', node);
            rasterizeList.push(node.id);
            rasterize = true;
        }
        for (const key in node) {
            try {
                let element = node[key];
                // console.log(element);
                if (key === 'children' && !skipChildren && !rasterize) {
                    element = nodeToObj(element);
                }
                if (key === 'backgrounds') {
                    element = nodeToObj(element);
                }
                if (key === 'fills' && element.length > 0) { // add image fills to rasterizeList
                    let hasImageFill = false;
                    for (const i in element) {
                        const fill = element[i];
                        if (fill.type == 'IMAGE') {
                            hasImageFill = true;
                            obj['rasterize'] = true;
                            // console.log('image', element);
                            // obj.type = 'RECTANGLE'
                            // return
                        }
                    }
                    if (hasImageFill) {
                        rasterizeList.push(node.id);
                    }
                }
                // corner radius
                // if (key === 'cornerRadius') {
                //     console.log(key,  element);
                // }
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
            catch (error) {
                console.log('ERROR', error);
            }
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
        // console.log('layers++', layers);
        // console.log('imageHashList++', imageHashList);
        for (const i in imageHashList) {
            // console.log('i', i);
            const hash = imageHashList[i].hash;
            // console.log('hash', hash);
            const name = imageHashList[i].id
                .replace(/[\\:"*?%<>|]/g, '-') // replace illegal characters
                .replace(/\s*(\/|\\)\s*/g, '-'); // remove slashes
            // console.log('name', name);
            try {
                let image = figma.getImageByHash(hash);
                let bytes = yield image.getBytesAsync();
                imageBytesList.push({ name, bytes });
                // console.log('bytes', bytes);
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
    try {
        if ((node.type !== 'FRAME' && !(node.type === 'COMPONENT' && node.parent.type === 'PAGE'))
            || (node.type === 'FRAME' && node.parent.type === 'FRAME')) {
            // if (node.type !== 'FRAME' && node.type !== 'COMPONENT') {                
            return findFrame(node.parent);
        }
        else {
            hasFrameData = true;
            return node;
        }
    }
    catch (error) {
        figma.ui.postMessage({ type: 'footerMsg', action: 'Error in findFrame() 😖', layerCount: null });
    }
}
function addMagicStar(selection, layerCount) {
    if (findFrame(selection[0]) == selection[0]) { // selection is the top most frame
        selection = selection[0].children; // select all the children
    }
    selection.forEach(shape => {
        if (shape.name.charAt(0) !== '*') {
            shape.name = `* ${shape.name}`;
            layerCount++;
        }
    });
    return layerCount;
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
                let imgScale = Math.min(4000 / Math.max(shape.width, shape.height), 6); // limit it to 4000px
                // alert(imgScale)       
                let options = {
                    format: "PNG",
                    constraint: { type: "SCALE", value: imgScale }
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
function sanitizeValue(data) {
    if (data === null || typeof data !== 'object') {
        // Return the value if it's not an object or is null.
        return data;
    }
    else if (Array.isArray(data)) {
        // Recursively process each element of the array.
        return data.map(sanitizeValue);
    }
    else {
        // Create a new object to accumulate only supported values.
        const result = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'function' || typeof value === 'undefined' || typeof value === 'symbol') {
                // Attempt to convert functions and symbols to string, ignore undefined.
                // You may adjust this part as needed.
                if (typeof value === 'function') {
                    continue;
                }
                if (typeof value === 'symbol') {
                    result[key] = Object(value);
                }
            }
            else if (typeof value === 'object') {
                // Recursively process objects and arrays.
                result[key] = sanitizeValue(value);
            }
            else {
                // Directly assign if it's a supported type.
                result[key] = value;
            }
        }
        return result;
    }
}


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsaUNBQWlDO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsU0FBUztBQUNULDBCQUEwQiw0Q0FBNEMsRUFBRTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiY29kZS5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2NvZGUudHNcIik7XG4iLCJ2YXIgX19hd2FpdGVyID0gKHRoaXMgJiYgdGhpcy5fX2F3YWl0ZXIpIHx8IGZ1bmN0aW9uICh0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcbiAgICByZXR1cm4gbmV3IChQIHx8IChQID0gUHJvbWlzZSkpKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiByZWplY3RlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvcltcInRocm93XCJdKHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gc3RlcChyZXN1bHQpIHsgcmVzdWx0LmRvbmUgPyByZXNvbHZlKHJlc3VsdC52YWx1ZSkgOiBuZXcgUChmdW5jdGlvbiAocmVzb2x2ZSkgeyByZXNvbHZlKHJlc3VsdC52YWx1ZSk7IH0pLnRoZW4oZnVsZmlsbGVkLCByZWplY3RlZCk7IH1cbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xuICAgIH0pO1xufTtcbmZpZ21hLnNob3dVSShfX2h0bWxfXywgeyB3aWR0aDogMTY2LCBoZWlnaHQ6IDE4NCB9KTtcbmxldCBoYXNGcmFtZURhdGE7XG5sZXQgc2hhcGVUcmVlID0gW107XG5sZXQgaW1hZ2VIYXNoTGlzdCA9IFtdO1xubGV0IGltYWdlQnl0ZXNMaXN0ID0gW107XG5sZXQgcmFzdGVyaXplTGlzdCA9IFtdO1xubGV0IHByZWZzID0ge1xuICAgIGV4cG9ydFJlZkltYWdlOiBmYWxzZSxcbiAgICBpbWdTYXZlRGlhbG9nOiBmYWxzZSxcbn07XG4vLyByZWNlaXZlIG1lc3NhZ2UgZnJvbSB0aGUgVUlcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1lc3NhZ2UgPT4ge1xuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdnZXRQcmVmcycpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2dldCB0aG9zZSBwcmVmcycpO1xuICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLmdldEFzeW5jKCdhZXV4LnByZWZzJylcbiAgICAgICAgICAgIC50aGVuKHByZWZzID0+IHtcbiAgICAgICAgICAgIGlmIChwcmVmcykge1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3JldFByZWZzJywgcHJlZnM6IHByZWZzIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcmVmcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdnb3R0YSBzYXZlIG5ldyBwcmVmcycsIG1lc3NhZ2UuZGVmYXVsdFByZWZzKTtcbiAgICAgICAgICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCdhZXV4LnByZWZzJywgbWVzc2FnZS5kZWZhdWx0UHJlZnMpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAncmV0UHJlZnMnLCBwcmVmczogbWVzc2FnZS5kZWZhdWx0UHJlZnMgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG1lc3NhZ2UuZGVmYXVsdFByZWZzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICAgICAgLnRoZW4odXNlclByZWZzID0+IHtcbiAgICAgICAgICAgIHByZWZzID0gdXNlclByZWZzO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3NldFByZWZzJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnc2F2ZSB0aG9zZSBwcmVmcycsIG1lc3NhZ2UucHJlZnMpO1xuICAgICAgICBmaWdtYS5jbGllbnRTdG9yYWdlLnNldEFzeW5jKCdhZXV4LnByZWZzJywgbWVzc2FnZS5wcmVmcylcbiAgICAgICAgICAgIC50aGVuKHJldCA9PiB7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZShtZXNzYWdlLnByZWZzKTtcbiAgICAgICAgICAgIHByZWZzID0gbWVzc2FnZS5wcmVmczsgLy8gc3RvcmUgdGhlIHByZWZzIGxvY2FsbHlcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdleHBvcnRDYW5jZWwnKSB7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdleHBvcnRTZWxlY3Rpb24nKSB7XG4gICAgICAgIGhhc0ZyYW1lRGF0YSA9IGZhbHNlO1xuICAgICAgICBzaGFwZVRyZWUgPSBbXTtcbiAgICAgICAgaW1hZ2VIYXNoTGlzdCA9IFtdO1xuICAgICAgICBpbWFnZUJ5dGVzTGlzdCA9IFtdO1xuICAgICAgICByYXN0ZXJpemVMaXN0ID0gW107XG4gICAgICAgIGxldCBleHBvcnRKU09OID0gZmFsc2U7XG4gICAgICAgIGlmIChtZXNzYWdlLmV4cG9ydEpTT04pIHtcbiAgICAgICAgICAgIGV4cG9ydEpTT04gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIG5vdGhpbmcgc2VsZWN0ZWRcbiAgICAgICAgaWYgKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmZXRjaEFFVVgnLCBkYXRhOiBudWxsIH0pO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBwcmUtcHJvY2VzcyB0aGUgc2VsZWN0ZWQgc2hhcGVzIGhpZXJhcmNoeVxuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbiA9IG5vZGVUb09iaihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgaWYgKHNoYXBlVHJlZVswXS5jaGlsZHJlbi5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgc2hhcGVUcmVlWzBdLmNoaWxkcmVuID0gc2VsZWN0aW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ3NoYXBlVHJlZTogJywgc2hhcGVUcmVlKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWxlY3RlZCBsYXllcnMgbmVlZCB0byBiZSBpbnNpZGUgb2YgYSBmcmFtZScpO1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZm9vdGVyTXNnJywgYWN0aW9uOiAnTGF5ZXJzIG11c3QgYmUgaW5zaWRlIG9mIGEgZnJhbWUnLCBsYXllckNvdW50OiBudWxsIH0pO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZWZJbWcgPSBudWxsLCB0ZW1wR3JvdXAsIHBhcmVudEZyYW1lO1xuICAgICAgICBpZiAocHJlZnMuZXhwb3J0UmVmSW1hZ2UpIHsgLy8gaW5jbHVkZSBhIHJlZmVyZW5jZSBpbWFnZSB3aXRoIHRyYW5zZmVyXG4gICAgICAgICAgICBwYXJlbnRGcmFtZSA9IGZpbmRGcmFtZShmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0pO1xuICAgICAgICAgICAgbGV0IHBhcmVudEZyYW1lTmFtZSA9IHBhcmVudEZyYW1lLm5hbWUucmVwbGFjZSgvXFxzKihcXC98XFxcXClcXHMqL2csICctJykucmVwbGFjZSgvXlxcKlxccy8sICcnKS5yZXBsYWNlKC9eXFwqLywgJycpO1xuICAgICAgICAgICAgLy8gZ3JvdXAgYW5kIG1hc2tcbiAgICAgICAgICAgIGxldCBtYXNrID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgICAgICAgICBtYXNrLnggPSBwYXJlbnRGcmFtZS54O1xuICAgICAgICAgICAgbWFzay55ID0gcGFyZW50RnJhbWUueTtcbiAgICAgICAgICAgIG1hc2sucmVzaXplKHBhcmVudEZyYW1lLndpZHRoLCBwYXJlbnRGcmFtZS5oZWlnaHQpO1xuICAgICAgICAgICAgdGVtcEdyb3VwID0gZmlnbWEuZ3JvdXAoW21hc2tdLCBtYXNrLnBhcmVudCk7XG4gICAgICAgICAgICB0ZW1wR3JvdXAuYXBwZW5kQ2hpbGQocGFyZW50RnJhbWUpO1xuICAgICAgICAgICAgbWFzay5pc01hc2sgPSB0cnVlO1xuICAgICAgICAgICAgcmFzdGVyaXplTGlzdC5wdXNoKHBhcmVudEZyYW1lLmlkKTtcbiAgICAgICAgICAgIHJlZkltZyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnSW1hZ2UnLFxuICAgICAgICAgICAgICAgIG5hbWU6IHBhcmVudEZyYW1lTmFtZSxcbiAgICAgICAgICAgICAgICBpZDogcGFyZW50RnJhbWUuaWQucmVwbGFjZSgvOi9nLCAnLScpLFxuICAgICAgICAgICAgICAgIGZyYW1lOiB7IHg6IHBhcmVudEZyYW1lLndpZHRoIC8gMiwgeTogcGFyZW50RnJhbWUuaGVpZ2h0IC8gMiwgd2lkdGg6IHBhcmVudEZyYW1lLndpZHRoLCBoZWlnaHQ6IHBhcmVudEZyYW1lLmhlaWdodCB9LFxuICAgICAgICAgICAgICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiA1MCxcbiAgICAgICAgICAgICAgICBibGVuZE1vZGU6ICdCbGVuZGluZ01vZGUuTk9STUFMJyxcbiAgICAgICAgICAgICAgICBpc01hc2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICAgICAgICAgIGd1aWRlOiB0cnVlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmFzdGVyaXplTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByYXN0ZXJpemVMaXN0ID0gWy4uLm5ldyBTZXQocmFzdGVyaXplTGlzdCldOyAvLyByZW1vdmUgZHVwbGljYXRlc1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1JBU1RFUklaRUxJU1QnLCByYXN0ZXJpemVMaXN0KTtcbiAgICAgICAgICAgIGxldCByZXF1ZXN0cyA9IHJhc3Rlcml6ZUxpc3QubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2l0ZW4rKycsIGl0ZW0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhc3luY0NvbGxlY3RIYXNoZXMoaXRlbSwgcmVzb2x2ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHJlcXVlc3RzKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHN0b3JlSW1hZ2VEYXRhKGltYWdlSGFzaExpc3QsIHNoYXBlVHJlZSwgcmVmSW1nKSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSByZWZlcmVuY2UgbWFza1xuICAgICAgICAgICAgICAgIGlmICh0ZW1wR3JvdXApIHtcbiAgICAgICAgICAgICAgICAgICAgdGVtcEdyb3VwLnBhcmVudC5hcHBlbmRDaGlsZChwYXJlbnRGcmFtZSk7XG4gICAgICAgICAgICAgICAgICAgIHRlbXBHcm91cC5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGNoZWNrIGlmIGltYWdlcyBuZWVkIHRvIGV4cG9ydCB0aGVuIHNlbmQgbWVzc2FnZSB0byB1aS50c1xuICAgICAgICAgICAgaWYgKGV4cG9ydEpTT04pIHtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdleHBvcnRBRVVYJywgZGF0YTogc2hhcGVUcmVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoaW1hZ2VIYXNoTGlzdC5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZmV0Y2hBRVVYJywgZGF0YTogc2hhcGVUcmVlIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgc3RvcmVJbWFnZURhdGEoaW1hZ2VIYXNoTGlzdCwgc2hhcGVUcmVlLCBudWxsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBjb25zb2xlLmxvZygnaW1hZ2VIYXNoTGlzdCcsIGltYWdlSGFzaExpc3QpO1xuICAgICAgICBmdW5jdGlvbiBjbG9uZSh2YWwpIHtcbiAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuICAgICAgICB9XG4gICAgICAgIGZ1bmN0aW9uIGFzeW5jQ29sbGVjdEhhc2hlcyhpZCwgY2IpIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdkb25lIHdpdGgnLCBpdGVtKTtcbiAgICAgICAgICAgICAgICBsZXQgc2hhcGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgICAgICAgICAgICAgLy8gZGlzYWJsZSBlZmZlY3RzXG4gICAgICAgICAgICAgICAgbGV0IGVmZmVjdFZpc0xpc3QgPSBbXTsgLy8gdG8gc3RvcmUgdGhlIGVmZmVjdCB2aXNpYmlsaXR5XG4gICAgICAgICAgICAgICAgbGV0IGVmZmVjdHM7XG4gICAgICAgICAgICAgICAgaWYgKHNoYXBlLmVmZmVjdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgZWZmZWN0cyA9IGNsb25lKHNoYXBlLmVmZmVjdHMpO1xuICAgICAgICAgICAgICAgICAgICBlZmZlY3RzLmZvckVhY2goZWZmZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVmZmVjdFZpc0xpc3QucHVzaChlZmZlY3QudmlzaWJsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWZmZWN0LnR5cGUgPT0gJ0RST1BfU0hBRE9XJyB8fCBlZmZlY3QudHlwZSA9PSAnTEFZRVJfQkxVUicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3QudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2hhcGUuZWZmZWN0cyA9IGVmZmVjdHM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxldCBjb21wTXVsdCA9IDM7XG4gICAgICAgICAgICAgICAgbGV0IGltZ1NjYWxlID0gTWF0aC5taW4oMzUwMCAvIE1hdGgubWF4KHNoYXBlLndpZHRoLCBzaGFwZS5oZWlnaHQpLCBjb21wTXVsdCk7IC8vIGxpbWl0IGl0IHRvIDQwMDBweFxuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdJTUFHRVNDQUxFJywgaW1nU2NhbGUsIHNoYXBlKTtcbiAgICAgICAgICAgICAgICBzaGFwZS5leHBvcnRBc3luYyh7XG4gICAgICAgICAgICAgICAgICAgIGZvcm1hdDogXCJQTkdcIixcbiAgICAgICAgICAgICAgICAgICAgdXNlQWJzb2x1dGVCb3VuZHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQ6IHsgdHlwZTogXCJTQ0FMRVwiLCB2YWx1ZTogaW1nU2NhbGUgfVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGltZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGltYWdlSGFzaExpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNoOiBmaWdtYS5jcmVhdGVJbWFnZShpbWcpLmhhc2gsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogYCR7c2hhcGUubmFtZS5yZXBsYWNlKC9eXFwqXFxzLywgJycpLnJlcGxhY2UoL15cXCovLCAnJyl9XyR7aWR9YFxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlLWVuYWJsZSBlZmZlY3RzIFxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVmZmVjdFZpc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVmZmVjdHNbaV0udmlzaWJsZSA9IGVmZmVjdFZpc0xpc3RbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2hhcGUuZWZmZWN0cyA9IGVmZmVjdHM7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnYWRkUmFzdGVyaXplRmxhZycpIHtcbiAgICAgICAgaWYgKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5sZW5ndGggPCAxKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gLy8gbm90aGluZyBzZWxlY3RlZFxuICAgICAgICAvLyBsZXQgc2VsZWN0aW9uID0gbm9kZVRvT2JqKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbilcbiAgICAgICAgbGV0IGxheWVyQ291bnQgPSBhZGRNYWdpY1N0YXIoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLCAwKSB8fCAwO1xuICAgICAgICAvLyByZXNlbGVjdCBsYXllcnNcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdtYXJrZWQgYXMgUE5HJywgbGF5ZXJDb3VudCB9KTtcbiAgICB9XG4gICAgLy8gaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2ZsYXR0ZW5MYXllcnMnKSB7XG4gICAgLy8gICAgIGlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24ubGVuZ3RoIDwgMSkgeyByZXR1cm4gfSAgICAgIC8vIG5vdGhpbmcgc2VsZWN0ZWRcbiAgICAvLyAgICAgLy8gbGV0IHNlbGVjdGlvbiA9IG5vZGVUb09iaihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pXG4gICAgLy8gICAgIGxldCBsYXllckNvdW50ID0gZmxhdHRlblJlY3Vyc2l2ZShmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24sIDApIHx8IDBcbiAgICAvLyAgICAgLy8gcmVzZWxlY3QgbGF5ZXJzXG4gICAgLy8gICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblxuICAgIC8vICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7dHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ2ZsYXR0ZW5lZCcsIGxheWVyQ291bnR9KTtcbiAgICAvLyB9XG4gICAgLy8gaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ3Jhc3Rlcml6ZVNlbGVjdGlvbicpIHtcbiAgICAvLyAgICAgaWYgKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5sZW5ndGggPCAxKSB7IHJldHVybiB9ICAgICAgLy8gbm90aGluZyBzZWxlY3RlZFxuICAgIC8vICAgICAvLyBsZXQgc2VsZWN0aW9uID0gbm9kZVRvT2JqKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbilcbiAgICAvLyAgICAgbGV0IGxheWVyQ291bnQgPSByYXN0ZXJpemVTZWxlY3Rpb24oZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLCAwKSB8fCAwXG4gICAgLy8gICAgIC8vIGNvbnNvbGUubG9nKCdsYXllckNvdW50JywgbGF5ZXJDb3VudCk7XG4gICAgLy8gICAgIC8vIHJlc2VsZWN0IGxheWVyc1xuICAgIC8vICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25cbiAgICAvLyAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe3R5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdyYXN0ZXJpemVkJywgbGF5ZXJDb3VudH0pO1xuICAgIC8vIH1cbiAgICAvLyBpZiAobWVzc2FnZS50eXBlID09PSAnZGV0YWNoQ29tcG9uZW50cycpIHtcbiAgICAvLyAgICAgY29uc29sZS5sb2coJ2RldGFjaENvbXBvbmVudHMnKTtcbiAgICAvLyAgICAgbGV0IGxheWVyQ291bnQgPSA0O1xuICAgIC8vICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7dHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ2ZsYXR0ZW5lZCcsIGxheWVyQ291bnR9KTtcbiAgICAvLyB9XG4gICAgLy9Db21tdW5pY2F0ZSBiYWNrIHRvIHRoZSBVSVxuICAgIC8vIGNvbnNvbGUubG9nKCdzZW5kIG1lc3NhZ2UgYmFjayB0byB1aScpO1xufTtcbmZ1bmN0aW9uIG5vZGVUb09iaihub2Rlcykge1xuICAgIC8vICAgY29uc29sZS5sb2coJ25vZGVzJywgbm9kZXMpO1xuICAgIGlmIChub2Rlcy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgLy8gY29uc29sZS5sb2cobm9kZXNbMF0udHlwZSk7XG4gICAgbGV0IGFyciA9IFtdO1xuICAgIC8vIGxvb2sgZm9yIHRoZSBwYXJlbnQgZnJhbWUgb2YgZXZlcnl0aGluZyBleGNlcHQgcmVndWxhciAobm9uLWF1dG9MYXlvdXQpIGZyYW1lcyBhbmQgbG9vc2UgY29tcG9uZW50c1xuICAgIGlmIChub2Rlc1swXSAmJiAoKG5vZGVzWzBdLnR5cGUgPT09ICdGUkFNRScgJiYgbm9kZXNbMF0ucGFyZW50LnR5cGUgPT09ICdQQUdFJykgfHxcbiAgICAgICAgLy8gKG5vZGVzWzBdLnR5cGUgPT09ICdGUkFNRScgJiYgbm9kZXNbMF0ubGF5b3V0TW9kZSA9PT0gJ05PTkUnKSB8fCBcbiAgICAgICAgKG5vZGVzWzBdLnR5cGUgPT09ICdDT01QT05FTlQnICYmIG5vZGVzWzBdLnBhcmVudC50eXBlID09PSAnUEFHRScpKSkgeyAvLyBhIGZyYW1lIG9yIGEgY29tcG9uZW50IG1hc3RlciBvdXRzaWRlIG9mIGEgZnJhbWUgaXMgZGlyZWN0bHkgc2VsZWN0ZWRcbiAgICAgICAgY29uc29sZS5sb2coJ0dPVCBBIEZSQU1FJyk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKG5vZGVzWzBdLmNoaWxkcmVuKTtcbiAgICAgICAgaGFzRnJhbWVEYXRhID0gdHJ1ZTsgLy8gZG9udCBuZWVkIHRvIGdldCB0aGUgZnJhbWUgZGF0YVxuICAgICAgICBzaGFwZVRyZWUucHVzaChnZXRFbGVtZW50KG5vZGVzWzBdLCBmYWxzZSkpO1xuICAgICAgICBub2RlcyA9IG5vZGVzWzBdLmNoaWxkcmVuO1xuICAgIH1cbiAgICAvLyBnZXQgc2hhcGVzIFxuICAgIGlmIChub2Rlcy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgLy8gZ2V0IHRoZSBmcmFtZSBkYXRhXG4gICAgICAgIGlmICghaGFzRnJhbWVEYXRhKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSAvLyBsYXllciBpcyBvdXRzaWRlIG9mIGEgZnJhbWUgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZ2V0IHRoZSBmcmFtZSBkYXRhJyk7XG4gICAgICAgICAgICBsZXQgZnJhbWUgPSBmaW5kRnJhbWUobm9kZSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZnJhbWU6JywgZnJhbWUpO1xuICAgICAgICAgICAgbGV0IGZyYW1lRGF0YSA9IGdldEVsZW1lbnQoZnJhbWUsIHRydWUpOyAvLyBza2lwIGdhdGhlcmluZyBjaGlsZHJlbiBkYXRhXG4gICAgICAgICAgICBmcmFtZURhdGEuY2hpbGRyZW4gPSBbXTsgLy8gY2xlYXIgdGhlIGNoaWxkcmVuIG9mIHRoZSBmcmFtZSB0byBwdXNoIHRoZW0gbGF0ZXJcbiAgICAgICAgICAgIHNoYXBlVHJlZS5wdXNoKGZyYW1lRGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IG9iaiA9IHNhbml0aXplVmFsdWUoZ2V0RWxlbWVudChub2RlLCBmYWxzZSkpO1xuICAgICAgICBhcnIucHVzaChvYmopO1xuICAgIH0pO1xuICAgIC8vIGNvbnNvbGUubG9nKCdhcnI6ICcsIGFycik7XG4gICAgcmV0dXJuIGFycjtcbiAgICBmdW5jdGlvbiBnZXRFbGVtZW50KG5vZGUsIHNraXBDaGlsZHJlbikge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnbm9kZScsIG5vZGUubmFtZSk7XG4gICAgICAgIGxldCByYXN0ZXJpemUgPSBmYWxzZTtcbiAgICAgICAgbGV0IG9iaiA9IHtcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIH07XG4gICAgICAgIGlmIChub2RlLm5hbWUgJiYgbm9kZS5uYW1lLmNoYXJBdCgwKSA9PSAnKicgJiYgbm9kZSAhPSBmaW5kRnJhbWUobm9kZSkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdyYXN0ZXJpemUnLCBub2RlKTtcbiAgICAgICAgICAgIHJhc3Rlcml6ZUxpc3QucHVzaChub2RlLmlkKTtcbiAgICAgICAgICAgIHJhc3Rlcml6ZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChjb25zdCBrZXkgaW4gbm9kZSkge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgZWxlbWVudCA9IG5vZGVba2V5XTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhlbGVtZW50KTtcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAnY2hpbGRyZW4nICYmICFza2lwQ2hpbGRyZW4gJiYgIXJhc3Rlcml6ZSkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbm9kZVRvT2JqKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAnYmFja2dyb3VuZHMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBub2RlVG9PYmooZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdmaWxscycgJiYgZWxlbWVudC5sZW5ndGggPiAwKSB7IC8vIGFkZCBpbWFnZSBmaWxscyB0byByYXN0ZXJpemVMaXN0XG4gICAgICAgICAgICAgICAgICAgIGxldCBoYXNJbWFnZUZpbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChjb25zdCBpIGluIGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IGZpbGwgPSBlbGVtZW50W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGZpbGwudHlwZSA9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzSW1hZ2VGaWxsID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmpbJ3Jhc3Rlcml6ZSddID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaW1hZ2UnLCBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBvYmoudHlwZSA9ICdSRUNUQU5HTEUnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKGhhc0ltYWdlRmlsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmFzdGVyaXplTGlzdC5wdXNoKG5vZGUuaWQpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGNvcm5lciByYWRpdXNcbiAgICAgICAgICAgICAgICAvLyBpZiAoa2V5ID09PSAnY29ybmVyUmFkaXVzJykge1xuICAgICAgICAgICAgICAgIC8vICAgICBjb25zb2xlLmxvZyhrZXksICBlbGVtZW50KTtcbiAgICAgICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT0gZmlnbWEubWl4ZWQgJiYga2V5ID09PSAnY29ybmVyUmFkaXVzJykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gTWF0aC5taW4obm9kZS50b3BMZWZ0UmFkaXVzLCBub2RlLnRvcFJpZ2h0UmFkaXVzLCBub2RlLmJvdHRvbUxlZnRSYWRpdXMsIG5vZGUuYm90dG9tUmlnaHRSYWRpdXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyB0cnkgdG8gZ2V0IHRoZSBmaXJzdCB2YWx1ZSBvbiB0aGUgdGV4dFxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ID09IGZpZ21hLm1peGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzdHIgPSAnZ2V0UmFuZ2UnICsga2V5LnJlcGxhY2UoL15cXHcvLCBjID0+IGMudG9VcHBlckNhc2UoKSk7XG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbm9kZVtzdHJdKDAsIDEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gbGF5ZXIuZm9udE5hbWUgIT09IChmaWdtYS5taXhlZCkpID8gbGF5ZXIuZm9udE5hbWUuZmFtaWx5IDogbGF5ZXIuZ2V0UmFuZ2VGb250TmFtZSgwLDEpLmZhbWlseVxuICAgICAgICAgICAgICAgIC8vIGlmIChrZXkgPT09ICdwYXJlbnQnKSB7IGNvbnNvbGUubG9nKGVsZW1lbnQpOyB9XG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSBlbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0VSUk9SJywgZXJyb3IpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGtlZXAgdHJhY2sgb2YgQXV0by1sYXlvdXQgZnJhbWVzIGZvciBhbGlnbm1lbnQgb2YgY2hpbGRyZW5cbiAgICAgICAgaWYgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2RlLmxheW91dE1vZGUgIT09ICdOT05FJykge1xuICAgICAgICAgICAgb2JqLnR5cGUgPSAnQVVUT0xBWU9VVCc7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iajtcbiAgICB9XG4gICAgZnVuY3Rpb24gY29sbGVjdEltYWdlSGFzaGVzKGVsZW1lbnQsIGlkKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbWFnZUhhc2gnLCBpZCwgZWxlbWVudCk7XG4gICAgICAgIGZvciAoY29uc3QgaSBpbiBlbGVtZW50KSB7XG4gICAgICAgICAgICBjb25zdCBmaWxsID0gZWxlbWVudFtpXTtcbiAgICAgICAgICAgIGlmIChmaWxsLnR5cGUgPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgIGltYWdlSGFzaExpc3QucHVzaCh7IGhhc2g6IGZpbGwuaW1hZ2VIYXNoLCBpZCB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbmZ1bmN0aW9uIHN0b3JlSW1hZ2VEYXRhKGltYWdlSGFzaExpc3QsIGxheWVycywgcmVmSW1nKSB7XG4gICAgcmV0dXJuIF9fYXdhaXRlcih0aGlzLCB2b2lkIDAsIHZvaWQgMCwgZnVuY3Rpb24qICgpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2xheWVycysrJywgbGF5ZXJzKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2ltYWdlSGFzaExpc3QrKycsIGltYWdlSGFzaExpc3QpO1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gaW1hZ2VIYXNoTGlzdCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2knLCBpKTtcbiAgICAgICAgICAgIGNvbnN0IGhhc2ggPSBpbWFnZUhhc2hMaXN0W2ldLmhhc2g7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaGFzaCcsIGhhc2gpO1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGltYWdlSGFzaExpc3RbaV0uaWRcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvW1xcXFw6XCIqPyU8PnxdL2csICctJykgLy8gcmVwbGFjZSBpbGxlZ2FsIGNoYXJhY3RlcnNcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKihcXC98XFxcXClcXHMqL2csICctJyk7IC8vIHJlbW92ZSBzbGFzaGVzXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnbmFtZScsIG5hbWUpO1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgaW1hZ2UgPSBmaWdtYS5nZXRJbWFnZUJ5SGFzaChoYXNoKTtcbiAgICAgICAgICAgICAgICBsZXQgYnl0ZXMgPSB5aWVsZCBpbWFnZS5nZXRCeXRlc0FzeW5jKCk7XG4gICAgICAgICAgICAgICAgaW1hZ2VCeXRlc0xpc3QucHVzaCh7IG5hbWUsIGJ5dGVzIH0pO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdieXRlcycsIGJ5dGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikgeyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGltYWdlQnl0ZXNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2ZldGNoSW1hZ2VzQW5kQUVVWCcsIGltYWdlczogaW1hZ2VCeXRlc0xpc3QsIGRhdGE6IGxheWVycywgcmVmSW1nIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZmV0Y2hBRVVYJywgZGF0YTogbGF5ZXJzIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBmaW5kRnJhbWUobm9kZSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdub2RlOicsIG5vZGUpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdub2RlLnR5cGU6Jywgbm9kZS50eXBlKTtcbiAgICB0cnkge1xuICAgICAgICBpZiAoKG5vZGUudHlwZSAhPT0gJ0ZSQU1FJyAmJiAhKG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcgJiYgbm9kZS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSlcbiAgICAgICAgICAgIHx8IChub2RlLnR5cGUgPT09ICdGUkFNRScgJiYgbm9kZS5wYXJlbnQudHlwZSA9PT0gJ0ZSQU1FJykpIHtcbiAgICAgICAgICAgIC8vIGlmIChub2RlLnR5cGUgIT09ICdGUkFNRScgJiYgbm9kZS50eXBlICE9PSAnQ09NUE9ORU5UJykgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBmaW5kRnJhbWUobm9kZS5wYXJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGFzRnJhbWVEYXRhID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdFcnJvciBpbiBmaW5kRnJhbWUoKSDwn5iWJywgbGF5ZXJDb3VudDogbnVsbCB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBhZGRNYWdpY1N0YXIoc2VsZWN0aW9uLCBsYXllckNvdW50KSB7XG4gICAgaWYgKGZpbmRGcmFtZShzZWxlY3Rpb25bMF0pID09IHNlbGVjdGlvblswXSkgeyAvLyBzZWxlY3Rpb24gaXMgdGhlIHRvcCBtb3N0IGZyYW1lXG4gICAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdGlvblswXS5jaGlsZHJlbjsgLy8gc2VsZWN0IGFsbCB0aGUgY2hpbGRyZW5cbiAgICB9XG4gICAgc2VsZWN0aW9uLmZvckVhY2goc2hhcGUgPT4ge1xuICAgICAgICBpZiAoc2hhcGUubmFtZS5jaGFyQXQoMCkgIT09ICcqJykge1xuICAgICAgICAgICAgc2hhcGUubmFtZSA9IGAqICR7c2hhcGUubmFtZX1gO1xuICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGxheWVyQ291bnQ7XG59XG5mdW5jdGlvbiBmbGF0dGVuUmVjdXJzaXZlKHNlbGVjdGlvbiwgbGF5ZXJDb3VudCkge1xuICAgIHRyeSB7XG4gICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKHNoYXBlID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0cnkgZmxhdHRlbmluZycsIHNoYXBlKTtcbiAgICAgICAgICAgIGlmIChzaGFwZS50eXBlID09ICdCT09MRUFOX09QRVJBVElPTicpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS5mbGF0dGVuKFtzaGFwZV0pO1xuICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNoYXBlLmNvcm5lclJhZGl1cyA9PSBmaWdtYS5taXhlZCB8fCBzaGFwZS5jb3JuZXJSYWRpdXMgPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gZmxhdHRlbiByb3VuZGVkIGNvcm5lcnNcbiAgICAgICAgICAgICAgICBmaWdtYS5mbGF0dGVuKFtzaGFwZV0pO1xuICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNoYXBlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgbGF5ZXJDb3VudCA9IGZsYXR0ZW5SZWN1cnNpdmUoc2hhcGUuY2hpbGRyZW4sIGxheWVyQ291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHQgPSBzaGFwZS5yZWxhdGl2ZVRyYW5zZm9ybTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2hhcGUudHlwZScsIHNoYXBlLnR5cGUpO1xuICAgICAgICAgICAgICAgIC8vLyBjaGVjayBmb3IgdHJhbnNmb3Jtc1xuICAgICAgICAgICAgICAgIGlmICh0WzBdWzBdLnRvRml4ZWQoNikgIT0gMSB8fFxuICAgICAgICAgICAgICAgICAgICB0WzBdWzFdLnRvRml4ZWQoNikgIT0gMCB8fFxuICAgICAgICAgICAgICAgICAgICB0WzFdWzBdLnRvRml4ZWQoNikgIT0gMCB8fFxuICAgICAgICAgICAgICAgICAgICB0WzFdWzFdLnRvRml4ZWQoNikgIT0gMSB8fFxuICAgICAgICAgICAgICAgICAgICBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS5mbGF0dGVuKFtzaGFwZV0pO1xuICAgICAgICAgICAgICAgICAgICBsYXllckNvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNoYXBlLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oW3NoYXBlXSk7XG4gICAgICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbGF5ZXJDb3VudDtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGxheWVyQ291bnQ7XG4gICAgfVxufVxuZnVuY3Rpb24gcmFzdGVyaXplU2VsZWN0aW9uKHNlbGVjdGlvbiwgbGF5ZXJDb3VudCkge1xuICAgIHRyeSB7XG4gICAgICAgIGxldCBuZXdTZWxlY3Rpb24gPSBbXTtcbiAgICAgICAgc2VsZWN0aW9uLmZvckVhY2goc2hhcGUgPT4ge1xuICAgICAgICAgICAgaWYgKHNoYXBlLnR5cGUgPT0gJ0dST1VQJykge1xuICAgICAgICAgICAgICAgIGxldCBpbWdTY2FsZSA9IE1hdGgubWluKDQwMDAgLyBNYXRoLm1heChzaGFwZS53aWR0aCwgc2hhcGUuaGVpZ2h0KSwgNik7IC8vIGxpbWl0IGl0IHRvIDQwMDBweFxuICAgICAgICAgICAgICAgIC8vIGFsZXJ0KGltZ1NjYWxlKSAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcIlBOR1wiLFxuICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7IHR5cGU6IFwiU0NBTEVcIiwgdmFsdWU6IGltZ1NjYWxlIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBzaGFwZVRyYW5zZm9ybSA9IHNoYXBlLnJlbGF0aXZlVHJhbnNmb3JtOyAvLyBzdG9yZSB0cmFuc2Zvcm1cbiAgICAgICAgICAgICAgICBsZXQgcmVtb3ZlVHJhbnNmb3JtID0gW1sxLCAwLCBzaGFwZS54XSwgWzAsIDEsIHNoYXBlLnldXTtcbiAgICAgICAgICAgICAgICBzaGFwZS5yZWxhdGl2ZVRyYW5zZm9ybSA9IHJlbW92ZVRyYW5zZm9ybTtcbiAgICAgICAgICAgICAgICBzaGFwZS5leHBvcnRBc3luYyhvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihpbWcgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmaWdtYS5jcmVhdGVJbWFnZShpbWcpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgc2hhcGUucGFyZW50LmFwcGVuZENoaWxkKHJlY3QpO1xuICAgICAgICAgICAgICAgICAgICByZWN0LnggPSBzaGFwZS54O1xuICAgICAgICAgICAgICAgICAgICByZWN0LnkgPSBzaGFwZS55O1xuICAgICAgICAgICAgICAgICAgICByZWN0LnJlbGF0aXZlVHJhbnNmb3JtID0gc2hhcGVUcmFuc2Zvcm07XG4gICAgICAgICAgICAgICAgICAgIHJlY3QubmFtZSA9IHNoYXBlLm5hbWUgKyAnX3Jhc3Rlcml6ZSc7XG4gICAgICAgICAgICAgICAgICAgIHJlY3QucmVzaXplKHNoYXBlLndpZHRoLCBzaGFwZS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsbE9iaiA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVjdC5maWxsc1swXSkpO1xuICAgICAgICAgICAgICAgICAgICBmaWxsT2JqLmZpbHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cmFzdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9zdXJlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0czogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdHVyYXRpb246IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dzOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGVyYXR1cmU6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW50OiAwLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBmaWxsT2JqLmltYWdlSGFzaCA9IGZpZ21hLmNyZWF0ZUltYWdlKGltZykuaGFzaDtcbiAgICAgICAgICAgICAgICAgICAgZmlsbE9iai5pbWFnZVRyYW5zZm9ybSA9IFtbMSwgMCwgMF0sIFswLCAxLCAwXV07XG4gICAgICAgICAgICAgICAgICAgIGZpbGxPYmouc2NhbGVNb2RlID0gXCJDUk9QXCI7XG4gICAgICAgICAgICAgICAgICAgIGZpbGxPYmoudHlwZSA9IFwiSU1BR0VcIjtcbiAgICAgICAgICAgICAgICAgICAgZmlsbE9iai5zY2FsaW5nRmFjdG9yID0gMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZpbGxPYmouY29sb3I7XG4gICAgICAgICAgICAgICAgICAgIHJlY3QuZmlsbHMgPSBbZmlsbE9ial07XG4gICAgICAgICAgICAgICAgICAgIG5ld1NlbGVjdGlvbi5wdXNoKHJlY3QpO1xuICAgICAgICAgICAgICAgICAgICBzaGFwZS5yZWxhdGl2ZVRyYW5zZm9ybSA9IHNoYXBlVHJhbnNmb3JtO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBuZXdTZWxlY3Rpb247IH0sIDUwKTtcbiAgICAgICAgcmV0dXJuIGxheWVyQ291bnQ7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIHJldHVybiBsYXllckNvdW50O1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdlbmVyYXRlRnJhbWVJbWFnZSgpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGZpcnN0U2VsZWN0ZWQgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgICAgICAgICBsZXQgcGFyZW50RnJhbWUgPSBmaW5kRnJhbWUoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdKTtcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGZvcm1hdDogXCJQTkdcIixcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7IHR5cGU6IFwiU0NBTEVcIiwgdmFsdWU6IDYgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHBhcmVudEZyYW1lLmV4cG9ydEFzeW5jKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLnRoZW4oaW1nID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaHNhZGpmaGprYWhzZGYnLCBpbWcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmaWdtYS5jcmVhdGVJbWFnZShpbWcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuZnVuY3Rpb24gc2FuaXRpemVWYWx1ZShkYXRhKSB7XG4gICAgaWYgKGRhdGEgPT09IG51bGwgfHwgdHlwZW9mIGRhdGEgIT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIFJldHVybiB0aGUgdmFsdWUgaWYgaXQncyBub3QgYW4gb2JqZWN0IG9yIGlzIG51bGwuXG4gICAgICAgIHJldHVybiBkYXRhO1xuICAgIH1cbiAgICBlbHNlIGlmIChBcnJheS5pc0FycmF5KGRhdGEpKSB7XG4gICAgICAgIC8vIFJlY3Vyc2l2ZWx5IHByb2Nlc3MgZWFjaCBlbGVtZW50IG9mIHRoZSBhcnJheS5cbiAgICAgICAgcmV0dXJuIGRhdGEubWFwKHNhbml0aXplVmFsdWUpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgbmV3IG9iamVjdCB0byBhY2N1bXVsYXRlIG9ubHkgc3VwcG9ydGVkIHZhbHVlcy5cbiAgICAgICAgY29uc3QgcmVzdWx0ID0ge307XG4gICAgICAgIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKGRhdGEpKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nIHx8IHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZW9mIHZhbHVlID09PSAnc3ltYm9sJykge1xuICAgICAgICAgICAgICAgIC8vIEF0dGVtcHQgdG8gY29udmVydCBmdW5jdGlvbnMgYW5kIHN5bWJvbHMgdG8gc3RyaW5nLCBpZ25vcmUgdW5kZWZpbmVkLlxuICAgICAgICAgICAgICAgIC8vIFlvdSBtYXkgYWRqdXN0IHRoaXMgcGFydCBhcyBuZWVkZWQuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N5bWJvbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0W2tleV0gPSBPYmplY3QodmFsdWUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAvLyBSZWN1cnNpdmVseSBwcm9jZXNzIG9iamVjdHMgYW5kIGFycmF5cy5cbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHNhbml0aXplVmFsdWUodmFsdWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gRGlyZWN0bHkgYXNzaWduIGlmIGl0J3MgYSBzdXBwb3J0ZWQgdHlwZS5cbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==