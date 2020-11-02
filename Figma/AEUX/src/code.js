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
                constraint: { type: "SCALE", value: 1 }
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
    alert('12345');
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
