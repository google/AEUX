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
        console.log('imageHashList', imageHashList);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MsaUNBQWlDO0FBQ3ZFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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QUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsU0FBUztBQUNULDBCQUEwQiw0Q0FBNEMsRUFBRTtBQUN4RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCIsImZpbGUiOiJjb2RlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvY29kZS50c1wiKTtcbiIsInZhciBfX2F3YWl0ZXIgPSAodGhpcyAmJiB0aGlzLl9fYXdhaXRlcikgfHwgZnVuY3Rpb24gKHRoaXNBcmcsIF9hcmd1bWVudHMsIFAsIGdlbmVyYXRvcikge1xuICAgIHJldHVybiBuZXcgKFAgfHwgKFAgPSBQcm9taXNlKSkoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICBmdW5jdGlvbiBmdWxmaWxsZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3IubmV4dCh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxuICAgICAgICBmdW5jdGlvbiBzdGVwKHJlc3VsdCkgeyByZXN1bHQuZG9uZSA/IHJlc29sdmUocmVzdWx0LnZhbHVlKSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUocmVzdWx0LnZhbHVlKTsgfSkudGhlbihmdWxmaWxsZWQsIHJlamVjdGVkKTsgfVxuICAgICAgICBzdGVwKChnZW5lcmF0b3IgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSkpLm5leHQoKSk7XG4gICAgfSk7XG59O1xuZmlnbWEuc2hvd1VJKF9faHRtbF9fLCB7IHdpZHRoOiAxNjYsIGhlaWdodDogMTgwIH0pO1xubGV0IGhhc0ZyYW1lRGF0YTtcbmxldCBzaGFwZVRyZWUgPSBbXTtcbmxldCBpbWFnZUhhc2hMaXN0ID0gW107XG5sZXQgaW1hZ2VCeXRlc0xpc3QgPSBbXTtcbmxldCByYXN0ZXJpemVMaXN0ID0gW107XG5sZXQgcHJlZnMgPSB7XG4gICAgZXhwb3J0UmVmSW1hZ2U6IGZhbHNlLFxuICAgIGltZ1NhdmVEaWFsb2c6IGZhbHNlLFxufTtcbi8vIHJlY2VpdmUgbWVzc2FnZSBmcm9tIHRoZSBVSVxuZmlnbWEudWkub25tZXNzYWdlID0gbWVzc2FnZSA9PiB7XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2dldFByZWZzJykge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnZ2V0IHRob3NlIHByZWZzJyk7XG4gICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2UuZ2V0QXN5bmMoJ2FldXgucHJlZnMnKVxuICAgICAgICAgICAgLnRoZW4ocHJlZnMgPT4ge1xuICAgICAgICAgICAgaWYgKHByZWZzKSB7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAncmV0UHJlZnMnLCBwcmVmczogcHJlZnMgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByZWZzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2dvdHRhIHNhdmUgbmV3IHByZWZzJywgbWVzc2FnZS5kZWZhdWx0UHJlZnMpO1xuICAgICAgICAgICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ2FldXgucHJlZnMnLCBtZXNzYWdlLmRlZmF1bHRQcmVmcylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdyZXRQcmVmcycsIHByZWZzOiBtZXNzYWdlLmRlZmF1bHRQcmVmcyB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gbWVzc2FnZS5kZWZhdWx0UHJlZnM7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbih1c2VyUHJlZnMgPT4ge1xuICAgICAgICAgICAgcHJlZnMgPSB1c2VyUHJlZnM7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnc2V0UHJlZnMnKSB7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdzYXZlIHRob3NlIHByZWZzJywgbWVzc2FnZS5wcmVmcyk7XG4gICAgICAgIGZpZ21hLmNsaWVudFN0b3JhZ2Uuc2V0QXN5bmMoJ2FldXgucHJlZnMnLCBtZXNzYWdlLnByZWZzKVxuICAgICAgICAgICAgLnRoZW4ocmV0ID0+IHtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKG1lc3NhZ2UucHJlZnMpO1xuICAgICAgICAgICAgcHJlZnMgPSBtZXNzYWdlLnByZWZzOyAvLyBzdG9yZSB0aGUgcHJlZnMgbG9jYWxseVxuICAgICAgICB9KTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2V4cG9ydENhbmNlbCcpIHtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2V4cG9ydFNlbGVjdGlvbicpIHtcbiAgICAgICAgaGFzRnJhbWVEYXRhID0gZmFsc2U7XG4gICAgICAgIHNoYXBlVHJlZSA9IFtdO1xuICAgICAgICBpbWFnZUhhc2hMaXN0ID0gW107XG4gICAgICAgIGltYWdlQnl0ZXNMaXN0ID0gW107XG4gICAgICAgIHJhc3Rlcml6ZUxpc3QgPSBbXTtcbiAgICAgICAgbGV0IGV4cG9ydEpTT04gPSBmYWxzZTtcbiAgICAgICAgaWYgKG1lc3NhZ2UuZXhwb3J0SlNPTikge1xuICAgICAgICAgICAgZXhwb3J0SlNPTiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgLy8gbm90aGluZyBzZWxlY3RlZFxuICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2ZldGNoQUVVWCcsIGRhdGE6IG51bGwgfSk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIC8vIHByZS1wcm9jZXNzIHRoZSBzZWxlY3RlZCBzaGFwZXMgaGllcmFyY2h5XG4gICAgICAgICAgICBsZXQgc2VsZWN0aW9uID0gbm9kZVRvT2JqKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbik7XG4gICAgICAgICAgICBpZiAoc2hhcGVUcmVlWzBdLmNoaWxkcmVuLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICBzaGFwZVRyZWVbMF0uY2hpbGRyZW4gPSBzZWxlY3Rpb247XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnc2hhcGVUcmVlOiAnLCBzaGFwZVRyZWUpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdGVkIGxheWVycyBuZWVkIHRvIGJlIGluc2lkZSBvZiBhIGZyYW1lJyk7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdMYXllcnMgbXVzdCBiZSBpbnNpZGUgb2YgYSBmcmFtZScsIGxheWVyQ291bnQ6IG51bGwgfSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlZkltZyA9IG51bGwsIHRlbXBHcm91cCwgcGFyZW50RnJhbWU7XG4gICAgICAgIGlmIChwcmVmcy5leHBvcnRSZWZJbWFnZSkgeyAvLyBpbmNsdWRlIGEgcmVmZXJlbmNlIGltYWdlIHdpdGggdHJhbnNmZXJcbiAgICAgICAgICAgIHBhcmVudEZyYW1lID0gZmluZEZyYW1lKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXSk7XG4gICAgICAgICAgICBsZXQgcGFyZW50RnJhbWVOYW1lID0gcGFyZW50RnJhbWUubmFtZS5yZXBsYWNlKC9cXHMqKFxcL3xcXFxcKVxccyovZywgJy0nKTtcbiAgICAgICAgICAgIC8vIGdyb3VwIGFuZCBtYXNrXG4gICAgICAgICAgICBsZXQgbWFzayA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xuICAgICAgICAgICAgbWFzay54ID0gcGFyZW50RnJhbWUueDtcbiAgICAgICAgICAgIG1hc2sueSA9IHBhcmVudEZyYW1lLnk7XG4gICAgICAgICAgICBtYXNrLnJlc2l6ZShwYXJlbnRGcmFtZS53aWR0aCwgcGFyZW50RnJhbWUuaGVpZ2h0KTtcbiAgICAgICAgICAgIHRlbXBHcm91cCA9IGZpZ21hLmdyb3VwKFttYXNrXSwgbWFzay5wYXJlbnQpO1xuICAgICAgICAgICAgdGVtcEdyb3VwLmFwcGVuZENoaWxkKHBhcmVudEZyYW1lKTtcbiAgICAgICAgICAgIG1hc2suaXNNYXNrID0gdHJ1ZTtcbiAgICAgICAgICAgIHJhc3Rlcml6ZUxpc3QucHVzaChwYXJlbnRGcmFtZS5pZCk7XG4gICAgICAgICAgICByZWZJbWcgPSB7XG4gICAgICAgICAgICAgICAgdHlwZTogJ0ltYWdlJyxcbiAgICAgICAgICAgICAgICBuYW1lOiBwYXJlbnRGcmFtZU5hbWUsXG4gICAgICAgICAgICAgICAgaWQ6IHBhcmVudEZyYW1lLmlkLnJlcGxhY2UoLzovZywgJy0nKSxcbiAgICAgICAgICAgICAgICBmcmFtZTogeyB4OiBwYXJlbnRGcmFtZS53aWR0aCAvIDIsIHk6IHBhcmVudEZyYW1lLmhlaWdodCAvIDIsIHdpZHRoOiBwYXJlbnRGcmFtZS53aWR0aCwgaGVpZ2h0OiBwYXJlbnRGcmFtZS5oZWlnaHQgfSxcbiAgICAgICAgICAgICAgICBpc1Zpc2libGU6IHRydWUsXG4gICAgICAgICAgICAgICAgb3BhY2l0eTogNTAsXG4gICAgICAgICAgICAgICAgYmxlbmRNb2RlOiAnQmxlbmRpbmdNb2RlLk5PUk1BTCcsXG4gICAgICAgICAgICAgICAgaXNNYXNrOiBmYWxzZSxcbiAgICAgICAgICAgICAgICByb3RhdGlvbjogMCxcbiAgICAgICAgICAgICAgICBndWlkZTogdHJ1ZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJhc3Rlcml6ZUxpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmFzdGVyaXplTGlzdCA9IFsuLi5uZXcgU2V0KHJhc3Rlcml6ZUxpc3QpXTsgLy8gcmVtb3ZlIGR1cGxpY2F0ZXNcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdSQVNURVJJWkVMSVNUJywgcmFzdGVyaXplTGlzdCk7XG4gICAgICAgICAgICBmdW5jdGlvbiBjbG9uZSh2YWwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeSh2YWwpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZ1bmN0aW9uIGFzeW5jQ29sbGVjdEhhc2hlcyhpZCwgY2IpIHtcbiAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2RvbmUgd2l0aCcsIGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICBsZXQgc2hhcGUgPSBmaWdtYS5nZXROb2RlQnlJZChpZCk7XG4gICAgICAgICAgICAgICAgICAgIC8vIGRpc2FibGUgZWZmZWN0c1xuICAgICAgICAgICAgICAgICAgICBsZXQgZWZmZWN0VmlzTGlzdCA9IFtdOyAvLyB0byBzdG9yZSB0aGUgZWZmZWN0IHZpc2liaWxpdHlcbiAgICAgICAgICAgICAgICAgICAgbGV0IGVmZmVjdHM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzaGFwZS5lZmZlY3RzKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3RzID0gY2xvbmUoc2hhcGUuZWZmZWN0cyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3RzLmZvckVhY2goZWZmZWN0ID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3RWaXNMaXN0LnB1c2goZWZmZWN0LnZpc2libGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlZmZlY3QudHlwZSA9PSAnRFJPUF9TSEFET1cnIHx8IGVmZmVjdC50eXBlID09ICdMQVlFUl9CTFVSJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlZmZlY3QudmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hhcGUuZWZmZWN0cyA9IGVmZmVjdHM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgbGV0IGNvbXBNdWx0ID0gMztcbiAgICAgICAgICAgICAgICAgICAgbGV0IGltZ1NjYWxlID0gTWF0aC5taW4oMzUwMCAvIE1hdGgubWF4KHNoYXBlLndpZHRoLCBzaGFwZS5oZWlnaHQpLCBjb21wTXVsdCk7IC8vIGxpbWl0IGl0IHRvIDQwMDBweFxuICAgICAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnSU1BR0VTQ0FMRScsIGltZ1NjYWxlLCBzaGFwZSk7XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlLmV4cG9ydEFzeW5jKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdDogXCJQTkdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQ6IHsgdHlwZTogXCJTQ0FMRVwiLCB2YWx1ZTogaW1nU2NhbGUgfVxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oaW1nID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlSGFzaExpc3QucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGFzaDogZmlnbWEuY3JlYXRlSW1hZ2UoaW1nKS5oYXNoLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBgJHtzaGFwZS5uYW1lLnJlcGxhY2UoL15cXCpcXHMvLCAnJykucmVwbGFjZSgvXlxcKi8sICcnKX1fJHtpZH1gXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlLWVuYWJsZSBlZmZlY3RzIFxuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGVmZmVjdFZpc0xpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVmZmVjdHNbaV0udmlzaWJsZSA9IGVmZmVjdFZpc0xpc3RbaV07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2hhcGUuZWZmZWN0cyA9IGVmZmVjdHM7XG4gICAgICAgICAgICAgICAgICAgIGNiKCk7XG4gICAgICAgICAgICAgICAgfSwgMTAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCByZXF1ZXN0cyA9IHJhc3Rlcml6ZUxpc3QubWFwKChpdGVtKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGFzeW5jQ29sbGVjdEhhc2hlcyhpdGVtLCByZXNvbHZlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgUHJvbWlzZS5hbGwocmVxdWVzdHMpXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gc3RvcmVJbWFnZURhdGEoaW1hZ2VIYXNoTGlzdCwgc2hhcGVUcmVlLCByZWZJbWcpKVxuICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgdGhlIHJlZmVyZW5jZSBtYXNrXG4gICAgICAgICAgICAgICAgdGVtcEdyb3VwLnBhcmVudC5hcHBlbmRDaGlsZChwYXJlbnRGcmFtZSk7XG4gICAgICAgICAgICAgICAgdGVtcEdyb3VwLnJlbW92ZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBjaGVjayBpZiBpbWFnZXMgbmVlZCB0byBleHBvcnQgdGhlbiBzZW5kIG1lc3NhZ2UgdG8gdWkudHNcbiAgICAgICAgICAgIGlmIChleHBvcnRKU09OKSB7XG4gICAgICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZXhwb3J0QUVVWCcsIGRhdGE6IHNoYXBlVHJlZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKGltYWdlSGFzaExpc3QubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2ZldGNoQUVVWCcsIGRhdGE6IHNoYXBlVHJlZSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHN0b3JlSW1hZ2VEYXRhKGltYWdlSGFzaExpc3QsIHNoYXBlVHJlZSwgbnVsbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coJ2ltYWdlSGFzaExpc3QnLCBpbWFnZUhhc2hMaXN0KTtcbiAgICB9XG4gICAgaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2FkZFJhc3Rlcml6ZUZsYWcnKSB7XG4gICAgICAgIGlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24ubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIG5vdGhpbmcgc2VsZWN0ZWRcbiAgICAgICAgLy8gbGV0IHNlbGVjdGlvbiA9IG5vZGVUb09iaihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pXG4gICAgICAgIGxldCBsYXllckNvdW50ID0gYWRkTWFnaWNTdGFyKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiwgMCkgfHwgMDtcbiAgICAgICAgLy8gcmVzZWxlY3QgbGF5ZXJzXG4gICAgICAgIGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbjtcbiAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZm9vdGVyTXNnJywgYWN0aW9uOiAnbWFya2VkIGFzIFBORycsIGxheWVyQ291bnQgfSk7XG4gICAgfVxuICAgIC8vIGlmIChtZXNzYWdlLnR5cGUgPT09ICdmbGF0dGVuTGF5ZXJzJykge1xuICAgIC8vICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHsgcmV0dXJuIH0gICAgICAvLyBub3RoaW5nIHNlbGVjdGVkXG4gICAgLy8gICAgIC8vIGxldCBzZWxlY3Rpb24gPSBub2RlVG9PYmooZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKVxuICAgIC8vICAgICBsZXQgbGF5ZXJDb3VudCA9IGZsYXR0ZW5SZWN1cnNpdmUoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLCAwKSB8fCAwXG4gICAgLy8gICAgIC8vIHJlc2VsZWN0IGxheWVyc1xuICAgIC8vICAgICBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24gPSBmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25cbiAgICAvLyAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe3R5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdmbGF0dGVuZWQnLCBsYXllckNvdW50fSk7XG4gICAgLy8gfVxuICAgIC8vIGlmIChtZXNzYWdlLnR5cGUgPT09ICdyYXN0ZXJpemVTZWxlY3Rpb24nKSB7XG4gICAgLy8gICAgIGlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24ubGVuZ3RoIDwgMSkgeyByZXR1cm4gfSAgICAgIC8vIG5vdGhpbmcgc2VsZWN0ZWRcbiAgICAvLyAgICAgLy8gbGV0IHNlbGVjdGlvbiA9IG5vZGVUb09iaihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pXG4gICAgLy8gICAgIGxldCBsYXllckNvdW50ID0gcmFzdGVyaXplU2VsZWN0aW9uKGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiwgMCkgfHwgMFxuICAgIC8vICAgICAvLyBjb25zb2xlLmxvZygnbGF5ZXJDb3VudCcsIGxheWVyQ291bnQpO1xuICAgIC8vICAgICAvLyByZXNlbGVjdCBsYXllcnNcbiAgICAvLyAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uXG4gICAgLy8gICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHt0eXBlOiAnZm9vdGVyTXNnJywgYWN0aW9uOiAncmFzdGVyaXplZCcsIGxheWVyQ291bnR9KTtcbiAgICAvLyB9XG4gICAgLy8gaWYgKG1lc3NhZ2UudHlwZSA9PT0gJ2RldGFjaENvbXBvbmVudHMnKSB7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCdkZXRhY2hDb21wb25lbnRzJyk7XG4gICAgLy8gICAgIGxldCBsYXllckNvdW50ID0gNDtcbiAgICAvLyAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2Uoe3R5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdmbGF0dGVuZWQnLCBsYXllckNvdW50fSk7XG4gICAgLy8gfVxuICAgIC8vQ29tbXVuaWNhdGUgYmFjayB0byB0aGUgVUlcbiAgICAvLyBjb25zb2xlLmxvZygnc2VuZCBtZXNzYWdlIGJhY2sgdG8gdWknKTtcbn07XG5mdW5jdGlvbiBub2RlVG9PYmoobm9kZXMpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdub2RlcycsIG5vZGVzKTtcbiAgICBpZiAobm9kZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKG5vZGVzWzBdLnR5cGUpO1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICAvLyBsb29rIGZvciB0aGUgcGFyZW50IGZyYW1lIG9mIGV2ZXJ5dGhpbmcgZXhjZXB0IHJlZ3VsYXIgKG5vbi1hdXRvTGF5b3V0KSBmcmFtZXMgYW5kIGxvb3NlIGNvbXBvbmVudHNcbiAgICBpZiAobm9kZXNbMF0gJiYgKChub2Rlc1swXS50eXBlID09PSAnRlJBTUUnICYmIG5vZGVzWzBdLnBhcmVudC50eXBlID09PSAnUEFHRScpIHx8XG4gICAgICAgIC8vIChub2Rlc1swXS50eXBlID09PSAnRlJBTUUnICYmIG5vZGVzWzBdLmxheW91dE1vZGUgPT09ICdOT05FJykgfHwgXG4gICAgICAgIChub2Rlc1swXS50eXBlID09PSAnQ09NUE9ORU5UJyAmJiBub2Rlc1swXS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSkpIHsgLy8gYSBmcmFtZSBvciBhIGNvbXBvbmVudCBtYXN0ZXIgb3V0c2lkZSBvZiBhIGZyYW1lIGlzIGRpcmVjdGx5IHNlbGVjdGVkXG4gICAgICAgIGNvbnNvbGUubG9nKCdHT1QgQSBGUkFNRScpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhub2Rlc1swXS5jaGlsZHJlbik7XG4gICAgICAgIGhhc0ZyYW1lRGF0YSA9IHRydWU7IC8vIGRvbnQgbmVlZCB0byBnZXQgdGhlIGZyYW1lIGRhdGFcbiAgICAgICAgc2hhcGVUcmVlLnB1c2goZ2V0RWxlbWVudChub2Rlc1swXSwgZmFsc2UpKTtcbiAgICAgICAgbm9kZXMgPSBub2Rlc1swXS5jaGlsZHJlbjtcbiAgICB9XG4gICAgLy8gZ2V0IHNoYXBlcyBcbiAgICBpZiAobm9kZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIG5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgIC8vIGdldCB0aGUgZnJhbWUgZGF0YVxuICAgICAgICBpZiAoIWhhc0ZyYW1lRGF0YSkge1xuICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50LnR5cGUgPT09ICdQQUdFJykge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH0gLy8gbGF5ZXIgaXMgb3V0c2lkZSBvZiBhIGZyYW1lIFxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2dldCB0aGUgZnJhbWUgZGF0YScpO1xuICAgICAgICAgICAgbGV0IGZyYW1lID0gZmluZEZyYW1lKG5vZGUpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ZyYW1lOicsIGZyYW1lKTtcbiAgICAgICAgICAgIGxldCBmcmFtZURhdGEgPSBnZXRFbGVtZW50KGZyYW1lLCB0cnVlKTsgLy8gc2tpcCBnYXRoZXJpbmcgY2hpbGRyZW4gZGF0YVxuICAgICAgICAgICAgZnJhbWVEYXRhLmNoaWxkcmVuID0gW107IC8vIGNsZWFyIHRoZSBjaGlsZHJlbiBvZiB0aGUgZnJhbWUgdG8gcHVzaCB0aGVtIGxhdGVyXG4gICAgICAgICAgICBzaGFwZVRyZWUucHVzaChmcmFtZURhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBvYmogPSBnZXRFbGVtZW50KG5vZGUsIGZhbHNlKTtcbiAgICAgICAgYXJyLnB1c2gob2JqKTtcbiAgICB9KTtcbiAgICAvLyBjb25zb2xlLmxvZygnYXJyOiAnLCBhcnIpO1xuICAgIHJldHVybiBhcnI7XG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudChub2RlLCBza2lwQ2hpbGRyZW4pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ25vZGUnLCBub2RlLm5hbWUpO1xuICAgICAgICBsZXQgcmFzdGVyaXplID0gZmFsc2U7XG4gICAgICAgIGxldCBvYmogPSB7XG4gICAgICAgICAgICBjaGlsZHJlbjogW10sXG4gICAgICAgICAgICB0eXBlOiBudWxsLFxuICAgICAgICB9O1xuICAgICAgICBpZiAobm9kZS5uYW1lICYmIG5vZGUubmFtZS5jaGFyQXQoMCkgPT0gJyonKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygncmFzdGVyaXplJywgbm9kZSk7XG4gICAgICAgICAgICByYXN0ZXJpemVMaXN0LnB1c2gobm9kZS5pZCk7XG4gICAgICAgICAgICByYXN0ZXJpemUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIG5vZGUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBub2RlW2tleV07XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2NoaWxkcmVuJyAmJiAhc2tpcENoaWxkcmVuICYmICFyYXN0ZXJpemUpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG5vZGVUb09iaihlbGVtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2JhY2tncm91bmRzJykge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbm9kZVRvT2JqKGVsZW1lbnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsbHMnICYmIGVsZW1lbnQubGVuZ3RoID4gMCkgeyAvLyBhZGQgaW1hZ2UgZmlsbHMgdG8gcmFzdGVyaXplTGlzdFxuICAgICAgICAgICAgICAgICAgICBsZXQgaGFzSW1hZ2VGaWxsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoY29uc3QgaSBpbiBlbGVtZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zdCBmaWxsID0gZWxlbWVudFtpXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChmaWxsLnR5cGUgPT0gJ0lNQUdFJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhhc0ltYWdlRmlsbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqWydyYXN0ZXJpemUnXSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJ2ltYWdlJywgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gb2JqLnR5cGUgPSAnUkVDVEFOR0xFJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHJldHVyblxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmIChoYXNJbWFnZUZpbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJhc3Rlcml6ZUxpc3QucHVzaChub2RlLmlkKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjb3JuZXIgcmFkaXVzXG4gICAgICAgICAgICAgICAgLy8gaWYgKGtleSA9PT0gJ2Nvcm5lclJhZGl1cycpIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2coa2V5LCAgZWxlbWVudCk7XG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIGlmIChlbGVtZW50ID09IGZpZ21hLm1peGVkICYmIGtleSA9PT0gJ2Nvcm5lclJhZGl1cycpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IE1hdGgubWluKG5vZGUudG9wTGVmdFJhZGl1cywgbm9kZS50b3BSaWdodFJhZGl1cywgbm9kZS5ib3R0b21MZWZ0UmFkaXVzLCBub2RlLmJvdHRvbVJpZ2h0UmFkaXVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gdHJ5IHRvIGdldCB0aGUgZmlyc3QgdmFsdWUgb24gdGhlIHRleHRcbiAgICAgICAgICAgICAgICBpZiAoZWxlbWVudCA9PSBmaWdtYS5taXhlZCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgc3RyID0gJ2dldFJhbmdlJyArIGtleS5yZXBsYWNlKC9eXFx3LywgYyA9PiBjLnRvVXBwZXJDYXNlKCkpO1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IG5vZGVbc3RyXSgwLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIGxheWVyLmZvbnROYW1lICE9PSAoZmlnbWEubWl4ZWQpKSA/IGxheWVyLmZvbnROYW1lLmZhbWlseSA6IGxheWVyLmdldFJhbmdlRm9udE5hbWUoMCwxKS5mYW1pbHlcbiAgICAgICAgICAgICAgICAvLyBpZiAoa2V5ID09PSAncGFyZW50JykgeyBjb25zb2xlLmxvZyhlbGVtZW50KTsgfVxuICAgICAgICAgICAgICAgIG9ialtrZXldID0gZWxlbWVudDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFUlJPUicsIGVycm9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIEF1dG8tbGF5b3V0IGZyYW1lcyBmb3IgYWxpZ25tZW50IG9mIGNoaWxkcmVuXG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdGUkFNRScgJiYgbm9kZS5sYXlvdXRNb2RlICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgIG9iai50eXBlID0gJ0FVVE9MQVlPVVQnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbGxlY3RJbWFnZUhhc2hlcyhlbGVtZW50LCBpZCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnaW1hZ2VIYXNoJywgaWQsIGVsZW1lbnQpO1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gZWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgZmlsbCA9IGVsZW1lbnRbaV07XG4gICAgICAgICAgICBpZiAoZmlsbC50eXBlID09ICdJTUFHRScpIHtcbiAgICAgICAgICAgICAgICBpbWFnZUhhc2hMaXN0LnB1c2goeyBoYXNoOiBmaWxsLmltYWdlSGFzaCwgaWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzdG9yZUltYWdlRGF0YShpbWFnZUhhc2hMaXN0LCBsYXllcnMsIHJlZkltZykge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdsYXllcnMnLCBsYXllcnMpO1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gaW1hZ2VIYXNoTGlzdCkge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudFtpXSk7XG4gICAgICAgICAgICBjb25zdCBoYXNoID0gaW1hZ2VIYXNoTGlzdFtpXS5oYXNoO1xuICAgICAgICAgICAgY29uc3QgbmFtZSA9IGltYWdlSGFzaExpc3RbaV0uaWRcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvOi9nLCAnLScpIC8vIHJlbW92ZSBjb2xvbnNcbiAgICAgICAgICAgICAgICAucmVwbGFjZSgvXFxzKihcXC98XFxcXClcXHMqL2csICctJyk7IC8vIHJlbW92ZSBzbGFzaGVzXG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIGxldCBpbWFnZSA9IGZpZ21hLmdldEltYWdlQnlIYXNoKGhhc2gpO1xuICAgICAgICAgICAgICAgIGxldCBieXRlcyA9IHlpZWxkIGltYWdlLmdldEJ5dGVzQXN5bmMoKTtcbiAgICAgICAgICAgICAgICBpbWFnZUJ5dGVzTGlzdC5wdXNoKHsgbmFtZSwgYnl0ZXMgfSk7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYnl0ZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7IH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoaW1hZ2VCeXRlc0xpc3QubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgZmlnbWEudWkucG9zdE1lc3NhZ2UoeyB0eXBlOiAnZmV0Y2hJbWFnZXNBbmRBRVVYJywgaW1hZ2VzOiBpbWFnZUJ5dGVzTGlzdCwgZGF0YTogbGF5ZXJzLCByZWZJbWcgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmZXRjaEFFVVgnLCBkYXRhOiBsYXllcnMgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZpbmRGcmFtZShub2RlKSB7XG4gICAgLy8gY29uc29sZS5sb2coJ25vZGU6Jywgbm9kZSk7XG4gICAgLy8gY29uc29sZS5sb2coJ25vZGUudHlwZTonLCBub2RlLnR5cGUpO1xuICAgIHRyeSB7XG4gICAgICAgIGlmICgobm9kZS50eXBlICE9PSAnRlJBTUUnICYmICEobm9kZS50eXBlID09PSAnQ09NUE9ORU5UJyAmJiBub2RlLnBhcmVudC50eXBlID09PSAnUEFHRScpKVxuICAgICAgICAgICAgfHwgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2RlLnBhcmVudC50eXBlID09PSAnRlJBTUUnKSkge1xuICAgICAgICAgICAgLy8gaWYgKG5vZGUudHlwZSAhPT0gJ0ZSQU1FJyAmJiBub2RlLnR5cGUgIT09ICdDT01QT05FTlQnKSB7ICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgcmV0dXJuIGZpbmRGcmFtZShub2RlLnBhcmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoYXNGcmFtZURhdGEgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ0Vycm9yIGluIGZpbmRGcmFtZSgpIPCfmJYnLCBsYXllckNvdW50OiBudWxsIH0pO1xuICAgIH1cbn1cbmZ1bmN0aW9uIGFkZE1hZ2ljU3RhcihzZWxlY3Rpb24sIGxheWVyQ291bnQpIHtcbiAgICBzZWxlY3Rpb24uZm9yRWFjaChzaGFwZSA9PiB7XG4gICAgICAgIGlmIChzaGFwZS5uYW1lLmNoYXJBdCgwKSAhPT0gJyonKSB7XG4gICAgICAgICAgICBzaGFwZS5uYW1lID0gYCogJHtzaGFwZS5uYW1lfWA7XG4gICAgICAgICAgICBsYXllckNvdW50Kys7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gbGF5ZXJDb3VudDtcbn1cbmZ1bmN0aW9uIGZsYXR0ZW5SZWN1cnNpdmUoc2VsZWN0aW9uLCBsYXllckNvdW50KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgc2VsZWN0aW9uLmZvckVhY2goc2hhcGUgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3RyeSBmbGF0dGVuaW5nJywgc2hhcGUpO1xuICAgICAgICAgICAgaWYgKHNoYXBlLnR5cGUgPT0gJ0JPT0xFQU5fT1BFUkFUSU9OJykge1xuICAgICAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oW3NoYXBlXSk7XG4gICAgICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc2hhcGUuY29ybmVyUmFkaXVzID09IGZpZ21hLm1peGVkIHx8IHNoYXBlLmNvcm5lclJhZGl1cyA+IDApIHtcbiAgICAgICAgICAgICAgICAvLyBmbGF0dGVuIHJvdW5kZWQgY29ybmVyc1xuICAgICAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oW3NoYXBlXSk7XG4gICAgICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAoc2hhcGUuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBsYXllckNvdW50ID0gZmxhdHRlblJlY3Vyc2l2ZShzaGFwZS5jaGlsZHJlbiwgbGF5ZXJDb3VudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsZXQgdCA9IHNoYXBlLnJlbGF0aXZlVHJhbnNmb3JtO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzaGFwZS50eXBlJywgc2hhcGUudHlwZSk7XG4gICAgICAgICAgICAgICAgLy8vIGNoZWNrIGZvciB0cmFuc2Zvcm1zXG4gICAgICAgICAgICAgICAgaWYgKHRbMF1bMF0udG9GaXhlZCg2KSAhPSAxIHx8XG4gICAgICAgICAgICAgICAgICAgIHRbMF1bMV0udG9GaXhlZCg2KSAhPSAwIHx8XG4gICAgICAgICAgICAgICAgICAgIHRbMV1bMF0udG9GaXhlZCg2KSAhPSAwIHx8XG4gICAgICAgICAgICAgICAgICAgIHRbMV1bMV0udG9GaXhlZCg2KSAhPSAxIHx8XG4gICAgICAgICAgICAgICAgICAgIGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oW3NoYXBlXSk7XG4gICAgICAgICAgICAgICAgICAgIGxheWVyQ291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoc2hhcGUudHlwZSA9PSAnVEVYVCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEuZmxhdHRlbihbc2hhcGVdKTtcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsYXllckNvdW50O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICByZXR1cm4gbGF5ZXJDb3VudDtcbiAgICB9XG59XG5mdW5jdGlvbiByYXN0ZXJpemVTZWxlY3Rpb24oc2VsZWN0aW9uLCBsYXllckNvdW50KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgbGV0IG5ld1NlbGVjdGlvbiA9IFtdO1xuICAgICAgICBzZWxlY3Rpb24uZm9yRWFjaChzaGFwZSA9PiB7XG4gICAgICAgICAgICBpZiAoc2hhcGUudHlwZSA9PSAnR1JPVVAnKSB7XG4gICAgICAgICAgICAgICAgbGV0IGltZ1NjYWxlID0gTWF0aC5taW4oNDAwMCAvIE1hdGgubWF4KHNoYXBlLndpZHRoLCBzaGFwZS5oZWlnaHQpLCA2KTsgLy8gbGltaXQgaXQgdG8gNDAwMHB4XG4gICAgICAgICAgICAgICAgLy8gYWxlcnQoaW1nU2NhbGUpICAgICAgIFxuICAgICAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICBmb3JtYXQ6IFwiUE5HXCIsXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQ6IHsgdHlwZTogXCJTQ0FMRVwiLCB2YWx1ZTogaW1nU2NhbGUgfVxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgbGV0IHNoYXBlVHJhbnNmb3JtID0gc2hhcGUucmVsYXRpdmVUcmFuc2Zvcm07IC8vIHN0b3JlIHRyYW5zZm9ybVxuICAgICAgICAgICAgICAgIGxldCByZW1vdmVUcmFuc2Zvcm0gPSBbWzEsIDAsIHNoYXBlLnhdLCBbMCwgMSwgc2hhcGUueV1dO1xuICAgICAgICAgICAgICAgIHNoYXBlLnJlbGF0aXZlVHJhbnNmb3JtID0gcmVtb3ZlVHJhbnNmb3JtO1xuICAgICAgICAgICAgICAgIHNoYXBlLmV4cG9ydEFzeW5jKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKGltZyA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGZpZ21hLmNyZWF0ZUltYWdlKGltZykpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVjdCA9IGZpZ21hLmNyZWF0ZVJlY3RhbmdsZSgpO1xuICAgICAgICAgICAgICAgICAgICBzaGFwZS5wYXJlbnQuYXBwZW5kQ2hpbGQocmVjdCk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3QueCA9IHNoYXBlLng7XG4gICAgICAgICAgICAgICAgICAgIHJlY3QueSA9IHNoYXBlLnk7XG4gICAgICAgICAgICAgICAgICAgIHJlY3QucmVsYXRpdmVUcmFuc2Zvcm0gPSBzaGFwZVRyYW5zZm9ybTtcbiAgICAgICAgICAgICAgICAgICAgcmVjdC5uYW1lID0gc2hhcGUubmFtZSArICdfcmFzdGVyaXplJztcbiAgICAgICAgICAgICAgICAgICAgcmVjdC5yZXNpemUoc2hhcGUud2lkdGgsIHNoYXBlLmhlaWdodCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWxsT2JqID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZWN0LmZpbGxzWzBdKSk7XG4gICAgICAgICAgICAgICAgICAgIGZpbGxPYmouZmlsdGVycyA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRyYXN0OiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXhwb3N1cmU6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBoaWdobGlnaHRzOiAwLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2F0dXJhdGlvbjogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd3M6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZW1wZXJhdHVyZTogMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbnQ6IDAsXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGZpbGxPYmouaW1hZ2VIYXNoID0gZmlnbWEuY3JlYXRlSW1hZ2UoaW1nKS5oYXNoO1xuICAgICAgICAgICAgICAgICAgICBmaWxsT2JqLmltYWdlVHJhbnNmb3JtID0gW1sxLCAwLCAwXSwgWzAsIDEsIDBdXTtcbiAgICAgICAgICAgICAgICAgICAgZmlsbE9iai5zY2FsZU1vZGUgPSBcIkNST1BcIjtcbiAgICAgICAgICAgICAgICAgICAgZmlsbE9iai50eXBlID0gXCJJTUFHRVwiO1xuICAgICAgICAgICAgICAgICAgICBmaWxsT2JqLnNjYWxpbmdGYWN0b3IgPSAwLjUsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgZmlsbE9iai5jb2xvcjtcbiAgICAgICAgICAgICAgICAgICAgcmVjdC5maWxscyA9IFtmaWxsT2JqXTtcbiAgICAgICAgICAgICAgICAgICAgbmV3U2VsZWN0aW9uLnB1c2gocmVjdCk7XG4gICAgICAgICAgICAgICAgICAgIHNoYXBlLnJlbGF0aXZlVHJhbnNmb3JtID0gc2hhcGVUcmFuc2Zvcm07XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvbiA9IG5ld1NlbGVjdGlvbjsgfSwgNTApO1xuICAgICAgICByZXR1cm4gbGF5ZXJDb3VudDtcbiAgICB9XG4gICAgY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgcmV0dXJuIGxheWVyQ291bnQ7XG4gICAgfVxufVxuZnVuY3Rpb24gZ2VuZXJhdGVGcmFtZUltYWdlKCkge1xuICAgIHJldHVybiBfX2F3YWl0ZXIodGhpcywgdm9pZCAwLCB2b2lkIDAsIGZ1bmN0aW9uKiAoKSB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBsZXQgZmlyc3RTZWxlY3RlZCA9IGZpZ21hLmN1cnJlbnRQYWdlLnNlbGVjdGlvblswXTtcbiAgICAgICAgICAgIGxldCBwYXJlbnRGcmFtZSA9IGZpbmRGcmFtZShmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb25bMF0pO1xuICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiBcIlBOR1wiLFxuICAgICAgICAgICAgICAgIGNvbnN0cmFpbnQ6IHsgdHlwZTogXCJTQ0FMRVwiLCB2YWx1ZTogNiB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgcGFyZW50RnJhbWUuZXhwb3J0QXN5bmMob3B0aW9ucylcbiAgICAgICAgICAgICAgICAudGhlbihpbWcgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdoc2FkamZoamthaHNkZicsIGltZyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpZ21hLmNyZWF0ZUltYWdlKGltZyk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgfSk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9