/*jslint nomen: true*/
/*globals _,$,console,Backbone*/
/**
 * ViewStack
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 */

define(['marionette',
		'player/base/base-composite-comp',
		'components/viewstack/model/viewstack-model',
		'components/viewstack/js/view',
		'components/viewstack/model/view-model'],
		
/** 
 * This class represents a view stack component which can be used into activites.
 * It can be used to create view stack of n number of views.
 * @class ViewStack
 * @augments BaseCompositeComp
 * @param {Object} obj for example {totalViews : 2, classList : [], contentList : [], currentActive : 1}
 * @throws {ERROR} An error if most require value numbers of view is missing.
 * Load module
 * viewstack = new ViewStack({totalViews : 2, classList : [], contentList : [], currentActive : 1});
 * @fires MAX_VIEW
 * @fires MIN_VIEW
 * @fires VIEW_DELETED
 * @fires VIEW_CHANGED
 *@example
 *
 * var viewStackComp,obj = {};
 * //default values will be used if following are not defined
 * obj.totalViews = 8;
 * obj.classList = ['view1', 'view2', 'view3', 'view4', 'view1', 'view2', 'view3', 'view4', 'view1', 'view2', 'view3', 'view4', 'view1', 'view2', 'view3'];
 * obj.contentList = ['demoText1', 'demoText2', 'demoText3', 'demoText4', 'demoText5', 'demoText6', 'demoText7', 'demoText8', 'demoText9', 'demoText10', 'demoText11', 'demoText12', 'demoText13', 'demoText14', 'demoText15'];
 * obj.currentActive = 5;
 * this.getComponent(this, "ViewStack", "onComponentCreated", obj);
 *
 * function onComponentCreated(objComp){
 *  viewStackComp = objComp;
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>totalViews</td><td>Integer</td><td>2</a></td><td>Contains the count of views attached with view stack.</td></tr><tr><td>classList</td><td>Array</td><td>[]</td><td>This property contains the an array of css class names for views.</td></tr><tr><td>contentList</td><td>Array</td><td>[]</td><td>This property contains the content to be added in views.</td></tr><tr><td>currentActive</td><td>integer</td><td>1</td><td>This property defines the default view to be dispalyed as active.</td></tr></table>
 */
	 
function (Marionette, BaseCompositeComp, ViewStackModel, View, ViewModel) {
	'use strict';
	
	var objRef, modelRef, collRef, ViewStack;
	objRef = modelRef = collRef = null;

	ViewStack = BaseCompositeComp.extend({
		template : _.template(""),
		itemView : View,
		tagName : 'div',
		className : 'viewStackLayout',
		
		/**
         * This initializes the ViewStack.
         * @param {type} objViewStackData
         * @returns None
         * @memberof ViewStack
         * @access private
         */
        
		initialize : function (obj) {

			this.model = new ViewStackModel();
			modelRef = this.model;
			objRef = this;
			
			if (objRef.checkPram(obj.totalViews, 'NumberOfView')) {
				modelRef.set("totalViews", obj.totalViews);
			}
						
			if (objRef.checkPram(obj.currentActive, 'CurrentView')) {
				modelRef.set("currentView", obj.currentActive);
			}			

			var arrViewViewModel = [], show, arrViewClasses, arrViewContents, viewNow, ViewCollection;			
			arrViewClasses = obj.classList;
			arrViewContents = obj.contentList;
			viewNow = modelRef.get("currentView");
			show = false;
			ViewCollection = Backbone.Collection.extend({
				model : ViewModel
			});
			_.times(modelRef.get("totalViews"), function (item) {

				var ViewViewModel = new ViewModel();
				
				if ((viewNow - 1) === item) {
					ViewViewModel.set('isVisible', true);
				}
				
				if (arrViewClasses !== undefined) {
					if (arrViewClasses[item] !== undefined) {
						ViewViewModel.set('Viewclass', arrViewClasses[item]);
					}	
				}				
				if (arrViewContents !== undefined) {
					if (arrViewContents[item] !== undefined) {
						ViewViewModel.set('viewContent', arrViewContents[item]);
					}	
				}

				arrViewViewModel.push(ViewViewModel);

			});
			this.collection = new ViewCollection(arrViewViewModel);
			collRef = this.collection;
			arrViewViewModel = null;

			//objThis.listenTo(objThis.model, 'change', objThis.render);
			objRef.listenTo(modelRef, 'change:currentView', objRef.viewUpdate);
			objRef.listenTo(modelRef, 'change:totalViews', function () {
				objRef.trigger(objRef.events.VIEW_DELETED);
			});
		},
		
		/**
		 * This function is called when rendering of component is completed
		 * @access private
		 * @memberof ViewStack
		 * @param None
		 * @returns None
		 */
		onRender : function () {
			//console.log('chnage this')
		},
		
		/**
         * This initializes shows view stack events constants.         
         * @access private
         * @memberof ViewStack
         */
		
		events : {
			MAX_VIEW : "MAX_VIEW",
			MIN_VIEW : "MIN_VIEW",
			VIEW_CHANGED : "VIEW_CHANGED",
			VIEW_DELETED : "VIEW_DELETED"
        },
        
        /**
         * This functions called when a view changed.
         * @param none 
         * @returns none
         * @fires VIEW_CHANGED
         * @access private
         * @memberof ViewStack
         */

		viewUpdate : function () {			
			
			_.each(collRef.models, function (item) {
				item.set('isVisible', false);
			});
			var currentView = objRef.currentSelectedIndex(), viewModel;
			viewModel = collRef.models[currentView - 1];
			viewModel.set('isVisible', true);
			objRef.trigger(objRef.events.VIEW_CHANGED);			
		},
		
		/**
         * This functions called to check the user given valued(i.e. ViewsStack Object Data).
         * @param {number} the Total Views / Current Active Value.
         * @param {String} the value to handle switch case
         * @returns boolean
         * @access private
         * @memberof ViewStack
         */
		
		checkPram : function (pram, type) {
			
			var test = false, errorMsg = '', intNos, intCact;
			switch (type) {
			//only digits
			case 'NumberOfView':
				intNos = /^\d+$/;
				test =  intNos.test(pram);				
				if (!test) {
					console.error("please enter correct no of views");
				}
				break;
			//only digits	
			case 'CurrentView':				
				if (pram === undefined) {
					test = false;
					break;
				}

				intCact = /^\d+$/;
				test =  intCact.test(pram);				
				if (!test) {
					console.error("please enter correct active view");
				}
				break;	
			}
			return test;
		}
		
	});
	
	ViewStack.prototype._super = BaseCompositeComp;
	/**
	 * Total Views
	 * @memberof ViewStack#
	 * @access public
	 * @param None
	 * @returns {number} current selected views in views stack.
	 */
	
	ViewStack.prototype.totalViews = function () {
		return modelRef.get("totalViews");
	};
	
	/**
	 * Index of current selected view .
	 * @memberof ViewStack#
	 * @access public
	 * @param None
	 * @returns {number} total numbers of views in views stack.
	 */

	ViewStack.prototype.currentSelectedIndex = function () {
		return modelRef.get("currentView");
	};
	
	/**
	 * This function show the next view from view stack
	* @memberof ViewStack#
	 * @access public
	 * @param None
	 * @returns None
	 * @fires MAX_VIEW if its is at last view.
	 */
	
	ViewStack.prototype.nextView = function () {
		var ViewIndex = objRef.currentSelectedIndex() + 1;
		objRef.setView(ViewIndex);
	};
	
	/**
	 * This function show the next view from view stack
	 * @memberof ViewStack#
	 * @access public
	 * @fires MIN_VIEW if its is at last view.
	 * @param None
	 * @returns None
	 */
	
	ViewStack.prototype.previousView = function () {
		var ViewIndex = objRef.currentSelectedIndex() - 1;
		objRef.setView(ViewIndex);
	};
	

	/**
	 * This function show view as given by user
	 * @memberof ViewStack#
	 * @access public
	 * @param {Number} leads the given indexed views from view stack.
	 * @returns None
	 */
	
	ViewStack.prototype.setView = function (ViewIndex) {
		
		if (ViewIndex < 1) {
			objRef.trigger(objRef.events.MIN_VIEW);
			return;
		}
		if (ViewIndex > objRef.totalViews()) {
			objRef.trigger(objRef.events.MAX_VIEW);
			return;
		}

		modelRef.set('currentView', ViewIndex);
	};
	
	/**
	 * This function change the css(class/classes)of the current view
	 * @memberof ViewStack#
	 * @access public
	 * @param {String} the class of the current view 
	 * @returns None
	 */
	
	ViewStack.prototype.changeCurrentViewClass = function (ViewClass) {		
		
		var curView = objRef.currentSelectedIndex();
		ViewStack.prototype.chnageClassofView(curView, ViewClass);
	};
	
	/**
	 * This function change the css(class/classes)of the given view
	 * @memberof ViewStack#
	 * @access public
	 * @param {String} the class of the current view
	 * @param {Number} index of the view
	 * @returns None
	 */
	
	ViewStack.prototype.changeClassofView = function (ViewIndex, ViewClass) {

		collRef.models[ViewIndex - 1].set('Viewclass', ViewClass);
	};
	
	/**
	 * This function change the index of the given two view
	 * @memberof ViewStack#
	 * @access public
	 * @param {Number} index of the one view
	 * @param {Number} index of the another view
	 * @returns None
	 */
	
	ViewStack.prototype.changeViewIndex = function (ViewIndex1, ViewIndex2) {

		var curView = objRef.currentSelectedIndex(), model_1;
		if (ViewIndex1 === curView) {
			objRef.changeCurrentViewIndex(ViewIndex2);
			return;
		}
		if (ViewIndex2 === curView) {
			objRef.changeCurrentViewIndex(ViewIndex1);
			return;
		}
		model_1 = collRef.models[ViewIndex1 - 1];
		collRef.models[ViewIndex1 - 1] = collRef.models[ViewIndex2 - 1];
		collRef.models[ViewIndex2 - 1] = model_1;
	};
	
	/**
	 * This function change the index of current view with the view of given index
	 * @memberof ViewStack#
	 * @access public
	 * @param {Number} index of the view
	 * @returns None
	 */
	
	ViewStack.prototype.changeCurrentViewIndex = function (ViewIndex) {

		var curView = objRef.currentSelectedIndex(), index_model;
		index_model = collRef.models[ViewIndex - 1];
		collRef.models[ViewIndex - 1] = collRef.models[curView - 1];
		collRef.models[curView - 1] = index_model;
		objRef.setView(ViewIndex);
	};
	
	/**
	 * This function add the content to the given index's view
	 * @memberof ViewStack#
	 * @access public
	 * @param {Number} index of the view
	 * @param {String} content to be added
	 * @returns None
	 */
	
	ViewStack.prototype.addContentToView = function (ViewIndex, ViewContent) {

		var currentContent = collRef.models[ViewIndex - 1].get('viewContent');
		collRef.models[ViewIndex - 1].set('viewContent', currentContent + ViewContent);
	};
	
	/**
	 * This function remove the given view
	 * @memberof ViewStack#
	 * @access public
	 * @param {Number} index of the view
	 * @returns None
	 */
	
	ViewStack.prototype.removeView = function (ViewIndex) {		
		
		if (ViewIndex <= 1) {
			console.error('can not delete this view');
			return;
		}		
		if (ViewIndex > objRef.totalViews()) {
			console.error('this view does not exist');
			return;
		}
		collRef.models[ViewIndex - 1].destroy();
		modelRef.set("totalViews", modelRef.get("totalViews") - 1);
		
		var curView = objRef.currentSelectedIndex();
		if (curView === ViewIndex) {
			objRef.setView(ViewIndex - 1);
		}
	};
	
	/**
	 * This function remove the cuurent view
	 * @memberof ViewStack#
	 * @access public
	 * @param None
	 * @returns None
	 */
	
	ViewStack.prototype.removeCurrentView = function () {
		
		var curView = objRef.csurrentSelectedIndex();
		objRef.removeView(curView);
	};
	
	/**
	 * This function destroy the whole view stack
	 * @memberof ViewStack#
	 * @access public
	 * @param none
	 * @returns {Boolean} true or false
	 */
	
	ViewStack.prototype.destroy = function () {

		_.invoke(collRef.toArray(), 'destroy');
		objRef.collection = null;
		objRef.model.destroy();
		objRef.model = null;
		objRef.unbind();
		objRef.undelegateEvents();		
		objRef.remove();
		return this._super.prototype.destroy(true);
	};
	
	return ViewStack;

}); 