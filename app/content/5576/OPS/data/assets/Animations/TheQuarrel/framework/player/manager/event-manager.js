define(["marionette","player/constants/errorconst"],function(e,t){var r=function(){this.members.objDictonary={}};return r.prototype.members={EVENT_TYPE:"eventType",EVENT_CONTEXT:"eventContext",EVENT_TARGET:"eventTarget",EVENT_CALLBACK:"eventCallback",objDictonary:void 0},r.prototype.addEventListener=function(e,r,n,o){var E,i,T;if(T=this.getTargetID(r),void 0===T)throw new Error(t.ID_IS_NOT_ASSOCIATED_WITH_OBJECT,r);if(this.searchEventReference()===!0)throw new Error(n+t.IS_ALREADY_REGISTERED+T);E=this.members,i={},i[E.EVENT_CONTEXT]=e,i[E.EVENT_TARGET]=r,i[E.EVENT_TARGET]=n,i[E.EVENT_CALLBACK]=o,E.objDictonary[T+"_"+n]=i,r.bind(n,e,e[o])},r.prototype.removeEventListener=function(e,t){var r=this.getTargetID(e);e.unbind(t),delete this.members.members.objDictonary[r+"_"+t]},r.prototype.getTargetID=function(e){var t;return t=void 0,t=void 0===$(e[0]).attr("id")?e.getID():e.attr("id")},r.prototype.searchEventReference=function(e,t){var r,n;return r=!1,n=this.members.objDictonary[e+"_"+t],void 0!==n},r});