define(function() {
	"use strict";
	var compList = {
		"components" : {
			"mComp" : [{
				"id" : "ImageComp",
				"name" : "ImageComp",
				"classpath" : "components/image/image"
			}, {
				"id" : "RadioComp",
				"name" : "RadioComp",
				"classpath" : "components/radio/radio"
			}, {
				"id" : "ColorAccessibilityComp",
				"name" : "coloraccessibilityComp",
				"classpath" : "components/coloraccessibility/coloraccessibility"
			}, {
				"id" : "AnswerComp",
				"name" : "AnswerComp",
				"classpath" : "components/answer/answer"
			}, {
				"id" : "MultipleChoiceComp",
				"name" : "MultipleChoiceComp",
				"classpath" : "components/multiplechoice/multiplechoice"
			}, {
				"id" : "ContainerComp",
				"name" : "containerComp",
				"classpath" : "components/container"
			}, {
				"id" : "ScreenComp",
				"name" : "screenComp",
				"classpath" : "components/screen"
			}, {
				"id" : "AnimationPlayerComp",
				"name" : "animationPlayerComp",
				"classpath" : "components/animationplayer/animation-player"
			}, {
				"id" : "CountDownTimerComp",
				"name" : "countDownTimerComp",
				"classpath" : "components/countdowntimer/countdown-timer"
			}, {
				"id" : "DnDAdvanceComp",
				"name" : "DnDAdvanceComp",
				"classpath" : "components/dnd/js/dnd-advance"
			}, {
				"id" : "MCQComp",
				"name" : "MCQComp",
				"classpath" : "components/mcq/js/mcq"
			}, {
				"id" : "AudioPlayerComp",
				"name" : "AudioPlayerComp",
				"classpath" : "components/audioplayer/source/js/audio-player"
			}, {
				"id" : "AudioHotSpotComp",
				"name" : "AudioHotSpotComp",
				"classpath" : "components/audiohotspot/audio-hotspot"
			}, {
				"id" : "VideoPlayerComp",
				"name" : "VideoPlayerComp",
				"classpath" : "components/videoplayer/videoplayer"
			}, {
				"id" : "LifeMeterComp",
				"name" : "LifeMeterComp",
				"classpath" : "components/lifemeter/lifemeter"
			}, {
				"id" : "SliderComp",
				"name" : "SliderComp",
				"classpath" : "components/slider/slider"
			}, {
				"id" : "IdentifierComp",
				"name" : "IdentifierComp",
				"classpath" : "components/identifier/identifier"
			}, {
				"id" : "CarouselComp",
				"name" : "CarouselComp",
				"classpath" : "components/carousel/carousel"
			}, {
				"id" : "ToggleButtonComp",
				"name" : "ToggleButtonComp",
				"classpath" : "components/togglebutton/toggle-button"
			}, {
				"id" : "ToggleButtonGroupComp",
				"name" : "ToggleButtonGroupComp",
				"classpath" : "components/togglebuttongroup/js/toggle-button-group"
			}, {
				"id" : "ReadAloudPlayerComp",
				"name" : "ReadAloudPlayerComp",
				"classpath" : "components/readaloudplayer/read-aloud-player"
			}, {
				"id" : "RadioButtonComp",
				"name" : "RadioButtonComp",
				"classpath" : "components/radiobutton/js/radiobutton"
			}, {
				"id" : "CheckBoxComp",
				"name" : "CheckBoxComp",
				"classpath" : "components/checkbox/js/checkbox"
			}, {
				"id" : "TableComp",
				"name" : "TableComp",
				"classpath" : "components/table/js/custom-table"
			}, {
				"id" : "CalculatorComp",
				"name" : "CalculatorComp",
				"classpath" : "components/calculator/calculator"
			}, {
				"id" : "PhysicsEngineComp",
				"name" : "PhysicsEngineComp",
				"classpath" : "components/physicsengine/physics-engine"
			}, {
				"id" : "SectionNavigatorComp",
				"name" : "SectionNavigatorComp",
				"classpath" : "components/sectionnavigator/section-navigator"
			}, {
				"id" : "ViewStackComp",
				"name" : "ViewStackComp",
				"classpath" : "components/viewstack/js/view-stack"
			}, {
				"id" : "ReorderingComp",
				"name" : "ReorderingComp",
				"classpath" : "components/reordering/js/reordering"
			}, {
				"id" : "OmMeterComp",
				"name" : "OmMeterComp",
				"classpath" : "components/ommeter/js/om-meter"
			}, {
				"id" : "ConnectorComp",
				"name" : "ConnectorComp",
				"classpath" : "components/connector/connector"
			}, {
				"id" : "ButtonComp",
				"name" : "ButtonComp",
				"classpath" : "components/button/button"
			}, {
				"id" : "LabelComp",
				"name" : "LabelComp",
				"classpath" : "components/label/label"
			}, {
				"id" : "CloseCaptionComp",
				"name" : "CloseCaptionComp",
				"classpath" : "components/closecaption/js/close-caption"
			}, {
				"id" : "ScreenNavigatorComp",
				"name" : "ScreenNavigatorComp",
				"classpath" : "components/screennavigator/js/screen-navigator"
			}, {
				"id" : "MessageBoxComp",
				"name" : "MessageBoxComp",
				"classpath" : "components/messagebox/js/message-box"
			}, {
				"id" : "SVGComp",
				"name" : "SVGComp",
				"classpath" : "components/svg/svg"
			}, {
				"id" : "TimerComp",
				"name" : "TimerComp",
				"classpath" : "components/nonvisualtimer/non-visual-timer"
			}, {
				"id" : "TreeComp",
				"name" : "TreeComp",
				"classpath" : "components/tree/tree"
			}, {
				"id" : "CalloutComp",
				"name" : "CalloutComp",
				"classpath" : "components/callout/callout"
			}, {
				"id" : "DndComp",
				"name" : "DndComp",
				"classpath" : "components/dndcomp/dndcomp"
			}, {
				"id" : "DraggableComp",
				"name" : "DraggableComp",
				"classpath" : "components/draggable/draggable"
			}, {
				"id" : "DroppableComp",
				"name" : "DroppableComp",
				"classpath" : "components/droppable/droppable"
			}, {
				"id" : "GridComp",
				"name" : "GridComp",
				"classpath" : "components/gallery/grid"
			}, {
				"id" : "GalleryComp",
				"name" : "GalleryComp",
				"classpath" : "components/gallery/gallery"
			}, {
				"id" : "WidgetComp",
				"name" : "WidgetComp",
				"classpath" : "components/widgetwrapper/widget"
			}, {
				"id" : "AdvancedVideoPlayerComp",
				"name" : "AdvancedVideoPlayerComp",
				"classpath" : "components/advancedvideoplayer/advanced-videoplayer"
			}, {
				"id" : "InputTextComp",
				"name" : "InputTextComp",
				"classpath" : "components/inputtext/inputtext"
			}, {
				"id" : "CaseComp",
				"name" : "CaseComp",
				"classpath" : "components/case/case"
			}, {
				"id" : "ListComp",
				"name" : "ListComp",
				"classpath" : "components/list/list"
			}, {
				"id" : "FibComp",
				"name" : "FibComp",
				"classpath" : "components/fibcomp/fib"
			}, {
				"id" : "DatapickerComp",
				"name" : "DatapickerComp",
				"classpath" : "components/datapicker/datapicker"
			}, {
				"id" : "FibinputComp",
				"name" : "FibinputComp",
				"classpath" : "components/fibinput/fibinput"
			}, {
				"id" : "feedbackComp",
				"name" : "feedbackComp",
				"classpath" : "components/feedback/feedback"
			}, {
				"id" : "popupComp",
				"name" : "popupComp",
				"classpath" : "components/popup/popup"
			}, {
				"id" : "sortableComp",
				"name" : "sortableComp",
				"classpath" : "components/sortable/sortable"
			}, {
				"id" : "hintComp",
				"name" : "hintComp",
				"classpath" : "components/hint/hint"
			}, {
				"id" : "sortingComp",
				"name" : "sortingComp",
				"classpath" : "components/sorting/sorting"
			}, {
				"id" : "wizardComp",
				"name" : "wizardComp",
				"classpath" : "components/wizard/wizard"
			}, {
				"id" : "livesComp",
				"name" : "livesComp",
				"classpath" : "components/lives/lives"
			}, {
				"id" : "tabComp",
				"name" : "tabComp",
				"classpath" : "components/tab/tab"
			}, {
				"id" : "flipcardComp",
				"name" : "flipcardComp",
				"classpath" : "components/flipcard/flipcard"
			}, {
				"id" : "canvasComp",
				"name" : "canvasComp",
				"classpath" : "components/canvas/canvas"
			}, {
				"id" : "pencilComp",
				"name" : "pencilComp",
				"classpath" : "components/pencil/pencil"
			}, {
				"id" : "eraserComp",
				"name" : "eraserComp",
				"classpath" : "components/eraser/eraser"
			}, {
				"id" : "lifeComp",
				"name" : "lifeComp",
				"classpath" : "components/life/life"
			}, {
				"id" : "matchingChildComp",
				"name" : "matchingChildComp",
				"classpath" : "components/matchingChild/matchingChild"
			}, {
				"id" : "matchingComp",
				"name" : "matchingComp",
				"classpath" : "components/matching/matching"
			}, {
				id : "animationComp",
				name : "animationComp",
				classpath : "components/animation/animation"
			}]
		}
	};
	return compList;
});
