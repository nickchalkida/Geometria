
/*******************************************************************************

    Copyright (C) 2016-2017  Nikolaos L. Kechris
    
    This file is part of Geometria.
    Utilities javascript functions.

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the  Free  Software  Foundation, either version 2 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful, 
    but WITHOUT ANY WARRANTY; without even the implied warranty of 
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.


*******************************************************************************/

function findObjectInList(objid, objlist) {
    var el, obj;
    for (el in objlist) {
		obj = objlist[el];
		if (obj.id == objid) {
		    return obj;
		}
    }
    return null;
}

function findIndexInSelections(objid) {
    for (var i=0; i<DOM_OBJECT_SELECTOR.options.length; i++) {
		if (DOM_OBJECT_SELECTOR.options[i].value == objid) {
		    return i;
		}
    }
    return -1;
}

function getEllipseAttrsFrom3P(P1, P2, P3) {
	// for the three points (x1,y1), (x2,y2) and (x3,y3)
	// consider solving
	// | x1^2 y1^2 2x1y1 |   | C11 |   | 1 |
	// | x2^2 y2^2 2x2y2 | * | C22 | = | 1 |
	// | x3^2 y3^2 2x3y3 |   | C12 |   | 1 |
		
	var PMATRIX = 
			[
			[P1.X()*P1.X(), P1.Y()*P1.Y(), 2*P1.X()*P1.Y()],
			[P2.X()*P2.X(), P2.Y()*P2.Y(), 2*P2.X()*P2.Y()],
			[P3.X()*P3.X(), P3.Y()*P3.Y(), 2*P3.X()*P3.Y()]
			]; 
						
	//ShowMatrix(PMATRIX);
		
	var PINV = matrix_invert(PMATRIX);
	//ShowMatrix(PINV);
		
	var C11 = PINV[0][0] + PINV[0][1] + PINV[0][2];
	var C22 = PINV[1][0] + PINV[1][1] + PINV[1][2];
	var C12 = PINV[2][0] + PINV[2][1] + PINV[2][2];
	
	// angle of ellipse measured clockwise from horizontal is
	// θ = (1/2) arctan ( 2*C12 / (C22 -C11) )
	// Let η = C11 + C22
	// Let ζ = (C22 - C11) / cos(2θ) 
	// then
	// Semi major axis a= sqrt( 2 / (η-ζ) )
	// Semi minor axis b= sqrt( 2 / (η+ζ) )
		
	var theta = 0.5 * Math.atan((2*C12)/(C22-C11));
	var heta  = C11 + C22;
	var zeta  = (C22-C11) / Math.cos(2*theta);
	
	var semi_major_axis = Math.sqrt(2/(heta-zeta));
	var semi_minor_axis = Math.sqrt(2/(heta+zeta));
		
	var ellipseattrs = {
	rotation: theta * (180 / Math.PI),
	AxisA: semi_major_axis,
	AxisB: semi_minor_axis
	};

	return ellipseattrs;	
	
}

function getEllipseAttrsFromFoci(F1, F2, P0) {
	// Let a = (F1,P0)
	var CenX = (F1.X() + F2.X()) / 2.0;
	var CenY = (F1.Y() + F2.Y()) / 2.0;
	
	var DF1P0 = Math.sqrt((F1.X()-P0.X())*(F1.X()-P0.X()) + (F1.Y()-P0.Y())*(F1.Y()-P0.Y()));
	var DF2P0 = Math.sqrt((F2.X()-P0.X())*(F2.X()-P0.X()) + (F2.Y()-P0.Y())*(F2.Y()-P0.Y()));
	var DF1F2 = Math.sqrt((F1.X()-F2.X())*(F1.X()-F2.X()) + (F1.Y()-F2.Y())*(F1.Y()-F2.Y()));
	
	var major_axis = DF1P0+DF2P0;
	var minor_axis = Math.sqrt( major_axis*major_axis - DF1F2*DF1F2);
	var theta = Math.atan( (F2.Y()- F1.Y()) / (F2.X()- F1.X()) );
	
	var ellipseattrs = {
	CenterX: CenX,
	CenterY: CenY,
	rotation: theta * (180 / Math.PI),
	AxisA: major_axis,
	AxisB: minor_axis
	};

	return ellipseattrs;	
}

