import BrowserWindow from 'sketch-module-web-view'
import { getWebview } from 'sketch-module-web-view/remote'
import UI from 'sketch/ui'
// // const commands = require('./commands.js')


var devName = 'sumUX';
var toolName = 'AEUX';
var docUrl = 'https://aeux.io/';
var versionNumber = 0.7;
var document, selection, folderPath, saveName, layerCount, aeSharePath, flatten, hasArtboard, exportCanceled;


const webviewIdentifier = 'aeux.webview'

function newMessage(port, msg) {
    var PORT = port || "3200";
    var HOST = "127.0.0.1";
    var returnedMsg = null;

    // var headers = new Headers();
    // headers.append('Content-Type', 'application/json');
    fetch(`http://${HOST}:${PORT}/evalscript`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(msg)
    })
    .then(res => {
        returnedMsg = res.json()            
        return returnedMsg
    })
    .then(msg => console.log(msg))
    .catch(error => {
        console.log("Looks like there was a problem:", error);
    })

    return returnedMsg;
}

export default function () {
  const options = {
    identifier: webviewIdentifier,
    width: 240,
    height: 180,
    titleBarStyle: 'hiddenInset',
    hidesOnDeactivate: false,
    // resizable: false,
    // movable: false,
    // minimizable: false,
    // alwaysOnTop: true,
    show: false,
    webPreferences: {
        devTools: true,
    }
  }

  const browserWindow = new BrowserWindow(options)

  // only show the window when the page has loaded to avoid a white flash
  browserWindow.once('ready-to-show', () => {
    browserWindow.show()
  })

  const webContents = browserWindow.webContents

  // print a message when the page loads
  webContents.on('did-finish-load', () => {
    UI.message('UI loaded!')
  })

  // add a handler for a call from web content's javascript
  webContents.on('nativeLog', s => {
    UI.message(s)
    webContents
      .executeJavaScript(`setRandomNumber(${Math.random()})`)
      .catch(console.error)
  })


  // open a link
  webContents.on('externalLinkClicked', url => {
    NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(url))
  })
  // open a link
  webContents.on('fetchAEUX', msg => {
    fetchAEUX()
    // document = require('sketch/dom').getSelectedDocument();
    // selection = document.selectedLayers;

    // UI.message(document)
  })


  // set darkmode on launch
  let theme = UI.getTheme()
  let darkMode = (theme === 'dark')
  webContents.executeJavaScript(`setDarkMode(${darkMode})`)

  // load url
  browserWindow.loadURL(require('../resources/webview.html'))
}

// When the plugin is shutdown by Sketch (for example when the user disable the plugin)
// we need to close the webview if it's open
export function onShutdown() {
  const existingWebview = getWebview(webviewIdentifier)
  if (existingWebview) {
    existingWebview.close()
  }
}

export function fetchAEUX () {
    document = require('sketch/dom').getSelectedDocument();
    selection = document.selectedLayers;

    /// reset vars
    // folderPath = null;
    hasArtboard = false;
    layerCount = 0;

    var aeuxData = filterTypes(selection);
    // if (layerCount < 0) { return }
    aeuxData[0].layerCount = layerCount;
    // aeuxData[0].folderPath = folderPath;

    console.log(aeuxData);

    var msg = {
        prefs: {
          newComp: true,
          parametrics: false,
          compScale: 1,
          precompGroups: false,
          frameRate: 60,
        },
        layerData: aeuxData,
    }

    fetch(`http://127.0.0.1:7240/evalscript`, {
    method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            // method: 'popup',
            method: 'buildLayers',
            data: msg,
            switch: 'aftereffects'
        })
    })
    .then(response => response.text())
    .then(text => console.log(text))
    .catch(e => console.error(e));
};



