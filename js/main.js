(function() {
	var api_key = '4db987262fa1141b53330031985571b6';
	var api_url = 'https://api.flickr.com/services/rest/?jsoncallback=?';
	var username = "jonnybomb";
	var user_id;
	var photosets = {};
	var photos = {};
	var templates = {
		section: '<section class="section"></section>',
		thumb: '<img class="thumb"></img>',
		navitem: '<li><a href="#" class="nav-item"></a></li>'
	};
	var $main = $('main');
	var $modal = $('.modal');
	var $modalControls = $('.modal-controls');
	var $fullsize = $('.full-size');
	var $descr = $('.descr');
	var $loader = $('.js-loader');
	var $body = $('body');
	var photos;
	var photo;
	var allPhotos = [];
	var curPhotos = [];
	var photosetsLoaded = 0;
	var numPhotosets = 0;
	var mainIsFluid = false;//$main.hasClass('contianer-fluid');
	var scrolling = false;
	var imageLoadHash = {};
	var $imageHolder;
	var hasGrid = false;
	var imageTimeoutId;

	//get user id and kickoff site
	getUserId("mikedparsons");
	// define input event
	var mouseEvent = Modernizr.touch ? 'touchend' : 'click';
	// on full size iamge loaded
	$fullsize.on('load', function() {
		if ( imageTimeoutId ) {
			clearTimeout(imageTimeoutId);
			imageTimeoutId = null;
		}
		$fullsize.removeClass('loading');
		$descr.removeClass('loading');
		toggleLoader(false);
		sizeToScreen()
	});
	var debouncedResize = _.debounce( function() {
		sizeToScreen();
	}, 200 );
	$(window).on('resize', function() {
		$fullsize.removeClass('full-width full-height');
		debouncedResize();
	});
	//$loader.hide();
	// on nav link click
	$('header').on( mouseEvent, '.nav-item', function() {
		$('.nav-item').removeClass('selected');
		var id = $(this).addClass('selected').data('sectionId');
		$('.section').empty();
		var photos = id === 'all' ? allPhotos : _.where(allPhotos, {photosetId: id})
		console.log('photos:',photos);
		addPhotos( photos );

		initGrid();
		$('body').scrollTop( 0 );
		$('.navbar-collapse').removeClass('in');
	});

	$('.thumbs').css('padding-top', $('.main-nav').innerHeight() - 4 + 'px');
	// modal controls position
	var height = $modalControls.outerHeight();
	$modalControls.css('top', 'calc(50% - '+height/2+'px)');
	// modal controls handlers
	$('.modal .js-next').on( mouseEvent , function() {
		showFullImage( findNextPhotoFromCurPhotos() );
		return false;
	});
	$('.modal .js-prev').on( mouseEvent , function() {
		showFullImage( findPrevPhotoFromCurPhotos() );
		return false;
	});
	$('.modal .js-close').on( mouseEvent , function() {
		$body.removeClass('modal-shown');
		$modal.hide();
		$fullsize.attr( 'src', '' );
		return false;
	});

	// thumbs handler
	$main.on( mouseEvent, '.thumb', function() {
		if ( !scrolling ) {
			showFullImage( findPhotoFromCurPhotos(  $(this).closest('div').data('photoId') ) );
		}
		scrolling = false;
	}).on( 'touchmove', '.thumb', function() {
		scrolling = true;
	});

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
		//console.log('getImageSize, w:',w,', h:',h,', side:',side ,' size:',size);
		return size;
	}

	function showFullImage( photo ) {
		//console.log('showFullImage, width:',size.width,', height:',size.height,', photo:',photo,', photo.id:',photo.id );
		var url =  getImgSrc( photo.farm, photo.server, photo.id, photo.secret, getImageSize() );
		$fullsize.removeClass('full-width full-height')
		$fullsize.addClass('loading');
		$descr.addClass('loading').find('span').text( photo.title );

		imageTimeoutId = setTimeout( function() {
			toggleLoader(true);
		}, 500);

		$fullsize.attr( 'src', url );
		$modal.show();
		$modal.css('visibility', 'visible');
		$body.addClass('modal-shown');
	}

	function findPhotoFromCurPhotos( photoId ) {
		photo = _.findWhere( curPhotos, {id: photoId.toString()} );
		return photo;
	}

	function findNextPhotoFromCurPhotos() {
		var idx = curPhotos.indexOf( photo );
		idx = idx === curPhotos.length - 1 ? 0 : idx + 1;
		photo = curPhotos[ idx ];
		return photo;
	}

	function findPrevPhotoFromCurPhotos() {
		var idx = curPhotos.indexOf( photo );
		idx = idx ===  0 ? curPhotos.length - 1 : idx - 1;
		photo = curPhotos[ idx ];
		return photo;
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
	function initGrid() {
		if ( hasGrid ) {
			$('.section').justifiedGallery('destroy');
			$('.section').justifiedGallery().off();
		}
		$('.section').justifiedGallery({
			rowHeight : 300,
		    lastRow : 'nojustify',
		    margins : 5,
		    sizeRangeSuffixes: {
			    100 : '_t', // used with images which are less than 100px on the longest side
			    240 : '_m', // used with images which are between 100px and 240px on the longest side
			    320 : '_n', // ...
			    500 : '',
			    640 : '_z',
			    1024 : '_b' // used which images that are more than 640px on the longest side
			}
		});
		$('.section').justifiedGallery().on('jg.complete', function (e) {
		    toggleLoader(false);
		    $(document).scrollTop( 0 );
		});
		hasGrid = true;
	}
	function getViewportSize () {
        return {
        	width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        	height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
        };
    }
    function toggleLoader( show ) {
    	console.log('toggleLoader, show:',show);
    	    	if ( !_.isBoolean(show) ) {
    		show = !$loader.is(":visible");
    	}
    	//$loader.show();
    	show ? $loader.show() : $loader.hide();
    }
	function checkForAllImagesLoaded() {
		var allLoaded = true;
		for (var key in imageLoadHash) {
			allLoaded = false;
			break;
		}
		return allLoaded;
	}
	function addImageLoadHash( id ) {
		if ( !imageLoadHash[id] ) {
			imageLoadHash[id] = 'not loaded';
		}
	}
	function onPhotoLoad( id, success ) {
		if ( imageLoadHash[id] ) {
			delete imageLoadHash[id];
			//checkForAllImagesLoaded();
		}
	}
	function sizeToScreen() {
		var vp = getViewportSize();
		var vpRatio = vp.width / vp.height;
		var width = $fullsize.outerWidth();
		var height = $fullsize.outerHeight();
		var picRatio = width / height;
		if ( picRatio > vpRatio) {
			$fullsize.addClass('full-width');
		} else {
			$fullsize.addClass('full-height');
		}
	}
	// when individual photoset is return from flickr
	function onGetPhotoset(data) {
		//console.log('onGetPhotoset, data:', data);
		var photoset = data.photoset;
		photosets[ photoset.id ].photoset = photoset;
		photosetsLoaded++;
		$.each( data.photoset.photo, function (index, photo) {
			photo.photosetId = data.photoset.id;
			allPhotos.push( photo );
		});
		//console.log('photosets:',photosets);
		if ( numPhotosets > 0 && photosetsLoaded === numPhotosets ) {
			addPhotos( allPhotos );
			initGrid();
			// console.log('init grid');
		}

	}
	function addPhotos( photos ) {
		curPhotos = _.shuffle(photos);
		_.each( curPhotos, addPhoto );
		// $('.section').on('click', '.thumb', function() {
		// 	var photo = curPhotos.findWhere({});
		// });
	}
	function addPhoto( photo ) {
		var url = getImgSrc( photo.farm, photo.server, photo.id, photo.secret, 'm');
		//addImageLoadHash( photo.id );
		var $thumb = $( templates.thumb.concat() )
			.on('error', function() {
				onPhotoLoad( $(this).data('photoId'), false );
			})
			.on('load', function() {
				onPhotoLoad( $(this).parent().data('photoId'), true );
			})
			.attr('src', url);
		var $div = $('<div></div>').append( $thumb )
			.attr( {'data-photo-id': photo.id, 'data-photoset-id': photo.photosetId } );
		$div.appendTo( '.section');
	}
	// when all of a user's photosets are return from flickr
	function onGetPhotosets(data) {
		//console.log('onGetPhotosets, data.photosets.photoset:', data.photosets.photoset);
		var $nav = $('#nav-scroll > .navbar-right');
		$imageHolder = $( templates.section.concat() ).appendTo( $main );
		console.log('$imageHolder:',$imageHolder);
		$nav.append( $('<li><a href="#" class="nav-item" data-section-id="all">all</a></li>') );
		$.each( data.photosets.photoset, function( index, photoset) {
			numPhotosets++;
			photosets[ photoset.id ] = photoset;
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
		$('a[data-section-id="all"]').trigger( mouseEvent );
	}
	// when a user id is returned from flickr
	function onGetUserId(data) {
		//console.log('onGetUserId, data:', data);
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