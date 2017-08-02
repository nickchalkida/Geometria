
/*******************************************************************************

    Copyright (C) 2016-2017  Nikolaos L. Kechris
    
    This file is part of Geometria.
    A set of javascript functions dealing mostly with click events

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

function onTDeleteClick() {
    boardDelete();
}

function onTSelectClick() {
    //alert("onTSelectClick");
}

function onTPointClick() {
    //alert("onTPointClick");
}

function onTMidPointClick() {
	var p0, p1, m0;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 2)
        return;
	// Check there are not points
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || !isLikePoint(SELECTED_OBJECTS[slen-2]))
        return UnDraftBoard();

    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

    boardCreate('midpoint',[p0,p1], {size:2});

}

function onTSegmentClick() {
    var p0, p1;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 2)
        return;
	// Check for point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || !isLikePoint(SELECTED_OBJECTS[slen-2]))
        return UnDraftBoard();

    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

    boardCreate('segment', [p0, p1], getDrawAttrs());

}

function onTLineClick() {
    //alert("onTLineClick");
    var p0, p1;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 2)
        return;
	// Check for point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || !isLikePoint(SELECTED_OBJECTS[slen-2]))
        return UnDraftBoard();

    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

    boardCreate('line', [p0, p1], getDrawAttrs());

}

function onTSemiLineClick() {
    //alert("onTLineClick");
    var p0, p1;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 2)
        return;
	// Check for point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || !isLikePoint(SELECTED_OBJECTS[slen-2]))
        return UnDraftBoard();

    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

	var attrs = getDrawAttrs();
	var extattrs = {
	fillColor: attrs.fillColor,
	fillOpacity: attrs.fillOpacity,
	strokeColor: attrs.strokeColor,
	strokeOpacity: attrs.strokeOpacity,
	strokeWidth: attrs.strokeWidth,
	straightFirst: false, 
	straightLast: true	
	};
    boardCreate('line', [p0, p1], extattrs);

}

function onTIntersectionClick() {
	var p0, p1, I0, I1;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 2)
        return;

	// Check there are not points
	if (isLikePoint(SELECTED_OBJECTS[slen-1]) || isLikePoint(SELECTED_OBJECTS[slen-2]))
        return UnDraftBoard();

    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();
	
	I0 = boardCreate('intersection',[p0,p1,0],{size:2});
	I1 = boardCreate('otherintersection',[p0,p1,I0],{size:2});

}

function onTCircleClick() {
    //alert("onTCircleClick");
    var p0, p1;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 2)
        return;
	// Check for point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || !isLikePoint(SELECTED_OBJECTS[slen-2]))
        return UnDraftBoard();

    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

    var obj = boardCreate('circle', [p0, p1], getDrawAttrs());
}

function onTSemicircleClick() {
    //alert("onTSemicircleClick");
    var p0, p1;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 2)
        return;
	// Check for point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || !isLikePoint(SELECTED_OBJECTS[slen-2]))
        return UnDraftBoard();

    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

    boardCreate('semicircle', [p0, p1], getDrawAttrs());
}

function onTAngleBisectorClick() {
    //alert("onTCircle3PointsClick");
	
    var p0, p1, p2;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 3)
        return;

	// Check for point-point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || 
		!isLikePoint(SELECTED_OBJECTS[slen-2]) ||
		!isLikePoint(SELECTED_OBJECTS[slen-3]) )
        return UnDraftBoard();
	
    p2 = SELECTED_OBJECTS.pop();
    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

    boardCreate('bisector', [p0, p1, p2], getDrawAttrs());
}

function onTAngleClick(sectype) {
    //alert("onTAngleClick");
    var p0, p1, p2, p7;
    var p1p0, p1p0seg, p1p0X, p1p0Y;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 3)
        return;

	// Check for point-point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || 
		!isLikePoint(SELECTED_OBJECTS[slen-2]) ||
		!isLikePoint(SELECTED_OBJECTS[slen-3]) )
        return UnDraftBoard();
	
    p2 = SELECTED_OBJECTS.pop();
    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();
 
    if (sectype=="angle") {
        p1p0X = p0.X()-p1.X();
        p1p0Y = p0.Y()-p1.Y();
        p1p0 = Math.sqrt(p1p0X * p1p0X + p1p0Y * p1p0Y);
        p1p0seg = boardCreate('segment', [p0, p1], {visible:false});
        p7 = boardCreate('glider', [p1.X()+p1p0X/p1p0, p1.Y()+p1p0Y/p1p0,p1p0seg],{visible:false, size:2});
        boardCreate('sector', [p1, p7, p2], getDrawAttrs());
    } else {
        boardCreate('sector', [p1, p0, p2], getDrawAttrs());
    }
}

function onTParallelClick() {
    //alert("onTParallelClick");
    var a0, a1, p0, p1;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 2)
        return;

	if (!(
		(isLikePoint(SELECTED_OBJECTS[slen-1]) && isLikeLine (SELECTED_OBJECTS[slen-2])) ||
		(isLikeLine (SELECTED_OBJECTS[slen-1]) && isLikePoint(SELECTED_OBJECTS[slen-2])) ))
		return UnDraftBoard();
		
    a1 = SELECTED_OBJECTS.pop();
    a0 = SELECTED_OBJECTS.pop();
    // Toggle the order if necessary
    if (isLikePoint(a0)) {
        p0 = a0;
        p1 = a1;
    } else {
        p0 = a1;
        p1 = a0;
    }

    boardCreate('parallel', [p0, p1], getDrawAttrs());
}

function onTPerpendicularClick() {
    //alert("onTPerpendicularClick");
    var a0, a1, p0, p1;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 2)
        return;

	if (!(
		(isLikePoint(SELECTED_OBJECTS[slen-1]) && isLikeLine (SELECTED_OBJECTS[slen-2])) ||
		(isLikeLine (SELECTED_OBJECTS[slen-1]) && isLikePoint(SELECTED_OBJECTS[slen-2])) ))
		return UnDraftBoard();
		
    a1 = SELECTED_OBJECTS.pop();
    a0 = SELECTED_OBJECTS.pop();

    // Toggle the order if necessary
    if (isLikePoint(a0)) {
        p0 = a0;
        p1 = a1;
    } else {
        p0 = a1;
        p1 = a0;
    }

    var pp = boardCreate('perpendicularpoint', [p0, p1], getDrawAttrs());
    var li = boardCreate('segment', [p0, pp], getDrawAttrs());
}

function onTCircle3PointsClick() {
    //alert("onTCircle3PointsClick");
    var p0, p1, p2;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 3)
        return;

	// Check for point-point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || 
		!isLikePoint(SELECTED_OBJECTS[slen-2]) ||
		!isLikePoint(SELECTED_OBJECTS[slen-3]) )
        return UnDraftBoard();
	
    p2 = SELECTED_OBJECTS.pop();
    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

    boardCreate('circumcircle', [p0, p1, p2], getDrawAttrs());
}

function onTBezierClick() {
    //alert("onTBezierClick");
    var p0, p1, p2, p3;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 4)
        return;

	// Check for point-point-point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || 
		!isLikePoint(SELECTED_OBJECTS[slen-2]) ||
		!isLikePoint(SELECTED_OBJECTS[slen-3]) ||
		!isLikePoint(SELECTED_OBJECTS[slen-4]) )
        return UnDraftBoard();
	
    p3 = SELECTED_OBJECTS.pop();
    p2 = SELECTED_OBJECTS.pop();
    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

	boardCreate('bezier', [p0, p1, p2, p3], getDrawAttrs());
	
}



function onTConic3PClick(conictype) {
    //alert("onTCircle3PointsClick");
	var obj;
    var p0, p1, p2;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 3)
        return;

	// Check for point-point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || 
		!isLikePoint(SELECTED_OBJECTS[slen-2]) ||
		!isLikePoint(SELECTED_OBJECTS[slen-3]) )
        return UnDraftBoard();
	
    p2 = SELECTED_OBJECTS.pop();
    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

   switch (conictype) {
        case 'Ellipse':
            obj = boardCreate('ellipse', [p0, p1, p2], getDrawAttrs());
            break;
        case 'Hyperbola':
            obj = boardCreate('hyperbola', [p0, p1, p2], getDrawAttrs());
            break;
		default:;
	}

	//var attr1str = objToString(obj.visProp);
	//alert(attr1str);
    
}

    
function onTRectangleClick() {
    var p0, p1, p2, p3;
    var sg, pp, pl, L1, L2, rect;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 2)
        return;

	// Check for point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || !isLikePoint(SELECTED_OBJECTS[slen-2]))
        return UnDraftBoard();

    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();
    
    sg = boardCreate('segment', [p0, p1], {visible:false});
    pp = boardCreate('perpendicularpoint', [sg, p0], {visible:false});
    pl = boardCreate('line', [p0, pp], {visible:false});
    p2 = boardCreate('glider', [p0.X()+1, p0.Y()+1, pl], {size:2});

    L1 = boardCreate('parallel', [p2, sg], {visible:false});
    L2 = boardCreate('parallel', [p1, pl], {visible:false});
    p3 = boardCreate('intersection',[L1,L2,0],{size:2});
    rect = boardCreate('polygon',[p0,p1,p3,p2],getDrawAttrs());

}

function onTConic5PClick() {
    //alert("onTConic5PClick");
    var p0, p1, p2, p3, p4;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 5)
        return;

	// Check for point-point-point-point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || 
		!isLikePoint(SELECTED_OBJECTS[slen-2]) ||
		!isLikePoint(SELECTED_OBJECTS[slen-3]) ||
		!isLikePoint(SELECTED_OBJECTS[slen-4]) ||
		!isLikePoint(SELECTED_OBJECTS[slen-5]) )
        return UnDraftBoard();
	
    p4 = SELECTED_OBJECTS.pop();
    p3 = SELECTED_OBJECTS.pop();
    p2 = SELECTED_OBJECTS.pop();
    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

    boardCreate('conic', [p0, p1, p2, p3, p4], getDrawAttrs());
}


function onTPolygonClick() {
    //alert("onTPolygonClick");
    var p0,v0;
    var found="false", el;
    var V = [];
    
    if (SELECTED_OBJECTS.length < 3)
        return;

    V.length = 0;
    for (el in SELECTED_OBJECTS) {
        p0 = SELECTED_OBJECTS[el];
        if (isLikePoint(p0))
            V.push(p0);
    }
    
    if (V.length < 3)
        return;
        
    v0 = V.pop(); 
    for (el in V) {
        if (v0.id == V[el].id) {
            found = "true";
            break;
        }
    }
    
    if (found=="true") {
        boardCreate('polygon', V, getDrawAttrs());
    }
}

function onTIncircleClick() {
	var p0, p1, p2;
	var slen = SELECTED_OBJECTS.length;
    if (slen < 3)
        return;

	// Check for point-point-point semantics
	if (!isLikePoint(SELECTED_OBJECTS[slen-1]) || 
		!isLikePoint(SELECTED_OBJECTS[slen-2]) ||
		!isLikePoint(SELECTED_OBJECTS[slen-3]) )
        return UnDraftBoard();
	
    p2 = SELECTED_OBJECTS.pop();
    p1 = SELECTED_OBJECTS.pop();
    p0 = SELECTED_OBJECTS.pop();

    boardCreate('incircle', [p0, p1, p2], getDrawAttrs());
}

function onTTextClick(x0,y0,textstr) {
	
	var SPoint = mainboard.create('point',[x0,y0],{name:textstr, size:2});

	var func0str = "return " + SPoint.X + ";";
	var f0 = new Function('', func0str);

	var func1str = "return " + SPoint.Y + ";";
	var f1 = new Function('', func1str);
	
	var FA = [];
	FA.push(f0);
	FA.push(f1);
	FA.push(f0);
	
    var txt = boardCreate('text', FA, getDrawAttrs());
}

function onTImageClick() {
	//alert("onTImageClick");
	var urlImg = "http://jsxgraph.uni-bayreuth.de/distrib/images/uccellino.jpg";
	//var urlImg = "file:\/\/C:\/Users\/nlk\/DEVELOP_HTML\/Geometria\/images\/image.svg";
	var im = mainboard.create('image',[urlImg, [-1,-1], [3,3] ]);

}

function onToolClick(tid) {
    if (CUR_TOOL_ID != "") {
        document.getElementById(CUR_TOOL_ID).className = "toolitem";
    }

    CUR_TOOL_ID = tid;
    document.getElementById(CUR_TOOL_ID).className = "toolitem_selected";

	try {
    switch (CUR_TOOL_ID) {
        case 'TDelete':
            onTDeleteClick();
            break;
        case 'TSelect':
            onTSelectClick();
            break;
        case 'TPoint':
            onTPointClick();
            break;
        case 'TMidPoint':
            onTMidPointClick();
            break;
        case 'TLine':
            onTLineClick();
            break;
        case 'TSemiLine':
            onTSemiLineClick();
            break;
        case 'TIntersection':
            onTIntersectionClick();
            break;
        case 'TAngleBisector':
            onTAngleBisectorClick();
            break;
        case 'TAMark':
            onTAngleClick('angle');
            break;
        case 'TSector':
            onTAngleClick('sector');
            break;
        case 'TParallel':
            onTParallelClick();
            break;
        case 'TPerpendicular':
            onTPerpendicularClick();
            break;
        case 'TSegment':
            onTSegmentClick();
            break;
        case 'TCircle':
            onTCircleClick();
            break;
        case 'TSemicircle':
            onTSemicircleClick();
            break;
        case 'TCircle3Points':
            onTCircle3PointsClick();
            break;
        case 'TBezier':
            onTBezierClick();
            break;
        case 'TEllipse3P':
            onTConic3PClick('Ellipse');
            break;
        case 'THyperbola3P':
            onTConic3PClick('Hyperbola');
            break;
        case 'TRectangle':
            onTRectangleClick();
            break;
        case 'TConic5P':
            onTConic5PClick();
            break;
        case 'TPolygon':
            onTPolygonClick();
            break;
        case 'TIncircle':
            onTIncircleClick();
            break;
        default: ;
        case 'TImage':
            onTImageClick();
            break;
        case 'TText':
            //onTTextClick();
            break;
    } // end select
	} catch (err) {
		alert("Exception caught " + err);
	}

}

function getHittedObject(x,y) {
    var hittonobject = false;
	var hittedobject = null;
    var i, coords, el, hel;
  
    
	near_hitted_objects.length = 0;
    for (el in mainboard.objects) {
        if (mainboard.objects[el].hasPoint(x,y) && mainboard.objects[el].visible) {
			hittonobject = true;
			hittedobject = mainboard.objects[el];
			near_hitted_objects.push(mainboard.objects[el]);
        }
    }
    // If there are many hits take as hitted the first point
    if (hittonobject) {
		hittedobject = near_hitted_objects[0];
        for (hel in near_hitted_objects) {
			//if (JXG.isPoint(near_hitted_objects[hel])) {
			if (isLikePoint(near_hitted_objects[hel])) {
                hittedobject = near_hitted_objects[hel];
				break;
            }
        }
    }
	
	return hittedobject;
}

var onboardmousedown = function(e) {
    var hittonobject = false;
	var hittedobject = null;
    var i, coords, el, hel;
//alert("00");	
	if (e[JXG.touchProperty]) {
        // index of the finger that is used to extract the coordinates
        i = 0;
    }
    coords = getMouseCoords(e, i);


	hittedobject = getHittedObject(coords.scrCoords[1], coords.scrCoords[2]);
	if (hittedobject && hittedobject !== "null" && hittedobject !== "undefined" ){
		hittonobject = true;
		DisplayObjectToEdit(hittedobject);
	}
	if (hittonobject == true && CUR_TOOL_ID != 'TPoint' && CUR_TOOL_ID != 'TText') {
		var obj = hittedobject;
        obj.setAttribute({
            draft: true
        });
        SELECTED_OBJECTS.push(obj);
		onToolClick(CUR_TOOL_ID);
    } else if (hittonobject == true && CUR_TOOL_ID == 'TPoint' && !isLikePoint(hittedobject) && !(hittedobject.elType=='text')) {
        boardCreate('glider', [coords.usrCoords[1], coords.usrCoords[2],hittedobject],{size:2});
    } else if (hittonobject == false && CUR_TOOL_ID == 'TPoint') {
        boardCreate('point', [coords.usrCoords[1], coords.usrCoords[2]],{size:2});
    } else if (hittonobject == false && CUR_TOOL_ID == 'TText') {
        onTTextClick(coords.usrCoords[1], coords.usrCoords[2], document.getElementById("idTextIn").value);
    } else {
        UnDraftBoard();
    }
    return true;
}

var onboardmouseup = function(e) {
	//alert("onboardmouseup");
}

var onobjectmousedown = function(e) {
    alert(obj.elType + " id:" + obj.id + " attrs:" + obj.getAttributes());
    //alert("Great on onobjectmousedown");
}

var onboardrightmouseclick = function(e) {
    var hittonobject = false;
	var hittedobject = null;
    var i, coords, el, hel;

	if (e[JXG.touchProperty]) {
        // index of the finger that is used to extract the coordinates
        i = 0;
    }
    coords = getMouseCoords(e, i);

	hittedobject = getHittedObject(coords.scrCoords[1], coords.scrCoords[2]);
	if (hittedobject && hittedobject !== "null" && hittedobject !== "undefined" ){
		hittonobject = true;
		// alert(hittedobject.id);
	}
	
	if (!hittonobject)
		return;
		
	DisplayObjectToEdit(hittedobject);
	
}