//// get all selected layer data
function filterTypes(selection) {
	if (selection.length < 1) { return [{layerCount: 0}] }
    /// reset vars
    var selectedLayerInfo = [];
    var layers = selection.layers;

    /// get artboard data
    if (!hasArtboard) { selectedLayerInfo.push( storeArtboard() ); }
    if (!hasArtboard) { layerCount = -2; return; }

    /// if an artboard is selected, process all layers inside of it
    if ( layers.length > 0 && (layers[0].type == 'Artboard' || layers[0].type == 'SymbolMaster')) {
        layers = layers[0].layers;
    }

    /// check that the image export has not been canceled
    if (layerCount != -1) {
        /// loop through all selected layers
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            // skip layer if not visible
            if (!layer.sketchObject.isVisible()) { continue; }

            // get layer data by layer type
            if ( layer.type == 'Group' ) {
                selectedLayerInfo.push( getGroup(layer) );
                continue;
            }
            if ( layer.type == 'ShapePath' || layer.type == 'Shape' ) {
                selectedLayerInfo.push( getShape(layer) );
            }
            if ( layer.type == 'SymbolInstance' ) {
                selectedLayerInfo.push( getSymbol(layer) );
            }
            if ( layer.type == 'Text' ) {
                selectedLayerInfo.push( getText(layer) );
            }
            if ( layer.type == 'Image' ) {
                var imgLayer = getImage(layer);
                if (imgLayer == null) { layerCount = -1; return selectedLayerInfo; }
                selectedLayerInfo.push( imgLayer );
            }

            // increment var to show on panels
            layerCount++;
        }
    }

    return selectedLayerInfo;
}


//// get artboard data
function storeArtboard() {
	var artboard = selection.layers[0].getParentArtboard() || selection.layers[0] || null;
    /// no artboard so store generic
	if (artboard === null) {
        return {}
    }

	var bgColor = [1,1,1,1];

	try {
		if (artboard.background.enabled) {
			bgColor = hexToArray(artboard.background.color);
		}
	} catch (e) {

	}

    var artboardObj = {
        type: 'Artboard',
        aeuxVersion: versionNumber,
        hostApp: 'Sketch',
        name: artboard.name,
        bgColor: bgColor,
        size: [artboard.frame.width, artboard.frame.height]
    };
    /// tells filterTypes() this doesn't need to run again
    hasArtboard = true;

    return artboardObj;
}


//// get layer data: SHAPE
function getShape(layer) {
  var layerType = getShapeType(layer.sketchObject);
	var layerData =  {
    type: layerType,
		name: layer.name,
		id: layer.id,
		frame: getFrame(layer),
    fill: getFills(layer),
    stroke: getStrokes(layer),
    shadow: getShadows(layer),
    innerShadow: getInnerShadows(layer),
    isVisible: layer.sketchObject.isVisible(),
		path: getPath(layer, layer.frame),
		roundness: getRoundness(layer),
    blur: getBlur(layer.sketchObject),
		opacity: getOpacity(layer),
		rotation: -layer.sketchObject.rotation(),
    flip: getFlipMultiplier(layer),
		blendMode: getLayerBlending( layer.sketchObject.style().contextSettings().blendMode() ),
    hasClippingMask: layer.sketchObject.hasClippingMask(),
    shouldBreakMaskChain: layer.sketchObject.shouldBreakMaskChain(),
  };

  /// if fill is an image and should return that instead of a shape
  if (layerData.fill != null && layerData.fill.type == 'Image') {
      return layerData.fill;
  }

  /// if shape is a compound get the shapes that make up the compound
  if (layerType == 'CompoundShape') {
      layerData.layers = getCompoundShapes(layer.layers);
      layerData.booleanOperation = layer.layers[0].sketchObject.booleanOperation();
  }

  return layerData;																// output a string of the collected data

  /// get corner roundness clamped to the shape size
  function getRoundness(layer) {
      try {
          var lyr = layer.sketchObject;
          var radius = lyr.points()[0].cornerRadius();
          var width = lyr.frame().width();
          var height = lyr.frame().height();
          var maxRad = Math.min(Math.min(width, height), radius);
          return maxRad;
      } catch (e) {
          return null;
      }
  }
}


