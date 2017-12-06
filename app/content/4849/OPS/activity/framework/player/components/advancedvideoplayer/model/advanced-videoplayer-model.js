/*jslint nomen: true*/
/*globals _*/
/**
 * VideoPlayerModel
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
 */

define(['player/base/base-activity-model'],

/**
 *A module representing a AdvancedVideoPlayerModel.
 *@exports player/components/advancedvideoplayer/model/advanced-videoplayer-model
 *@access private
 */     

 function (BaseActivityModel) {
    
    'use strict';
    
    /**
     * Intializes VideoPlayerModel.
     * @constructor
     * @augments Backbone.Model
     * @access private
     */
    
    var AdvancedVideoPlayerModel = /** @lends LifeMeterModel.prototype */ 
    	BaseActivityModel.extend({
        
        defaults:
        {
        	data :{},
        	video : null,
        	isPlaying : false,
        	thumbSpeed : 50,
        	vCurTime: 0,
        	vTotalTime: 0,
        	sThumbPos : 0,
            sVisibility: true,
            sLength : 450,
			sAlingment : 'horizontal',
			sDefaultPosition : 0, // this value will be in percentage 
			sCurrentPosition : 0, // this will be updated as per the default position by the component internally
			sCurrentPercentage : 0, // this will be updated as per the default position by the component internally
			sMinSlidingPosition : 0, //in percentage
			sMaxSlidingPosition : 100//in percentage
        }
    });
    
    AdvancedVideoPlayerModel.prototype.Super = BaseActivityModel;
    
    return AdvancedVideoPlayerModel;
});
