
/*******************************************************************************

    Copyright (C) 2016-2017  Nikolaos L. Kechris
    
    This file is part of Geometria.
    Definitions of Global Variables.

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

function trXY(X,Y) {
  return {
    x: 768/2 + X*768/20.0,
    y: 768/2 - Y*768/20.0
  };
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;

  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function RemoveDSign(instr) {

    var retstr = instr.replace('$','');
    retstr = retstr.split();
    return retstr;
}

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

function Rad3PAngle(P0,P1,P2) {
    var retdeg = 2*Math.PI - JXG.Math.Geometry.rad(P0,P1,P2);
    return retdeg;
} 

function RadVectorSlope(P0,P1) {
    var retdeg;
    var b = P0.Y()- P1.Y();
    var a = P0.X()- P1.X();
    
	if (a==0)
		return 0;
	
    if        (a>0 && b>0) {
        retdeg =         0 + Math.atan(b / a);
    } else if (a<0 && b>0) {
        retdeg =   Math.PI + Math.atan(b / a);
    } else if (a<0 && b<0) {
        retdeg =   Math.PI + Math.atan(b / a);
    } else if (a>0 && b<0) {
        retdeg = 2*Math.PI + Math.atan(b / a);
    }
    return retdeg;
}

function RadPointSlope(P0) {
    var retdeg;
    var b = P0.Y();
    var a = P0.X();
    
	if (a==0)
		return 0;
	
    if        (a>0 && b>0) {
        retdeg =         0 + Math.atan(b /a);
    } else if (a<0 && b>0) {
        retdeg =   Math.PI + Math.atan(b /a);
    } else if (a<0 && b<0) {
        retdeg =   Math.PI + Math.atan(b /a);
    } else if (a>0 && b<0) {
        retdeg = 2*Math.PI + Math.atan(b /a);
    }
    return retdeg;
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

function writelog(line) {
    var linestr = line + "\r\n";
    var txtstr = DOM_logarea.value;
    
    if (txtstr.length > 5000)
        txtstr = "";
    txtstr += linestr;
    DOM_logarea.value = txtstr;
    DOM_logarea.scrollTop = DOM_logarea.scrollHeight;
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}