//// get layer data: SYMBOL
function getSymbol(layer) {
    // check if the symbol is an image override
    // if (layer.overrides.length > 0 &&
    //     layer.overrides[0].property == 'image' &&
    //     !layer.overrides[0].isDefault) {
    //     var imageLayer = getImage(layer);
    //     return imageLayer;
    // }

	if (layer.master == null) { return {}; }		// skip if layer missing

	var layerData =  {
        type: 'Symbol',
        name: layer.master.name,
        masterId: layer.master.id,
        id: layer.id,
        frame: getFrame(layer),
        style: layer.style,
        isVisible: layer.sketchObject.isVisible(),
        opacity: getOpacity(layer),
        shadow: getShadows(layer),
        innerShadow: getInnerShadows(layer),
        blendMode: getLayerBlending( layer.sketchObject.style().contextSettings().blendMode() ),
        layers: filterTypes(layer.master),
        symbolFrame: layer.master.frame,
        bgColor: sketchColorToArray(layer.master.sketchObject.backgroundColor()),
        rotation: -layer.sketchObject.rotation(),
        flip: getFlipMultiplier(layer),
        hasClippingMask: layer.sketchObject.hasClippingMask(),
        shouldBreakMaskChain: layer.sketchObject.shouldBreakMaskChain(),
	};
    getOverrides(layer, layerData);
    return layerData;


    /// get text and nested symbol overrides
    function getOverrides(layer, symbolObj) {
        // reset vars
        var overrideList = [];
        var overrides = layer.overrides;

        // loop through each override on the layer
        for (var i = 0; i < overrides.length; i++) {
            var override = overrides[i];
            if (!override.isDefault) {              // has an override
                symbolObj.id = 'override';
                symbolObj.masterId = 'override';

                // DEPRECIATED forced symbol detach
                // if (override.property == 'image') {     // needs to be detatched from master
                //     var detatchedGroup = layer.detach();
                //     overrideList = [];                  // reset the list
                //     i = 0;                              // reset the count
                // }

                // loop through all layers in the symbol
                for (var j = 0; j < symbolObj.layers.length; j++) {
                    var currentLayer = symbolObj.layers[j];
                    //// it is a GROUP ////    recurse deeper
                    if (currentLayer.type == 'Group') {
                        getOverrides(layer, currentLayer);
                        continue;
                    }
                    //// it is a SYMBOL ////
                    if (override.symbolOverride) {
                        if (currentLayer.id == override.path) {      // do ids match?
                            var overrideSymbol = document.getSymbolMasterWithID(override.value);
                            if (overrideSymbol == undefined) { return }
                            currentLayer.name = overrideSymbol.name;
                            currentLayer.masterId = overrideSymbol.id;
                            currentLayer.layers = filterTypes( overrideSymbol );
                        }
                    }
                    //// it is TEXT ////
                    if (currentLayer.id == override.path) {      // do ids match?
						var text = override.value;
						try {
							var transformVal = document.getLayerWithID(override.path).sketchObject.styleAttributes()["MSAttributedStringTextTransformAttribute"];
					        if (transformVal == 1) { text = text.toUpperCase(); }
					        if (transformVal == 2) { text = text.toLowerCase(); }
						} catch (e) {}

                        currentLayer[ override.property ] = text;  // replace the text/image value
                    }
                }
            }
        }
    }
}


//// get layer data: GROUP
function getGroup(layer) {
    var flip = getFlipMultiplier(layer);
	var layerData =  {
    type: 'Group',
    name: '\u25BD ' + layer.name,
    id: layer.id,
    frame: getFrame(layer),
    isVisible: layer.sketchObject.isVisible(),
		opacity: getOpacity(layer),
    shadow: getShadows(layer),
    innerShadow: getInnerShadows(layer),
    rotation: -layer.sketchObject.rotation() * (flip[0]/100) * (flip[1]/100),
    blendMode: layer.sketchObject.style().contextSettings().blendMode(),
    flip: flip,
    layers: filterTypes(layer),
    hasClippingMask: layer.sketchObject.hasClippingMask(),
    shouldBreakMaskChain: layer.sketchObject.shouldBreakMaskChain(),
		};
  return layerData;
}


