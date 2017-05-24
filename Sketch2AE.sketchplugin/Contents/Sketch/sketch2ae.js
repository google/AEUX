/** ===== About Sketch2AE ===== 
	Layer data exchange between Sketch and After Effects

	Copyright 2017 Google Inc.

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

	    http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
	**/

/** ===== Plugin Process ===== 
	-PLUGIN START-
	@exportCopy / @exportSave
		- get doc info
		- initialize variables
		- get selected layers
		- check if selection is a whole artboard or layers
		– filter all selected layers and children, return a data string (@filterTypes)

		@filterTypes
		- store the artboard info or alert that an artboard is required
		- loop through all selected layers
		- filter layer by object-type 
			- get object-type specific data
			– get fill data
			- get stroke data
			- get path data
			- get text data
			– recurse through contained layers if a group or a compound shape
		– add layer info to the data string
		– return the data string to be exported 

		- add the data string to the clipboard (@exportCopy) or to text file (@exportSave) 

		- import into After Effects
	
	**/

/** ===== Variables ===== **/
var app = NSApplication.sharedApplication();
var doc, pages, currentPage_index, sketchFile, folderPath, hasArtboard, imageCount, imageInc;


/** ===== Functions ===== **/

/** Export to clipboard - function triggered from Sketch menu
    @param {object} context - the Sketch object
*/
var exportCopy = function(context) {
	sketchFile = context;
	doc = context.document;
	pages = doc.pages();            						// list all pages
	currentPage_index = pages.indexOfObject(doc.currentPage());
	var selectedLayerInfo = [];     						// array to store all the selected layer info
	folderPath = null;
	hasArtboard = false;            						// reset the state of having a stored artboard to false
	imageInc = 0;                   						// set image inc back to 0
	var selection = context.selection;

	// check if artboard is selected
	if (selection.firstObject().class() == 'MSArtboardGroup' || selection.firstObject().class() == 'MSSymbolMaster') {
		selection = selection.firstObject().layers();       // add children
	} 

	selectedLayerInfo = filterTypes(selection);
	copy_text(selectedLayerInfo);

	doc.setCurrentPage(pages[currentPage_index]);                                     // switch back to current page
	doc.showMessage("Copied " + selection.count() + " layers to clipboard");
};


/** Export to .sketchae file - function triggered from Sketch menu
    @param {object} context - the Sketch object
*/
var exportSave = function(context) {
	sketchFile = context;
	doc = context.document;
	pages = doc.pages();            // list all pages
	currentPage_index = pages.indexOfObject(doc.currentPage());
	var selectedLayerInfo = [];     // array to store all the selected layer info
	folderPath = null;              // reset folder path
	hasArtboard = false;            // reset the state of having a stored artboard to false
	imageInc = 0;                   // set image inc back to 0
	var selection = context.selection;

	// check if artboard is selected
	if (selection.firstObject().class() == 'MSArtboardGroup' || selection.firstObject().class() == 'MSSymbolMaster') {
		selection = selection.firstObject().layers();                                   // add children
	} 

	getFolderPath();                                                                  // open a file save dialog

	selectedLayerInfo = filterTypes(selection);
	save_text(selectedLayerInfo, folderPath + '_SketchExport.sktchae');

	doc.setCurrentPage(pages[currentPage_index]);                                     // switch back to current page
	doc.showMessage("Saved " + selection.count() + " layers to " + savePath);
};


/** Popup alert - easier than the sketch code
    @param {string} text - Alert message
    @param {string} opt_headline - optional headline
*/
function alert(text, opt_headline) {
	var headline = (opt_headline !== undefined) ? opt_headline : 'Alert';
	NSApplication.sharedApplication().displayDialog_withTitle(text.toString(), headline);
}


/** Copy string to clipboard
    @param {string} txt - text to be copied (crazy ojbective c shit that i dont really understand)
*/
function copy_text(txt){
	var pasteBoard = NSPasteboard.generalPasteboard();
		pasteBoard.clearContents();
		[pasteBoard declareTypes:[NSArray arrayWithObject:NSPasteboardTypeString] owner:nil];
		[pasteBoard setString:txt forType:NSPasteboardTypeString];
}


