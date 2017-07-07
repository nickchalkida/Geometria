
function CalcFunction() {
	var instr0 = document.getElementById("idFunctionInput").value;
	var instr1 = instr0.toLowerCase();
	instr1 = instr1.replace(/pow/g, "Math.pow");

	instr1 = instr1.replace(/sin/g, "Math.sin");
	instr1 = instr1.replace(/cos/g, "Math.cos");
	instr1 = instr1.replace(/tan/g, "Math.tan");
	instr1 = instr1.replace(/cot/g, "Math.cot");

	instr1 = instr1.replace(/log/g, "Math.log");
	instr1 = instr1.replace(/pi/g,  "Math.PI");
	instr1 = instr1.replace(/e/g,   "Math.E");
	
	var funcstr = "return " + instr1 + ";";
	var f = new Function('x', funcstr);
	var lbound = document.getElementById("idLBound").value;
	var rbound = document.getElementById("idRBound").value;

	var NE = [];
	NE.push(f);
	NE.push(lbound);
	NE.push(rbound);
	
	var G1 = mainboard.create('functiongraph', NE);
	G1.setAttribute({strokeWidth:CUR_STROKE_WIDTH});
}

function getDrawAttrs(){
	var nea_fill_opacity;
	var nea_stroke_opacity;

	if (FILL_CHECKED)
	nea_fill_opacity = CUR_FILL_OPACITY;
	else 
	nea_fill_opacity = 0;

	if (STROKE_CHECKED)
	nea_stroke_opacity = CUR_STROKE_OPACITY;
	else 
	nea_stroke_opacity = 0;

	var attrs = {
	fillColor: CUR_FILL_COLOR,
	fillOpacity: nea_fill_opacity,
	strokeColor: CUR_STROKE_COLOR,
	strokeOpacity: nea_stroke_opacity,
	strokeWidth: CUR_STROKE_WIDTH };
	return attrs;
}

function UnDraftBoard() {
	for (el in mainboard.objects) {
        var obj = mainboard.objects[el];
        mainboard.update(obj);
        obj.setAttribute({
            draft: false
        });
    }
	//mainboard.stopSelectionMode();
	mainboard.updateRenderer();
    SELECTED_OBJECTS = [];
}

function isLikePoint(obj) {
	if (obj.elType == 'point' ||
		obj.elType == 'midpoint' ||
		obj.elType == 'perpendicularpoint' ||
		obj.elType == 'intersection' ||
		obj.elType == 'glider' ||
		obj.elType == 'otherintersection')
		return true;
	return false;
}

function isLikeLine(obj) {
	if (obj.elType == 'line' ||
		obj.elType == 'segment' ||
		obj.elType == 'axis')
		return true;
	return false;
}

function DisplayObjectToEdit(disobj) {
	//alert("DisplayObject " + disobj.id);
	
	CUR_OBJECT_EDITING = disobj;
	
	DOM_EDObjID.value          = disobj.id;
	DOM_EDObjName.value        = disobj.getName();
	DOM_EDObjType.value        = disobj.getType();
	
	if (isLikePoint(disobj)) {
		DOM_EDObjSize.style.visibility = "visible";
		DOM_EDObjSize.value        = disobj.getAttribute("size");
	} else if (DOM_EDObjType.value=="text") {
		DOM_EDObjSize.style.visibility = "visible";
		DOM_EDObjSize.value        = disobj.getAttribute("fontSize");
	} else {
		DOM_EDObjSize.style.visibility = "hidden";
	}
	
	DOM_EDVisibility.checked   = disobj.visible;

	DOM_EDobjfillcolor.value   = disobj.getAttribute("fillColor");
	DOM_EDfillopacity.value    = parseInt(disobj.getAttribute("fillOpacity")*100);

	DOM_EDobjstrokecolor.value = disobj.getAttribute("strokeColor");
	DOM_EDstrokeopacity.value  = parseInt(disobj.getAttribute("strokeOpacity")*100);
	DOM_EDObjStrokeWidth.value = disobj.getAttribute("strokeWidth");
}

function Get_DOM_Globals() {
	DOM_EDObjID = document.getElementById("EDObjID");
	DOM_EDObjName = document.getElementById("EDObjName");
	DOM_EDObjType = document.getElementById("EDObjType");
	DOM_EDObjSize = document.getElementById("EDObjSize");
	
	DOM_EDVisibility = document.getElementById("EDVisibility");

	DOM_EDobjfillcolor = document.getElementById("EDobjfillcolor");
	DOM_EDfillopacity = document.getElementById("EDfillopacity");

	DOM_EDobjstrokecolor = document.getElementById("EDobjstrokecolor");
	DOM_EDstrokeopacity = document.getElementById("EDstrokeopacity");
	DOM_EDObjStrokeWidth = document.getElementById("EDObjStrokeWidth");

}