//// get layer data: TEXT
function getText(layer) {
    /// reset vars
    var kind;
    var frame = {};

    /// is the layer flipped?
    var flip = getFlipMultiplier(layer);

    /// point or area text box
    if (layer.sketchObject.textBehaviour() == 0) {
        kind = 'Point';
        frame = {
            x: layer.frame.x,
            y: layer.frame.y + layer.sketchObject.glyphBounds().origin.y,
            width: layer.frame.width,
            height: layer.frame.height
        }
    } else {
        kind = 'Area';
        frame = {
            x: layer.frame.x + layer.frame.width / 2,
            y: layer.frame.y + layer.frame.height / 2 + layer.sketchObject.glyphBounds().origin.y,
            width: layer.frame.width,
            height: layer.frame.height
        }
    }
	var layerData =  {
        type: 'Text',
        kind: kind,
		name: layer.name,
        stringValue: getTextString(layer),
		id: layer.id,
		frame: frame,
        isVisible: layer.sketchObject.isVisible(),
		opacity: getOpacity(layer),
		shadow: getShadows(layer),
		innerShadow: getInnerShadows(layer),
        textColor: sketchColorToArray(layer.sketchObject.textColor()),
        fill: getFills(layer),
        stroke: getStrokes(layer),
		blendMode: getLayerBlending( layer.sketchObject.style().contextSettings().blendMode() ),
        fontName: getFontName(),
        fontSize: layer.sketchObject.fontSize(),
        trackingAdjusted: layer.sketchObject.kerning() / layer.sketchObject.fontSize() * 1000,
        tracking: layer.sketchObject.kerning(),
        justification: layer.sketchObject.textAlignment(),
        lineHeight: layer.sketchObject.paragraphStyle().minimumLineHeight() || null,
        flip: flip,
        rotation: -layer.sketchObject.rotation() * (flip[0]/100) * (flip[1]/100),
        blur: getBlur(layer.sketchObject),
        hasClippingMask: layer.sketchObject.hasClippingMask(),
        shouldBreakMaskChain: layer.sketchObject.shouldBreakMaskChain(),
    };


    return layerData;



    function getFontName() {
        var fontName = layer.sketchObject.font().fontName() + '0';
        return fontName.slice(0, -1);
    }

    function getTextString(layer) {
        var text = layer.text.replace(/[\u2028]/g, '\n');
        var transformVal = 0;
        var transformVal = layer.sketchObject.styleAttributes()["MSAttributedStringTextTransformAttribute"];

        if (transformVal == 1) { text = text.toUpperCase(); }
        if (transformVal == 2) { text = text.toLowerCase(); }

        return text;
    }
}


//// get layer data: IMAGE
function getImage(layer) {
	var layerData =  {
    type: 'Image',
    name: layer.name,
    id: layer.id,
    frame: getFrame(layer),
    isVisible: layer.sketchObject.isVisible(),
    opacity: getOpacity(layer),
    blendMode: getLayerBlending( layer.sketchObject.style().contextSettings().blendMode() ),
    rotation: -layer.sketchObject.rotation(),
    hasClippingMask: layer.sketchObject.hasClippingMask(),
    shouldBreakMaskChain: layer.sketchObject.shouldBreakMaskChain(),
	};

    if ( !getFolderPath() ) { return null; }        // canceled

    var imageFile = exportLayer(layer, folderPath);
    // layerData.path = imageFile.path;
    // layerData.scale = imageFile.scale;
    return layerData;


    /// export image
    function exportLayer(layer, path) {
        layer.image.nsdata.writeToFile_atomically(path + layer.id + '.png', true);

        return {
            path: path,
            scale: 'scale'
        };
    }
}
// //// get layer data: IMAGE
// function getImage(layer) {
// 	var layerData =  {
//     type: 'Image',
// 		name: layer.name,
// 		id: layer.id,
// 		frame: getFrame(layer),
//     isVisible: layer.sketchObject.isVisible(),
// 		opacity: getOpacity(layer),
// 		blendMode: getLayerBlending( layer.sketchObject.style().contextSettings().blendMode() ),
//     hasClippingMask: layer.sketchObject.hasClippingMask(),
//     shouldBreakMaskChain: layer.sketchObject.shouldBreakMaskChain(),
// 	};

//     if ( !getFolderPath() ) { return null; }        // canceled

//     var imageFile = exportLayer(layer, folderPath);
//     layerData.path = imageFile.path;
//     layerData.scale = imageFile.scale;
//     return layerData;


//     /// export image
//     function exportLayer(layer, path) {
//         sketch.export(layer, {
//             output: path,
//             'use-id-for-name': true,
//             overwriting: true,
//             // 'save-for-web': true,
//             'group-contents-only': true,
//             scales: 4,
//         });

//         return {
//           path: path,
//           scale: 'scale'
//         };
//     }
// }


