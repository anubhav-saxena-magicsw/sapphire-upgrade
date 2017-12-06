/*jslint nomen: true*/
/*globals Backbone,_,$,console,Box2D*/

/**
 * Body
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * Here is the full license text and copyright
 * notice for this file. Note that the notice can span several
 * lines and is only terminated by the closing star and slash.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */

define([], function() {"use strict";
	/**
	 * A class representing Body.
	 * @class Body
	 * @access private
	 */
	var Body = function() {

	};

	/**
	 * Initialize the body object.
	 * @access private
	 */
	Body.prototype.init = function(BOX2D) {
		this.BOX2D = BOX2D;
		this.fixDef = new BOX2D.b2FixtureDef();
		this.bodyDef = new BOX2D.b2BodyDef();
		this.view = undefined;
		this.world = undefined;
	};
	
	/**
	 * Returns the view property for body.
	 * @access private
	 */
	Body.prototype.getView = function() {
		return this.view;
	};
	
	/**
	 * Returns the fixture definition property for body.
	 * @access private
	 */
	Body.prototype.getFixDef = function() {
		return this.fixDef;
	};

	/**
	 * Returns the body definition property for body.
	 * @access private
	 */
	Body.prototype.getBodyDef = function() {
		return this.bodyDef;
	};
	
	/**
	 * Returns the userdata property for body.
	 * @access private
	 */
	Body.prototype.getUserData = function() {
		return this.bodyDef.userData;
	};
	
	/**
	 * Sets the type for body.
	 * @access private
	 */
	Body.prototype.setType = function(strType) {
		this.bodyDef.type = strType;
	};
	
	/**
	 * Sets the userdata for body.
	 * @access private
	 */
	Body.prototype.setUserData = function(objData) {
		this.bodyDef.userData = objData;
	};
	
	/**
	 * Sets the liniear velocity for body.
	 * @access private
	 */
	Body.prototype.setLinearVelocity = function(objData) {
		this.bodyDef.linearVelocity = new this.BOX2D.b2Vec2(objData.x, objData.y);
	};
	
	/**
	 * Sets the position for body.
	 * @access private
	 */
	Body.prototype.setPosition = function(objData) {
		this.bodyDef.position.x = objData.x;
		this.bodyDef.position.y = objData.y;
	};
	
	/**
	 * Sets the density for body.
	 * @access private
	 */
	Body.prototype.setDensity = function(nDensity) {
		this.fixDef.density = nDensity;
	};
	
	/**
	 * Sets the friction for body.
	 * @access private
	 */
	Body.prototype.setFriction = function(nFriction) {
		this.fixDef.friction = nFriction;
	};
	
	/**
	 * Sets the restitution for body.
	 * @access private
	 */
	Body.prototype.setRestitution = function(nRest) {
		this.fixDef.restitution = nRest;
	};
	
	/**
	 * Sets the groupindex for body.
	 * @access private
	 */
	Body.prototype.setGroupIndex = function(nGrpInd) {
		this.fixDef.filter.groupIndex = nGrpInd;
	};
	
	/**
	 * Sets the sensor value for body.
	 * @access private
	 */
	Body.prototype.setIsSensor = function(bVal) {
		this.fixDef.isSensor = bVal;
	};
	
	/**
	 * Creates the body into world.
	 * @access private
	 */
	Body.prototype.createInWorld = function(world) {
		var self = this;
		this.b2Body = world.CreateBody(this.bodyDef);
		this.b2Body.CreateFixture(this.fixDef);
		
		if(this.view !== undefined){
			this.view.addEventListener("tick", function(e) {
				self.tick();
			});	
		}
		this.world = world;
	};
	
	/**
	 * Updates the body view and keep it in synch with the body.
	 * @access private
	 */
	Body.prototype.tick = function(e) {
		this.view.x = this.b2Body.GetPosition().x * 30;
		this.view.y = this.b2Body.GetPosition().y * 30;
		this.view.rotation = this.b2Body.GetAngle()*(180/Math.PI);
	};
	
	/**
	 * Removes the body and view from the world and stage respectively.
	 * @access private
	 */
	Body.prototype.destroy = function() {
		if (this.world !== undefined) {
			this.world.DestroyBody(this.b2Body);
		}
		this.BOX2D = undefined;
		this.fixDef = undefined;
		this.bodyDef = undefined;
		this.world = undefined;
	};

	return Body;
});
