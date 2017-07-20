
var CUR_TOOL_ID = "";
var near_hitted_objects = [];

var SELECTED_OBJECTS = [];
var ROOT_OBJECTS = []; // To store the initial objects of the axis
var mainboard = []; // = JXG.JSXGraph.initBoard('mainbox', {boundingbox: [-10,10,10,-10], axis: true});

var MAINBOARD_STORED_STATES = [];
var STORED_STATE_INDEX;

var FILL_CHECKED;
var CUR_FILL_COLOR;
var CUR_FILL_OPACITY;

var STROKE_CHECKED;
var CUR_STROKE_COLOR;
var CUR_STROKE_OPACITY;
var CUR_STROKE_WIDTH = 2;

var CUR_OBJECT_EDITING;
var DOM_OBJECT_SELECTOR;

var DOM_EDObjID;
var DOM_EDObjName;
var DOM_EDObjType;
var DOM_EDObjSize;
	
var DOM_EDVisibility;

var DOM_EDobjfillcolor;
var DOM_EDfillopacity;

var DOM_EDobjstrokecolor;
var DOM_EDstrokeopacity;
var DOM_EDObjStrokeWidth;






