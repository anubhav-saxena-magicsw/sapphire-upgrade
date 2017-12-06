/*jslint nomen: true*/

/**
 * AudioPlayerModel
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 */

/** 
 *A class representing model for audio component
 *@access private
 *@augments BaseActivityModel
 *@example
 * 
 *require(['components/audioPlayer/nonVisual/js/AudioPlayerModel'], function(AudioPlayerModel) {
 *    var audioPlayerModel = new AudioPlayerModel();
 *});         
 */
define([
    'player/base/base-activity-model'
], function (BaseActivityModel) {
    
    'use strict';
    
    var AudioPlayerModel = BaseActivityModel.extend({
        
        defaults:
        {
            data: {},
            loop: false,
            withUi: false
        }
    });
    
    AudioPlayerModel.prototype.__super__ = BaseActivityModel;
    
    return AudioPlayerModel;
});
