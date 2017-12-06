define(["marionette","jqueryUI","jqueryTouchPunch","player/base/base-item-comp","text!components/identifier/template/identifier.html","components/identifier/model/identifier-model","components/identifier/js/identifierconst","css!components/identifier/template/style/identifier.css"],function(t,e,n,o,i,r,s){var a=[],c=[",",".","?"],l=o.extend({template:_.template(i),content:null,objProperty:null,compData:null,objContainer:null,objSpan:null,objColorVal:"#000000",correctAnswer:null,initialize:function(t){this.initializeComp(t)},initializeComp:function(t){this.compData=t,this.model=new r,this.parseCompData(this,t,this.model)},parseCompData:function(t,e,n){if(t.content=e.content,t.objProperty=e.property,t.correctAnswer=e.correctAnswer,-1==t.content.search("<span>")){for(var o=t.content.split(" "),i=0,r="";i<o.length;)r+=t.checkPunctuation(o[i])?"<div class='highlightercontainer'><span class='adjustmargin' id='span_"+i+"' isclicked='false' index='"+i+"'>"+o[i]+"</span><div id='logo_"+i+"' class='logoCont_none'></div></div>":"<div class='highlightercontainer'><span id='span_"+i+"' isclicked='false' index='"+i+"'>"+o[i]+"</span><div id='logo_"+i+"' class='logoCont'></div></div>",i++;t.content=r}n.set("content",t.content),n.set("property",t.objProperty),void 0!==e.color&&(t.objColorVal=e.color),n.set("color",t.objColorVal)},onRender:function(){this.initIdentifier()},onShow:function(){this.configureView(this)},initIdentifier:function(){this.objContainer=this.$("#identifierWrapper")},attachSelectionEvent:function(){this.objSpan=this.$("#identifierWrapper span"),$(this.objSpan).on("mousedown",this,this.mouseInteractionOnSpan),$(this.objSpan).on("mouseup",this,this.mouseInteractionOnSpan),this.$('input[type="button"]').on("click",this,this.btnClickHandler)},btnClickHandler:function(t){var e=t.target.id;switch(e){case"check":t.data.checkAnswer();break;case"your":t.data.yourAnswer();break;case"correct":t.data.setCorrectAnswer();break;case"reset":t.data.resetIdentifier();break;case"disable":t.data.getResult()}},mouseInteractionOnSpan:function(t){var e,n;"mousedown"===t.type?t.data.trigger(s.EVENTS.MOUSEDOWN_ON_SPAN,t.target.id):(e=$(t.target).attr("isclicked"),void 0!==e&&(n="true"===e?"false":"true",$(t.target).attr("isclicked",n),t.data.applyStyle($(t.target),n)),t.data.trigger(s.EVENTS.MOUSEUP_ON_SPAN,t.target.id))},configureView:function(t){t.content=t.model.get("content"),$(t.objContainer).append(t.content),t.attachSelectionEvent()},resetIdentifier:function(){this.removeAllSelectedStyle(),a=[],$(this.objSpan).removeClass("disableItem")}});return l.prototype.Super=o,l.prototype.applyStyle=function(t,e){var n,o,i,r={};switch(r.domId=t.attr("id"),r.index=t.attr("index"),r.spanValue=t.text(),e="true"===e?!0:!1,o=this.model.get("property")){case s.CONSTANTS.HIGHLIGHTER:e?(n=this.objColorVal,r.style=o):(n="#000000",r.style="none"),t.css("color",n);break;case s.CONSTANTS.UNDERLINE:e?(i="underline",r.style=o):(i="none",r.style="none"),t.css("text-decoration",i)}this.saveUserAction(r)},l.prototype.getUserActionArr=function(){return a},l.prototype.setUserActionArr=function(t){a=t},l.prototype.saveUserAction=function(t){if(a.length>0)for(var e=0;e<a.length;)a[e].domId===t.domId&&a.splice(e,1),e++;"none"!=t.style&&a.push(t)},l.prototype.checkPunctuation=function(t){var e,n=!1;for(e=0;e<c.length;e++)c[e]===t&&(n=!0);return n},l.prototype.search=function(t,e){var n,o=!1;for(n=0;n<t.length;n++)t[n].spanValue===e.spanValue&&t[n].index==e.index&&(o=!0);return o},l.prototype.checkAnswer=function(){this.disableIdentifier(),this.computeAction()},l.prototype.setCorrectAnswer=function(){this.removeAllSelectedStyle();for(var t=0;t<this.correctAnswer.length;)this.setCorrectStyles(this.correctAnswer[t]),t++},l.prototype.setCorrectStyles=function(t){var e,n=this;$("#identifierWrapper span").filter(function(){var o=$(this).attr("index");if(t.spanValue===$(this).text()&&t.index==o){e=t.style[0];var i=n.getDivId($(this).attr("id"));switch(e){case s.CONSTANTS.HIGHLIGHTER:$(this).css("color",n.objColorVal),$(this).attr("isclicked","true"),$(i).removeClass("inCorrectResponse").addClass("correctResponse");break;case s.CONSTANTS.UNDERLINE:$(this).css("text-decoration","underline"),$(this).attr("isclicked","true"),$(i).removeClass("inCorrectResponse").addClass("correctResponse")}}})},l.prototype.yourAnswer=function(){this.removeAllSelectedStyle(),this.setUserActions(),this.computeAction()},l.prototype.setUserActions=function(){for(var t,e,n=0;n<a.length;){switch(t=a[n].style,e="#"+a[n].domId,$(e).attr("isclicked","true"),t){case s.CONSTANTS.HIGHLIGHTER:$(e).css("color",this.objColorVal);break;case s.CONSTANTS.UNDERLINE:$(e).css("text-decoration","underline")}n++}},l.prototype.computeAction=function(){for(var t,e,n=0;n<a.length;)t=this.getDivId(a[n].domId),e=this.search(this.correctAnswer,a[n]),e?$(t).removeClass("inCorrectResponse").addClass("correctResponse"):$(t).removeClass("correctResponse").addClass("inCorrectResponse"),n++},l.prototype.getDivId=function(t){var e=t,n=e.indexOf("_")+1,o=e.length-n,i="#logo_"+e.substr(n,o);return i},l.prototype.getResult=function(){for(var t,e,n=0,o=[];n<this.correctAnswer.length;){if(this.correctAnswer.length==a.length){if(e=this.search(a,this.correctAnswer[n]),!e){t=!1;break}t=!0}else t=!1;n++}return o.push(t),o},l.prototype.removeAllSelectedStyle=function(){$("#identifierWrapper span").attr("style",""),$("#identifierWrapper span").attr("isclicked","false");var t=$("#identifierWrapper .highlightercontainer div");t.each(function(){$(this).hasClass("logoCont")&&($(this).attr("class",""),$(this).attr("class","logoCont"))})},l.prototype.disableIdentifier=function(){$(this.objSpan).addClass("disableItem")},l.prototype.flush=function(){this.model.id=null,this.model.destroy(),this.model=null},l.prototype.destroy=function(){return c=[],this.flush(),a=[],this.content=null,this.objProperty=null,this.compData=null,this.objContainer=null,this.objSpan=null,this.objColorVal="#000000",this.correctAnswer=null,this.close(),this.Super.prototype.destroy(!0)},l});