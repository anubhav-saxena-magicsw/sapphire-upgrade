/*global define*/
define(["backbone"], function(Backbone) {
    "use strict";
    var CustomTableItemModel = Backbone.Model.extend({
        updateIndex : function(nInd) {
            this.set({
                "index" : this.get("index") + nInd
            });
        }
    });

    return CustomTableItemModel;
});
