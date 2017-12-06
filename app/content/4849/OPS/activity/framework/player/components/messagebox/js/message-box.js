define(['player/base/base-composite-comp', 'text!components/messagebox/templates/message-box.html'], function(BaseCompositeComp, MessageBoxTmpl){
	var MessageBox = BaseCompositeComp.extend({
		
		template : _.template(MessageBoxTmpl),
		EVENT_SUBMIT : 'eventSubmit',
		ui:{
			btnSubmit : "#messageBoxOkBtn",
      		txtMessageBoxInput : "#messageBoxInput"
      	},
		
		initialize : function(options){
			this.objData = options;//this property is being used in componentselector for editing.
			if(options.hasOwnProperty('data')){
				this.prepareData(options.data);
				if(options.hasOwnProperty('ui')){
					this.ui = options.ui;
				}
			}else{
				throw new Error('Please provide required data!');
			}
			this.componentType = "message-box";
		},
		
		onShow : function(){
			var self = this;
			this.model.off('change').on('change', this.render);
			// add listner to ok button
			if(!this.model.get('readonly')){
				if(this.ui){
					this.ui.btnSubmit.off('click').on("click", $.proxy(this.handleOkButtonClick, this));
				}else{
					throw new Error("ui element reference is needed to make the message box work properly!");		
				}
			}
			
			this.$el.on("click", $.proxy(self.compClick, self));
			this.$el.on("mouseover", $.proxy(self.compRollover, self));
			this.$el.on("mouseout", $.proxy(self.compRollout, self));
		}
		
	});
	
	MessageBox.prototype.__super__ = BaseCompositeComp;
	
	MessageBox.prototype.updateData = function(objData){
		this.model.set(objData);
	};
	
	MessageBox.prototype.handleOkButtonClick = function(event){
		// TODO: Need to work here.
		// dispatch submit button click handler.
		this.trigger(this.EVENT_SUBMIT);
	};
	
	MessageBox.prototype.prepareData = function(objData){
		var mbModel = Backbone.Model.extend({});
		if(this.model === undefined){
			this.model = new mbModel(objData);
		}
		console.log(this.model.get('readonly'));
		if(objData.hasOwnProperty('readonly')){
			this.model.set('readonly', objData.readonly);
		}else{
			this.model.set('readonly', true);
		}
	};
	
	MessageBox.prototype.destroy = function(bDestroy){
		if(this.ui){
			this.ui.btnSubmit.off('click', $.proxy(this.handleOkButtonClick, this));
		}
		this.model.off('change', this.render);
		this.model.destroy();
		this.undelegateEvents();
		this.close();
		this.$el.off("click");
		this.$el.off("mouseover");
		this.$el.off("mouseout");

		return this.__super__.prototype.destroy(bDestroy);
	};
	
	return MessageBox;
});
