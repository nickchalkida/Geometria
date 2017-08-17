
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
var HISTORY_SIZE = 20;

var FILL_CHECKED       = true;
var CUR_FILL_COLOR     = "#ffff00";
var CUR_FILL_OPACITY   = 0.5;

var STROKE_CHECKED     = true;
var CUR_STROKE_COLOR   = "#000060";
var CUR_STROKE_OPACITY = 1.0;
var CUR_STROKE_WIDTH   = 2;

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
var DOM_EDHasLabel;
var DOM_EDHasLabelText;

var DOM_EDobjfillcolor   = "#ffff00";
var DOM_EDfillopacity    = 0.5;

var DOM_EDobjstrokecolor = "#000060";
var DOM_EDstrokeopacity  = 1.0;
var DOM_EDObjStrokeWidth = 2;

var DOM_logarea;
var LOG_ENABLED = false;

var BOARD_DEF_FONT_SIZE     = 18;
var BOARD_DEF_POINT_SIZE    = 2;
var POINT_DEF_FILL_COLOR    = "#ff0000";
var POINT_DEF_STROKE_COLOR  = "#ff0000";


