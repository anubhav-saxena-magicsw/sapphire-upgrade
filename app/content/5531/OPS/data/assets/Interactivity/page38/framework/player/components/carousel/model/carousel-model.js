define(["components/carousel/js/carousel-constants"],function(e){var l=Backbone.Model.extend({defaults:{allignment:e.CONSTANTS.HORIZONTAL,scroll:1,wrap:e.CONSTANTS.CIRCULAR,imageCollection:{},isSwapRequired:!1,selectorIndex:0,selectedItems:[],playerIds:[],carouselWrapperStyle:"CarouselWrapperStyle"}});return l});