function getSectorAttrsFromPoints(F1, P0, F2) {
	var CenX = P0.X();
	var CenY = P0.Y();

	var DF1P0 = Math.sqrt((F1.X()-P0.X())*(F1.X()-P0.X()) + (F1.Y()-P0.Y())*(F1.Y()-P0.Y()));
	var DF2P0 = Math.sqrt((F2.X()-P0.X())*(F2.X()-P0.X()) + (F2.Y()-P0.Y())*(F2.Y()-P0.Y()));
	var DF1F2 = Math.sqrt((F1.X()-F2.X())*(F1.X()-F2.X()) + (F1.Y()-F2.Y())*(F1.Y()-F2.Y()));
	var DOT_P0F1_P0F2 = (F1.X()-P0.X())*(F2.X()-P0.X()) + (F1.Y()-P0.Y())*(F2.Y()-P0.Y());
	var DET_P0F1_P0F2 = (F1.X()-P0.X())*(F2.Y()-P0.Y()) - (F2.X()-P0.X())*(F1.Y()-P0.Y());

	var atheta = Math.atan2((F1.Y()- P0.Y()) , (F1.X()- P0.X()) ); // klisi F1P0
	var btheta = Math.atan2((F2.Y()- P0.Y()) , (F2.X()- P0.X()) ); // klisi F2P0
	var tangle = Math.acos( DOT_P0F1_P0F2 / (DF1P0 * DF2P0));
	
	atheta *= (180 / Math.PI);
	btheta *= (180 / Math.PI);
	tangle *= (180 / Math.PI);
	
	var klea = atheta;
	var kleb = btheta;

	//if (DET_P0F1_P0F2<0) {
	//	btheta += 360;
	//}
	if (btheta-atheta<0) {
		btheta += 360;
	} else if (btheta-atheta>360) {
		btheta -= 360;
	}
	
	var sectorattrs = {
	CenterX: CenX,
	CenterY: CenY,
	arotation: atheta,
	brotation: btheta,
	klisia:klea,
	klisib:kleb,
	angle: tangle
	};

	return sectorattrs;	
}

function RGBColorToTikzColor(rgbcol) {
	var r0str = rgbcol.substring(1, 3); 
	var g0str = rgbcol.substring(3, 5); 
	var b0str = rgbcol.substring(5, 7);

	return "{rgb, 255:red,"+parseInt(r0str, 16) + ";green,"+parseInt(g0str, 16)+";blue,"+parseInt(b0str, 16)+"}";
}

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

function SynchronizeObjects() {
    var el;
	var obj, objname, lastobj, optstr;

    DOM_OBJECT_SELECTOR.options.length = 0;
    for (el in mainboard.objects) {
		obj = mainboard.objects[el];
		objname = obj.getName();
        optstr = objname + " - " + obj.id;
		if (objname.substring(0,8)!="RootObj_" && !obj.id.endsWith("Label")) {
		DOM_OBJECT_SELECTOR.options[DOM_OBJECT_SELECTOR.options.length] = new Option(optstr,obj.id);
		lastobj = obj;
		}
    }
	if (DOM_OBJECT_SELECTOR.options.length==0) {
	    ClearEditFields();
	} else {
	    DisplayObjectToEdit(lastobj);
	}
}

function boardCreateWithoutStore(eltyp, par, attrs) {
    var obj=null, bez1;
    if (!JXG.exists(par) || par.length==0)
        return null;
        
    try {

        switch (eltyp) {
        case 'bezier':
			bez1 = JXG.Math.Numerics.bezier(par);
			obj = mainboard.create('curve', bez1, attrs);

			obj.addParents(par[0].id);
			obj.addParents(par[1].id);
			obj.addParents(par[2].id);
			obj.addParents(par[3].id);
            break;
		default:
			obj = mainboard.create(eltyp, par, attrs);
        } // end switch
        if (JXG.exists(obj))
            obj.elType=eltyp;
	} catch (err) {
		alert("boardCreate exception caught " + err);
		return null;
	}
    return obj;
}

