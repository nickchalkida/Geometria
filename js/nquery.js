// A $( document ).ready() block.
$( document ).ready(function() {
    //console.log( "ready!" );
	FILL_CHECKED = $("#checkfill").val();
	CUR_FILL_COLOR =  $("#fillcolor").val();
	CUR_FILL_OPACITY = $("#fillopacity").val()/100.0;
	//alert(FILL_CHECKED);
	
	STROKE_CHECKED = $("#checkstroke").val();
	CUR_STROKE_COLOR =  $("#strokecolor").val();
	CUR_STROKE_OPACITY = $("#strokeopacity").val()/100.0;
	CUR_STROKE_WIDTH = $("#strokewidth").val();
	//alert(STROKE_CHECKED);
	
});

$(document).on("change", "#fillcolor", function() {
    CUR_FILL_COLOR = $(this).val();
    //alert(CUR_FILL_COLOR);
    $("#TFfillcolor").val($(this).val());
});

$(document).on("change", "#fillopacity", function() {
    CUR_FILL_OPACITY = $(this).val()/100.0;
});

$(document).on("change", "#strokecolor", function() {
    CUR_STROKE_COLOR = $(this).val();
    //alert(CUR_STROKE_COLOR);
    $("#TFstrokecolor").val($(this).val());
});

$(document).on("change", "#strokeopacity", function() {
    CUR_STROKE_OPACITY = $(this).val()/100.0;
});

$(document).on("change", "#strokewidth", function() {
    CUR_STROKE_WIDTH = $(this).val();
});

$(document).on("click", "#BoardWidthP", function() {
	ReDo();
	return;
	
    var widthstr = $("#mainbox").css("width");
    var width = parseInt(widthstr, 10);
    width = width + 50;
    var neowidthstr = width + "px";
    $("#mainbox").css("width", neowidthstr);
    
    var heightstr = $("#mainbox").css("height");
    var height = parseInt(heightstr, 10);
    height = height + 50;
    var neoheightstr = height + "px";
    $("#mainbox").css("height", neoheightstr);

    mainboard = JXG.JSXGraph.initBoard('mainbox', {boundingbox: [-10,10,10,-10], axis: true});
});


$(document).on("click", "#BoardWidthM", function() {
	UnDo();
	return;
    var widthstr = $("#mainbox").css("width");
    var width = parseInt(widthstr, 10);
    width = width - 50;
    var neowidthstr = width + "px";
    $("#mainbox").css("width", neowidthstr);
    
    var heightstr = $("#mainbox").css("height");
    var height = parseInt(heightstr, 10);
    height = height - 50;
    var neoheightstr = height + "px";
    $("#mainbox").css("height", neoheightstr);

    mainboard = JXG.JSXGraph.initBoard('mainbox', {boundingbox: [-10,10,10,-10], axis: true});
});

