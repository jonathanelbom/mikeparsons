!function(){function a(){var a=h(),b=a.width/a.height,c=E.outerWidth(),d=E.outerHeight(),e=c/d;e>b?E.addClass("full-width"):E.addClass("full-height")}function b(){var a,b=h(),c=b.width,d=b.height,e=Math.max(c,d);return a=240>=e?"m":320>=e?"n":500>=e?"-":640>=e?"z":"b"}function c(a){var c=g(a.farm,a.server,a.id,a.secret,b());E.removeClass("full-width full-height"),E.addClass("loading"),F.addClass("loading").find("span").text(a.title),w=setTimeout(function(){j(!0)},500),E.attr("src",c),C.show(),C.css("visibility","visible"),H.addClass("modal-shown")}function d(a){return u=_.findWhere(J,{id:a.toString()})}function e(){var a=J.indexOf(u);return a=a===J.length-1?0:a+1,u=J[a]}function f(){var a=J.indexOf(u);return a=0===a?J.length-1:a-1,u=J[a]}function g(a,b,c,d,e){return"http://farm"+a+".static.flickr.com/"+b+"/"+c+"_"+d+"_"+e+".jpg"}function h(){return{width:Math.max(document.documentElement.clientWidth,window.innerWidth||0),height:Math.max(document.documentElement.clientHeight,window.innerHeight||0)}}function i(){O&&($(".section").justifiedGallery("destroy"),$(".section").justifiedGallery().off()),$(".section").justifiedGallery({rowHeight:300,lastRow:"nojustify",margins:5,sizeRangeSuffixes:{100:"_t",240:"_m",320:"_n",500:"",640:"_z",1024:"_b"}}),$(".section").justifiedGallery().on("jg.complete",function(a){j(!1),$(document).scrollTop(0)}),O=!0}function h(){return{width:Math.max(document.documentElement.clientWidth,window.innerWidth||0),height:Math.max(document.documentElement.clientHeight,window.innerHeight||0)}}function j(a){console.log("toggleLoader, show:",a),_.isBoolean(a)||(a=!G.is(":visible")),console.log("      show:",a),a?G.show(500):G.hide(500)}function k(a,b){N[a]&&delete N[a]}function l(a){var b=a.photoset;z[b.id].photoset=b,K++,$.each(a.photoset.photo,function(b,c){c.photosetId=a.photoset.id,I.push(c)}),L>0&&K===L&&(m(I),i())}function m(a){J=_.shuffle(a),_.each(J,n)}function n(a){var b=g(a.farm,a.server,a.id,a.secret,"m"),c=$(A.thumb.concat()).on("error",function(){k($(this).data("photoId"),!1)}).on("load",function(){k($(this).parent().data("photoId"),!0)}).attr("src",b),d=$("<div></div>").append(c).attr({"data-photo-id":a.id,"data-photoset-id":a.photosetId});d.appendTo(".section")}function o(a){var b=$("#nav-scroll > .navbar-right");v=$(A.section.concat()).appendTo(B),console.log("$imageHolder:",v),b.append($('<li><a href="#" class="nav-item" data-section-id="all">all</a></li>')),$.each(a.photosets.photoset,function(a,c){L++,z[c.id]=c,$(A.navitem.concat()).appendTo(b).find("a").attr("data-section-id",this.id).text(this.title._content),s(this.id)}),$('a[data-section-id="all"]').trigger(P)}function p(a){t=a.user.nsid,q()}function q(){$.getJSON(y,{method:"flickr.photosets.getList",api_key:x,format:"json",user_id:t,per_page:20},o)}function r(a){$.getJSON(y,{method:"flickr.people.findByUsername",api_key:x,format:"json",username:a},p)}function s(a){$.getJSON(y,{method:"flickr.photosets.getPhotos",api_key:x,format:"json",photoset_id:a,per_page:500},l)}var t,u,v,w,x="4db987262fa1141b53330031985571b6",y="https://api.flickr.com/services/rest/?jsoncallback=?",z={},A={section:'<section class="section"></section>',thumb:'<img class="thumb"></img>',navitem:'<li><a href="#" class="nav-item"></a></li>'},B=$("main"),C=$(".modal"),D=$(".modal-controls"),E=$(".full-size"),F=$(".descr"),G=$(".js-loader"),H=$("body"),I=[],J=[],K=0,L=0,M=!1,N={},O=!1;r("mikedparsons");var P=Modernizr.touch?"touchend":"click";E.on("load",function(){w&&(clearTimeout(w),w=null),E.removeClass("loading"),F.removeClass("loading"),j(!1),a()});var Q=_.debounce(function(){a()},200);$(window).on("resize",function(){E.removeClass("full-width full-height"),Q()}),$("header").on(P,".nav-item",function(){$(".nav-item").removeClass("selected");var a=$(this).addClass("selected").data("sectionId");$(".section").empty();var b="all"===a?I:_.where(I,{photosetId:a});console.log("photos:",b),m(b),i(),$("body").scrollTop(0),$(".navbar-collapse").removeClass("in")}),$(".thumbs").css("padding-top",$(".main-nav").innerHeight()-4+"px");var R=D.outerHeight();D.css("top","calc(50% - "+R/2+"px)"),$(".modal .js-next").on(P,function(){c(e())}),$(".modal .js-prev").on(P,function(){c(f())}),$(".modal .js-close").on(P,function(){H.removeClass("modal-shown"),C.hide(),E.attr("src","")}),B.on(P,".thumb",function(){M||c(d($(this).closest("div").data("photoId"))),M=!1}).on("touchmove",".thumb",function(){M=!0})}();