function GetCurrentDrawParams() {
	
	FILL_CHECKED = document.getElementById("checkfill").checked;
	CUR_FILL_COLOR = document.getElementById("fillcolor").value;
	CUR_FILL_OPACITY = document.getElementById("fillopacity").value/100.0;

	STROKE_CHECKED = document.getElementById("checkstroke").checked;
	CUR_STROKE_COLOR = document.getElementById("strokecolor").value;
	CUR_STROKE_OPACITY = document.getElementById("strokeopacity").value/100.0;
	CUR_STROKE_WIDTH = document.getElementById("strokewidth").value;

}

function ClearEditFields() {
	CUR_OBJECT_EDITING = null;
	
	DOM_EDObjID.value          = "";
	DOM_EDObjName.value        = "";
	DOM_EDObjType.value        = "";
	DOM_EDObjSize.value        = "";
	
	DOM_EDVisibility.checked   = false;

	DOM_EDobjfillcolor.value   = "#000000";
	DOM_EDfillopacity.value    = 100;

	DOM_EDobjstrokecolor.value = "#000000";
	DOM_EDstrokeopacity.value  = 100;
	DOM_EDObjStrokeWidth.value = 0;

}

function Save() {
	//alert("Save");
	var svg = new XMLSerializer().serializeToString(mainboard.renderer.svgRoot);
	//console.log(svg);
	var file = new Blob([svg], {type:'text/plain'});
	var dlbtn = document.getElementById("dlbtn");
	dlbtn.href = URL.createObjectURL(file);
	dlbtn.download = "GeometriaSvg.txt";
}

function ShowArray(objar) {
    var el, obj;
    var len, ind=0;

    len  = Object.keys(mainboard.objects).length;
    for (el in objar) {
        ind++;
        obj = objar[el];

        alert(obj.elType + " id:" + obj.id );
    }
    mainboard.fullUpdate();
    mainboard.updateRenderer();
}

function Test() {
    alert("CREATED LEN:"+CREATED_OBJECTS.length + " UNDO CREATED LEN:"+ UNDO_CREATED_OBJECTS.length);
    alert("DELETED LEN:"+DELETED_OBJECTS.length + " UNDO DELETED LEN:"+ UNDO_DELETED_OBJECTS.length);
    alert("ACTIONS LEN:"+DID_ACTIONS.length + " UNDO ACTIONS LEN:"+ UNDO_ACTIONS.length);
    //ShowArray(mainboard.objects);
}

function boardCreate(eltyp, par, attrs) {
    var obj;

    try {   
	obj = mainboard.create(eltyp, par, attrs);
	} catch (err) {
		alert("boardCreate exception caught " + err);
		return null;
	}

	CREATED_OBJECTS.push(obj);
	DID_ACTIONS.push("create");
    UnDraftBoard();
	
	var objSelector = document.getElementById('objSelector');
    objSelector.options[objSelector.options.length] = new Option(obj.id, obj.id);
    
    objSelector.selectedIndex = objSelector.options.length-1;
    DisplayObjectToEdit(obj);
        
    return obj;
}

function boardDelete() {
	var obj = SELECTED_OBJECTS.pop();
	
	// Remove obj from CREATED_OBJECTS
    DELETED_OBJECTS.push(obj);
	DID_ACTIONS.push("delete");
	
	mainboard.removeObject(obj);
	mainboard.updateRenderer();
	
	// Reload options in object selector
	var objSelector = document.getElementById('objSelector');
	objSelector.options.length = 0;
	var el, boardobj, objname;
	for (el in mainboard.objects) {
	    boardobj = mainboard.objects[el];
		objname = boardobj.getName();
		if (objname.substring(0,8)!="RootObj_") {
        objSelector.options[objSelector.options.length] = new Option(boardobj.id, boardobj.id);
		}
	}
}

function SynchronizeObjects() {
    var el;
	var obj, objname;
    CREATED_OBJECTS.length = 0;
    for (el in mainboard.objects) {
		obj = mainboard.objects[el];
		objname = obj.getName();
		if (objname.substring(0,8)!="RootObj_") {
		CREATED_OBJECTS.push(el);
		}
    }
}

function UnDo () {
    var obj, nobj;
	if (DID_ACTIONS.length < 1)
		return;
	
	var lastaction = DID_ACTIONS.pop();
	UNDO_ACTIONS.push(lastaction);
	if (lastaction == "create") {
	    obj = CREATED_OBJECTS.pop();
	    try {
	    mainboard.removeObject(obj);
	    } catch (err) {}
	    mainboard.updateRenderer();
	    UNDO_CREATED_OBJECTS.push(obj);
	} else if (lastaction == "delete") {
	    obj = DELETED_OBJECTS.pop();
	    try {
	    nobj = mainboard.create(obj.getType(), obj.getParents(), obj.getAttributes());
	    } catch (err) {}
	    mainboard.updateRenderer();
	    UNDO_DELETED_OBJECTS.push(nobj);
	}
}

