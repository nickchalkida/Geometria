/*******************************************************************************

    Copyright (C) 2016-2017  Nikolaos L. Kechris
    
    This file is part of Geometria.
    A set of javascript functions dealing mostly with save output to files

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

function trCoords(num) {
	return num*768/20.0;
}

function trPoint(P0) {
  return {
    x: 768/2 + P0.X()*768/20.0,
    y: 768/2 - P0.Y()*768/20.0
  };
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, aradius, startAngle, endAngle){

    var start = polarToCartesian(x, y, aradius, endAngle);
    var end = polarToCartesian(x, y, aradius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

	alert(startAngle);
	alert(endAngle);

	//alert("start=("+start.x+","+start.y+")");
	//alert("end=("+end.x+","+end.y+")");
	

    //var d = [
    //    "M", start.x, start.y, 
    //    "A", aradius, aradius, 0, largeArcFlag, 0, end.x, end.y
    //].join(" ");

	var pathattrs = {
	startx: start.x,
	starty: start.y,
	radius: aradius,
	arcflag: largeArcFlag,
	endx: end.x,
	endy: end.y
	};

    return pathattrs;       
}

function SaveToGO() {
	
	var b = JXG.JSXGraph.loadBoardFromFile('mainbox', 'test.ggb', 'Geogebra');
	mainboard.updateRenderer();
	alert("1");
	return;
	
	//var svg = new XMLSerializer().serializeToString(mainboard.renderer.svgRoot);
	//var png = mainboard.renderer.canvasRoot.toDataURL();
	var b64Data = mainboard.renderer.canvasRoot.toDataURL();
	alert(b64Data);
	
	return;
	//var file = b64toBlob(b64Data, 'image/png');
	//var file = new Blob([b64Data], {type:'image/png'});
	
	
	var dlbtn = document.getElementById("dlbtn");
	dlbtn.href = URL.createObjectURL(file);
	dlbtn.download = "GeometriaSvg.txt";
}

function RemoveDSign(instr) {

    var retstr = instr.replace('$','');
    retstr = retstr.split();
    return retstr;
}

// P0, P1 two mainboard Points
function IntersectionBoundingRectancle(P0, P1) {
	var BI;
	var bound = 8;
	var mfactor = 100;
	var ddx, ddy;
	
	// Initialize movable point with P1
	var MP = {X:P1.X(),Y:P1.Y()};
	
	var DPX = P1.X() - P0.X();
	var DPY = P1.Y() - P0.Y();

	// Compute trivial cases
	if (DPX==0) { // P0P1 parallel with YY
		if (DPY > 0) {
			MP.Y =  bound;
		} else {
			MP.Y = -bound;
		}
	} else if (DPY==0) { // P0P1 parallel with XX
		if (DPX > 0) {
			MP.X =  bound;
		} else {
			MP.X = -bound;
		}
	} else if (DPX*DPX > DPY*DPY) { //Move MP's x projection
		ddx = DPX / mfactor;
		ddy = ddx * (DPY / DPX);
		do {
			MP.X += ddx; MP.Y += ddy;
		} while (MP.X<bound && MP.X>-bound && MP.Y<bound && MP.Y>-bound);
	} else { //Move MP's y projection
		ddy = DPY / mfactor;
		ddx = ddy * (DPX / DPY);
		do {
			MP.X += ddx; MP.Y += ddy;
		} while (MP.X<bound && MP.X>-bound && MP.Y<bound && MP.Y>-bound);
	}
	BI = boardCreate('point', [MP.X, MP.Y],{size:2});
	return BI;
}

////////////////////////////////////////////////////////////////////////////////


function GetSVGSaveElements() {
    var el, obj;
    var commandstr, svgstr, pathstr;
	var parentids, objattrs, objvisible;
	var P0, P1, P2, P3, P4;
	var eltype;
	var centerX, centerY, radius, centerXD;
	var ocx=768/2, ocy=768/2; 
	var neocx, neocy;
	
	
	svgstr = "";
	for (el in mainboard.objects) {
		obj = mainboard.objects[el];
		objname = obj.getName(); objvisible = obj.getAttribute("visible");
		//if (objname.substring(0,8)!="RootObj_" && !obj.id.endsWith("Label")) {
		if (objname.substring(0,8)=="RootObj_" || obj.id.endsWith("Label") || !objvisible) 
			continue;

		commandstr = "";
		var eltype = obj.getType();	
		
		switch (eltype) {
		case "point" : 
		case "midpoint" : 
		case "perpendicularpoint" : 
		case "intersection" : 
		case "glider" : 
		case "otherintersection" : 
			//"<circle cx=\"100\" cy=\"50\" r=\"40\" stroke=\"black\" stroke-width=\"2\" fill=\"red\"/>\r\n";
			
			//alert("("+obj.X()+"," +obj.Y()+")");
			neocx = ocx + trCoords(obj.X());
			neocy = ocy - trCoords(obj.Y());
			//alert("("+neocx+"," +neocy+")");
			
			
			commandstr  = "<circle cx=\"" + neocx + "\" ";
			commandstr += " cy=\"" + neocy + "\" ";
			commandstr += " r=\"" + obj.getAttribute("size") + "\" ";
			if (obj.getAttribute("fillOpacity")!=0) {
			commandstr += " fill=\"" + obj.getAttribute("fillColor") + "\" ";
			commandstr += " fill-opacity=\"" + obj.getAttribute("fillOpacity") + "\" ";
			}
			commandstr += " stroke=\"" + obj.getAttribute("strokeColor") + "\" ";
			commandstr += " stroke-opacity=\"" + obj.getAttribute("strokeOpacity") + "\" ";
			commandstr += " stroke-width=\"" + obj.getAttribute("strokeWidth") + "\" />\r\n";
			svgstr += commandstr;
			
			//alert(commandstr);
		break;

		case "circle" :
		case "incircle" :
		case "circumcircle" :
	        //commandstr  = "\\draw[";
	        //commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        //commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			//if (obj.getAttribute("fillOpacity")!=0) {
	        //commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        //commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			//}
	        //commandstr += "] (" + obj.center.X() + "," + obj.center.Y() + ") circle (" + obj.getRadius() + "cm);\r\n";
			//svgstr += commandstr;

			//neocx = ocx + obj.center.X()*100;
			//neocy = ocy + obj.center.Y()*100;
			neocx = ocx + trCoords(obj.center.X());
			neocy = ocy - trCoords(obj.center.Y());

			commandstr  = "<circle cx=\"" + neocx + "\" ";
			commandstr += " cy=\"" + neocy + "\" ";
			commandstr += " r=\"" + trCoords(obj.getRadius()) + "\" ";
			if (obj.getAttribute("fillOpacity")!=0) {
			commandstr += " fill=\"" + obj.getAttribute("fillColor") + "\" ";
			commandstr += " fill-opacity=\"" + obj.getAttribute("fillOpacity") + "\" ";
			}
			commandstr += " stroke=\"" + obj.getAttribute("strokeColor") + "\" ";
			commandstr += " stroke-opacity=\"" + obj.getAttribute("strokeOpacity") + "\" ";
			commandstr += " stroke-width=\"" + obj.getAttribute("strokeWidth") + "\" />\r\n";
			svgstr += commandstr;
			//alert(commandstr);

		break;
		case "sector" :

			parentids = obj.getParents();

			P0 = mainboard.objects[parentids[0]];
			P1 = mainboard.objects[parentids[1]];
			P2 = mainboard.objects[parentids[2]];

			// P0 is korifi
			objattrs = getSectorAttrsFromPoints(P1,P0,P2);
			//alert(objattrs.arotation);
			//alert(objattrs.brotation);

			//commandstr  = "\\draw[";
	        //commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        //commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			
			//if (obj.getAttribute("fillOpacity")!=0) {
	        //commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        //commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			//}

			// (0,0) -- (3.5,0)  arc (0:40:3.5cm) -- cycle ;
			//commandstr += "] (" + P0.X() + "," + P0.Y() + ") -- ("  + P1.X() + "," + P1.Y() + ") --";
	        //commandstr += " ++(0,0) arc (" + objattrs.arotation + ":" + objattrs.brotation + ":" + obj.Radius() + "cm) -- cycle;\r\n";
			
			//svgstr += commandstr;
			

			var PP0 = trPoint(P0);
			var PP1 = trPoint(P1);
			var sa = describeArc(PP0.x,PP0.y,trCoords(obj.Radius()),objattrs.klisia,objattrs.klisib);
			//var d = [
			//    "M", start.x, start.y, 
			//    "A", aradius, aradius, 0, largeArcFlag, 0, end.x, end.y
			//].join(" ");

			commandstr  = "<path d=\"";
			// Add path components
			pathstr = " M " + PP0.x + " " + PP0.y + "L " + PP1.x + " " + PP1.y 
					+ " A " + sa.radius + " " + sa.radius + " 0 " + sa.arcflag + " 0 " + sa.endx + " " +sa.endy + " " + " Z";
			commandstr += pathstr;
			commandstr += "\" "; // end path

			if (obj.getAttribute("fillOpacity")!=0) {
			commandstr += " fill=\"" + obj.getAttribute("fillColor") + "\" ";
			commandstr += " fill-opacity=\"" + obj.getAttribute("fillOpacity") + "\" ";
			}
			commandstr += " stroke=\"" + obj.getAttribute("strokeColor") + "\" ";
			commandstr += " stroke-opacity=\"" + obj.getAttribute("strokeOpacity") + "\" ";
			commandstr += " stroke-width=\"" + obj.getAttribute("strokeWidth") + "\" />\r\n";
			svgstr += commandstr;

//alert(commandstr);

			break;
		case "ellipse" :
		    // commandstr = "\\draw[line width=0.5mm, draw=black, fill={rgb:red,1;green,2;blue,5}, fill opacity=0.2] (0,0) ellipse (6pt and 3pt);\n";
	        parentids = obj.getParents();

			P0 = mainboard.objects[parentids[0]];
			P1 = mainboard.objects[parentids[1]];
			P2 = mainboard.objects[parentids[2]];
			
			objattrs = getEllipseAttrsFromFoci(P0,P1,P2);
			
			//commandstr  = "\\draw[";
	        //commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        //commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			// rotate around={45:(5,5)}
			//commandstr += "rotate around={" + objattrs.rotation+":(" + objattrs.CenterX + "," + objattrs.CenterY + ")}, ";
			//if (obj.getAttribute("fillOpacity")!=0) {
	        //commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        //commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			//}
	        //commandstr += "] (" + objattrs.CenterX + "," + objattrs.CenterY + ") ellipse (" + objattrs.AxisA/2 + "cm and " + objattrs.AxisB/2 + "cm);\r\n";
			//svgstr += commandstr;
			
			
			neocx = ocx + trCoords(objattrs.CenterX);
			neocy = ocy - trCoords(objattrs.CenterY);

			commandstr  = "<ellipse cx=\"" + neocx + "\" ";
			commandstr += " cy=\"" + neocy + "\" ";
			commandstr += " rx=\"" + trCoords(objattrs.AxisA/2) + "\" ";
			commandstr += " ry=\"" + trCoords(objattrs.AxisB/2) + "\" ";

			if (obj.getAttribute("fillOpacity")!=0) {
			commandstr += " fill=\"" + obj.getAttribute("fillColor") + "\" ";
			commandstr += " fill-opacity=\"" + obj.getAttribute("fillOpacity") + "\" ";
			}
			commandstr += " stroke=\"" + obj.getAttribute("strokeColor") + "\" ";
			commandstr += " stroke-opacity=\"" + obj.getAttribute("strokeOpacity") + "\" ";
			commandstr += " stroke-width=\"" + obj.getAttribute("strokeWidth") + "\" />\r\n";
			svgstr += commandstr;
			
			
		break;
		case "semicircle" :
	        parentids = obj.getParents();
			P0 = mainboard.objects[parentids[0]];
			P1 = mainboard.objects[parentids[1]];
			// \draw (0,0) arc (0:180:1cm);

			radius   = Math.sqrt((P0.X() - P1.X())*(P0.X() - P1.X()) + (P0.Y() - P1.Y())*(P0.Y() - P1.Y())) / 2;
			centerX  = (P0.X() + P1.X()) / 2;
			centerY  = (P0.Y() + P1.Y()) / 2;
			centerXD = radius + (P0.X() + P1.X()) / 2;

			commandstr  = "\\draw[";
	        commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			// rotate around={45:(5,5)}
			var sign;
			
			var klisi = (P1.Y() - P0.Y()) / (P1.X() - P0.X());
			if        ((P1.X()>=P0.X()) && (P1.Y()>=P0.Y())) {
			    sign = "";
			} else if ((P1.X()< P0.X()) && (P1.Y()>=P0.Y())) {
			    sign = "-";
			} else if ((P1.X()>=P0.X()) && (P1.Y() <P0.Y())) {
			    sign = "";
			} else if ((P1.X()< P0.X()) && (P1.Y() <P0.Y())) {
			    sign = "-";
			}
			
	        var rotation = Math.atan( klisi ) * (180 / Math.PI);
			
			commandstr += "rotate around={" + rotation + ":(" + centerX + "," + centerY + ")}, ";
			if (obj.getAttribute("fillOpacity")!=0) {
	        commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			}
	        commandstr += "] (" + centerXD + "," + centerY + ") arc (0:"+sign+"180:" + radius + "cm);\r\n";
			//svgstr += commandstr;

			// correct side effect
			obj.midpoint.hideElement()
			obj.midpoint.visible = false;
			
		break;
		case "polygon" :
	        parentids = obj.getParents();
			pathstr="";
			for (var i=0; i<parentids.length; i++) {
				P0 = mainboard.objects[parentids[i]];
				pathstr += "(" + P0.X() + "," + P0.Y() + ") -- ";
			}
			P0 = mainboard.objects[parentids[0]];
			pathstr += "(" + P0.X() + "," + P0.Y() + ")";
			//alert(pathstr);

			commandstr  = "\\draw[";
	        commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			if (obj.getAttribute("fillOpacity")!=0) {
	        commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			}
	        commandstr += "] ";
			commandstr += pathstr + ";\r\n";
			
			svgstr += commandstr;
			
		break;
		case "bezier" :
	        parentids = obj.getParents();
			P0 = mainboard.objects[parentids[0]];
			P1 = mainboard.objects[parentids[1]];
			P2 = mainboard.objects[parentids[2]];
			P3 = mainboard.objects[parentids[3]];
			// (0,0) .. controls (1,1) and (2,-1) .. (3,0)
			pathstr  = "(" + P0.X() + "," + P0.Y() + ") .. controls ";
			pathstr += "(" + P1.X() + "," + P1.Y() + ") and ";
			pathstr += "(" + P2.X() + "," + P2.Y() + ") .. ";
			pathstr += "(" + P3.X() + "," + P3.Y() + ") ";

			commandstr  = "\\draw[";
	        commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			if (obj.getAttribute("fillOpacity")!=0) {
	        commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			}
	        commandstr += "] ";
			commandstr += pathstr + ";\r\n";
			
			//svgstr += commandstr;
		break;
		default:;
		} // end switch
    }  // end for 

    return svgstr;
}

function Save_SVG() {   	
	
    //<?xml version="1.0" standalone="no"?>
    //<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" 
    //"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    //<svg width="100%" height="100%" version="1.1" xmlns="http://www.w3.org/2000/svg">
    //<circle cx="100" cy="50" r="40" stroke="black" stroke-width="2" fill="red"/>
    //</svg>

	var svgstr = "<?xml version=\"1.0\" standalone=\"no\"\?>\r\n";
	svgstr += "<!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\"\r\n";
	svgstr += "\"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\">\r\n";
	svgstr += "<svg width=\"768\" height=\"768\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\">\r\n";

	svgstr += GetSVGSaveElements();
	
	svgstr += "</svg>\r\n";
	
	var file = new Blob([svgstr], {type:'text/plain'});


	var dlbtn = document.getElementById("dlbtn");
	dlbtn.href = URL.createObjectURL(file);
	dlbtn.download = "GeometriaSVG.svg";
}


////////////////////////////////////////////////////////////////////////////////


function GetSaveTikzDrawPoints() {
    var el, obj;
    var commandstr, tikzstr;
	var eltype, objvisible;
	
	tikzstr = "";
	for (el in mainboard.objects) {
		obj = mainboard.objects[el];
		objname = obj.getName(); objvisible = obj.getAttribute("visible");
		//if (objname.substring(0,8)!="RootObj_" && !obj.id.endsWith("Label")) {
		if (objname.substring(0,8)=="RootObj_" || obj.id.endsWith("Label") || !objvisible) 
			continue;
		
		commandstr = "";
		var eltype = obj.getType();	
		
		switch (eltype) {
		case "point" : 
		case "midpoint" : 
		case "perpendicularpoint" : 
		case "intersection" : 
		case "glider" : 
		case "otherintersection" : 
		    // commandstr = "\\draw[line width=0.5mm, draw=black, fill={rgb:red,1;green,2;blue,5}, fill opacity=0.2] (0,0) circle (.5ex);\n";
	        commandstr  = "\\draw[";
	        commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
	        commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) + ", ";
	        commandstr += "fill opacity="+obj.getAttribute("fillOpacity")+"] ";
	        commandstr += "(" + obj.X() + "," + obj.Y() + ") circle (" + obj.getAttribute("size")*0.75 + "pt);\r\n";
			tikzstr += commandstr;

            // \node [label={[xshift=15pt, yshift=2pt] {a^2 \cdot b^2 \cdot c^2 } \end pgf } ] at (-4.4,3.7) {};
			//commandstr = "\\node [label={[xshift=5pt, yshift=2pt] {" + objname + "} \\end pgf}] " + " at (" + obj.X() + "," + obj.Y() + "){};\r\n";
			commandstr = "\\node [label={right:{" + RemoveDSign(objname) + "} \\end pgf}] " + " at (" + obj.X() + "," + obj.Y() + "){};\r\n";
			tikzstr += commandstr;
		break;
		default:;
		} // end switch
		
    }  // end for 
	return tikzstr;

}


// P0, P1 two mainboard Points, obj the line object
function GetTikzDrawLineString(obj, P0, P1) {
	// commandstr = "\\draw[line width=0.5mm, draw=black, fill={rgb:red,1;green,2;blue,5}, fill opacity=0.2] (0,0) -- (4,0);\n";
	var commandstr  = "\\draw[";
	commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
	if (obj.getAttribute("fillOpacity")!=0) {
	    commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) + ", ";
	    commandstr += "fill opacity="+obj.getAttribute("fillOpacity")+"] ";
	}
	commandstr += "(" + P0.X() + "," + P0.Y() + ") -- (" + P1.X() + "," + P1.Y() + ");\r\n";
	return commandstr;
}

function GetSaveTikzDrawLines() {
    var el, obj;
    var commandstr, tikzstr;
	var parentids, objattrs, objvisible;
	var P0, P1, P2, P3, P4;
	var eltype;
	var sfirst, slast;
	
	tikzstr = "";
	for (el in mainboard.objects) {
		obj = mainboard.objects[el];
		objname = obj.getName(); objvisible = obj.getAttribute("visible");
		if (objname.substring(0,8)=="RootObj_" || obj.id.endsWith("Label") || !objvisible) 
			continue;
		
		commandstr = "";
		var eltype = obj.getType();	
		
		switch (eltype) {
		case "segment" : 
		case "line" : 
		case "bisector" : 
		case "perpendicular" : 
		case "parallel" : 
		
	        parentids = obj.getParents();
	        sfirst = obj.getAttribute("straightFirst");
	        slast  = obj.getAttribute("straightLast");
	        if (eltype == "parallel") {
	            sfirst = true; slast = true;
	        }

            if (eltype == "segment" || eltype == "line") {
			    P0 = mainboard.objects[parentids[0]];
			    P1 = mainboard.objects[parentids[1]];
            } else if (eltype == "bisector" || eltype == "perpendicular") {
			    P0 = mainboard.objects[parentids[1]];
			    P1 = mainboard.objects[obj.point.id];
            } else if (eltype == "parallel") {
			    P0 = mainboard.objects[parentids[0]];
			    P2 = mainboard.objects[obj.point.id];
			    P1 = boardCreate('point', [P0.X()+P2.X(), P0.Y()+P2.Y()],{size:2});
            }
	        
	        // if (straightFirst) {
	        //    compute intersection LF with bounding rectangle
	        //    and draw FI }
			if (sfirst) {
				BI = IntersectionBoundingRectancle(P1,P0);
				// Should draw line P0BI
				tikzstr += GetTikzDrawLineString(obj, P0, BI);
				mainboard.removeObject(BI);
			}
	        
	        // if (straightLast) {
	        //    compute intersection FL with bounding rectangle
	        //    and draw LI }
			if (slast) {
				BI = IntersectionBoundingRectancle(P0,P1);
				// Should draw line P1BI
				tikzstr += GetTikzDrawLineString(obj, P1, BI);
				mainboard.removeObject(BI);
			}		

			tikzstr += GetTikzDrawLineString(obj, P0, P1);
			if (eltype == "parallel") {
			    mainboard.removeObject(P1);
			    P2.hideElement();
                P2.visible = false;
			} else if (eltype == "bisector") {
			    P1.hideElement();
                P1.visible = false;
			}

		break;

		default:;
		} // end switch
		
    }  // end for 
	return tikzstr;

}

function GetSaveTikzDrawText() {
    var el, obj;
    var commandstr, tikzstr, line;
	var parentids, objattrs, objvisible;
	var P0, P1, P2, P3, P4;
	var eltype;
	
	tikzstr = "";
	for (el in mainboard.objects) {
		obj = mainboard.objects[el];
		objname = obj.getName(); objvisible = obj.getAttribute("visible");
		//if (objname.substring(0,8)!="RootObj_" && !obj.id.endsWith("Label")) {
		if (objname.substring(0,8)=="RootObj_" || !objvisible) 
			continue;
		
		commandstr = "";
		eltype = obj.getType();	
		switch (eltype) {
		case "text" :
		// Not correct
			commandstr += "\\node [label={left:" + objname + "}] " + " at (" + obj.X() + "," + obj.Y() + "){};\r\n";
			tikzstr += commandstr;
		break;
		default:;
		} // end switch
    }  // end for 
	return tikzstr;
}

function GetSaveDrawTikzShapes() {
    var el, obj;
    var commandstr, tikzstr, pathstr;
	var parentids, objattrs, objvisible;
	var P0, P1, P2, P3, P4;
	var eltype;
	var centerX, centerY, radius, centerXD;
	
	tikzstr = "";
	for (el in mainboard.objects) {
		obj = mainboard.objects[el];
		objname = obj.getName(); objvisible = obj.getAttribute("visible");
		//if (objname.substring(0,8)!="RootObj_" && !obj.id.endsWith("Label")) {
		if (objname.substring(0,8)=="RootObj_" || obj.id.endsWith("Label") || !objvisible) 
			continue;

		commandstr = "";
		var eltype = obj.getType();	
		
		switch (eltype) {
		case "circle" :
		case "incircle" :
		case "circumcircle" :
	        commandstr  = "\\draw[";
	        commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			if (obj.getAttribute("fillOpacity")!=0) {
	        commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			}
	        commandstr += "] (" + obj.center.X() + "," + obj.center.Y() + ") circle (" + obj.getRadius() + "cm);\r\n";
			tikzstr += commandstr;
		break;
		case "sector" :
	        parentids = obj.getParents();

			P0 = mainboard.objects[parentids[0]];
			P1 = mainboard.objects[parentids[1]];
			P2 = mainboard.objects[parentids[2]];

			// P0 is korifi
			objattrs = getSectorAttrsFromPoints(P1,P0,P2);

			commandstr  = "\\draw[";
	        commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			
			if (obj.getAttribute("fillOpacity")!=0) {
	        commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			}

			// (0,0) -- (3.5,0)  arc (0:40:3.5cm) -- cycle ;
			commandstr += "] (" + P0.X() + "," + P0.Y() + ") -- ("  + P1.X() + "," + P1.Y() + ") --";
	        commandstr += " ++(0,0) arc (" + objattrs.arotation + ":" + objattrs.brotation + ":" + obj.Radius() + "cm) -- cycle;\r\n";
			
			tikzstr += commandstr;
		break;
		case "ellipse" :
		    // commandstr = "\\draw[line width=0.5mm, draw=black, fill={rgb:red,1;green,2;blue,5}, fill opacity=0.2] (0,0) ellipse (6pt and 3pt);\n";
	        parentids = obj.getParents();

			P0 = mainboard.objects[parentids[0]];
			P1 = mainboard.objects[parentids[1]];
			P2 = mainboard.objects[parentids[2]];
			
			objattrs = getEllipseAttrsFromFoci(P0,P1,P2);
			
			commandstr  = "\\draw[";
	        commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			// rotate around={45:(5,5)}
			commandstr += "rotate around={" + objattrs.rotation+":(" + objattrs.CenterX + "," + objattrs.CenterY + ")}, ";
			if (obj.getAttribute("fillOpacity")!=0) {
	        commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			}
	        commandstr += "] (" + objattrs.CenterX + "," + objattrs.CenterY + ") ellipse (" + objattrs.AxisA/2 + "cm and " + objattrs.AxisB/2 + "cm);\r\n";
			tikzstr += commandstr;
		break;
		case "semicircle" :
	        parentids = obj.getParents();
			P0 = mainboard.objects[parentids[0]];
			P1 = mainboard.objects[parentids[1]];
			// \draw (0,0) arc (0:180:1cm);

			radius   = Math.sqrt((P0.X() - P1.X())*(P0.X() - P1.X()) + (P0.Y() - P1.Y())*(P0.Y() - P1.Y())) / 2;
			centerX  = (P0.X() + P1.X()) / 2;
			centerY  = (P0.Y() + P1.Y()) / 2;
			centerXD = radius + (P0.X() + P1.X()) / 2;

			commandstr  = "\\draw[";
	        commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			// rotate around={45:(5,5)}
			var sign;
			
			var klisi = (P1.Y() - P0.Y()) / (P1.X() - P0.X());
			if        ((P1.X()>=P0.X()) && (P1.Y()>=P0.Y())) {
			    sign = "";
			} else if ((P1.X()< P0.X()) && (P1.Y()>=P0.Y())) {
			    sign = "-";
			} else if ((P1.X()>=P0.X()) && (P1.Y() <P0.Y())) {
			    sign = "";
			} else if ((P1.X()< P0.X()) && (P1.Y() <P0.Y())) {
			    sign = "-";
			}
			
	        var rotation = Math.atan( klisi ) * (180 / Math.PI);
			
			commandstr += "rotate around={" + rotation + ":(" + centerX + "," + centerY + ")}, ";
			if (obj.getAttribute("fillOpacity")!=0) {
	        commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			}
	        commandstr += "] (" + centerXD + "," + centerY + ") arc (0:"+sign+"180:" + radius + "cm);\r\n";
			tikzstr += commandstr;

			// correct side effect
			obj.midpoint.hideElement()
			obj.midpoint.visible = false;
			
		break;
		case "polygon" :
	        parentids = obj.getParents();
			pathstr="";
			for (var i=0; i<parentids.length; i++) {
				P0 = mainboard.objects[parentids[i]];
				pathstr += "(" + P0.X() + "," + P0.Y() + ") -- ";
			}
			P0 = mainboard.objects[parentids[0]];
			pathstr += "(" + P0.X() + "," + P0.Y() + ")";
			//alert(pathstr);

			commandstr  = "\\draw[";
	        commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			if (obj.getAttribute("fillOpacity")!=0) {
	        commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			}
	        commandstr += "] ";
			commandstr += pathstr + ";\r\n";
			
			tikzstr += commandstr;
			
		break;
		case "bezier" :
	        parentids = obj.getParents();
			P0 = mainboard.objects[parentids[0]];
			P1 = mainboard.objects[parentids[1]];
			P2 = mainboard.objects[parentids[2]];
			P3 = mainboard.objects[parentids[3]];
			// (0,0) .. controls (1,1) and (2,-1) .. (3,0)
			pathstr  = "(" + P0.X() + "," + P0.Y() + ") .. controls ";
			pathstr += "(" + P1.X() + "," + P1.Y() + ") and ";
			pathstr += "(" + P2.X() + "," + P2.Y() + ") .. ";
			pathstr += "(" + P3.X() + "," + P3.Y() + ") ";

			commandstr  = "\\draw[";
	        commandstr += "line width="+obj.getAttribute("strokeWidth")*0.75+"pt, ";
	        commandstr += "draw=" + RGBColorToTikzColor(obj.getAttribute("strokeColor")) + ", ";
			if (obj.getAttribute("fillOpacity")!=0) {
	        commandstr += "fill opacity="+obj.getAttribute("fillOpacity")                + ", ";
	        commandstr += "fill=" + RGBColorToTikzColor(obj.getAttribute("fillColor")) ; 
			}
	        commandstr += "] ";
			commandstr += pathstr + ";\r\n";
			
			tikzstr += commandstr;
		break;
		default:;
		} // end switch
    }  // end for 
	return tikzstr;

}

function SaveTikz() {   	
	//var tikzstr = "\\begin{tikzpicture}\r\n"
	var tikzstr = "\\tikz{\r\n";

	tikzstr += GetSaveDrawTikzShapes();
	tikzstr += GetSaveTikzDrawLines();
	tikzstr += GetSaveTikzDrawPoints();
	//tikzstr += GetSaveTikzDrawText();
	
	//tikzstr += "\\end{tikzpicture}\n";
	tikzstr += "}\r\n";
	
	var file = new Blob([tikzstr], {type:'text/plain'});

	//var dltikz = document.getElementById("dltikz");
	//dltikz.href = URL.createObjectURL(file);
	//dltikz.download = "GeometriaTikz.txt";

	var dlbtn = document.getElementById("dlbtn");
	dlbtn.href = URL.createObjectURL(file);
	dlbtn.download = "GeometriaTikz.txt";
}

////////////////////////////////////////////////////////////////////////////////

function Save_JSX_SVG() {
	var svg = new XMLSerializer().serializeToString(mainboard.renderer.svgRoot);
	var file = new Blob([svg], {type:'text/plain'});
	var dlbtn = document.getElementById("dlbtn");
	dlbtn.href = URL.createObjectURL(file);
	dlbtn.download = "GeometriaJSXSvg.txt";
}

////////////////////////////////////////////////////////////////////////////////

function Save() {

	if (SAVE_FILE_TYPE=="svg") {
		Save_SVG();
	} else if (SAVE_FILE_TYPE=="jsx") {
		Save_JSX_SVG();
	} else if (SAVE_FILE_TYPE=="tikz") {
		SaveTikz();
	}
}

