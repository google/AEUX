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
figma.showUI(__html__, { width: 166, height: 150 });
let hasFrameData;
let frameArr = [];
let imageHashList = [];
let imageBytesList = [];
// receive message from the UI
figma.ui.onmessage = message => {
    if (message.type === 'exportSelection') {
        hasFrameData = false;
        frameArr = [];
        imageHashList = [];
        imageBytesList = [];
        if (figma.currentPage.selection.length < 1) {
            return;
        } // nothing selected
        // let selection = nodeToObj(figma.currentPage.selection);                
        // if (frameArr[0].children.length < 1) {
        //     frameArr[0].children = selection;
        // }
        // console.log('frameArr: ', frameArr);
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
        // send message to UI
        if (imageHashList.length > 0) {
            storeImageData(Array.from(new Set(imageHashList)), frameArr);
        }
        else {
            figma.ui.postMessage({ type: 'fetchAEUX', data: frameArr });
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
    if (message.type === 'detachComponents') {
        console.log('detachComponents');
        let layerCount = 4;
        // if (figma.currentPage.selection.length < 1) { return }      // nothing selected
        // // let selection = nodeToObj(figma.currentPage.selection)
        // let layerCount = flattenRecursive(figma.currentPage.selection, 0)
        // // reselect layers
        // figma.currentPage.selection = figma.currentPage.selection
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
    function findFrame(node) {
        console.log('node:', node);
        console.log('node.type:', node.type);
        if ((node.type !== 'FRAME' && !(node.type === 'COMPONENT' && node.parent.type === 'PAGE'))
            || (node.type === 'FRAME' && node.layoutMode !== 'NONE')) {
            // if (node.type !== 'FRAME' && node.type !== 'COMPONENT') {
            return findFrame(node.parent);
        }
        else {
            hasFrameData = true;
            return node;
        }
    }
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
function storeImageData(imageHashList, layers) {
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
        figma.ui.postMessage({ type: 'fetchImagesAndAEUX', images: imageBytesList, data: layers });
    });
}
function flattenRecursive(selection, layerCount) {
    try {
        selection.forEach(shape => {
            if (shape.type == 'BOOLEAN_OPERATION') {
                figma.flatten([shape]);
                layerCount++;
            }
            if (shape.children) {
                layerCount = flattenRecursive(shape.children, layerCount);
            }
            else {
                let t = shape.relativeTransform;
                /// check for transforms
                if (t[0][0].toFixed(6) != 1 || t[0][1].toFixed(6) != 0 || t[1][0].toFixed(6) != 0 || t[1][1].toFixed(6) != 1 ||
                    false) {
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


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2NvZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQ0E7QUFDQSxtQ0FBbUMsTUFBTSw2QkFBNkIsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNqRyxrQ0FBa0MsTUFBTSxpQ0FBaUMsRUFBRSxZQUFZLFdBQVcsRUFBRTtBQUNwRywrQkFBK0IsaUVBQWlFLHVCQUF1QixFQUFFLDRCQUE0QjtBQUNySjtBQUNBLEtBQUs7QUFDTDtBQUNBLHdCQUF3QiwwQkFBMEI7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Qsa0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLDhGQUE4RjtBQUNoSTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0Msb0NBQW9DO0FBQ3RFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIscURBQXFEO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0RBQXdELFNBQVM7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIscURBQXFEO0FBQ25GO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BELG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0Msc0JBQXNCO0FBQzVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0NBQW9DLDJCQUEyQjtBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxjQUFjO0FBQy9DO0FBQ0E7QUFDQSw4QkFBOEIsbUVBQW1FO0FBQ2pHLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImNvZGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9jb2RlLnRzXCIpO1xuIiwidmFyIF9fYXdhaXRlciA9ICh0aGlzICYmIHRoaXMuX19hd2FpdGVyKSB8fCBmdW5jdGlvbiAodGhpc0FyZywgX2FyZ3VtZW50cywgUCwgZ2VuZXJhdG9yKSB7XG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgIGZ1bmN0aW9uIGZ1bGZpbGxlZCh2YWx1ZSkgeyB0cnkgeyBzdGVwKGdlbmVyYXRvci5uZXh0KHZhbHVlKSk7IH0gY2F0Y2ggKGUpIHsgcmVqZWN0KGUpOyB9IH1cbiAgICAgICAgZnVuY3Rpb24gcmVqZWN0ZWQodmFsdWUpIHsgdHJ5IHsgc3RlcChnZW5lcmF0b3JbXCJ0aHJvd1wiXSh2YWx1ZSkpOyB9IGNhdGNoIChlKSB7IHJlamVjdChlKTsgfSB9XG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogbmV3IFAoZnVuY3Rpb24gKHJlc29sdmUpIHsgcmVzb2x2ZShyZXN1bHQudmFsdWUpOyB9KS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XG4gICAgICAgIHN0ZXAoKGdlbmVyYXRvciA9IGdlbmVyYXRvci5hcHBseSh0aGlzQXJnLCBfYXJndW1lbnRzIHx8IFtdKSkubmV4dCgpKTtcbiAgICB9KTtcbn07XG5maWdtYS5zaG93VUkoX19odG1sX18sIHsgd2lkdGg6IDE2NiwgaGVpZ2h0OiAxNTAgfSk7XG5sZXQgaGFzRnJhbWVEYXRhO1xubGV0IGZyYW1lQXJyID0gW107XG5sZXQgaW1hZ2VIYXNoTGlzdCA9IFtdO1xubGV0IGltYWdlQnl0ZXNMaXN0ID0gW107XG4vLyByZWNlaXZlIG1lc3NhZ2UgZnJvbSB0aGUgVUlcbmZpZ21hLnVpLm9ubWVzc2FnZSA9IG1lc3NhZ2UgPT4ge1xuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdleHBvcnRTZWxlY3Rpb24nKSB7XG4gICAgICAgIGhhc0ZyYW1lRGF0YSA9IGZhbHNlO1xuICAgICAgICBmcmFtZUFyciA9IFtdO1xuICAgICAgICBpbWFnZUhhc2hMaXN0ID0gW107XG4gICAgICAgIGltYWdlQnl0ZXNMaXN0ID0gW107XG4gICAgICAgIGlmIChmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24ubGVuZ3RoIDwgMSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIG5vdGhpbmcgc2VsZWN0ZWRcbiAgICAgICAgLy8gbGV0IHNlbGVjdGlvbiA9IG5vZGVUb09iaihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pOyAgICAgICAgICAgICAgICBcbiAgICAgICAgLy8gaWYgKGZyYW1lQXJyWzBdLmNoaWxkcmVuLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgLy8gICAgIGZyYW1lQXJyWzBdLmNoaWxkcmVuID0gc2VsZWN0aW9uO1xuICAgICAgICAvLyB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKCdmcmFtZUFycjogJywgZnJhbWVBcnIpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbGV0IHNlbGVjdGlvbiA9IG5vZGVUb09iaihmaWdtYS5jdXJyZW50UGFnZS5zZWxlY3Rpb24pO1xuICAgICAgICAgICAgaWYgKGZyYW1lQXJyWzBdLmNoaWxkcmVuLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgICAgICBmcmFtZUFyclswXS5jaGlsZHJlbiA9IHNlbGVjdGlvbjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdmcmFtZUFycjogJywgZnJhbWVBcnIpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnJvcikge1xuICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlbGVjdGVkIGxheWVycyBuZWVkIHRvIGJlIGluc2lkZSBvZiBhIGZyYW1lJyk7XG4gICAgICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdzZWxlY3RlZCBsYXllcnMgbmVlZCB0byBiZSBpbnNpZGUgb2YgYSBmcmFtZScsIGxheWVyQ291bnQ6IG51bGwgfSk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2VuZCBtZXNzYWdlIHRvIFVJXG4gICAgICAgIGlmIChpbWFnZUhhc2hMaXN0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHN0b3JlSW1hZ2VEYXRhKEFycmF5LmZyb20obmV3IFNldChpbWFnZUhhc2hMaXN0KSksIGZyYW1lQXJyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2ZldGNoQUVVWCcsIGRhdGE6IGZyYW1lQXJyIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgIGlmIChtZXNzYWdlLnR5cGUgPT09ICdmbGF0dGVuTGF5ZXJzJykge1xuICAgICAgICBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfSAvLyBub3RoaW5nIHNlbGVjdGVkXG4gICAgICAgIC8vIGxldCBzZWxlY3Rpb24gPSBub2RlVG9PYmooZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKVxuICAgICAgICBsZXQgbGF5ZXJDb3VudCA9IGZsYXR0ZW5SZWN1cnNpdmUoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLCAwKSB8fCAwO1xuICAgICAgICAvLyByZXNlbGVjdCBsYXllcnNcbiAgICAgICAgZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uO1xuICAgICAgICBmaWdtYS51aS5wb3N0TWVzc2FnZSh7IHR5cGU6ICdmb290ZXJNc2cnLCBhY3Rpb246ICdmbGF0dGVuZWQnLCBsYXllckNvdW50IH0pO1xuICAgIH1cbiAgICBpZiAobWVzc2FnZS50eXBlID09PSAnZGV0YWNoQ29tcG9uZW50cycpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2RldGFjaENvbXBvbmVudHMnKTtcbiAgICAgICAgbGV0IGxheWVyQ291bnQgPSA0O1xuICAgICAgICAvLyBpZiAoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLmxlbmd0aCA8IDEpIHsgcmV0dXJuIH0gICAgICAvLyBub3RoaW5nIHNlbGVjdGVkXG4gICAgICAgIC8vIC8vIGxldCBzZWxlY3Rpb24gPSBub2RlVG9PYmooZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uKVxuICAgICAgICAvLyBsZXQgbGF5ZXJDb3VudCA9IGZsYXR0ZW5SZWN1cnNpdmUoZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uLCAwKVxuICAgICAgICAvLyAvLyByZXNlbGVjdCBsYXllcnNcbiAgICAgICAgLy8gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uID0gZmlnbWEuY3VycmVudFBhZ2Uuc2VsZWN0aW9uXG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2Zvb3Rlck1zZycsIGFjdGlvbjogJ2ZsYXR0ZW5lZCcsIGxheWVyQ291bnQgfSk7XG4gICAgfVxuICAgIC8vQ29tbXVuaWNhdGUgYmFjayB0byB0aGUgVUlcbiAgICAvLyBjb25zb2xlLmxvZygnc2VuZCBtZXNzYWdlIGJhY2sgdG8gdWknKTtcbn07XG5mdW5jdGlvbiBub2RlVG9PYmoobm9kZXMpIHtcbiAgICAvLyAgIGNvbnNvbGUubG9nKCdub2RlcycsIG5vZGVzKTtcbiAgICBpZiAobm9kZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIC8vIGNvbnNvbGUubG9nKG5vZGVzWzBdLnR5cGUpO1xuICAgIGxldCBhcnIgPSBbXTtcbiAgICAvLyBsb29rIGZvciB0aGUgcGFyZW50IGZyYW1lIG9mIGV2ZXJ5dGhpbmcgZXhjZXB0IHJlZ3VsYXIgKG5vbi1hdXRvTGF5b3V0KSBmcmFtZXMgYW5kIGxvb3NlIGNvbXBvbmVudHNcbiAgICBpZiAobm9kZXNbMF0gJiYgKChub2Rlc1swXS50eXBlID09PSAnRlJBTUUnICYmIG5vZGVzWzBdLnBhcmVudC50eXBlID09PSAnUEFHRScpIHx8XG4gICAgICAgIC8vIChub2Rlc1swXS50eXBlID09PSAnRlJBTUUnICYmIG5vZGVzWzBdLmxheW91dE1vZGUgPT09ICdOT05FJykgfHwgXG4gICAgICAgIChub2Rlc1swXS50eXBlID09PSAnQ09NUE9ORU5UJyAmJiBub2Rlc1swXS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSkpIHsgLy8gYSBmcmFtZSBvciBhIGNvbXBvbmVudCBtYXN0ZXIgb3V0c2lkZSBvZiBhIGZyYW1lIGlzIGRpcmVjdGx5IHNlbGVjdGVkXG4gICAgICAgIGNvbnNvbGUubG9nKCdHT1QgQSBGUkFNRScpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhub2Rlc1swXS5jaGlsZHJlbik7XG4gICAgICAgIGhhc0ZyYW1lRGF0YSA9IHRydWU7IC8vIGRvbnQgbmVlZCB0byBnZXQgdGhlIGZyYW1lIGRhdGFcbiAgICAgICAgZnJhbWVBcnIucHVzaChnZXRFbGVtZW50KG5vZGVzWzBdLCBmYWxzZSkpO1xuICAgICAgICBub2RlcyA9IG5vZGVzWzBdLmNoaWxkcmVuO1xuICAgIH1cbiAgICAvLyBnZXQgc2hhcGVzIFxuICAgIGlmIChub2Rlcy5sZW5ndGggPCAxKSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgLy8gZ2V0IHRoZSBmcmFtZSBkYXRhXG4gICAgICAgIGlmICghaGFzRnJhbWVEYXRhKSB7XG4gICAgICAgICAgICBpZiAobm9kZS5wYXJlbnQudHlwZSA9PT0gJ1BBR0UnKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfSAvLyBsYXllciBpcyBvdXRzaWRlIG9mIGEgZnJhbWUgXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZ2V0IHRoZSBmcmFtZSBkYXRhJyk7XG4gICAgICAgICAgICBsZXQgZnJhbWUgPSBmaW5kRnJhbWUobm9kZSk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnZnJhbWU6JywgZnJhbWUpO1xuICAgICAgICAgICAgbGV0IGZyYW1lRGF0YSA9IGdldEVsZW1lbnQoZnJhbWUsIHRydWUpOyAvLyBza2lwIGdhdGhlcmluZyBjaGlsZHJlbiBkYXRhXG4gICAgICAgICAgICBmcmFtZURhdGEuY2hpbGRyZW4gPSBbXTsgLy8gY2xlYXIgdGhlIGNoaWxkcmVuIG9mIHRoZSBmcmFtZSB0byBwdXNoIHRoZW0gbGF0ZXJcbiAgICAgICAgICAgIGZyYW1lQXJyLnB1c2goZnJhbWVEYXRhKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb2JqID0gZ2V0RWxlbWVudChub2RlLCBmYWxzZSk7XG4gICAgICAgIGFyci5wdXNoKG9iaik7XG4gICAgfSk7XG4gICAgLy8gY29uc29sZS5sb2coJ2FycjogJywgYXJyKTtcbiAgICByZXR1cm4gYXJyO1xuICAgIGZ1bmN0aW9uIGZpbmRGcmFtZShub2RlKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdub2RlOicsIG5vZGUpO1xuICAgICAgICBjb25zb2xlLmxvZygnbm9kZS50eXBlOicsIG5vZGUudHlwZSk7XG4gICAgICAgIGlmICgobm9kZS50eXBlICE9PSAnRlJBTUUnICYmICEobm9kZS50eXBlID09PSAnQ09NUE9ORU5UJyAmJiBub2RlLnBhcmVudC50eXBlID09PSAnUEFHRScpKVxuICAgICAgICAgICAgfHwgKG5vZGUudHlwZSA9PT0gJ0ZSQU1FJyAmJiBub2RlLmxheW91dE1vZGUgIT09ICdOT05FJykpIHtcbiAgICAgICAgICAgIC8vIGlmIChub2RlLnR5cGUgIT09ICdGUkFNRScgJiYgbm9kZS50eXBlICE9PSAnQ09NUE9ORU5UJykge1xuICAgICAgICAgICAgcmV0dXJuIGZpbmRGcmFtZShub2RlLnBhcmVudCk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBoYXNGcmFtZURhdGEgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gZ2V0RWxlbWVudChub2RlLCBza2lwQ2hpbGRyZW4pIHtcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ25vZGUnLCBub2RlKTtcbiAgICAgICAgbGV0IG9iaiA9IHtcbiAgICAgICAgICAgIGNoaWxkcmVuOiBbXSxcbiAgICAgICAgICAgIHR5cGU6IG51bGwsXG4gICAgICAgIH07XG4gICAgICAgIGZvciAoY29uc3Qga2V5IGluIG5vZGUpIHtcbiAgICAgICAgICAgIGxldCBlbGVtZW50ID0gbm9kZVtrZXldO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coZWxlbWVudCk7XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnY2hpbGRyZW4nICYmICFza2lwQ2hpbGRyZW4pIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gbm9kZVRvT2JqKGVsZW1lbnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGtleSA9PT0gJ2JhY2tncm91bmRzJykge1xuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBub2RlVG9PYmooZWxlbWVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnZmlsbHMnICYmIGVsZW1lbnQubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgIGNvbGxlY3RJbWFnZUhhc2hlcyhlbGVtZW50LCBub2RlLmlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIGNvcm5lciByYWRpdXNcbiAgICAgICAgICAgIGlmIChlbGVtZW50ID09IGZpZ21hLm1peGVkICYmIGtleSA9PT0gJ2Nvcm5lclJhZGl1cycpIHtcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gTWF0aC5taW4obm9kZS50b3BMZWZ0UmFkaXVzLCBub2RlLnRvcFJpZ2h0UmFkaXVzLCBub2RlLmJvdHRvbUxlZnRSYWRpdXMsIG5vZGUuYm90dG9tUmlnaHRSYWRpdXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gdHJ5IHRvIGdldCB0aGUgZmlyc3QgdmFsdWUgb24gdGhlIHRleHRcbiAgICAgICAgICAgIGlmIChlbGVtZW50ID09IGZpZ21hLm1peGVkKSB7XG4gICAgICAgICAgICAgICAgbGV0IHN0ciA9ICdnZXRSYW5nZScgKyBrZXkucmVwbGFjZSgvXlxcdy8sIGMgPT4gYy50b1VwcGVyQ2FzZSgpKTtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBlbGVtZW50ID0gbm9kZVtzdHJdKDAsIDEpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gbGF5ZXIuZm9udE5hbWUgIT09IChmaWdtYS5taXhlZCkpID8gbGF5ZXIuZm9udE5hbWUuZmFtaWx5IDogbGF5ZXIuZ2V0UmFuZ2VGb250TmFtZSgwLDEpLmZhbWlseVxuICAgICAgICAgICAgLy8gaWYgKGtleSA9PT0gJ3BhcmVudCcpIHsgY29uc29sZS5sb2coZWxlbWVudCk7IH1cbiAgICAgICAgICAgIG9ialtrZXldID0gZWxlbWVudDtcbiAgICAgICAgfVxuICAgICAgICAvLyBrZWVwIHRyYWNrIG9mIEF1dG8tbGF5b3V0IGZyYW1lcyBmb3IgYWxpZ25tZW50IG9mIGNoaWxkcmVuXG4gICAgICAgIGlmIChub2RlLnR5cGUgPT09ICdGUkFNRScgJiYgbm9kZS5sYXlvdXRNb2RlICE9PSAnTk9ORScpIHtcbiAgICAgICAgICAgIG9iai50eXBlID0gJ0FVVE9MQVlPVVQnO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGNvbGxlY3RJbWFnZUhhc2hlcyhlbGVtZW50LCBpZCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZygnaW1hZ2VIYXNoJywgaWQsIGVsZW1lbnQpO1xuICAgICAgICBmb3IgKGNvbnN0IGkgaW4gZWxlbWVudCkge1xuICAgICAgICAgICAgY29uc3QgZmlsbCA9IGVsZW1lbnRbaV07XG4gICAgICAgICAgICBpZiAoZmlsbC50eXBlID09ICdJTUFHRScpIHtcbiAgICAgICAgICAgICAgICBpbWFnZUhhc2hMaXN0LnB1c2goeyBoYXNoOiBmaWxsLmltYWdlSGFzaCwgaWQgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5mdW5jdGlvbiBzdG9yZUltYWdlRGF0YShpbWFnZUhhc2hMaXN0LCBsYXllcnMpIHtcbiAgICByZXR1cm4gX19hd2FpdGVyKHRoaXMsIHZvaWQgMCwgdm9pZCAwLCBmdW5jdGlvbiogKCkge1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhpbWFnZUhhc2hMaXN0KTtcbiAgICAgICAgZm9yIChjb25zdCBpIGluIGltYWdlSGFzaExpc3QpIHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGVsZW1lbnRbaV0pO1xuICAgICAgICAgICAgY29uc3QgaGFzaCA9IGltYWdlSGFzaExpc3RbaV0uaGFzaDtcbiAgICAgICAgICAgIGNvbnN0IG5hbWUgPSBpbWFnZUhhc2hMaXN0W2ldLmlkLnJlcGxhY2UoLzovZywgJy0nKTtcbiAgICAgICAgICAgIGxldCBpbWFnZSA9IGZpZ21hLmdldEltYWdlQnlIYXNoKGhhc2gpO1xuICAgICAgICAgICAgbGV0IGJ5dGVzID0geWllbGQgaW1hZ2UuZ2V0Qnl0ZXNBc3luYygpO1xuICAgICAgICAgICAgaW1hZ2VCeXRlc0xpc3QucHVzaCh7IG5hbWUsIGJ5dGVzIH0pO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYnl0ZXMpO1xuICAgICAgICB9XG4gICAgICAgIGZpZ21hLnVpLnBvc3RNZXNzYWdlKHsgdHlwZTogJ2ZldGNoSW1hZ2VzQW5kQUVVWCcsIGltYWdlczogaW1hZ2VCeXRlc0xpc3QsIGRhdGE6IGxheWVycyB9KTtcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGZsYXR0ZW5SZWN1cnNpdmUoc2VsZWN0aW9uLCBsYXllckNvdW50KSB7XG4gICAgdHJ5IHtcbiAgICAgICAgc2VsZWN0aW9uLmZvckVhY2goc2hhcGUgPT4ge1xuICAgICAgICAgICAgaWYgKHNoYXBlLnR5cGUgPT0gJ0JPT0xFQU5fT1BFUkFUSU9OJykge1xuICAgICAgICAgICAgICAgIGZpZ21hLmZsYXR0ZW4oW3NoYXBlXSk7XG4gICAgICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHNoYXBlLmNoaWxkcmVuKSB7XG4gICAgICAgICAgICAgICAgbGF5ZXJDb3VudCA9IGZsYXR0ZW5SZWN1cnNpdmUoc2hhcGUuY2hpbGRyZW4sIGxheWVyQ291bnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgbGV0IHQgPSBzaGFwZS5yZWxhdGl2ZVRyYW5zZm9ybTtcbiAgICAgICAgICAgICAgICAvLy8gY2hlY2sgZm9yIHRyYW5zZm9ybXNcbiAgICAgICAgICAgICAgICBpZiAodFswXVswXS50b0ZpeGVkKDYpICE9IDEgfHwgdFswXVsxXS50b0ZpeGVkKDYpICE9IDAgfHwgdFsxXVswXS50b0ZpeGVkKDYpICE9IDAgfHwgdFsxXVsxXS50b0ZpeGVkKDYpICE9IDEgfHxcbiAgICAgICAgICAgICAgICAgICAgZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgZmlnbWEuZmxhdHRlbihbc2hhcGVdKTtcbiAgICAgICAgICAgICAgICAgICAgbGF5ZXJDb3VudCsrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBsYXllckNvdW50O1xuICAgIH1cbiAgICBjYXRjaCAoZXJyb3IpIHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICByZXR1cm4gbGF5ZXJDb3VudDtcbiAgICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9