function ReDo () {
    var obj, nobj;
	if (UNDO_ACTIONS.length < 1)
		return;
	
	var redoaction = UNDO_ACTIONS.pop();
	DID_ACTIONS.push(redoaction);
	if (redoaction == "create") {
	    obj = UNDO_CREATED_OBJECTS.pop();
	    try {
	    nobj = mainboard.create(obj.getType(), obj.getParents(), obj.getAttributes());
	    } catch (err) {}
	    mainboard.updateRenderer();
	    CREATED_OBJECTS.push(nobj);
	} else if (redoaction == "delete") {
	    obj = UNDO_DELETED_OBJECTS.pop();
	    try {
	    mainboard.removeObject(obj);
	    } catch (err) {}
	    mainboard.updateRenderer();
	    DELETED_OBJECTS.push(obj);
	}
}


function NewFile() {
    mainboard = JXG.JSXGraph.initBoard('mainbox', {boundingbox: [-10,10,10,-10], axis: true, grid:true, showCopyright:false});   
    var el, obj;

	var objSelector = document.getElementById('objSelector');
	objSelector.options.length = 0;
	
	Get_DOM_Globals();
	GetCurrentDrawParams();

    DID_ACTIONS.length=0;
    UNDO_ACTIONS.length=0;
    CREATED_OBJECTS.length=0;
    UNDO_CREATED_OBJECTS.length=0;
    DELETED_OBJECTS.length=0;
    UNDO_DELETED_OBJECTS.length=0;
	ClearEditFields();

    for (el in mainboard.objects) {
        obj = mainboard.objects[el];
		obj.setName("RootObj_"+obj.id);
        ROOT_OBJECTS.push(obj);
		//CREATED_OBJECTS.push(obj);
		//objSelector.options[objSelector.options.length] = new Option(obj.id, obj.id);
        if (obj.elType!='point') {
        obj.showElement();
        obj.visible = true;
        }
    }
    
    //objSelector.selectedIndex = objSelector.options.length-1;
    //DisplayObjectToEdit(obj);

	SynchronizeObjects();
    
}

function ZoomIn() {
}

function ZoomOut() {
}

function ToggleAxis() {
    var obj;
    for (el in ROOT_OBJECTS) {
        obj = ROOT_OBJECTS[el];
        //alert(obj.elType + " id:" + obj.id);
        if (obj.visible) {
            obj.hideElement();
            obj.visible = false;
        } else {
            if (obj.elType!="point") {
            obj.showElement();
            obj.visible = true;
            }
        }
    }
    mainboard.fullUpdate();
    
}

var getMouseCoords = function(e, i) {
    var cPos = mainboard.getCoordsTopLeftCorner(e, i),
        absPos = JXG.getPosition(e, i),
        dx = absPos[0] - cPos[0],
        dy = absPos[1] - cPos[1];

    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], mainboard);
}


function ObjectSelectorChanged() {
	var objsel;
	var found=false;
	for (el in mainboard.objects) {
        if (mainboard.objects[el].id == objSelector.value) {
			objsel = mainboard.objects[el];
			found=true;
			break;
		}
	}
	
	if (!found)
		return;
	
    DisplayObjectToEdit(objsel);

}

function ApplyObjectChanges() {
	//alert("In ApplyObjectChanges");
	
	CUR_OBJECT_EDITING.setName(DOM_EDObjName.value);
	
	if (DOM_EDObjType.value == "text")
		CUR_OBJECT_EDITING.setAttribute({"fontSize":DOM_EDObjSize.value});
	else
		CUR_OBJECT_EDITING.setAttribute({"size":DOM_EDObjSize.value});
	
	if (DOM_EDVisibility.checked) {
	    CUR_OBJECT_EDITING.showElement();
	    CUR_OBJECT_EDITING.visible = true;
	} else {
	    CUR_OBJECT_EDITING.hideElement();
	    CUR_OBJECT_EDITING.visible = false;
	}
	CUR_OBJECT_EDITING.setAttribute({"fillColor":DOM_EDobjfillcolor.value});
	CUR_OBJECT_EDITING.setAttribute({"fillOpacity":DOM_EDfillopacity.value/100.0});

	CUR_OBJECT_EDITING.setAttribute({"strokeColor":DOM_EDobjstrokecolor.value});
	CUR_OBJECT_EDITING.setAttribute({"strokeOpacity":DOM_EDstrokeopacity.value/100.0});
	CUR_OBJECT_EDITING.setAttribute({"strokeWidth":DOM_EDObjStrokeWidth.value});

    mainboard.updateRenderer();
	UnDraftBoard();

}

