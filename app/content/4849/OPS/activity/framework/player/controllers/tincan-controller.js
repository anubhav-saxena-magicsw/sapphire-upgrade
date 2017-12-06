/*jslint nomen: true*/
/*globals Backbone,_,console,$, class */

/**
 * TinCanController
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define(['marionette', basePath+'framework/libs/tincan/tincan', basePath+'framework/libs/tincan/base64'], function(Marionette) {
	"use strict";
	var TinCanController, objInstance, tincan;
	objInstance = null;

	TinCanController = Backbone.Marionette.Controller.extend({
		arrConf : null,
		constructor : function(arrConf) {
			this.arrConf = [];
			tincan = new TinCan();
			if (arrConf) {
				this.setConfigurations(arrConf);
			}

		}
	});

	TinCanController.prototype.tincanOperation = function(arrArgs) {
		var api;
		if (arrArgs && arrArgs.length) {
			api = arrArgs.shift();
			if (api === "getStatements") {
				$.each(arrArgs[0], function(i, obj) {
					console.log("** ",obj.agent);
					if (obj.agent) {
						obj.agent = new TinCan.Agent(obj.agent);
						console.log(obj.agent);
						return;
					}
				});
			}
			tincan[api].apply(tincan, arrArgs);
		}
	};

	TinCanController.prototype.setConfigurations = function(objConf) {
		var self = this;
		if ( objConf instanceof Array) {
			this.arrConf = objConf;
		} else {
			this.arrConf[0] = objConf;
		}
		$.each(this.arrConf, function(key, obj) {
			var tmp = {};
			tmp.endpoint = obj.endpoint;
			tmp.version = obj.version;
			if (obj.auth.type === "Basic") {
				tmp.auth = 'Basic ' + self.encodeBase64(obj.auth.user + ':' + obj.auth.password);
			}
			tincan.addRecordStore(self.createLRS(tmp));
		});
	};

	TinCanController.prototype.createLRS = function(objConf) {
		var myLRS = new TinCan.LRS(objConf);
		return myLRS;

	};

	TinCanController.prototype.destroy = function() {

	};

	TinCanController.prototype.encodeBase64 = function(json) {
		return Base64.encode(json);
	};

	TinCanController.prototype.decodeBase64 = function(encr) {
		return Base64.decode(encr);
	};

	return {
		getInstance : function(obj) {
			if (objInstance === null) {
				objInstance = new TinCanController(obj);
			} else if (obj) {
				objInstance.setConfigurations(obj);
			}
			return objInstance;
		}
	};
});
