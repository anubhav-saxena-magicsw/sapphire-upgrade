/**
 * ErrorConst
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * Here is the full license text and copyright
 * notice for this file. Note that the notice can span several
 * lines and is only terminated by the closing star and slash.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */
define(function() {
	"use strict";
	var ErrorConst = {

		/** Activity config does not have any activity data! */
		CONFIG_MISSING_ACTIVITY_DATA : "Activity config does not have any activity data!",

		/** No activity found by this id!!! */
		ACTIVITY_NOT_FOUND_BY_THIS_ID : "No activity found by this id!!!",

		/** You need to extend BaseActivity to add this activity in view. */
		ACITIVITY_MUST_EXTEND_BASE_CLASS : "You need to extend BaseActivity to add this activity in view.",

		/**  is already registered with the view. */
		ACTIVITY_ALREADY_REGISTERED : " is already registered with the view.",

		/** Localization language load failed. */
		LOCALIZATION_LANGUAGE_LOAD_FAILD : "Localization language load failed.",

		/** Created component(s) in this activity is not destroyed. Call destroy method of each component(s). */
		ALL_ACTIVITY_COMPONENT_NOT_DESTROYED : "Created component(s) in this activity is not destroyed. Call destroy method of each component(s).",

		/** Pleaes call BaseActivity 'destroy' method before to unload the activity. */
		BASE_ACTIVITY_DESTROY_NOT_CALLED : "Pleaes call BaseActivity 'destroy' method before to unload the activity.",

		/** Destroy is not implemented in Editor child class. */
		DESTROY_NOT_IMPLMENENTED_IN_EDIOTR_CHILD_CLASS : "Destroy is not implemented in Editor child class.",

		/** Destroy is not implemented in Editor child class. */
		PLEASE_CALL_SUPER_CLASS_DESTORY_FROM_COMPONENT_EDITOR : "Please call super class destroy method from comp editor class",

		/** Destroy is not implemented in child class. */
		DESTROY_NOT_IMPLMENENTED_IN_CHILD_CLASS : "Destroy is not implemented in child class.",

		/**  'id' keyword is not associated with given object, Please add in -  */
		ID_IS_NOT_ASSOCIATED_WITH_OBJECT : " 'id' keyword is not associated with given object, Please add in - ",

		/**  is already registered with  */
		IS_ALREADY_REGISTERED : " is already registered with ",

		/** ' callback method is ' */
		CALLBACK_METHOD_IS : "' callback method is '",

		/** ' remove reference before to unload this activity */
		REMOVE_REFERENCE_BEFOER_TO_UNLOAD : "' remove reference before to unload this activity",

		/** ' is attached with  */
		IS_ATTACHED_WITH : "' is attached with ",

		/** No 'Region' find with this id  */
		NO_REGION_FIND : "No 'Region' find with this id ",

		//DATA LOADER
		/** 'DATA_LOADER!! An unknown error occurred, kindly check file format.......' */
		UNKNOW_ERROR_WHILE_CONVERTING_DATA : 'DATA_LOADER!! An unknown error occurred, kindly check file format.......',

		/** No url has been specified! */
		NO_URL : "No url has been specified!",

		/** DATA_LOADER!! an unknow error occured */
		UNKNOW_ERROR : "DATA_LOADER!! an unknow error occured",

		/** DATA LOADER!! Error received while loading file.... */
		ERROR_WHILE_LOADING_FILE : "DATA LOADER!! Error received while loading file....",

		/** Slider can not be initlized without default data. */
		SLIDER_DEFAULT_DATA_MISSING : "Slider can not be initlized without default data.",

		/** Screen Navigator can not be initlized without default data. */
		SCREEN_NAV_DEFAULT_DATA_MISSING : "Slider can not be initlized without default data.",

		/** Image Component can not be initlized without src data. */
		IMAGE_DEFAULT_DATA_MISSING : "Image Component can not be initlized without src data.",

		/** Button Component can not be initlized without src data. */
		BUTTON_DEFAULT_DATA_MISSING : "Button Component can not be initlized without src data.",

		/** Lifemeter can not be initlized without default data. */
		LIFEMETER_DEFAUTL_DATA_MISSING : "LifeMeter can not be initlized without default data.",
		/** CountdownTimer can not be initlized without default data. */
		COUNTDOWN_TIMER_DEFAUTL_DATA_MISSING : "Countdown timer can not be initlized without default data.",

		/** MCQ can not be initialized without default data. */
		MCQ_DEFAULT_DATA_MISSING : "MCQ can not be initialized without default data.",

		/** Animation player can not be initlized without default data. */
		ANIMATION_PLAYER_DEFAUTL_DATA_MISSING : "Animation player can not be initlized without default data.",

		/** Duplicate mComp id found in HTML. */
		DUPLICATE_COMPONENT_ID_FOUND_IN_HTML : "Duplicate mComp id found in HTML.",

		/** Duplicate mComp id found in JSON. */
		DUPLICATE_COMPONENT_ID_FOUND_IN_JSON : "Duplicate mComp id found in JSON.",

		/** Error occured!!!!! while destroying screen, screen's components and its events **/
		ERROR_OCCURED_WHILE_DESTROYING_SCREEN_AND_ITS_EVENTS : "Error occured!!!!! while destroying screen, screen's components and its events.",

		/** Please provide required data! **/
		REQUIRED_DATA_MISSING : "Please provide required data!",

		/** An unexpected error occurred! */
		UNEXPECTED_ERROR : "An unexpected error occurred!",

		/** Same load priority found, Please check activityConfig xml file! */
		SAME_LOAD_PRIORITY_DEFINED : "Same load priority found, Please check activityConfig xml file!",

		/** Default Data is Missing while creating widget! */
		DEFUALT_DATA_MISSING_IN_WIDGET : "Default Data is Missing while creating widget!",

		/** This 'activity' is created with the older version, hence edit will not work with this activity. */
		ACTIVITY_CAN_NOT_EDIT : "This 'activity' is created with the older version, hence edit will not work with this activity.",

		/** Selected Component can not hold this component as its child */
		COMPONENT_NOT_ALLOWED_AS_CHILD_COMPONENT : "Invalid Action!, Selected Component can not hold created component as its child. See help for more info.",

		/** In process. Please wait!!!! */
		IN_PROCESS_PLEASE_WAIT : "In process. Please wait!!!!",

		//***************************/
		PROJECT_TITLE : "Editor"
	};
	return ErrorConst;
});
