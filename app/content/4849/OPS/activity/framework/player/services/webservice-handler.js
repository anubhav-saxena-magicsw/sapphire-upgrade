define(['authoring/wrapper/libs/sessionService'], function(SessionService) {
	"use strict";
	var serviceHandler;
	serviceHandler = {

		/*api's contants*/
		USER_LOGIN : "login",
		USER_DASHBOARD_DATA : "getAllUserSavedActivities",
		USER_SAVE_SETTINGS : "saveSettings",
		USER_GET_ALL_TEMPLATES : " getAllTemplates",
		USER_CREATE_ACTIVITY : "createActivity",
		USER_LOGOUT : "logout",
		USER_DELETE_ACTIVITY : "deleteActivity",
		USER_UPLOAD_ASSET : 'uploadAsset',
		USER_SAVE_ACTIVITY : 'saveActivity',
		USER_PREVIEW_ACTIVITY : 'previewActivity',
		USER_EDIT_ACTIVITY : 'editActivity',
		USER_GET_ASSETS : 'getAssets',

		scope : null,
		success : null,
		error : null,

		loginUser : function(scope, success, error) {
			this.detachEventsFromDataLoader();
			this.scope = scope;
			this.success = success;
			this.error = error;
			Data_Loader.load({
				scope : this,
				errorEvent : null,
				type : "post",
				url : this.USER_LOGIN,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				data : {
					username : this.scope.objActivity.$el.find("#login").val().trim(),
					password : this.scope.objActivity.$el.find("#password").val().trim()
				}
			});
		},

		getUserDashboardData : function(scope, success, error) {
			this.scope = scope;
			this.success = success;
			this.error = error;
			this.detachEventsFromDataLoader();
			Data_Loader.load({
				scope : this,
				errorEvent : '',
				type : "get",
				url : this.USER_DASHBOARD_DATA,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				headers : {
					token : SessionService.getUserToken()
				},
				data : {
					userid : SessionService.getUserId()
				}
			});
		},

		getAssets : function(scope, success, error) {
			this.scope = scope;
			this.success = success;
			this.error = error;
			this.detachEventsFromDataLoader();
			Data_Loader.load({
				scope : this,
				errorEvent : '',
				type : "get",
				url : this.USER_GET_ASSETS,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				headers : {
					token : SessionService.getUserToken()
				},
				data : {
					userid : SessionService.getUserId()
				}
			});
		},
		saveUserActivitySettings : function(scope, success, error) {
			this.scope = scope;
			this.success = success;
			this.error = error;
			this.detachEventsFromDataLoader();
			Data_Loader.load({
				scope : this,
				errorEvent : '',
				type : "get",
				url : this.USER_SAVE_SETTINGS,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				headers : {
					token : SessionService.getUserToken()
				},
				data : {
					userid : SessionService.getUserId(),
					name : $('#ActivityName').val().trim()
				}
			});
		},
		
		createUserActivity : function(scope, success, error) {
			this.scope = scope;
			this.success = success;
			this.error = error;
			this.detachEventsFromDataLoader();
			Data_Loader.load({
				scope : this,
				errorEvent : '',
				type : "post",
				url : this.USER_CREATE_ACTIVITY,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				headers : {
					token : SessionService.getUserToken()
				},
				data : {
					id : SessionService.getActivityId(),
					data : this.scope.selectedActivitiesList,
					userid : SessionService.getUserId()
				}
			});
		},
		getAllTemplates : function(scope, success, error) {
			this.scope = scope;
			this.success = success;
			this.error = error;
			this.detachEventsFromDataLoader();
			Data_Loader.load({
				scope : this,
				errorEvent : '',
				type : "get",
				url : this.USER_GET_ALL_TEMPLATES,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				headers : {
					token : SessionService.getUserToken()
				}
			});
		},
		deleteActivity : function(scope, success, error, id) {
			this.scope = scope;
			this.success = success;
			this.error = error;
			this.detachEventsFromDataLoader();
			Data_Loader.load({
				scope : this,
				errorEvent : '',
				type : "get",
				url : this.USER_DELETE_ACTIVITY,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				headers : {
					token : SessionService.getUserToken()
				},
				data : {
					id : id
				}
			});
		},
		
		
		editActivity : function(scope, success, error, data) {
			this.scope = scope;
			this.success = success;
			this.error = error;
			this.detachEventsFromDataLoader();
			Data_Loader.load({
				scope : this,
				errorEvent : '',
				type : "get",
				url : this.USER_EDIT_ACTIVITY,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				headers : {
					token : SessionService.getUserToken()
				},
				data : data
			});
		},
		logoutUser : function(scope, success, error) {
			this.scope = scope;
			this.success = success;
			this.error = error;
			this.detachEventsFromDataLoader();
			Data_Loader.load({
				scope : this,
				errorEvent : '',
				type : "get",
				url : this.USER_LOGOUT,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				headers : {
					token : SessionService.getUserToken()
				}
			});
		},
		uploadAssset : function(scope, success, error, formdata) {
			this.scope = scope;
			this.success = success;
			this.error = error;
			this.detachEventsFromDataLoader();
			Data_Loader.load({
				scope : this,
				errorEvent : '',
				type : "post",
				url : this.USER_UPLOAD_ASSET,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				data : formdata
			});
		},

		saveActivity : function(scope, success, error, data) {
			this.scope = scope;
			this.success = success;
			this.error = error;
			this.detachEventsFromDataLoader();
			Data_Loader.load({
				scope : this,
				errorEvent : '',
				type : "post",
				url : this.USER_SAVE_ACTIVITY,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				data : data
			});
		},
		previewActivity : function(scope, success, error) {
			this.scope = scope;
			this.success = success;
			this.error = error;
			this.detachEventsFromDataLoader();
			Data_Loader.load({
				scope : this,
				errorEvent : '',
				type : "get",
				url : this.USER_PREVIEW_ACTIVITY,
				dataType : "json",
				contentType : "application/json",
				returnType : "json",
				data : data
			});
		},

		handleDataLoadSuccess : function(objData) {
			this.SCOPE.scope[this.SCOPE.success].call(this.SCOPE.scope, this.SCOPE.success, objData);
		},

		handleDataLoadFailed : function(objData) {
			this.SCOPE.scope[this.SCOPE.error].call(this.SCOPE.scope, this.SCOPE.error, objData);
		},

		detachEventsFromDataLoader : function() {
			Data_Loader.off(Data_Loader.DATA_LOAD_SUCCESS);
			Data_Loader.off(Data_Loader.DATA_LOAD_FAILED);
			Data_Loader.on(Data_Loader.DATA_LOAD_SUCCESS, this.handleDataLoadSuccess);
			Data_Loader.on(Data_Loader.DATA_LOAD_FAILED, this.handleDataLoadFailed);
		}
	};
	return serviceHandler;

});