/** Save string to file
    @param {string} txt - text to be saved to file (crazy ojbective c shit that i dont really understand)
    @param {string} filePath - where to save the file
*/
function save_text(txt, filePath)){
	var t = [NSString stringWithFormat:@"%@", txt],
	f = [NSString stringWithFormat:@"%@", filePath];

	[t writeToFile:f atomically:true encoding:NSUTF8StringEncoding error:nil]
}


/** Open file saving dialog */
function getFolderPath() {
	if (folderPath == null) {
		var saveWindow = NSOpenPanel.openPanel()
		saveWindow.setCanCreateDirectories(true)
		saveWindow.setCanChooseDirectories(true)
		saveWindow.setCanChooseFiles(false);

		saveWindow.setPrompt("Select");
		saveWindow.setMessage("Location to save files");
		saveWindow.runModal();
		folderPath = decodeURI(saveWindow.URLs().objectAtIndex(0));
		folderPath = folderPath.replace('file://', '');                    // remove the file://
	}
}


/** Convert object data to string 
	@param {object} obj - object data to be saved to text file 
*/
function objString(obj) {
  //// add each object value to the string
  var selString = '{';                                                          // start the string with {
  for (var prop in obj) {                                                       // loop through all layers
    selString += (String('\"' + prop + '\"' + ': ' + obj[prop] + ',\n'));       // concat string with layer properties
  }
  selString += '}';                                                             // add the } at the end of the whole string
  
  selString = selString.replace(',\n}', '}');                                   // remove commas between {,}

  return selString;
}


/** Filter layers based on object type to process them correctly
	@param {selection} obj - layer object
*/
function filterTypes(selection) {
	var selectedLayerInfo = [];													// array to store all the selected layer info
	if (!hasArtboard) { selectedLayerInfo.push(storeArtboard()); }				// add artboard data first if not artboard data is stored

	var selCount = selection.count();											// get the total number of selected layers
	for (var i = 0; i < selCount; i++) {										// loop through all selected layers
		var sel = selection[i];													// set the active layer

    	//// check the type of class
    	if (sel.class() == 'MSShapeGroup' && sel.layers().length > 1) {			// this is a compound shape
    		selectedLayerInfo.push(storeCompoundShape(sel));
		}
		if ((	sel.class() == 'MSStarShape' || 								// this is a star
				sel.class() == 'MSPolygonShape' ||								// this is a polygon
				sel.class() == 'MSTriangleShape' ||								// this is a triangle
				sel.class() == 'MSShapeGroup'	) && sel.layers().length < 2) {			// this is a simple path
			// check if the fill is image based
			if ((sel.style().fills().count() > 0 && sel.style().fills().firstObject().fillType() > 0) || 		// this fill is a gradient, image or texture and needs to be saved to png
				(sel.style().borders().count() > 0 && sel.style().borders().firstObject().fillType() > 0)) {  	// this stroke is a gradient, image or texture and needs to be saved to png
				selectedLayerInfo.push(storeImgFill(sel));
			} else {
				selectedLayerInfo.push(storeShape(sel));						// this fill is a solid color and can be a shape layer
			}
		}
		if (sel.class() == 'MSLayerGroup') {									// this is a group
			selectedLayerInfo.push(storeGroup(sel));
		}
		if (sel.class() == 'MSTextLayer') {										// this is a text layer
			selectedLayerInfo.push(storeText(sel));
		}
		if (sel.class() == 'MSBitmapLayer') {									// this is an image
			selectedLayerInfo.push(storeImg(sel));
		}
		if (sel.class() == 'MSSymbolInstance') {								// this is a symbol
			selectedLayerInfo.push(storeSymbol(sel));
		}

		///// Shapes within a compound shape
		if (sel.class() == 'MSRectangleShape' || sel.class()=='MSShapePathLayer') { // oval shape within compound
			selectedLayerInfo.push(storeRect(sel));
		}
		if (sel.class() == 'MSOvalShape') {										// oval shape within compound
			selectedLayerInfo.push(storeOval(sel));
		}
	}
	return  '[' + selectedLayerInfo.toString() + ']';							// return layer info as an array of objects in string format
}


