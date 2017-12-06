define(['player/constants/errorconst', 'components/screennavigator/js/screen-navigator-item'], function(ErrorConst, SNItem) {

	var screenNavHelper = {

		STR_SHOW_NEXTBACK : "showNextBackButton",
		STR_SHOW_INDEX_BTNS : "showIndexButtons",
		STR_INDEX_BTNS : "indexButtons",

		NAV_TYPE_SCREEN : 'screen',
		NAV_TYPE_ACTIVITY : 'activity',
		
		// screen nav item model
		STR_SCREEN_ID : "screenId",
		STR_SCREEN_INDEX : "screenIndex",
		STR_SCREEN_NAME : "screenName",
		STR_SCREEN_LABEL : "screenLabel",
		STR_SCREEN_TYPE : "type",
		STR_SCREEN_VISITED : "visited",
		STR_SCREEN_SELECTED : "selected",
		STR_CLASS_NAME : "className",

		selectedIndex : 0,
		currentIndex : 0,

		/**
		 *
		 */
		init : function(that, options) {
			if (options) {
				// prepare data...
				if (this.prepareData(that, options)) {
					that.itemViewContainer = "#screenNavContainer";
					that.itemViewOptions = {parent : that};
					that.itemView = SNItem;
				} else {
					throw new Error(ErrorConst.UNEXPECTED_ERROR);
				}
			} else {
				throw new Error(ErrorConst.REQUIRED_DATA_MISSING);
			}
		},
		
		setSelectedIndex : function(that, nIndex, bUpdate){
			this.selectedIndex = this.currentIndex = nIndex;
			//
			this.updateNextBackButton(that);
			
			if(!bUpdate || bUpdate === undefined){
				that.children.call("changeActiveIndex", this.selectedIndex);	
			}
		},

		updateLayout : function(that) {
			
			that.ui.nextBtn.addClass(that.model.get('nextBtnClass'));
			
			that.ui.backBtn.addClass(that.model.get('backBtnClass'));
			
			that.ui.indexBtns.addClass(that.model.get('indexBtnContainerClass'));
			
			// disable back button
			that.enableBackButton(false);
			this.updateNextBackButton(that);
			// set selected index button
			that.children.call("changeActiveIndex", this.selectedIndex);
		},

		/**
		 *
		 * @param {Object} nMoveBy
		 */
		moveScreenBy : function(that, nMoveBy) {
			var totalScreen = that.model.get('totalScreen');
			if (this.validateIndex(nMoveBy)) {
				this.currentIndex += nMoveBy;
				if(this.currentIndex >= 0 && this.currentIndex < totalScreen){
					this.selectedIndex = this.currentIndex;
				}
				this.updateNextBackButton(that);
				
				that.children.call("changeActiveIndex", this.selectedIndex);
			} else {
				console.error("Wrong move by index has been provided!");
			}
		},
		
		updateNextBackButton : function(that){
			var bEnableBackBtn=false, bEnableNextBtn=false,totalScreen = that.model.get('totalScreen');
			if(this.selectedIndex === 0 ){
				bEnableBackBtn = false;
			}else{
				bEnableBackBtn = true;
			}
			
			if(this.selectedIndex >= (totalScreen-1)){
				bEnableNextBtn = false;	
			}else{
				bEnableNextBtn = true;
			}
			
			that.isFirstScreen = !bEnableBackBtn;
			that.isLastScreen = !bEnableNextBtn;
			
			that.enableBackButton(bEnableBackBtn);
			that.enableNextButton(bEnableNextBtn);
			
			that.children.call("updateActiveIndex", this.selectedIndex);
		},
		
		/**
		 *
		 * @param {Object} that
		 */
		showHideNextBackBtn : function(that) {
			var bShowNextBackBtn;
			bShowNextBackBtn = that.model.get(this.STR_SHOW_NEXTBACK);

			(bShowNextBackBtn) ? that.ui.nextBtn.show() : that.ui.nextBtn.hide();
			(bShowNextBackBtn) ? that.ui.backBtn.show() : that.ui.backBtn.hide();
		},
		/**
		 *
		 * @param {Object} that
		 */
		showHideIndexBtns : function(that) {
			var bShowIndexBtns;

			bShowIndexBtns = that.model.get(this.STR_SHOW_INDEX_BTNS);

			(bShowIndexBtns) ? that.ui.indexBtns.show() : that.ui.indexBtns.hide();
		},
		
		/**
		 *
		 * @param {Object} that
		 * @param {Object} options
		 */
		prepareData : function(that, options) {
			var bSuccess = false, ScreenNavItemModel, ScreenNavCollection, ScreenNavModel, objCollection, itemModel;

			ScreenNavItemModel = Backbone.Model.extend({
				defaults : {
					screenId : -1,
					screenIndex : -1,
					screenName : 'screen',
					screenType : 'screen',
					screenLabel : '0',
					visited : false,
					selected : false
				}
			});

			ScreenNavCollection = Backbone.Collection.extend({
				model : ScreenNavItemModel
			});

			ScreenNavModel = Backbone.Model.extend({
				defaults : {
					showNextBackButton : true,
					showIndexButtons : true,
					nextBtnClass : "btnNext",
					backBtnClass : "btnBack",
					nextBtnLbl : "",
					backbtnLbl : "",
					indexBtnContainerClass : "screenBtnContainer",
					totalScreen : 0
				}
			});

			objCollection = new ScreenNavCollection();
			var objThis = this;
			if (options.hasOwnProperty(this.STR_INDEX_BTNS) && options[this.STR_INDEX_BTNS].length > 0) {
				$.each(options[this.STR_INDEX_BTNS], function(index, item) {
					itemModel = new ScreenNavItemModel();
					itemModel.set(objThis.STR_SCREEN_ID, item.id);
					itemModel.set(objThis.STR_SCREEN_INDEX, index);
					itemModel.set(objThis.STR_SCREEN_NAME, item.name);
					itemModel.set(objThis.STR_SCREEN_LABEL, item.label);
					itemModel.set(objThis.STR_SCREEN_TYPE, item.type);
					itemModel.set(objThis.STR_SCREEN_VISITED, false);
					itemModel.set(objThis.STR_SCREEN_SELECTED, false);
					itemModel.set(objThis.STR_CLASS_NAME, item.className);
					objCollection.add(itemModel);
				});

				that.collection = objCollection;
				bSuccess = true;
			}
			that.model = new ScreenNavModel();
			if (options.hasOwnProperty(this.STR_SHOW_NEXTBACK)) {
				that.model.set(this.STR_SHOW_NEXTBACK, options[this.STR_SHOW_NEXTBACK]);
			}

			if (options.hasOwnProperty(this.STR_SHOW_INDEX_BTNS)) {
				that.model.set(this.STR_SHOW_INDEX_BTNS, options[this.STR_SHOW_INDEX_BTNS]);
			}

			if (options.hasOwnProperty('nextBtnClass')) {
				that.model.set('nextBtnClass', options.nextBtnClass);
			}

			if (options.hasOwnProperty('backBtnClass')) {
				that.model.set('backBtnClass', options.backBtnClass);
			}
			
			if(options.hasOwnProperty('nextBtnLbl')){
				that.model.set('nextBtnLbl', options.nextBtnLbl);
			}
			
			if(options.hasOwnProperty('backBtnLbl')){
				that.model.set('backBtnLbl', options.backBtnLbl);
			}

			if (options.hasOwnProperty('indexBtnContainerClass')) {
				that.model.set('indexBtnContainerClass', options.indexBtnContainerClass);
			}
			
			that.model.set('totalScreen', options[this.STR_INDEX_BTNS].length);

			return bSuccess;
		},
		/**
		 *
		 * @param {Object} nIndex
		 */
		validateIndex : function(nIndex) {
			var bValid = true;
			nIndex = +nIndex;
			if (isNaN(nIndex) || (nIndex !== Math.floor(nIndex))) {
				bValid = false;
			}

			return bValid;
		}
	};

	return screenNavHelper;

});
