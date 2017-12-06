/*jslint nomen: true*/
/*globals console,Backbone,_,$*/

/**
 * CanvasComp
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */
define(['components/case/case', 'components/canvas/fabric', 'css!components/canvas/css/canvas.css'], function(Case, Fabric) {
	'use strict';
	var CanvasComp;
	/**
	 * @class CanvasComp
	 *
	 *
	 */

	CanvasComp = Case.extend({
		objData : null,
		template : _.template(''),
		objChildList : undefined,
		canvas : null,
		storeObjects : null,
		defaultBrushColor : 'black',
		defaultBrushWidth : 1,

		initialize : function(objData) {
			this.objChildList = [];
			this.objData = objData;
			//this property is being used in component selector for editing.
			this.componentType = "canvas";
			if ( typeof this.objData.state === 'object') {
				this.setState(this.objData.state);
			}
		},

		onRender : function() {
			var scope = this;
			if (this.objData.styleClass !== undefined) {
				this.$el.addClass(this.objData.styleClass);
				this.$el.attr('id', this.strCompId);
			}

			if (this.bEditor === false) {
				this.$el.append('<canvas id="' + this.objData.styleClass + '_canvas" width="' + this.$el.width() + '" height="' + this.$el.height() + '"></canvas>');
				this.canvas = new fabric.Canvas(this.objData.styleClass + '_canvas', {
					selection : false,
					imageSmoothingEnabled : false
				});
				this.canvas.on("after:render", function() {
					scope.canvas.calcOffset();
				});

				this.canvas.freeDrawingBrush.color = this.defaultBrushColor;
				this.canvas.freeDrawingBrush.width = this.defaultBrushWidth;
				this.canvas.backgroundColor = this.objData.canvascolor;
				this.canvas.isDrawingMode = false;
				this.canvas.selectable = false;
				this.canvas.renderAll();
				window.tempCanvasRef = this.canvas;
			}

		},

		onShow : function() {
			this.customEventDispatcher(this.eventConst.CREATION_COMPLETE, this, this);
		}
	});

	CanvasComp.prototype.GET_STATE_EVENT = "getStateEvent";

	CanvasComp.prototype.SET_STATE_EVENT = "setStateEvent";

	/**
	 * This method is will return the canvas reference.
	 * @param {NULL}
	 * @return {Object} canvas reference
	 * @access public
	 * @memberof CanvasComp#
	 */
	CanvasComp.prototype.getCanvasContext = function() {
		console.log("getCanvasContext!!!!!!!!!!!!!!!!!!!!!");
		return this.canvas;
	};

	/**
	 * This method is responsible clear the canvas.
	 * @param {NULL}
	 * @return {NULL}
	 * @access public
	 * @memberof CanvasComp#
	 */
	CanvasComp.prototype.clearCanvas = function() {
		this.canvas.clear();
	};
	/**
	 * This method is responsible to get the present State CanvasComp.
	 * @param {NULL}
	 * @return {object}
	 * @access public
	 * @memberof CanvasComp#
	 */
	CanvasComp.prototype.getState = function() {
		var i, objects = this.canvas.getObjects(), groupArray = [], objectList;
		for (i in objects) {
			groupArray[groupArray.length] = fabric.util.object.clone(objects[i]);
		}

		objectList = new fabric.Group(groupArray);
		this.customEventDispatcher(this.GET_STATE_EVENT, this, objectList);
		return {
			'objList' : objectList
		};
	};


	/**
	 * This method is responsible to set the  State CanvasComp.
	 * @param {object} obj
	 * @return {NULL}
	 * @access public
	 * @memberof CanvasComp#
	 */
	CanvasComp.prototype.setState = function(obj) {
		var objectsList;
		if ( typeof obj === 'object') {
			if ( typeof obj['objList'] !== undefined) {
				objectsList = obj['objList'];
				this.canvas.clear();
				this.canvas.add(objectsList);
				this.customEventDispatcher(this.SET_STATE_EVENT, this, this);
			}
		}

	};

	/**
	 * This method is responsible to check that given component type
	 * can be added in its dom or not
	 * will return true if given component type (in parameter) can be added
	 * in its dom.
	 * @param {Object} strCompType
	 * @return {Boolean}
	 * @access private
	 * @memberof CanvasComp#
	 */
	CanvasComp.prototype.isValid = function(strCompType) {
		var bValid;
		bValid = (strCompType === "case") ? true : false;
		return bValid;
	};

	CanvasComp.prototype.CanvasCompSuper = Case;

	CanvasComp.prototype.destroy = function() {
		delete this.objData;
		this.objChildList = null;
		this.$el.off('click');
		return this.CanvasCompSuper.prototype.destroy.call(this, true);
	};

	return CanvasComp;
});