/** Store the artboard info at the start of the object string */
function storeArtboard() {
	hasArtboard = true;
	var artboard = doc.findCurrentArtboardGroup() || null;

	if (artboard === null) {
  		doc.showMessage("Nothing copied to clipboard - Create an artboard first"); }    		// alert about creating an arboard first

	var selData =  {type: '\"' + artboard.class() + '\"',										// gather the relevent artboard info
					name: '\"' + artboard.name() + '\"',
					backgroundColor: '[' + sketchColorToArray(artboard.backgroundColor()) + ']',
					size: '[' + artboard.frame().width() + ', ' + artboard.frame().height() + ']'
					};

  return objString(selData);																// output a string of the collected data
}


/** Store a simple shape
	@param {sel} obj - layer object
*/
function storeShape(sel) {
	var f = sel.frame();																		// the geometric bounds of the layer
	var cornerRoundness = 0;
	try {cornerRoundness = sel.layers().firstObject().cornerRadiusFloat();} catch(e) {}

	var shapeType =	(	(sel.layers().firstObject().class() == 'MSRectangleShape' && !sel.layers()[0].edited() ) ||
						sel.layers().firstObject().class() == 'MSOvalShape' && !sel.layers()[0].edited()) ? 
						sel.layers().firstObject().class() : 'MSShapePathLayer';

	// var shapeType = (sel.layers()[0].edited()) ? 'MSShapePathLayer' : sel.layers().firstObject().class();
	// var shapeType = 'MSShapePathLayer';
	var selData =  {type: '\"' + shapeType + '\"',
					name: '\"' + sel.name() + '\"',
					isVisible: sel.isVisible(),
					size: '[' + round100(f.width()) + ', ' + round100(f.height())] + ']',
					path: getPathGroup(sel.layers(), true),											// get path data if it exists
					roundness: cornerRoundness,
					position: '[' + [round100(f.x()), round100(f.y())] + ']',
					opacity: Math.round(sel.style().contextSettings().opacity() * 100),
					fill: getFills(sel),
					stroke: getStrokes(sel),
					shadow: getShadows(sel),
					innerShadow: getInnerShadows(sel),
					blendMode: sel.style().contextSettings().blendMode()
					};
  return objString(selData);																// output a string of the collected data
}


/** Store a rectangle within a compound shape
	@param {sel} obj - layer object
*/
function storeRect(sel) {
  var f = sel.frame();																		// the geometric bounds of the layer
  var cornerRoundness = 0;
      try {cornerRoundness = sel.cornerRadiusFloat();} catch(e) {}
      var shapeType = (sel.edited()) ? 'MSShapePathLayer' : sel.class();
  var selData =  {type: '\"' + shapeType + '\"',
                  name: '\"' + sel.name() + '\"',
                  isVisible: sel.isVisible(),
                  size: '[' + round100(f.width()) + ', ' + round100(f.height())] + ']',
                  path: getPath(sel),
                  roundness: cornerRoundness,
                  position: '[' + [round100(f.x()), round100(f.y())] + ']',
                  rotation: sel.rotation(),
                  booleanOperation: sel.booleanOperation()
                  };

  return objString(selData);																// output a string of the collected data
}


/** Store an ellipse within a compound shape
	@param {sel} obj - layer object
*/
function storeOval(sel) {
  var f = sel.frame();																		// the geometric bounds of the layer
  var shapeType = (sel.edited()) ? 'MSShapePathLayer' : sel.class();
  var selData =  {type: '\"' + shapeType + '\"',
                  name: '\"' + sel.name() + '\"',
                  isVisible: sel.isVisible(),
                  size: '[' + round100(f.width()) + ', ' + round100(f.height())] + ']',
                  path: getPath(sel),
                  position: '[' + [f.x(), f.y()] + ']',
                  rotation: sel.rotation(),
                  booleanOperation: sel.booleanOperation()
                  };

  return objString(selData);																// output a string of the collected data
}


