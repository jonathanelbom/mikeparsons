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
	var $shell = $('.nav-shell');
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
	var menuShrunk = false;
	var isMobile = false; //initiate as false
	// device detection
	if ( /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
	    || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4))) {
		isMobile = true;
	}
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
		if ( !isMobile ) {
			updateRowHeight();
		}
	}, 200 );
	$(window).on('resize', function() {
		$fullsize.removeClass('full-width full-height');
		debouncedResize();
	})
	$(window).on('scroll', function() {
		console.log('scroll, $(this).scrollTop():',$(this).scrollTop());
		var threshhold = 170;
		var shrink =  $(this).scrollTop() > threshhold && !menuShrunk;
		var grow = $(this).scrollTop() <= threshhold && menuShrunk;
		if ( shrink ) {
			$shell.addClass('shrunk');
			menuShrunk = true;
		} else if ( grow ) {
			$shell.removeClass('shrunk');
			menuShrunk = false;
		}
	})
	if ( isMobile ) {
		$(window).on('orientationchange', function() {
			updateRowHeight();
		});
	}

	//$loader.hide();
	// on nav link click
	$('header').on( mouseEvent, '.nav-item', function() {
		$('.nav-item').removeClass('selected');
		var id = $(this).addClass('selected').data('sectionId');
		$('.section').empty();
		var photos = id === 'all' ? allPhotos : _.where(allPhotos, {photosetId: id})
		//console.log('photos:',photos);
		addPhotos( photos );

		initGrid();
		$('body').scrollTop( 0 );
		$('.navbar-collapse').removeClass('in');
	});

	$('.thumbs').css('padding-top', $('.main-nav').outerHeight() + 15 + 'px');
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
			rowHeight : getRowHeight(), //300,
		    lastRow : 'nojustify',
		    margins : 15,
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
	function getRowHeight() {
		var vp = getViewportSize();
		var rowHeight = 300;
		if (vp.width <= 500) {
			rowHeight = 100;
		} else if (vp.width <= 800) {
			rowHeight = 200;
		}
		//console.log('rowHeight:',rowHeight);
		return rowHeight;
	}
	function updateRowHeight() {
		$('.section').justifiedGallery( {rowHeight:getRowHeight()});
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