define(["backbone","components/table/model/custom-table-item-model"],function(e,t){var n=e.Collection.extend({model:t,initialize:function(){},comparator:function(e){return e.get("index")},getModelByIndex:function(e){if(0>e||e>=this.length)throw new Error("Index out of bound!");return this.at(e)},removeModelByIndex:function(e){this.remove(this.getModelByIndex(e)),this.updateModelsIndex(e,-1),console.log("now collection: ",this)},addModelAt:function(e,t){if(0>t)throw new Error("Data can not be inserted at index ["+t+"]");this.updateModelsIndex(t,1),e.set({index:t}),this.add(e,{at:t}),this.sort()},updateModelAt:function(e,t){var n=this.at(t);return $.each(e,function(e,t){n.set(e,t)}),n},updateModelsIndex:function(e,t){this.each(function(n,o){o>=e&&n.updateIndex(t)})}});return n});