/** Store a compund shape
	@param {sel} obj - layer object
*/
function storeCompoundShape(sel) {
  var f = sel.frame();																		// the geometric bounds of the layer
  var selData =  {type: '\"' + 'CompoundShape' + '\"',
                  name: '\"' + sel.name() + '\"',
                  isVisible: sel.isVisible(),
                  size: '[' + round100(f.width()) + ', ' + round100(f.height())] + ']',
                  position: '[' + [round100(f.x()), round100(f.y())] + ']',
                  opacity: Math.round(sel.style().contextSettings().opacity() * 100),
                  fill: getFills(sel),
                  stroke: getStrokes(sel),
                  shadow: getShadows(sel),
                  innerShadow: getInnerShadows(sel),
                  layers: getLayersInGroup(sel),
                  blendMode: sel.style().contextSettings().blendMode()
                  };

  function getLayersInGroup(group) {														// recurse through nested layers
    var layersInGroup = filterTypes(group.layers());
    return layersInGroup;
  }

  return objString(selData);																// output a string of the collected data
}


/** Store text layers
	@param {sel} obj - layer object
*/
function storeText(sel) {
  var f = sel.frame();																		// the geometric bounds of the layer

  var selData =  {type: '\"' + sel.class() + '\"',
                  name: '\"' + replaceAllSpecialChar(sel.name()) + '\"',
                  isVisible: sel.isVisible(),
                  stringVal: '\"' + replaceAllSpecialChar( sel.stringValue() ) + '\"',
                  size: '[' + round100(f.width()) + ', ' + round100(f.height())] + ']',
                  opacity: Math.round(sel.style().contextSettings().opacity() * 100),
                  position: '[' + [round100(f.x()), round100(f.y())] + ']',
                  fontName: '\"' + sel.fontPostscriptName() + '\"',
                  fontSize: sel.fontSize(),
                  tracking: round100(sel.fontSize() / (2 / sel.kerning())),
                  justification: sel.textAlignment(),
                  lineHeight: (sel.lineHeight() == 0) ? Math.round(sel.fontSize() * 1.14) : sel.lineHeight(),
                  hasFill: Math.ceil(sketchColorToOpacity(sel.textColor())/100 ),
                  textColor: '[' + sketchColorToArray(sel.textColor()) + ']',
                  fill: getFills(sel),
                  stroke: getStrokes(sel),
                  shadow: getShadows(sel),
                  innerShadow: getInnerShadows(sel),
                  blendMode: sel.style().contextSettings().blendMode()
                  };

  function replaceAllSpecialChar(str) {														// replace characters that give strings trouble
  	var cleanString = str.replace(/\n/g, '\\n');											// replace new lines with \n
  		cleanString = cleanString.replace(new RegExp('"', 'g'), '\\"');						// replace double quote with \"
  		cleanString = cleanString.replace(new RegExp("'", 'g'), "\\'");						// replace single quote with \'
  	
  	return cleanString;
  }

  return objString(selData);																// output a string of the collected data
}


/** Store group layers
	@param {sel} obj - layer object
*/
function storeGroup(sel) {
  var f = sel.frame();																		// the geometric bounds of the layer
  var selData = { type: '\"' + sel.class() + '\"',
                  name: '\"' + sel.name() + '\"',
                  size: '[' + round100(f.width()) + ', ' + round100(f.height())] + ']',
                  position: '[' + [f.x(), f.y()] + ']',
                  hasClippingMask: sel.layers()[0].hasClippingMask(),
                  isVisible: sel.isVisible(),
                  layers: getLayersInGroup(sel)												// recurse child layers
  }

  function getLayersInGroup(group) {														// recurse and filter through all child layers 
    var layersInGroup = filterTypes(group.layers());
    return layersInGroup;
  }

  return objString(selData);																// output a string of the collected data
}


