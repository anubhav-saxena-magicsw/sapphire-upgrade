! function(t) {
	t.widget("Template.DND", t.custom.BASEWIDGET, {
		constants : {
			ONE_TO_ONE : "oneToOne",
			ONE_TO_MANY : "oneToMany",
			DRAG_START : "onDragStart",
			DRAG : "onDrag",
			DRAG_STOP : "onDragStop",
			ON_DROP : "onDrop",
			WIDGET_EVENT : "WIDGET_EVENT",
			ON_ANSWER_CHECKED : "onAnswerChecked",
			RESET_COMPLETE : "onReset",
			INIT_COMPLETE : "initComplete",
			VERTICAL_ALIGN : "vertical"
		},
		dndData : {
			dragItemPosList : {},
			objPosition : {},
			bRevert : !0,
			targetDiv :
			void 0,
			containerDiv :
			void 0,
			containment :
			void 0,
			zPosition : 1,
			type : "oneToOne"
		},
		options : {
			parentDiv : null,
			parentObject : null,
			widgetData : null,
			arrDraggableItem : null,
			arrDropItem : null,
			updatedScale : 1,
			currentPos : {},
			start : {},
			functionList : ["resetDnd", "enableOption", "disableOption", "resetOption", "unfreezeDnd", "freezeDnd", "checkAnswer", "showAnswer", "getElementPostion"]
		},
		_create : function() {
		},
		_init : function() {
			this.dndData.type = this.constants.ONE_TO_ONE, this.initalizeDragItem(), this.initalizeDropItem(), this.dispatchEvent(this.constants.INIT_COMPLETE)
		},
		initalizeDragItem : function() {
			this.resetDnd();
			var i, o, n = this;
			for (this.options.arrDraggableItem = this.options.parentDiv.find("[type=draggable]"), i = 0; i < this.options.arrDraggableItem.length; i += 1)
				o = {}, o.id = this.options.arrDraggableItem[i].id, o.left = t(this.options.arrDraggableItem[i]).css("left"), o.top = t(this.options.arrDraggableItem[i]).css("top"), this.dndData.objPosition[o.id] = o;
			t(n.options.arrDraggableItem).draggable({
				start : function(t, i) {
					n.onDragStart(t, i)
				},
				drag : function(t, i) {
					n.onDrag(t, i)
				},
				stop : function(t, i) {
					n.onDragStop(t, i)
				}
			}),
			void 0 !== this.options.widgetData.containment && (this.dndData.containment = t(this.options.widgetData.containment), t(n.options.arrDraggableItem).draggable({
				containment : n.options.widgetData.containment
			}))
		},
		initalizeDropItem : function() {
			var o, n = this;
			for (this.options.arrDropItem = this.options.parentDiv.find("[type=droppable]"), i = 0; i < this.options.arrDropItem.length; i += 1)
				o = {}, o.id = this.options.arrDropItem[i].id, o.left = t(this.options.arrDropItem[i]).css("left"), o.top = t(this.options.arrDropItem[i]).css("top"), this.dndData.objPosition[o.id] = o;
			t(this.options.arrDropItem).droppable({
				drop : function(t, i) {
					n.onDrop(t, i)
				}
			})
		},
		onDragStart : function(i, o) {
			var n;
			this.dndData.zPosition = this.dndData.zPosition + 1, o.helper.css("z-index", this.dndData.zPosition), this.dndData.targetDiv = t(o.helper), n = this.dndData.objPosition[this.dndData.targetDiv.attr("id")].dropAt,
			void 0 !== n && (this.dndData.type === this.constants.ONE_TO_MANY && this.rearrangeDroppedItem(this.dndData.targetDiv.attr("id"), n.attr("id")),
			delete this.dndData.objPosition[t(n).attr("id")].droppedItem),
			delete this.dndData.objPosition[this.dndData.targetDiv.attr("id")].dropAt, this.dndData.targetDiv =
			void 0, this.dndData.containerDiv =
			void 0, this.prepareAndDispatchData(i, o, this.constants.DRAG_START), this.dndData.currentDraggable = o.helper, this.options.start.x = i.clientX, this.options.start.y = i.clientY, console.log("onDragStart!!!!")
		},
		onDrag : function(t, i) {
			this.prepareAndDispatchData(t, i, this.constants.DRAG);
			var o, n, a;
			1 !== Number(this.options.updatedScale) && ( o = i.originalPosition.left + (t.clientX - this.options.start.x) / Number(this.options.updatedScale), n = i.originalPosition.top + (t.clientY - this.options.start.y) / this.options.updatedScale, a = this.containementCordinates(), o < a.left ? o = a.left : o > a.right && ( o = a.right), n < a.top ? n = a.top : n > a.bottom && ( n = a.bottom), i.position.left = o, i.position.top = n, this.options.currentPos = {
				left : o,
				top : n
			})
		},
		containementCordinates : function() {
			var i, o, n, a;
			return
			void 0 !== this.dndData.containment && ( i = 0, o = 0, n = i + this.dndData.containment.width() - t(this.dndData.currentDraggable).width(), a = o + this.dndData.containment.height() - t(this.dndData.currentDraggable).height()), {
				left : i,
				top : o,
				right : n,
				bottom : a
			}
		},
		onDragStop : function(t, i) {
			switch(this.dndData.type) {
				case this.constants.ONE_TO_ONE:
					this.handleOnetoOne(t, i);
					break;
				case this.constants.ONE_TO_MANY:
					this.handleOneToMany(t, i)
			}
			this.dndData.bRevert =
			void 0
		},
		handleOnetoOne : function(i, o) {
			void 0 === this.dndData.containerDiv ||
			void 0 !== this.dndData.objPosition[this.dndData.containerDiv.attr("id")].droppedItem ||
			void 0 === this.dndData.bRevert || this.dndData.bRevert === !0 ? (t(o.helper).css("left", this.dndData.objPosition[t(o.helper).attr("id")].left), t(o.helper).css("top", this.dndData.objPosition[t(o.helper).attr("id")].top)) : (this.dndData.objPosition[this.dndData.targetDiv.attr("id")].dropAt = this.dndData.containerDiv, this.dndData.objPosition[this.dndData.containerDiv.attr("id")].droppedItem = this.dndData.targetDiv, this.setPosition(this.dndData.targetDiv, this.dndData.containerDiv), this.dndData.targetDiv =
			void 0, this.dndData.containerDiv =
			void 0)
		},
		onDrop : function(i, o) {
			var n, a;
			n = t(o.draggable), a = t(i.target), this.dndData.bRevert = !0, this.dndData.bRevert = "droppable" === a.attr("type") ? !1 : !0, this.dndData.targetDiv = n, this.dndData.containerDiv = a, this.prepareAndDispatchData(i, o, this.constants.ON_DROP)
		},
		prepareAndDispatchData : function(t, i, o) {
			var n = {};
			n.objEvent = t, n.ui = t, this.dispatchEvent(o, {}, n)
		},
		setPosition : function(i, o) {
			console.log('setting position')
			var n, a;
			o = t(o), i = t(i), n = parseFloat(o.css("left")) + (o.innerWidth() - i.innerWidth()) / 2, a = parseFloat(o.css("top")) + (o.innerHeight() - i.innerHeight()) / 2, i.css("position", "absolute"), i.css("left", n + "px"), i.css("top", a + "px")
		},
		checkAnswer : function() {
			if (this.dndData.type === this.constants.ONE_TO_MANY)
				return this.checkAnswerInOneTwoMany(),
				void 0;
			var i, o, n, a, e = {}, s = this.options.widgetData.correctList;
			for ( o = 0; o < this.options.arrDraggableItem.length; o += 1) {
				if ( n = this.options.arrDraggableItem[o].id,
				void 0 === this.dndData.objPosition[n].dropAt) {
					i = !1;
					break
				}
				if ( a = t(this.dndData.objPosition[n].dropAt).attr("id"), i = a === s[n], i === !1)
					break
			}
			for (e.isCorrect = i, e.correctList = [], e.incorrectList = [], o = 0; o < this.options.arrDraggableItem.length; o += 1)
				n = this.options.arrDraggableItem[o].id,
				void 0 !== this.dndData.objPosition[n].dropAt ? ( a = t(this.dndData.objPosition[n].dropAt).attr("id"), i = a === s[n], i === !1 ? e.incorrectList.push(n) : e.correctList.push(n)) : e.incorrectList.push(n);
			this.dispatchEvent(this.constants.ON_ANSWER_CHECKED, {}, e)
		},
		freezeDnd : function() {
			var i;
			for ( i = 0; i < this.options.arrDraggableItem.length; i += 1)
				this.disableOption(t(this.options.arrDraggableItem[i]).attr("id"))
		},
		unfreezeDnd : function() {
			for ( i = 0; i < this.options.arrDraggableItem.length; i += 1)
				this.enableOption(t(this.options.arrDraggableItem[i]).attr("id"))
		},
		disableOption : function(i) {
			var o = t("#" + i, this.options.parentDiv);
			void 0 !== o ? o.draggable("disable") : console.log(i + " not found.")
		},
		resetOption : function(i) {
			var o = t(i, this.options.parentDiv);
			o.css("left", this.dndData.objPosition[i].left), o.css("top", this.dndData.objPosition[i].top),
			delete this.dndData.objPosition[i].dropAt,
			delete this.dndData.objPosition[i].droppedItem
		},
		enableOption : function(i) {
			var o = t("#" + i, this.options.parentDiv);
			void 0 !== o ? o.draggable("enable") : console.log(i + " not found.")
		},
		resetDnd : function() {
			var i, o, n = 0;
			if (this.options.arrDropItem)
				for ( n = 0; n < this.options.arrDropItem.length; n += 1)
					o = this.options.arrDropItem[n].id,
					delete this.dndData.objPosition[t(this.options.arrDropItem[n]).attr("id")].droppedItem;
			if (this.options.arrDropItem)
				for ( n = 0; n < this.options.arrDraggableItem.length; n += 1)
					o = this.options.arrDraggableItem[n].id, i = t(this.options.arrDraggableItem[n]), i.css("left", this.dndData.objPosition[o].left), i.css("top", this.dndData.objPosition[o].top),
					delete this.dndData.objPosition[t(this.options.arrDraggableItem[n]).attr("id")].dropAt;
			this.options.arrDropItem && (this.dndData.targetDiv =
			void 0, this.dndData.containerDiv =
			void 0, this.dispatchEvent(this.constants.RESET_COMPLETE))
		},
		setStageScaleValue : function(t) {
			this.options.updatedScale = Number(t)
		},
		showAnswer : function() {
		},
		getElementPostion : function() {
			return this.dndData.dragItemPosList
		},
		destroy : function() {
			t(this.options.arrDraggableItem).draggable("destroy"), t(this.options.arrDropItem).draggable("destroy")
		}
	})
}(jQuery); 