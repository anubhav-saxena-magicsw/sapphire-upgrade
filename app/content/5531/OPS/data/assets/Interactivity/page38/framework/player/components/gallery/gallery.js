define(["marionette","player/base/base-item-comp","player/components/gallery/grid"],function(e,t,i){var r=t.extend({template:_.template(""),members:{gridId:void 0,placeHolderId:void 0,thmbnailsId:void 0,controllsId:void 0,totalVisible:0,totalSelected:0,lastSelected:-1,defaultView:0,bCirculate:!0},objGrid:void 0,$thumbNails:void 0,$viewControlls:void 0,arrControlls:[],arrThumbs:[],arrSelected:[],initialize:function(e){if(!($(String(e.gridId)).length>0))throw new Error("Template undefined!!!");this.members.gridId=String(e.gridId),$(String(e.placeHolderId)).length>0&&(this.members.placeHolderId=String(e.placeHolderId)),$(String(e.thmbnailsId)).length>0&&(this.members.thmbnailsId=String(e.thmbnailsId)),$(String(e.controllsId)).length>0&&(this.members.controllsId=String(e.controllsId)),(void 0===String(e.circulate)||"false"===String(e.circulate))&&(this.members.bCirculate=!1)},onRender:function(){this.objGrid=new i({gridId:this.members.gridId,placeHolderId:this.members.placeHolderId}),this.objGrid.on("viewClicked",$.proxy(this.onGridViewClick,this)),this.$thumbNails=$(this.members.thmbnailsId),this.$viewControlls=$(this.members.controllsId),this.attachControllEvents(),this.attachThumnailsEvents(),this.objGrid.render(),this.arrControlls[this.members.defaultView].trigger("click")}});return r.prototype.Super=t,r.prototype.onGridViewClick=function(e){this.customEventDispatcher("gridViewClicked",this,{view:$(e.customData.currentTarget),index:$(e.customData.currentTarget).prop("index")})},r.prototype.attachControllEvents=function(){var e=this;this.members.defaultView=parseInt(this.$viewControlls.attr("default")),isNaN(this.members.defaultView)&&(this.members.defaultView=0),$.each(this.$viewControlls.children(),function(t,i){$(i).off("click").on("click",$.proxy(e.handleControllClick,e)),e.arrControlls.push($(i))})},r.prototype.attachThumnailsEvents=function(){var e=this,t=$("<div></div>"),i=0;$.each(this.$thumbNails.children(),function(r,s){$(s).prop("index",r),$(s).off("click").on("click",$.proxy(e.handleThumbClick,e)),i+=$(s).outerWidth(),e.arrThumbs.push($(s)),t.append($(s))}),t.css("width",i+"px"),t.css("height","100%"),this.$thumbNails.append(t)},r.prototype.handleControllClick=function(e){var t,i,r,s;for(t=0;t<this.arrControlls.length;t+=1)s=this.arrControlls[t],s.removeClass("active");s=$(e.currentTarget),i=parseInt(s.attr("rows")),r=parseInt(s.attr("cols")),isNaN(i)||isNaN(r)||(this.objGrid.changeRowColumns({rows:i,columns:r}),s.addClass("active"),this.members.totalVisible=i*r,this.changeThumbsState(),this.customEventDispatcher("viewChanged",this,s))},r.prototype.changeThumbsState=function(){var e,t,i;for(i=this.arrSelected.slice(),e=0;e<i.length;e+=1)t=i[e],-1===this.objGrid.currentGridView.indexOf(t)&&this.deselectThumb(t);this.members.totalSelected=this.arrSelected.length,this.members.lastSelected=this.arrSelected[this.arrSelected.length-1]},r.prototype.handleThumbClick=function(e){var t,i;i=$(e.currentTarget),t=i.prop("index"),i.hasClass("active")||(this.members.totalSelected===this.members.totalVisible&&this.members.bCirculate&&this.deselectThumb(this.members.lastSelected),this.members.totalSelected<this.members.totalVisible&&(this.members.totalSelected+=1,i.addClass("active"),this.objGrid.showView(t),this.customEventDispatcher("thumbClicked",this,t),this.members.lastSelected=t,this.arrSelected.push(t)))},r.prototype.deselectThumb=function(e){var t;t=this.arrThumbs[e],t.hasClass("active")&&(t.removeClass("active"),this.objGrid.hideView(e),this.arrSelected.splice(this.arrSelected.indexOf(e),1),this.members.totalSelected=this.arrSelected.length)},r.prototype.getSelected=function(){return this.arrSelected},r.prototype.destroy=function(){},r});