define(["marionette","components/option/option","jqueryUI"],function(e,t){var i=function(e){return this.members.DND_COMP_REF=e,this.members.dndElements={},_.extend(this,Backbone.Events)};return i.prototype.members={DND_COMP_REF:void 0,dndType:void 0,bDropCopy:!1,dndItemView:{},activeDroppable:void 0,activeDraggable:void 0,activeDraggableUI:void 0,revertToPosition:"invalid",dndElements:void 0,itemHolder:void 0,arrDragList:void 0,arrDropList:void 0,dragHelper:!1,itemCounterDrag:0,itemCounterDrop:0,zIndexValue:1,containment:void 0,click:{}},i.prototype.ONE_TO_ONE="oneToOne",i.prototype.ONE_TO_Many="oneToMany",i.prototype.DND_INITLIZED="dndInitlize",i.prototype.DRAGGABLE="draggable",i.prototype.DROPPABLE="droppable",i.prototype.DND_ITEM_DRAG_START_EVENT="dndItemDragStartEvent",i.prototype.DND_ITEM_DROP_EVENT="dndItemDropEvent",i.prototype.DND_ITEM_DRAG_STOP_EVENT="dndItemDragStopEvent",i.prototype.cloneDrag=function(e){this.members.dragHelper="true"===e?!0:!1},i.prototype.dndType=function(e){this.members.dndType=e},i.prototype.dropCopy=function(e){this.members.bDropCopy="true"===e||e===!0?!0:!1},i.prototype.revertToPosition=function(e){this.members.revertToPosition="true"===e?!0:"false"===e?!1:e},i.prototype.CreateDraggble=function(e,t){var i,r;for(r=this.members,r.arrDragList=e,i=0;i<r.arrDragList.length;i+=1)this.createElements(t,r.arrDragList[i],"draggable")},i.prototype.CreateDroppable=function(e,t){var i,r;for(r=this.members,r.arrDropList=e,i=0;i<r.arrDropList.length;i+=1)this.createElements(t,r.arrDropList[i],"droppable")},i.prototype.createElements=function(e,i,r){var o,a,n,s;void 0===this.members.itemHolder&&(this.members.itemHolder=e.find("#dndHolder")),o=r===this.DRAGGABLE?this.members.itemCounterDrag++:this.members.itemCounterDrop++,a=r+"_"+o,n=this.getElementModel(i,a),s=new t,s.model=n,this.members.itemCounter++,s.setName(a),s.render(),s.$el.attr("id",i.id),s.$el.attr("type",r),s.$el.attr("dataCID",s.cid),this.members.itemHolder.append(s.$el),this.members.dndElements[s.cid]=s,r===this.DRAGGABLE&&this.addDragEvent(s.$el),r===this.DROPPABLE&&this.addDropEvent(s.$el),this.members.dndItemView[a]=s,s.$el.removeAttr("style"),s.$el.addClass(r+o)},i.prototype.getElementModel=function(e,t){var i=Backbone.Model.extend({defaults:{parentCID:t,id:e.id,correct:e.correct,label:e.label,type:e.type,img:"",position:void 0}});return new i},i.prototype.addDropEvent=function(e){var t=this;e.droppable({drop:function(e,i){t.handleDropEvent(e,i)}})},i.prototype.addDragEvent=function(e){var t=this;$(e).draggable({containment:"parent",revert:function(e){return t.handleDragRevert(e)},start:function(e,i){t.handleDragStart(e,i)},stop:function(e,i){t.handleDragStop(e,i)},drag:function(e,i){t.handleDragItemMovement(e,i)}}),this.members.dragHelper&&$(e).draggable({helper:"clone"}),void 0!==this.containment&&$(e).draggable({containment:this.containment})},i.prototype.initlizeDraggable=function(){this.trigger(this,this.DND_INITLIZED,this)},i.prototype.handleDragStart=function(e,t){var i,r,o,a,n,s,p;i=this,this.members.click.x=e.clientX,this.members.click.y=e.clientY,this.members.zIndexValue++,this.members.activeDraggable=e.currentTarget,this.members.activeDraggableUI=t,this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DRAG_START_EVENT,this.getEventData()),$(this.members.activeDraggable).css("z-index",this.members.zIndexValue),this.members.dragHelper&&(this.members.zIndexValue++,t.helper.css("z-index",this.members.zIndexValue)),$(this.members.activeDraggable).draggable({stack:$(i.members.itemHolder)}),r=$(e.target).attr("datacid"),o=this.members.dndElements[r],void 0===o.model.get("position")&&(a={},p=t.originalPosition,n=(e.clientX-this.members.click.x+p.left)/this.members.DND_COMP_REF.getStageScaleValue(),s=(e.clientY-this.members.click.y+p.top)/this.members.DND_COMP_REF.getStageScaleValue(),a.left=n,a.top=s,o.model.set("position",a))},i.prototype.handleDragStop=function(){this.members;this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DRAG_STOP_EVENT,this.getEventData())},i.prototype.handleDragItemMovement=function(e,t){var i,r,o,a,n,s,p;o=t.originalPosition,i=(e.clientX-this.members.click.x+o.left)/this.members.DND_COMP_REF.getStageScaleValue(),r=(e.clientY-this.members.click.y+o.top)/this.members.DND_COMP_REF.getStageScaleValue(),void 0!==this.containment&&(a=$(this.containment).position().left,n=$(this.containment).position().top,s=a+$(this.containment).width()-$(this.members.activeDraggable).width(),p=n+$(this.containment).height()-$(this.members.activeDraggable).height(),a>i?i=a:i>s&&(i=s),n>r?r=n:r>p&&(r=p)),t.position.left=i,t.position.top=r},i.prototype.handleDropEvent=function(e){this.members.activeDroppable=this.members.bDropCopy===!0&&this.members.cloneDrag===!0?e.target:e.target},i.prototype.verifyDroppedItem=function(e){var t,i,r,o,a,n,s,p;return t=$(e).attr("datacid"),i=this.members.dndElements[t],r=i.model.get("isFilled"),r===!0&&this.ONE_TO_ONE===this.members.dndType?!0:(o=$(this.members.activeDraggable).attr("datacid"),a=this.members.dndElements[o],n=a.model,i.model.set("dragItem_cid",o),i.model.set("isCorrect",n.get("correct")===i.model.get("id")),i.model.set("isFilled",!0),s=this.members,s.dragHelper!==!0&&s.bDropCopy!==!0&&void 0!==n.get("droppedAt")&&(p=this.getItemModel(n.get("droppedAt")),p.set("isFilled",!1)),n.set("droppedAt",t),!1)},i.prototype.getItemModel=function(e){var t,i;return i=this.members.dndElements[e],t=i.model},i.prototype.handleCloneReturn=function(e,t){$(t).draggable("destroy"),$(t).remove();var i=this.getItemModel($(t).attr("droppedcid"));i.set("isFilled",!1)},i.prototype.handleDragRevert=function(){var e,t,i,r,o;return t=this.members,t.dragHelper===!0&&t.bDropCopy===!0&&void 0!==t.activeDroppable?(t.activeDraggable=$(t.activeDraggableUI.helper).clone(),e=this.verifyDroppedItem(t.activeDroppable),e===!1&&(t.itemHolder.append(t.activeDraggable),$(t.activeDraggable).attr("droppedcid",$(t.activeDroppable).attr("datacid")),this.setElementInCenter(t.activeDraggable,t.activeDroppable),i=this,t.activeDraggable.draggable({start:function(e){i.members.click.x=e.clientX,i.members.click.y=e.clientY},revert:function(e){return i.handleCloneReturn(e,this)},drag:function(e,t){var r,o,a;a=t.originalPosition,r=(e.clientX-i.members.click.x+a.left)/i.members.DND_COMP_REF.getStageScaleValue(),o=(e.clientY-i.members.click.y+a.top)/i.members.DND_COMP_REF.getStageScaleValue(),t.position.left=r,t.position.top=o}})),t.activeDroppable=t.activeDraggable=t.activeDraggableUI=void 0,e):void 0!==t.activeDroppable?(e=this.verifyDroppedItem(t.activeDroppable),this.setElementInCenter(t.activeDraggable,t.activeDroppable),t.activeDroppable=void 0,e):void 0===t.activeDroppable?(r={},r.left=$(t.activeDraggable).position().left,r.top=$(t.activeDraggable).position().top,r.dragItem=t.activeDraggable,r.dragItemHolder=t.activeDroppable,o=this.members.dndElements[$(this.members.activeDraggable).attr("datacid")],r.isCorrect=o.model.get("dragItem_cid"),this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DROP_EVENT,r),t.activeDraggableUI.originalPosition.left=o.model.get("position").left,t.activeDraggableUI.originalPosition.top=o.model.get("position").top,this.setDropTargetData()):this.members.revertToPosition},i.prototype.setDropTargetData=function(){var e,t,i,r,o,a;return e=this.members,e.dragHelper===!0&&e.bDropCopy===!0&&void 0===e.activeDroppable?!0:(t=$(e.activeDraggable).attr("datacid"),i=e.dndElements[t],r=i.model,o=r.get("droppedAt"),void 0!==o?(a=e.dndElements[o].model,a.set("dragItem_cid",void 0),a.set("isFilled",!1),e.activeDraggableUI.originalPosition.left=r.get("position").left,e.activeDraggableUI.originalPosition.top=r.get("position").top,e.activeDraggableUI=void 0,e.activeDroppable=void 0,r.set("droppedAt",void 0),this.members.revertToPosition):void 0)},i.prototype.setElementInCenter=function(e,t){var i,r;e=$(e),t=$(t),i=parseFloat(t.css("left"))+(t.innerWidth()-e.innerWidth())/2,r=parseFloat(t.css("top"))+(t.innerHeight()-e.innerHeight())/2,e.css("position","absolute"),e.css("left",i+"px"),e.css("top",r+"px"),this.members.DND_COMP_REF.dispatchDnDEvent(this.DND_ITEM_DROP_EVENT,this.getEventData())},i.prototype.freezOption=function(e){$(e).draggable("disable")},i.prototype.removeDragFeatureFromOption=function(e){$(e).draggable("destroy")},i.prototype.setContainment=function(e){this.containment=e},i.prototype.getContainment=function(){return this.containment},i.prototype.getEventData=function(){var e,t,i,r,o={},a=this.members;return t=void 0,this.members.activeDraggable&&(o.left=$(this.members.activeDraggable).position().left,o.top=$(this.members.activeDraggable).position().top),this.members.activeDroppable&&(o.left=$(this.members.activeDroppable).position().left,o.top=$(this.members.activeDroppable).position().top,t=$(a.activeDroppable).attr("datacid")),o.dragItem=this.members.activeDraggable,o.dragItemHolder=this.members.activeDroppable,void 0!==t&&(e=$(a.activeDraggable).attr("datacid"),i=a.dndElements[e],r=i.model,o.isCorrect=r.get("correct")===$(this.members.activeDroppable).attr("id")),o},i.prototype.destroy=function(){},i});