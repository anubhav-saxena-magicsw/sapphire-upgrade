/*jslint nomen: true*/
/*globals Backbone,$, console*/
define(function(require, exports, module) {'use strict';

	var CloseCaptionCompHelper = {

		init : function(that) {
			console.log('close caption comp helper initialized!');
		},

		appendCaption : function(that, strCaption) {
			// TODO: add caption
			that.$el.append(strCaption);
			// write code to keep it scrolling to bottom always
		},

		destroy : function(bDestroy) {
			// TODO: destroy
		}
	};

	return CloseCaptionCompHelper;

}); 