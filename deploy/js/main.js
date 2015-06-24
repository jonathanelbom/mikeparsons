!function(){function t(){var t,o=s(),e=o.width,n=o.height,i=Math.max(e,n)
return t=240>=i?"m":320>=i?"n":500>=i?"-":640>=i?"z":"b"}function o(o){var e=a(o.farm,o.server,o.id,o.secret,t())
j.addClass("loading"),y.addClass("loading").find("span").text(o.title),O.show(),j.attr("src",e),x.show(),x.css("visibility","visible"),M.addClass("modal-shown")}function e(t,o){return f=b[o].photoset.photo,p=_.findWhere(f,{id:t.toString()})}function n(){var t=f.indexOf(p)
return t=t===f.length-1?0:t+1,p=f[t]}function i(){var t=f.indexOf(p)
return t=0===t?f.length-1:t-1,p=f[t]}function a(t,o,e,n,i){return"http://farm"+t+".static.flickr.com/"+o+"/"+e+"_"+n+"_"+i+".jpg"}function s(){return{width:Math.max(document.documentElement.clientWidth,window.innerWidth||0),height:Math.max(document.documentElement.clientHeight,window.innerHeight||0)}}function c(t){var o=t.photoset
b[o.id].photoset=o,$.each(t.photoset.photo,function(e,n){var i=a(n.farm,n.server,n.id,n.secret,"q")
$(w.thumb.concat()).appendTo("#section-"+o.id+" > ul").on("error",function(){console.log("image error")}).attr({src:i,"data-photo-id":n.id,"data-photoset-id":t.photoset.id})})}function r(t){var o=$("#nav-scroll > .navbar-right")
$.each(t.photosets.photoset,function(t,e){b[e.id]=e,$(w.section.concat()).appendTo(k).attr("id","section-"+this.id).find("span").text(this.title._content),$(w.navitem.concat()).appendTo(o).find("a").attr("data-section-id",this.id).text(this.title._content),m(this.id)}),$('a[data-section-id="all"]').trigger(T)}function d(t){u=t.user.nsid,h()}function h(){$.getJSON(g,{method:"flickr.photosets.getList",api_key:v,format:"json",user_id:u,per_page:20},r)}function l(t){$.getJSON(g,{method:"flickr.people.findByUsername",api_key:v,format:"json",username:t},d)}function m(t){$.getJSON(g,{method:"flickr.photosets.getPhotos",api_key:v,format:"json",photoset_id:t,per_page:500},c)}var u,f,p,v="4db987262fa1141b53330031985571b6",g="https://api.flickr.com/services/rest/?jsoncallback=?",b={},f={},w={section:'<section class="section"><header class="section-header"><span></span></header><ul class="section-photos"></ul></section>',thumb:'<img class="thumb"></img>',navitem:'<li><a href="#" class="nav-item"></a></li>'},k=$("main"),x=$(".modal"),C=$(".modal-controls"),j=$(".full-size"),y=$(".descr"),O=$(".loader"),M=$("body"),S=!1
l("mikedparsons")
var T=Modernizr.touch?"touchend":"click"
j.on("load",function(){j.removeClass("loading"),y.removeClass("loading"),O.hide()}),$("header").on(T,".nav-item",function(){$(".nav-item").removeClass("selected")
var t=$(this).addClass("selected").data("sectionId")
if("all"===t)$(".section").show()
else{var o=$("#section-"+t)
$(".section").hide(),o.show()}$("body").scrollTop(0),$(".navbar-collapse").removeClass("in")})
var z=C.outerHeight()
C.css("top","calc(50% - "+z/2+"px)"),$(".modal .js-next").on(T,function(){o(n())}),$(".modal .js-prev").on(T,function(){o(i())}),$(".modal .js-close").on(T,function(){M.removeClass("modal-shown"),x.hide(),j.attr("src","")}),k.on(T,".thumb",function(){S||o(e($(this).data("photoId"),$(this).data("photosetId"))),S=!1}).on("touchmove",".thumb",function(){S=!0})}()
