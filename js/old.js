if (FP === undefined) var FP = {};
FP.spinOpts = {
	lines: 8, // The number of lines to draw
	length: 10, // The length of each line
	width: 8, // The line thickness
	radius: 12, // The radius of the inner circle
	rotate: 0, // The rotation offset
	color: '#00C7FF', // #rgb or #rrggbb
	speed: 1.3, // Rounds per second
	trail: 72, // Afterglow percentage
	shadow: true, // Whether to render a shadow
	hwaccel: false, // Whether to use hardware acceleration
	className: 'spinner', // The CSS class to assign to the spinner
	zIndex: 2e9, // The z-index (defaults to 2000000000)
	top: 'auto', // Top position relative to parent in px
	left: 'auto' // Left position relative to parent in px
};

var includeAllSets = true;
var setsToInclude = ["combo set", "curra's with dian", "halloween 2008", "springbox xmas 2008", "elliot"];
var user_id;
//var photosets = {};
var curPhotosetId="All";
var curPhotoId;

$(document).ready(
	function() {
		//FP.fullImageSpinner = new Spinner(FP.spinOpts)
		//FP.$fullImageSpinner = $(FP.fullImageSpinner.el);
		//trace("FP.fullImageSpinner:"+FP.fullImageSpinner+", FP.$fullImageSpinner:"+FP.$fullImageSpinner);
		//FP.fullImageSpinner = new Spinner(FP.spinOpts);
		//$("#modal").append(FP.fullImageSpinner.el);
		//FP.fullImageSpinner.elspin($("#modal")[0]);
		
		// setup trace
		initTrace();
		$("#traceTab").bind("mousedown", null, function(){ $("#debug").css("right") == "-265px" ? $("#debug").css("right", "-8px") : $("#debug").css("right", "-265px");});
		// update the window size
		resizeModalBlocker();
		updateFullImage();
		// add image loaded handler
		$("#image").bind("load", null, onImageLoaded);
		// add mouse handlers for prev/next image
		$(".prevNextImage").bind("mouseover", null, onPrevNextMouseOver);
		$(".prevNextImage").bind("mouseout", null, onPrevNextMouseOut);
		$("#nextImage").bind("mousedown", null, onNextMouseDown);
		$("#prevImage").bind("mousedown", null, onPrevMouseDown);
		//get user id and kickoff site
		getUserId("mikedparsons");
	}
);
$(window).resize( function() {
		resizeModalBlocker();
		updateFullImage();
		if (FP.fullImageLoading !== undefined && FP.fullImageLoading === true)
			createSpinner();
	}
);

