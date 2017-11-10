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


(function (thisObj) {																														//encapsulate the script in a function to avoid global variables
// json2.js (minified)
if(typeof JSON!=="object"){JSON={}}(function(){function f(n){return n<10?"0"+n:n}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf()}}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+string+'"'}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key)}if(typeof rep==="function"){value=rep.call(holder,key,value)}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null"}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null"}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==="string"){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v)}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" "}}else{if(typeof space==="string"){indent=space}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify")}return str("",{"":value})}}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v}else{delete value[k]}}}}return reviver.call(holder,key,value)}text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j}throw new SyntaxError("JSON.parse")}}}());


//================ VARIABLES ======================
var scriptName = 'Sketch2AE';
var scriptVersion = '0.53';
var defaultBoxText = 'Paste Sketch code';
var clippingMask = null;
var thisComp = null;
var symbolFolderName = 'Symbols';
var imageFolderName = 'Images';
var compMult = 1;
var relativePath = false;
var symbolFolder, imageFolder, inputFile, labelColor;

var icons = {																																		// icon string for retina icons
	paste: ['40 18 48 18 52.5 18.9 48 21 49 24 49.5 21 53.0 19.1 56 23 46 36 46 30 49 30 44 26 44 44 61 44 62 43 62 8 61 7 56 7 58 10 57 11 31 11 30 10 32 7 27 7 26 8 26 43 27 44 44 44 44 26 39 30 42 30 42 36 32 23 34.8 19.1 38.5 22 37.5 25 40 21.5 45 21 39 21 35.3 18.9',
					'31.4 10.0 34.4 6 38.1 6 40.1 4.7 41.6 2.7 44 2 44 4 42.8 4.5 42.5 5.8 43.3 6.8 44.6 6.8 45.4 5.8 45.1 4.5 44 4 44 2 46.3 2.7 47.8 4.7 49.8 6 53.4 6 56.4 10.0'],
	open:  ['40 18 48 18 52.5 18.9 48 21 49 24 49.5 21 53 19 56 23 46 36 46 30 49 30 44 26 44 45 59 45 60 44 60 13 51 4 49 4 58 13 50 13 50 4 29 4 28 5 28 12 31 12 31 8 43 8 43 9 31 9 31 11 39 11 39 12 28 12 28 44 29 45 44 45 44 26 39 30 42 30 42 36 32 23 34.8 19.1 38.5 22 37.5 25 40 21.5 45 21 39 21 35.3 18.9'],
	about: ['135 7 131 7 131 57 181 57 181 7 134 7 134 11 177 11 177 53 135 53',
					'39 21.8 45.1 13.5 53.0 19.6 50.9 26.1 56.3 18.5 67.1 17.5 54.1 17.5 46.3 13.0 56.3 11 73.6 11 83.5 12.9 73.6 17.5 76.9 26 76.9 17.5 84.6 13.4 91 21.8 65 53',
					'142 36.6 152.9 36.6 154.6 42.5 157.6 42.5 150.5 19 145.1 19 138 42.5 141.0 42.5 147.6 20.2 148.0 20.2 152.1 34.0 142 34.0',
					'159.8 35 174 35 174 32.8 173.5 30.4 172.1 28.0 169.6 26.1 166.0 25.3 162.8 26.0 160.1 27.7 158.4 30.3 157.8 34.3 158.4 37.8 160.1 40.6 162.7 42.3 166.0 43 168.8 42.6 171.1 41.5 172.8 39.7 173.7 37.7 171.2 37.0 170.6 38.4 169.6 39.5 168.1 40.2 166.0 40.5 163.7 40.1 162.0 39 160.8 37.1 160.4 35 160.5 32.5 161.1 30.7 162.3 29.2 164.0 28.2 166.0 27.8 167.9 28.2 169.6 29.1 170.8 30.6 171.3 32.5 159.8 32.5',
					'100 30.4 100.8 36.2 100 42.0 112.3 39.5 111.5 44.5 119 36.2 111.5 28 112.3 32.9']
};


// ================ FUNCTIONS =============


/** Set the current comp to the var thisComp */
function setComp() {
	thisComp = app.project.activeItem;																						// stupid extendscript
	if (!thisComp || !(thisComp instanceof CompItem)) {														// Make sure a comp is selected
		alert("Gotta select a comp first");
		return false;
	}
	workStart = thisComp.workAreaStart;																						// set the workStart var
	workEnd = workStart + thisComp.workAreaDuration;															// set the workEnd var
	fr = thisComp.frameRate;																											// set the frameRate
	return true;
}


/** draw a text button with colored background
		@param {parentObj} object - ScriptUI group that holds the button
		@param {accentColor} color - background color
		@param {buttonText} string - button text
		@license Apache-2.0 - https://github.com/adamplouff/scriptui-battlestyle
*/
function buttonColorText(parentObj, accentColor, buttonText) {
	var btn = parentObj.add('button', undefined, '', {name:'ok'});								// draw a regular button, make it pressable with ENTER key
			btn.fillBrush = btn.graphics.newBrush( btn.graphics.BrushType.SOLID_COLOR, hexToArray(accentColor));

			btn.text = buttonText;																										// text to uppercase

			btn.textPen = btn.graphics.newPen (
				btn.graphics.PenType.SOLID_COLOR,hexToArray('#ffffff'), 1);							// text color white
			btn.onDraw = gfxDraw;																											// do the drawing of the colors

	return btn;																																		// return the button for the listener

	function gfxDraw() {																													// func that does the drawing
		{ with (this) {
			graphics.drawOSControl();
			graphics.rectPath(0,0,size[0],size[1]);
			graphics.fillPath(fillBrush);
			if( text ) graphics.drawString(
				text,
				textPen,
				(size[0]-graphics.measureString (text,graphics.font,size[0])[0])/2,
				(size[1]-graphics.measureString (text,graphics.font,size[0])[1])/1.75,
				graphics.font);
		}}
	}
	function hexToArray(hexString) {																							// func that converts hex to AE color array
		var hexColor = hexString.replace('#', '');
		var r = parseInt(hexColor.slice(0, 2), 16) / 255,
				g = parseInt(hexColor.slice(2, 4), 16) / 255,
				b = parseInt(hexColor.slice(4, 6), 16) / 255;
		return [r, g, b, 1];
	}
}


/** draw a icon button with colored background
		@param {parentObj} object - ScriptUI group that holds the button
		@param {iconVec} string - svg coords as text string
		@param {iconColor} color - background color
		@param {size} array - button size
		@license Apache-2.0 - https://github.com/adamplouff/scriptui-battlestyle
*/
function buttonColorVector(parentObj, iconVec, iconColor, size) {
	var artSize = size;																														// defines the artsize before resizing the button container
	var vButton = parentObj.add('button', [0,0,size[0],size[1], undefined]);
			vButton.coord = vecToPoints(iconVec);
			vButton.onDraw = vecDraw;

			return vButton;

	function vecToPoints(vecCoord) {																							// func that converts SVG coords to ScriptUI coords
		var points = [];
		var n;

		for(var i = 0; i < vecCoord.length; i++) {      														// loop through the paths in a multi path icon
			var eachNum = vecCoord[i].split(/[\s,]/);    															// create an array of all the numbers - split at spaces or commas
			var coordinates = [];
			var sets = [];

			for (var k = 0; k < eachNum.length; k+=2) {																// AI adds commas between coords, sketch just spaces
				sets.push(eachNum[k] + ',' + eachNum[k+1]);															// add pairs of numbers to an array
			}

			for (var j = 0; j < sets.length; j++) {																		// loop through all sets
				n = sets[j].split(',');																									// split each set apart
				coordinates[j] = n;
				coordinates[j][0] = (parseFloat(coordinates[j][0]));
				coordinates[j][1] = (parseFloat(coordinates[j][1]));
			}
		points.push(coordinates);																										// combine each x,y as a 2D array
		}
		return points;																															// return the 2D array
	}

	function hexToArray(hexString) {																							// func that converts hex to AE color array
		var hexColor = hexString.replace('#', '');
		var r = parseInt(hexColor.slice(0, 2), 16) / 255,
				g = parseInt(hexColor.slice(2, 4), 16) / 255,
				b = parseInt(hexColor.slice(4, 6), 16) / 255;
		return [r, g, b, 1];
	}
	function vecDraw() {																													// func that does the drawing
		with ( this ) {
			graphics.drawOSControl();

			// draw background
			graphics.rectPath(0,0,size[0],size[1]);
			graphics.fillPath(graphics.newBrush(graphics.BrushType.SOLID_COLOR, hexToArray(iconColor)));

			// draw shape
			for (var i = 0; i < coord.length; i++) {
				var line = coord[i];

				graphics.newPath();
				graphics.moveTo(line[0][0] + (size[0]/2 - artSize[0]/2), line[0][1]);
				for (var j = 0; j < line.length; j++) {
					graphics.lineTo(line[j][0] + (size[0]/2 - artSize[0]/2), line[j][1]);
				}
				graphics.fillPath(graphics.newBrush(graphics.BrushType.SOLID_COLOR, [1,1,1,0.75]));
			}
		}
	}
}


/** calc the comp width to arboard width or return the dropdown scale factor
		@param {artboardWidth} int - width of the imported artboard from json
*/
function getCompMultiplier(artboardWidth) {
	if (!cb_newComp.value) {																											// if adding to an existing comp
		var scaleFac = thisComp.width / artboardWidth;															// get a scale factor based current artboard width
		return scaleFac;
	}
	if (ddl_compScale.selection.index === 0) {																		// return a scale factor based on the dropdown
		return 3;
	}
	if (ddl_compScale.selection.index === 1) {
		return 2;
	}
	if (ddl_compScale.selection.index === 2) {
		return 1;
	}
}


/** decode the json from Sketch and filter layer types
		@param {entryText} string - json layers from Sketch
*/
function buildLayers(entryText) {
	labelColor = 2;																																// set the starting label color

	try {
	var sketchCode = new File();																									// create new file to hold parsed json
	sketchCode = JSON.parse(File.decode(entryText));															// decode the json and parse it

	app.beginUndoGroup('Sketch Import');
		filterTypes(sketchCode);																										// do the filtering of each layer type
	app.endUndoGroup();

	// close twirled layers
	app.executeCommand(2771);
	app.executeCommand(2771);

	} catch(e) {
		// alert('Gotta paste some Sketch2AE code');																		// non-debuq error
		alert(e.toString() + "\nError on line: " + e.line.toString());								// debuq error
	}
}


/** create a SYMBOL folder if one doesn't exist */
function createSymbolFolder() {
	var hasSymbolFolder = false;																									// initialize var with false
	for (var i = 1; i <= app.project.numItems; i++) {															// loop through all project items
		if (app.project.item(i) instanceof FolderItem) {    												// find folders
			if (app.project.item(i).name == symbolFolderName) {												// check if it's name matches the symbol folder name
				hasSymbolFolder = true;																									// set the var to true
				symbolFolder = app.project.item(i);																			// define the symbolFolder var to the found folder
				break;																																	// stop all that looping
			}
		}
	}
	if (!hasSymbolFolder) {																												// if no symbol folder is found
		symbolFolder = app.project.items.addFolder(symbolFolderName);								// create symbol folder
	}
}


/** create an IMAGE folder if one doesn't exist */
function createImageFolder() {
	var hasImageFolder = false;																										// initialize var with false
	for (var i = 1; i <= app.project.numItems; i++) {															// loop through all project items
		if (app.project.item(i) instanceof FolderItem) {														// find folders
			if (app.project.item(i).name == imageFolderName) { 												// check if it's name matches the image folder name
				hasImageFolder = true;																									// set the var to true
				imageFolder = app.project.item(i);																			// define the imageFolder var to the found folder
				break;																																	// stop all that looping
			}
		}
	}
	if (!hasImageFolder) {																												// if no image folder is found
		imageFolder = app.project.items.addFolder(imageFolderName);									// create image folder
	}
}


/** create a symbol layer as precomp and add it to the comp
		@param {layer} obj - json layers from Sketch
*/
function createSymbol(layer) {
	var symbol;																																		// var to hold the precomp item
	var symbolExists = false;																											// initialize var with false
	for (var i = 1; i <= symbolFolder.items.length; i++) {												// loop through all items in the symbol folder
		if (symbolFolder.item(i).comment === layer.symbolID) {											// if the comment on the precomp matches the symbol id
			symbolExists = true;																											// set the var to true
			symbol = symbolFolder.item(i);																						// define the symbol var to the found precomp
			break;																																		// stop all that looping
		}
	}

	if (!symbolExists){																														// if no existing symbol is found
		symbol = app.project.items.addComp(																					// create a new precomp and initialize it as var symbol
						layer.name, 																												// name
						Math.round(layer.symbolSize[0]), 																		// width
						Math.round(layer.symbolSize[1]), 																		// height
						thisComp.pixelAspect, 																							// pixel aspect from current comp
						thisComp.duration, 																									// duration from current comp
						thisComp.frameRate); 																								// framerate from current comp
		symbol.parentFolder = symbolFolder;																					// move new precomp into the symbolFolder
		symbol.comment = layer.symbolID;																						// set the comment to the symbol id

		// run layer filter for layers inside of symbol
		var mainComp = thisComp;																										// temporarily store the current comp as mainComp
		thisComp = symbol;																													// set thisComp to the newly created symbol comp to create in
		var compMultStorage = compMult;																							// temp storage of the current compMult value
		compMult = 1;																																// set compMult to 1x for layers in symbol precomp
		filterTypes(layer.layers, null);																						// filter layers in symbol
		compMult = compMultStorage;																									// reset compMult back to artboard multiplier
		thisComp = mainComp;																												// reset thisComp to the mainComp
	}

	return symbol;																																// return new symbol precomp
}


/** create a symbol layer as precomp and add it to the comp
		@param {sketchCode} obj - converted json layers from Sketch
		@param {opt_parent} layer obj - optional, parent new layer to parent layer if present
*/
function filterTypes(sketchCode, opt_parent) {
	var groupParent = null;																												// initialize var with null
	if (opt_parent != null) {																											// check if a the layer has a parent
		groupParent = opt_parent;																										// set groupParent to the parent layer
	}
	for (var i = 0; i < sketchCode.length; i++) {																	// loop through all layers in the imported sketch code
		if (sketchCode[i].type === 'MSLayerGroup') {																// it's a group
			aeGroup(sketchCode[i], groupParent);
		}
		if (sketchCode[i].type === 'MSSymbolInstance') {														// it's a symbol
			aeSymbol(sketchCode[i], groupParent);
		}
		if (sketchCode[i].type === 'CompoundShape') {																// it's a compund shape with multiple shapes
			aeCompound(sketchCode[i], groupParent);
		}
		if (sketchCode[i].type === 'MSRectangleShape') {														// it's a rectangle
			aeRect(sketchCode[i], groupParent);
		}
		if (sketchCode[i].type === 'MSOvalShape') {																	// it's a oval
			aeEllipse(sketchCode[i], groupParent);
		}
		if (sketchCode[i].type === 'MSTextLayer') {																	// it's text
			aeText(sketchCode[i], groupParent);
		}
		if (sketchCode[i].type === 'MSBitmapLayer') {																// it's an image
			aeImage(sketchCode[i], groupParent);
		}
		if (sketchCode[i].type === 'MSShapePathLayer') {														// it's a path
			aePath(sketchCode[i], groupParent);
		}
		if (sketchCode[i].type === 'MSArtboardGroup' || sketchCode[i].type === 'MSSymbolMaster') {
			aeArtboard(sketchCode[i]);
		}

	}
}


/** add a shape layer fill
		@param {r} layer obj - AE layer to apply fill to
		@param {layer} obj - fill data imported from Sketch
*/
function addFill(r, layer) {
	if (layer.fill !== null) {																										// as long as it has a fill run the code
		for (var i = layer.fill.length-1; i >= 0; i--) {														// loop through multiple fill objects
			var sketchBlendMode = layer.fill[i].blendMode;													// store the blend mode from Sketch
			var aeBlendMode = 1;																										// init AE blend mode as normal

			switch (sketchBlendMode) {																							// set AE blend mode to sketch blend mode
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

			var fill = r(2)(1)(2).addProperty("ADBE Vector Graphic - Fill");					// add a fill element
					fill.enabled = layer.fill[i].enabled;																	// disable (eyeball) if disabled in Sketch
					fill("ADBE Vector Blend Mode").setValue(aeBlendMode);									// set blend mode
					fill("ADBE Vector Fill Color").setValue(layer.fill[i].color);					// set the fill color
					fill("ADBE Vector Fill Opacity").setValue(layer.fill[i].opacity);			// set the opacity
		}
	}
}


/** add a shape layer stroke
		@param {r} layer obj - AE layer to apply stroke to
		@param {layer} obj - stroke data imported from Sketch
*/
function addStroke(r, layer) {
	if (layer.stroke !== null) {																									// as long as it has a stroke run the code
		for (var i = layer.stroke.length-1; i >= 0; i--) {													// loop through multiple stroke objects
			var stroke = r(2)(1)(2).addProperty("ADBE Vector Graphic - Stroke");			// add a fill element
					stroke.enabled = layer.stroke[i].enabled;															// disable (eyeball) if disabled in Sketch
					stroke("ADBE Vector Stroke Color").setValue(layer.stroke[i].color);					// set the stroke color
					stroke("ADBE Vector Stroke Opacity").setValue(layer.stroke[i].opacity);			// set the stroke opacity
					stroke("ADBE Vector Stroke Width").setValue(layer.stroke[i].width);					// set the stroke width
					stroke("ADBE Vector Stroke Line Cap").setValue(layer.stroke[i].cap + 1);		// set the stroke cap
					stroke("ADBE Vector Stroke Line Join").setValue(layer.stroke[i].join + 1 );	// set the stroke join
		}
	}
}


/** set the layer blend mode
		@param {r} layer obj - AE layer to change blend mode
		@param {layer} obj - blend mode data imported from Sketch
*/
function setLayerBlendMode(r, layer) {
	var aeBlendMode = BlendingMode.NORMAL;																				// init aeBlendMode
	var sketchBlendMode = 0;																											// init sketchBlendMode with normal mode
	try{ sketchBlendMode = layer.blendMode; } catch(e) {}   											// if the layer has a blendMode

	if (sketchBlendMode !== 0) {																									// if the layer's blendMode is not normal

		switch (sketchBlendMode) {																									// set AE blend mode to sketch blend mode
			case 1:
				aeBlendMode = BlendingMode.DARKEN;
				break;
			case 2:
				aeBlendMode = BlendingMode.MULTIPLY;
				break;
			case 3:
				aeBlendMode = BlendingMode.COLOR_BURN;
				break;
			case 4:
				aeBlendMode = BlendingMode.LIGHTEN;
				break;
			case 5:
				aeBlendMode = BlendingMode.SCREEN;
				break;
			case 6:
				aeBlendMode = BlendingMode.ADD;
				break;
			case 7:
				aeBlendMode = BlendingMode.OVERLAY;
				break;
			case 8:
				aeBlendMode = BlendingMode.SOFT_LIGHT;
				break;
			case 9:
				aeBlendMode = BlendingMode.HARD_LIGHT;
				break;
			case 10:
				aeBlendMode = BlendingMode.DIFFERENCE;
				break;
			case 11:
				aeBlendMode = BlendingMode.EXCLUSION;
				break;
			case 12:
				aeBlendMode = BlendingMode.HUE;
				break;
			case 13:
				aeBlendMode = BlendingMode.SATURATION;
				break;
			case 14:
				aeBlendMode = BlendingMode.COLOR;
				break;
			case 15:
				aeBlendMode = BlendingMode.LUMINOSITY;
				break;
			default: aeBlendMode = BlendingMode.NORMAL;
		}
	}
	r.blendingMode = aeBlendMode;																									// set AE layer's blend mode
}


/** add drop shadows
		@param {r} layer obj - AE layer to add drop shadow
		@param {layer} obj - drop shadow data imported from Sketch
*/
function addDropShadow(r, layer) {
	try {
	if (layer.shadow !== null) {																									// as long as it has a shadow run the code
		for (var i = layer.shadow.length-1; i >= 0; i--) {													// loop through multiple shadow objects
			// math stuff
			var x = layer.shadow[i].position[0]*compMult;															// set X offset val to the var x
			var y = layer.shadow[i].position[1]*compMult;															// set Y offset val to the var y
			var shadowDistance = Math.sqrt((x * x) + (y * y));                        // pythagorean theorem dude
			var shadowAngle = 90+(Math.atan(y/x) * (180/Math.PI));
					shadowAngle = (isNaN(shadowAngle)) ? 180 : shadowAngle;								// error catch to just define straight down

			var shadowEffect = r("ADBE Effect Parade").addProperty("ADBE Drop Shadow");									// add drop shadow
					shadowEffect("ADBE Drop Shadow-0001").setValue(layer.shadow[i].color);        					// color
					shadowEffect("ADBE Drop Shadow-0002").setValue(layer.shadow[i].color[3]*255); 					// opacity
					shadowEffect("ADBE Drop Shadow-0003").setValue(shadowAngle);                  					// angle
					shadowEffect("ADBE Drop Shadow-0004").setValue(shadowDistance);               					// distance
					shadowEffect("ADBE Drop Shadow-0005").setValue(layer.shadow[i].blur*compMult);					// blur
		}
	}
	}catch(e) {
		alert(e.toString() + "\nError on line: " + e.line.toString());
	}
}


/** add inner shadow – only one because layer styles can only be one per layer
		@param {r} layer obj - AE layer to add inner shadow
		@param {layer} obj - inner shadow data imported from Sketch
*/
function addInnerShadow(r, layer) {
	try {
	if (layer.innerShadow !== null) {																							// as long as it has a shadow run the code

		// math stuff
		var x = layer.innerShadow[0].position[0]*compMult;													// set X offset val to the var x
		var y = layer.innerShadow[0].position[1]*compMult;													// set Y offset val to the var y
		var shadowDistance = Math.sqrt((x * x) + (y * y));                      	  // pythagorean theorem dude
		var shadowAngle = 180-(Math.atan(y/x) * (180/Math.PI));
				shadowAngle = (isNaN(shadowAngle)) ? 180 : shadowAngle;									// error catch to just define straight down

		r.selected = true;																													// select layer in order to apply a menu command to it
		app.executeCommand(app.findMenuCommandId("Inner Shadow"));									// apply menu command for Inner Shadow
		r("ADBE Layer Styles")(3)("innerShadow/mode2").setValue(1);																		// blend mode
		r("ADBE Layer Styles")(3)("innerShadow/color").setValue(layer.innerShadow[0].color);					// color
		r("ADBE Layer Styles")(3)("innerShadow/opacity").setValue(layer.innerShadow[0].color[3]*100); // opacity
		r("ADBE Layer Styles")(3)("innerShadow/localLightingAngle").setValue(shadowAngle);						// angle
		r("ADBE Layer Styles")(3)("innerShadow/distance").setValue(shadowDistance);										// distance
		r("ADBE Layer Styles")(3)("innerShadow/blur").setValue(layer.innerShadow[0].blur * compMult);	// blur
		r.selected = false;																													// deselect layer
	}
	}catch(e) {
		alert(e.toString() + "\nError on line: " + e.line.toString());
	}
}


// DEPRECIATED?
function addClipping(layer) {
	// if (clippingMask > 0) {
	// 	var setMatte = layer("ADBE Effect Parade").addProperty("ADBE Set Matte3");
	// 		clippingMask++;
	// 		setMatte('ADBE Set Matte3-0001').setValue(clippingMask);
	// } else {
	// 	return;
	// }
}

/** helper func that adds tangent data to the path object
		@param {path} path obj - raw path object
		@param {vertexArray} array - points in the path
		@param {inTangentsArray} array - tangents into the point
		@param {outTangentsArray} array - tangents out of the point
		@param {closed} bool - whether the path is closed or not
*/
function createStaticShape(path, vertexArray, inTangentsArray, outTangentsArray, closed) {
	var pathValue = path.value;
		pathValue.vertices = vertexArray;
		pathValue.inTangents = inTangentsArray;
		pathValue.outTangents = outTangentsArray;
		pathValue.closed = (closed === 1);
	path.setValue(pathValue);
}

/** add inner shadow – only one because layer styles can only be one per layer
		@param {layer} obj - artboard obj from Sketch
*/
function aeArtboard(layer) {
	if (cb_newComp.value) {																												// skip the code if UI check box for new comp is disabled
		if (ddl_compScale.selection.index === 0) {																	// 3x selected
			compMult = 3;																															// set compMult to 3
		} else if (ddl_compScale.selection.index === 1) {														// 2x selected
			compMult = 2;																															// set compMult to 2
		} else  {
			compMult = 1;																															// set compMult to 1
		}
		thisComp = app.project.items.addComp(	layer.name, 													// create new comp
																					layer.size[0] * compMult, 						// x size
																					layer.size[1] * compMult,  						// y size
																					1, 60, 60);    												// pixelAspect=1, duration=60sec, frameRate=60fps
		thisComp.bgColor = [layer.backgroundColor[0],
												layer.backgroundColor[1],
												layer.backgroundColor[2]];															// set the comp background color to the artboard background color
		thisComp.openInViewer();																										// open new comp
	}

	app.activeViewer.setActive();																									// set the viewer to active
	compMult = getCompMultiplier(layer.size[0]);																	// above code is skipped so it gets the comp multiplier foro
}


/** create a group layer as a parent for sub-layers
		@param {layer} obj - converted json layers from Sketch
		@param {opt_parent} layer obj - optional, parent new layer to parent layer if present
*/
function aeGroup(layer, opt_parent) {
	if (layer.layers.length < 1) { return; }																			// skip if no child layers
	var r = thisComp.layers.addShape();																						// create a new empty shape layer
	r.guideLayer = true;																													// set it as a guide layer
	r.name = '\u25BD ' + layer.name;																							// add a twirl down icon to the start of the layer name
	if (opt_parent !== null) {																										// if the guide layer has a parent
		r.parent = opt_parent;																											// set the parent
		r.moveAfter(opt_parent);																										// move the layer after the parent
	}
	labelColor = (Math.max(labelColor, 1) + 1) % 16;															// increment the label color
	r.label = labelColor;																													// set the layer color
	r.shy = true;																																	// set the layer to shy
	r.enabled = layer.isVisible;																									// set eyeball to Sketch visibility

	r(2).addProperty("ADBE Vector Group");																				// create a shape layer group
	r(2)(1).name = layer.name;																										// name it based on the layer name
	// rect
	r(2)(1)(2).addProperty("ADBE Vector Shape - Rect");														// create a rectangle
	r(2)(1)(2)(1)("ADBE Vector Rect Size").setValue([	layer.size[0]*compMult,
																										layer.size[1]*compMult]);		// size
	// r(2)(1)(2)(1)("ADBE Vector Rect Position").expression = 'thisProperty.propertyGroup(1)(2)/2';			// expression to scale from top left
	r(2)(1)(2)(1)("ADBE Vector Rect Position").setValue((layer.size/2) *compMult);

	// fill
	var fillColor = r(2)(1)(2).addProperty("ADBE Vector Graphic - Fill");					// give the rect a fill so it's selectable
	fillColor("ADBE Vector Fill Color").setValue([0,0,0,1]);											// color to black
	fillColor("ADBE Vector Fill Opacity").setValue(0);														// opacity to 0 to make an invisible fill

	// stroke
	var strokeColor = r(2)(1)(2).addProperty("ADBE Vector Graphic - Stroke");			// give the rect a stroke
	strokeColor("ADBE Vector Stroke Color").setValue([0.298,0.7569,0.9882,1]);		// color
	strokeColor("ADBE Vector Stroke Opacity").setValue(50);												// opacity to 50%
	strokeColor("ADBE Vector Stroke Width").setValue(1);													// stroke width 1px

	// transforms
	r("ADBE Transform Group")("ADBE Position").setValue([	layer.position[0]*compMult,
																												layer.position[1]*compMult]);		// set position
	// app.executeCommand(10312);																										// center anchor point

	if (layer.hasClippingMask) {
		clippingMask = 1;
	}
	filterTypes(layer.layers, r);																									// feed the sub layers through the filter
	clippingMask = null;																													// reset to null
	r.enabled = false;																														// turn off the eyeball
}

/** create a symbol layer and add to comp
		@param {layer} obj - converted json layer from Sketch
		@param {opt_parent} layer obj - optional, parent new layer to parent layer if present
*/
function aeSymbol(layer, opt_parent) {
	createSymbolFolder();																													// fancy func that checks for symbol folder
	var symbolPrecomp = createSymbol(layer);																			// fancy func that checks if symbol exists
	var r = thisComp.layers.add(symbolPrecomp, symbolPrecomp.duration);						// add the symbol to comp
	r.name = '\u21BB ' + r.name;																									// add symbol icon to layer name
	r.collapseTransformation = true;																							// enable continuous rasterize

	if (opt_parent !== null) {																										// check for parenting
		r.parent = opt_parent;																											// parent layer
		r.moveAfter(opt_parent);																										// move below parent layer
	} else {
		labelColor = (Math.max(labelColor, 1) + 1) % 16;														// increment label color
	}
	r.label = labelColor;																													// set label color

	addClipping(r);																																// add clipping mask if exists
	addDropShadow(r, layer);																											// add drop shadow if exists
	addInnerShadow(r, layer);																											// add inner shadow if exists
	setLayerBlendMode(r, layer);																									// set blend mode

	var scaleVal = [(100 * compMult) * (layer.size[0]/layer.symbolSize[0]),
									(100 * compMult) * (layer.size[1]/layer.symbolSize[1])];			// get the symbol size and compare it to the in-comp size for the scale value

	r("ADBE Transform Group")("ADBE Anchor Point").setValue([0,0]);												// set anchor point
	r("ADBE Transform Group")("ADBE Position").setValue([	layer.position[0]*compMult,
																												layer.position[1]*compMult]); 	// set position
	r("ADBE Transform Group")("ADBE Scale").setValue(scaleVal);														// set scale
	r("ADBE Transform Group")("ADBE Opacity").setValue(layer.opacity);										// set opacity
	r.selected = true;
	app.executeCommand(10312);																										// center anchor point
	r.selected = false;																														// deselect layer
}

/** create a rectangle shape layer
		@param {layer} obj - converted json layer from Sketch
		@param {opt_parent} layer obj - optional, parent new layer to parent layer if present
*/
function aeRect(layer, opt_parent) {
	var r = thisComp.layers.addShape();																						// add empty shape layer
	r.name = layer.name;																													// set layer name
	r.selected = false;																														// deselect layer
	if (opt_parent !== null) {																										// check for parenting
		r.parent = opt_parent;																											// parent layer
		r.moveAfter(opt_parent);																										// move below parent layer
		r.enabled = (layer.isVisible && opt_parent.enabled );												// set layer visibility (eyeball)
	} else {
		labelColor = (Math.max(labelColor, 1) + 1) % 16;														// increment label color
		r.enabled = layer.isVisible;																								// set layer visibility (eyeball)
	}
	r.label = labelColor;																													// set label color


	r(2).addProperty("ADBE Vector Group");																				// create an empty group
	r(2)(1).name = layer.name;																										// name it the same as the layer

	r(2)(1)(2).addProperty("ADBE Vector Shape - Rect");														// create a rectangle shape
	r(2)(1)(2)(1)("ADBE Vector Rect Size").setValue( layer.size );								// set the size
	// r(2)(1)(2)(1)("ADBE Vector Rect Position").setValue( layer.size/2 )						// reposition shape to top left
	r(2)(1)(2)(1)("ADBE Vector Rect Roundness").setValue(layer.roundness);				// set the corner roundness

	addStroke(r, layer);																													// add stroke if exists
	addFill(r, layer);																														// add fill if exists
	addClipping(r);																																// add clipping mask if exists
	addDropShadow(r, layer);																											// add drop shadow if exists
	addInnerShadow(r, layer);																											// add inner shadow if exists
	setLayerBlendMode(r, layer);																									// set blend mode

	// transforms
	r(2)(1)("ADBE Vector Transform Group")("ADBE Vector Scale").setValue([100*compMult, 	// set scale
																																				100*compMult]);
	r("ADBE Transform Group")("ADBE Position").setValue([	(layer.position[0]+layer.size[0]/2)*compMult,
																												(layer.position[1]+layer.size[1]/2)*compMult]);			// set position
	r("ADBE Transform Group")("ADBE Opacity").setValue(layer.opacity);										// set opacity
}

/** create an ellipse shape layer
		@param {layer} obj - converted json layer from Sketch
		@param {opt_parent} layer obj - optional, parent new layer to parent layer if present
*/
function aeEllipse(layer, opt_parent) {
	var r = thisComp.layers.addShape();																						// add empty shape layer
	r.name = layer.name;																													// set layer name
	r.selected = false;																														// deselect layer
	if (opt_parent !== null) {																										// check for parenting
		r.parent = opt_parent;																											// parent layer
		r.moveAfter(opt_parent);																										// move below parent layer
		r.enabled = (layer.isVisible && opt_parent.enabled );																									// set layer visibility (eyeball)
	} else {
		labelColor = (Math.max(labelColor, 1) + 1) % 16;														// increment label color
		r.enabled = layer.isVisible;																									// set layer visibility (eyeball)
	}
	r.label = labelColor;																													// set label color

	r(2).addProperty("ADBE Vector Group");																				// create an empty group
	r(2)(1).name = layer.name;																										// name it the same as the layer

	r(2)(1)(2).addProperty("ADBE Vector Shape - Ellipse");												// create an ellipse shape
	r(2)(1)(2)(1)("ADBE Vector Ellipse Size").setValue(layer.size);								// set the size
	// r(2)(1)(2)(1)("ADBE Vector Ellipse Position").setValue( layer.size/2 )				// reposition shape to top left

	addStroke(r, layer);																													// add stroke if exists
	addFill(r, layer);																														// add fill if exists
	addClipping(r);																																// add clipping mask if exists
	addDropShadow(r, layer);																											// add drop shadow if exists
	addInnerShadow(r, layer);																											// add inner shadow if exists
	setLayerBlendMode(r, layer);																									// set blend mode

	// transforms
	r(2)(1)("ADBE Vector Transform Group")("ADBE Vector Scale").setValue([100*compMult,
																																				100*compMult]); 	// set scale
	r("ADBE Transform Group")("ADBE Position").setValue([	(layer.position[0]+layer.size[0]/2)*compMult,
																												(layer.position[1]+layer.size[1]/2)*compMult]);			// set position
	r("ADBE Transform Group")("ADBE Opacity").setValue(layer.opacity);											// set opacity
}


/** create a compound shape layer with multiple shapes inside
		@param {layer} obj - converted json layer from Sketch
		@param {opt_parent} layer obj - optional, parent new layer to parent layer if present
*/
function aeCompound(layer, opt_parent) {
	var r = thisComp.layers.addShape();																						// add empty shape layer
	r.name = layer.name;																													// set layer name
	if (opt_parent !== null) {																										// check for parenting
		r.parent = opt_parent;																											// parent layer
		r.moveAfter(opt_parent);																										// move below parent layer
		r.enabled = (layer.isVisible && opt_parent.enabled );												// set layer visibility (eyeball)
	} else {
		labelColor = (Math.max(labelColor, 1) + 1) % 16;														// increment label color
		r.enabled = layer.isVisible;																									// set layer visibility (eyeball)
	}
	r.label = labelColor;																													// set label color

	r(2).addProperty("ADBE Vector Group");																				// create an empty group
	r(2)(1).name = layer.name;																										// name it the same as the layer

	// build sub shapes
	for (var i = 0; i < layer.layers.length; i++) {																														// loop through all shapes in a compound
		var group = r(2)(1)(2).addProperty("ADBE Vector Group");																								// create an empty group
				group.name = layer.layers[i].name;																																	// name group based on shape name
				var topLeft = layer.layers[i].position + (layer.layers[i].size/2);																	// define the top left of the layer
				group("ADBE Vector Transform Group")("ADBE Vector Anchor").setValue( topLeft );											// set anchor to top left
				group("ADBE Vector Transform Group")("ADBE Vector Position").setValue( topLeft );										// set postion to top left
				group("ADBE Vector Transform Group")("ADBE Vector Rotation").setValue(-layer.layers[i].rotation);		// set rotation

		if (layer.layers[i].type === 'MSRectangleShape'){																												// if a rectangle
			var rect = group(2).addProperty("ADBE Vector Shape - Rect");																					// add a rect shape
					rect("ADBE Vector Rect Size").setValue(layer.layers[i].size);																			// set size
					rect("ADBE Vector Rect Position").setValue(layer.layers[i].position);															// set position
					rect("ADBE Vector Rect Position").expression = 'thisProperty.propertyGroup(1)(2)/2 + value';			// expression for scaling from top left
					rect("ADBE Vector Rect Roundness").setValue(layer.layers[i].roundness);
		}
		if (layer.layers[i].type === 'MSOvalShape'){																														// if an ellipse
			var ellipse = group(2).addProperty("ADBE Vector Shape - Ellipse");																		// add an ellipse shape
					ellipse("ADBE Vector Ellipse Size").setValue(layer.layers[i].size);																// set size
					ellipse("ADBE Vector Ellipse Position").setValue(layer.layers[i].position);												// set position
					ellipse("ADBE Vector Ellipse Position").expression = 'thisProperty.propertyGroup(1)(2)/2 + value';	// expression for scaling from top left
		}
		if (layer.layers[i].type === 'MSShapePathLayer'){																												// if a path
			group("ADBE Vector Transform Group")("ADBE Vector Anchor").setValue([0,0]);														// zero out anchor point
			group("ADBE Vector Transform Group")("ADBE Vector Position").setValue(layer.layers[i].position);			// set position of path
			var vect = group(2).addProperty("ADBE Vector Shape - Group");																					// add a path shape
				if (layer.layers[i].path.points.length < 1) { return; }																												// skip if no vertices
				var path = vect.property("ADBE Vector Shape");																											// create a vector object
				var vertices = layer.layers[i].path.points;																													// get vertex data
				if (vertices.length < 1) {
					return;
				}
				var inTangents = layer.layers[i].path.inTangents;																										// get tangent data
				var outTangents = layer.layers[i].path.outTangents;																									// get tangent data
				var shapeClosed = layer.layers[i].path.closed;																											// is path closed
				createStaticShape(path, vertices, inTangents, outTangents, shapeClosed);														// run func to combine all the path data


				// round corners
				if (layer.layers[i].roundness > 0) {																																// if roundness is greater than 0
					var round = group(2).addProperty("ADBE Vector Filter - RC");																			// create Round Corner element
							round("ADBE Vector RoundCorner Radius").setValue(layer.layers[i].roundness);									// set roundness value
				}
		}
		if (i > 0) {    																														// only add merge path after the second shape
			addMerge(layer.layers[i].booleanOperation);
		}
	}

	addStroke(r, layer);																													// add stroke if exists
	addFill(r, layer);																														// add fill if exists
	addClipping(r);																																// add clipping mask if exists
	addDropShadow(r, layer);																											// add drop shadow if exists
	addInnerShadow(r, layer);																											// add inner shadow if exists
	setLayerBlendMode(r, layer);																									// set blend mode

	// transforms
	r(2)(1)("ADBE Vector Transform Group")("ADBE Vector Scale").setValue([100*compMult,
																																				100*compMult]); 	// set scale
	r("ADBE Transform Group")("ADBE Position").setValue([ layer.position[0]*compMult,
																												layer.position[1]*compMult]);			// set position
	r("ADBE Transform Group")("ADBE Opacity").setValue(layer.opacity);											// set opacity

	function addMerge(bool) {																											// func to add a merge paths element
			var merge = r(2)(1)(2).addProperty("ADBE Vector Filter - Merge");					// add merge paths
					merge("ADBE Vector Merge Type").setValue(bool+2);											// set merge type
	}
	r.selected = true;
	app.executeCommand(10312);																										// center anchor point
	r.selected = false;																														// deselect layer
}


/** create a path shape layer
		@param {layer} obj - converted json layer from Sketch
		@param {opt_parent} layer obj - optional, parent new layer to parent layer if present
*/
function aePath(layer, opt_parent) {
	if (layer.path.points.length < 1) { return; }																	// skip if no vertices
	var r = thisComp.layers.addShape();																						// add empty shape layer
	r.name = layer.name;																													// set layer name
	if (opt_parent !== null) {																										// check for parenting
		r.parent = opt_parent;																											// parent layer
		r.moveAfter(opt_parent);																										// move below parent layer
		r.enabled = (layer.isVisible && opt_parent.enabled );												// set layer visibility (eyeball)
	} else {
		labelColor = (Math.max(labelColor, 1) + 1) % 16;														// increment label color
		r.enabled = layer.isVisible;																									// set layer visibility (eyeball)
	}
	r.label = labelColor;																													// set label color

	var group = r(2).addProperty("ADBE Vector Group");														// create an empty group
	group(2).addProperty("ADBE Vector Shape - Group");														// name it the same as the layer
	var path = group(2)(1).property("ADBE Vector Shape");													// create a vector object
	var vertices = layer.path.points;																							// get vertex data
	if (vertices.length < 1) { return; }																					// return if no vertices
	var inTangents = layer.path.inTangents;																				// get tangent data
	var outTangents = layer.path.outTangents;																			// get tangent data
	var shapeClosed = layer.path.closed;																					// is path closed
	createStaticShape(path, vertices, inTangents, outTangents, shapeClosed);			// run func to combine all the path data

	group("ADBE Vector Transform Group")("ADBE Vector Scale").setValue([100*compMult, 100*compMult]);		// set group scale

	// round corners
	if (layer.roundness > 0) {																										// if roundness is greater than 0
		var round = group(2).addProperty("ADBE Vector Filter - RC");								// create Round Corner element
				round("ADBE Vector RoundCorner Radius").setValue(layer.roundness);			// set roundness value
	}

	addStroke(r, layer);																													// add stroke if exists
	addFill(r, layer);																														// add fill if exists
	addClipping(r);																																// add clipping mask if exists
	addDropShadow(r, layer);																											// add drop shadow if exists
	addInnerShadow(r, layer);																											// add inner shadow if exists
	setLayerBlendMode(r, layer);																									// set blend mode

	// transforms
	r("ADBE Transform Group")("ADBE Position").setValue([	layer.position[0]*compMult,
																												layer.position[1]*compMult]);		// set position
	r("ADBE Transform Group")("ADBE Opacity").setValue(layer.opacity);										// set opacity
	r.selected = true;
	app.executeCommand(10312);																										// center anchor point
	r.selected = false;																														// deselect layer
}


/** create a text layer
		@param {layer} obj - converted json layer from Sketch
		@param {opt_parent} layer obj - optional, parent new layer to parent layer if present
*/
function aeText(layer, opt_parent) {
	try {
	var r = thisComp.layers.addBoxText([layer.size[0], layer.size[1]], '');				// add empty text box layer
	r.name = layer.name;																													// set layer name

	r.selected = false;																														// deselect layer
	if (opt_parent !== null) {																										// check for parenting
		r.parent = opt_parent;																											// parent layer
		r.moveAfter(opt_parent);																										// move below parent layer
		r.enabled = (layer.isVisible && opt_parent.enabled );												// set layer visibility (eyeball)
	} else {
		labelColor = (Math.max(labelColor, 1) + 1) % 16;														// increment label color
		r.enabled = layer.isVisible;																								// set layer visibility (eyeball)
	}
	r.label = labelColor;																													// set label color

	var textProp = r("ADBE Text Properties")("ADBE Text Document");								// new text obj

	var textDoc = textProp.value;																									// store text values
	textDoc.resetCharStyle();																											// reset character styles
	textDoc.resetParagraphStyle();																								// reset paragraph styles

	textDoc.font = layer.fontName;																								// set font name
	textDoc.fontSize = layer.fontSize;																						// set font size

	//// fill color
	var fill = layer.textColor;																										// store fill color from Sketch
	textDoc.applyFill = (layer.hasFill === 1);																		// add fill if enabled in Sketch
	textDoc.fillColor = [fill[0], fill[1], fill[2]];															// set fill color
	//// text color opacity
	if (fill[3] < 1) {
		var textOpacity = r("ADBE Text Properties")(4).addProperty("ADBE Text Animator");
				textOpacity.name = 'Text Opacity';
		if (fill[3] < 1) {
				var fillOpacity = textOpacity("ADBE Text Animator Properties").addProperty("ADBE Text Fill Opacity");
						fillOpacity.setValue(fill[3] * 100);
		}
	}

	//// stroke color
	if (layer.stroke !== null && layer.stroke.length > 0) {																									// if it has a stroke

		var stroke = layer.stroke[0];																								// get the first stroke in
		textDoc.applyStroke = (stroke.enabled === 1);																// add stroke if enabled in Sketch
		textDoc.strokeColor = [stroke.color[0], stroke.color[1], stroke.color[2]];	// set stroke color
		textDoc.strokeWidth = (stroke.width > 0) ? stroke.width : 0;								// set stroke width
		//// text stroke opacity
		if (stroke.opacity < 100) {																																									// if stroke fill is less than 100% opacity
			var textOpacity = r("ADBE Text Properties")(4).addProperty("ADBE Text Animator");													// add a text animator
				textOpacity.name = 'Text Opacity';																																			// name it Text Opacity
			var strokeOpacity = textOpacity("ADBE Text Animator Properties").addProperty("ADBE Text Stroke Opacity");	// add an opacity value
					strokeOpacity.setValue(stroke.opacity);																																// set the opacity value
		}
	}

	textFill();																																		// add multiple text fill colors

	//// text metrics
	textDoc.tracking = Math.floor(layer.tracking * compMult);

	//// paragraph
	textDoc.justification = paragraphJustification(layer.justification);					// set paragraph alignment
	textDoc.boxTextSize = [layer.size[0] * 1.05, layer.size[1] * 1.1];						// resize the text box a little taller

	//// line height
	var autoLineHeight = Math.round(layer.fontSize * 1.202);															// derive the estimated height from the font size
	var manualLineHeight = layer.lineHeight - autoLineHeight;															// get the difference of the line height and the font size
	var lineHeight = r("ADBE Text Properties")(4).addProperty("ADBE Text Animator");			// create a new text animator
			lineHeight.name = 'Line Height';																									// name it line height
			lineHeight("ADBE Text Animator Properties").addProperty("ADBE Text Line Spacing");// add a Line Spacing element
			lineHeight(1).addProperty("ADBE Text Selector");																	// add a selector
			lineHeight(2).property("ADBE Text Line Spacing").setValue([0,manualLineHeight]);	// set value


	textProp.setValue(textDoc);           																				// set text properties
	textProp.setValue(layer.stringVal);   																				// set text string

	addClipping(r);																																// add clipping mask if exists
	addDropShadow(r, layer);																											// add drop shadow if exists
	addInnerShadow(r, layer);																											// add inner shadow if exists
	setLayerBlendMode(r, layer);																									// set blend mode

	// transforms
	r("ADBE Transform Group")("ADBE Anchor Point").setValue([ Math.floor(layer.size[0] * -0.5),
										Math.round((r.sourceRectAtTime(0,false).height + layer.fontSize)*-0.49)]);  // reposition anchor to the top left
	r("ADBE Transform Group")("ADBE Scale").setValue([100*compMult, 100*compMult]);								// set scale
	r("ADBE Transform Group")("ADBE Position").setValue([ layer.position[0]*compMult,
																												layer.position[1]*compMult]);						// set position
	r("ADBE Transform Group")("ADBE Opacity").setValue(layer.opacity);														// set opacity

	r.selected = true;
	app.executeCommand(10312);																										// center anchor point
	r.selected = false;																														// deselect layer
	} catch(e) {
		alert(e.toString() + "\nError on line: " + e.line.toString());
	}
	function textFill() {																													// func to add multiple fills to a text layer
		if (layer.fill !== null) {																									// if it actually has a fill

			for (var i = 0; i < layer.fill.length; i++) {															// loop through all fill objects

				var textFill = r("ADBE Text Properties")(4).addProperty("ADBE Text Animator");
						textFill.name = 'Text Fill ' + (i + 1);
						textFill("ADBE Text Animator Properties").addProperty("ADBE Text Fill Color");
						textFill("ADBE Text Animator Properties")("ADBE Text Fill Color").setValue(layer.fill[i].color);
						textFill("ADBE Text Animator Properties").addProperty("ADBE Text Fill Opacity");
						textFill("ADBE Text Animator Properties")("ADBE Text Fill Opacity").setValue(layer.fill[i].opacity);
			}
		}
	}
	function paragraphJustification(num) {																				// func to set paragraph style
		var paraStyle;

		switch (num) {
			case 1:
				paraStyle = ParagraphJustification.RIGHT_JUSTIFY;
				break;
			case 2:
				paraStyle = ParagraphJustification.CENTER_JUSTIFY;
				break;
			case 3:
				paraStyle = ParagraphJustification.FULL_JUSTIFY_LASTLINE_FULL;
				break;
			default: paraStyle = ParagraphJustification.LEFT_JUSTIFY;
		}
		return paraStyle;
	}
}


/** import image layer, place in comp
		@param {layer} obj - converted json layer from Sketch
		@param {opt_parent} layer obj - optional, parent new layer to parent layer if present
*/
function aeImage(layer, opt_parent) {
	createImageFolder();																													// check for image folder in project
	// import images
	var filePath = (relativePath) ? inputFile.path : layer.path;   								// check if its a relative path
	var bmpImage = getItem(layer.fileName, FileSource, imageFolder);							// check if file is already imported
	if (bmpImage === null) {																											// if not imported
		var bmpFile = new ImportOptions(new File(filePath + '/' + layer.fileName));	// set the file from directory
		bmpImage = app.project.importFile(bmpFile);																	// import
		bmpImage.parentFolder = imageFolder;																				// move to IMAGES folder
			bmpImage.selected = false;																								// deselect
	}

	var r = thisComp.layers.add(bmpImage);
	r.selected = false;																														// deselect layer
	if (opt_parent !== null) {																										// check for parenting
		r.parent = opt_parent;																											// parent layer
		r.moveAfter(opt_parent);																										// move below parent layer
		r.enabled = (layer.isVisible && opt_parent.enabled );																									// set layer visibility (eyeball)
	} else {
		labelColor = (Math.max(labelColor, 1) + 1) % 16;														// increment label color
		r.enabled = layer.isVisible;																									// set layer visibility (eyeball)
	}
	r.label = labelColor;																													// set label color

	addClipping(r);																																// add clipping mask if exists
	addDropShadow(r, layer);																											// add drop shadow if exists
	addInnerShadow(r, layer);																											// add inner shadow if exists
	setLayerBlendMode(r, layer);																									// set blend mode

	// transforms
	r("ADBE Transform Group")("ADBE Position").setValue([ layer.position[0]*compMult,
																												layer.position[1]*compMult]);						// set position
	r("ADBE Transform Group")("ADBE Anchor Point").setValue([0,0]);
	r("ADBE Transform Group")("ADBE Scale").setValue([(100/layer.scale)*compMult,
																										(100/layer.scale)*compMult]);								// set scale

	r.selected = true;
	app.executeCommand(10312);																										// center anchor point
	r.selected = false;																														// deselect layer

	function getItem(itemName, itemInstanceName, locationObject) {								// func to get image file from disc
		if (locationObject.numItems > 0) {
			for (var i = 1; i <= locationObject.numItems; i ++) {
				var curItem = locationObject.item(i);
				if (curItem.name === itemName) {
					if (curItem instanceof itemInstanceName || (curItem.mainSource !== "undefined" && curItem.mainSource instanceof itemInstanceName)) {
						return curItem;
					}
				}
			}
		}
		return null;
	}
}


/** helper func for debugging to find all props in an obj
		@param {layer} obj - converted json layer from Sketch
		@param {opt_parent} layer obj - optional, parent new layer to parent layer if present
*/
function listObj(obj) {
	var propList = [];																														// array to store props

	for (var prop in obj) {																												// loop through properties in the target object
		if (obj.hasOwnProperty(prop)) {																							// error skipping
			try {
				propList.push(prop + ' -> ' + obj[prop]);																// add prop key and value to the array
			} catch(e) {propList.push(prop + ' -> OBJECT');}													// error catch for embedded object
		}
	}
	alert('Properties:\n' + propList.join('\n'));																	// popup prop list
}


/** create clickable web links from AE
		@param {url} string - web url
*/
function visitURL(url) {
	if ($.os.indexOf("Windows") != -1) {
		system.callSystem('cmd /c "' + Folder.commonFiles.parent.fsName + "\\Internet Explorer\\iexplore.exe" + '" ' + url);
	} else {
		var cmd = 'open "' + url + '"';
		system.callSystem(cmd);
	}
}


// ============ UI ===============
var mainPalette = thisObj instanceof Panel ? thisObj : new Window('palette',scriptName,undefined, {resizeable:true});

//stop if there's no window
if (mainPalette === null) return;

// set margins and alignment
mainPalette.alignChildren = ['fill','fill'];
mainPalette.margins = 5;
mainPalette.spacing = 2;


var content = mainPalette.add('group');																													// content group metrics
		content.maximumSize.width = 186;
		content.alignChildren = ['fill','top'];
		content.orientation = 'column';
		content.margins = 0;
		content.spacing = 8;


var grp_entryButtons = content.add('group');																										// main button metrics
		grp_entryButtons.minimumSize.height = 50;
		grp_entryButtons.maximumSize.height = 50;
		grp_entryButtons.orientation = 'row';
		grp_entryButtons.alignChildren = ['fill', 'fill'];

var btn_pasteSketch = buttonColorVector(grp_entryButtons, icons.paste, '#F44336', [88,50]);			// vector button
		btn_pasteSketch.helpTip = 'Paste layer data from clipboard';																// tooltip
var btn_openSketch = buttonColorVector(grp_entryButtons, icons.open, '#0097A7', [88,50]);				// vector button
		btn_openSketch.helpTip = 'Open layer data from .sktchae file';															// tooltip


var grp_options = content.add('group');
		grp_options.orientation = 'row';
		grp_options.alignChildren = ['fill', 'fill'];

var cb_newComp = grp_options.add('checkbox', undefined, 'New Comp');
		cb_newComp.helpTip = 'Or add to current comp';
		cb_newComp.value = false;
var ddl_compScale = grp_options.add('dropdownlist', undefined, ['3x', '2x', '1x']);
		ddl_compScale.helpTip = 'Comp size multiplier';
		ddl_compScale.selection = 0;
		ddl_compScale.visible = false;

var grp_mgmtButtons = content.add('group');																											// main button metrics
		grp_mgmtButtons.minimumSize.height = 24;
		grp_mgmtButtons.maximumSize.height = 24;
		grp_mgmtButtons.orientation = 'row';
		grp_mgmtButtons.alignChildren = ['fill', 'fill'];
var btn_toggleGuides = grp_mgmtButtons.add('button', undefined, 'Group Visibility');
		btn_toggleGuides.helpTip = 'Toggle guide layer visibility';
var btn_aboutScript = grp_mgmtButtons.add('button', [0,0,24,undefined], '?');
		btn_aboutScript.helpTip = 'About ' + scriptName;

// ============ Functions ===============

btn_pasteSketch.onClick = function() {
	if (!cb_newComp.value) {																															// if NEW COMP button is disabled
		if (!setComp()) {return;}         																									// check if theres a comp selected, stop if not
	}
	clippingMask = null;
	relativePath = false;																																	// TRUE allows image import to use the .Sketch2AE directory
	compMult = 1;																																					// initialize back to 1x
	var w = new Window ("dialog", 'Import layers from Sketch');														// new dialog window
			w.spacing = 0;
			w.margins = 0;
		var content = w.add('group', undefined, '');																				// group to hold intry box
				content.alignChildren = ['fill','fill'];
				content.orientation = 'column';
				content.alignment = ['left', 'top'];
				content.margins = 16;
				content.spacing = 8;																														// content metrics

				var et_codeField = content.add('edittext', [0,0,224,32], 'Paste Sketch code');	// Sketch code field
						et_codeField.active = true;																									// put the cursor in this field
				var btn_build = buttonColorText(content, '#F44336', 'Build Layers');						// button


		if (w.show() === 1) {
			if (et_codeField.text == 'Paste Sketch code') { alert('Oops gotta paste the code!\nBe sure you CMD+V to paste the Sketch layer code from your clipboard into the text box.'); return; }
			buildLayers(et_codeField.text);																										// run the master func
		}
};

btn_openSketch.onClick = function() {
	if (!cb_newComp.value) {																															// if NEW COMP button is disabled
		if (!setComp()) {return;}         																									// check if theres a comp selected, stop if not
	}
	clippingMask = null;
	relativePath = true;																																	// allows image import to use the .sktchae directory
	inputFile = File.openDialog('Open a ' + scriptName + ' file', undefined, false);			// get imported file
	if (inputFile.toString().search(/\.sktchae/) === -1) { 																// error check for a .sktchae extension
		alert('Gotta select a valid Sketch2AE file.'); return;}

	inputFile.open( 'r' );																																// open file
	var inputString = inputFile.read();																										// read file
	inputFile.close();																																		// close file

	buildLayers(inputString);																															// run the master func
};

btn_toggleGuides.onClick = function() {
	var guideViz;																																					// define var guideViz
	if (!setComp()) {return;}																															// check if theres a comp selected, stop if not
	app.beginUndoGroup('Toggle Guide Layer Visibility');
	for (var i = 1; i <= thisComp.layers.length; i++) {																		// loop through all layers
		var currentLayer = thisComp.layer(i);																								// set var currentLayer
		if (currentLayer.guideLayer === true) {																							// check if layer is a guide
			guideViz = currentLayer.enabled;																									// find the visibility of the first guideLayer
			break;																																						// quit looping
		}
	}
	for (var j = 1; j <= thisComp.layers.length; j++) {																		// loop through all layers
		var currentLayer = thisComp.layer(j);																								// set var currentLayer
		if(currentLayer.guideLayer === true) {																							// check if its a guideLayer
			currentLayer.enabled = !guideViz;																									// set the the inverse of the first found guideLayer
		}
	}
	app.endUndoGroup();
};

btn_aboutScript.onClick = function() {
	var w = new Window ('dialog', 'About ' + scriptName);																	// new dialog window
			w.spacing = 0;
			w.margins = 0;
		var content = w.add('group', undefined, '');																				// group to hold intry box
				content.alignChildren = ['fill','fill'];
				content.orientation = 'column';
				content.alignment = ['left', 'top'];
				content.margins = 16;
				content.spacing = 8;																														// content metrics

		var btn_url = buttonColorVector(content, icons.about, '#607D8B', [224,64]);

		content.add('statictext', [0,0,224,150],
			'Intended to bridge the gap between Visual Design and Motion, Sketch2AE allows users of Sketch to export assets directly into After Effects while preserving live text and shape layers. This is a major improvement over the established Illustrator to AE workflow.   😬 \n\n'+ scriptName +' - v'+ scriptVersion +' \nCreated by Adam Plouff at Google.', {multiline: true});

		buttonColorText(content, '#37474F', 'Close');
		btn_url.onClick = function() {
			visitURL('http://google.github.io/sketch2ae');
		};

		w.show();
};

cb_newComp.onClick = function() {																												// show or hide comp scaling
	if (cb_newComp.value) {
		ddl_compScale.visible = true;
	} else {
		ddl_compScale.visible = false;
	}
};


// ============ Edittext functions ===============
function clearInput() {
	// if (et_codeField.text === defaultBoxText ) {
		et_codeField.text = '';
	// }
}
function defaultInput() {
	if (et_codeField.text === '') {
			et_codeField.text = defaultBoxText;
	}
}

// ============ Show UI ===============
{
	// Set layout, and resize it on resize of the Panel/Window
	mainPalette.layout.layout(true);
	mainPalette.layout.resize();
	mainPalette.onResizing = mainPalette.onResize = function () {mainPalette.layout.resize();};
	//if the script is not a Panel (launched from File/Scripts/Run script...) we need to show it
	if (!(mainPalette instanceof Panel)) mainPalette.show();
}
})(this);
