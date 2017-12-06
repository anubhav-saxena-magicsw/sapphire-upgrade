/*jslint nomen: true*/
/*globals Backbone,_,$,console,Box2D,createjs*/

/**
 * CircleBody
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
define(['components/physicsengine/js/body'], function(Body) {"use strict";
	/**
	 * A class representing CircleBody.
	 * @class CircleBody
	 * @param {Box2d} BOX2D A refernve to the box2d library.
	 * @access private
	 */
	var CircleBody = function(BOX2D){
		this.init(BOX2D);		
	};
	
	/**
	 * Extending Body class.
	 * @access private
	 */
	CircleBody.prototype = new Body();
	
	/**
	 * Applying the size and view properties for circle body.
	 * @access private
	 */
	CircleBody.prototype.setRadius = function(rad,createjsObj){
		if(rad !== undefined){
			this.fixDef.shape = new this.BOX2D.b2CircleShape(rad);	
		}
		if(createjsObj !== undefined){
			this.view = createjsObj;
		}
		
		
	};

return CircleBody;
});