function StoreMainboardAction(actype, creobj, eltyp, par, attrs) {
    // Before storing clean MAINBOARD_STORED_ACTIONS
    // above STORED_STATE_INDEX
    while (MAINBOARD_STORED_ACTIONS.length > STORED_STATE_INDEX+1) {
        MAINBOARD_STORED_ACTIONS.pop();
    }
 	STORED_STATE_INDEX++;

	var action = {
			actiontype:actype, 
			createdobject:creobj, 
			objtype:eltyp, 
			parents:par, 
			attributes:attrs};
	MAINBOARD_STORED_ACTIONS.push(action);
}

function UnDraftBoard() {
    try {
	for (var el in mainboard.objects) {
        var obj = mainboard.objects[el];
        mainboard.update(obj);
        obj.setAttribute({draft: false});
    }
	mainboard.updateRenderer();
    SELECTED_OBJECTS.length=0;
 	} catch (err) {
		alert("UnDraftBoard exception caught " + err);
		return null;
	}
}


function boardCreate(eltyp, par, attrs) {
    var obj;
	
	obj = boardCreateWithoutStore(eltyp, par, attrs);
	StoreMainboardAction("create", obj, eltyp, par, attrs);
    SynchronizeObjects();
    UnDraftBoard();
        
    return obj;
}

function boardDelete() {
	var obj=null;
	
	if (SELECTED_OBJECTS.length < 1)
		return;
	obj = SELECTED_OBJECTS.pop();
    if (!JXG.exists(obj))
        return;
    
    try {
	StoreMainboardAction("delete", obj, obj.elType, obj.getParents(), obj.getAttributes());
	mainboard.removeObject(obj);
	
	SynchronizeObjects();
	mainboard.updateRenderer();
	} catch (err) {
		alert("boardDelete exception caught " + err);
		return null;
	}

}

function ObjectSelectorChanged() {
	var objsel;
	var found=false;
	for (var el in mainboard.objects) {
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

function fileSelectorChanged() {
	SAVE_FILE_TYPE = FILE_SELECTOR.options[FILE_SELECTOR.selectedIndex].value;
}

function isLikePoint(obj) {

	if (obj.elType === 'point' ||
		obj.elType === 'midpoint' ||
		obj.elType === 'perpendicularpoint' ||
		obj.elType === 'intersection' ||
		obj.elType === 'glider' ||
		obj.elType === 'otherintersection')
		return true;
	return false;
}

function isLikeLine(obj) {
	if (obj.elType === 'line' ||
		obj.elType === 'segment' ||
		obj.elType === 'parallel' ||
		obj.elType === 'perpendicular' ||
		obj.elType === 'semiline' ||
		obj.elType === 'axis')
		return true;
	return false;
}

function DisplayObjectToEdit(disobj) {
	
	CUR_OBJECT_EDITING   = disobj;
	
	DOM_EDObjID.value    = disobj.id;
	DOM_EDObjName.value  = disobj.getName();
	DOM_EDObjType.value  = disobj.getType();
	
	DOM_OBJECT_SELECTOR.selectedIndex = findIndexInSelections(disobj.id);
	
    // First assume visible
	DOM_EDObjSize.style.visibility  = "visible";
	DOM_EDObjPosX.style.visibility  = "visible";
	DOM_EDObjPosY.style.visibility  = "visible";
    DOM_EDHasLabel.style.visibility = "visible";
    DOM_EDHasLabelText.style.visibility = "visible";
	
	if (isLikePoint(disobj)) {
		DOM_EDObjSize.value = disobj.getAttribute("size");
		DOM_EDObjPosX.value = disobj.X();
		DOM_EDObjPosY.value = disobj.Y();
	} else if (DOM_EDObjType.value=="text") {
		DOM_EDObjSize.value = disobj.getAttribute("fontSize");
		DOM_EDObjPosX.value = disobj.X();
		DOM_EDObjPosY.value = disobj.Y();

        DOM_EDHasLabel.style.visibility = "hidden";
        DOM_EDHasLabelText.style.visibility = "hidden";
	} else {
		DOM_EDObjSize.style.visibility  = "hidden";
		DOM_EDObjPosX.style.visibility  = "hidden";
		DOM_EDObjPosY.style.visibility  = "hidden";
	}
	
	DOM_EDVisibility.checked   = disobj.visible;
	DOM_EDHasLabel.checked     = disobj.hasLabel;

	DOM_EDobjfillcolor.value   = disobj.getAttribute("fillColor");
	DOM_EDfillopacity.value    = parseInt(disobj.getAttribute("fillOpacity")*100);

	DOM_EDobjstrokecolor.value = disobj.getAttribute("strokeColor");
	DOM_EDstrokeopacity.value  = parseInt(disobj.getAttribute("strokeOpacity")*100);
	DOM_EDObjStrokeWidth.value = disobj.getAttribute("strokeWidth");
    
	//var attr1str = objToString(disobj.visProp);
	//alert(attr1str);

}

function Get_DOM_Globals() {

    DOM_OBJECT_SELECTOR  = document.getElementById('objSelector');
	FILE_SELECTOR        = document.getElementById('fileSelector');

	DOM_EDObjID          = document.getElementById("EDObjID");
	DOM_EDObjName        = document.getElementById("EDObjName");
	DOM_EDObjType        = document.getElementById("EDObjType");
	DOM_EDObjSize        = document.getElementById("EDObjSize");
	DOM_EDObjPosX        = document.getElementById("EDObjPosX");
	DOM_EDObjPosY        = document.getElementById("EDObjPosY");
	
	DOM_EDVisibility     = document.getElementById("EDVisibility");
	DOM_EDHasLabel       = document.getElementById("EDHasLabel");
	DOM_EDHasLabelText   = document.getElementById("EDHasLabelText");

	DOM_EDobjfillcolor   = document.getElementById("EDobjfillcolor");
    DOM_EDobjfillcolor.value = JXG.Options.point.fillcolor;
	DOM_EDfillopacity    = document.getElementById("EDfillopacity");

	DOM_EDobjstrokecolor = document.getElementById("EDobjstrokecolor");
    DOM_EDobjstrokecolor.value = JXG.Options.point.strokecolor;
	DOM_EDstrokeopacity  = document.getElementById("EDstrokeopacity");
	DOM_EDObjStrokeWidth = document.getElementById("EDObjStrokeWidth");

}

function GetCurrentDrawParams() {
	
	FILL_CHECKED         = document.getElementById("checkfill").checked;
	CUR_FILL_COLOR       = document.getElementById("fillcolor").value;
	CUR_FILL_OPACITY     = document.getElementById("fillopacity").value/100.0;

	STROKE_CHECKED       = document.getElementById("checkstroke").checked;
	CUR_STROKE_COLOR     = document.getElementById("strokecolor").value;
	CUR_STROKE_OPACITY   = document.getElementById("strokeopacity").value/100.0;
	CUR_STROKE_WIDTH     = document.getElementById("strokewidth").value;

}

function ClearEditFields() {
	CUR_OBJECT_EDITING = null;
	
	DOM_EDObjID.value          = "";
	DOM_EDObjName.value        = "";
	DOM_EDObjType.value        = "";
	DOM_EDObjSize.value        = "";
	DOM_EDObjPosX.value        = "";
	DOM_EDObjPosY.value        = "";
	
	DOM_EDVisibility.checked   = false;
	DOM_EDHasLabel.checked     = false;

	DOM_EDobjfillcolor.value   = "#000000";
	DOM_EDfillopacity.value    = 100;

	DOM_EDobjstrokecolor.value = "#000000";
	DOM_EDstrokeopacity.value  = 100;
	DOM_EDObjStrokeWidth.value = 0;

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
    //alert("ok");
    //ShowArray(mainboard.objects);
}

function NewBoard() {
    var el, obj;

	Get_DOM_Globals();
	GetCurrentDrawParams();

    SELECTED_OBJECTS.length=0;
    DOM_OBJECT_SELECTOR.length=0;
	FILE_SELECTOR.selectedIndex=0;
	fileSelectorChanged();

	JXG.Options.text.useMathJax = true;
	JXG.Options.renderer = 'canvas';
    mainboard = JXG.JSXGraph.initBoard('mainbox', {boundingbox: [-10,10,10,-10], axis: true, grid:true, showCopyright:false});   

    for (el in mainboard.objects) {
        obj = mainboard.objects[el];
		obj.setName("RootObj_"+obj.id);
        ROOT_OBJECTS.push(obj);
        if (obj.elType!='point') {
        obj.showElement();
        obj.visible = true;
        obj.setAttribute({"visible":true});
        }
    }   
	ClearEditFields();
	SynchronizeObjects();
    
}

function NewFile() {
    MAINBOARD_STORED_ACTIONS.length=0;
    STORED_STATE_INDEX = -1;
	
    JXG.Options.text.fontSize     = 18;
    JXG.Options.point.size        = 2;
    JXG.Options.point.fillcolor   = "#ff0000";
    JXG.Options.point.strokecolor = "#ff0000";
    
	NewBoard();
}

function RestoreMainboardState(stateindex) {
    var newmainstate;
    var obj, nobj, lastobj=null;
	var N0,N1,N2,N3;
    var objname, remtype, parentids;
	var action, optstr;
    
    if (stateindex > MAINBOARD_STORED_ACTIONS.length - 1)
        return;
    NewBoard();
    
    // Recreate State
    for (var el=0; el<=stateindex; el++) {
		action = MAINBOARD_STORED_ACTIONS[el];

        if (!JXG.exists(action))
            continue;
        
		// Object to be recreated
		obj = action.createdobject;
		if (action.actiontype=="delete") {
			mainboard.removeObject(obj);
			continue;
		}

	    try {
			
		objname = obj.getName();
		remtype = obj.elType;
		//remtype = action.objtype;
		if (remtype=='bezier') {
			parentids = obj.getParents();
			N0 = mainboard.objects[parentids[0]];
			N1 = mainboard.objects[parentids[1]];
			N2 = mainboard.objects[parentids[2]];
			N3 = mainboard.objects[parentids[3]];
			nobj = boardCreateWithoutStore(remtype, [N0,N1,N2,N3], obj.getAttributes());
		}
		else {
			//nobj = boardCreateWithoutStore(remtype, obj.getParents(), obj.getAttributes());
			obj.setParents(action.parents);
			nobj = boardCreateWithoutStore(remtype, obj.getParents(), obj.getAttributes());
		}
        
        if (JXG.exists(nobj)) {
		nobj.elType = remtype;
        optstr = nobj.getName() + " - " + nobj.id;
		DOM_OBJECT_SELECTOR.options[DOM_OBJECT_SELECTOR.options.length] = new Option(optstr, nobj.id);
		lastobj = nobj;
        }
	    
		} // end try
	    catch (err) {alert("Object recreation error for " + obj.id);}
	}

	if (DOM_OBJECT_SELECTOR.options.length==0) {
	    ClearEditFields();
        lastobj = null;
	} else {
	    DisplayObjectToEdit(lastobj);
	}

    try {
	mainboard.updateRenderer();
	} catch (err) {alert("mainboard.updateRenderer 12 " + obj.id);}
    return lastobj;
	
}

function UnDo () {
    if (STORED_STATE_INDEX >= 0) {
        STORED_STATE_INDEX--;
        var lobj = RestoreMainboardState(STORED_STATE_INDEX);
        if (lobj!=null && lobj.getAttribute("visible")==false) {
            UnDo();
        }
    }
}

function ReDo () {
    if (STORED_STATE_INDEX < MAINBOARD_STORED_ACTIONS.length - 1) {
        STORED_STATE_INDEX++;
        var lobj = RestoreMainboardState(STORED_STATE_INDEX);
        if (lobj!=null && lobj.getAttribute("visible")==false) {
            ReDo();
        }
    }
}

function ZoomIn() {
}

function ZoomOut() {
}

function ToggleAxis() {
    var obj;
    for (el in ROOT_OBJECTS) {
        obj = ROOT_OBJECTS[el];

	if (obj.elType=="point")
		continue;
        if (!obj.visible) {
            obj.showElement();
            obj.visible = true;
            obj.setAttribute({"visible":true});
        } else {
            obj.hideElement();
            obj.visible = false;
            obj.setAttribute({"visible":false});
        }
	    
    }
    try {
    mainboard.updateRenderer();
 	} catch (err) {
		alert("ToggleAxis exception caught " + err);
		return null;
	}    
}

function ToggleAbout() {
    var x = document.getElementById('aboutDIV');
    if (x.style.display === 'none') {
        x.style.display = 'block';
    } else {
        x.style.display = 'none';
    }
}

var getMouseCoords = function(e, i) {
    var cPos = mainboard.getCoordsTopLeftCorner(e, i),
        absPos = JXG.getPosition(e, i),
        dx = absPos[0] - cPos[0],
        dy = absPos[1] - cPos[1];

    return new JXG.Coords(JXG.COORDS_BY_SCREEN, [dx, dy], mainboard);
}

function ApplyObjectChanges() {
	var labelobj=null;
    
	CUR_OBJECT_EDITING.setName(DOM_EDObjName.value);

	if (DOM_EDObjType.value == "text") {
		CUR_OBJECT_EDITING.setAttribute({"fontSize":parseInt(DOM_EDObjSize.value)});
	} else
		CUR_OBJECT_EDITING.setAttribute({"size":parseInt(DOM_EDObjSize.value)});
		
    // Use rounded coordinates when editing position
	if (DOM_EDObjType.value == "text" || isLikePoint(CUR_OBJECT_EDITING)) {
	    CUR_OBJECT_EDITING.setPosition(JXG.COORDS_BY_USER,[DOM_EDObjPosX.value*1000/1000,DOM_EDObjPosY.value*1000/1000]);
	}

	if (DOM_EDVisibility.checked) {
	    CUR_OBJECT_EDITING.showElement();
	    CUR_OBJECT_EDITING.setAttribute({"visible":true});
	} else {
	    CUR_OBJECT_EDITING.hideElement();
	    CUR_OBJECT_EDITING.setAttribute({"visible":false});
	}
    
    if (DOM_EDHasLabel.checked) {
        if (!CUR_OBJECT_EDITING.hasLabel) // create label
            CUR_OBJECT_EDITING.setLabel(CUR_OBJECT_EDITING.getName());
        
        if (CUR_OBJECT_EDITING.label === "defined")
            labelobj = findObjectInList(CUR_OBJECT_EDITING.label.id,mainboard.objects);
        if (labelobj != null) {
            labelobj.showElement();
            labelobj.setAttribute({"visible":true});
        }
    } else {
        //alert(CUR_OBJECT_EDITING.label.id);
        if (CUR_OBJECT_EDITING.label === "defined")
            labelobj = findObjectInList(CUR_OBJECT_EDITING.label.id,mainboard.objects);
        if (labelobj != null) {
            labelobj.hideElement();
            labelobj.setAttribute({"visible":false});
        }
    }

	CUR_OBJECT_EDITING.setAttribute({"fillColor":DOM_EDobjfillcolor.value});
	CUR_OBJECT_EDITING.setAttribute({"fillOpacity":DOM_EDfillopacity.value/100.0});

	CUR_OBJECT_EDITING.setAttribute({"strokeColor":DOM_EDobjstrokecolor.value});
	CUR_OBJECT_EDITING.setAttribute({"strokeOpacity":DOM_EDstrokeopacity.value/100.0});
	CUR_OBJECT_EDITING.setAttribute({"strokeWidth":DOM_EDObjStrokeWidth.value});

	UnDraftBoard();
	//StoreMainboardState();
    
	//var attr1str = objToString(CUR_OBJECT_EDITING.visProp);
	//alert(attr1str);


}