/** Store symbol layers
	@param {sel} obj - layer object
*/
function storeSymbol(sel) {
  var f = sel.frame();																		// the geometric bounds of the layer
  var masterSymbolSize = null;																// initialize

  var selData = { type: '\"' + sel.class() + '\"',
                  name: '\"' + sel.name() + '\"',
                  size: '[' + round100(f.width()) + ', ' + round100(f.height())] + ']',
                  opacity: Math.round(sel.style().contextSettings().opacity() * 100),
                  position: '[' + [f.x(), f.y()] + ']',
                  symbolID: '\"' + sel.symbolID() + '\"',
                  shadow: getShadows(sel),
                  innerShadow: getInnerShadows(sel),
                  blendMode: sel.style().contextSettings().blendMode(),
                  layers: getMasterSymbol(sel),												// get the layers in the master symbol
                  symbolSize: masterSymbolSize
  }

  function getMasterSymbol(instance) {
    var selID = instance.symbolID();
    var masterSymbol = '';
    for (var i = 0; i < sketchFile.document.pages().length; i++) {							// loop through all pages in sketch file
        var artBoard = sketchFile.document.pages()[i];
        for (var j = 0; j < artBoard.children().length; j++) {								// loop through all artboard in the pages

          try {
            var currentID = String(artBoard.children()[j].symbolID());						// check if the symbolID matches 
            if (currentID == selID && artBoard.children()[j].class() == 'MSSymbolMaster') {
              masterSymbol = artBoard.children()[j];										// set the masterSymbol to the found layer
              break;																		// quit looping
            }
          } catch(e) {}
        }
      }
    var layersInGroup = filterTypes(masterSymbol.layers());									// recurse through the layers in the master symbol
    masterSymbolSize = '[' + masterSymbol.frame().width() + ', ' +  masterSymbol.frame().height() + ']';	// get the native size of the symbol
    return layersInGroup;
  }

  return objString(selData);																// output a string of the collected data
}


/** Store imported image file and save to png file
	@param {sel} obj - layer object
*/
function storeImg(sel) {
	imageInc++;																				// increment imageInc to avoid overwriting images with duplicate layer names
	getFolderPath();																		// open save dialog if no folderPath defined
	var parentPage_index = pages.indexOfObject(getParentPage(sel));							// get the parent page index
	var imageFile = exportLayer(sel, folderPath);											// save layer to png

	var f = sel.frame();																	// the geometric bounds of the layer
	var selData = { type: '\"' + sel.class() + '\"',
	            	name: '\"' + sel.name() + '\"',
	            	isVisible: sel.isVisible(),
	             	fileName: imageFile.fileName,
	             	path: imageFile.path,
	             	position: '[' + [f.x(), f.y()] + ']',
	             	opacity: Math.round(sel.style().contextSettings().opacity() * 100),
	             	scale: imageFile.scale,
	             	shadow: getShadows(sel),
                 	innerShadow: getInnerShadows(sel),
	             	blendMode: sel.style().contextSettings().blendMode()
	}

	return objString(selData);																// output a string of the collected data

	function exportLayer(layer, path) {														// save layer to png
		var rect = layer.absoluteRect().rect();												// image rect bounds
		var imageWidth = layer.image().image().size().width;								// get actual image width 
		var screenWidth = rect.size.width;													// get on-screen image width
		var scale = imageWidth/screenWidth;													// scale factor of the image on screen
		// var slice = [MSExportRequest requestWithRect:rect scale:scale];      			// worked in v41, now broken
		var slice = [[MSExportRequest exportRequestsFromExportableLayer:layer] firstObject];// weird Sketch system for exporting
		    slice.scale = scale;
		    slice.setShouldTrim(0);
		    slice.setSaveForWeb(0);
		    //slice.configureForLayer(layer);
		var filename = layer.name() + '_' + imageInc + '.png';								// filename = layerName_5.png

		doc.setCurrentPage(pages[parentPage_index]);                    					// switch page to parent of image
		doc.saveArtboardOrSlice_toFile(slice, path + filename);       					  	// export layer

		return {																			// return obj of exported layer data
			fileName: '\"' + filename + '\"',
			path: '\"' + path + '\"',
			imageWidth: imageWidth,
			scale: scale
		}
	}
}


