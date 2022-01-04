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
figma.showUI(__html__, { width: 166, height: 180 });
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
            let parentFrameName = parentFrame.name.replace(/\s*(\/|\\)\s*/g, '-');
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
                    });
                    // re-enable effects 
                    for (let i = 0; i < effectVisList.length; i++) {
                        effects[i].visible = effectVisList[i];
                    }
                    shape.effects = effects;
                    cb();
                }, 100);
            }
            let requests = rasterizeList.map((item) => {
                return new Promise((resolve) => {
                    asyncCollectHashes(item, resolve);
                });
            });
            Promise.all(requests)
                .then(() => storeImageData(imageHashList, shapeTree, refImg))
                .then(() => {
                // remove the reference mask
                tempGroup.parent.appendChild(parentFrame);
                tempGroup.remove();
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
        let obj = getElement(node, false);
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
        if (node.name && node.name.charAt(0) == '*') {
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
        console.log('layers', layers);
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsaUNBQWlDO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsMEJBQTBCLDRDQUE0QyxFQUFFO0FBQ3hFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb2RlLnRzXCIpO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDE2NiwgaGVpZ2h0OiAxODAgfSk7XG5sZXQgaGFzRnJhbWVEYXRhO1xubGV0IHNoYXBlVHJlZSA9IFtdO1xubGV0IGltYWdlSGFzaExpc3QgPSBbXTtcbmxldCBpbWFnZUJ5dGVzTGlzdCA9IFtdO1xubGV0IHJhc3Rlcml6ZUxpc3QgPSBbXTtcbmxldCBwcmVmcyA9IHtcbiAgICBleHBvcnRSZWZJbWFnZTogZmFsc2UsXG4gICAgaW1nU2F2ZURpYWxvZzogZmFsc2UsXG59O1xuLy8gcmVjZWl2ZSBtZXNzYWdlIGZyb20gdGhlIFVJXG5maWdtYS51aS5vbm1lc3NhZ2UgPSBtZXNzYWdlID0+IHtcbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnZ2V0UHJlZnMnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdnZXQgdGhvc2UgcHJlZnMnKTtcbiAgICAgICAgZmlnbWEuY2xpZW50U3RvcmFnZS5nZXRBc3luYygnYWV1eC5wcmVmcycpXG4gICAgICAgICAgICAudGhlbihwcmVmcyA9PiB7XG4gICAgICAgICAgICBpZiAocHJlZnMpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdyZXRQcmVmcycsIHByZWZzOiBwcmVmcyB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJlZnM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZ290dGEgc2F2ZSBuZXcgcHJlZnMnLCBtZXNzYWdlLmRlZmF1bHRQcmVmcyk7XG4gICAgICAgICAgICAgICAgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygnYWV1eC5wcmVmcycsIG1lc3NhZ2UuZGVmYXVsdFByZWZzKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ3JldFByZWZzJywgcHJlZnM6IG1lc3NhZ2UuZGVmYXVsdFByZWZzIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiBtZXNzYWdlLmRlZmF1bHRQcmVmcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICAgICAgIC50aGVuKHVzZXJQcmVmcyA9PiB7XG4gICAgICAgICAgICBwcmVmcyA9IHVzZXJQcmVmcztcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdzZXRQcmVmcycpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3NhdmUgdGhvc2UgcHJlZnMnLCBtZXNzYWdlLnByZWZzKTtcbiAgICAgICAgZmlnbWEuY2xpZW50U3RvcmFnZS5zZXRBc3luYygnYWV1eC5wcmVmcycsIG1lc3NhZ2UucHJlZnMpXG4gICAgICAgICAgICAudGhlbihyZXQgPT4ge1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UobWVzc2FnZS5wcmVmcyk7XG4gICAgICAgICAgICBwcmVmcyA9IG1lc3NhZ2UucHJlZnM7IC8vIHN0b3JlIHRoZSBwcmVmcyBsb2NhbGx5XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnZXhwb3J0Q2FuY2VsJykge1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnZXhwb3J0U2VsZWN0aW9uJykge1xuICAgICAgICBoYXNGcmFtZURhdGEgPSBmYWxzZTtcbiAgICAgICAgc2hhcGVUcmVlID0gW107XG4gICAgICAgIGltYWdlSGFzaExpc3QgPSBbXTtcbiAgICAgICAgaW1hZ2VCeXRlc0xpc3QgPSBbXTtcbiAgICAgICAgcmFzdGVyaXplTGlzdCA9IFtdO1xuICAgICAgICBsZXQgZXhwb3J0SlNPTiA9IGZhbHNlO1xuICAgICAgICBpZiAobWVzc2FnZS5leHBvcnRKU09OKSB7XG4gICAgICAgICAgICBleHBvcnRKU09OID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBub3RoaW5nIHNlbGVjdGVkXG4gICAgICAgIGlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24ubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZmV0Y2hBRVVYJywgZGF0YTogbnVsbCB9KTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gcHJlLXByb2Nlc3MgdGhlIHNlbGVjdGVkIHNoYXBlcyBoaWVyYXJjaHlcbiAgICAgICAgICAgIGxldCBzZWxlY3Rpb24gPSBub2RlVG9PYmooZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKTtcbiAgICAgICAgICAgIGlmIChzaGFwZVRyZWVbMF0uY2hpbGRyZW4ubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIHNoYXBlVHJlZVswXS5jaGlsZHJlbiA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdzaGFwZVRyZWU6ICcsIHNoYXBlVHJlZSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VsZWN0ZWQgbGF5ZXJzIG5lZWQgdG8gYmUgaW5zaWRlIG9mIGEgZnJhbWUnKTtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ0xheWVycyBtdXN0IGJlIGluc2lkZSBvZiBhIGZyYW1lJywgbGF5ZXJDb3VudDogbnVsbCB9KTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgcmVmSW1nID0gbnVsbCwgdGVtcEdyb3VwLCBwYXJlbnRGcmFtZTtcbiAgICAgICAgaWYgKHByZWZzLmV4cG9ydFJlZkltYWdlKSB7IC8vIGluY2x1ZGUgYSByZWZlcmVuY2UgaW1hZ2Ugd2l0aCB0cmFuc2ZlclxuICAgICAgICAgICAgcGFyZW50RnJhbWUgPSBmaW5kRnJhbWUoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdKTtcbiAgICAgICAgICAgIGxldCBwYXJlbnRGcmFtZU5hbWUgPSBwYXJlbnRGcmFtZS5uYW1lLnJlcGxhY2UoL1xccyooXFwvfFxcXFwpXFxzKi9nLCAnLScpO1xuICAgICAgICAgICAgLy8gZ3JvdXAgYW5kIG1hc2tcbiAgICAgICAgICAgIGxldCBtYXNrID0gZmlnbWEuY3JlYXRlUmVjdGFuZ2xlKCk7XG4gICAgICAgICAgICBtYXNrLnggPSBwYXJlbnRGcmFtZS54O1xuICAgICAgICAgICAgbWFzay55ID0gcGFyZW50RnJhbWUueTtcbiAgICAgICAgICAgIG1hc2sucmVzaXplKHBhcmVudEZyYW1lLndpZHRoLCBwYXJlbnRGcmFtZS5oZWlnaHQpO1xuICAgICAgICAgICAgdGVtcEdyb3VwID0gZmlnbWEuZ3JvdXAoW21hc2tdLCBtYXNrLnBhcmVudCk7XG4gICAgICAgICAgICB0ZW1wR3JvdXAuYXBwZW5kQ2hpbGQocGFyZW50RnJhbWUpO1xuICAgICAgICAgICAgbWFzay5pc01hc2sgPSB0cnVlO1xuICAgICAgICAgICAgcmFzdGVyaXplTGlzdC5wdXNoKHBhcmVudEZyYW1lLmlkKTtcbiAgICAgICAgICAgIHJlZkltZyA9IHtcbiAgICAgICAgICAgICAgICB0eXBlOiAnSW1hZ2UnLFxuICAgICAgICAgICAgICAgIG5hbWU6IHBhcmVudEZyYW1lTmFtZSxcbiAgICAgICAgICAgICAgICBpZDogcGFyZW50RnJhbWUuaWQucmVwbGFjZSgvOi9nLCAnLScpLFxuICAgICAgICAgICAgICAgIGZyYW1lOiB7IHg6IHBhcmVudEZyYW1lLndpZHRoIC8gMiwgeTogcGFyZW50RnJhbWUuaGVpZ2h0IC8gMiwgd2lkdGg6IHBhcmVudEZyYW1lLndpZHRoLCBoZWlnaHQ6IHBhcmVudEZyYW1lLmhlaWdodCB9LFxuICAgICAgICAgICAgICAgIGlzVmlzaWJsZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICBvcGFjaXR5OiA1MCxcbiAgICAgICAgICAgICAgICBibGVuZE1vZGU6ICdCbGVuZGluZ01vZGUuTk9STUFMJyxcbiAgICAgICAgICAgICAgICBpc01hc2s6IGZhbHNlLFxuICAgICAgICAgICAgICAgIHJvdGF0aW9uOiAwLFxuICAgICAgICAgICAgICAgIGd1aWRlOiB0cnVlLFxuICAgICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmFzdGVyaXplTGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICByYXN0ZXJpemVMaXN0ID0gWy4uLm5ldyBTZXQocmFzdGVyaXplTGlzdCldOyAvLyByZW1vdmUgZHVwbGljYXRlc1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ1JBU1RFUklaRUxJU1QnLCByYXN0ZXJpemVMaXN0KTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGNsb25lKHZhbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHZhbCkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZnVuY3Rpb24gYXN5bmNDb2xsZWN0SGFzaGVzKGlkLCBjYikge1xuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZG9uZSB3aXRoJywgaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBzaGFwZSA9IGZpZ21hLmdldE5vZGVCeUlkKGlkKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZGlzYWJsZSBlZmZlY3RzXG4gICAgICAgICAgICAgICAgICAgIGxldCBlZmZlY3RWaXNMaXN0ID0gW107IC8vIHRvIHN0b3JlIHRoZSBlZmZlY3QgdmlzaWJpbGl0eVxuICAgICAgICAgICAgICAgICAgICBsZXQgZWZmZWN0cztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNoYXBlLmVmZmVjdHMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVmZmVjdHMgPSBjbG9uZShzaGFwZS5lZmZlY3RzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVmZmVjdHMuZm9yRWFjaChlZmZlY3QgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVmZmVjdFZpc0xpc3QucHVzaChlZmZlY3QudmlzaWJsZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGVmZmVjdC50eXBlID09ICdEUk9QX1NIQURPVycgfHwgZWZmZWN0LnR5cGUgPT0gJ0xBWUVSX0JMVVInKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVmZmVjdC52aXNpYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFwZS5lZmZlY3RzID0gZWZmZWN0cztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsZXQgY29tcE11bHQgPSAzO1xuICAgICAgICAgICAgICAgICAgICBsZXQgaW1nU2NhbGUgPSBNYXRoLm1pbigzNTAwIC8gTWF0aC5tYXgoc2hhcGUud2lkdGgsIHNoYXBlLmhlaWdodCksIGNvbXBNdWx0KTsgLy8gbGltaXQgaXQgdG8gNDAwMHB4XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdJTUFHRVNDQUxFJywgaW1nU2NhbGUsIHNoYXBlKTtcbiAgICAgICAgICAgICAgICAgICAgc2hhcGUuZXhwb3J0QXN5bmMoe1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcIlBOR1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdXNlQWJzb2x1dGVCb3VuZHM6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7IHR5cGU6IFwiU0NBTEVcIiwgdmFsdWU6IGltZ1NjYWxlIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGltZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWFnZUhhc2hMaXN0LnB1c2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc2g6IGZpZ21hLmNyZWF0ZUltYWdlKGltZykuaGFzaCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZDogYCR7c2hhcGUubmFtZS5yZXBsYWNlKC9eXFwqXFxzLywgJycpLnJlcGxhY2UoL15cXCovLCAnJyl9XyR7aWR9YFxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAvLyByZS1lbmFibGUgZWZmZWN0cyBcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBlZmZlY3RWaXNMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3RzW2ldLnZpc2libGUgPSBlZmZlY3RWaXNMaXN0W2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlLmVmZmVjdHMgPSBlZmZlY3RzO1xuICAgICAgICAgICAgICAgICAgICBjYigpO1xuICAgICAgICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgcmVxdWVzdHMgPSByYXN0ZXJpemVMaXN0Lm1hcCgoaXRlbSkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBhc3luY0NvbGxlY3RIYXNoZXMoaXRlbSwgcmVzb2x2ZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFByb21pc2UuYWxsKHJlcXVlc3RzKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHN0b3JlSW1hZ2VEYXRhKGltYWdlSGFzaExpc3QsIHNoYXBlVHJlZSwgcmVmSW1nKSlcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgLy8gcmVtb3ZlIHRoZSByZWZlcmVuY2UgbWFza1xuICAgICAgICAgICAgICAgIHRlbXBHcm91cC5wYXJlbnQuYXBwZW5kQ2hpbGQocGFyZW50RnJhbWUpO1xuICAgICAgICAgICAgICAgIHRlbXBHcm91cC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gY2hlY2sgaWYgaW1hZ2VzIG5lZWQgdG8gZXhwb3J0IHRoZW4gc2VuZCBtZXNzYWdlIHRvIHVpLnRzXG4gICAgICAgICAgICBpZiAoZXhwb3J0SlNPTikge1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2V4cG9ydEFFVVgnLCBkYXRhOiBzaGFwZVRyZWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChpbWFnZUhhc2hMaXN0Lmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmZXRjaEFFVVgnLCBkYXRhOiBzaGFwZVRyZWUgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBzdG9yZUltYWdlRGF0YShpbWFnZUhhc2hMaXN0LCBzaGFwZVRyZWUsIG51bGwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbWFnZUhhc2hMaXN0JywgaW1hZ2VIYXNoTGlzdCk7XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdhZGRSYXN0ZXJpemVGbGFnJykge1xuICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBub3RoaW5nIHNlbGVjdGVkXG4gICAgICAgIC8vIGxldCBzZWxlY3Rpb24gPSBub2RlVG9PYmooZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKVxuICAgICAgICBsZXQgbGF5ZXJDb3VudCA9IGFkZE1hZ2ljU3RhcihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24sIDApIHx8IDA7XG4gICAgICAgIC8vIHJlc2VsZWN0IGxheWVyc1xuICAgICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb247XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ21hcmtlZCBhcyBQTkcnLCBsYXllckNvdW50IH0pO1xuICAgIH1cbiAgICAvLyBpZiAobWVzc2FnZS50eXBlID09PSAnZmxhdHRlbkxheWVycycpIHtcbiAgICAvLyAgICAgaWYgKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbi5sZW5ndGggPCAxKSB7IHJldHVybiB9ICAgICAgLy8gbm90aGluZyBzZWxlY3RlZFxuICAgIC8vICAgICAvLyBsZXQgc2VsZWN0aW9uID0gbm9kZVRvT2JqKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbilcbiAgICAvLyAgICAgbGV0IGxheWVyQ291bnQgPSBmbGF0dGVuUmVjdXJzaXZlKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiwgMCkgfHwgMFxuICAgIC8vICAgICAvLyByZXNlbGVjdCBsYXllcnNcbiAgICAvLyAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uXG4gICAgLy8gICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHt0eXBlOiAnZm9vdGVyTXNnJywgYWN0aW9uOiAnZmxhdHRlbmVkJywgbGF5ZXJDb3VudH0pO1xuICAgIC8vIH1cbiAgICAvLyBpZiAobWVzc2FnZS50eXBlID09PSAncmFzdGVyaXplU2VsZWN0aW9uJykge1xuICAgIC8vICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHsgcmV0dXJuIH0gICAgICAvLyBub3RoaW5nIHNlbGVjdGVkXG4gICAgLy8gICAgIC8vIGxldCBzZWxlY3Rpb24gPSBub2RlVG9PYmooZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKVxuICAgIC8vICAgICBsZXQgbGF5ZXJDb3VudCA9IHJhc3Rlcml6ZVNlbGVjdGlvbihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24sIDApIHx8IDBcbiAgICAvLyAgICAgLy8gY29uc29sZS5sb2coJ2xheWVyQ291bnQnLCBsYXllckNvdW50KTtcbiAgICAvLyAgICAgLy8gcmVzZWxlY3QgbGF5ZXJzXG4gICAgLy8gICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblxuICAgIC8vICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7dHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ3Jhc3Rlcml6ZWQnLCBsYXllckNvdW50fSk7XG4gICAgLy8gfVxuICAgIC8vIGlmIChtZXNzYWdlLnR5cGUgPT09ICdkZXRhY2hDb21wb25lbnRzJykge1xuICAgIC8vICAgICBjb25zb2xlLmxvZygnZGV0YWNoQ29tcG9uZW50cycpO1xuICAgIC8vICAgICBsZXQgbGF5ZXJDb3VudCA9IDQ7XG4gICAgLy8gICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHt0eXBlOiAnZm9vdGVyTXNnJywgYWN0aW9uOiAnZmxhdHRlbmVkJywgbGF5ZXJDb3VudH0pO1xuICAgIC8vIH1cbiAgICAvL0NvbW11bmljYXRlIGJhY2sgdG8gdGhlIFVJXG4gICAgLy8gY29uc29sZS5sb2coJ3NlbmQgbWVzc2FnZSBiYWNrIHRvIHVpJyk7XG59O1xuZnVuY3Rpb24gbm9kZVRvT2JqKG5vZGVzKSB7XG4gICAgLy8gICBjb25zb2xlLmxvZygnbm9kZXMnLCBub2Rlcyk7XG4gICAgaWYgKG5vZGVzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICAvLyBjb25zb2xlLmxvZyhub2Rlc1swXS50eXBlKTtcbiAgICBsZXQgYXJyID0gW107XG4gICAgLy8gbG9vayBmb3IgdGhlIHBhcmVudCBmcmFtZSBvZiBldmVyeXRoaW5nIGV4Y2VwdCByZWd1bGFyIChub24tYXV0b0xheW91dCkgZnJhbWVzIGFuZCBsb29zZSBjb21wb25lbnRzXG4gICAgaWYgKG5vZGVzWzBdICYmICgobm9kZXNbMF0udHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2Rlc1swXS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSB8fFxuICAgICAgICAvLyAobm9kZXNbMF0udHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2Rlc1swXS5sYXlvdXRNb2RlID09PSAnTk9ORScpIHx8IFxuICAgICAgICAobm9kZXNbMF0udHlwZSA9PT0gJ0NPTVBPTkVOVCcgJiYgbm9kZXNbMF0ucGFyZW50LnR5cGUgPT09ICdQQUdFJykpKSB7IC8vIGEgZnJhbWUgb3IgYSBjb21wb25lbnQgbWFzdGVyIG91dHNpZGUgb2YgYSBmcmFtZSBpcyBkaXJlY3RseSBzZWxlY3RlZFxuICAgICAgICBjb25zb2xlLmxvZygnR09UIEEgRlJBTUUnKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2cobm9kZXNbMF0uY2hpbGRyZW4pO1xuICAgICAgICBoYXNGcmFtZURhdGEgPSB0cnVlOyAvLyBkb250IG5lZWQgdG8gZ2V0IHRoZSBmcmFtZSBkYXRhXG4gICAgICAgIHNoYXBlVHJlZS5wdXNoKGdldEVsZW1lbnQobm9kZXNbMF0sIGZhbHNlKSk7XG4gICAgICAgIG5vZGVzID0gbm9kZXNbMF0uY2hpbGRyZW47XG4gICAgfVxuICAgIC8vIGdldCBzaGFwZXMgXG4gICAgaWYgKG5vZGVzLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICBub2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAvLyBnZXQgdGhlIGZyYW1lIGRhdGFcbiAgICAgICAgaWYgKCFoYXNGcmFtZURhdGEpIHtcbiAgICAgICAgICAgIGlmIChub2RlLnBhcmVudC50eXBlID09PSAnUEFHRScpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IC8vIGxheWVyIGlzIG91dHNpZGUgb2YgYSBmcmFtZSBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdnZXQgdGhlIGZyYW1lIGRhdGEnKTtcbiAgICAgICAgICAgIGxldCBmcmFtZSA9IGZpbmRGcmFtZShub2RlKTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdmcmFtZTonLCBmcmFtZSk7XG4gICAgICAgICAgICBsZXQgZnJhbWVEYXRhID0gZ2V0RWxlbWVudChmcmFtZSwgdHJ1ZSk7IC8vIHNraXAgZ2F0aGVyaW5nIGNoaWxkcmVuIGRhdGFcbiAgICAgICAgICAgIGZyYW1lRGF0YS5jaGlsZHJlbiA9IFtdOyAvLyBjbGVhciB0aGUgY2hpbGRyZW4gb2YgdGhlIGZyYW1lIHRvIHB1c2ggdGhlbSBsYXRlclxuICAgICAgICAgICAgc2hhcGVUcmVlLnB1c2goZnJhbWVEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb2JqID0gZ2V0RWxlbWVudChub2RlLCBmYWxzZSk7XG4gICAgICAgIGFyci5wdXNoKG9iaik7XG4gICAgfSk7XG4gICAgLy8gY29uc29sZS5sb2coJ2FycjogJywgYXJyKTtcbiAgICByZXR1cm4gYXJyO1xuICAgIGZ1bmN0aW9uIGdldEVsZW1lbnQobm9kZSwgc2tpcENoaWxkcmVuKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdub2RlJywgbm9kZS5uYW1lKTtcbiAgICAgICAgbGV0IHJhc3Rlcml6ZSA9IGZhbHNlO1xuICAgICAgICBsZXQgb2JqID0ge1xuICAgICAgICAgICAgY2hpbGRyZW46IFtdLFxuICAgICAgICAgICAgdHlwZTogbnVsbCxcbiAgICAgICAgfTtcbiAgICAgICAgaWYgKG5vZGUubmFtZSAmJiBub2RlLm5hbWUuY2hhckF0KDApID09ICcqJykge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3Jhc3Rlcml6ZScsIG5vZGUpO1xuICAgICAgICAgICAgcmFzdGVyaXplTGlzdC5wdXNoKG5vZGUuaWQpO1xuICAgICAgICAgICAgcmFzdGVyaXplID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiBub2RlKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBlbGVtZW50ID0gbm9kZVtrZXldO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdjaGlsZHJlbicgJiYgIXNraXBDaGlsZHJlbiAmJiAhcmFzdGVyaXplKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBub2RlVG9PYmooZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT09ICdiYWNrZ3JvdW5kcycpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG5vZGVUb09iaihlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2ZpbGxzJyAmJiBlbGVtZW50Lmxlbmd0aCA+IDApIHsgLy8gYWRkIGltYWdlIGZpbGxzIHRvIHJhc3Rlcml6ZUxpc3RcbiAgICAgICAgICAgICAgICAgICAgbGV0IGhhc0ltYWdlRmlsbCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IGkgaW4gZWxlbWVudCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc3QgZmlsbCA9IGVsZW1lbnRbaV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZmlsbC50eXBlID09ICdJTUFHRScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoYXNJbWFnZUZpbGwgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ialsncmFzdGVyaXplJ10gPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdpbWFnZScsIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9iai50eXBlID0gJ1JFQ1RBTkdMRSdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm5cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAoaGFzSW1hZ2VGaWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByYXN0ZXJpemVMaXN0LnB1c2gobm9kZS5pZCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gY29ybmVyIHJhZGl1c1xuICAgICAgICAgICAgICAgIC8vIGlmIChrZXkgPT09ICdjb3JuZXJSYWRpdXMnKSB7XG4gICAgICAgICAgICAgICAgLy8gICAgIGNvbnNvbGUubG9nKGtleSwgIGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIC8vIH1cbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCA9PSBmaWdtYS5taXhlZCAmJiBrZXkgPT09ICdjb3JuZXJSYWRpdXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBNYXRoLm1pbihub2RlLnRvcExlZnRSYWRpdXMsIG5vZGUudG9wUmlnaHRSYWRpdXMsIG5vZGUuYm90dG9tTGVmdFJhZGl1cywgbm9kZS5ib3R0b21SaWdodFJhZGl1cyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHRyeSB0byBnZXQgdGhlIGZpcnN0IHZhbHVlIG9uIHRoZSB0ZXh0XG4gICAgICAgICAgICAgICAgaWYgKGVsZW1lbnQgPT0gZmlnbWEubWl4ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHN0ciA9ICdnZXRSYW5nZScgKyBrZXkucmVwbGFjZSgvXlxcdy8sIGMgPT4gYy50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBub2RlW3N0cl0oMCwgMSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBsYXllci5mb250TmFtZSAhPT0gKGZpZ21hLm1peGVkKSkgPyBsYXllci5mb250TmFtZS5mYW1pbHkgOiBsYXllci5nZXRSYW5nZUZvbnROYW1lKDAsMSkuZmFtaWx5XG4gICAgICAgICAgICAgICAgLy8gaWYgKGtleSA9PT0gJ3BhcmVudCcpIHsgY29uc29sZS5sb2coZWxlbWVudCk7IH1cbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGVsZW1lbnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRVJST1InLCBlcnJvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8ga2VlcCB0cmFjayBvZiBBdXRvLWxheW91dCBmcmFtZXMgZm9yIGFsaWdubWVudCBvZiBjaGlsZHJlblxuICAgICAgICBpZiAobm9kZS50eXBlID09PSAnRlJBTUUnICYmIG5vZGUubGF5b3V0TW9kZSAhPT0gJ05PTkUnKSB7XG4gICAgICAgICAgICBvYmoudHlwZSA9ICdBVVRPTEFZT1VUJztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb2JqO1xuICAgIH1cbiAgICBmdW5jdGlvbiBjb2xsZWN0SW1hZ2VIYXNoZXMoZWxlbWVudCwgaWQpIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2ltYWdlSGFzaCcsIGlkLCBlbGVtZW50KTtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIGVsZW1lbnQpIHtcbiAgICAgICAgICAgIGNvbnN0IGZpbGwgPSBlbGVtZW50W2ldO1xuICAgICAgICAgICAgaWYgKGZpbGwudHlwZSA9PSAnSU1BR0UnKSB7XG4gICAgICAgICAgICAgICAgaW1hZ2VIYXNoTGlzdC5wdXNoKHsgaGFzaDogZmlsbC5pbWFnZUhhc2gsIGlkIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuZnVuY3Rpb24gc3RvcmVJbWFnZURhdGEoaW1hZ2VIYXNoTGlzdCwgbGF5ZXJzLCByZWZJbWcpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnbGF5ZXJzJywgbGF5ZXJzKTtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIGltYWdlSGFzaExpc3QpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnRbaV0pO1xuICAgICAgICAgICAgY29uc3QgaGFzaCA9IGltYWdlSGFzaExpc3RbaV0uaGFzaDtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBpbWFnZUhhc2hMaXN0W2ldLmlkXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLzovZywgJy0nKSAvLyByZW1vdmUgY29sb25zXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xccyooXFwvfFxcXFwpXFxzKi9nLCAnLScpOyAvLyByZW1vdmUgc2xhc2hlc1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICBsZXQgaW1hZ2UgPSBmaWdtYS5nZXRJbWFnZUJ5SGFzaChoYXNoKTtcbiAgICAgICAgICAgICAgICBsZXQgYnl0ZXMgPSB5aWVsZCBpbWFnZS5nZXRCeXRlc0FzeW5jKCk7XG4gICAgICAgICAgICAgICAgaW1hZ2VCeXRlc0xpc3QucHVzaCh7IG5hbWUsIGJ5dGVzIH0pO1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGJ5dGVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikgeyB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGltYWdlQnl0ZXNMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2ZldGNoSW1hZ2VzQW5kQUVVWCcsIGltYWdlczogaW1hZ2VCeXRlc0xpc3QsIGRhdGE6IGxheWVycywgcmVmSW1nIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZmV0Y2hBRVVYJywgZGF0YTogbGF5ZXJzIH0pO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5mdW5jdGlvbiBmaW5kRnJhbWUobm9kZSkge1xuICAgIC8vIGNvbnNvbGUubG9nKCdub2RlOicsIG5vZGUpO1xuICAgIC8vIGNvbnNvbGUubG9nKCdub2RlLnR5cGU6Jywgbm9kZS50eXBlKTtcbiAgICB0cnkge1xuICAgICAgICBpZiAoKG5vZGUudHlwZSAhPT0gJ0ZSQU1FJyAmJiAhKG5vZGUudHlwZSA9PT0gJ0NPTVBPTkVOVCcgJiYgbm9kZS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSlcbiAgICAgICAgICAgIHx8IChub2RlLnR5cGUgPT09ICdGUkFNRScgJiYgbm9kZS5wYXJlbnQudHlwZSA9PT0gJ0ZSQU1FJykpIHtcbiAgICAgICAgICAgIC8vIGlmIChub2RlLnR5cGUgIT09ICdGUkFNRScgJiYgbm9kZS50eXBlICE9PSAnQ09NUE9ORU5UJykgeyAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIHJldHVybiBmaW5kRnJhbWUobm9kZS5wYXJlbnQpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaGFzRnJhbWVEYXRhID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiBub2RlO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdFcnJvciBpbiBmaW5kRnJhbWUoKSDwn5iWJywgbGF5ZXJDb3VudDogbnVsbCB9KTtcbiAgICB9XG59XG5mdW5jdGlvbiBhZGRNYWdpY1N0YXIoc2VsZWN0aW9uLCBsYXllckNvdW50KSB7XG4gICAgc2VsZWN0aW9uLmZvckVhY2goc2hhcGUgPT4ge1xuICAgICAgICBpZiAoc2hhcGUubmFtZS5jaGFyQXQoMCkgIT09ICcqJykge1xuICAgICAgICAgICAgc2hhcGUubmFtZSA9IGAqICR7c2hhcGUubmFtZX1gO1xuICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIGxheWVyQ291bnQ7XG59XG5mdW5jdGlvbiBmbGF0dGVuUmVjdXJzaXZlKHNlbGVjdGlvbiwgbGF5ZXJDb3VudCkge1xuICAgIHRyeSB7XG4gICAgICAgIHNlbGVjdGlvbi5mb3JFYWNoKHNoYXBlID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCd0cnkgZmxhdHRlbmluZycsIHNoYXBlKTtcbiAgICAgICAgICAgIGlmIChzaGFwZS50eXBlID09ICdCT09MRUFOX09QRVJBVElPTicpIHtcbiAgICAgICAgICAgICAgICBmaWdtYS5mbGF0dGVuKFtzaGFwZV0pO1xuICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNoYXBlLmNvcm5lclJhZGl1cyA9PSBmaWdtYS5taXhlZCB8fCBzaGFwZS5jb3JuZXJSYWRpdXMgPiAwKSB7XG4gICAgICAgICAgICAgICAgLy8gZmxhdHRlbiByb3VuZGVkIGNvcm5lcnNcbiAgICAgICAgICAgICAgICBmaWdtYS5mbGF0dGVuKFtzaGFwZV0pO1xuICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHNoYXBlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgbGF5ZXJDb3VudCA9IGZsYXR0ZW5SZWN1cnNpdmUoc2hhcGUuY2hpbGRyZW4sIGxheWVyQ291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHQgPSBzaGFwZS5yZWxhdGl2ZVRyYW5zZm9ybTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2hhcGUudHlwZScsIHNoYXBlLnR5cGUpO1xuICAgICAgICAgICAgICAgIC8vLyBjaGVjayBmb3IgdHJhbnNmb3Jtc1xuICAgICAgICAgICAgICAgIGlmICh0WzBdWzBdLnRvRml4ZWQoNikgIT0gMSB8fFxuICAgICAgICAgICAgICAgICAgICB0WzBdWzFdLnRvRml4ZWQoNikgIT0gMCB8fFxuICAgICAgICAgICAgICAgICAgICB0WzFdWzBdLnRvRml4ZWQoNikgIT0gMCB8fFxuICAgICAgICAgICAgICAgICAgICB0WzFdWzFdLnRvRml4ZWQoNikgIT0gMSB8fFxuICAgICAgICAgICAgICAgICAgICBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS5mbGF0dGVuKFtzaGFwZV0pO1xuICAgICAgICAgICAgICAgICAgICBsYXllckNvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2UgaWYgKHNoYXBlLnR5cGUgPT0gJ1RFWFQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oW3NoYXBlXSk7XG4gICAgICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gbGF5ZXJDb3VudDtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGxheWVyQ291bnQ7XG4gICAgfVxufVxuZnVuY3Rpb24gcmFzdGVyaXplU2VsZWN0aW9uKHNlbGVjdGlvbiwgbGF5ZXJDb3VudCkge1xuICAgIHRyeSB7XG4gICAgICAgIGxldCBuZXdTZWxlY3Rpb24gPSBbXTtcbiAgICAgICAgc2VsZWN0aW9uLmZvckVhY2goc2hhcGUgPT4ge1xuICAgICAgICAgICAgaWYgKHNoYXBlLnR5cGUgPT0gJ0dST1VQJykge1xuICAgICAgICAgICAgICAgIGxldCBpbWdTY2FsZSA9IE1hdGgubWluKDQwMDAgLyBNYXRoLm1heChzaGFwZS53aWR0aCwgc2hhcGUuaGVpZ2h0KSwgNik7IC8vIGxpbWl0IGl0IHRvIDQwMDBweFxuICAgICAgICAgICAgICAgIC8vIGFsZXJ0KGltZ1NjYWxlKSAgICAgICBcbiAgICAgICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcIlBOR1wiLFxuICAgICAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7IHR5cGU6IFwiU0NBTEVcIiwgdmFsdWU6IGltZ1NjYWxlIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGxldCBzaGFwZVRyYW5zZm9ybSA9IHNoYXBlLnJlbGF0aXZlVHJhbnNmb3JtOyAvLyBzdG9yZSB0cmFuc2Zvcm1cbiAgICAgICAgICAgICAgICBsZXQgcmVtb3ZlVHJhbnNmb3JtID0gW1sxLCAwLCBzaGFwZS54XSwgWzAsIDEsIHNoYXBlLnldXTtcbiAgICAgICAgICAgICAgICBzaGFwZS5yZWxhdGl2ZVRyYW5zZm9ybSA9IHJlbW92ZVRyYW5zZm9ybTtcbiAgICAgICAgICAgICAgICBzaGFwZS5leHBvcnRBc3luYyhvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgICAudGhlbihpbWcgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhmaWdtYS5jcmVhdGVJbWFnZShpbWcpKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlY3QgPSBmaWdtYS5jcmVhdGVSZWN0YW5nbGUoKTtcbiAgICAgICAgICAgICAgICAgICAgc2hhcGUucGFyZW50LmFwcGVuZENoaWxkKHJlY3QpO1xuICAgICAgICAgICAgICAgICAgICByZWN0LnggPSBzaGFwZS54O1xuICAgICAgICAgICAgICAgICAgICByZWN0LnkgPSBzaGFwZS55O1xuICAgICAgICAgICAgICAgICAgICByZWN0LnJlbGF0aXZlVHJhbnNmb3JtID0gc2hhcGVUcmFuc2Zvcm07XG4gICAgICAgICAgICAgICAgICAgIHJlY3QubmFtZSA9IHNoYXBlLm5hbWUgKyAnX3Jhc3Rlcml6ZSc7XG4gICAgICAgICAgICAgICAgICAgIHJlY3QucmVzaXplKHNoYXBlLndpZHRoLCBzaGFwZS5oZWlnaHQpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgZmlsbE9iaiA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocmVjdC5maWxsc1swXSkpO1xuICAgICAgICAgICAgICAgICAgICBmaWxsT2JqLmZpbHRlcnMgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250cmFzdDogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cG9zdXJlOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgaGlnaGxpZ2h0czogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdHVyYXRpb246IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dzOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGVtcGVyYXR1cmU6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW50OiAwLFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICBmaWxsT2JqLmltYWdlSGFzaCA9IGZpZ21hLmNyZWF0ZUltYWdlKGltZykuaGFzaDtcbiAgICAgICAgICAgICAgICAgICAgZmlsbE9iai5pbWFnZVRyYW5zZm9ybSA9IFtbMSwgMCwgMF0sIFswLCAxLCAwXV07XG4gICAgICAgICAgICAgICAgICAgIGZpbGxPYmouc2NhbGVNb2RlID0gXCJDUk9QXCI7XG4gICAgICAgICAgICAgICAgICAgIGZpbGxPYmoudHlwZSA9IFwiSU1BR0VcIjtcbiAgICAgICAgICAgICAgICAgICAgZmlsbE9iai5zY2FsaW5nRmFjdG9yID0gMC41LFxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGZpbGxPYmouY29sb3I7XG4gICAgICAgICAgICAgICAgICAgIHJlY3QuZmlsbHMgPSBbZmlsbE9ial07XG4gICAgICAgICAgICAgICAgICAgIG5ld1NlbGVjdGlvbi5wdXNoKHJlY3QpO1xuICAgICAgICAgICAgICAgICAgICBzaGFwZS5yZWxhdGl2ZVRyYW5zZm9ybSA9IHNoYXBlVHJhbnNmb3JtO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4geyBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBuZXdTZWxlY3Rpb247IH0sIDUwKTtcbiAgICAgICAgcmV0dXJuIGxheWVyQ291bnQ7XG4gICAgfVxuICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgIHJldHVybiBsYXllckNvdW50O1xuICAgIH1cbn1cbmZ1bmN0aW9uIGdlbmVyYXRlRnJhbWVJbWFnZSgpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IGZpcnN0U2VsZWN0ZWQgPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF07XG4gICAgICAgICAgICBsZXQgcGFyZW50RnJhbWUgPSBmaW5kRnJhbWUoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uWzBdKTtcbiAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIGZvcm1hdDogXCJQTkdcIixcbiAgICAgICAgICAgICAgICBjb25zdHJhaW50OiB7IHR5cGU6IFwiU0NBTEVcIiwgdmFsdWU6IDYgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHBhcmVudEZyYW1lLmV4cG9ydEFzeW5jKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgLnRoZW4oaW1nID0+IHtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnaHNhZGpmaGprYWhzZGYnLCBpbWcpO1xuICAgICAgICAgICAgICAgIHJldHVybiBmaWdtYS5jcmVhdGVJbWFnZShpbWcpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ==