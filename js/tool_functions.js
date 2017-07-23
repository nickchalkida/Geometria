
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

function ShowMatrix(M) {
	var distr;
	distr="";
	for (var i=0; i<M.length; i++) {
		var row = M[i];
		for (var j=0; j<row.length; j++) {
			distr += row[j];
			distr += "   ";
		}
		distr += "\n";
	}
	alert(distr);
}

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

// Returns the inverse of matrix M.
function matrix_invert(M){
    // I use Guassian Elimination to calculate the inverse:
    // (1) 'augment' the matrix (left) by the identity (on the right)
    // (2) Turn the matrix on the left into the identity by elemetry row ops
    // (3) The matrix on the right is the inverse (was the identity matrix)
    // There are 3 elemtary row ops: (I combine b and c in my code)
    // (a) Swap 2 rows
    // (b) Multiply a row by a scalar
    // (c) Add 2 rows
    
    //if the matrix isn't square: exit (error)
    if(M.length !== M[0].length){return;}
    
    //create the identity matrix (I), and a copy (C) of the original
    var i=0, ii=0, j=0, dim=M.length, e=0, t=0;
    var I = [], C = [];
    for(i=0; i<dim; i+=1){
        // Create the row
        I[I.length]=[];
        C[C.length]=[];
        for(j=0; j<dim; j+=1){
            
            //if we're on the diagonal, put a 1 (for identity)
            if(i==j){ I[i][j] = 1; }
            else{ I[i][j] = 0; }
            
            // Also, make the copy of the original
            C[i][j] = M[i][j];
        }
    }
    
    // Perform elementary row operations
    for(i=0; i<dim; i+=1){
        // get the element e on the diagonal
        e = C[i][i];
        
        // if we have a 0 on the diagonal (we'll need to swap with a lower row)
        if(e==0){
            //look through every row below the i'th row
            for(ii=i+1; ii<dim; ii+=1){
                //if the ii'th row has a non-0 in the i'th col
                if(C[ii][i] != 0){
                    //it would make the diagonal have a non-0 so swap it
                    for(j=0; j<dim; j++){
                        e = C[i][j];       //temp store i'th row
                        C[i][j] = C[ii][j];//replace i'th row by ii'th
                        C[ii][j] = e;      //repace ii'th by temp
                        e = I[i][j];       //temp store i'th row
                        I[i][j] = I[ii][j];//replace i'th row by ii'th
                        I[ii][j] = e;      //repace ii'th by temp
                    }
                    //don't bother checking other rows since we've swapped
                    break;
                }
            }
            //get the new diagonal
            e = C[i][i];
            //if it's still 0, not invertable (error)
            if(e==0){return}
        }
        
        // Scale this row down by e (so we have a 1 on the diagonal)
        for(j=0; j<dim; j++){
            C[i][j] = C[i][j]/e; //apply to original matrix
            I[i][j] = I[i][j]/e; //apply to identity
        }
        
        // Subtract this row (scaled appropriately for each row) from ALL of
        // the other rows so that there will be 0's in this column in the
        // rows above and below this one
        for(ii=0; ii<dim; ii++){
            // Only apply to other rows (we want a 1 on the diagonal)
            if(ii==i){continue;}
            
            // We want to change this element to 0
            e = C[ii][i];
            
            // Subtract (the row above(or below) scaled by e) from (the
            // current row) but start at the i'th column and assume all the
            // stuff left of diagonal is 0 (which it should be if we made this
            // algorithm correctly)
            for(j=0; j<dim; j++){
                C[ii][j] -= e*C[i][j]; //apply to original matrix
                I[ii][j] -= e*I[i][j]; //apply to identity
            }
        }
    }
    
    //we've done all operations, C should be the identity
    //matrix I should be the inverse:
    return I;
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

function objToString (obj) {
    var str = '';
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }
    return str;
}

function RGBColorToTikzColor_CMY(rgbcol) {
	var r0str = rgbcol.substring(1, 3); 
	var g0str = rgbcol.substring(3, 5); 
	var b0str = rgbcol.substring(5, 7);
	
	var r = parseInt(r0str, 16)/255;
	var g = parseInt(g0str, 16)/255;
	var b = parseInt(b0str, 16)/255;
	
	// (cyan, magenta, yellow) := E − (red, green, blue)
	var cyan     = 1 - r;
	var magenta  = 1 - g;
	var yellow   = 1 - b;

	return "{cmy:cyan," + cyan + ";magenta," + magenta + ";yellow," + yellow+"}";
}

function RGBColorToTikzColor_RYB(rgbcol) {

	var r0str = rgbcol.substring(1, 3); 
	var g0str = rgbcol.substring(3, 5); 
	var b0str = rgbcol.substring(5, 7);
	
	var iRed   = parseInt(r0str, 16);
	var iGreen = parseInt(g0str, 16);
	var iBlue  = parseInt(b0str, 16);

	// Remove the white from the color
	var iWhite = Math.min(iRed, iGreen, iBlue);
		
	iRed   -= iWhite;
	iGreen -= iWhite;
	iBlue  -= iWhite;
		
	var iMaxGreen = Math.max(iRed, iGreen, iBlue);
		
	// Get the yellow out of the red+green
	var iYellow = Math.min(iRed, iGreen);
		
	iRed   -= iYellow;
	iGreen -= iYellow;
		
	// If this unfortunate conversion combines blue and green, then cut each in half to
	// preserve the value's maximum range.
	if (iBlue > 0 && iGreen > 0) {
		iBlue  /= 2;
		iGreen /= 2;
	}
		
	// Redistribute the remaining green.
	iYellow += iGreen;
	iBlue   += iGreen;
		
	// Normalize to values.
	var iMaxYellow = Math.max(iRed, iYellow, iBlue);
		
	if (iMaxYellow > 0) {
		var iN = iMaxGreen / iMaxYellow;
			
		iRed    *= iN;
		iYellow *= iN;
		iBlue   *= iN;
	}
		
	// Add the white back in.
	iRed    += iWhite;
	iYellow += iWhite;
	iBlue   += iWhite;
	
	iRed    = Math.floor(iRed);
	iYellow = Math.floor(iYellow);
	iBlue   = Math.floor(iBlue);
		
	return "{rgb:red," + iRed + ";yellow," + iYellow + ";blue," + iBlue + "}";
}

function RGBColorToTikzColor(rgbcol) {
	var r0str = rgbcol.substring(1, 3); 
	var g0str = rgbcol.substring(3, 5); 
	var b0str = rgbcol.substring(5, 7);

	return "{rgb, 255:red,"+parseInt(r0str, 16) + ";green,"+parseInt(g0str, 16)+";blue,"+parseInt(b0str, 16)+"}";
}

// #ff5588 -> {rgb:red,255;green,2;blue,5}
function RGBColorToTikzColor_CMYK(rgbcol) {
	var r0str = rgbcol.substring(1, 3); 
	var g0str = rgbcol.substring(3, 5); 
	var b0str = rgbcol.substring(5, 7);
	
	var r = parseInt(r0str, 16);
	var g = parseInt(g0str, 16);
	var b = parseInt(b0str, 16);

	if (r<0) r=0; if (g<0) g=0; if (b<0) b=0;
	if (r>255) r=255; if (g>255) g=255; if (b>255) b=255;

	var computedC = 0;
	var computedM = 0;
	var computedY = 0;
	var computedK = 0;

	// BLACK
	if (r==0 && g==0 && b==0) {
		computedK = 1;
		//return [0,0,0,1];
		//cmyk:cyan,-250;magenta,-250;yellow,-150;black,-150
		return "{cmyk:cyan,0;magenta,0;yellow,0;black,1}";
	}

	computedC = 1 - (r/255);
	computedM = 1 - (g/255);
	computedY = 1 - (b/255);

	var minCMY = Math.min(computedC, Math.min(computedM, computedY));
	computedC = (computedC - minCMY) / (1 - minCMY) ;
	computedM = (computedM - minCMY) / (1 - minCMY) ;
	computedY = (computedY - minCMY) / (1 - minCMY) ;
	computedK = minCMY;
	
	// cmyk:cyan,-250;magenta,-250;yellow,-150;black,-150
	return "{cmyk:cyan," + computedC + ";magenta," + computedM + ";yellow," + computedY + ";black," + computedK + "}";

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
	var obj, objname, lastobj;

    DOM_OBJECT_SELECTOR.options.length = 0;
    for (el in mainboard.objects) {
		obj = mainboard.objects[el];
		objname = obj.getName();
		if (objname.substring(0,8)!="RootObj_" && !obj.id.endsWith("Label")) {
		DOM_OBJECT_SELECTOR.options[DOM_OBJECT_SELECTOR.options.length] = new Option(obj.id);
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
    var obj, bez1;

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
	}
	obj.elType=eltyp;
	} catch (err) {
		alert("boardCreate exception caught " + err);
		return null;
	}
    return obj;
}


function boardCreate(eltyp, par, attrs) {
    var obj;
	
	obj = boardCreateWithoutStore(eltyp, par, attrs);
	StoreMainboardState();
    SynchronizeObjects();
    UnDraftBoard();
        
    return obj;
}

function boardDelete() {
	var obj;
	
	if (SELECTED_OBJECTS.length < 1)
		return;
	obj = SELECTED_OBJECTS.pop();
	mainboard.removeObject(obj);
	StoreMainboardState();
	
	SynchronizeObjects();
	mainboard.updateRenderer();
	
}

function UnDraftBoard() {
	for (el in mainboard.objects) {
        var obj = mainboard.objects[el];
        mainboard.update(obj);
        obj.setAttribute({
            draft: false
        });
    }
	mainboard.updateRenderer();
    SELECTED_OBJECTS = [];
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

function fileSelectorChanged() {
	SAVE_FILE_TYPE = FILE_SELECTOR.options[FILE_SELECTOR.selectedIndex].value;
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
	
	CUR_OBJECT_EDITING = disobj;
	
	DOM_EDObjID.value          = disobj.id;
	DOM_EDObjName.value        = disobj.getName();
	DOM_EDObjType.value        = disobj.getType();
	
	DOM_OBJECT_SELECTOR.selectedIndex = findIndexInSelections(disobj.id);
	
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

    DOM_OBJECT_SELECTOR = document.getElementById('objSelector');
	FILE_SELECTOR = document.getElementById('fileSelector');

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

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || '';
  sliceSize = sliceSize || 512;

  var byteCharacters = atob(b64Data);
  var byteArrays = [];

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }
    
  var blob = new Blob(byteArrays, {type: contentType});
  return blob;
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
    //JXG.FileReader.parseFileContent('http://jsxgraph.uni-bayreuth.de/geonext/point.ggb', mainboard, 'GeoGebra', false);

    //mainboard = JXG.JSXGraph.initBoard("mainbox", {boundingbox: [-10,10,10,-10], axis: true, grid:true, showCopyright:false});  
    //mainboard.suspendUpdate();   
    //var b = JXG.JSXGraph.loadBoardFromFile("mainbox", "test.ggb", "Geogebra");
    //mainboard.unsuspendUpdate();
    //alert("CREATED LEN:"+CREATED_OBJECTS.length + " UNDO CREATED LEN:"+ UNDO_CREATED_OBJECTS.length);
    //alert("DELETED LEN:"+DELETED_OBJECTS.length + " UNDO DELETED LEN:"+ UNDO_DELETED_OBJECTS.length);
    //alert("ACTIONS LEN:"+DID_ACTIONS.length + " UNDO ACTIONS LEN:"+ UNDO_ACTIONS.length);
    //alert("SELECTED LEN:"+SELECTED_OBJECTS.length);
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
        }
    }   
	ClearEditFields();
	SynchronizeObjects();
    
}

function NewFile() {
    MAINBOARD_STORED_STATES.length=0;
    STORED_STATE_INDEX = -1;
	//FILE_SELECTOR.selectedIndex=0;
	NewBoard();
}

function StoreMainboardState() {
    var obj;
    var mainstate = [];
    // Before storing clean MAINBOARD_STORED_STATES
    // above STORED_STATE_INDEX
    while (MAINBOARD_STORED_STATES.length > STORED_STATE_INDEX+1) {
        MAINBOARD_STORED_STATES.pop();
    }
 	STORED_STATE_INDEX++;
 
    mainstate.length = 0;
    //for (el in mainboard.objects) {
    for (el in mainboard.objectsList) {
		obj = mainboard.objectsList[el];
		mainstate.push(obj);
	}

	MAINBOARD_STORED_STATES.push(mainstate);
    STORED_STATE_INDEX = MAINBOARD_STORED_STATES.length - 1;
}

function RestoreMainboardState(stateindex) {
    var newmainstate;
    var obj, nobj, lastobj;
	var N0,N1,N2,N3;
    var objname, remtype, parentids;
    
    if (stateindex > MAINBOARD_STORED_STATES.length - 1)
        return;
    newmainstate = MAINBOARD_STORED_STATES[stateindex];
    NewBoard();
    
    // Recreate State
    for (el in newmainstate) {
		obj = newmainstate[el];
	    try {
		objname = obj.getName();
		if (objname.substring(0,8)!="RootObj_" && !obj.id.endsWith("Label")) {

		remtype = obj.elType;
		if (remtype=='bezier') {
			parentids = obj.getParents();
			N0 = mainboard.objects[parentids[0]];
			N1 = mainboard.objects[parentids[1]];
			N2 = mainboard.objects[parentids[2]];
			N3 = mainboard.objects[parentids[3]];
			nobj = boardCreateWithoutStore(remtype, [N0,N1,N2,N3], obj.getAttributes());
		}
		else {
			nobj = boardCreateWithoutStore(remtype, obj.getParents(), obj.getAttributes());
		}
		nobj.elType = remtype;
		DOM_OBJECT_SELECTOR.options[DOM_OBJECT_SELECTOR.options.length] = new Option(nobj.id);
		lastobj = nobj;
	    
		} // end try
	    } catch (err) {alert("Object recreation error for " + obj.id)}
	}

	if (DOM_OBJECT_SELECTOR.options.length==0) {
	    ClearEditFields();
	} else {
	    DisplayObjectToEdit(lastobj);
	}

	mainboard.updateRenderer();
	
}

function UnDo () {
    if (STORED_STATE_INDEX >= 0) {
        STORED_STATE_INDEX--;
        RestoreMainboardState(STORED_STATE_INDEX);
    }
}

function ReDo () {
    if (STORED_STATE_INDEX < MAINBOARD_STORED_STATES.length - 1) {
        STORED_STATE_INDEX++;
        RestoreMainboardState(STORED_STATE_INDEX);
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
	StoreMainboardState();

}