//// get layer data: COMPOUND SHAPE
function getCompoundShapes(layers) {
    var layerList = [];

    /// loop through all nested shapes
    for (var i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var layerType = getCompoundShapeType(layer.sketchObject);

        // var layerId = (layer.objectID()+ '&').slice(0, -1);
        var flip = getFlipMultiplier(layer);
        var frame = {
            x: layer.frame.x,
            y: layer.frame.y,
            width: layer.frame.width,
            height: layer.frame.height,
        };
        layerList.push({
            type: layerType,
            name: layer.name,
    		id: layer.id,
    		frame: frame,
            isVisible: !layer.hidden,
            path: getPath(layer, frame),
            roundness: getCompoundRoundness(layer.sketchObject),
            flip: flip,
            rotation: -layer.sketchObject.rotation() * (flip[0]/100) * (flip[1]/100),
            booleanOperation: layer.sketchObject.booleanOperation(),
        });

        if (layerType == 'CompoundShape') {
            layerList[i].layers = getCompoundShapes(layer.layers);
        }
    }

    return layerList;


    /// check the shape type
    function getCompoundShapeType(lyr) {
        if ( lyr.class() == 'MSRectangleShape' && !lyr.edited() ) { return 'Rect' }
        if ( lyr.class() == 'MSOvalShape' && !lyr.edited() ) { return 'Ellipse' }
        if ( lyr.class() == 'MSShapeGroup' && lyr.layers().length > 1 ) {
            // alert(JSON.stringify(getCompoundShapes(lyr.layers()), false, 2))
            // layerList[i].layers = getCompoundShapes(layer.layers);
            return 'CompoundShape'
        }
        return 'Path';
    }

    /// get corner roundness clamped to the shape size
    function getCompoundRoundness(layer) {
        try {
            var radius = layer.fixedRadius();
            var width = layer.frame().width();
            var height = layer.frame().height();
            var maxRad = Math.min(Math.min(width, height), radius);

            return maxRad/2;
        } catch (e) {
            return null;
        }
    }
}


//// get shape data: PATH
function getPath(layer, frame) {
    // var lyr = layer.sketchObject.layers().firstObject();     // 51
    var lyr = layer.sketchObject;
    // skip if no path on the current object (like a compound path )
    if (!lyr.points) {
        return {
    		points: [],
    		inTangents: [],
    		outTangents: [],
    		closed: false
    	}
    }
    /// reset vars
    var points = [], inTangents = [], outTangents = [];

    /// get the path object
	var path = lyr.points();

    /// get the height and width to multiply point point coordinates
	var shapeSize = {
        w: frame.width,
        h: frame.height
	};

    /// loop through each point on the path
	for (var k = 0; k < path.length; k++) {
        // paths are normalized to 0-1 and scaled by a height and width multiplier
		var p = [	round100(path[k].point().x * shapeSize.w),
					round100(path[k].point().y * shapeSize.h) ];

        // if the current point has curves and needs tangent handles
		if (path[k].curveMode() !== 1) {
            // tangent out of the point offset by the point coordinates onscreen
			var o = [round100(path[k].curveFrom().x * shapeSize.w - p[0]),
					 round100(path[k].curveFrom().y * shapeSize.h - p[1])];

            // tangent into the point offset by the point coordinates onscreen
			var i = [round100(path[k].curveTo().x * shapeSize.w - p[0]),
					 round100(path[k].curveTo().y * shapeSize.h - p[1])];

        // current point has no curves so tangets are at the same coordinate as the point
		} else {
			var o = [0,0];
			var i = [0,0];
		}

        // add current point and tangent with screen dimensions
		points.push(p);
		inTangents.push(i);
		outTangents.push(o);
	}

    // create object to store path data
	var pathObj = {
		points: points,
		inTangents: inTangents,
		outTangents: outTangents,
		closed: (lyr.isClosed() == 1)
	}
	return pathObj;
}

//// get layer data: OPACITY
function getOpacity(layer) {
    return  Math.round(layer.sketchObject.style().contextSettings().opacity() * 100)
}


//// get layer data: SHAPE TYPE
function getShapeType(lyr) {
    if ( lyr.class() == 'MSShapeGroup' && lyr.layers().length > 1 ) { return 'CompoundShape' }
    if ( lyr.class() == 'MSRectangleShape' && !lyr.edited() ) { return 'Rect' }
    if ( lyr.class() == 'MSOvalShape' && !lyr.edited() ) { return 'Ellipse' }
    try {
        if ( lyr.layers().firstObject().class() == 'MSRectangleShape' && !lyr.layers()[0].edited() ) { return 'Rect' }
        if ( lyr.layers().firstObject().class() == 'MSOvalShape' && !lyr.layers()[0].edited() ) { return 'Ellipse' }
    } catch (e) {}
    return 'Path';
}


//// get layer data: FLIP
function getFlipMultiplier(layer) {
    try {
        var x = ( layer.sketchObject.isFlippedHorizontal() ) ? -100 : 100;
        var y = ( layer.sketchObject.isFlippedVertical() ) ? -100 : 100;
    } catch (e) {
        var x = ( layer.isFlippedHorizontal() ) ? -100 : 100;
        var y = ( layer.isFlippedVertical() ) ? -100 : 100;
    }

    return [x, y];
}


