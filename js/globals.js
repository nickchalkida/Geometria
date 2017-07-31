
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

var CUR_TOOL_ID = "";
var near_hitted_objects = [];

var SELECTED_OBJECTS = [];
var ROOT_OBJECTS = []; // To store the initial objects of the axis
var mainboard = []; // = JXG.JSXGraph.initBoard('mainbox', {boundingbox: [-10,10,10,-10], axis: true});

var MAINBOARD_STORED_ACTIONS = [];
var STORED_STATE_INDEX;
var HISTORY_SIZE=20;

var FILL_CHECKED;
var CUR_FILL_COLOR;
var CUR_FILL_OPACITY;

var STROKE_CHECKED;
var CUR_STROKE_COLOR;
var CUR_STROKE_OPACITY;
var CUR_STROKE_WIDTH = 2;

var CUR_OBJECT_EDITING;
var DOM_OBJECT_SELECTOR;
var SAVE_FILE_TYPE;
var FILE_SELECTOR;

var DOM_EDObjID;
var DOM_EDObjName;
var DOM_EDObjType;
var DOM_EDObjSize;
var DOM_EDObjPosX;
var DOM_EDObjPosY;
	
var DOM_EDVisibility;

var DOM_EDobjfillcolor;
var DOM_EDfillopacity;

var DOM_EDobjstrokecolor;
var DOM_EDstrokeopacity;
var DOM_EDObjStrokeWidth;



