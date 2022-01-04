console.log('Host is online');
var AEUX = (function () {
    var JSON;
    JSON || (JSON = {});
    (function () { function k(a) { return a < 10 ? "0" + a : a; } function o(a) { p.lastIndex = 0; return p.test(a) ? '"' + a.replace(p, function (a) { var c = r[a]; return typeof c === "string" ? c : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4); }) + '"' : '"' + a + '"'; } function l(a, j) { var c, d, h, m, g = e, f, b = j[a]; b && typeof b === "object" && typeof b.toJSON === "function" && (b = b.toJSON(a)); typeof i === "function" && (b = i.call(j, a, b)); switch (typeof b) {
        case "string": return o(b);
        case "number": return isFinite(b) ? String(b) : "null";
        case "boolean":
        case "null": return String(b);
        case "object":
            if (!b)
                return "null";
            e += n;
            f = [];
            if (Object.prototype.toString.apply(b) === "[object Array]") {
                m = b.length;
                for (c = 0; c < m; c += 1)
                    f[c] = l(c, b) || "null";
                h = f.length === 0 ? "[]" : e ? "[\n" + e + f.join(",\n" + e) + "\n" + g + "]" : "[" + f.join(",") + "]";
                e = g;
                return h;
            }
            if (i && typeof i === "object") {
                m = i.length;
                for (c = 0; c < m; c += 1)
                    typeof i[c] === "string" && (d = i[c], (h = l(d, b)) && f.push(o(d) + (e ? ": " : ":") + h));
            }
            else
                for (d in b)
                    Object.prototype.hasOwnProperty.call(b, d) && (h = l(d, b)) && f.push(o(d) + (e ? ": " : ":") + h);
            h = f.length === 0 ? "{}" : e ? "{\n" + e + f.join(",\n" + e) + "\n" + g + "}" : "{" + f.join(",") + "}";
            e = g;
            return h;
    } } if (typeof Date.prototype.toJSON !== "function")
        Date.prototype.toJSON = function () { return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + k(this.getUTCMonth() + 1) + "-" + k(this.getUTCDate()) + "T" + k(this.getUTCHours()) + ":" + k(this.getUTCMinutes()) + ":" + k(this.getUTCSeconds()) + "Z" : null; }, String.prototype.toJSON = Number.prototype.toJSON = Boolean.prototype.toJSON = function () { return this.valueOf(); }; var q = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, p = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g, e, n, r = { "\u0008": "\\b", "\t": "\\t", "\n": "\\n", "\u000c": "\\f", "\r": "\\r", '"': '\\"', "\\": "\\\\" }, i; if (typeof JSON.stringify !== "function")
        JSON.stringify = function (a, j, c) { var d; n = e = ""; if (typeof c === "number")
            for (d = 0; d < c; d += 1)
                n += " ";
        else
            typeof c === "string" && (n = c); if ((i = j) && typeof j !== "function" && (typeof j !== "object" || typeof j.length !== "number"))
            throw Error("JSON.stringify"); return l("", { "": a }); }; if (typeof JSON.parse !== "function")
        JSON.parse = function (a, e) { function c(a, d) { var g, f, b = a[d]; if (b && typeof b === "object")
            for (g in b)
                Object.prototype.hasOwnProperty.call(b, g) && (f = c(b, g), f !== void 0 ? b[g] = f : delete b[g]); return e.call(a, d, b); } var d, a = String(a); q.lastIndex = 0; q.test(a) && (a = a.replace(q, function (a) { return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4); })); if (/^[\],:{}\s]*$/.test(a.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, "")))
            return d = eval("(" + a + ")"), typeof e === "function" ? c({ "": d }, "") : d; throw new SyntaxError("JSON.parse"); }; })();
    var scriptName = 'AEUX';
    var devName = 'sumUX';
    var aeuxVersion = 0.81;
    var hostApp, sourcePath;
    var clippingMask = null;
    var thisComp = null;
    var compMult = 1;
    var maskLayer = {};
    var returnMessage = [];
    var maskPosition = [0, 0];
    var folderPath, compName, importVersion;
    var inputFile, labelColor, progressInc;
    var groupName = 'AEUX_group';
    var ffxFolder = Folder.userData.toString() + '/' + devName + '/' + scriptName + '/ffx/';
    var prefs = {
        parametrics: false,
        compScale: 1,
        newComp: true,
        precompGroups: true,
        frameRate: 60,
        duration: 5
    };
    if (!Folder(ffxFolder).exists) {
        Folder(ffxFolder).create();
    }
    function setComp() {
        if (app.activeViewer == null) {
            return false;
        }
        app.activeViewer.setActive();
        thisComp = app.project.activeItem;
        if (!thisComp || !(thisComp instanceof CompItem)) {
            return false;
        }
        return true;
    }
    function getCompMultiplier(artboardWidth) {
        if (!prefs.newComp) {
            var scaleFac = thisComp.width / artboardWidth;
            return scaleFac;
        }
        return prefs.compScale;
    }
    function buildLayers(compObj) {
        try {
            importVersion = compObj.layerData[0].aeuxVersion;
            maskLayer = {};
            if (aeuxVersion < importVersion) {
                downloadUpdateDialog();
                return JSON.stringify(null);
            }
            returnMessage = [];
            if (compObj.prefs) {
                prefs = compObj.prefs;
            }
            folderPath = compObj.layerData[0].folderPath;
            var importedLayerCode = compObj.layerData;
            hostApp = importedLayerCode[0].hostApp;
            sourcePath = compObj.sourcePath;
            resetProgressDialog('Reading layer data');
            labelColor = 0;
            if (!prefs.newComp) {
                progressDialog.hide();
                if (!setComp()) {
                    alert('AEUX: Open a comp first');
                    return 'false';
                }
            }
            app.beginUndoGroup(scriptName + ' build layers');
            var layerCount = importedLayerCode[0].layerCount.toString();
            progressInc = 1 / layerCount;
            try {
                progressText.remove(0);
                progressText.add('statictext', undefined, 'Building ' + layerCount + ' layers. Thanks for your patience.');
                progressDialog.layout.layout(true);
            }
            catch (error) { }
            var tempComp = app.project.items.addComp('LOADING...', 500, 500, 1, 1, 1);
            tempComp.openInViewer();
            filterTypes(importedLayerCode);
            tempComp.remove();
            if (thisComp) {
                thisComp.openInViewer();
            }
            app.endUndoGroup();
            app.executeCommand(2771);
            app.executeCommand(2771);
        }
        catch (e) {
            alert(e.toString() + "\nError on line: " + e.line.toString());
            try {
                tempComp.remove();
            }
            catch (e) { }
            progressDialog.hide();
        }
        finally {
            progressDialog.hide();
        }
        return JSON.stringify({ msg: returnMessage, layerCount: layerCount });
    }
    function filterTypes(layerData, opt_parent) {
        var groupParent = null;
        if (opt_parent != null) {
            groupParent = opt_parent;
        }
        for (var i = 0; i < layerData.length; i++) {
            if (layerData[i].type === 'Group' || layerData[i].type === 'Component') {
                aeGroup(layerData[i], groupParent);
            }
            if (layerData[i].type === 'Symbol') {
                aeSymbol(layerData[i], groupParent);
                pbar.value += progressInc;
            }
            if (layerData[i].type === 'CompoundShape') {
                aeCompound(layerData[i], groupParent);
            }
            if (layerData[i].type === 'Rect' && prefs.parametrics) {
                aeRect(layerData[i], groupParent);
                pbar.value += progressInc;
            }
            if (layerData[i].type === 'Ellipse' && prefs.parametrics) {
                aeEllipse(layerData[i], groupParent);
                pbar.value += progressInc;
            }
            if (layerData[i].type === 'Star') {
                aeStar(layerData[i], groupParent);
                pbar.value += progressInc;
            }
            if (layerData[i].type === 'Text') {
                aeText(layerData[i], groupParent);
                pbar.value += progressInc;
            }
            if (layerData[i].type === 'Image') {
                aeImage(layerData[i], groupParent);
                pbar.value += progressInc;
            }
            if (layerData[i].type === 'Path' || (!prefs.parametrics && (layerData[i].type === 'Rect' || layerData[i].type === 'Ellipse'))) {
                aePath(layerData[i], groupParent);
                pbar.value += progressInc;
            }
            if (layerData[i].type === 'Artboard') {
                if (aeArtboard(layerData[i]) == false) {
                    break;
                }
                ;
            }
            if (layerData[i].type === 'AutoLayoutBG') {
                var bg = aeRect(layerData[i], null);
                if (groupParent) {
                    bg.setParentWithJump(opt_parent);
                    bg.moveAfter(groupParent);
                }
                pbar.value += progressInc;
            }
        }
    }
    function aeText(layer, opt_parent) {
        var justificationOffset = 0;
        var r;
        try {
            if (layer.kind == 'Point') {
                r = thisComp.layers.addText('');
            }
            if (layer.kind == 'Area') {
                r = thisComp.layers.addBoxText([layer.frame.width, layer.frame.height], '');
            }
            r.name = layer.name;
            r.selected = false;
            r.label = labelColor;
            var textProp = r('ADBE Text Properties')('ADBE Text Document');
            var textDoc = textProp.value;
            textDoc.resetCharStyle();
            textDoc.resetParagraphStyle();
            textDoc.font = layer.fontName;
            textDoc.fontSize = layer.fontSize;
            var fill = [layer.textColor[0], layer.textColor[1], layer.textColor[2]];
            var opacity = layer.textColor[3];
            textDoc.applyFill = true;
            textDoc.fillColor = fill;
            if (hostApp == 'Figma') {
                textDoc.boxTextSize = [layer.frame.width, layer.frame.height];
            }
            if (opacity < 1) {
                var textOpacity = r('ADBE Text Properties')(4).addProperty('ADBE Text Animator');
                textOpacity.name = 'Text Opacity';
                if (opacity < 1) {
                    var fillOpacity = textOpacity('ADBE Text Animator Properties').addProperty('ADBE Text Fill Opacity');
                    fillOpacity.setValue(opacity * 100);
                }
            }
            setTextStroke();
            setTextFill();
            setTextTracking();
            textDoc.justification = paragraphJustification(layer.justification);
            if (layer.lineHeight != null) {
                try {
                    textDoc.leading = layer.lineHeight;
                }
                catch (e) { }
            }
            textProp.setValue(textDoc);
            textProp.setValue(layer.stringValue);
            addDropShadow(r, layer);
            addBlur(r, layer);
            addInnerShadow(r, layer);
            setLayerBlendMode(r, layer);
            setMask(r, layer);
            addBgBlur(r, layer);
            if (layer.kind == 'Point') {
                if (layer.rotation != 0 || (layer.flip[0] != 100 && layer.flip[1] != 100)) {
                    var rect = r.sourceRectAtTime(0, false);
                    var center = [rect.left + rect.width / 2, rect.top + rect.height / 2];
                    r('ADBE Transform Group')('ADBE Anchor Point').setValue(center);
                    var centeredPos = [(layer.frame.x + rect.width / 2) * compMult, (layer.frame.y + rect.height / 2) * compMult];
                    r('ADBE Transform Group')('ADBE Position').setValue(centeredPos);
                }
                else {
                    var boundsTop = r.sourceRectAtTime(thisComp.time, false).top;
                    r('ADBE Transform Group')('ADBE Position').setValue([(layer.frame.x + justificationOffset) * compMult, (layer.frame.y - boundsTop) * compMult]);
                }
            }
            else {
                var centeredPos = [(layer.frame.x) * compMult, (layer.frame.y) * compMult];
                r('ADBE Transform Group')('ADBE Position').setValue(centeredPos);
            }
            r('ADBE Transform Group')('ADBE Opacity').setValue(layer.opacity);
            r('ADBE Transform Group')('ADBE Rotate Z').setValue(layer.rotation);
            r('ADBE Transform Group')('ADBE Scale').setValue([layer.flip[0] * compMult, layer.flip[1] * compMult]);
            if (opt_parent !== null) {
                r.setParentWithJump(opt_parent);
                r.moveAfter(opt_parent);
                r.enabled = (layer.isVisible && opt_parent.enabled);
            }
            else {
                labelColor = labelColor % 16 + 1;
                r.enabled = layer.isVisible;
            }
        }
        catch (e) {
            alert(e.toString() + '\nError on line: ' + e.line.toString());
        }
        function setTextFill() {
            if (layer.fill != null) {
                for (var i = 0; i < layer.fill.length; i++) {
                    if (layer.fill[i].type == 'gradient') {
                        returnMessage.push(1);
                        return;
                    }
                    var textFill = r('ADBE Text Properties')(4).addProperty('ADBE Text Animator');
                    textFill.name = 'Text Fill ' + (i + 1);
                    textFill('ADBE Text Animator Properties').addProperty('ADBE Text Fill Color');
                    textFill('ADBE Text Animator Properties')('ADBE Text Fill Color').setValue(layer.fill[i].color);
                    textFill('ADBE Text Animator Properties').addProperty('ADBE Text Fill Opacity');
                    textFill('ADBE Text Animator Properties')('ADBE Text Fill Opacity').setValue(layer.fill[i].opacity);
                }
            }
        }
        function setTextStroke() {
            if (layer.stroke !== null && layer.stroke.length > 0) {
                var stroke = layer.stroke[0];
                textDoc.applyStroke = (stroke.enabled == 1);
                textDoc.strokeColor = [stroke.color[0], stroke.color[1], stroke.color[2]];
                textDoc.strokeWidth = (stroke.width > 0) ? stroke.width : 0;
                if (stroke.opacity < 100) {
                    var textOpacity = r('ADBE Text Properties')(4).addProperty('ADBE Text Animator');
                    textOpacity.name = 'Text Opacity';
                    var strokeOpacity = textOpacity('ADBE Text Animator Properties').addProperty('ADBE Text Stroke Opacity');
                    strokeOpacity.setValue(stroke.opacity);
                }
            }
        }
        function setTextTracking() {
            if (layer.trackingAdjusted >= 1000 || layer.trackingAdjusted <= -1000) {
                var textTracking = r('ADBE Text Properties')(4).addProperty('ADBE Text Animator');
                textTracking.name = 'Text tracking';
                textTracking('ADBE Text Animator Properties').addProperty('ADBE Text Tracking Amount');
                textTracking('ADBE Text Animator Properties')('ADBE Text Tracking Amount').setValue(layer.trackingAdjusted);
            }
            else {
                textDoc.tracking = Math.floor(layer.trackingAdjusted);
            }
        }
        function paragraphJustification(num) {
            var paraStyle;
            switch (num) {
                case 1:
                    paraStyle = ParagraphJustification.RIGHT_JUSTIFY;
                    justificationOffset = layer.frame.width;
                    break;
                case 2:
                    paraStyle = ParagraphJustification.CENTER_JUSTIFY;
                    justificationOffset = layer.frame.width / 2;
                    break;
                case 3:
                    paraStyle = ParagraphJustification.FULL_JUSTIFY_LASTLINE_FULL;
                    justificationOffset = layer.frame.width / 2;
                    break;
                default: paraStyle = ParagraphJustification.LEFT_JUSTIFY;
            }
            return paraStyle;
        }
    }
    function aeGroup(layer, opt_parent) {
        if (prefs.precompGroups || layer.type == 'Component') {
            var frameRate = prefs.frameRate || 60;
            if (layer.layers.length < 1) {
                return;
            }
            var aeuxFolder = createNamedFolder('AEUX');
            var frameFolder = createNamedFolder(compName);
            frameFolder.parentFolder = aeuxFolder;
            var groupFolder = createNamedFolder('Precomps', frameFolder);
            groupFolder.parentFolder = frameFolder;
            var groupComp = app.project.items.addComp(nameInc(layer.name, app.project.items), Math.max(Math.round(layer.frame.width * compMult), 4), Math.max(Math.round(layer.frame.height * compMult), 4), 1, thisComp.duration, frameRate);
            groupComp.bgColor = thisComp.bgColor;
            groupComp.parentFolder = groupFolder;
            var r = thisComp.layers.add(groupComp, thisComp.duration);
            var mainComp = thisComp;
            thisComp = groupComp;
            filterTypes(layer.layers, null);
            thisComp = mainComp;
            r.collapseTransformation = true;
            r('ADBE Transform Group')('ADBE Position').setValue([layer.frame.x * compMult, layer.frame.y * compMult]);
            if (opt_parent) {
                r.setParentWithJump(opt_parent);
                r.moveAfter(opt_parent);
            }
            r('ADBE Transform Group')('ADBE Scale').setValue(layer.flip);
            if (hostApp == 'Figma' && layer.type !== 'Component') {
            }
            else {
                r('ADBE Transform Group')('ADBE Rotate Z').setValue(layer.rotation);
            }
            r('ADBE Transform Group')('ADBE Opacity').setValue(layer.opacity);
            r.enabled = layer.isVisible;
            setMask(r, layer);
            addDropShadow(r, layer);
            addBlur(r, layer);
            addInnerShadow(r, layer);
        }
        else {
            if (layer.layers.length < 1) {
                return;
            }
            var r = thisComp.layers.addShape();
            r.guideLayer = true;
            r.name = nameInc(layer.name, thisComp.layers);
            r.comment = groupName;
            labelColor = labelColor % 16 + 1;
            r.label = labelColor;
            r.shy = true;
            if (opt_parent !== null) {
                r.setParentWithJump(opt_parent);
                r.moveAfter(opt_parent);
            }
            r('ADBE Transform Group')('ADBE Anchor Point').setValue([(layer.frame.width / 2) * compMult, (layer.frame.height / 2) * compMult]);
            r('ADBE Transform Group')('ADBE Position').setValue([layer.frame.x * compMult, layer.frame.y * compMult]);
            if (hostApp == 'Figma') {
            }
            else {
                r('ADBE Transform Group')('ADBE Rotate Z').setValue(layer.rotation);
            }
            r('ADBE Transform Group')('ADBE Scale').setValue(layer.flip);
            r(2).addProperty('ADBE Vector Group');
            r(2)(1).name = layer.name;
            r(2)(1)(2).addProperty('ADBE Vector Shape - Rect');
            r(2)(1)(2)(1)('ADBE Vector Rect Size').setValue([layer.frame.width * compMult, layer.frame.height * compMult]);
            r(2)(1)(2)(1)('ADBE Vector Rect Position').setValue([(layer.frame.width * compMult) / 2, (layer.frame.height * compMult) / 2]);
            var fillColor = r(2)(1)(2).addProperty('ADBE Vector Graphic - Fill');
            fillColor('ADBE Vector Fill Color').setValue([0, 0, 0, 1]);
            fillColor('ADBE Vector Fill Opacity').setValue(0);
            var strokeColor = r(2)(1)(2).addProperty('ADBE Vector Graphic - Stroke');
            strokeColor('ADBE Vector Stroke Color').setValue([0.298, 0.7569, 0.9882, 1]);
            strokeColor('ADBE Vector Stroke Opacity').setValue(50);
            strokeColor('ADBE Vector Stroke Width').setValue(1);
            filterTypes(layer.layers, r);
            if (hostApp == 'Figma') {
            }
            r.enabled = false;
            setMask(r, layer);
        }
    }
    function aeRect(layer, opt_parent) {
        var r = initShapeLayer(layer, opt_parent);
        r(2).addProperty('ADBE Vector Group');
        r(2)(1).name = layer.name;
        r(2)(1)(2).addProperty('ADBE Vector Shape - Rect');
        r(2)(1)(2)(1)('ADBE Vector Rect Size').setValue([layer.frame.width, layer.frame.height]);
        if (layer.roundness) {
            r(2)(1)(2)(1)('ADBE Vector Rect Roundness').setValue(layer.roundness);
        }
        addStroke(r, layer);
        addFill(r, layer);
        addDropShadow(r, layer);
        addBlur(r, layer);
        addInnerShadow(r, layer);
        setLayerBlendMode(r, layer);
        r(2)(1)('ADBE Vector Transform Group')('ADBE Vector Scale').setValue([100 * compMult, 100 * compMult]);
        r(2)(1)('ADBE Vector Transform Group')('ADBE Vector Rotation').setValue(layer.rotation);
        r('ADBE Transform Group')('ADBE Position').setValue([(layer.frame.x) * compMult,
            (layer.frame.y) * compMult]);
        r('ADBE Transform Group')('ADBE Opacity').setValue(layer.opacity);
        if (layer.flip) {
            r('ADBE Transform Group')('ADBE Scale').setValue(layer.flip);
        }
        if (opt_parent !== null) {
            r.setParentWithJump(opt_parent);
            r.moveAfter(opt_parent);
        }
        setMask(r, layer);
        addBgBlur(r, layer);
        return r;
    }
    function aeEllipse(layer, opt_parent) {
        var r = initShapeLayer(layer, opt_parent);
        r(2).addProperty('ADBE Vector Group');
        r(2)(1).name = layer.name;
        r(2)(1)(2).addProperty('ADBE Vector Shape - Ellipse');
        r(2)(1)(2)(1)('ADBE Vector Ellipse Size').setValue([layer.frame.width, layer.frame.height]);
        addStroke(r, layer);
        addFill(r, layer);
        addDropShadow(r, layer);
        addBlur(r, layer);
        addInnerShadow(r, layer);
        setLayerBlendMode(r, layer);
        r(2)(1)('ADBE Vector Transform Group')('ADBE Vector Scale').setValue([100 * compMult, 100 * compMult]);
        r(2)(1)('ADBE Vector Transform Group')('ADBE Vector Rotation').setValue(layer.rotation);
        r('ADBE Transform Group')('ADBE Position').setValue([layer.frame.x * compMult, layer.frame.y * compMult]);
        r('ADBE Transform Group')('ADBE Opacity').setValue(layer.opacity);
        r('ADBE Transform Group')('ADBE Scale').setValue(layer.flip);
        if (opt_parent !== null) {
            r.setParentWithJump(opt_parent);
            r.moveAfter(opt_parent);
        }
        setMask(r, layer);
        addBgBlur(r, layer);
    }
    function aeStar(layer, opt_parent) {
        var r = initShapeLayer(layer, opt_parent);
        r(2).addProperty('ADBE Vector Group');
        r(2)(1).name = layer.name;
        r(2)(1)(2).addProperty('ADBE Vector Shape - Star');
        var polyType = (layer.isStar) ? 1 : 2;
        r(2)(1)(2)(1)('ADBE Vector Star Type').setValue(polyType);
        r(2)(1)(2)(1)('ADBE Vector Star Points').setValue(layer.pointCount);
        var outerRad = (layer.frame.width * (layer.frame.height / layer.frame.width)) / 2 || 1;
        r(2)(1)(2)(1)('ADBE Vector Star Outer Radius').setValue(outerRad);
        if (polyType == 1) {
            r(2)(1)(2)(1)('ADBE Vector Star Inner Radius').setValue(layer.outerRad * layer.innerRad);
        }
        if (layer.roundness > 0) {
            var rounding = Math.min(layer.roundness, Math.min(layer.frame.width, layer.frame.height) / 2);
            var round = r(2).addProperty('ADBE Vector Filter - RC');
            round('ADBE Vector RoundCorner Radius').setValue(rounding);
        }
        addStroke(r, layer);
        addFill(r, layer);
        addDropShadow(r, layer);
        addBlur(r, layer);
        addInnerShadow(r, layer);
        setLayerBlendMode(r, layer);
        var scaleRatio = [100, 100];
        if (layer.frame.width > layer.frame.height) {
            scaleRatio[0] = 100 * layer.frame.width / layer.frame.height;
        }
        else if (layer.frame.height > layer.frame.width) {
            scaleRatio[1] = 100 * layer.frame.height / layer.frame.width;
        }
        r(2)(1)('ADBE Vector Transform Group')('ADBE Vector Scale').setValue([scaleRatio[0] * compMult, scaleRatio[1] * compMult]);
        r(2)(1)('ADBE Vector Transform Group')('ADBE Vector Rotation').setValue(layer.rotation);
        r('ADBE Transform Group')('ADBE Position').setValue([layer.frame.x * compMult, layer.frame.y * compMult]);
        r('ADBE Transform Group')('ADBE Opacity').setValue(layer.opacity);
        r('ADBE Transform Group')('ADBE Scale').setValue(layer.flip);
        if (opt_parent !== null) {
            r.setParentWithJump(opt_parent);
            r.moveAfter(opt_parent);
        }
        setMask(r, layer);
        addBgBlur(r, layer);
    }
    function aePath(layer, opt_parent) {
        if (!layer.path || layer.path.points.length < 1) {
            return;
        }
        var r = initShapeLayer(layer, opt_parent);
        var group = r(2).addProperty('ADBE Vector Group');
        r(2)(1).name = layer.name;
        group(2).addProperty('ADBE Vector Shape - Group');
        var pathProp = group(2)(1).property('ADBE Vector Shape');
        var vertices = layer.path.points;
        if (vertices.length < 1) {
            return;
        }
        var pathObj = {
            path: pathProp,
            points: layer.path.points,
            inTangents: layer.path.inTangents,
            outTangents: layer.path.outTangents,
            closed: layer.path.closed
        };
        var layerOffset = [layer.frame.width / 2, layer.frame.height / 2];
        createStaticShape(pathObj, layerOffset);
        if (layer.roundness > 0) {
            var rounding = Math.min(layer.roundness, Math.min(layer.frame.width, layer.frame.height) / 2);
            var round = group(2).addProperty('ADBE Vector Filter - RC');
            round('ADBE Vector RoundCorner Radius').setValue(rounding);
        }
        addStroke(r, layer);
        addFill(r, layer);
        addDropShadow(r, layer);
        addBlur(r, layer);
        addInnerShadow(r, layer);
        setLayerBlendMode(r, layer);
        r('ADBE Transform Group')('ADBE Position').setValue([layer.frame.x * compMult, layer.frame.y * compMult]);
        group('ADBE Vector Transform Group')('ADBE Vector Rotation').setValue(layer.rotation);
        group('ADBE Vector Transform Group')('ADBE Vector Scale').setValue([100 * compMult, 100 * compMult]);
        r('ADBE Transform Group')('ADBE Opacity').setValue(layer.opacity);
        r('ADBE Transform Group')('ADBE Scale').setValue(layer.flip);
        if (opt_parent !== null) {
            r.setParentWithJump(opt_parent);
            r.moveAfter(opt_parent);
        }
        setMask(r, layer);
        addBgBlur(r, layer);
    }
    function aeCompound(layer, opt_parent) {
        var r = initShapeLayer(layer, opt_parent);
        var group = r(2).addProperty('ADBE Vector Group');
        group.name = layer.name;
        createCompoundShapes(group, layer);
        if (!group(2)('ADBE Vector Filter - Merge')) {
            addMerge(group, layer.booleanOperation);
        }
        addStroke(r, layer);
        addFill(r, layer);
        addDropShadow(r, layer);
        addBlur(r, layer);
        addInnerShadow(r, layer);
        setLayerBlendMode(r, layer);
        r(2)(1)('ADBE Vector Transform Group')('ADBE Vector Scale').setValue([100 * compMult, 100 * compMult]);
        r('ADBE Transform Group')('ADBE Rotate Z').setValue(layer.rotation);
        r('ADBE Transform Group')('ADBE Position').setValue([layer.frame.x * compMult, layer.frame.y * compMult]);
        r('ADBE Transform Group')('ADBE Opacity').setValue(layer.opacity);
        r('ADBE Transform Group')('ADBE Scale').setValue(layer.flip);
        if (opt_parent !== null) {
            r.setParentWithJump(opt_parent);
            r.moveAfter(opt_parent);
        }
        setMask(r, layer);
        addBgBlur(r, layer);
        function createCompoundShapes(group, layer) {
            var layerCount = layer.layers.length || 1;
            for (var i = 0; i < layerCount; i++) {
                if (layer.layers[i] == undefined) {
                    return;
                }
                var shape = layer.layers[i];
                var posOffset = [(layer.frame.width - shape.frame.width) / -2, (layer.frame.height - shape.frame.height) / -2];
                if (shape.type === 'CompoundShape') {
                    var subGroup = group(2).addProperty('ADBE Vector Group');
                    subGroup.name = shape.name;
                    subGroup('ADBE Vector Transform Group')('ADBE Vector Position').setValue(posOffset + [shape.frame.x, shape.frame.y]);
                    createCompoundShapes(subGroup, shape);
                    continue;
                }
                if (shape.type === 'Rect' && prefs.parametrics) {
                    var rect = group(2).addProperty('ADBE Vector Shape - Rect');
                    rect('ADBE Vector Rect Size').setValue([shape.frame.width, shape.frame.height]);
                    rect('ADBE Vector Rect Position').setValue(posOffset + [shape.frame.x, shape.frame.y]);
                    rect('ADBE Vector Rect Roundness').setValue(shape.roundness);
                }
                if (shape.type === 'Ellipse' && prefs.parametrics) {
                    var ellipse = group(2).addProperty('ADBE Vector Shape - Ellipse');
                    ellipse('ADBE Vector Ellipse Size').setValue([shape.frame.width, shape.frame.height]);
                    ellipse('ADBE Vector Ellipse Position').setValue(posOffset + [shape.frame.x, shape.frame.y]);
                }
                if (shape.type === 'Path' || !prefs.parametrics) {
                    var subGroup = needsSubGroup(group, shape);
                    var vect = subGroup(2).addProperty('ADBE Vector Shape - Group');
                    if (shape.path.points.length < 1) {
                        return;
                    }
                    var pathProp = vect.property('ADBE Vector Shape');
                    var vertices = shape.path.points;
                    if (vertices.length < 1) { }
                    var pathObj = {
                        path: pathProp,
                        points: shape.path.points,
                        inTangents: shape.path.inTangents,
                        outTangents: shape.path.outTangents,
                        closed: shape.path.closed
                    };
                    createStaticShape(pathObj, [layer.frame.width / 2 - shape.frame.x, layer.frame.height / 2 - shape.frame.y]);
                    if (shape.roundness > 0) {
                        var round = group(2).addProperty('ADBE Vector Filter - RC');
                        round('ADBE Vector RoundCorner Radius').setValue(shape.roundness);
                    }
                }
                if (i == layer.layers.length - 1) {
                    addMerge(group, shape.booleanOperation);
                }
            }
        }
        function addMerge(group, bool) {
            var merge = group(2).addProperty('ADBE Vector Filter - Merge');
            merge('ADBE Vector Merge Type').setValue(bool + 2);
        }
        function needsSubGroup(group, shape) {
            var subGroup = null;
            if (shape.rotation != 0 || (shape.flip[0] != 100 || shape.flip[1] != 100)) {
                subGroup = group(2).addProperty('ADBE Vector Group');
            }
            if (subGroup) {
                subGroup('ADBE Vector Transform Group')('ADBE Vector Rotation').setValue(shape.rotation);
                subGroup('ADBE Vector Transform Group')('ADBE Vector Scale').setValue(shape.flip);
                return subGroup;
            }
            return group;
        }
    }
    function aeSymbol(layer, opt_parent) {
        var aeuxFolder = createNamedFolder('AEUX');
        var frameFolder = createNamedFolder(compName);
        frameFolder.parentFolder = aeuxFolder;
        var symbolFolder = createNamedFolder('Precomps', frameFolder);
        symbolFolder.parentFolder = frameFolder;
        var symbolPrecomp = createSymbol(layer);
        var r = thisComp.layers.add(symbolPrecomp, symbolPrecomp.duration);
        r.name = '\u21BB ' + layer.name;
        r.collapseTransformation = true;
        if (opt_parent !== null) {
            r.setParentWithJump(opt_parent);
            r.moveAfter(opt_parent);
            r.enabled = (layer.isVisible && opt_parent.enabled);
        }
        else {
            labelColor = labelColor % 16 + 1;
            r.enabled = layer.isVisible;
        }
        r.label = labelColor;
        addDropShadow(r, layer);
        addBlur(r, layer);
        addInnerShadow(r, layer);
        setLayerBlendMode(r, layer);
        var scaleVal = [(100 * compMult) * (layer.frame.width / layer.symbolFrame.width) * (layer.flip[0] / 100),
            (100 * compMult) * (layer.frame.height / layer.symbolFrame.height) * (layer.flip[1] / 100)];
        r('ADBE Transform Group')('ADBE Position').setValue([layer.frame.x * compMult, layer.frame.y * compMult]);
        r('ADBE Transform Group')('ADBE Scale').setValue(scaleVal);
        r('ADBE Transform Group')('ADBE Rotate Z').setValue(layer.rotation);
        r('ADBE Transform Group')('ADBE Opacity').setValue(layer.opacity);
        setMask(r, layer);
        addBgBlur(r, layer);
    }
    function aeImage(layer, opt_parent) {
        var _a;
        var aeuxFolder = createNamedFolder('AEUX');
        var frameFolder = createNamedFolder(compName);
        frameFolder.parentFolder = aeuxFolder;
        var imageFolder = createNamedFolder('Images', frameFolder);
        imageFolder.parentFolder = frameFolder;
        var nameId = "".concat(layer.name, "_").concat(layer.id);
        var bmpImage = getItem(nameId, FileSource, imageFolder);
        if (bmpImage === null) {
            var fileFound = false;
            var bmpFile;
            try {
                if (File(folderPath + '/' + nameId + '.png').exists) {
                    bmpFile = new ImportOptions(new File(folderPath + '/' + nameId + '.png'));
                    fileFound = true;
                }
                else if (File(folderPath + '/' + nameId + '.jpg').exists) {
                    bmpFile = new ImportOptions(new File(folderPath + '/' + nameId + '.jpg'));
                    fileFound = true;
                }
                if (fileFound) {
                    bmpImage = app.project.importFile(bmpFile);
                }
                else {
                    returnMessage.push(6);
                    bmpImage = app.project.importPlaceholder(nameId + '.png', Math.abs(Math.round(layer.frame.width * 4)), Math.abs(Math.round(layer.frame.height * 4)), 60, 120);
                }
            }
            catch (e) {
                returnMessage.push(6);
                bmpImage = app.project.importPlaceholder(nameId + '.png', Math.abs(Math.round(layer.frame.width * 4)), Math.abs(Math.round(layer.frame.height * 4)), 60, 120);
            }
            bmpImage.parentFolder = imageFolder;
            bmpImage.selected = false;
        }
        else {
            if ((_a = bmpImage === null || bmpImage === void 0 ? void 0 : bmpImage.mainSource) === null || _a === void 0 ? void 0 : _a.missingFootagePath) {
                try {
                    var replaceFile = File(folderPath + '/' + nameId + '.png');
                    bmpImage.replace(replaceFile);
                }
                catch (error) { }
            }
            try {
                bmpImage.mainSource.reload();
            }
            catch (error) { }
        }
        var r = thisComp.layers.add(bmpImage);
        r.selected = false;
        r.name = layer.name;
        if (layer.guide) {
            r.guideLayer = true;
        }
        var w = 100;
        var h = 100;
        if (r.height >= r.width) {
            w = layer.frame.width / r.width * 100;
            h = w;
        }
        else {
            h = layer.frame.height / r.height * 100;
            w = h;
        }
        r('ADBE Transform Group')('ADBE Scale').setValue([w * compMult, h * compMult]);
        r('ADBE Transform Group')('ADBE Rotate Z').setValue(layer.rotation);
        r('ADBE Transform Group')('ADBE Opacity').setValue(layer.opacity);
        r('ADBE Transform Group')('ADBE Position').setValue([layer.frame.x * compMult, layer.frame.y * compMult]);
        setMask(r, layer);
        addDropShadow(r, layer);
        addInnerShadow(r, layer);
        setLayerBlendMode(r, layer);
        addBlur(r, layer, true);
        if (opt_parent !== null) {
            if (hostApp == 'Sketch') {
                r.parent = opt_parent;
            }
            else {
                r.setParentWithJump(opt_parent);
            }
            r.moveAfter(opt_parent);
            r.enabled = (layer.isVisible && opt_parent.enabled);
        }
        else {
            labelColor = labelColor % 16 + 1;
            r.enabled = layer.isVisible;
        }
        r.label = labelColor;
        function getItem(itemName, itemInstanceName, imageFolder) {
            if (imageFolder.numItems > 0) {
                for (var i = 1; i <= imageFolder.numItems; i++) {
                    var curItem = imageFolder.item(i);
                    if (curItem.name === itemName || curItem.name === itemName + '.png' || curItem.name === itemName + '.jpg') {
                        if (curItem instanceof itemInstanceName || (curItem.mainSource !== 'undefined' && (curItem.mainSource instanceof itemInstanceName || curItem.mainSource instanceof PlaceholderSource))) {
                            return curItem;
                        }
                    }
                }
            }
            return null;
        }
    }
    function createSymbol(layer) {
        var symbol;
        var symbolExists = false;
        var aeuxFolder = createNamedFolder('AEUX');
        var frameFolder = createNamedFolder(compName);
        frameFolder.parentFolder = aeuxFolder;
        var symbolFolder = createNamedFolder('Precomps', frameFolder);
        if (layer.id != 'override') {
            for (var i = 1; i <= symbolFolder.items.length; i++) {
                if (symbolFolder.item(i).comment === layer.masterId) {
                    symbolExists = true;
                    symbol = symbolFolder.item(i);
                    break;
                }
            }
        }
        if (!symbolExists) {
            symbol = app.project.items.addComp(layer.name, Math.max(Math.round(layer.symbolFrame.width), 4), Math.max(Math.round(layer.symbolFrame.height), 4), thisComp.pixelAspect, thisComp.duration, thisComp.frameRate);
            symbol.parentFolder = symbolFolder;
            symbol.comment = layer.masterId;
            symbol.bgColor = [layer.bgColor[0],
                layer.bgColor[1],
                layer.bgColor[2]];
            var mainComp = thisComp;
            thisComp = symbol;
            var compMultStorage = compMult;
            compMult = 1;
            filterTypes(layer.layers, null);
            compMult = compMultStorage;
            thisComp = mainComp;
        }
        return symbol;
    }
    function createNamedFolder(folderNameStr, parentFolder) {
        var hasNamedFolder = false;
        var namedFolder = null;
        var startFolder = (parentFolder != undefined) ? parentFolder : app.project;
        for (var i = 1; i <= startFolder.numItems; i++) {
            if (startFolder.item(i) instanceof FolderItem) {
                if (startFolder.item(i).name == folderNameStr) {
                    hasNamedFolder = true;
                    namedFolder = startFolder.item(i);
                    break;
                }
            }
        }
        if (!hasNamedFolder) {
            namedFolder = startFolder.items.addFolder(folderNameStr);
        }
        return namedFolder;
    }
    function aeArtboard(layer) {
        if (prefs.newComp) {
            compMult = prefs.compScale;
            var frameRate = prefs.frameRate || 60;
            var duration = prefs.duration || 5;
            if (layer.size[0] * compMult > 30000) {
                returnMessage.push(3);
                return false;
            }
            if (layer.size[1] * compMult > 30000) {
                returnMessage.push(4);
                return false;
            }
            compName = layer.name;
            thisComp = app.project.items.addComp(nameInc(compName, app.project.items), Math.max(Math.round(layer.size[0] * compMult), 4), Math.max(Math.round(layer.size[1] * compMult), 4), 1, duration, frameRate);
            thisComp.bgColor = [layer.bgColor[0],
                layer.bgColor[1],
                layer.bgColor[2]];
            var aeuxFolder = createNamedFolder('AEUX');
            var frameFolder = createNamedFolder(compName);
            frameFolder.parentFolder = aeuxFolder;
            thisComp.parentFolder = frameFolder;
        }
        else {
            compName = thisComp.name;
        }
        compMult = getCompMultiplier(layer.size[0]);
        return true;
    }
    function initShapeLayer(layer, opt_parent) {
        var r = thisComp.layers.addShape();
        r.name = layer.name;
        r.selected = false;
        if (opt_parent !== null) {
            r.moveAfter(opt_parent);
            r.enabled = (layer.isVisible && opt_parent.enabled);
        }
        else {
            labelColor = labelColor % 16 + 1;
            r.enabled = layer.isVisible;
        }
        r.label = labelColor;
        return r;
    }
    function createStaticShape(pathObj, layerOffset) {
        var pathValue = pathObj.path.value;
        pathValue.vertices = transformList(pathObj.points, layerOffset);
        pathValue.inTangents = pathObj.inTangents;
        pathValue.outTangents = pathObj.outTangents;
        pathValue.closed = pathObj.closed;
        pathObj.path.setValue(pathValue);
        function transformList(list, offset) {
            var transformedList = [];
            for (var i = 0; i < list.length; i++) {
                transformedList[i] = [
                    list[i][0] - offset[0],
                    list[i][1] - offset[1]
                ];
            }
            return transformedList;
        }
    }
    function addFill(r, layer) {
        if (layer.fill != null) {
            for (var i = layer.fill.length - 1; i >= 0; i--) {
                var aeBlendMode = 1;
                var fill;
                if (layer.fill[i].type == 'fill') {
                    fill = r(2)(1)(2).addProperty('ADBE Vector Graphic - Fill');
                    fill.enabled = layer.fill[i].enabled;
                    fill("ADBE Vector Fill Color").setValue(layer.fill[i].color);
                    fill("ADBE Vector Fill Opacity").setValue(layer.fill[i].opacity);
                }
                if (layer.fill[i].type == 'gradient') {
                    fill = r(2)(1)(2).addProperty('ADBE Vector Graphic - G-Fill');
                    fill("ADBE Vector Fill Opacity").setValue(layer.fill[i].opacity);
                    fill('ADBE Vector Grad Type').setValue(layer.fill[i].gradType);
                    fill('ADBE Vector Grad Start Pt').setValue(layer.fill[i].startPoint);
                    fill('ADBE Vector Grad End Pt').setValue(layer.fill[i].endPoint);
                    ae_deselectProps();
                    fill.selected = true;
                    applyGradientFfx('fill', false, layer.fill[i]);
                }
                fill("ADBE Vector Blend Mode").setValue(layer.fill[i].blendMode);
            }
        }
    }
    function addStroke(r, layer) {
        if (layer.stroke != null) {
            for (var i = layer.stroke.length - 1; i >= 0; i--) {
                if (layer.stroke[i].type == 'fill') {
                    stroke = r(2)(1)(2).addProperty("ADBE Vector Graphic - Stroke");
                    stroke.enabled = layer.stroke[i].enabled;
                    stroke("ADBE Vector Stroke Color").setValue(layer.stroke[i].color);
                    setStrokeProps(stroke, i);
                }
                if (layer.stroke[i].type == 'gradient') {
                    stroke = r(2)(1)(2).addProperty('ADBE Vector Graphic - G-Stroke');
                    setStrokeProps(stroke, i);
                    stroke('ADBE Vector Grad Type').setValue(layer.stroke[i].gradType);
                    stroke('ADBE Vector Grad Start Pt').setValue(layer.stroke[i].startPoint);
                    stroke('ADBE Vector Grad End Pt').setValue(layer.stroke[i].endPoint);
                    ae_deselectProps();
                    stroke.selected = true;
                    applyGradientFfx('stroke', false, layer.stroke[i]);
                }
                stroke("ADBE Vector Blend Mode").setValue(layer.stroke[i].blendMode);
                if (layer.stroke[i].strokeDashes.length > 0) {
                    var strokeDashes = layer.stroke[i].strokeDashes;
                    for (var j = 1; j <= strokeDashes.length; j++) {
                        countRound = Math.round(j / 2);
                        if (j - 1 % 2 == 0) {
                            stroke('ADBE Vector Stroke Dashes').addProperty('ADBE Vector Stroke Dash ' + (countRound));
                            stroke('ADBE Vector Stroke Dashes')('ADBE Vector Stroke Dash ' + (countRound)).setValue(strokeDashes[j - 1]);
                        }
                        else {
                            stroke('ADBE Vector Stroke Dashes').addProperty('ADBE Vector Stroke Gap ' + (countRound));
                            stroke('ADBE Vector Stroke Dashes')('ADBE Vector Stroke Gap ' + (countRound)).setValue(strokeDashes[j - 1]);
                        }
                    }
                }
            }
        }
        function setStrokeProps(stroke, i) {
            stroke("ADBE Vector Stroke Opacity").setValue(layer.stroke[i].opacity);
            stroke("ADBE Vector Stroke Width").setValue(layer.stroke[i].width);
            stroke("ADBE Vector Stroke Line Cap").setValue(layer.stroke[i].cap + 1);
            stroke("ADBE Vector Stroke Line Join").setValue(layer.stroke[i].join + 1);
        }
    }
    function setMask(currentLayer, layerData) {
        var currentCompId = currentLayer.containingComp.id;
        var currentParentName = (currentLayer.parent) ? currentLayer.parent.name : 'comp';
        var layerID = currentCompId + '_' + currentParentName;
        if (layerData.shouldBreakMaskChain) {
            maskLayer[layerID] = null;
            maskPosition = [0, 0];
        }
        if (maskLayer[layerID]) {
            try {
                var newMask = maskLayer[layerID].duplicate();
                newMask.moveBefore(currentLayer);
                newMask.effectsActive = false;
                newMask.enabled = false;
                newMask.parent = maskLayer[layerID];
                newMask.shy = true;
                newMask.name = '\u25A8 ' + newMask.name;
                try {
                    newMask(2).addProperty('ADBE Vector Graphic - Fill');
                }
                catch (e) { }
                if (hostApp == 'Figma') {
                    maskLayer[layerID].remove();
                }
                currentLayer.trackMatteType = TrackMatteType.ALPHA;
            }
            catch (e) { }
        }
        if (layerData.hasClippingMask) {
            maskLayer[layerID] = currentLayer;
            maskPosition = currentLayer('ADBE Transform Group')('ADBE Position').value;
        }
        if (layerData.isMask) {
            maskLayer[layerID] = currentLayer;
            maskPosition = currentLayer('ADBE Transform Group')('ADBE Position').value;
        }
        try {
            if (hostApp == 'Figma' && layerData.type == 'Image') {
                var maskRect = newMask.sourceRectAtTime(0, false);
                var sourceRect = currentLayer.sourceRectAtTime(0, false);
                var adjSize = [
                    Math.min(maskRect.width, thisComp.width - maskRect.left),
                    Math.min(maskRect.height, thisComp.height - maskRect.top)
                ];
                var adjScale = [
                    Math.max(adjSize[0] / sourceRect.width * 100, 0.00001),
                    Math.max(adjSize[1] / sourceRect.height * 100, 0.00001)
                ];
                var adjPos = [adjSize[0] / 2, adjSize[1] / 2];
                currentLayer('ADBE Transform Group')('ADBE Scale').setValue(adjScale);
                currentLayer('ADBE Transform Group')('ADBE Position').setValue(adjPos);
            }
        }
        catch (e) { }
    }
    function applyGradientFfx(type, dontTwirl, element) {
        var presetFiles = {
            template_grad2: "RIFX\x00\x00\n`FaFXhead\x00\x00\x00\x10\x00\x00\x00\x03\x00\x00\x00W\x00\x00\x00\x01\x00\x00\x00\x00LIST\x00\x00\n<bescbeso\x00\x00\x008\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00`\x00\x00\x18\x00\x00\x00\x00\x00\x04\x00\x01\x00\x01\x07\u0080\x048?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF\u00FFLIST\x00\x00\x01\u0084tdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x05LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Root Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x00tdmn\x00\x00\x00(ADBE Vector Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x02tdmn\x00\x00\x00(ADBE Vector Graphic - G-Fill\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vector Grad Colors\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdsn\x00\x00\x00\x07Colors\x00\x00LIST\x00\x00\x00dtdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x01LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x07\u00E8GCstLIST\x00\x00\x00\u00B0tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x07Colors\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x07\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00`\x00?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x01\x00\b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00\x04\x00\x00\x00\x00LIST\x00\x00\x07$GCkyUtf8\x00\x00\x07\x18<?xml version='1.0'?>\n<prop.map version='4'>\n<prop.list>\n<prop.pair>\n<key>Gradient Color Data</key>\n<prop.list>\n<prop.pair>\n<key>Alpha Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>2</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Color Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].color[0]\npoints[0].color[1]\npoints[0].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].color[0]\npoints[1].color[1]\npoints[1].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>2</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Gradient Colors</key>\n<string>1.0</string>\n</prop.pair>\n</prop.list>\n</prop.map>\n<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n<x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c014 79.156821, 2014/08/29-03:07:50        \">\n   <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">\n      <rdf:Description rdf:about=\"\"\n            xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n            xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\"\n            xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\"\n            xmlns:stEvt=\"http://ns.adobe.com/xap/1.0/sType/ResourceEvent#\">\n         <dc:format>application/vnd.adobe.aftereffects.preset-animation</dc:format>\n         <xmp:CreatorTool>Adobe After Effects CC 2014 (Macintosh)</xmp:CreatorTool>\n         <xmp:CreateDate>2018-01-20T12:34:50-05:00</xmp:CreateDate>\n         <xmp:MetadataDate>2018-01-20T12:34:50-05:00</xmp:MetadataDate>\n         <xmp:ModifyDate>2018-01-20T12:34:50-05:00</xmp:ModifyDate>\n         <xmpMM:InstanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:InstanceID>\n         <xmpMM:DocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:DocumentID>\n         <xmpMM:OriginalDocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:OriginalDocumentID>\n         <xmpMM:History>\n            <rdf:Seq>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>created</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</stEvt:instanceID>\n                  <stEvt:when>2018-01-20T12:34:50-05:00</stEvt:when>\n                  <stEvt:softwareAgent>Adobe After Effects CC 2014 (Macintosh)</stEvt:softwareAgent>\n               </rdf:li>\n            </rdf:Seq>\n         </xmpMM:History>\n      </rdf:Description>\n   </rdf:RDF>\n</x:xmpmeta>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<?xpacket end=\"w\"?>\n",
            template_grad3: "RIFX\x00\x00\f\u0090FaFXhead\x00\x00\x00\x10\x00\x00\x00\x03\x00\x00\x00W\x00\x00\x00\x01\x00`\x00\x00LIST\x00\x00\flbescbeso\x00\x00\x008\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00`\x00\x00\x18\x00\x00\x00\x00\x00\x04\x00\x01\x00\x01\x07\u0080\x048?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF\u00FFLIST\x00\x00\x01\u0084tdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x05LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Root Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x00tdmn\x00\x00\x00(ADBE Vector Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x02tdmn\x00\x00\x00(ADBE Vector Graphic - G-Fill\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vector Grad Colors\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdsn\x00\x00\x00\x07Colors\x00\x00LIST\x00\x00\x00dtdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x01LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\n\x18GCstLIST\x00\x00\x00\u00B0tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x07Colors\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x07\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00`\x00?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x01\x00\b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00\x04\x00\x00\x00\x00LIST\x00\x00\tTGCkyUtf8\x00\x00\tG<?xml version='1.0'?>\n<prop.map version='4'>\n<prop.list>\n<prop.pair>\n<key>Gradient Color Data</key>\n<prop.list>\n<prop.pair>\n<key>Alpha Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>3</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Color Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].color[0]\npoints[0].color[1]\npoints[0].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].color[0]\npoints[1].color[1]\npoints[1].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].color[0]\npoints[2].color[1]\npoints[2].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>3</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Gradient Colors</key>\n<string>1.0</string>\n</prop.pair>\n</prop.list>\n</prop.map>\n\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n<x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c014 79.156821, 2014/08/29-03:07:50        \">\n   <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">\n      <rdf:Description rdf:about=\"\"\n            xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n            xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\"\n            xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\"\n            xmlns:stEvt=\"http://ns.adobe.com/xap/1.0/sType/ResourceEvent#\">\n         <dc:format>application/vnd.adobe.aftereffects.preset-animation</dc:format>\n         <xmp:CreatorTool>Adobe After Effects CC 2014 (Macintosh)</xmp:CreatorTool>\n         <xmp:CreateDate>2018-01-20T12:34:50-05:00</xmp:CreateDate>\n         <xmp:MetadataDate>2018-01-20T12:34:50-05:00</xmp:MetadataDate>\n         <xmp:ModifyDate>2018-01-20T12:34:50-05:00</xmp:ModifyDate>\n         <xmpMM:InstanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:InstanceID>\n         <xmpMM:DocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:DocumentID>\n         <xmpMM:OriginalDocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:OriginalDocumentID>\n         <xmpMM:History>\n            <rdf:Seq>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>created</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</stEvt:instanceID>\n                  <stEvt:when>2018-01-20T12:34:50-05:00</stEvt:when>\n                  <stEvt:softwareAgent>Adobe After Effects CC 2014 (Macintosh)</stEvt:softwareAgent>\n               </rdf:li>\n            </rdf:Seq>\n         </xmpMM:History>\n      </rdf:Description>\n   </rdf:RDF>\n</x:xmpmeta>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<?xpacket end=\"w\"?>\n",
            template_grad4: "RIFX\x00\x00\x0E\u00BEFaFXhead\x00\x00\x00\x10\x00\x00\x00\x03\x00\x00\x00W\x00\x00\x00\x01\x00`\x00\x00LIST\x00\x00\x0E\u009Abescbeso\x00\x00\x008\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00`\x00\x00\x18\x00\x00\x00\x00\x00\x04\x00\x01\x00\x01\x07\u0080\x048?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF\u00FFLIST\x00\x00\x01\u0084tdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x05LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Root Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x00tdmn\x00\x00\x00(ADBE Vector Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x02tdmn\x00\x00\x00(ADBE Vector Graphic - G-Fill\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vector Grad Colors\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdsn\x00\x00\x00\x07Colors\x00\x00LIST\x00\x00\x00dtdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x01LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\fFGCstLIST\x00\x00\x00\u00B0tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x07Colors\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x07\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00`\x00?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x01\x00\b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00\x04\x00\x00\x00\x00LIST\x00\x00\x0B\u0082GCkyUtf8\x00\x00\x0Bv<?xml version='1.0'?>\n<prop.map version='4'>\n<prop.list>\n<prop.pair>\n<key>Gradient Color Data</key>\n<prop.list>\n<prop.pair>\n<key>Alpha Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-3</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[3].rampPoint\npoints[3].midPoint\npoints[3].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>4</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Color Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].color[0]\npoints[0].color[1]\npoints[0].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].color[0]\npoints[1].color[1]\npoints[1].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].color[0]\npoints[2].color[1]\npoints[2].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-3</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[3].rampPoint\npoints[3].midPoint\npoints[3].color[0]\npoints[3].color[1]\npoints[3].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>4</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Gradient Colors</key>\n<string>1.0</string>\n</prop.pair>\n</prop.list>\n</prop.map>\n<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n<x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c014 79.156821, 2014/08/29-03:07:50        \">\n   <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">\n      <rdf:Description rdf:about=\"\"\n            xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n            xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\"\n            xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\"\n            xmlns:stEvt=\"http://ns.adobe.com/xap/1.0/sType/ResourceEvent#\">\n         <dc:format>application/vnd.adobe.aftereffects.preset-animation</dc:format>\n         <xmp:CreatorTool>Adobe After Effects CC 2014 (Macintosh)</xmp:CreatorTool>\n         <xmp:CreateDate>2018-01-20T12:34:50-05:00</xmp:CreateDate>\n         <xmp:MetadataDate>2018-01-20T12:34:50-05:00</xmp:MetadataDate>\n         <xmp:ModifyDate>2018-01-20T12:34:50-05:00</xmp:ModifyDate>\n         <xmpMM:InstanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:InstanceID>\n         <xmpMM:DocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:DocumentID>\n         <xmpMM:OriginalDocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:OriginalDocumentID>\n         <xmpMM:History>\n            <rdf:Seq>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>created</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</stEvt:instanceID>\n                  <stEvt:when>2018-01-20T12:34:50-05:00</stEvt:when>\n                  <stEvt:softwareAgent>Adobe After Effects CC 2014 (Macintosh)</stEvt:softwareAgent>\n               </rdf:li>\n            </rdf:Seq>\n         </xmpMM:History>\n      </rdf:Description>\n   </rdf:RDF>\n</x:xmpmeta>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<?xpacket end=\"w\"?>\n",
            template_grad5: "RIFX\x00\x00\x11\u00E2FaFXhead\x00\x00\x00\x10\x00\x00\x00\x03\x00\x00\x00W\x00\x00\x00\x01\x00a\x00\x00LIST\x00\x00\x11\u00BEbescbeso\x00\x00\x008\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00`\x00\x00\x18\x00\x00\x00\x00\x00\x04\x00\x01\x00\x01\x07\u0080\x048?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF\u00FFLIST\x00\x00\x01\u0084tdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x05LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Root Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x00tdmn\x00\x00\x00(ADBE Vector Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x02tdmn\x00\x00\x00(ADBE Vector Graphic - G-Fill\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vector Grad Colors\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdsn\x00\x00\x00\x07Colors\x00\x00LIST\x00\x00\x00dtdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x01LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x0FjGCstLIST\x00\x00\x00\u00B0tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x07Colors\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x07\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00`\x00?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x01\x00\b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00\x04\x00\x00\x00\x00LIST\x00\x00\x0E\u00A6GCkyUtf8\x00\x00\x0E\u009A<?xml version='1.0'?>\n<prop.map version='4'>\n<prop.list>\n<prop.pair>\n<key>Gradient Color Data</key>\n<prop.list>\n<prop.pair>\n<key>Alpha Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-3</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[3].rampPoint\npoints[3].midPoint\npoints[3].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-4</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[4].rampPoint\npoints[4].midPoint\npoints[4].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-5</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[4].rampPoint\npoints[4].midPoint\npoints[4].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>6</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Color Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].color[0]\npoints[0].color[1]\npoints[0].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].color[0]\npoints[1].color[1]\npoints[1].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].color[0]\npoints[2].color[1]\npoints[2].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-3</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[3].rampPoint\npoints[3].midPoint\npoints[3].color[0]\npoints[3].color[1]\npoints[3].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-4</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[4].rampPoint\npoints[4].midPoint\npoints[4].color[0]\npoints[4].color[1]\npoints[4].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>5</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Gradient Colors</key>\n<string>1.0</string>\n</prop.pair>\n</prop.list>\n</prop.map>\n<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n<x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c014 79.156821, 2014/08/29-03:07:50        \">\n   <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">\n      <rdf:Description rdf:about=\"\"\n            xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n            xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\"\n            xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\"\n            xmlns:stEvt=\"http://ns.adobe.com/xap/1.0/sType/ResourceEvent#\">\n         <dc:format>application/vnd.adobe.aftereffects.preset-animation</dc:format>\n         <xmp:CreatorTool>Adobe After Effects CC 2014 (Macintosh)</xmp:CreatorTool>\n         <xmp:CreateDate>2018-01-20T12:34:50-05:00</xmp:CreateDate>\n         <xmp:MetadataDate>2018-01-20T12:34:50-05:00</xmp:MetadataDate>\n         <xmp:ModifyDate>2018-01-20T12:34:50-05:00</xmp:ModifyDate>\n         <xmpMM:InstanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:InstanceID>\n         <xmpMM:DocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:DocumentID>\n         <xmpMM:OriginalDocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:OriginalDocumentID>\n         <xmpMM:History>\n            <rdf:Seq>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>created</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</stEvt:instanceID>\n                  <stEvt:when>2018-01-20T12:34:50-05:00</stEvt:when>\n                  <stEvt:softwareAgent>Adobe After Effects CC 2014 (Macintosh)</stEvt:softwareAgent>\n               </rdf:li>\n            </rdf:Seq>\n         </xmpMM:History>\n      </rdf:Description>\n   </rdf:RDF>\n</x:xmpmeta>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<?xpacket end=\"w\"?>\n",
            template_grad6: "RIFX\x00\x00\x13\x1CFaFXhead\x00\x00\x00\x10\x00\x00\x00\x03\x00\x00\x00W\x00\x00\x00\x01\x00`\x00\x00LIST\x00\x00\x12\u00F8bescbeso\x00\x00\x008\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00`\x00\x00\x18\x00\x00\x00\x00\x00\x04\x00\x01\x00\x01\x07\u0080\x048?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF\u00FFLIST\x00\x00\x01\u0084tdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x05LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Root Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x00tdmn\x00\x00\x00(ADBE Vector Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x02tdmn\x00\x00\x00(ADBE Vector Graphic - G-Fill\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vector Grad Colors\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdsn\x00\x00\x00\x07Colors\x00\x00LIST\x00\x00\x00dtdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x01LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x10\u00A4GCstLIST\x00\x00\x00\u00B0tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x07Colors\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x07\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00`\x00?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x01\x00\b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00\x04\x00\x00\x00\x00LIST\x00\x00\x0F\u00E0GCkyUtf8\x00\x00\x0F\u00D4<?xml version='1.0'?>\n<prop.map version='4'>\n<prop.list>\n<prop.pair>\n<key>Gradient Color Data</key>\n<prop.list>\n<prop.pair>\n<key>Alpha Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-3</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[3].rampPoint\npoints[3].midPoint\npoints[3].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-4</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[4].rampPoint\npoints[4].midPoint\npoints[4].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-5</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[5].rampPoint\npoints[5].midPoint\npoints[5].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>6</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Color Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].color[0]\npoints[0].color[1]\npoints[0].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].color[0]\npoints[1].color[1]\npoints[1].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].color[0]\npoints[2].color[1]\npoints[2].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-3</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[3].rampPoint\npoints[3].midPoint\npoints[3].color[0]\npoints[3].color[1]\npoints[3].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-4</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[4].rampPoint\npoints[4].midPoint\npoints[4].color[0]\npoints[4].color[1]\npoints[4].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-5</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[5].rampPoint\npoints[5].midPoint\npoints[5].color[0]\npoints[5].color[1]\npoints[5].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>6</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Gradient Colors</key>\n<string>1.0</string>\n</prop.pair>\n</prop.list>\n</prop.map>\n<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n<x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c014 79.156821, 2014/08/29-03:07:50        \">\n   <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">\n      <rdf:Description rdf:about=\"\"\n            xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n            xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\"\n            xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\"\n            xmlns:stEvt=\"http://ns.adobe.com/xap/1.0/sType/ResourceEvent#\">\n         <dc:format>application/vnd.adobe.aftereffects.preset-animation</dc:format>\n         <xmp:CreatorTool>Adobe After Effects CC 2014 (Macintosh)</xmp:CreatorTool>\n         <xmp:CreateDate>2018-01-20T12:34:50-05:00</xmp:CreateDate>\n         <xmp:MetadataDate>2018-01-20T12:34:50-05:00</xmp:MetadataDate>\n         <xmp:ModifyDate>2018-01-20T12:34:50-05:00</xmp:ModifyDate>\n         <xmpMM:InstanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:InstanceID>\n         <xmpMM:DocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:DocumentID>\n         <xmpMM:OriginalDocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:OriginalDocumentID>\n         <xmpMM:History>\n            <rdf:Seq>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>created</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</stEvt:instanceID>\n                  <stEvt:when>2018-01-20T12:34:50-05:00</stEvt:when>\n                  <stEvt:softwareAgent>Adobe After Effects CC 2014 (Macintosh)</stEvt:softwareAgent>\n               </rdf:li>\n            </rdf:Seq>\n         </xmpMM:History>\n      </rdf:Description>\n   </rdf:RDF>\n</x:xmpmeta>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<?xpacket end=\"w\"?>\n",
            template_grad7: "RIFX\x00\x00\x15LFaFXhead\x00\x00\x00\x10\x00\x00\x00\x03\x00\x00\x00W\x00\x00\x00\x01\x00a\x00\x00LIST\x00\x00\x15(bescbeso\x00\x00\x008\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00`\x00\x00\x18\x00\x00\x00\x00\x00\x04\x00\x01\x00\x01\x07\u0080\x048?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF\u00FFLIST\x00\x00\x01\u0084tdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x05LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Root Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x00tdmn\x00\x00\x00(ADBE Vector Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x02tdmn\x00\x00\x00(ADBE Vector Graphic - G-Fill\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vector Grad Colors\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdsn\x00\x00\x00\x07Colors\x00\x00LIST\x00\x00\x00dtdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x01LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x12\u00D4GCstLIST\x00\x00\x00\u00B0tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x07Colors\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x07\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00`\x00?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x01\x00\b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00\x04\x00\x00\x00\x00LIST\x00\x00\x12\x10GCkyUtf8\x00\x00\x12\x03<?xml version='1.0'?>\n<prop.map version='4'>\n<prop.list>\n<prop.pair>\n<key>Gradient Color Data</key>\n<prop.list>\n<prop.pair>\n<key>Alpha Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-3</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[3].rampPoint\npoints[3].midPoint\npoints[3].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-4</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[4].rampPoint\npoints[4].midPoint\npoints[4].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-5</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[5].rampPoint\npoints[5].midPoint\npoints[5].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-6</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[6].rampPoint\npoints[6].midPoint\npoints[6].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>7</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Color Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].color[0]\npoints[0].color[1]\npoints[0].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].color[0]\npoints[1].color[1]\npoints[1].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].color[0]\npoints[2].color[1]\npoints[2].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-3</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[3].rampPoint\npoints[3].midPoint\npoints[3].color[0]\npoints[3].color[1]\npoints[3].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-4</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[4].rampPoint\npoints[4].midPoint\npoints[4].color[0]\npoints[4].color[1]\npoints[4].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-5</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[5].rampPoint\npoints[5].midPoint\npoints[5].color[0]\npoints[5].color[1]\npoints[5].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-6</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[6].rampPoint\npoints[6].midPoint\npoints[6].color[0]\npoints[6].color[1]\npoints[6].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>7</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Gradient Colors</key>\n<string>1.0</string>\n</prop.pair>\n</prop.list>\n</prop.map>\n<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n<x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c014 79.156821, 2014/08/29-03:07:50        \">\n   <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">\n      <rdf:Description rdf:about=\"\"\n            xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n            xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\"\n            xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\"\n            xmlns:stEvt=\"http://ns.adobe.com/xap/1.0/sType/ResourceEvent#\">\n         <dc:format>application/vnd.adobe.aftereffects.preset-animation</dc:format>\n         <xmp:CreatorTool>Adobe After Effects CC 2014 (Macintosh)</xmp:CreatorTool>\n         <xmp:CreateDate>2018-01-20T12:34:50-05:00</xmp:CreateDate>\n         <xmp:MetadataDate>2018-01-20T12:34:50-05:00</xmp:MetadataDate>\n         <xmp:ModifyDate>2018-01-20T12:34:50-05:00</xmp:ModifyDate>\n         <xmpMM:InstanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:InstanceID>\n         <xmpMM:DocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:DocumentID>\n         <xmpMM:OriginalDocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:OriginalDocumentID>\n         <xmpMM:History>\n            <rdf:Seq>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>created</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</stEvt:instanceID>\n                  <stEvt:when>2018-01-20T12:34:50-05:00</stEvt:when>\n                  <stEvt:softwareAgent>Adobe After Effects CC 2014 (Macintosh)</stEvt:softwareAgent>\n               </rdf:li>\n            </rdf:Seq>\n         </xmpMM:History>\n      </rdf:Description>\n   </rdf:RDF>\n</x:xmpmeta>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<?xpacket end=\"w\"?>\n",
            template_grad8: "RIFX\x00\x00\x17zFaFXhead\x00\x00\x00\x10\x00\x00\x00\x03\x00\x00\x00W\x00\x00\x00\x01\x00a\x00\x00LIST\x00\x00\x17Vbescbeso\x00\x00\x008\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00`\x00\x00\x18\x00\x00\x00\x00\x00\x04\x00\x01\x00\x01\x07\u0080\x048?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF\u00FFLIST\x00\x00\x01\u0084tdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x05LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Root Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x00tdmn\x00\x00\x00(ADBE Vector Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vectors Group\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\x00\x00\x00\x02tdmn\x00\x00\x00(ADBE Vector Graphic - G-Fill\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Vector Grad Colors\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdsn\x00\x00\x00\x07Colors\x00\x00LIST\x00\x00\x00dtdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x01LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x15\x02GCstLIST\x00\x00\x00\u00B0tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x07Colors\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x07\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00`\x00?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x01\x00\b\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00\x04\x00\x00\x00\x00LIST\x00\x00\x14>GCkyUtf8\x00\x00\x142<?xml version='1.0'?>\n<prop.map version='4'>\n<prop.list>\n<prop.pair>\n<key>Gradient Color Data</key>\n<prop.list>\n<prop.pair>\n<key>Alpha Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-3</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[3].rampPoint\npoints[3].midPoint\npoints[3].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-4</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[4].rampPoint\npoints[4].midPoint\npoints[4].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-5</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[5].rampPoint\npoints[5].midPoint\npoints[5].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-6</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[6].rampPoint\npoints[6].midPoint\npoints[6].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-7</key>\n<prop.list>\n<prop.pair>\n<key>Stops Alpha</key>\n<array>\n<array.type><float/></array.type>\npoints[7].rampPoint\npoints[7].midPoint\npoints[7].opacity\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>8</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Color Stops</key>\n<prop.list>\n<prop.pair>\n<key>Stops List</key>\n<prop.list>\n<prop.pair>\n<key>Stop-0</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[0].rampPoint\npoints[0].midPoint\npoints[0].color[0]\npoints[0].color[1]\npoints[0].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-1</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[1].rampPoint\npoints[1].midPoint\npoints[1].color[0]\npoints[1].color[1]\npoints[1].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-2</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[2].rampPoint\npoints[2].midPoint\npoints[2].color[0]\npoints[2].color[1]\npoints[2].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-3</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[3].rampPoint\npoints[3].midPoint\npoints[3].color[0]\npoints[3].color[1]\npoints[3].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-4</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[4].rampPoint\npoints[4].midPoint\npoints[4].color[0]\npoints[4].color[1]\npoints[4].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-5</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[5].rampPoint\npoints[5].midPoint\npoints[5].color[0]\npoints[5].color[1]\npoints[5].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-6</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[6].rampPoint\npoints[6].midPoint\npoints[6].color[0]\npoints[6].color[1]\npoints[6].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stop-7</key>\n<prop.list>\n<prop.pair>\n<key>Stops Color</key>\n<array>\n<array.type><float/></array.type>\npoints[7].rampPoint\npoints[7].midPoint\npoints[7].color[0]\npoints[7].color[1]\npoints[7].color[2]\n<float>1</float>\n</array>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Stops Size</key>\n<int type='unsigned' size='32'>8</int>\n</prop.pair>\n</prop.list>\n</prop.pair>\n</prop.list>\n</prop.pair>\n<prop.pair>\n<key>Gradient Colors</key>\n<string>1.0</string>\n</prop.pair>\n</prop.list>\n</prop.map>\n<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n<x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.6-c014 79.156821, 2014/08/29-03:07:50        \">\n   <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">\n      <rdf:Description rdf:about=\"\"\n            xmlns:dc=\"http://purl.org/dc/elements/1.1/\"\n            xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\"\n            xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\"\n            xmlns:stEvt=\"http://ns.adobe.com/xap/1.0/sType/ResourceEvent#\">\n         <dc:format>application/vnd.adobe.aftereffects.preset-animation</dc:format>\n         <xmp:CreatorTool>Adobe After Effects CC 2014 (Macintosh)</xmp:CreatorTool>\n         <xmp:CreateDate>2018-01-20T12:34:50-05:00</xmp:CreateDate>\n         <xmp:MetadataDate>2018-01-20T12:34:50-05:00</xmp:MetadataDate>\n         <xmp:ModifyDate>2018-01-20T12:34:50-05:00</xmp:ModifyDate>\n         <xmpMM:InstanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:InstanceID>\n         <xmpMM:DocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:DocumentID>\n         <xmpMM:OriginalDocumentID>xmp.did:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</xmpMM:OriginalDocumentID>\n         <xmpMM:History>\n            <rdf:Seq>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>created</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:9f2e7e7b-65a7-49aa-beb9-509e3e6907bd</stEvt:instanceID>\n                  <stEvt:when>2018-01-20T12:34:50-05:00</stEvt:when>\n                  <stEvt:softwareAgent>Adobe After Effects CC 2014 (Macintosh)</stEvt:softwareAgent>\n               </rdf:li>\n            </rdf:Seq>\n         </xmpMM:History>\n      </rdf:Description>\n   </rdf:RDF>\n</x:xmpmeta>\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n<?xpacket end=\"w\"?>\n"
        };
        try {
            var gradLength = element.gradient.length;
            if (gradLength == 2) {
                fileString = presetFiles.template_grad2;
            }
            if (gradLength == 3) {
                fileString = presetFiles.template_grad3;
            }
            if (gradLength == 4) {
                fileString = presetFiles.template_grad4;
            }
            if (gradLength == 5) {
                fileString = presetFiles.template_grad5;
            }
            if (gradLength == 6) {
                fileString = presetFiles.template_grad6;
            }
            if (gradLength == 7) {
                fileString = presetFiles.template_grad7;
            }
            if (gradLength > 7) {
                fileString = presetFiles.template_grad8;
            }
            var tempFile = createFile(fileString, 'grad.ffx', element);
            if (tempFile == null) {
                returnMessage.push(5);
                return;
            }
            fill = thisComp.selectedProperties[0];
            var layer = fill.propertyGroup(fill.propertyDepth);
            fill.selected = true;
            layer.applyPreset(tempFile);
            layer.selected = false;
        }
        catch (e) {
            alert(e.toString() + "\nError on line: " + e.line.toString());
        }
    }
    function setLayerBlendMode(r, layer) {
        r.blendingMode = looseJsonParse(layer.blendMode);
        function looseJsonParse(obj) {
            return Function('"use strict";return (' + obj + ')')();
        }
    }
    function addDropShadow(r, layer) {
        var layerScaleFactor = 100 / r("ADBE Transform Group")("ADBE Scale").value[0];
        try {
            if (layer.shadow != null) {
                for (var i = layer.shadow.length - 1; i >= 0; i--) {
                    var x = layer.shadow[i].position[0] * compMult;
                    var y = layer.shadow[i].position[1] * compMult;
                    var shadowDistance = Math.sqrt((x * x) + (y * y));
                    var shadowAngle = 90 + (Math.atan(y / x) * (180 / Math.PI));
                    shadowAngle = (isNaN(shadowAngle)) ? 180 : shadowAngle;
                    var shadowEffect = r("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
                    shadowEffect("ADBE Drop Shadow-0001").setValue(layer.shadow[i].color);
                    shadowEffect("ADBE Drop Shadow-0002").setValue(layer.shadow[i].color[3] * 255);
                    shadowEffect("ADBE Drop Shadow-0003").setValue(shadowAngle);
                    shadowEffect("ADBE Drop Shadow-0004").setValue(shadowDistance * layerScaleFactor);
                    shadowEffect("ADBE Drop Shadow-0005").setValue(layer.shadow[i].blur * compMult * layerScaleFactor);
                }
            }
        }
        catch (e) {
            alert(e.toString() + "\nError on line: " + e.line.toString());
        }
    }
    function addBlur(r, layer, ignoreCompMult) {
        if (layer.blur != null) {
            compMult = (ignoreCompMult) ? 1 : compMult;
            for (var i = layer.blur.length - 1; i >= 0; i--) {
                if (layer.blur[i].type == 0) {
                    blur = r.property('Effects').addProperty('ADBE Gaussian Blur 2');
                    blur.property('ADBE Gaussian Blur 2-0001').setValue(layer.blur[i].radius * compMult);
                    return;
                }
                if (layer.blur[i].type == 1) {
                    blur = r.property('Effects').addProperty('ADBE Motion Blur');
                    blur.property('ADBE Motion Blur-0001').setValue(layer.blur[i].direction);
                    blur.property('ADBE Motion Blur-0002').setValue(layer.blur[i].radius * compMult);
                    return;
                }
                if (layer.blur[i].type == 2) {
                    blur = r.property('Effects').addProperty('ADBE Radial Blur');
                    blur.property('ADBE Radial Blur-0001').setValue(layer.blur[i].direction);
                    blur.property('ADBE Radial Blur-0002').expression = 'transform.position';
                    blur.property('ADBE Radial Blur-0003').setValue(2);
                    return;
                }
            }
        }
    }
    function addBgBlur(r, layer, ignoreCompMult) {
        compMult = (ignoreCompMult) ? 1 : compMult;
        if (layer.bgBlur != null) {
            var newLayer = r.duplicate();
            newLayer.name = '\u25A8 ' + r.name;
            newLayer.moveAfter(r);
            newLayer.adjustmentLayer = true;
            newLayer.parent = r;
            try {
                newLayer("ADBE Root Vectors Group")(1)("ADBE Vectors Group")(2)("ADBE Vector Fill Opacity").setValue(100);
            }
            catch (e) { }
            try {
                newLayer("ADBE Text Properties")("ADBE Text Animators")(1)("ADBE Text Animator Properties")("ADBE Text Fill Opacity").setValue(100);
            }
            catch (error) { }
            var blur = newLayer.property('Effects').addProperty('ADBE Gaussian Blur 2');
            blur.property('ADBE Gaussian Blur 2-0001').setValue(layer.bgBlur * compMult);
        }
    }
    function addInnerShadow(r, layer) {
        if (layer.innerShadow != null) {
            var x = layer.innerShadow[0].position[0] * compMult;
            var y = layer.innerShadow[0].position[1] * compMult;
            var shadowDistance = Math.sqrt((x * x) + (y * y));
            var shadowAngle = 180 - (Math.atan(y / x) * (180 / Math.PI));
            shadowAngle = (isNaN(shadowAngle)) ? 180 : shadowAngle;
            createAndApplyShadowFfx(r);
            r("ADBE Layer Styles")(3)("innerShadow/mode2").setValue(1);
            r("ADBE Layer Styles")(3)("innerShadow/color").setValue(layer.innerShadow[0].color);
            r("ADBE Layer Styles")(3)("innerShadow/opacity").setValue(layer.innerShadow[0].color[3] * 100);
            r("ADBE Layer Styles")(3)("innerShadow/localLightingAngle").setValue(shadowAngle);
            r("ADBE Layer Styles")(3)("innerShadow/distance").setValue(shadowDistance);
            r("ADBE Layer Styles")(3)("innerShadow/blur").setValue(layer.innerShadow[0].blur * compMult);
        }
    }
    function createAndApplyShadowFfx(layer) {
        var binaryString = "RIFX\x00\x00\f\nFaFXhead\x00\x00\x00\x10\x00\x00\x00\x03\x00\x00\x00Q\x00\x00\x00\b\x00\x7F\x00\x00LIST\x00\x00\x0B\u00E6bescbeso\x00\x00\x008\x00\x00\x00\x01\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00]\u00A8\x00\x1D\u00F8R\x00\x00\x00\x04\x00\x01\x00\x01\x07\u0080\x048?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\u00FF\u00FF\u00FF\u00FFLIST\x00\x00\x00\u00ACtdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x02LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE Layer Styles\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(innerShadow/enabled\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdsn\x00\x00\x00\rInner Shadow\x00\x00LIST\x00\x00\x00dtdsptdot\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdpl\x00\x00\x00\x04\x00\x00\x00\x01LIST\x00\x00\x00@tdsitdix\x00\x00\x00\x04\u00FF\u00FF\u00FF\u00FFtdmn\x00\x00\x00(ADBE End of path sentinel\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\ndtdgptdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\rInner Shadow\x00\x00tdmn\x00\x00\x00(innerShadow/mode2\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00CEtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x02\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\x04\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(@\x14\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(innerShadow/color\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x01\x06tdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x02\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x04\x00\x07\x00\x01\x00\x02\u00FF\u00FF\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x01\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00`@o\u00E0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(innerShadow/opacity\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00EEtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x02\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(@R\u00C0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdum\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\x00\x00tduM\x00\x00\x00\b@Y\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(innerShadow/useGlobalAngle\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00CEtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x02\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\x00\x01\x00\x04\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x04\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(innerShadow/localLightingAngle\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00CEtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x02\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\x04\x06\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(@^\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(innerShadow/distance\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00EEtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x02\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(@\x14\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdum\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\x00\x00tduM\x00\x00\x00\b@Y\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(innerShadow/chokeMatte\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00EEtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x02\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdum\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\x00\x00tduM\x00\x00\x00\b@Y\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(innerShadow/blur\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00EEtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x02\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(@\x14\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdum\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\x00\x00tduM\x00\x00\x00\b@Y\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(innerShadow/noise\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00LIST\x00\x00\x00\u00EEtdbstdsb\x00\x00\x00\x04\x00\x00\x00\x01tdsn\x00\x00\x00\x02\x00\x00tdb4\x00\x00\x00|\u00DB\u0099\x00\x01\x00\x01\x00\x00\u00FF\u00FF\u00FF\u00FF\x00\x00]\u00A8?\x1A6\u00E2\u00EB\x1CC-?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00?\u00F0\x00\x00\x00\x00\x00\x00\x00\x00\x00\b\t\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00cdat\x00\x00\x00(\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00tdum\x00\x00\x00\b\x00\x00\x00\x00\x00\x00\x00\x00tduM\x00\x00\x00\b@Y\x00\x00\x00\x00\x00\x00tdmn\x00\x00\x00(ADBE Group End\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00<?xpacket begin=\"\u00EF\u00BB\u00BF\" id=\"W5M0MpCehiHzreSzNTczkc9d\"?>\n<x:xmpmeta xmlns:x=\"adobe:ns:meta/\" x:xmptk=\"Adobe XMP Core 5.3-c011 66.146227, 2012/04/10-09:44:09        \">\n   <rdf:RDF xmlns:rdf=\"http://www.w3.org/1999/02/22-rdf-syntax-ns#\">\n      <rdf:Description rdf:about=\"\"\n            xmlns:dc=\"http://purl.org/dc/elements/1.1/\">\n         <dc:format>application/vnd.adobe.aftereffects.preset-animation</dc:format>\n      </rdf:Description>\n      <rdf:Description rdf:about=\"\"\n            xmlns:xmp=\"http://ns.adobe.com/xap/1.0/\">\n         <xmp:CreateDate>2018-05-01T11:35:19-04:00</xmp:CreateDate>\n         <xmp:MetadataDate>2018-05-01T11:35:19-04:00</xmp:MetadataDate>\n         <xmp:ModifyDate>2018-05-01T11:35:19-04:00</xmp:ModifyDate>\n      </rdf:Description>\n      <rdf:Description rdf:about=\"\"\n            xmlns:xmpMM=\"http://ns.adobe.com/xap/1.0/mm/\"\n            xmlns:stEvt=\"http://ns.adobe.com/xap/1.0/sType/ResourceEvent#\">\n         <xmpMM:InstanceID>xmp.iid:0280117407206811AB08D1F43F3BD514</xmpMM:InstanceID>\n         <xmpMM:DocumentID>xmp.did:0280117407206811AB08D1F43F3BD514</xmpMM:DocumentID>\n         <xmpMM:OriginalDocumentID>xmp.did:0280117407206811AB08D1F43F3BD514</xmpMM:OriginalDocumentID>\n         <xmpMM:History>\n            <rdf:Seq>\n               <rdf:li rdf:parseType=\"Resource\">\n                  <stEvt:action>created</stEvt:action>\n                  <stEvt:instanceID>xmp.iid:0280117407206811AB08D1F43F3BD514</stEvt:instanceID>\n                  <stEvt:when>2018-05-01T11:35:19-04:00</stEvt:when>\n               </rdf:li>\n            </rdf:Seq>\n         </xmpMM:History>\n      </rdf:Description>\n   </rdf:RDF>\n</x:xmpmeta>\n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                                                                                                    \n                           \n<?xpacket end=\"w\"?>";
        var fileName = 'InnerShadow.ffx';
        var shadowPresetFile = new File(ffxFolder + '/' + fileName);
        if (!shadowPresetFile.exists) {
            shadowPresetFile = createFile(binaryString, fileName);
        }
        layer.selected = true;
        layer.applyPreset(shadowPresetFile);
        layer.selected = false;
    }
    function isAllowWriteFiles() {
        var securitySetting;
        try {
            securitySetting = app.preferences.getPrefAsLong("Main Pref Section", "Pref_SCRIPTING_FILE_NETWORK_SECURITY");
            return (securitySetting == 1);
        }
        catch (e) {
            return (false);
        }
    }
    function createFile(str, filename, element) {
        if (!(isAllowWriteFiles())) {
            alert('In order to make ' + scriptName + ' work, you need to enable little preference in After Effects: \n\nAllow Scripts to Write Files and Access Network\n\nCheck that box and we\'ll be in business.');
            try {
                app.executeCommand(2359);
            }
            catch (e) {
                alert(e);
            }
            if (!isAllowWriteFiles()) {
                return null;
            }
            ;
        }
        var binaryString = '';
        var lines = str.split('\n');
        for (var i = 0; i < lines.length; i++) {
            line = lines[i];
            if (line.search(/points/) != -1) {
                str = eval('element.gradient.' + line.toString()).toFixed(8);
                line = '<float>' + str + '</float>';
            }
            binaryString += (line + '\n');
        }
        var exportFile = new File(ffxFolder + '/' + filename);
        exportFile.encoding = 'BINARY';
        exportFile.open('w');
        exportFile.write(binaryString);
        exportFile.close();
        return exportFile;
    }
    function toggleGroupVisibility() {
        var guideViz;
        if (!setComp()) {
            return;
        }
        app.beginUndoGroup('Toggle Guide Layer Visibility');
        for (var i = 1; i <= thisComp.layers.length; i++) {
            var currentLayer = thisComp.layer(i);
            if (currentLayer.guideLayer === true) {
                guideViz = currentLayer.enabled;
                break;
            }
        }
        for (var j = 1; j <= thisComp.layers.length; j++) {
            var currentLayer = thisComp.layer(j);
            if (currentLayer.guideLayer === true) {
                currentLayer.enabled = !guideViz;
            }
        }
    }
    function groupToPrecomp() {
        if (!setComp()) {
            return;
        }
        ;
        app.beginUndoGroup('Group to precomp');
        var frameFolder = thisComp.parentFolder;
        var groupFolder = createNamedFolder('Precomps');
        groupFolder.parentFolder = frameFolder;
        if (thisComp.selectedLayers.length < 1) {
            return;
        }
        var masterGroups = thisComp.selectedLayers;
        var nonParentedLayers = [];
        for (var i = 0; i < masterGroups.length; i++) {
            convertParentToPrecomp(masterGroups[i]);
        }
        precompLayers(nonParentedLayers);
        app.endUndoGroup();
        function precompLayers(layers) {
            try {
                var precomp = thisComp.layers.precompose(layers, thisComp.layer(layers[0]).name, true);
                precomp.parentFolder = groupFolder;
            }
            catch (e) { }
        }
        function convertParentToPrecomp(masterGroup) {
            try {
                var masterPos = masterGroup('ADBE Transform Group')('ADBE Position').value;
                var masterRot = masterGroup('ADBE Transform Group')('ADBE Rotate Z').value;
                var masterscale = masterGroup('ADBE Transform Group')('ADBE Scale').value / 100;
                var masterLabel = masterGroup.label;
                var masterName = masterGroup.name;
                var masterParent = masterGroup.parent;
                var masterIn = masterGroup.inPoint;
                var masterOut = masterGroup.outPoint;
                var masterTrackMatte = masterGroup.trackMatteType;
                masterGroup.parent = null;
                var masterCompPos = masterGroup('ADBE Transform Group')('ADBE Position').value;
                masterGroup.parent = masterParent;
                var groupLayers = [masterGroup.index];
                getChildren(masterGroup, groupLayers);
                if (groupLayers.length < 2) {
                    if (!masterParent) {
                        nonParentedLayers.push(masterGroup.index);
                    }
                    return;
                }
                var isGroupLayer = (masterGroup.comment.includes(groupName)) ? true : false;
                if (isGroupLayer) {
                    var bounds = masterGroup.sourceRectAtTime(thisComp.time, false);
                    var masterSize = [Math.round(bounds.width * masterscale[0]), Math.round(bounds.height * masterscale[1])];
                }
                else {
                    var masterSize = [thisComp.width, thisComp.height];
                }
                for (var i = 0; i < groupLayers.length; i++) {
                }
                var precomp = thisComp.layers.precompose(groupLayers, masterGroup.name, true);
                precomp.parentFolder = groupFolder;
                precomp.width = masterSize[0];
                precomp.height = masterSize[1];
                if (isGroupLayer) {
                    precomp.layer(masterName)('ADBE Transform Group')('ADBE Position').setValue([precomp.width / 2, precomp.height / 2]);
                    precomp.comment = groupName;
                }
                precomp.label = masterLabel;
                precomp.layers[1]('ADBE Transform Group')('ADBE Rotate Z').setValue(0);
                if (isGroupLayer) {
                    try {
                        precomp.layers[1].remove();
                    }
                    catch (e) {
                        precomp.layers[1].locked = false;
                        precomp.layers[1].remove();
                        precomp.layers[1].remove();
                    }
                }
                var newGroupLayer = thisComp.selectedLayers[0];
                newGroupLayer.collapseTransformation = true;
                newGroupLayer.parent = masterParent;
                newGroupLayer.trackMatteType = masterTrackMatte;
                newGroupLayer('ADBE Transform Group')('ADBE Position').setValue(masterPos);
                newGroupLayer('ADBE Transform Group')('ADBE Rotate Z').setValue(masterRot);
                newGroupLayer.label = masterLabel;
                newGroupLayer.comment = groupName;
                newGroupLayer.inPoint = masterIn;
                newGroupLayer.outPoint = masterOut;
                if (!isGroupLayer) {
                    newGroupLayer('ADBE Transform Group')('ADBE Anchor Point').setValue(masterCompPos);
                }
            }
            catch (e) {
            }
        }
    }
    function precompToLayers() {
        if (!setComp()) {
            return;
        }
        ;
        labelColor = 0;
        prefs.precompGroups = false;
        compMult = 1;
        if (thisComp.selectedLayers.length < 1) {
            return;
        }
        var precompMasters = thisComp.selectedLayers;
        app.beginUndoGroup('Group to precomp');
        for (var i = 0; i < precompMasters.length; i++) {
            precompMaster = precompMasters[i];
            var isGroupLayer = (precompMaster.comment.includes(groupName)) ? true : false;
            inPoint = precompMasters[i].inPoint;
            outPoint = precompMasters[i].outPoint;
            label = precompMasters[i].label;
            if (!(precompMasters[i].source instanceof CompItem)) {
                continue;
            }
            convertToGroupLayers(precompMasters[i], precompMasters[i].source.layers, isGroupLayer);
            if (isGroupLayer) {
                thisComp.selectedLayers[0].inPoint = inPoint;
                thisComp.selectedLayers[0].outPoint = outPoint;
                thisComp.selectedLayers[0].label = label;
            }
        }
        app.endUndoGroup();
        function convertToGroupLayers(precompMaster, precompedLayers, isGroupLayer) {
            var groupObj = [{
                    "type": "Group",
                    "name": 'Group',
                    "id": "",
                    "frame": {
                        "x": 0,
                        "y": 0,
                        "width": precompMaster.width,
                        "height": precompMaster.height
                    },
                    "isVisible": 1,
                    "opacity": 100,
                    "rotation": 0,
                    "blendMode": 0,
                    "flip": [
                        100,
                        100
                    ],
                    "hasClippingMask": 0,
                    "shouldBreakMaskChain": 1,
                    "layers": [0, 0]
                }];
            var parentList = [];
            var lockedList = [];
            filterTypes(groupObj);
            var r = thisComp.layer(1);
            r.enabled = true;
            r.parent = precompMaster.parent;
            r('ADBE Transform Group')('ADBE Anchor Point').setValue(precompMaster('ADBE Transform Group')('ADBE Anchor Point').value);
            r('ADBE Transform Group')('ADBE Position').setValue(precompMaster('ADBE Transform Group')('ADBE Position').value);
            r('ADBE Transform Group')('ADBE Rotate Z').setValue(precompMaster('ADBE Transform Group')('ADBE Rotate Z').value);
            r('ADBE Transform Group')('ADBE Scale').setValue(precompMaster('ADBE Transform Group')('ADBE Scale').value);
            for (var i = precompedLayers.length; i > 0; i--) {
                var nonParented = false;
                parentList[i] = (precompedLayers[i].parent) ? precompedLayers[i].parent.index : null;
                lockedList[i] = (precompedLayers[i].locked) ? true : false;
                precompedLayers[i].locked = false;
                if (precompedLayers[i].parent) {
                    precompedLayers[i].parent = null;
                }
                precompedLayers[i].copyToComp(thisComp);
                thisComp.layer(1).setParentWithJump(r);
                thisComp.layer(1).moveAfter(r);
            }
            var groupLayersList = [r.index];
            getChildren(r, groupLayersList);
            for (var j = groupLayersList.length - 1; j >= 0; j--) {
                thisComp.layer(groupLayersList[j]).moveAfter(precompMaster);
            }
            for (var l = parentList.length - 1; l > 0; l--) {
                if (!isGroupLayer) {
                    thisComp.layer(r.index + l).selected = true;
                }
                if (parentList[l]) {
                    thisComp.layer(r.index + l).parent = thisComp.layer(r.index + parentList[l]);
                }
            }
            for (var m = lockedList.length - 1; m > 0; m--) {
                if (lockedList[m]) {
                    thisComp.layer(r.index + m).locked = true;
                }
            }
            if (!isGroupLayer) {
                var mainIndex = r.index;
                r.remove();
            }
            var precompSource = precompMaster.source;
            precompMaster.remove();
            if (precompSource.usedIn.length < 1) {
                precompSource.remove();
            }
        }
    }
    function getChildren(parent, layerList) {
        for (var i = 1; i <= thisComp.layers.length; i++) {
            layer = thisComp.layers[i];
            if (layer.parent == parent) {
                layerList.push(layer.index);
                getChildren(layer, layerList);
            }
        }
        return layerList;
    }
    function deleteGroupLayers() {
        app.beginUndoGroup('Group to precomp');
        if (!setComp()) {
            return;
        }
        ;
        for (var i = thisComp.layers.length; i > 0; i--) {
            var layer = thisComp.layer(i);
            if (layer.comment.includes(groupName)) {
                layer.remove();
            }
        }
        app.endUndoGroup();
    }
    function ae_deselectProps() {
        var propLength = thisComp.selectedProperties.length;
        for (var i = 0; i < propLength; i++) {
            thisComp.selectedProperties[0].selected = false;
        }
    }
    function nameInc(inputStr, itemGroup) {
        var activeLayer;
        var incName = inputStr;
        var activeCaps;
        var inputCaps = inputStr.toUpperCase();
        for (var i = 1; i <= itemGroup.length; i++) {
            activeLayer = itemGroup[i];
            activeCaps = activeLayer.name.toUpperCase();
            if (activeCaps === inputCaps) {
                var lnSuf = parseInt(incName.match(/\d+$/));
                if (!isNaN(lnSuf)) {
                    var numInc = parseInt(lnSuf) + 1;
                    var lnCtrlName = activeLayer.name.split(/\d+$/)[0];
                    incName = lnCtrlName + numInc;
                    incName = nameInc(incName, app.project.items);
                    break;
                }
                else {
                    incName = inputStr + ' 2';
                    incName = nameInc(incName, app.project.items);
                    break;
                }
            }
        }
        return incName;
    }
    function visitURL(url) {
        if ($.os.indexOf('Windows') != -1) {
            system.callSystem('cmd /c "' + Folder.commonFiles.parent.fsName + "\\Internet Explorer\\iexplore.exe" + '" ' + url);
        }
        else {
            var cmd = 'open "' + url + '"';
            system.callSystem(cmd);
        }
    }
    function resetProgressDialog(str, hideProgressBar) {
        try {
            progressText.remove(0);
        }
        catch (e) { }
        ;
        try {
            progressDialog.remove(1);
        }
        catch (e) { }
        ;
        if (hideProgressBar) {
        }
        else {
            pbar = progressDialog.add('progressbar', undefined, 0, 1);
            pbar.value = 0;
            pbar.preferredSize.width = 300;
        }
        progressText.add('statictext', undefined, str);
        progressDialog.layout.layout(true);
        progressDialog.show();
        $.sleep(200);
    }
    function updateAePanel(msgData) {
        var updateDialog = new Window('dialog', 'Update Ae panel first');
        updateDialog.alignChildren = 'fill';
        var updateText = updateDialog.add('group');
        updateText.alignChildren = ['center', 'center'];
        updateText.add('statictext', undefined, msgData.text, { multiline: true });
        var buttonsGoup = updateDialog.add('group');
        buttonsGoup.alignChildren = ['center', 'center'];
        var updateCancel = buttonsGoup.add('button', undefined, 'Cancel', { name: 'cancel' });
        var updateUrl = buttonsGoup.add('button', undefined, 'Download', { name: 'ok' });
        updateCancel.onClick = function () {
            updateDialog.hide();
        };
        updateUrl.onClick = function () {
            visitURL(msgData.url);
            updateDialog.hide();
        };
        updateDialog.show();
    }
    function openFile() {
        var filePath = File.openDialog('Select a .json or zip file', "XML or ASE:*.xml;*.ase", false);
        return filePath;
    }
    function setFilePath() {
        try {
            var filePath = Folder.selectDialog(['Location to save images']);
            if (filePath == null) {
                return null;
            }
            ;
            return filePath.absoluteURI;
        }
        catch (e) {
            alert(e.toString() + "\nError on line: " + e.line.toString());
        }
    }
    function downloadUpdateDialog() {
        var w = new Window('dialog', 'AEUX update required');
        var messageText = w.add('statictext', undefined, "Download a new version of the Ae panel (".concat(importVersion, ") from aeux.io"), { multiline: true });
        messageText.preferredSize.width = 300;
        var buttonGroup = w.add('group {alignment: "right"}');
        buttonGroup.add('button', undefined, 'Close', { name: 'cancel' });
        var savePath = buttonGroup.add('button', undefined, 'Download', { name: 'ok' });
        savePath.onClick = function () {
            visitURL('http://aeux.io');
            w.close();
        };
        w.show();
    }
    var progressDialog = new Window('palette', 'Hold on. One sec.');
    progressDialog.alignChildren = 'fill';
    var progressText = progressDialog.add('group');
    progressText.minimumSize.width = 330;
    progressText.alignChildren = ['center', 'center'];
    return {
        popup: function () {
            alert('yay');
        },
        buildLayers: function (compObj) {
            return buildLayers(compObj);
        },
        toggleGroupVisibility: function () {
            toggleGroupVisibility();
        },
        groupToPrecomp: function () {
            groupToPrecomp();
        },
        precompToLayers: function () {
            precompToLayers();
        },
        deleteGroupLayers: function () {
            deleteGroupLayers();
        },
        updateAePanel: function (msgData) {
            return updateAePanel(msgData);
        },
        openFile: function () {
            return openFile();
        },
        setFilePath: function () {
            return setFilePath();
        }
    };
})();
