$.widget("Template.MCQ", $.custom.BASEWIDGET, {
	options : {
		ctype:'',
		answersArray : [],
		answersCheckedOrder : [],
		functionList : ["reset", "showAnswer", "result", "showFeedback", "hideFeedback"]
	},
	_create : function() {
	},
	_init : function() {
		var that =  this;
		this.dispatchEvent("ON_INIT");
		var e, t, s, i;
		if ( e = this, s = e.uuid, t = e.element, e.options.answersArray[s] = t.attr("ans").trim().split("|"), t.removeAttr("ans"), e.options.answersCheckedOrder[s] = new Array, i = e.options.answersArray[s].slice(0), $.each(t.find('[data-type="option"]'), function(e) {
				var e = i.indexOf((e + 1).toString());
				-1 !== e && i.splice(e, 1)
			}), 0 !== i.length)
			throw "Question number " + (s + 1) + " has wrong options";
		t.removeAttr("answers"), t.find('[data-type="option"]').off("click").on("click", function() {
			 if(that.options.widgetData.ctype==='clickwords'){
		            $(this).addClass("active");
		        }
		        else 
		        { 
			  	 	var i = $(this).hasClass("active");
			       i ? $(this).removeClass("active") : $(this).addClass("active")
			    }; 
			
			e._checkAnswer(s, t.find('[data-type="option"]').index($(this)), t, !i)
		})
	},
	_arraysIdentical : function(e, t) {
		if (e.length !== t.length)
			return !1;
		for (var s = e.length; s--; )
			if (e[s] !== t[s])
				return !1;
		return !0
	},
	_checkAnswer : function(e, t, s, i) {
		var n = this.options.answersCheckedOrder[e].slice(0), a = this.options.answersArray[e];
		if (i){
			if(n.indexOf((t + 1).toString())==-1)
		     	n.push((t + 1).toString());
			}
		else {
	   if(this.options.ctype==='clickwords'){
		   var r = n.indexOf((t + 1).toString());
		 	   n.splice(r, 1)
		}
		}
		if (this.options.answersCheckedOrder[e] = n, n.length > a.length) {
			var o = s.find('[data-type="option"]').eq(parseInt(n.shift()) - 1);
			o.removeClass("active"), "INPUT" === o.get(0).tagName && o.attr("checked", !1)
		}
		this._arraysIdentical(n.slice(0).sort(), a.slice(0).sort()) ? this.dispatchEvent("ON_CORRECT_ANSWER", {}, s) : this.dispatchEvent("ON_INCORRECT_ANSWER", {}, s)
	},
	reset : function() {
	   this.element.find('[data-type="option"]').removeClass("active"); "INPUT" === this.element.find('[data-type="option"]').get(0).tagName && this.element.find('[data-type="option"]').attr("checked", !1);
		for (var e in this.options.answersCheckedOrder)
		this.options.answersCheckedOrder[e] = new Array;
		$(".feedback").remove(), this.dispatchEvent("ON_RESET")
	},
	showAnswer : function() {
		var e = this;
		e.element.find('[data-type="option"]').removeClass("active"), "INPUT" === e.element.find('[data-type="option"]').get(0).tagName && e.element.find('[data-type="option"]').attr("checked", !1), e.options.answersCheckedOrder[e.uuid] = e.options.answersArray[e.uuid], $.each(e.element.find('[data-type="option"]'), function(t) {
			-1 !== e.options.answersArray[e.uuid].indexOf((t + 1).toString()) && ("INPUT" === $(this).get(0).tagName && (this.checked = !0), $(this).addClass("active"))
		}), this.dispatchEvent("ON_SHOW_ANSWER")
	},
	result : function() {
		for (var e = [], t = 0; t < this.options.answersArray.length; t++)
			e[t + 1] = this._arraysIdentical(this.options.answersArray[t], this.options.answersCheckedOrder[t]) ? 1 : 0;
		this.options.answersArray.length === this.uuid + 1 && this.dispatchEvent("ON_SHOW_RESULT", {}, e)
	},
	showFeedback : function() {
		this.element.find(".feedback").remove();
		for (var e in this.options.answersCheckedOrder[this.uuid])
		if (-1 !== this.options.answersArray[this.uuid].indexOf(this.options.answersCheckedOrder[this.uuid][e])) {
			var t = $('<div style="display: inline-block" class="feedback correct"></div>');
			this.element.find('[data-type="option"]').eq(parseInt(this.options.answersCheckedOrder[this.uuid][e]) - 1).parent().append(t)
		} else {
			var s = $('<div style="display: inline-block" class="feedback incorrect"></div>');
			this.element.find('[data-type="option"]').eq(parseInt(this.options.answersCheckedOrder[this.uuid][e]) - 1).parent().append(s)
		}
		this.dispatchEvent("ON_SHOW_FEEDBACK")
	},
	hideFeedback : function() {
		$(".feedback").remove(), this.dispatchEvent("ON_SHOW_FEEDBACK")
	},
	destroy : function() {
		delete this.options.answersCheckedOrder,
		delete this.options.answersArray, this.element.find('[data-type="option"]').off("click")
	}
}); 