/*jslint nomen: true */
/*globals console,Backbone,device,_,$*/

/**
 * SimEventController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette'], function(Marionette) {
	'use strict';
	var SimEventController = Backbone.Marionette.Controller.extend({
		EVENT_TYPE : "type",
		ID : "id",

		objEvent_dict : null,
		objComp_dict : null,
		objActivityRef : null,
		objActivityHelper : null,
		objSelectorDict : null,

		constructor : function() {
			this.objSelectorDict = {};
			this.objEvent_dict = {};
			this.objComp_dict = {};
		}
	});

	/**
	 * Method 'registerComponentEvents' is rsponsible to bind all events associated with a component
	 * and manage their dictionary which are provided in screen json file.
	 * this method also responsible to create task dictionary which needs to be do when
	 * a event triggered by a component.
	 *
	 * @param {Object} objCompData Events and associated task data.
	 * @return {none}
	 * @memberof SimEventController
	 * @access private
	 */
	SimEventController.prototype.registerComponentEvents = function(objCompData, bGlobalComp) {

		var objEventData = {}, jsonEvents = [], objSimComponent, objClassRef = this, strEventName, i, taskIndex, arrTaskList = [];
		if (bGlobalComp) {
			//console.log("objCompData.jsonData.events!!!!!!!!", objCompData.jsonData);
		}

		objSimComponent = objCompData.objComp;
		if (objCompData.jsonData.events !== undefined) {
			if (Array.isArray(objCompData.jsonData.events) === false) {
				jsonEvents = [objCompData.jsonData.events];
			} else {
				jsonEvents = objCompData.jsonData.events;
			}

			//	for ( taskIndex = 0; taskIndex < jsonEvents.length; taskIndex += 1) {
			_.each(jsonEvents, function(data, index) {
				_.each(data, function(objCompEventData, strKey) {
					strEventName = strKey;
					arrTaskList = [];

					if (Array.isArray(objCompEventData) === true) {
						for ( i = 0; i < objCompEventData.length; i += 1) {
							objEventData = objClassRef.createEventDict(objSimComponent, objCompEventData[i]);
							arrTaskList.push(objEventData);
						}
					} else {
						objEventData = objClassRef.createEventDict(objSimComponent, objCompEventData);
						arrTaskList.push(objEventData);
					}
					objSimComponent.on(strEventName, $.proxy(objClassRef.handleSimComponentEvents, objClassRef));
				});
				if (objClassRef.objEvent_dict[objSimComponent.getID() + "_" + strEventName] !== undefined) {
					throw new Error(objSimComponent.getID() + " " + objClassRef.objActivityRef.objErrConst.IS_ALREADY_REGISTERED + " " + strEventName);
				}

				if (objClassRef.objEvent_dict[objSimComponent.getID() + "_" + strEventName] !== undefined) {
					throw new Error(objSimComponent.getID() + " is alreay registred with " + strEventName);
				}
				objClassRef.objEvent_dict[objSimComponent.getID() + "_" + strEventName] = arrTaskList;
			});
		}

		//adding reference in comp list will be used when a component dispatched a event
		//to call other component method
		//require even this component does not dispatach any event.
		objClassRef.objComp_dict[objSimComponent.getID()] = objSimComponent;
		this.trigger(objClassRef.objActivityRef.ActivityEventConst.COMP_EVENT_REGISTER_COMPLETE, bGlobalComp);

	};

	/**
	 * Unhook events of screen component
	 * @param {Object} screenComp
	 * @return {Boolean} bSuccess return true if events unregistered successfully.
	 * @access private
	 * @memerof SimEventController#
	 */
	SimEventController.prototype.unregisterScreenCompEvnets = function(screenComp) {
		var bSuccess = false, i = 0, objClassRef = this;
		bSuccess = objClassRef.unregisterComponentEvents(screenComp);
		return bSuccess;
	};

	/**
	 * unbind all events of given component reference as parameter
	 * @param {Object} objCompData component reference and event data.
	 * @return {Boolean} bSuccess return true if events unregistered successfully.
	 * @access private
	 * @memerof SimEventController#
	 */
	SimEventController.prototype.unregisterComponentEvents = function(objCompData) {
		var objEventData = {}, jsonEvents, objSimComponent, objClassRef = this, strEventName, i, bSuccess = false;
		bSuccess = (objCompData.jsonData.events === undefined);
		if (objCompData.jsonData.events !== undefined) {
			jsonEvents = objCompData.jsonData.events;
			objSimComponent = objCompData.objComp;
			_.each(jsonEvents, function(objCompEventData, strKey) {
				strEventName = strKey;
				objSimComponent.off(strEventName);
				_.each(objCompEventData, function(objEventKey, key2) {
						delete objClassRef.objEvent_dict[objSimComponent.getID() + "_" + key2];	
				});
				
				delete objClassRef.objComp_dict[objSimComponent.getID()];
			});
			bSuccess = true;
		}

		return bSuccess;
	};

	/**
	 * Create and store component event
	 * @param {Object} objComp
	 * @param {Object} objEventData
	 */
	SimEventController.prototype.createEventDict = function(objComp, objEventData) {
		var arrParameters = [], strTargetName, strEventName, arrParametesrs = [], objEvent = {}, arrCalculateAndSend = [];
		objEvent.targetId = objEventData.target;
		objEvent.methodName = objEventData.method;
		objEvent.region = objEventData.region;
		_.each(objEventData.params, function(value, strKey) {
			arrParameters.push(((value === "true") ? true : (value === "false") ? false : value));
			if (strKey === "self") {
				var objCalAndSend = {};
				objCalAndSend.target = strKey;
				objCalAndSend.variableName = value;
				arrCalculateAndSend.push(objCalAndSend);
			}
		});
		objEvent.params = arrParameters;
		objEvent.calculate = arrCalculateAndSend;
		return objEvent;
	};

	/**
	 * Execute every time when a event triggred by a component
	 * This method is responsible to find associated task list from dictionary and execute them
	 * witht the help of 'executeTask' method.
	 * @param {Object} objEvent
	 * @return none
	 * @access private
	 * @memberof SimEventController#
	 */
	SimEventController.prototype.handleSimComponentEvents = function(objEvent) {
		var objComponent = objEvent.target, objTask, strKeyValue, i;
		strKeyValue = objEvent.target.getID() + "_" + objEvent.type;
		if (objEvent.target !== undefined) {
			strKeyValue = objEvent.target.getID() + "_" + objEvent.type;
			objTask = this.objEvent_dict[strKeyValue];

			//handling multiple task defined in event node of json data.
			for ( i = 0; i < objTask.length; i += 1) {
				this.executeTask($.extend(true, {}, objTask[i]), objEvent);
			}
		}
	};

	SimEventController.prototype.executeTask = function(objTask, objEvent) {
		var objWidgetRef;
		switch(objTask.targetId) {
		case "self":
			objTask.region = (this.objActivityRef.strRegionName === objTask.region) ? undefined : objTask.region;
			//sending event as it is received if scope is in same activity.
			if (objTask.region !== undefined) {
				objTask.subTask = this.objActivityRef.ActivityEventConst.CALL_AND_UPDATE_COMPONENT;
				if (objEvent !== undefined && objEvent.customData !== undefined) {
					objTask.params.push(objEvent.customData);
					objTask.eventTarget = objEvent.target;
				}
				this.objActivityRef.broadcastEvent(this.objActivityRef.ActivityEventConst.MANAGE_COMMON_BROADCAST_EVENT, objTask);
			} else {
				if (objEvent !== undefined) {
					objTask.params.push(objEvent);
				}
				this.calculateAndSetParameter(objTask);
				this.objActivityRef[objTask.methodName].apply(this.objActivityRef, objTask.params);
			}
			break;
		case "helper":
			//sending event as it is received if scope is in same activity.
			if (objTask.region !== undefined) {
				objTask.subTask = this.objActivityRef.ActivityEventConst.CALL_AND_UPDATE_COMPONENT;
				if (objEvent !== undefined && objEvent.customData !== undefined) {
					objTask.params.push(objEvent.customData);
					objTask.eventTarget = objEvent.target;
				}
				this.objActivityRef.broadcastEvent(this.objActivityRef.ActivityEventConst.MANAGE_COMMON_BROADCAST_EVENT, objTask);
			} else {
				if (objEvent !== undefined) {
					objTask.params.push(objEvent);
				}
				this.calculateAndSetParameter(objTask);
				this.objActivityRef.objScreenHelper[objTask.methodName].apply(this.objActivityRef.objScreenHelper, objTask.params);
			}
			break;

		default:
			//passing only data dispatched by component
			if (objEvent !== undefined && objEvent.customData !== undefined && !$.isEmptyObject(objEvent.customData)) {
				objTask.params.push(objEvent.customData);
			}

			//sending event as it is received if scope is in same activity.
			if (objTask.region !== undefined) {
				objTask.subTask = this.objActivityRef.ActivityEventConst.CALL_AND_UPDATE_COMPONENT;
				if (objEvent !== undefined && objEvent.customData !== undefined) {
					objTask.params.push(objEvent.customData);
				}

				this.objActivityRef.broadcastEvent(this.objActivityRef.ActivityEventConst.MANAGE_COMMON_BROADCAST_EVENT, objTask);
			} else {
				//try {
				//console.log(this.objComp_dict, objTask.targetId, " :::::: ", this.objComp_dict[objTask.targetId], this.objComp_dict[objTask.targetId].getID());
				this.objComp_dict[objTask.targetId][objTask.methodName].apply(this.objComp_dict[objTask.targetId], objTask.params);
				//} catch(err) {
				//	console.warn("'" + objTask.methodName + "' not found in " + objWidgetRef + " widget.");
				//}

			}
			break;
		}
	};

	/**
	 * Invoked when editor mode set to true, this method is responsible to
	 * register 'component selector' event.
	 * @param {Object} objSelectorRef
	 * @return {none}
	 * @access private
	 * @memberof #SimEventController
	 */
	SimEventController.prototype.registerSelectorEvent = function(objSelectorRef) {
		var objClassref = this;
		objSelectorRef.on(this.objActivityRef.ActivityEventConst.SELECTOR_CLICK_EVENT, objClassref.objActivityRef.onComponentSelected, objClassref.objActivityRef);
		objSelectorRef.on(this.objActivityRef.ActivityEventConst.COMPONENT_DESELECTED, objClassref.objActivityRef.onComponentDeselected, objClassref.objActivityRef);
		objSelectorRef.on(this.objActivityRef.ActivityEventConst.COMPONENT_DATA_PROPERTY_UPDATED, objClassref.objActivityRef.onCompUpdatedFromSelector, objClassref.objActivityRef);
	};

	/**
	 * Invoked when editor mode set to true, this method is responsible to
	 * remove 'component selector' event.
	 * @param {Object} objSelectorRef
	 * @return {none}
	 * @access private
	 * @memberof #SimEventController
	 */
	SimEventController.prototype.removeSelectorEvent = function(objSelectorRef) {
		objSelectorRef.off(this.objActivityRef.ActivityEventConst.SELECTOR_CLICK_EVENT);
		objSelectorRef.off(this.objActivityRef.ActivityEventConst.COMPONENT_DESELECTED);
		objSelectorRef.off(this.objActivityRef.ActivityEventConst.COMPONENT_DATA_PROPERTY_UPDATED);
	};

	/**
	 * Invoked when editor mode set to true, this method is responsible to
	 * register 'tab button' event.
	 * @param {Object} objTabBtn
	 * @return {none}
	 * @access private
	 * @memberof #SimEventController
	 */
	SimEventController.prototype.registerTabBtnEvent = function(objTabBtn) {
		var objClassref = this;
		objTabBtn.on("click", objClassref, objClassref.handleComponentTabBtn);
	};

	SimEventController.prototype.handleComponentTabBtn = function(objEvent) {
		var objClassref = objEvent.data, strCompId;
		objEvent.stopPropagation();
		strCompId = objEvent.currentTarget.id.split("TabBtnEditor_")[1];
		objClassref.objActivityRef.onComponentTabBtnClick.apply(objClassref.objActivityRef, [strCompId]);
	};

	/**
	 * responsible to remove tab button of a component.
	 * register 'tab button' event.
	 * @param {Object} objTabBtn
	 * @return {none}
	 * @access private
	 * @memberof #SimEventController
	 */
	SimEventController.prototype.removeTabBtnEvent = function(objTabBtn) {
		if (objTabBtn) {
			objTabBtn.off("click");
		}
	};

	SimEventController.prototype.calculateAndSetParameter = function(objTask) {
		var i = 0, newValue, index;
		for ( i = 0; i < objTask.calculate.length; i += 1) {
			switch(objTask.calculate[i].target) {
			case "self":
				newValue = objTask.eventTarget[objTask.calculate[i].variableName];
				index = objTask.params.indexOf(objTask.calculate[i].variableName);
				objTask.params[index] = newValue;
				break;
			}
		}
	};
	return SimEventController;
});