//// get layer data: FILL
function getFills(layer) {
    /// get layer style object
    var style = layer.sketchObject.style();

    /// check if the layer has at least one fill
	var hasFill = ( style.firstEnabledFill() ) ? true : false;

    if (hasFill) {
		var fillData = [];
        var size = [layer.sketchObject.frame().width(), layer.sketchObject.frame().height()];

        // loop through all fills
        for (var i = 0; i < style.fills().length; i++) {
            var fill = style.fills()[i];

            // add fill to fillProps only if fill is enabled
            if (fill.isEnabled()) {
                // fill is a gradient
                if (fill.fillType() == 1) {
                    var fillObj = {
                        type: 'gradient',
                        startPoint: [fill.gradient().from().x * size[0]  - layer.sketchObject.frame().width()/2,
                                     fill.gradient().from().y * size[1] - layer.sketchObject.frame().height()/2],
                        endPoint:   [fill.gradient().to().x * size[0] - layer.sketchObject.frame().width()/2,
                                     fill.gradient().to().y * size[1] - layer.sketchObject.frame().height()/2],
                        gradType:  fill.gradient().gradientType(),
                        gradient: getGradient(fill.gradient().stops()),
                        opacity: Math.round(fill.contextSettings().opacity() * 100),
                        blendMode: getShapeBlending( fill.contextSettings().blendMode() ),
    				}
                // fill is an image or texture
                } else if (fill.fillType() > 3) {
                    fillData = getImage(layer);
                    break;
                // fill is a solid
                } else {
                    var color = sketchColorToArray(fill.color());
                    var fillObj = {
    					type: 'fill',
    					enabled: fill.isEnabled(),
    					color: color,
    					opacity: Math.round(color[3] * 100),
    					blendMode: getShapeBlending( fill.contextSettings().blendMode() ),
    				}
                }

                // add obj string to array
				fillData.push(fillObj);
			}
		}
		return fillData;
	} else {
		return null;
	}
}


//// get layer data: STROKE
function getStrokes(layer) {
    /// get layer style object
    var style = layer.sketchObject.style();

    /// check if the layer has at least one stroke
    var hasStroke = ( style.firstEnabledBorder() ) ? true : false;

	if (hasStroke) {
		var strokeData = [];
        var size = [layer.sketchObject.frame().width(), layer.sketchObject.frame().height()];

        // loop through all strokes
        for (var i = 0; i < style.borders().length; i++) {
            var border = style.borders()[i];
            if (border.isEnabled()) {
                var color = sketchColorToArray(border.color());
                // stroke is a gradient
                if (border.fillType() == 1) {
                    var strokeObj = {
                        type: 'gradient',
                        startPoint: [border.gradient().from().x * size[0]  - layer.sketchObject.frame().width()/2,
                                     border.gradient().from().y * size[1] - layer.sketchObject.frame().height()/2],
                        endPoint:   [border.gradient().to().x * size[0] - layer.sketchObject.frame().width()/2,
                                     border.gradient().to().y * size[1] - layer.sketchObject.frame().height()/2],
                        gradType: (border.gradient().gradientType() == 1) ? 2 : 1,
                        gradient: getGradient(border.gradient().stops()),
        				opacity: color[3] * 100,
        				width: border.thickness(),
        				cap: style.borderOptions().lineCapStyle(),
        				join: style.borderOptions().lineJoinStyle(),
        				strokeDashes: style.borderOptions().dashPattern(),
                        opacity: border.contextSettings().opacity() * 100,
                        blendMode: border.contextSettings().blendMode(),
        			}
                // stroke is a solid
                } else {
                    var strokeObj = {
                        type: 'fill',
                        enabled: border.isEnabled(),
        				color: color,
        				opacity: color[3] * 100,
        				width: border.thickness(),
        				cap: style.borderOptions().lineCapStyle(),
        				join: style.borderOptions().lineJoinStyle(),
                        strokeDashes: getDashes( style.borderOptions() ),
                        blendMode: border.contextSettings().blendMode(),
        			}
                }

            // add obj string to array
			strokeData.push(strokeObj);
		}
	}
		return strokeData;															// return array of all strokes
	} else {
		return null;																			// no fills so return null
	}
}


//// get layer data: STROKE DASHES
function getDashes(borderOptions) {
    var dashPattern = borderOptions.dashPattern();
    var dashArray = [];

    for (var i = 0; i < dashPattern.length; i++) {
        var str = (dashPattern[i] + '&').slice(0, -1);
        dashArray.push( parseFloat(str) )
    }
    return dashArray;
}


