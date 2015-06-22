(function() {
	var api_key = '4db987262fa1141b53330031985571b6';
	var api_url = 'https://api.flickr.com/services/rest/?jsoncallback=?';
	var username = "jonnybomb";
	var user_id;
	var photosets = {};
	var photos = {};
	var templates = {
		section: '<section class="section"><header class="section-header"><span></span></header><ul class="section-photos"></ul></section>',
		thumb: '<img class="thumb"></img>',
		navitem: '<li><a href="#" class="nav-item"></a></li>'
	};
	var $main = $('main');
	var $modal = $('.modal');
	var $modalControls = $('.modal-controls');
	var $fullsize = $('.full-size');
	var $descr = $('.descr');
	var $loader = $('.loader');
	var $body = $('body');
	var photos;
	var photo;
	var mainIsFluid = false;//$main.hasClass('contianer-fluid');

	//get user id and kickoff site
	getUserId("mikedparsons");
	// define input event
	var mouseEvent = Modernizr.touch ? 'touchstart' : 'mousedown';
	// on full size iamge loaded
	$fullsize.on('load', function() {
		$fullsize.removeClass('loading');
		$descr.removeClass('loading');
		$loader.hide();
	});

	// on nav link click
	$('header').on( mouseEvent, '.nav-item', function() {
		$('.nav-item').removeClass('selected');
		var id = $(this).addClass('selected').data('sectionId');
		if ( id === 'all' ){
			$('.section').show();
		} else {
			var $section = $('#section-'+id);
			$('.section').hide();
			$section.show();
		}
		$('.navbar-collapse').removeClass('in');
	});

	// modal controls position
	var height = $modalControls.outerHeight();
	$modalControls.css('top', 'calc(50% - '+height/2+'px)');
	// modal controls handlers
	$('.modal .js-next').on( mouseEvent , function() {
		showFullImage( findNextPhotoFromSet() );
	});
	$('.modal .js-prev').on( mouseEvent , function() {
		showFullImage( findPrevPhotoFromSet() );
	});
	$('.modal .js-close').on( mouseEvent , function() {
		$body.removeClass('modal-shown');
		$modal.hide();
		$fullsize.attr( 'src', '' );
	});

	// thumbs handler
	$main.on( mouseEvent, '.thumb', function() {
		showFullImage( findPhotoFromSet( $(this).data('photoId'), $(this).data('photosetId') ) );
	})

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

	function getImageSize() {
		var vp = getViewportSize();
		var w = vp.width;
		var h = vp.height;
		var side = Math.max( w, h);
		var size;
		if (side <= 240 ) {
			size = 'm';
		} else if ( side <= 320 ) {
			size = 'n';
		} else if ( side <= 500 ) {
			size = '-';
		} else if ( side <= 640 ) {
			size = 'z';
		// } else if ( side <= 800 ) {
		// 	size = 'c';
		} else { //if ( side <= 1024 ) {
			size = 'b';
		}
		// } else if ( side <= 1600 ) {
		// 	size = 'h';
		// } else {
		// 	size = 'k';
		// }
		console.log('getImageSize, w:',w,', h:',h,', side:',side ,' size:',size);
		return size;
	}

	function showFullImage( photo ) {
		//console.log('showFullImage, width:',size.width,', height:',size.height,', photo:',photo,', photo.id:',photo.id );
		var url =  getImgSrc( photo.farm, photo.server, photo.id, photo.secret, getImageSize() );
		$fullsize.addClass('loading');
		$descr.addClass('loading').find('span').text( photo.title );

		$loader.show();
		$fullsize.attr( 'src', url );
		$modal.show();
		$modal.css('visibility', 'visible');
		$body.addClass('modal-shown');
	}

	function findPhotoFromSet( photoId, photosetId ) {
		photos = photosets[ photosetId ].photoset.photo;
		photo = _.findWhere( photos, {id: photoId.toString()} );
		return photo;
	}

	function findNextPhotoFromSet() {
		var idx = photos.indexOf( photo );
		idx = idx === photos.length - 1 ? 0 : idx + 1;
		photo = photos[ idx ];
		return photo;
	}

	function findPrevPhotoFromSet() {
		var idx = photos.indexOf( photo );
		idx = idx ===  0 ? photos.length - 1 : idx - 1;
		photo = photos[ idx ];
		return photo;
	}

	function getImgSrc( farm, server, id, secret, size) {
		return 'http://farm' + farm + '.static.flickr.com/' + server + '/' + id + '_' + secret + '_' + size + '.jpg';
	}

	function getViewportSize() {
		return { width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0), height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0) };
	}
	// when individual photoset is return from flickr
	function onGetPhotoset(data) {
		//console.log('onGetPhotoset, data:', data);
		var photoset = data.photoset;
		photosets[ photoset.id ].photoset = photoset;
		$.each( data.photoset.photo, function (index, photo) {
			// square thumb url
			var url = getImgSrc( photo.farm, photo.server, photo.id, photo.secret, 'q');	
			var $thumb = $( templates.thumb.concat() )
				.appendTo( '#section-' + photoset.id +' > ul' )
				.on('error', function() {
					console.log('image error');
				})
				.attr( {'src': url, 'data-photo-id': photo.id, 'data-photoset-id': data.photoset.id} );
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
				.find('a')
				.attr( 'data-section-id', this.id )
				.text( this.title._content );
			// get photoset for individual photo info
			getPhotoset(this.id);	
		});

		// click all
		$('a[data-section-id="all"]')[mouseEvent]();
	}
	// when a user id is returned from flickr
	function onGetUserId(data) {
		console.log('onGetUserId, data:', data);
		user_id = data.user.nsid;
		getPhotosets();
	}

	function getPhotosets() {
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
})();