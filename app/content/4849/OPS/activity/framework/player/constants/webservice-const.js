/**
 * WebServiceConst
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
 */
define(function() {
	"use strict";
	/**
	 * This contains constants.
	 * @namespace
	 * @access private
	 */
	var WebServiceConst = {

		/** userLogin **/
		SERVICE_USER_LOGIN : "userLogin",

		/** uesrLogout **/
		SERVICE_USER_LOGOUT : "uesrLogout",

		/** userCreateActivity **/
		SERVICE_USER_CREATE_ACTIVITY : 'userCreateActivity',

		/** uesrDeleteActivity **/
		SERVICE_USER_DELETE_ACTIVITY : "uesrDeleteActivity",
		/** uesrExportActivity **/

		SERVICE_USER_EXPORT_ACTIVITY : "userExportActivity",
		/** userSaveActivity **/

		SERVICE_USER_SAVE_ACTIVITY : "userSaveActivity",
		/** userMarkActivity **/

		SERVICE_USER_COPY_ACTIVITY : "userCopyActivity",
		/** userCopyActivity **/

		SERVICE_USER_MARK_ACTIVITY : "userMarkActivity",
		/** userPreviewActivity **/

		SERVICE_USER_PREVIEW_ACTIVITY : "userPreviewActivity",

		/** userEditActivity **/
		SERVICE_USER_EDIT_ACTIVITY : "userEditActivity",

		/** userUploadAssets **/
		SERVICE_USER_UPLOAD_ASSETS : "userUploadAssets",
		/** userCopyAssets **/
		SERVICE_USER_COPY_ASSETS : "userCopyAssets",

		/** userUploadAssets **/
		SERVICE_USER_DELETE_ASSETS : "userDeleteAssets",

		/** userGetAssets **/
		SERVICE_USER_GET_ASSETS : "userGetAssets",

		/** userDashboardData **/
		SERVICE_USER_DASHBOARD_DATA : "userDashboardData",

		/** userGetAllTemplate **/
		SERVICE_USER_GET_ALL_TEMPLATE : "userGetAllTemplate",
		/** userDeleteTemplate **/
		SERVICE_USER_DELETE_TEMPLATE : "userDeleteTemplate",
		/** userUserTemplate **/
		SERVICE_USERS_DELETE_TEMPLATE : "userDeleteUserTemplate",
		/** userUserTemplate **/
		SERVICE_USER_EDIT_TEMPLATE : "userEditTemplate",
		/** userGetUserTemplate **/
		SERVICE_USER_GET_USER_TEMPLATE : "userGetUserTemplate",
		/** userSaveSettings **/
		SERVICE_USER_SAVE_SETTINGS : "userSaveSettings",

		/** ---------END XML ENTRY----------------------------- */

		/** saveService */
		SERVICE_SAVE : "saveService",

		/** deleteService */
		SERVICE_DELETE : "deleteService",

		/** openService */
		SERVICE_OPEN : "openService",

		/** previewService */
		SERVICE_PREVIEW : "previewService",

		/** exportService */
		SERVICE_EXPORT : "exportService",

		/** copyService */
		SERVICE_COPY : "copyService"
	};

	return WebServiceConst;

});
