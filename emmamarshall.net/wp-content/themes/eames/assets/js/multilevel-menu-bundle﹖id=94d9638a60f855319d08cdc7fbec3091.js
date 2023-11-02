!function(t){"function"==typeof define&&define.amd?define(["jquery"],t):"object"==typeof module&&"object"==typeof module.exports?module.exports=t(require("jquery")):t(jQuery)}((function($){var menuTrees=[],mouse=!1,touchEvents="ontouchstart"in window,mouseDetectionEnabled=!1,requestAnimationFrame=window.requestAnimationFrame||function(t){return setTimeout(t,1e3/60)},cancelAnimationFrame=window.cancelAnimationFrame||function(t){clearTimeout(t)},canAnimate=!!$.fn.animate;function initMouseDetection(t){var e=".smartmenus_mouse";if(mouseDetectionEnabled||t)mouseDetectionEnabled&&t&&($(document).off(e),mouseDetectionEnabled=!1);else{var s=!0,i=null,o={mousemove:function(t){var e={x:t.pageX,y:t.pageY,timeStamp:(new Date).getTime()};if(i){var o=Math.abs(i.x-e.x),a=Math.abs(i.y-e.y);if((o>0||a>0)&&o<=4&&a<=4&&e.timeStamp-i.timeStamp<=300&&(mouse=!0,s)){var n=$(t.target).closest("a");n.is("a")&&$.each(menuTrees,(function(){if($.contains(this.$root[0],n[0]))return this.itemEnter({currentTarget:n[0]}),!1})),s=!1}}i=e}};o[touchEvents?"touchstart":"pointerover pointermove pointerout MSPointerOver MSPointerMove MSPointerOut"]=function(t){isTouchEvent(t.originalEvent)&&(mouse=!1)},$(document).on(getEventsNS(o,e)),mouseDetectionEnabled=!0}}function isTouchEvent(t){return!/^(4|mouse)$/.test(t.pointerType)}function getEventsNS(t,e){e||(e="");var s={};for(var i in t)s[i.split(" ").join(e+" ")+e]=t[i];return s}return $.SmartMenus=function(t,e){this.$root=$(t),this.opts=e,this.rootId="",this.accessIdPrefix="",this.$subArrow=null,this.activatedItems=[],this.visibleSubMenus=[],this.showTimeout=0,this.hideTimeout=0,this.scrollTimeout=0,this.clickActivated=!1,this.focusActivated=!1,this.zIndexInc=0,this.idInc=0,this.$firstLink=null,this.$firstSub=null,this.disabled=!1,this.$disableOverlay=null,this.$touchScrollingSub=null,this.cssTransforms3d="perspective"in t.style||"webkitPerspective"in t.style,this.wasCollapsible=!1,this.init()},$.extend($.SmartMenus,{hideAll:function(){$.each(menuTrees,(function(){this.menuHideAll()}))},destroy:function(){for(;menuTrees.length;)menuTrees[0].destroy();initMouseDetection(!0)},prototype:{init:function(t){var e=this;if(!t){menuTrees.push(this),this.rootId=((new Date).getTime()+Math.random()+"").replace(/\D/g,""),this.accessIdPrefix="sm-"+this.rootId+"-",this.$root.hasClass("sm-rtl")&&(this.opts.rightToLeftSubMenus=!0);var s=".smartmenus";this.$root.data("smartmenus",this).attr("data-smartmenus-id",this.rootId).dataSM("level",1).on(getEventsNS({"mouseover focusin":$.proxy(this.rootOver,this),"mouseout focusout":$.proxy(this.rootOut,this),keydown:$.proxy(this.rootKeyDown,this)},s)).on(getEventsNS({mouseenter:$.proxy(this.itemEnter,this),mouseleave:$.proxy(this.itemLeave,this),mousedown:$.proxy(this.itemDown,this),focus:$.proxy(this.itemFocus,this),blur:$.proxy(this.itemBlur,this),click:$.proxy(this.itemClick,this)},s),"a"),s+=this.rootId,this.opts.hideOnClick&&$(document).on(getEventsNS({touchstart:$.proxy(this.docTouchStart,this),touchmove:$.proxy(this.docTouchMove,this),touchend:$.proxy(this.docTouchEnd,this),click:$.proxy(this.docClick,this)},s)),$(window).on(getEventsNS({"resize orientationchange":$.proxy(this.winResize,this)},s)),this.opts.subIndicators&&(this.$subArrow=$("<span/>").addClass("sub-arrow"),this.opts.subIndicatorsText&&this.$subArrow.html(this.opts.subIndicatorsText)),initMouseDetection()}if(this.$firstSub=this.$root.find("ul").each((function(){e.menuInit($(this))})).eq(0),this.$firstLink=this.$root.find("a").eq(0),this.opts.markCurrentItem){var i=/(index|default)\.[^#\?\/]*/i,o=window.location.href.replace(i,""),a=o.replace(/#.*/,"");this.$root.find("a:not(.mega-menu a)").each((function(){var t=this.href.replace(i,""),s=$(this);t!=o&&t!=a||(s.addClass("current"),e.opts.markCurrentTree&&s.parentsUntil("[data-smartmenus-id]","ul").each((function(){$(this).dataSM("parent-a").addClass("current")})))}))}this.wasCollapsible=this.isCollapsible()},destroy:function(t){if(!t){var e=".smartmenus";this.$root.removeData("smartmenus").removeAttr("data-smartmenus-id").removeDataSM("level").off(e),e+=this.rootId,$(document).off(e),$(window).off(e),this.opts.subIndicators&&(this.$subArrow=null)}this.menuHideAll();var s=this;this.$root.find("ul").each((function(){var t=$(this);t.dataSM("scroll-arrows")&&t.dataSM("scroll-arrows").remove(),t.dataSM("shown-before")&&((s.opts.subMenusMinWidth||s.opts.subMenusMaxWidth)&&t.css({width:"",minWidth:"",maxWidth:""}).removeClass("sm-nowrap"),t.dataSM("scroll-arrows")&&t.dataSM("scroll-arrows").remove(),t.css({zIndex:"",top:"",left:"",marginLeft:"",marginTop:"",display:""})),0==(t.attr("id")||"").indexOf(s.accessIdPrefix)&&t.removeAttr("id")})).removeDataSM("in-mega").removeDataSM("shown-before").removeDataSM("scroll-arrows").removeDataSM("parent-a").removeDataSM("level").removeDataSM("beforefirstshowfired").removeAttr("role").removeAttr("aria-hidden").removeAttr("aria-labelledby").removeAttr("aria-expanded"),this.$root.find("a.has-submenu").each((function(){var t=$(this);0==t.attr("id").indexOf(s.accessIdPrefix)&&t.removeAttr("id")})).removeClass("has-submenu").removeDataSM("sub").removeAttr("aria-haspopup").removeAttr("aria-controls").removeAttr("aria-expanded").closest("li").removeDataSM("sub"),this.opts.subIndicators&&this.$root.find("span.sub-arrow").remove(),this.opts.markCurrentItem&&this.$root.find("a.current").removeClass("current"),t||(this.$root=null,this.$firstLink=null,this.$firstSub=null,this.$disableOverlay&&(this.$disableOverlay.remove(),this.$disableOverlay=null),menuTrees.splice($.inArray(this,menuTrees),1))},disable:function(t){if(!this.disabled){if(this.menuHideAll(),!t&&!this.opts.isPopup&&this.$root.is(":visible")){var e=this.$root.offset();this.$disableOverlay=$('<div class="sm-jquery-disable-overlay"/>').css({position:"absolute",top:e.top,left:e.left,width:this.$root.outerWidth(),height:this.$root.outerHeight(),zIndex:this.getStartZIndex(!0),opacity:0}).appendTo(document.body)}this.disabled=!0}},docClick:function(t){this.$touchScrollingSub?this.$touchScrollingSub=null:(this.visibleSubMenus.length&&!$.contains(this.$root[0],t.target)||$(t.target).closest("a").length)&&this.menuHideAll()},docTouchEnd:function(t){if(this.lastTouch){if(this.visibleSubMenus.length&&(void 0===this.lastTouch.x2||this.lastTouch.x1==this.lastTouch.x2)&&(void 0===this.lastTouch.y2||this.lastTouch.y1==this.lastTouch.y2)&&(!this.lastTouch.target||!$.contains(this.$root[0],this.lastTouch.target))){this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=0);var e=this;this.hideTimeout=setTimeout((function(){e.menuHideAll()}),350)}this.lastTouch=null}},docTouchMove:function(t){if(this.lastTouch){var e=t.originalEvent.touches[0];this.lastTouch.x2=e.pageX,this.lastTouch.y2=e.pageY}},docTouchStart:function(t){var e=t.originalEvent.touches[0];this.lastTouch={x1:e.pageX,y1:e.pageY,target:e.target}},enable:function(){this.disabled&&(this.$disableOverlay&&(this.$disableOverlay.remove(),this.$disableOverlay=null),this.disabled=!1)},getClosestMenu:function(t){for(var e=$(t).closest("ul");e.dataSM("in-mega");)e=e.parent().closest("ul");return e[0]||null},getHeight:function(t){return this.getOffset(t,!0)},getOffset:function(t,e){var s;"none"==t.css("display")&&(s={position:t[0].style.position,visibility:t[0].style.visibility},t.css({position:"absolute",visibility:"hidden"}).show());var i=t[0].getBoundingClientRect&&t[0].getBoundingClientRect(),o=i&&(e?i.height||i.bottom-i.top:i.width||i.right-i.left);return o||0===o||(o=e?t[0].offsetHeight:t[0].offsetWidth),s&&t.hide().css(s),o},getStartZIndex:function(t){var e=parseInt(this[t?"$root":"$firstSub"].css("z-index"));return!t&&isNaN(e)&&(e=parseInt(this.$root.css("z-index"))),isNaN(e)?1:e},getTouchPoint:function(t){return t.touches&&t.touches[0]||t.changedTouches&&t.changedTouches[0]||t},getViewport:function(t){var e=t?"Height":"Width",s=document.documentElement["client"+e],i=window["inner"+e];return i&&(s=Math.min(s,i)),s},getViewportHeight:function(){return this.getViewport(!0)},getViewportWidth:function(){return this.getViewport()},getWidth:function(t){return this.getOffset(t)},handleEvents:function(){return!this.disabled&&this.isCSSOn()},handleItemEvents:function(t){return this.handleEvents()&&!this.isLinkInMegaMenu(t)},isCollapsible:function(){return"static"==this.$firstSub.css("position")},isCSSOn:function(){return"inline"!=this.$firstLink.css("display")},isFixed:function(){var t="fixed"==this.$root.css("position");return t||this.$root.parentsUntil("body").each((function(){if("fixed"==$(this).css("position"))return t=!0,!1})),t},isLinkInMegaMenu:function(t){return $(this.getClosestMenu(t[0])).hasClass("mega-menu")},isTouchMode:function(){return!mouse||this.opts.noMouseOver||this.isCollapsible()},itemActivate:function(t,e){var s=t.closest("ul"),i=s.dataSM("level");if(i>1&&(!this.activatedItems[i-2]||this.activatedItems[i-2][0]!=s.dataSM("parent-a")[0])){var o=this;$(s.parentsUntil("[data-smartmenus-id]","ul").get().reverse()).add(s).each((function(){o.itemActivate($(this).dataSM("parent-a"))}))}if(this.isCollapsible()&&!e||this.menuHideSubMenus(this.activatedItems[i-1]&&this.activatedItems[i-1][0]==t[0]?i:i-1),this.activatedItems[i-1]=t,!1!==this.$root.triggerHandler("activate.smapi",t[0])){var a=t.dataSM("sub");a&&(this.isTouchMode()||!this.opts.showOnClick||this.clickActivated)&&this.menuShow(a)}},itemBlur:function(t){var e=$(t.currentTarget);this.handleItemEvents(e)&&this.$root.triggerHandler("blur.smapi",e[0])},itemClick:function(t){var e=$(t.currentTarget);if(this.handleItemEvents(e)){if(this.$touchScrollingSub&&this.$touchScrollingSub[0]==e.closest("ul")[0])return this.$touchScrollingSub=null,t.stopPropagation(),!1;if(!1===this.$root.triggerHandler("click.smapi",e[0]))return!1;var s=e.dataSM("sub"),i=!!s&&2==s.dataSM("level");if(s){var o=$(t.target).is(".sub-arrow"),a=this.isCollapsible(),n=/toggle$/.test(this.opts.collapsibleBehavior),r=/link$/.test(this.opts.collapsibleBehavior),h=/^accordion/.test(this.opts.collapsibleBehavior);if(s.is(":visible")){if(!a&&this.opts.showOnClick&&i)return this.menuHide(s),this.clickActivated=!1,this.focusActivated=!1,!1;if(a&&(n||o))return this.itemActivate(e,h),this.menuHide(s),!1}else if((!r||!a||o)&&(!a&&this.opts.showOnClick&&i&&(this.clickActivated=!0),this.itemActivate(e,h),s.is(":visible")))return this.focusActivated=!0,!1}return!(!a&&this.opts.showOnClick&&i||e.hasClass("disabled")||!1===this.$root.triggerHandler("select.smapi",e[0]))&&void 0}},itemDown:function(t){var e=$(t.currentTarget);this.handleItemEvents(e)&&e.dataSM("mousedown",!0)},itemEnter:function(t){var e=$(t.currentTarget);if(this.handleItemEvents(e)){if(!this.isTouchMode()){this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=0);var s=this;this.showTimeout=setTimeout((function(){s.itemActivate(e)}),this.opts.showOnClick&&1==e.closest("ul").dataSM("level")?1:this.opts.showTimeout)}this.$root.triggerHandler("mouseenter.smapi",e[0])}},itemFocus:function(t){var e=$(t.currentTarget);this.handleItemEvents(e)&&(!this.focusActivated||this.isTouchMode()&&e.dataSM("mousedown")||this.activatedItems.length&&this.activatedItems[this.activatedItems.length-1][0]==e[0]||this.itemActivate(e,!0),this.$root.triggerHandler("focus.smapi",e[0]))},itemLeave:function(t){var e=$(t.currentTarget);this.handleItemEvents(e)&&(this.isTouchMode()||(e[0].blur(),this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=0)),e.removeDataSM("mousedown"),this.$root.triggerHandler("mouseleave.smapi",e[0]))},menuHide:function(t){if(!1!==this.$root.triggerHandler("beforehide.smapi",t[0])&&(canAnimate&&t.stop(!0,!0),"none"!=t.css("display"))){var e=function(){t.css("z-index","")};this.isCollapsible()?canAnimate&&this.opts.collapsibleHideFunction?this.opts.collapsibleHideFunction.call(this,t,e):t.hide(this.opts.collapsibleHideDuration,e):canAnimate&&this.opts.hideFunction?this.opts.hideFunction.call(this,t,e):t.hide(this.opts.hideDuration,e),t.dataSM("scroll")&&(this.menuScrollStop(t),t.css({"touch-action":"","-ms-touch-action":"","-webkit-transform":"",transform:""}).off(".smartmenus_scroll").removeDataSM("scroll").dataSM("scroll-arrows").hide()),t.dataSM("parent-a").removeClass("highlighted").attr("aria-expanded","false"),t.attr({"aria-expanded":"false","aria-hidden":"true"});var s=t.dataSM("level");this.activatedItems.splice(s-1,1),this.visibleSubMenus.splice($.inArray(t,this.visibleSubMenus),1),this.$root.triggerHandler("hide.smapi",t[0])}},menuHideAll:function(){this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=0);for(var t=this.opts.isPopup?1:0,e=this.visibleSubMenus.length-1;e>=t;e--)this.menuHide(this.visibleSubMenus[e]);this.opts.isPopup&&(canAnimate&&this.$root.stop(!0,!0),this.$root.is(":visible")&&(canAnimate&&this.opts.hideFunction?this.opts.hideFunction.call(this,this.$root):this.$root.hide(this.opts.hideDuration))),this.activatedItems=[],this.visibleSubMenus=[],this.clickActivated=!1,this.focusActivated=!1,this.zIndexInc=0,this.$root.triggerHandler("hideAll.smapi")},menuHideSubMenus:function(t){for(var e=this.activatedItems.length-1;e>=t;e--){var s=this.activatedItems[e].dataSM("sub");s&&this.menuHide(s)}},menuInit:function(t){if(!t.dataSM("in-mega")){t.hasClass("mega-menu")&&t.find("ul").dataSM("in-mega",!0);for(var e=2,s=t[0];(s=s.parentNode.parentNode)!=this.$root[0];)e++;var i=t.prevAll("a").eq(-1);i.length||(i=t.prevAll().find("a").eq(-1)),i.addClass("has-submenu").dataSM("sub",t),t.dataSM("parent-a",i).dataSM("level",e).parent().dataSM("sub",t);var o=i.attr("id")||this.accessIdPrefix+ ++this.idInc,a=t.attr("id")||this.accessIdPrefix+ ++this.idInc;i.attr({id:o,"aria-haspopup":"true","aria-controls":a,"aria-expanded":"false"}),t.attr({id:a,role:"group","aria-hidden":"true","aria-labelledby":o,"aria-expanded":"false"}),this.opts.subIndicators&&i[this.opts.subIndicatorsPos](this.$subArrow.clone())}},menuPosition:function(t){var e,s,i=t.dataSM("parent-a"),o=i.closest("li"),a=o.parent(),n=t.dataSM("level"),r=this.getWidth(t),h=this.getHeight(t),u=i.offset(),l=u.left,c=u.top,d=this.getWidth(i),m=this.getHeight(i),p=$(window),f=p.scrollLeft(),v=p.scrollTop(),b=this.getViewportWidth(),g=this.getViewportHeight(),S=a.parent().is("[data-sm-horizontal-sub]")||2==n&&!a.hasClass("sm-vertical"),w=this.opts.rightToLeftSubMenus&&!o.is("[data-sm-reverse]")||!this.opts.rightToLeftSubMenus&&o.is("[data-sm-reverse]"),M=2==n?this.opts.mainMenuSubOffsetX:this.opts.subMenusSubOffsetX,T=2==n?this.opts.mainMenuSubOffsetY:this.opts.subMenusSubOffsetY;if(S?(e=w?d-r-M:M,s=this.opts.bottomToTopSubMenus?-h-T:m+T):(e=w?M-r:d-M,s=this.opts.bottomToTopSubMenus?m-T-h:T),this.opts.keepInViewport){var y=l+e,x=c+s;if(w&&y<f?e=S?f-y+e:d-M:!w&&y+r>f+b&&(e=S?f+b-r-y+e:M-r),S||(h<g&&x+h>v+g?s+=v+g-h-x:(h>=g||x<v)&&(s+=v-x)),S&&(x+h>v+g+.49||x<v)||!S&&h>g+.49){var I=this;t.dataSM("scroll-arrows")||t.dataSM("scroll-arrows",$([$('<span class="scroll-up"><span class="scroll-up-arrow"></span></span>')[0],$('<span class="scroll-down"><span class="scroll-down-arrow"></span></span>')[0]]).on({mouseenter:function(){t.dataSM("scroll").up=$(this).hasClass("scroll-up"),I.menuScroll(t)},mouseleave:function(e){I.menuScrollStop(t),I.menuScrollOut(t,e)},"mousewheel DOMMouseScroll":function(t){t.preventDefault()}}).insertAfter(t));var C=".smartmenus_scroll";if(t.dataSM("scroll",{y:this.cssTransforms3d?0:s-m,step:1,itemH:m,subH:h,arrowDownH:this.getHeight(t.dataSM("scroll-arrows").eq(1))}).on(getEventsNS({mouseover:function(e){I.menuScrollOver(t,e)},mouseout:function(e){I.menuScrollOut(t,e)},"mousewheel DOMMouseScroll":function(e){I.menuScrollMousewheel(t,e)}},C)).dataSM("scroll-arrows").css({top:"auto",left:"0",marginLeft:e+(parseInt(t.css("border-left-width"))||0),width:r-(parseInt(t.css("border-left-width"))||0)-(parseInt(t.css("border-right-width"))||0),zIndex:t.css("z-index")}).eq(S&&this.opts.bottomToTopSubMenus?0:1).show(),this.isFixed()){var A={};A[touchEvents?"touchstart touchmove touchend":"pointerdown pointermove pointerup MSPointerDown MSPointerMove MSPointerUp"]=function(e){I.menuScrollTouch(t,e)},t.css({"touch-action":"none","-ms-touch-action":"none"}).on(getEventsNS(A,C))}}}t.css({top:"auto",left:"0",marginLeft:e,marginTop:s-m})},menuScroll:function(t,e,s){var i,o=t.dataSM("scroll"),a=t.dataSM("scroll-arrows"),n=o.up?o.upEnd:o.downEnd;if(!e&&o.momentum){if(o.momentum*=.92,(i=o.momentum)<.5)return void this.menuScrollStop(t)}else i=s||(e||!this.opts.scrollAccelerate?this.opts.scrollStep:Math.floor(o.step));var r=t.dataSM("level");if(this.activatedItems[r-1]&&this.activatedItems[r-1].dataSM("sub")&&this.activatedItems[r-1].dataSM("sub").is(":visible")&&this.menuHideSubMenus(r-1),o.y=o.up&&n<=o.y||!o.up&&n>=o.y?o.y:Math.abs(n-o.y)>i?o.y+(o.up?i:-i):n,t.css(this.cssTransforms3d?{"-webkit-transform":"translate3d(0, "+o.y+"px, 0)",transform:"translate3d(0, "+o.y+"px, 0)"}:{marginTop:o.y}),mouse&&(o.up&&o.y>o.downEnd||!o.up&&o.y<o.upEnd)&&a.eq(o.up?1:0).show(),o.y==n)mouse&&a.eq(o.up?0:1).hide(),this.menuScrollStop(t);else if(!e){this.opts.scrollAccelerate&&o.step<this.opts.scrollStep&&(o.step+=.2);var h=this;this.scrollTimeout=requestAnimationFrame((function(){h.menuScroll(t)}))}},menuScrollMousewheel:function(t,e){if(this.getClosestMenu(e.target)==t[0]){var s=((e=e.originalEvent).wheelDelta||-e.detail)>0;t.dataSM("scroll-arrows").eq(s?0:1).is(":visible")&&(t.dataSM("scroll").up=s,this.menuScroll(t,!0))}e.preventDefault()},menuScrollOut:function(t,e){mouse&&(/^scroll-(up|down)/.test((e.relatedTarget||"").className)||(t[0]==e.relatedTarget||$.contains(t[0],e.relatedTarget))&&this.getClosestMenu(e.relatedTarget)==t[0]||t.dataSM("scroll-arrows").css("visibility","hidden"))},menuScrollOver:function(t,e){if(mouse&&!/^scroll-(up|down)/.test(e.target.className)&&this.getClosestMenu(e.target)==t[0]){this.menuScrollRefreshData(t);var s=t.dataSM("scroll"),i=$(window).scrollTop()-t.dataSM("parent-a").offset().top-s.itemH;t.dataSM("scroll-arrows").eq(0).css("margin-top",i).end().eq(1).css("margin-top",i+this.getViewportHeight()-s.arrowDownH).end().css("visibility","visible")}},menuScrollRefreshData:function(t){var e=t.dataSM("scroll"),s=$(window).scrollTop()-t.dataSM("parent-a").offset().top-e.itemH;this.cssTransforms3d&&(s=-(parseFloat(t.css("margin-top"))-s)),$.extend(e,{upEnd:s,downEnd:s+this.getViewportHeight()-e.subH})},menuScrollStop:function(t){if(this.scrollTimeout)return cancelAnimationFrame(this.scrollTimeout),this.scrollTimeout=0,t.dataSM("scroll").step=1,!0},menuScrollTouch:function(t,e){if(isTouchEvent(e=e.originalEvent)){var s=this.getTouchPoint(e);if(this.getClosestMenu(s.target)==t[0]){var i=t.dataSM("scroll");if(/(start|down)$/i.test(e.type))this.menuScrollStop(t)?(e.preventDefault(),this.$touchScrollingSub=t):this.$touchScrollingSub=null,this.menuScrollRefreshData(t),$.extend(i,{touchStartY:s.pageY,touchStartTime:e.timeStamp});else if(/move$/i.test(e.type)){var o=void 0!==i.touchY?i.touchY:i.touchStartY;if(void 0!==o&&o!=s.pageY){this.$touchScrollingSub=t;var a=o<s.pageY;void 0!==i.up&&i.up!=a&&$.extend(i,{touchStartY:s.pageY,touchStartTime:e.timeStamp}),$.extend(i,{up:a,touchY:s.pageY}),this.menuScroll(t,!0,Math.abs(s.pageY-o))}e.preventDefault()}else void 0!==i.touchY&&((i.momentum=15*Math.pow(Math.abs(s.pageY-i.touchStartY)/(e.timeStamp-i.touchStartTime),2))&&(this.menuScrollStop(t),this.menuScroll(t),e.preventDefault()),delete i.touchY)}}},menuShow:function(t){if((t.dataSM("beforefirstshowfired")||(t.dataSM("beforefirstshowfired",!0),!1!==this.$root.triggerHandler("beforefirstshow.smapi",t[0])))&&!1!==this.$root.triggerHandler("beforeshow.smapi",t[0])&&(t.dataSM("shown-before",!0),canAnimate&&t.stop(!0,!0),!t.is(":visible"))){var e=t.dataSM("parent-a"),s=this.isCollapsible();if((this.opts.keepHighlighted||s)&&e.addClass("highlighted"),s)t.removeClass("sm-nowrap").css({zIndex:"",width:"auto",minWidth:"",maxWidth:"",top:"",left:"",marginLeft:"",marginTop:""});else{if(t.css("z-index",this.zIndexInc=(this.zIndexInc||this.getStartZIndex())+1),(this.opts.subMenusMinWidth||this.opts.subMenusMaxWidth)&&(t.css({width:"auto",minWidth:"",maxWidth:""}).addClass("sm-nowrap"),this.opts.subMenusMinWidth&&t.css("min-width",this.opts.subMenusMinWidth),this.opts.subMenusMaxWidth)){var i=this.getWidth(t);t.css("max-width",this.opts.subMenusMaxWidth),i>this.getWidth(t)&&t.removeClass("sm-nowrap").css("width",this.opts.subMenusMaxWidth)}this.menuPosition(t)}var o=function(){t.css("overflow","")};s?canAnimate&&this.opts.collapsibleShowFunction?this.opts.collapsibleShowFunction.call(this,t,o):t.show(this.opts.collapsibleShowDuration,o):canAnimate&&this.opts.showFunction?this.opts.showFunction.call(this,t,o):t.show(this.opts.showDuration,o),e.attr("aria-expanded","true"),t.attr({"aria-expanded":"true","aria-hidden":"false"}),this.visibleSubMenus.push(t),this.$root.triggerHandler("show.smapi",t[0])}},popupHide:function(t){this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=0);var e=this;this.hideTimeout=setTimeout((function(){e.menuHideAll()}),t?1:this.opts.hideTimeout)},popupShow:function(t,e){if(this.opts.isPopup){if(this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=0),this.$root.dataSM("shown-before",!0),canAnimate&&this.$root.stop(!0,!0),!this.$root.is(":visible")){this.$root.css({left:t,top:e});var s=this,i=function(){s.$root.css("overflow","")};canAnimate&&this.opts.showFunction?this.opts.showFunction.call(this,this.$root,i):this.$root.show(this.opts.showDuration,i),this.visibleSubMenus[0]=this.$root}}else alert('SmartMenus jQuery Error:\n\nIf you want to show this menu via the "popupShow" method, set the isPopup:true option.')},refresh:function(){this.destroy(!0),this.init(!0)},rootKeyDown:function(t){if(this.handleEvents())switch(t.keyCode){case 27:var e=this.activatedItems[0];if(e)this.menuHideAll(),e[0].focus(),(s=e.dataSM("sub"))&&this.menuHide(s);break;case 32:var s,i=$(t.target);if(i.is("a")&&this.handleItemEvents(i))(s=i.dataSM("sub"))&&!s.is(":visible")&&(this.itemClick({currentTarget:t.target}),t.preventDefault())}},rootOut:function(t){if(this.handleEvents()&&!this.isTouchMode()&&t.target!=this.$root[0]&&(this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=0),!this.opts.showOnClick||!this.opts.hideOnClick)){var e=this;this.hideTimeout=setTimeout((function(){e.menuHideAll()}),this.opts.hideTimeout)}},rootOver:function(t){this.handleEvents()&&!this.isTouchMode()&&t.target!=this.$root[0]&&this.hideTimeout&&(clearTimeout(this.hideTimeout),this.hideTimeout=0)},winResize:function(t){if(this.handleEvents()){if(!("onorientationchange"in window)||"orientationchange"==t.type){var e=this.isCollapsible();this.wasCollapsible&&e||(this.activatedItems.length&&this.activatedItems[this.activatedItems.length-1][0].blur(),this.menuHideAll()),this.wasCollapsible=e}}else if(this.$disableOverlay){var s=this.$root.offset();this.$disableOverlay.css({top:s.top,left:s.left,width:this.$root.outerWidth(),height:this.$root.outerHeight()})}}}}),$.fn.dataSM=function(t,e){return e?this.data(t+"_smartmenus",e):this.data(t+"_smartmenus")},$.fn.removeDataSM=function(t){return this.removeData(t+"_smartmenus")},$.fn.smartmenus=function(options){if("string"==typeof options){var args=arguments,method=options;return Array.prototype.shift.call(args),this.each((function(){var t=$(this).data("smartmenus");t&&t[method]&&t[method].apply(t,args)}))}return this.each((function(){var dataOpts=$(this).data("sm-options")||null;if(dataOpts&&"object"!=typeof dataOpts)try{dataOpts=eval("("+dataOpts+")")}catch(t){dataOpts=null,alert('ERROR\n\nSmartMenus jQuery init:\nInvalid "data-sm-options" attribute value syntax.')}new $.SmartMenus(this,$.extend({},$.fn.smartmenus.defaults,options,dataOpts))}))},$.fn.smartmenus.defaults={isPopup:!1,mainMenuSubOffsetX:0,mainMenuSubOffsetY:0,subMenusSubOffsetX:0,subMenusSubOffsetY:0,subMenusMinWidth:"10em",subMenusMaxWidth:"20em",subIndicators:!0,subIndicatorsPos:"append",subIndicatorsText:"",scrollStep:30,scrollAccelerate:!0,showTimeout:250,hideTimeout:500,showDuration:0,showFunction:null,hideDuration:0,hideFunction:function(t,e){t.fadeOut(200,e)},collapsibleShowDuration:0,collapsibleShowFunction:function(t,e){t.slideDown(200,e)},collapsibleHideDuration:0,collapsibleHideFunction:function(t,e){t.slideUp(200,e)},showOnClick:!1,hideOnClick:!0,noMouseOver:!1,keepInViewport:!0,keepHighlighted:!0,markCurrentItem:!1,markCurrentTree:!0,rightToLeftSubMenus:!1,bottomToTopSubMenus:!1,collapsibleBehavior:"default"},$})),function(t){"function"==typeof define&&define.amd?define(["jquery","smartmenus"],t):"object"==typeof module&&"object"==typeof module.exports?module.exports=t(require("jquery")):t(jQuery)}((function(t){return t.extend(t.SmartMenus.Bootstrap={},{keydownFix:!1,init:function(){var e=t("ul.navbar-nav:not([data-sm-skip])");e.each((function(){var e=t(this),s=e.data("smartmenus");if(!s){var i,o=e.is("[data-sm-skip-collapsible-behavior]"),a=e.hasClass("ml-auto")||e.prevAll(".mr-auto").length>0;function n(){e.find("a.current").each((function(){var e=t(this);(e.hasClass("dropdown-item")?e:e.parent()).addClass("active")})),e.find("a.has-submenu").each((function(){var e=t(this);e.is('[data-toggle="dropdown"]')&&e.dataSM("bs-data-toggle-dropdown",!0).removeAttr("data-toggle"),!o&&e.hasClass("dropdown-toggle")&&e.dataSM("bs-dropdown-toggle",!0).removeClass("dropdown-toggle")}))}function r(t){var o=s.getViewportWidth();(o!=i||t)&&(s.isCollapsible()?(e.addClass("sm-collapsible"),e.parents(".navbar").addClass("sm-navbar-collapsible")):(e.removeClass("sm-collapsible"),e.parents(".navbar").removeClass("sm-navbar-collapsible")),i=o)}e.smartmenus({subMenusSubOffsetX:2,subMenusSubOffsetY:-9,subIndicators:!o,collapsibleShowFunction:null,collapsibleHideFunction:null,rightToLeftSubMenus:a,bottomToTopSubMenus:e.closest(".fixed-bottom").length>0,bootstrapHighlightClasses:"",noMouseOver:!!t("body").hasClass("js-menu-dropdown__click")}).on({"show.smapi":function(e,i){var o=t(i),a=o.dataSM("scroll-arrows");a&&a.css("background-color",o.css("background-color")),o.parent().addClass("show"),s.opts.keepHighlighted&&o.dataSM("level")>2&&o.prevAll("a").addClass(s.opts.bootstrapHighlightClasses)},"hide.smapi":function(e,i){var o=t(i);o.parent().removeClass("show"),s.opts.keepHighlighted&&o.dataSM("level")>2&&o.prevAll("a").removeClass(s.opts.bootstrapHighlightClasses)}}),s=e.data("smartmenus"),n(),s.refresh=function(){t.SmartMenus.prototype.refresh.call(this),n(),r(!0)},s.destroy=function(s){e.find("a.current").each((function(){var e=t(this);(e.hasClass("active")?e:e.parent()).removeClass("active")})),e.find("a.has-submenu").each((function(){var e=t(this);e.dataSM("bs-dropdown-toggle")&&e.addClass("dropdown-toggle").removeDataSM("bs-dropdown-toggle"),e.dataSM("bs-data-toggle-dropdown")&&e.attr("data-toggle","dropdown").removeDataSM("bs-data-toggle-dropdown")})),t.SmartMenus.prototype.destroy.call(this,s)},o&&(s.opts.collapsibleBehavior="toggle"),r(),t(window).on("resize.smartmenus"+s.rootId,r)}})),e.length&&!t.SmartMenus.Bootstrap.keydownFix&&(t(document).off("keydown.bs.dropdown.data-api",".dropdown-menu"),t.fn.dropdown&&t.fn.dropdown.Constructor&&t(document).on("keydown.bs.dropdown.data-api",".dropdown-menu.show",t.fn.dropdown.Constructor._dataApiKeydownHandler),t.SmartMenus.Bootstrap.keydownFix=!0)}}),t(t.SmartMenus.Bootstrap.init),t}));