function onPrevMouseDown() {
	loadFullImage(getPrevPhotoData(FP.curPhotoset, FP.curPhotoIndex));
}
function onNextMouseDown() {
	loadFullImage(getNextPhotoData(FP.curPhotoset, FP.curPhotoIndex));
}
function getNextPhotoData(photoset, curIdx) {
	var nextIdx = curIdx >= photoset.length - 1 ? 0 : curIdx + 1;
	return photoset[nextIdx];
}
function getPrevPhotoData(photoset, curIdx) {
	var prevIdx = curIdx == 0 ? photoset.length - 1 : curIdx - 1;
	return photoset[prevIdx];
}
function onPrevNextMouseOver() {
	togglePrevNext(this.id, true);
}
function onPrevNextMouseOut() {
	togglePrevNext(this.id, false);
}
function togglePrevNext(id, over) {
	if (over)
	{
		$("#"+id).removeClass(id+"_up");
		$("#"+id).addClass(id+"_over");
	}
	else // out
	{
		$("#"+id).removeClass(id+"_over");
		$("#"+id).addClass(id+"_up");
	}
}
function createSpinner() {
	if (FP.fullImageSpinner)
		FP.fullImageSpinner.stop();
	var spinOpts = $.extend(true, {}, FP.spinOpts);
	var d = spinOpts.length*2 + spinOpts.radius;
	spinOpts.top = ($(window).height() - d)/2;
	spinOpts.left = ($(window).width() - d)/2
	FP.fullImageSpinner = new Spinner(spinOpts).spin($("#modal")[0]);
}
function resizeModalBlocker() {
	$("#modal").css({"width":$(window).width(), "height":$(window).height()});
}
function updateFullImage() {
	// reset image width and height
	$("#image").css({'height':"", 'width':""});
	
	var bTrace = false;
	var padding = 45;
	var imgBorder = 15;
	var outerPadding = 30;
	var imageH = $("#image").height();
	var imageW = $("#image").width() ;
	var finalImageH = imageH;
	var finalImageW = imageW;
	var screenH = $(window).height() - padding*2;
	var screenW = $(window).width() - padding*2;
	var ratioWindow = screenW / screenH;
	var ratioImage = imageW / imageH;
	
	if (bTrace) trace("imageH:"+imageH+", imageW:"+imageW+", screenH:"+screenH+", screenW:"+screenW);
	if (ratioWindow >= ratioImage && imageH > screenH) {
		if (bTrace) trace("scale down image height");
		finalImageH = screenH;
		$("#image").css("height", finalImageH + "px");
		finalImageW = $('#image').width();
	}
	else if (ratioWindow < ratioImage && imageW > screenW) {
		if (bTrace) trace("scale down width >> ratioWindow < ratioImage && imageW > finalW");
		finalImageW = screenW;
		$("#image").css("width", finalImageW + "px");
		finalImageH = $('#image').height();
	}
	else {
		if (bTrace) trace("don't adjust image");
		$("#image").css({'height':imageH+"px", 'width':imageW+"px"});
	}
	
	var top =  ($(window).height() - finalImageH - imgBorder*2)/2;
	var left = ($(window).width() - finalImageW - outerPadding)/2;
	$("#fullimage").css({'height':finalImageH+"px", 'width':finalImageW+"px", 'top':top+"px", 'left':left+"px"});
	
	// set the height of the modal prev/next
	$("#modalPrevNext").css({"height":finalImageH+"px", "top":top+"px"});
	
	// position the modal close button
	var closeD = $("#modalClose").height()/2;
	$("#modalClose").css({"top":(top - closeD)+"px", "left":(left + finalImageW - closeD + imgBorder*2)+"px"});
}
function showModal() {
		$("#modal").css( {"width":$(window).width()+"px", "height":$(document).height()+"px"} );
		$(".modalCloser").bind("mousedown", null, closeModal);
		$('#modal').css('display', 'block'); //$('#modal').fadeIn(500);
		createSpinner();
}
function loadFullImage(photoData) {
	//traceObject(photoData);
	FP.fullImageLoading = true;
	FP.curPhotoset = FP.photosets[photoData.photosetId];
	FP.curPhotoIndex = getPhotoIndex(FP.curPhotoset, photoData.id);
	var url = 'http://farm' + photoData.farm + '.static.flickr.com/' + photoData.server + '/' + photoData.id + '_' + photoData.secret + "_c" + '.jpg';
	$("#thumbs").toggle(false);
	$("#image").attr("src", url);
	$("#fullimage").css('visibility', 'hidden');
	$("#modalClose").css('display', 'none');
	showModal();
}
function onImageLoaded(){
	FP.fullImageLoading = false;
	updateFullImage();
	$("#fullimage").css('visibility', 'visible');
	$("#modalClose").css('display', 'block');
	if (FP.fullImageSpinner !== undefined)
		FP.fullImageSpinner.stop();
}
function closeModal() {
	$("#image").attr("src", undefined);
	$("#thumbs").toggle(true);
	$('#modal').css('display', 'none'); 
	//$('#modal').fadeOut(250);
	$("#modalCloser").unbind("mousedown");
}
function createPhotoset() {
	//trace("createPhotoset");
	if (includeAllSets || $.inArray(this.title._content, setsToInclude) > -1)
	{
		if (FP.headerContentWidth === undefined)
			FP.headerContentWidth = $('#logo').width() + 80*2;
		
		a = $("<a class='headerLink modalCloser' href='javascript:void(0)'>"+this.title._content+"</a>").appendTo("#nav");
		a.bind("mousedown", {div:this}, function(event){ viewPhotoset(event.data); });
		div = $("<div class='thumbsHolder' id='thumbs_"+this.id+"' ><div class='sectTitleHolder'><h2 class='sectTitle'>"+this.title._content+"</h2></div></div>").appendTo("#content")
		FP.headerContentWidth += a.width(); 
		getPhotoset(this.id);
	}
}
function getPhotoIndex(photoset, photoId) {
	for (var i=0; i<photoset.length; i++)
		if (photoset[i].id === photoId) return i
	return -1;
}
function viewPhotoset(data) {
	//trace("viewPhotoset")
	//traceObject(data.photoset);
	showThumbs(data.div.id);
}
function showThumbs(setID){
	//trace("showThumbs, setID:"+setID);
	curPhotosetId=setID;
	var children = $('#content').children('div');
	for (var i=0; i<children.length; i++)
	{
		var child = children[i]
		$(child).toggle(child.id == "thumbs_"+setID || setID == "All");
	}
	$(window).resize();
}
// when individual photoset is return from flickr
function onGetPhotoset(data) {
	//trace("onGetPhotoset")
	//traceObject(data.photoset);
	var photosetId = data.photoset.id
	FP.photosets[photosetId] = new Array();
	for (var i=0; i<data.photoset.photo.length; i++)
	{
		var photoData = data.photoset.photo[i];
		photoData.photosetId = photosetId;
		var divId = "#thumbs_"+photosetId;
		var url = 'http://farm' + photoData.farm + '.static.flickr.com/' + photoData.server + '/' + photoData.id + '_' + photoData.secret + "_s" + '.jpg';	
		thumb = $("<img class='thumb'/>").appendTo(divId);
		thumb.attr("src", url); 
		thumb.bind("mousedown", {photo: photoData}, function(event){ loadFullImage(event.data.photo); });
		FP.photosets[photosetId].push(photoData);
	}
}
// when all of a user's photosets are return from flickr
function onGetPhotosets(data) {
	FP.photosets = new Object();
	$.each(data.photosets.photoset, createPhotoset);
	div = $("<a class='headerLink modalCloser' href='javascript:void(0)'>All</a>").appendTo("#nav");
	$('body').css('min-width', FP.headerContentWidth);
	$('#nav').css('min-width', FP.headerContentWidth);
	div.bind("mousedown", {div: {id:'All'}}, function(event){ viewPhotoset(event.data); });
}
// when a user id is returned from flickr
function onGetUserId(data) {
	//traceObject(data);
	user_id = data.user.nsid;
	getPhotosets();
}

//var spinner = new Spinner(opts).spin($("#fullimage")[0]);
//$("#fullimage").spin(opts);
