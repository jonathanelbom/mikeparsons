(function() {
	var api_key = '4db987262fa1141b53330031985571b6';
	var api_url = 'https://api.flickr.com/services/rest/?jsoncallback=?';
	var username = "jonnybomb";
	var user_id;
	var photosets = {};
	var templates = {
		section: '<section class="section"><header class="section-header"><span></span></header><ul class="section-photos"></ul></section>',
		thumb: '<img class="thumb"></img>',
		navitem: '<li><a href="#" class="nav-item"></a></li>'
	};
	var $main = $('main')

	//get user id and kickoff site
	getUserId("mikedparsons");
	
	/*  photo sizes
	s	small square 75x75
	q	large square 150x150
	t	thumbnail, 100 on longest side
	m	small, 240 on longest side
	n	small, 320 on longest side
	-	medium, 500 on longest side
	z	medium 640, 640 on longest side
	c	medium 800, 800 on longest side†
	b	large, 1024 on longest side*
	h	large 1600, 1600 on longest side†
	k	large 2048, 2048 on longest side†
	*/
	function getImgSrc( farm, server, id, secret, size) {
		return 'http://farm' + farm + '.static.flickr.com/' + server + '/' + id + '_' + secret + '_' + size + '.jpg';
	}

	// when individual photoset is return from flickr
	function onGetPhotoset(data) {
		//console.log('onGetPhotoset, data:', data);
		var photoset = data.photoset;
		photosets[ data.photoset.id ].photoset = photoset; 
		var photos = [];
		$.each( data.photoset.photo, function (index, photo) {
			// square thumb url
			var url = getImgSrc( photo.farm, photo.server, photo.id, photo.secret, 'q');	
			console.log('url:',url);
			$( templates.thumb.concat() )
				//.appendTo( $main )
				.appendTo( '#section-' + photoset.id +' > ul' )
				.attr( 'src', url );
			photos.push( photo );
		});
		/*
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
		*/
	}
	// when all of a user's photosets are return from flickr
	function onGetPhotosets(data) {
		//console.log('onGetPhotosets, data.photosets.photoset:', data.photosets.photoset);
		var $nav = $('#nav-scroll > .navbar-right');
		$.each( data.photosets.photoset, function( index, photoset) {
			photosets[ photoset.id ] = photoset;
			//add section template and add title
			$( templates.section.concat() )
				.appendTo( $main )
				.attr( 'id', 'section-'+this.id )
				.find('span')
				.text( this.title._content );
			// add the section nav item
			$( templates.navitem.concat() )
				.appendTo( $nav )
				.attr( 'id', 'nav-'+this.id )
				.find('a')
				.text( this.title._content );
			// get photoset for individual photo info
			getPhotoset(this.id);	
		});
		setTimeout( function() {
			console.log('photosets:',photosets);
		}, 3000);
		//
		/*
		FP.photosets = new Object();
		$.each(data.photosets.photoset, createPhotoset);
		div = $("<a class='headerLink modalCloser' href='javascript:void(0)'>All</a>").appendTo("#nav");
		$('body').css('min-width', FP.headerContentWidth);
		$('#nav').css('min-width', FP.headerContentWidth);
		div.bind("mousedown", {div: {id:'All'}}, function(event){ viewPhotoset(event.data); });
		*/
	}
	// when a user id is returned from flickr
	function onGetUserId(data) {
		console.log('onGetUserId, data:', data);
		user_id = data.user.nsid;
		getPhotosets();
	}

	function getPhotosets() {
		console.log("getPhotosets");
		$.getJSON(
			api_url,
			{ 	method : "flickr.photosets.getList",
				api_key : api_key,
				format : "json",
				user_id: user_id,
				per_page: 20
			},
			onGetPhotosets
	    );
	}

	function getUserId(name) {
		//trace("getUserId");
		$.getJSON(
			api_url,
			{ 	method : "flickr.people.findByUsername",
				api_key : api_key,
				format : "json",
				username: name
			},
			onGetUserId
	    );
	}

	function getPhotoset(photosetID) {
		//trace("getPhotos, photosetID:"+photosetID);
		$.getJSON(
			api_url,
			{ 	method : "flickr.photosets.getPhotos",
				api_key : api_key,
				format : "json",
				photoset_id: photosetID,
				per_page: 500
			},
			onGetPhotoset
	    );
	}
	/*
	function onGetPhotosets(data)
	{
		trace("generic onGetPhotosets");
		traceObject(data);
	}

	function onGetUserId(data)
	{
		trace("generic onGetUserId");
		traceObject(data);
	}
	*/
	/*
	function getPhotosetsFromGetScript() {
		trace("getPhotosetsFromGetScript");
		$.getScript(api_url_full);
	}
	function jsonFlickrApi(rsp) {
	    trace("jsonFlickrApi")
	    if (rsp.stat != "ok") return;
	    if (rsp.photosets) traceObject(rsp.photosets);
	    else if (rsp.photoset) flickr_photoset(rsp.photoset);
	}
	*/
})();