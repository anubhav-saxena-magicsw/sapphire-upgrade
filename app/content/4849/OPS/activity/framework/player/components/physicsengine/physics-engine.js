/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/
/**
 * PhysicsEngine
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */

define(['marionette', 'player/base/base-item-comp', 'text!components/physicsengine/template/physics-engine.html', 'components/physicsengine/model/physics-engine-model', 'components/physicsengine/js/physics-engine-helper'],

/**
 * A class representing a PhysicsEngine.
 *@class PhysicsEngine
 *@augments BaseItemComp
 *@param {Json} objXml A xml containing canvas width , height, static bodies , dynamic bodies etc.
 *@example
 *
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * <a href="xml/PhysicsEngine.xml" target="blank">Sample 1 xml</a>
 * <a href="xml/PhysicsEngine2.xml" target="blank">Sample 2 xml</a>
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * var  physicsEngineComp, obj = {};
 *
 * SampleLifeMeter.prototype.createBtnHandler = function(objEvent)
 * {
 *		var objClassRef = this;
 *		Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
 *		Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
 *		Data_Loader.on(Data_Loader.DATA_LOAD_SUCCESS, this.xmlLoadSuccessHandler);
 *		Data_Loader.on(Data_Loader.DATA_LOAD_FAILED, this.xmlLoadFailureHandler);
 *		Data_Loader.load({
 *					url : "activity/sampleBallCollision/data/data.xml",
 *					dataType : 'xml',
 *					contentType : 'application/xml',
 *					returnType : 'json',
 *					scope : objClassRef
 *				});
 * };
 *
 * SampleLifeMeter.prototype.xmlLoadSuccessHandler = function(objData, objClassref){
 *		Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
 *		Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
 *		var obj = {};
 *		if(objClassref.$el.find('[id = xml0 ]').is(':checked')){
 *				obj.world = objData.world[0];
 *		}else{
 *				obj.world = objData.world[1];
 *		}
 *
 *		objClassref.getComponent(objClassref, "PhysicsEngine", "onComponentCreated",obj);
 *	};
 *
 * function onComponentCreated(objComp){
 * physicsEngineComp = objComp;
 * }
 * <br>Configurable properties of component:<br>
 * <table border="1" style="white-space:pre-wrap; color:"#000000";"><tr><th>Property</th><th>Type</th><th>Default Value</th><th>Description</th></tr><tr><td>world</td><td>Json String</td><td>undefined</td><td>This property contains the world object.</td></tr></table>
 */
function(Marionette, BaseItemComp, htmlBallCollision, PhysicsEngineModel, PhysicsEngineHelper) {'use strict';
	var PhysicsEngine = BaseItemComp.extend({
		template : _.template(htmlBallCollision),
		/**
		 * Initialization begins here.
		 * @access private
		 * @memberof PhysicsEngine
		 * @param None
		 * @returns None
		 */
		initialize : function(objXml) {

			this.model = new PhysicsEngineModel();
			if (objXml.world.width !== undefined) {
				this.model.set("canWidth", Number(objXml.world.width));
			}
			if (objXml.world.height !== undefined) {
				this.model.set("canHeight", Number(objXml.world.height));
			}
			if (objXml.world.id !== undefined) {
				this.model.set("canId", objXml.world.id);
			}

			this.members = {};

			this.members.helper = new PhysicsEngineHelper(objXml);
			this.members.helper.setParent(this);
		},
		/**
		 * Setting the canvas height and width as passed.
		 * Also initializing the PhysicsEngineHelper object for further computations. .
		 * @access private
		 * @memberof PhysicsEngine
		 * @param None
		 * @returns None
		 */
		onShow : function() {
			var self = this;
			$(this.el).css("width", "100%");
			$(this.el).css("height", "100%");

			this.members.helper.setWorld(this.model.get("canId"));
			
			this.$el.on("click", $.proxy(self.compClick, self));
			this.$el.on("mouseover", $.proxy(self.compRollover, self));
			this.$el.on("mouseout", $.proxy(self.compRollout, self));
		}
	});
	/**
	 * Referencing BaseItemComp..
	 * @access private
	 * @memberof PhysicsEngine
	 * @param None
	 * @returns None
	 */
	PhysicsEngine.prototype.Super = BaseItemComp;
	/**
	 * Facilitiates user to add a static body Circular or Rectangular at run time.
	 * @param {Object} body This object contains the desired values for the body to be added.
	 * The structure of this object should be similar to the structure accepted in xml.
	 * @memberof PhysicsEngine#
	 * @access public
	 * @param None
	 * @returns None
	 */
	PhysicsEngine.prototype.addStaticBody = function(body) {
		this.members.helper.addStaticBody(body);
	};

	/**
	 * Facilitiates user to add a dynamic body Circular or Rectangular at run time.
	 * @param {Object} body This object contains the desired values for the body to be added.
	 * The structure of this object should be similar to the structure accepted in xml.
	 * @memberof PhysicsEngine#
	 * @access public
	 * @param None
	 * @returns None
	 */
	PhysicsEngine.prototype.addDynamicBody = function(body) {
		this.members.helper.addDynamicBody(body);
	};

	/**
	 * Facilitiates user to remove any body Circular or Rectangular at run time.
	 * @param {String} id The id of the body which is either assigned via xml or at runtime.
	 * @memberof PhysicsEngine#
	 * @access public
	 * @param None
	 * @returns None
	 */
	PhysicsEngine.prototype.removeBody = function(id) {
		this.members.helper.removeBody(id);
	};

	/**
	 * Facilitiates user to set position of any body Circular or Rectangular at run time.
	 * @param {String} id The id of the body which is either assigned via xml or at runtime.
	 * @param {Object} objData An object consiting of properties x and y for co-ordinates respectively.
	 * @memberof PhysicsEngine#
	 * @access public
	 * @param None
	 * @returns None
	 */
	PhysicsEngine.prototype.setBodyPosition = function(strId, objData) {
		this.members.helper.setBodyPosition(strId, objData);
	};

	/**
	 * Facilitiates user to get position of any body Circular or Rectangular at run time.
	 * @param none.
	 * @returns {Object} An object consiting of properties x and y for co-ordinates respectively.
	 * @memberof PhysicsEngine#
	 * @access public
	 * @param None
	 * @returns None
	 */
	PhysicsEngine.prototype.getBodyPosition = function(strId) {
		return this.members.helper.getBodyPosition(strId);
	};

	/**
	 * Facilitiates user to apply/change certain property(passed in arguments) to all the existing bodies at any time.
	 * @param {Object} obj An object consiting of properties name(The property that should be applied/changed) and val(The value which should be applied against the Named property) for all existing bodies.
	 * The name property should be an integer constant.
	 * @memberof PhysicsEngine#
	 * @access public
	 * @param None
	 * @returns None
	 * @example
	 * objPhysicsWorld.applyOnAll({name: objPhysicsWorld.SPEED,val : 3});
	 */
	PhysicsEngine.prototype.applyOnAll = function(obj) {
		this.members.helper.applyOnAll(obj);
	};

	/**
	 * Returns the constant reserved for the speed property of bodies.
	 * @const SPEED
	 * @desc This is a readonly integer of value 1.
	 * @memberof PhysicsEngine#
	 * @access private
	 * @param None
	 * @returns None
	 */
	PhysicsEngine.prototype.SPEED = 1;
	
	/**
	 * Returns the constant reserved for the collision of two bodies.
	 * @const ON_COLLISION
	 * @desc This is a readonly string of value on_collision.
	 * @memberof PhysicsEngine#
	 * @access private
	 * @param None
	 * @returns None
	 */
	PhysicsEngine.prototype.ON_COLLISION = "on_collision";

	/**
	 * Facilitiates user to get type of any body Static or Dynamic at run time.
	 * @param none.
	 * @returns {String} static or dynamic.
	 * @memberof PhysicsEngine#
	 * @access public
	 */
	PhysicsEngine.prototype.getBodyType = function(strId) {
		return this.members.helper.getBodyType(strId);
	};

	/**
	 * Destroys PhysicsEngine instance.
	 * @memberof PhysicsEngine#
	 * @access public
	 * @param none.
	 * @returns {Boolean} True or false
	 */
	PhysicsEngine.prototype.destroy = function() {
		this.members.helper.destroy();
		this.members.helper = undefined;
		this.members = undefined;
		this.model.destroy();
		this.model = null;
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");

		return this.Super.prototype.destroy(true);
	};

	return PhysicsEngine;
});