/** Store imported image file and save to png file
	@param {sel} obj - layer object
*/
function storeImgFill(sel) {
	imageInc++;																				// increment imageInc to avoid overwriting images with duplicate layer names
	getFolderPath();																		// open save dialog if no folderPath defined
	var parentPage_index = pages.indexOfObject(getParentPage(sel));							// get the parent page index
	var imageFile = exportLayer(sel, folderPath);											// save layer to png

	var f = sel.frame();																	// the geometric bounds of the layer
	var selData = { type: '\"' + 'MSBitmapLayer' + '\"',
	             	name: '\"' + sel.name() + '\"',
	             	isVisible: sel.isVisible(),
             		fileName: imageFile.fileName,
             		path: imageFile.path,
             		position: '[' + [f.x(), f.y()] + ']',
             		opacity: Math.round(sel.style().contextSettings().opacity() * 100),
             		scale: imageFile.scale,
	             	shadow: getShadows(sel),
	             	innerShadow: getInnerShadows(sel),
             		blendMode: sel.style().contextSettings().blendMode()
  }

  return objString(selData);																// output a string of the collected data

	function exportLayer(layer, path) {														// save layer to png
		var rect = layer.absoluteRect().rect();												// image rect bounds
		var scale = 4;																		// pre defined scale factor of 4x
	    // var slice = [MSExportRequest requestWithRect:rect scale:scale];      			// worked in v41, now broken
		var slice = [[MSExportRequest exportRequestsFromExportableLayer:layer] firstObject];// weird Sketch system for exporting
			slice.scale = scale;
			slice.setShouldTrim(0);
			slice.setSaveForWeb(0);
			// slice.configureForLayer(layer);
	    var filename = layer.name()  + '_' + imageInc + '.png';

		doc.setCurrentPage(pages[parentPage_index]);                    					// switch page to parent of image
		doc.saveArtboardOrSlice_toFile(slice, path + filename);      					  	// export layer
		return {
			fileName: '\"' + filename + '\"',
			path: '\"' + path + '\"',
			scale: scale
		}
	}
}


/** return an object of arrays filled with all the path points/in/out tangents/closed status
	for shape not a part of a compund shape 
	@param {sel} active selected layer
*/
function getPathGroup(sel) {
	var count = 0;																			// initialize point count at 0
	var path = NSArray.arrayWithObject(sel).objectEnumerator().nextObject()[0].path();		// get the path object ( nextObject()[0] vs nextObject() in getPath() )
	var points = [], inTangents = [], outTangents = [];										// define variables
	var shapeSize = {																		// get the height and width to multiply point point coordinates
	  w: sel.firstObject().frame().width(),
	  h: sel.firstObject().frame().height()
	};
	while (path.pointAtIndex(count) !== null) {												// loop through points - returns null when count is greater than point count
		var p =[round100(path.pointAtIndex(count).point().x * shapeSize.w),  				// paths are normalized to 0-1 and scaled by a height and width multiplier
				round100(path.pointAtIndex(count).point().y * shapeSize.h) ];

		if (path.pointAtIndex(count).curveMode() !== 1) {									// if the current point has curves and needs tangent handles
			var o =[round100(path.pointAtIndex(count).curveFrom().x * shapeSize.w - p[0]), 
					round100(path.pointAtIndex(count).curveFrom().y * shapeSize.h - p[1])]; // tangent out of the point offset by the point coordinates onscreen

			var i =[round100(path.pointAtIndex(count).curveTo().x * shapeSize.w - p[0]), 
					round100(path.pointAtIndex(count).curveTo().y * shapeSize.h - p[1])];	// tangent into the point offset by the point coordinates onscreen

		} else {																			// current point has no curves so tangets are at the same coordinate as the point
			var o = [0,0];																	// set tangets to [0,0]
			var i = [0,0];
		}

		points.push('[' + p + ']');
		inTangents.push('[' + i + ']');
		outTangents.push('[' + o + ']');
		count++;
	}		
	var pathObj = {																			// create object to store path data
		points: '[' + points + ']',
		inTangents: '[' + inTangents + ']',
		outTangents: '[' + outTangents + ']',
		closed: path.isClosed()
	}
	return objString(pathObj);																// return a string of the keyframe object
}


