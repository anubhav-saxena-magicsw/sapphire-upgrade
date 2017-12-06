/*jslint nomen: true*/
/*globals MCQCompHelper,_,$,console,Backbone*/


define(['backbone'],

    function(Backbone) {
        "use strict";
        var Model =
            Backbone.Model.extend({
                defaults : {
                    styleClass : "",
                    selectedStyleClass : "",
                    attempts : "",
                    data : {},
                    lists:[]
                }
            });

        return Model;
    });