//// get layer data: GRADIENT
function getGradient(grad) {
    var gradObj = {
        length: grad.length,
        points: []
    };

    for (var i = 0; i < gradObj.length; i++) {
        var colorArr = sketchColorToArray(grad[i].color());
        gradObj.points.push({
            color: colorArr,
            midPoint: 0.5,
            opacity: colorArr[3],
            rampPoint: grad[i].position(),
        });
    }
    return gradObj;
}


//// get layer data: DROP SHADOW
function getShadows(layer) {
    var style = layer.sketchObject.style();
	var hasShadow = ( style.firstEnabledShadow() ) ? true : false;

	if (hasShadow) {
		var shadowData = [];																	// array to store shadow(s)
		for (var i = 0; i < style.shadows().length; i++) {								// loop through all shadows
            var shadow = style.shadows()[i];
            if (shadow.isEnabled()) {											// add shadow to shadowProps only if shadow is enabled
				var shadowObj = {																// 1 object per shadow obj
    				color: sketchColorToArray(shadow.color()),		// store color obj as array
    				position: [shadow.offsetX(), shadow.offsetY()],
    				blur: shadow.blurRadius(),
    				spread: shadow.spread()
    			}
			shadowData.push(shadowObj);														// add obj string to array
    		}
    	}
		return shadowData;															// return array of all shadows
	} else {
		return null;																			// no shadows so return null
	}
}


//// get layer data: INNER SHADOW
function getInnerShadows(layer) {
    var style = layer.sketchObject.style();
    var hasShadow = (style.innerShadows().length > 0 && style.innerShadows()[0].isEnabled()) ? true : false;	// check if the layer has at least one drop shadow

	if (hasShadow) {
		var shadowData = [];																// array to store shadow(s)
		for (var i = 0; i < style.innerShadows().length; i++) {						// loop through all shadows
            var innerShadow = style.innerShadows()[i];
            var shadowObj = {																// 1 object per shadow obj
    			color: sketchColorToArray(innerShadow.color()),	// store color obj as array
    			position: [innerShadow.offsetX(), innerShadow.offsetY()],
    			blur: innerShadow.blurRadius(),
    			spread: innerShadow.spread()
    		}
		    shadowData.push(shadowObj);														// add obj string to array
	    }
		return shadowData;														// return array of all shadows
	} else {
		return null;																		// no shadows so return null
	}
}


//// get layer data: BLUR
function getBlur(layer) {
    var blur = layer.style().blur();
    if (!blur.isEnabled()) { return null }

    var blurObj = {
        // center: blur.center(),
        direction: (90 - blur.motionAngle()) % 360,
        radius: blur.radius() * 4,
        type: blur.type(),
    }

    return [blurObj];
}
//// DEPRECIATED copy text to clipboard
// function copy_text(txt){
//     var pasteBoard = NSPasteboard.generalPasteboard();
// 		pasteBoard.clearContents();
// 		pasteBoard.declareTypes_owner(NSArray.arrayWithObject(NSPasteboardTypeString), null);
//         pasteBoard.setString_forType(txt, NSPasteboardTypeString);
// }


//// save data to text file
function save_text(text, filePath) {
    var t = NSString.stringWithFormat("%@", text);
    var f = NSString.stringWithFormat("%@", filePath);
    return t.writeToFile_atomically_encoding_error(f, true, NSUTF8StringEncoding, null);
}


//// open dialog and return path
function getFolderPath() {
	if (exportCanceled) { return false; }		// cancel the process
	if (folderPath == null) {
		var saveWindow = NSOpenPanel.openPanel();
		saveWindow.setCanCreateDirectories(true);
		saveWindow.setCanChooseDirectories(true);
		saveWindow.setCanChooseFiles(false);

		saveWindow.setPrompt('Select');
		saveWindow.setMessage('Location to save images');
		var pathSaved = saveWindow.runModal();

        if (pathSaved) {
            folderPath = decodeURI(saveWindow.URLs().objectAtIndex(0));
    		folderPath = folderPath.replace('file://', '');                    // remove the file://

            return true;            // folder path found
        }

        exportCanceled = true;      // canceled
        return false;
	}
    return true;        // folder path exists
}


