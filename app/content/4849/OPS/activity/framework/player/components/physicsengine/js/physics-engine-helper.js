/*jslint nomen: true*/
/*globals Backbone,_,$,console,Box2D,createjs*/

/**
 * PhysicsEngineHelper
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
define([basePath+'framework/libs/easeljs/easeljs-0.7.0.min.js', basePath+'framework/libs/box2d/box2d-web-2.1.a.3.min.js', 'components/physicsengine/js/circle-body', 'components/physicsengine/js/rectangle-body'], function(Ejs, BOX2D, CircleBody, RectangleBody) {"use strict";

	/**
	 * A class representing PhysicsEngineHelper.
	 * @class PhysicsEngineHelper
	 * @param {Json} objXml A xml containing canvas width , height, static bodies , dynamic bodies etc.
	 * @access private
	 */
	var PhysicsEngineHelper = function(objXml) {
		/**
		 * A reference to the Box2d library.
		 * @access private
		 */
		this.BOX2D = {
			b2Vec2 : Box2D.Common.Math.b2Vec2,
			b2Color : Box2D.Common.b2Color,
			b2AABB : Box2D.Collision.b2AABB,
			b2BodyDef : Box2D.Dynamics.b2BodyDef,
			b2Body : Box2D.Dynamics.b2Body,
			b2FixtureDef : Box2D.Dynamics.b2FixtureDef,
			b2Fixture : Box2D.Dynamics.b2Fixture,
			b2World : Box2D.Dynamics.b2World,
			b2MassData : Box2D.Collision.Shapes.b2MassData,
			b2PolygonShape : Box2D.Collision.Shapes.b2PolygonShape,
			b2CircleShape : Box2D.Collision.Shapes.b2CircleShape,
			b2DebugDraw : Box2D.Dynamics.b2DebugDraw,
			b2MouseJointDef : Box2D.Dynamics.Joints.b2MouseJointDef,
			b2ContactListener : Box2D.Dynamics.b2ContactListener,
			b2WorldManifold : Box2D.Collision.b2WorldManifold
		};

		/**
		 * A reference to store and refer to the object and values in various functions within this class.
		 * @access private
		 */
		this.members = {};
		this.members.objXml = objXml;
		this.members.fps = (isNaN(objXml.world.fps) === false) ? 60 : Number(objXml.world.fps);
		this.members.dynaCount = 0;
		this.members.staCount = 0;
		this.members.bodies = {};

		this.members.maxX = objXml.world.width;
		this.members.maxY = objXml.world.height;
		this.members.scale = (isNaN(objXml.world.scale) === false) ? 30 : Number(objXml.world.scale);
	};

	PhysicsEngineHelper.prototype.setParent = function(objParent) {
		this.members.parent = objParent;
	};
	/**
	 * To setup the Easljs stage for the canvas.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.setStage = function() {
		var self = this, createjsObj;
		this.members.stage = new createjs.Stage(this.members.canId);
		this.members.tickListener = function() {
			self.update();
		};
		createjs.Ticker.addEventListener("tick", this.members.tickListener);

		createjs.Ticker.setFPS(60);
		createjs.Ticker.useRAF = true;
	};

	/**
	 * To setup the box2d world for the canvas.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.setWorld = function(canId) {
		var objXml, vecGravity, grX, grY;

		this.members.canId = canId;
		objXml = this.members.objXml;
		grX = Number(objXml.world.gravityX);
		if (isNaN(grX) || grX === undefined) {
			grX = 0;
		}
		grY = Number(objXml.world.gravityY);
		if (isNaN(grY) || grY === undefined) {
			grY = 0;
		}

		vecGravity = new this.BOX2D.b2Vec2(grX, grY);
		this.members.b2World = new this.BOX2D.b2World(vecGravity, true);
		this.setStage();
		this.setStaticBodies(objXml);
	};

	/**
	 * To read and create the static bodies defined in xml.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.setStaticBodies = function(objXml) {
		var xml, body, arrBody, count;
		arrBody = [];
		xml = objXml.world.staticBodies;
		if (xml.sta !== undefined) {
			if (xml.sta instanceof Array) {
				for ( count = 0; count < xml.sta.length; count += 1) {
					arrBody.push(xml.sta[count]);
				}
			} else {
				arrBody.push(xml.sta);
			}
		}

		for ( count = 0; count < arrBody.length; count += 1) {
			body = arrBody[count];
			this.addStaticBody(body);
		}

		this.setDynamicBodies(objXml);
	};

	/**
	 * To read and create the dynamic bodies defined in xml.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.setDynamicBodies = function(objXml) {
		var xml, body, arrBody, count;
		arrBody = [];
		xml = objXml.world.dynamicBodies;
		if (xml.dyna !== undefined) {
			if (xml.dyna instanceof Array) {
				for ( count = 0; count < xml.dyna.length; count += 1) {
					arrBody.push(xml.dyna[count]);
				}
			} else {
				arrBody.push(xml.dyna);
			}
		}

		for ( count = 0; count < arrBody.length; count += 1) {
			body = arrBody[count];
			this.addDynamicBody(body);
		}

		this.setDebugDraw(objXml);
	};

	/**
	 * To create and add the static bodies on stage and world.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.addStaticBody = function(body) {
		if (body.myName === undefined) {
			body.myName = "sta";
		}
		this.addBody(body);
	};

	/**
	 * To create and add the dynamic bodies on stage and world.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.addDynamicBody = function(body) {
		if (body.myName === undefined) {
			body.myName = "dyna";
		}
		this.addBody(body);
	};

	/**
	 * To add any body to stage and world.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.addBody = function(body) {
		var xmlVars, behaviour, objBody, b2Body, filter, scale;
		xmlVars = {};
		scale = Number(this.members.objXml.world.scale);

		if (body.myName === "dyna") {
			behaviour = this.BOX2D.b2Body.b2_dynamicBody;
			xmlVars.userData = {
				id : "dyna_" + this.members.dynaCount,
				sleepKill : (body.sleepKill === "true" || body.sleepKill === true) ? true : false, // remove this body when asleep
				kill : false, // remove this body on next step
				killOnOut : (body.killOnOut === "false" || body.killOnOut === false) ? false : true, // remove this body when out of world
				absorb : (body.absorb === "true" || body.absorb === true) ? true : false, // remove other body on collide
				collideOnce : (body.collideOnce === "true" || body.collideOnce === true) ? true : false, // become sensor after first collision
				type : "dynamic"
			};
			this.members.dynaCount += 1;
			xmlVars.grpIndex = (this.members.objXml.world.dynamicBodies.mutualCollision === "false") ? -1 : 0;
		} else {
			behaviour = this.BOX2D.b2Body.b2_staticBody;
			xmlVars.userData = {
				id : "sta_" + this.members.staCount,
				sleepKill : (body.sleepKill === "true" || body.sleepKill === true) ? true : false, // remove this body when asleep
				kill : false, // remove this body on next step
				killOnOut : (body.killOnOut === "false" || body.killOnOut === false) ? false : true, // remove this body when out of world
				absorb : (body.absorb === "true" || body.absorb === true) ? true : false, // remove other body on collide
				type : "static"
			};
			this.members.staCount += 1;
			xmlVars.grpIndex = 0;
		}

		if (body.id !== undefined) {
			xmlVars.userData.id = body.id + "_" + xmlVars.userData.id;
		}

		xmlVars.shapeType = (body.shapeType === "rectangle") ? "rectangle" : "circle";

		xmlVars.canWid = Number(this.members.objXml.world.width);
		xmlVars.canHit = Number(this.members.objXml.world.height);

		xmlVars.speedX = (body.speedX === undefined) ? 0 : Number(body.speedX);
		xmlVars.speedY = (body.speedY === undefined) ? 0 : Number(body.speedY);
		xmlVars.velocity = {
			x : xmlVars.speedX,
			y : xmlVars.speedY
		};
		if (this.members.objXml.world.dynamicBodies.constantSpeed === "true") {
			xmlVars.userData.speed = xmlVars.velocity;
		}

		xmlVars.density = isNaN(body.density) ? 0 : Number(body.density);
		xmlVars.friction = isNaN(body.friction) ? 0 : Number(body.friction);
		xmlVars.restitution = isNaN(body.restitution) ? 0 : Number(body.restitution);
		if (body.imgSrc !== undefined) {
			xmlVars.bitmap = new createjs.Bitmap(body.imgSrc);
			this.members.stage.addChild(xmlVars.bitmap);
		} else {
			xmlVars.color = (body.color === undefined) ? "#FFFFFF" : body.color;
		}
		if (xmlVars.shapeType === "circle") {
			xmlVars.rad = isNaN(body.radius) ? 0 : Number(body.radius) / scale;
			xmlVars.xpos = isNaN(body.x) ? (xmlVars.rad * scale + Math.random() * (xmlVars.canWid - xmlVars.rad * scale)) / scale : Number(body.x) / scale;
			xmlVars.ypos = isNaN(body.y) ? (xmlVars.rad * scale + Math.random() * (xmlVars.canHit - xmlVars.rad * scale)) / scale : Number(body.y) / scale;
			xmlVars.position = {
				x : xmlVars.xpos,
				y : xmlVars.ypos
			};
			objBody = new CircleBody(this.BOX2D);
			if (xmlVars.bitmap !== undefined) {
				xmlVars.bitmap.regX = xmlVars.rad * scale;
				xmlVars.bitmap.regY = xmlVars.rad * scale;
				objBody.setRadius(xmlVars.rad, xmlVars.bitmap);
			} else {
				xmlVars.createjsObj = new createjs.Shape();
				this.members.stage.addChild(xmlVars.createjsObj);
				xmlVars.createjsObj.regX = xmlVars.rad * scale;
				xmlVars.createjsObj.regY = xmlVars.rad * scale;
				xmlVars.createjsObj.graphics.beginFill(xmlVars.color);
				xmlVars.createjsObj.graphics.drawCircle(xmlVars.createjsObj.regX, xmlVars.createjsObj.regY, xmlVars.rad * scale);
				objBody.setRadius(xmlVars.rad, xmlVars.createjsObj);
			}

		} else if (xmlVars.shapeType === "rectangle") {
			xmlVars.size = {
				width : (body.width === "undefined") ? 0 : (Number(body.width) / 2) / scale,
				height : (body.height === "undefined") ? 0 : (Number(body.height) / 2) / scale
			};
			xmlVars.xpos = isNaN(body.x) ? (xmlVars.size.width * scale + Math.random() * (xmlVars.canWid - xmlVars.size.width * scale)) / scale : Number(body.x) / scale;
			xmlVars.ypos = isNaN(body.y) ? (xmlVars.size.height * scale + Math.random() * (xmlVars.canHit - xmlVars.size.height * scale)) / scale : Number(body.y) / scale;
			xmlVars.position = {
				x : xmlVars.xpos,
				y : xmlVars.ypos
			};
			objBody = new RectangleBody(this.BOX2D);
			if (xmlVars.bitmap !== undefined) {
				xmlVars.bitmap.regX = xmlVars.size.width * scale;
				xmlVars.bitmap.regY = xmlVars.size.height * scale;
				objBody.setSize(xmlVars.size, new createjs.Bitmap(body.imgSrc));
			} else {
				xmlVars.createjsObj = new createjs.Shape();
				this.members.stage.addChild(xmlVars.createjsObj);
				xmlVars.createjsObj.regX = (xmlVars.position.x + xmlVars.size.width) * scale;
				xmlVars.createjsObj.regY = (xmlVars.position.y + xmlVars.size.height) * scale;
				xmlVars.createjsObj.graphics.beginFill(xmlVars.color);
				xmlVars.createjsObj.graphics.drawRect(xmlVars.position.x * scale, xmlVars.position.y * scale, xmlVars.size.width * 2 * scale, xmlVars.size.height * 2 * scale);
				objBody.setSize(xmlVars.size, xmlVars.createjsObj);
			}
		}

		xmlVars.sensor = (body.sensor === "true" || body.sensor === true) ? true : false;
		xmlVars.userData.sensor = xmlVars.sensor;
		//objBody.setIsSensor(xmlVars.sensor);
		objBody.setPosition(xmlVars.position);
		objBody.setUserData(xmlVars.userData);
		objBody.setLinearVelocity(xmlVars.velocity);
		objBody.setType(behaviour);
		objBody.setDensity(xmlVars.density);
		objBody.setFriction(xmlVars.friction);
		objBody.setRestitution(xmlVars.restitution);
		objBody.setGroupIndex(xmlVars.grpIndex);
		objBody.createInWorld(this.members.b2World);
		this.members.bodies[objBody.getUserData().id] = objBody;
	};

	/**
	 * Setup the debug draw for the world to draw objects in world.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.setDebugDraw = function(objXml) {
		var debugDraw, scale, alpha, thickness, time, speed, pspeed, fps, self;
		debugDraw = new this.BOX2D.b2DebugDraw();
		debugDraw.SetSprite(document.getElementById(this.members.canId).getContext("2d"));
		debugDraw.SetDrawScale(30.0);
		debugDraw.SetFillAlpha(1);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(this.BOX2D.b2DebugDraw.e_shapeBit || this.BOX2D.b2DebugDraw.e_jointBit);
		this.members.b2World.SetDebugDraw(debugDraw);

		self = this;
		this.setContactlistner();
	};

	PhysicsEngineHelper.prototype.collisionInformer = function(contact) {
		var self, userData, worldMainFold, pointX, pointY, evtData = {};
		self = this;	
		worldMainFold = new this.BOX2D.b2WorldManifold();
		contact.GetWorldManifold(worldMainFold);
		pointX = worldMainFold.m_points[0].x * this.members.scale;
		pointY = worldMainFold.m_points[0].y * this.members.scale;
		evtData.touchPoint = {
			x : pointX,
			y : pointY
		};

		userData = contact.GetFixtureA().GetBody().GetUserData();
		evtData.BodyA = userData.id;

		userData = contact.GetFixtureB().GetBody().GetUserData();
		evtData.BodyB = userData.id;

		//console.log(this);
		setTimeout(function(){
			self.members.parent.trigger("on_collision", evtData);	
		},0);
		
	};

	/**
	 * Defing the contact listener for the world to access the collision data.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.setContactlistner = function() {
		var listener, userData, speedX, speedY, self, bodyA, bodyB, point;
		self = this;
		listener = new this.BOX2D.b2ContactListener();

		listener.PreSolve = function(contact, oldManifold) {
			//console.log("PreSolve");
			userData = contact.GetFixtureA().GetBody().GetUserData();
			if (userData.sensor === true) {
				contact.SetEnabled(false);
			}
			userData = contact.GetFixtureB().GetBody().GetUserData();
			if (userData.sensor === true) {
				contact.SetEnabled(false);
			}
		};

		listener.PostSolve = function(contact, impulse) {
			//console.log("PostSolve");
		};

		listener.BeginContact = function(contact) {
			self.collisionInformer(contact);
			userData = contact.GetFixtureA().GetBody().GetUserData();
			//m_fixtureA.m_body.m_userData;
			if (userData.absorb === true) {
				userData = contact.GetFixtureB().GetBody().GetUserData();
				if (userData !== undefined && userData !== null) {
					userData.kill = true;
				}
			}

			userData = contact.GetFixtureB().GetBody().GetUserData();
			if (userData.absorb === true) {
				userData = contact.GetFixtureA().GetBody().GetUserData();
				if (userData !== undefined && userData !== null) {
					userData.kill = true;
				}
			}

		};

		listener.EndContact = function(contact) {
			userData = contact.GetFixtureA().GetBody().GetUserData();
			if (userData.id.type === "dynamic") {
				if (userData.collideOnce === true) {
					userData.sensor = true;
				}

			}

			userData = contact.GetFixtureB().GetBody().GetUserData();
			if (userData.id.type === "dynamic") {
				if (userData.collideOnce === true) {
					userData.sensor = true;
				}

			}

		};

		this.members.b2World.SetContactListener(listener);
	};

	/**
	 * Facilitiates user to apply/change certain property(passed in arguments) to all the existing bodies at any time.
	 * @param {Object} obj An object consiting of properties name(The property that should be applied/changed) and val(The value which should be applied against the Named property) for all existing bodies.
	 * The name property should be an integer constant.
	 * @memberof PhysicsEngineHelper
	 * @example
	 * objPhysicsWorld.applyOnAll({name: objPhysicsWorld.SPEED,val : 3});
	 * @access private
	 */
	PhysicsEngineHelper.prototype.applyOnAll = function(obj) {
		var name, val, b2body, userData, temp, speed;
		name = obj.name;
		val = obj.val;
		b2body = this.members.b2World.m_bodyList;
		while (b2body !== null && b2body !== undefined) {
			userData = b2body.m_userData;
			if (userData === null) {
				temp = b2body.m_next;
				this.members.b2World.DestroyBody(b2body);
				b2body = temp;
				if (b2body === null) {
					return undefined;
				}
			}
			switch(name) {
				case 1:
					this.updateSpeed(b2body, val);
					break;
			}

			b2body = b2body.m_next;
		}
	};

	/**
	 * Facilitiates user to set position of any body Circular or Rectangular at run time.
	 * @param {String} id The id of the body which is either assigned via xml or at runtime.
	 * @param {Object} objData An object consiting of properties x and y for co-ordinates respectively.
	 * @memberof PhysicsEngineHelper
	 * @access private
	 */
	PhysicsEngineHelper.prototype.setBodyPosition = function(strId, objData) {
		var body, vec;
		body = this.getBody(strId);
		if (body !== undefined) {
			if (objData.x !== undefined) {
				vec = new this.BOX2D.b2Vec2(objData.x / this.members.scale, body.GetPosition().y);
			}
			if (objData.y !== undefined) {
				vec = new this.BOX2D.b2Vec2(body.GetPosition().x, objData.y / this.members.scale);
			}
			body.SetPosition(vec);
		}
	};

	/**
	 * Facilitiates user to get type of any body Static or Dynamic at run time.
	 * @param none.
	 * @returns {String} static or dynamic.
	 * @memberof PhysicsEngineHelper
	 * @access private
	 */
	PhysicsEngineHelper.prototype.getBodyType = function(strId) {
		var body, userData, strType;
		body = this.getBody(strId);

		if (body !== undefined) {
			userData = body.GetUserData();
			return userData.type;
		}
		return undefined;
	};
	/**
	 * Facilitiates user to get position of any body Circular or Rectangular at run time.
	 * @param none.
	 * @returns {Object} An object consiting of properties x and y for co-ordinates respectively.
	 * @memberof PhysicsEngineHelper
	 * @access private
	 */
	PhysicsEngineHelper.prototype.getBodyPosition = function(strId) {
		var body;
		body = this.getBody(strId);
		if (body !== undefined) {
			return {
				x : body.m_xf.position.x * this.members.scale,
				y : body.m_xf.position.y * this.members.scale
			};
		}
		return undefined;
	};

	/**
	 * Facilitiates user to remove any body Circular or Rectangular at run time.
	 * @param {String} id The id of the body which is either assigned via xml or at runtime.
	 * @memberof PhysicsEngineHelper
	 * @access private
	 */
	PhysicsEngineHelper.prototype.removeBody = function(strId) {
		var body;
		body = this.getBody(strId);
		if (body !== undefined) {
			body.m_userData.kill = true;
		}
	};

	/**
	 * Get box2d body reference for given id.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.getBody = function(strId) {
		var body, userData, temp, ret;
		body = this.members.b2World.m_bodyList;
		while (body !== null && body !== undefined) {
			userData = body.m_userData;
			if (userData === null) {
				temp = body.m_next;
				this.members.b2World.DestroyBody(body);
				body = temp;
				if (body === null) {
					return undefined;
				}
			}

			if (userData.id.indexOf(strId) >= 0) {
				ret = body;
			}

			if (ret !== undefined) {
				ret = undefined;
				return body;
			}

			body = body.m_next;
		}

		//return undefined;
	};

	/**
	 * Remove passed box2d body from world.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.removeFromWorld = function(b2body) {
		var body, createjsObj, x, y, userData, kill;
		userData = b2body.m_userData;
		kill = false;
		if (userData.killOnOut === true) {
			x = Math.round(b2body.GetPosition().x * this.members.scale);
			y = Math.round(b2body.GetPosition().y * this.members.scale);
			if (x > this.members.maxX || x < 0) {
				kill = true;
			} else if (y > this.members.maxY || y < 0) {
				kill = true;
			}
		}
		if (userData.sleepKill === true) {
			if (b2body.IsAwake() === false) {
				kill = true;
			}
		}
		if (userData.kill === true) {
			kill = true;
		}

		if (kill === true) {
			body = this.members.bodies[userData.id];
			if (body !== undefined) {
				var obj = {};
				obj.exitPoint = {
					x : Math.round(b2body.GetPosition().x * this.members.scale),
					y : Math.round(b2body.GetPosition().y * this.members.scale)
				};
				obj.type = b2body.GetType();
				this.members.parent.trigger("on_destroy", obj);
				createjsObj = body.getView();
				createjsObj.removeEventListener("tick");
				this.members.stage.removeChild(createjsObj);
				body.destroy();
				this.members.bodies[userData.id] = undefined;
				kill = undefined;
			}
		}
	};

	/**
	 * Update passed bos2d body velocity with the passed value..
	 * @access private
	 */
	PhysicsEngineHelper.prototype.updateSpeed = function(b2body, val) {
		var body, createjsObj, userData, temp, speed;
		userData = b2body.m_userData;
		speed = b2body.GetLinearVelocity();

		if (val === undefined) {
			val = 0;
		}
		if (userData.speed !== undefined) {
			if (speed.x < 0) {
				userData.speed.x = -1 * (((Math.abs(userData.speed.x) + val) <= 0) ? 0 : (Math.abs(userData.speed.x) + val));
			} else {
				userData.speed.x = ((Math.abs(userData.speed.x) + val) <= 0) ? 0 : (Math.abs(userData.speed.x) + val);
			}
			if (speed.y < 0) {
				userData.speed.y = -1 * (((Math.abs(userData.speed.y) + val) <= 0) ? 0 : (Math.abs(userData.speed.y) + val));
			} else {
				userData.speed.y = ((Math.abs(userData.speed.y) + val) <= 0) ? 0 : (Math.abs(userData.speed.y) + val);
			}
			b2body.SetLinearVelocity(userData.speed);
		} else {
			if (speed.x < 0) {
				speed.x = -1 * (((Math.abs(speed.x) + val) <= 0) ? 0 : (Math.abs(speed.x) + val));
			} else if (speed.x > 0) {
				speed.x = ((Math.abs(speed.x) + val) <= 0) ? 0 : (Math.abs(speed.x) + val);
			}
			if (speed.y < 0) {
				speed.y = -1 * (((Math.abs(speed.y) + val) <= 0) ? 0 : (Math.abs(speed.y) + val));
			} else if (speed.y > 0) {
				speed.y = ((Math.abs(speed.y) + val) <= 0) ? 0 : (Math.abs(speed.y) + val);
			}
			//b2body.SetLinearVelocity(speed);
		}
	};

	/**
	 * Group of tasks tha are to be performed in every step.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.doInCurrentStep = function() {
		var b2body, body, createjsObj, userData, temp, speed;
		b2body = this.members.b2World.m_bodyList;
		while (b2body !== null && b2body !== undefined) {
			userData = b2body.m_userData;
			if (userData === null) {
				temp = b2body.m_next;
				this.members.b2World.DestroyBody(b2body);
				b2body = temp;
				if (b2body === null) {
					return;
				}
			}

			this.removeFromWorld(b2body);
			this.updateSpeed(b2body);

			b2body = b2body.m_next;
		}
	};

	/**
	 * This function get called at every step of world.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.update = function() {
		this.members.stage.update();
		//this.members.b2World.DrawDebugData();
		this.members.b2World.Step(1 / this.members.fps, 10, 10);
		this.members.b2World.ClearForces();
		this.doInCurrentStep();

	};

	/**
	 * Remove all bodies from world and stage. Removes the tick listener.
	 * @access private
	 */
	PhysicsEngineHelper.prototype.destroy = function() {
		var b2body, self = this;
		createjs.Ticker.removeEventListener("tick", this.members.tickListener);
		b2body = this.members.b2World.m_bodyList;
		while (b2body !== null && b2body !== undefined) {
			this.removeFromWorld(b2body);
			b2body = b2body.m_next;
		}

		this.members.dynaCount = 0;
		this.members.staCount = 0;
		this.members.stage = undefined;
		this.members.bodies = undefined;
		this.members = undefined;
	};

	return PhysicsEngineHelper;
});
