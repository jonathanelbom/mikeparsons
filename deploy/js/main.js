!function(){function a(){var a,b=g(),c=b.width,d=b.height,e=Math.max(c,d);return a=240>=e?"m":320>=e?"n":500>=e?"-":640>=e?"z":"b"}function b(b){var c=f(b.farm,b.server,b.id,b.secret,a());G.removeClass("full-width full-height"),G.addClass("loading"),H.addClass("loading").find("span").text(b.title),y=setTimeout(function(){i(!0)},500),G.attr("src",c),E.show(),E.css("visibility","visible"),J.addClass("modal-shown")}function c(a){return w=_.findWhere(L,{id:a.toString()})}function d(){var a=L.indexOf(w);return a=a===L.length-1?0:a+1,w=L[a]}function e(){var a=L.indexOf(w);return a=0===a?L.length-1:a-1,w=L[a]}function f(a,b,c,d,e){return"http://farm"+a+".static.flickr.com/"+b+"/"+c+"_"+d+"_"+e+".jpg"}function g(){return{width:Math.max(document.documentElement.clientWidth,window.innerWidth||0),height:Math.max(document.documentElement.clientHeight,window.innerHeight||0)}}function h(){Q&&($(".section").justifiedGallery("destroy"),$(".section").justifiedGallery().off()),$(".section").justifiedGallery({rowHeight:k(),lastRow:"nojustify",margins:5,sizeRangeSuffixes:{100:"_t",240:"_m",320:"_n",500:"",640:"_z",1024:"_b"}}),$(".section").justifiedGallery().on("jg.complete",function(a){i(!1),$(document).scrollTop(0)}),Q=!0}function g(){return{width:Math.max(document.documentElement.clientWidth,window.innerWidth||0),height:Math.max(document.documentElement.clientHeight,window.innerHeight||0)}}function i(a){_.isBoolean(a)||(a=!I.is(":visible")),a?I.show():I.hide()}function j(a,b){P[a]&&delete P[a]}function k(){var a=g(),b=300;return a.width<=500?b=100:a.width<=800&&(b=200),b}function l(){$(".section").justifiedGallery({rowHeight:k()})}function m(){var a=g(),b=a.width/a.height,c=G.outerWidth(),d=G.outerHeight(),e=c/d;e>b?G.addClass("full-width"):G.addClass("full-height")}function n(a){var b=a.photoset;B[b.id].photoset=b,M++,$.each(a.photoset.photo,function(b,c){c.photosetId=a.photoset.id,K.push(c)}),N>0&&M===N&&(o(K),h())}function o(a){L=_.shuffle(a),_.each(L,p)}function p(a){var b=f(a.farm,a.server,a.id,a.secret,"m"),c=$(C.thumb.concat()).on("error",function(){j($(this).data("photoId"),!1)}).on("load",function(){j($(this).parent().data("photoId"),!0)}).attr("src",b),d=$("<div></div>").append(c).attr({"data-photo-id":a.id,"data-photoset-id":a.photosetId});d.appendTo(".section")}function q(a){var b=$("#nav-scroll > .navbar-right");x=$(C.section.concat()).appendTo(D),console.log("$imageHolder:",x),b.append($('<li><a href="#" class="nav-item" data-section-id="all">all</a></li>')),$.each(a.photosets.photoset,function(a,c){N++,B[c.id]=c,$(C.navitem.concat()).appendTo(b).find("a").attr("data-section-id",this.id).text(this.title._content),u(this.id)}),$('a[data-section-id="all"]').trigger(S)}function r(a){v=a.user.nsid,s()}function s(){$.getJSON(A,{method:"flickr.photosets.getList",api_key:z,format:"json",user_id:v,per_page:20},q)}function t(a){$.getJSON(A,{method:"flickr.people.findByUsername",api_key:z,format:"json",username:a},r)}function u(a){$.getJSON(A,{method:"flickr.photosets.getPhotos",api_key:z,format:"json",photoset_id:a,per_page:500},n)}var v,w,x,y,z="4db987262fa1141b53330031985571b6",A="https://api.flickr.com/services/rest/?jsoncallback=?",B={},C={section:'<section class="section"></section>',thumb:'<img class="thumb"></img>',navitem:'<li><a href="#" class="nav-item"></a></li>'},D=$("main"),E=$(".modal"),F=$(".modal-controls"),G=$(".full-size"),H=$(".descr"),I=$(".js-loader"),J=$("body"),K=[],L=[],M=0,N=0,O=!1,P={},Q=!1,R=!1;(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0,4)))&&(R=!0),t("mikedparsons");var S=Modernizr.touch?"touchend":"click";G.on("load",function(){y&&(clearTimeout(y),y=null),G.removeClass("loading"),H.removeClass("loading"),i(!1),m()});var T=_.debounce(function(){m(),R||l()},200);$(window).on("resize",function(){G.removeClass("full-width full-height"),T()}),R&&$(window).on("orientationchange",function(){l()}),$("header").on(S,".nav-item",function(){$(".nav-item").removeClass("selected");var a=$(this).addClass("selected").data("sectionId");$(".section").empty();var b="all"===a?K:_.where(K,{photosetId:a});o(b),h(),$("body").scrollTop(0),$(".navbar-collapse").removeClass("in")}),$(".thumbs").css("padding-top",$(".main-nav").outerHeight()-1+"px");var U=F.outerHeight();F.css("top","calc(50% - "+U/2+"px)"),$(".modal .js-next").on(S,function(){return b(d()),!1}),$(".modal .js-prev").on(S,function(){return b(e()),!1}),$(".modal .js-close").on(S,function(){return J.removeClass("modal-shown"),E.hide(),G.attr("src",""),!1}),D.on(S,".thumb",function(){O||b(c($(this).closest("div").data("photoId"))),O=!1}).on("touchmove",".thumb",function(){O=!0})}();