//// save dialog and return path
function getSavePath() {
	if (exportCanceled) { return false }		// cancel the process
	if (folderPath == null) {
		var saveWindow = NSSavePanel.savePanel();
		saveWindow.setCanCreateDirectories(true);
		saveWindow.setCanChooseDirectories(true);
		saveWindow.setCanChooseFiles(false);

		saveWindow.setPrompt('Select');
		saveWindow.setMessage('Location to save json file and any images');
        saveWindow.nameFieldStringValue = toolName + '.json';
		// saveWindow.allowedFileTypes(['json']);
		var pathSaved = saveWindow.runModal();

        if (pathSaved) {
            folderPath = decodeURI(saveWindow.URLs().objectAtIndex(0));
    		folderPath = folderPath.replace('file://', '');                    // remove the file://

            saveName = saveWindow.nameFieldStringValue();
            return true;            // folder path found
        }

        exportCanceled = true;      // canceled
        return false;
	}
    return true;        // folder path exists
}

//// rearrange origin of a shape
function getFrame(layer) {
  var frame = layer.frame;

  return {
    width: frame.width,
    height: frame.height,
    x: frame.x + frame.width/2,
    y: frame.y + frame.height/2,
  }
}


//// reduce math resolution
function round100(num) {
	return Math.round(num * 100) / 100;
}


//// return enumerated layer blending mode
function getLayerBlending(mode) {
    var aeBlendMode;

    switch (mode) {
        case 1:
            aeBlendMode = 'BlendingMode.DARKEN';
            break;
        case 2:
            aeBlendMode = 'BlendingMode.MULTIPLY';
            break;
        case 3:
            aeBlendMode = 'BlendingMode.COLOR_BURN';
            break;
        case 4:
            aeBlendMode = 'BlendingMode.LIGHTEN';
            break;
        case 5:
            aeBlendMode = 'BlendingMode.SCREEN';
            break;
        case 6:
            aeBlendMode = 'BlendingMode.ADD';
            break;
        case 7:
            aeBlendMode = 'BlendingMode.OVERLAY';
            break;
        case 8:
            aeBlendMode = 'BlendingMode.SOFT_LIGHT';
            break;
        case 9:
            aeBlendMode = 'BlendingMode.HARD_LIGHT';
            break;
        case 10:
            aeBlendMode = 'BlendingMode.DIFFERENCE';
            break;
        case 11:
            aeBlendMode = 'BlendingMode.EXCLUSION';
            break;
        case 12:
            aeBlendMode = 'BlendingMode.HUE';
            break;
        case 13:
            aeBlendMode = 'BlendingMode.SATURATION';
            break;
        case 14:
            aeBlendMode = 'BlendingMode.COLOR';
            break;
        case 15:
            aeBlendMode = 'BlendingMode.LUMINOSITY';
            break;
        default: aeBlendMode = 'BlendingMode.NORMAL';
    }
    return aeBlendMode;
}

//// return integer layer blending mode
function getShapeBlending(mode) {
    var aeBlendMode;

    switch (mode) {
        case 1:
            aeBlendMode = 3;
            break;
        case 2:
            aeBlendMode = 4;
            break;
        case 3:
            aeBlendMode = 5;
            break;
        case 4:
            aeBlendMode = 9;
            break;
        case 5:
            aeBlendMode = 10;
            break;
        case 6:
            aeBlendMode = 11;
            break;
        case 7:
            aeBlendMode = 15;
            break;
        case 8:
            aeBlendMode = 16;
            break;
        case 9:
            aeBlendMode = 17;
            break;
        case 10:
            aeBlendMode = 23;
            break;
        case 11:
            aeBlendMode = 24;
            break;
        case 12:
            aeBlendMode = 26;
            break;
        case 13:
            aeBlendMode = 27;
            break;
        case 14:
            aeBlendMode = 28;
            break;
        case 15:
            aeBlendMode = 29;
            break;
        default: aeBlendMode = 1;
    }

    return aeBlendMode;
}


//// convert color obj to array
function sketchColorToArray(c) {
    var colorString = c.toString()
                       .replace('r:', '')
                       .replace('g:', '')
                       .replace('b:', '')
                       .replace('a:', '')
                       .replace(/\s/g, ', ')
                       .replace('(', '[')
                       .replace(')', ']');

	return JSON.parse(colorString);
}


//// convert hex color to array
function hexToArray(hexString) {
	var hexColor = hexString.replace('#', '');
	var r = parseInt(hexColor.slice(0, 2), 16) / 255,
		g = parseInt(hexColor.slice(2, 4), 16) / 255,
		b = parseInt(hexColor.slice(4, 6), 16) / 255;
	return [r, g, b, 1];
}