/** return an object of arrays filled with all the path points/in/out tangents/closed status
	for raw shape in a compund shape 
	@param {sel} active selected layer
*/
function getPath(sel, opt_group) {
	var count = 0;																			// initialize point count at 0
	var path = NSArray.arrayWithObject(sel).objectEnumerator().nextObject().path();			// get the path object
	var points = [], inTangents = [], outTangents = [];										// define variables
	var shapeSize = {																		// get the height and width to multiply point point coordinates
	  w: sel.frame().width(),
	  h: sel.frame().height()
	};
	while (path.pointAtIndex(count) !== null) {												// loop through points - returns null when count is greater than point count
		var p = [	round100(path.pointAtIndex(count).point().x * shapeSize.w), 			// paths are normalized to 0-1 and scaled by a height and width multiplier
					round100(path.pointAtIndex(count).point().y * shapeSize.h) ];

		if (path.pointAtIndex(count).curveMode() !== 1) {									// if the current point has curves and needs tangent handles
			var o =[round100(path.pointAtIndex(count).curveFrom().x * shapeSize.w - p[0]),
					round100(path.pointAtIndex(count).curveFrom().y * shapeSize.h - p[1])]; // tangent out of the point offset by the point coordinates onscreen

			var i =[round100(path.pointAtIndex(count).curveTo().x * shapeSize.w - p[0]), 	
					round100(path.pointAtIndex(count).curveTo().y * shapeSize.h - p[1])];	// tangent into the point offset by the point coordinates onscreen

		} else {																			// current point has no curves so tangets are at the same coordinate as the point
			var o = [0,0];																	// set tangets to [0,0]
			var i = [0,0];
		}

		points.push('[' + p + ']');															// add current point with screen dimensions to the points array
		inTangents.push('[' + i + ']');														// add current inTangent with screen dimensions to the points array
		outTangents.push('[' + o + ']');													// add current outTangent with screen dimensions to the points array
		count++;																			// increment the point count
	}
	var pathObj = {																			// create object to store path data
		points: '[' + points + ']',
		inTangents: '[' + inTangents + ']',
		outTangents: '[' + outTangents + ']',
		closed: path.isClosed()
	}
	return objString(pathObj);																// return a string of the keyframe object
}


/** return all the drop shadows as an array
	@param {sel} active selected layer
*/
function getShadows(sel) {
	var hasShadow = (sel.style().shadows().length > 0 && sel.style().shadows()[0].isEnabled()) ? 1 : 0;	// check if the layer has at least one drop shadow

	if (hasShadow) {
		var shadowData = [];																	// array to store shadow(s)
		for (var i = 0; i < sel.style().shadows().length; i++) {								// loop through all shadows
			if (sel.style().shadows()[i].isEnabled()) {											// add shadow to shadowProps only if shadow is enabled
				var shadowObj = {																// 1 object per shadow obj
				color: '[' + sketchColorToArray(sel.style().shadows()[i].color()) + ']',		// store color obj as array
				position: '[' + [sel.style().shadows()[i].offsetX(), sel.style().shadows()[i].offsetY()] + ']',
				blur: sel.style().shadows()[i].blurRadius(),
				spread: sel.style().shadows()[i].spread()
			}
			var shadowProps = objString(shadowObj);												// convert obj to string
			shadowData.push(shadowProps);														// add obj string to array
		}
	}
		return '[' + shadowData + ']';															// return array of all shadows
	} else {
		return null;																			// no shadows so return null
	}
}


/** return the first inner shadows as an array (AE only supports one)
	@param {sel} active selected layer
*/
function getInnerShadows(sel) {
	var hasShadow = (sel.style().innerShadows().length > 0 && sel.style().innerShadows()[0].isEnabled()) ? 1 : 0;	// check if the layer has at least one drop shadow

	if (hasShadow) {
		var shadowData = [];																// array to store shadow(s)
		for (var i = 0; i < sel.style().innerShadows().length; i++) {						// loop through all shadows
			var shadowObj = {																// 1 object per shadow obj
			color: '[' + sketchColorToArray(sel.style().innerShadows()[i].color()) + ']',	// store color obj as array
			position: '[' + [sel.style().innerShadows()[i].offsetX(), sel.style().innerShadows()[i].offsetY()] + ']',
			blur: sel.style().innerShadows()[i].blurRadius(),
			spread: sel.style().innerShadows()[i].spread()
		}
		var shadowProps = objString(shadowObj);												// convert obj to string
		shadowData.push(shadowProps);														// add obj string to array
	}
		return '[' + shadowData + ']';														// return array of all shadows
	} else {
		return null;																		// no shadows so return null
	}
}


/** return all the strokes as an array
	@param {sel} active selected layer
*/
function getStrokes(sel) {
	var hasStroke = (sel.style().borders().length > 0) ? 1 : 0;								// check if the layer has at least one fill

	if (hasStroke) {
		var strokeData = [];																	// array to store strokes(s)
		for (var i = 0; i < sel.style().borders().length; i++) {								// loop through all strokes
			if (sel.style().borders()[i].isEnabled()) {											// add stroke to strokeProps only if stroke is enabled
			var strokeObj = {																	// 1 object per stroke obj
				enabled: sel.style().borders()[i].isEnabled(),									// it has a stroke, but is it enabled?
				color: '[' + sketchColorToArray(sel.style().borders()[i].color()) + ']',		// store color obj as array
				opacity: sketchColorToOpacity(sel.style().borders()[i].color()),				// store opacity from color obj
				width: sel.style().borders()[i].thickness(),									// stroke width
				cap: sel.style().borderOptions().lineCapStyle(),								// stroke cap style
				join: sel.style().borderOptions().lineJoinStyle()								// stroke join style
			}
			var strokeProps = objString(strokeObj);												// convert obj to string
			strokeData.push(strokeProps);														// add obj string to array
		}
	}
		return '[' + strokeData + ']';															// return array of all strokes
	} else {
		return null;																			// no fills so return null
	}
	return null;
}


/** return all the fills as an array
	@param {sel} active selected layer
*/
function getFills(sel) {
	var hasFill = (sel.style().fills().length > 0) ? 1 : 0;										// check if the layer has at least one fill

	if (hasFill) {
		var fillData = [];																		// array to store fill(s)
		for (var i = 0; i < sel.style().fills().length; i++) {									// loop through all fills
			if (sel.style().fills()[i].isEnabled()) {											// add fill to fillProps only if fill is enabled
				var fillObj = {																		// 1 object per fill obj
					enabled: sel.style().fills()[i].isEnabled(),									// it has a fill, but is it enabled?
					color: '[' + sketchColorToArray(sel.style().fills()[i].color()) + ']',			// store color obj as array
					opacity: sketchColorToOpacity(sel.style().fills()[i].color()),					// store opacity from color obj
					blendMode: sel.style().fills()[i].contextSettings().blendMode()					// blend mode
				}
				var fillProps = objString(fillObj);													// convert obj to string
				fillData.push(fillProps);															// add obj string to array
			}
		}
		return '[' + fillData + ']';															// return array of all fills
	} else {
		return null;																			// no fills so return null
	}
}


/** return the parent page of a selected layer
	@param {layer} active selected layer
*/
function getParentPage(layer) {
	if (layer.parentGroup() !== null) {
		return getParentPage(layer.parentGroup());
	} else {
		return layer;
	}
}


/** convert color object to an RGBA array
	@param {c} color object
*/
function sketchColorToArray(c) {
	var colorArray = c.toString().slice(1,-1);  // remove parenthesis
		colorArray = (colorArray.replace('r:', ''));
		colorArray = colorArray.replace(' g:', ', ');
		colorArray = colorArray.replace(' b:', ', ');
		colorArray = colorArray.replace(' a:', ', ');
	return colorArray;
}


/** return the opacity value from color object
	@param {c} color object
*/
function sketchColorToOpacity(c) {
	var colorArray = c.toString().slice(1,-1);  // remove parenthesis
		colorArray = colorArray.split(' a:')[1];
	return colorArray * 100;
}


/** convert to 2 decimal place number
	@param {num} integer 
*/
function round100(num) {
	return Math.round(num * 100) / 100;
}