/*jslint nomen: true*/
/*globals ServiceManagerFactory,PlayerConst,console,_*/
/**
 * WebServiceMethod
 * @fileoverview
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 * @access private
 *
 */

/**
 * Initialize
 * @class WebServiceMethod
 * This class initializes and executes the webservice.
 * @access private
 */
var WebServiceMethod = function() {'use strict';
    /** 
     * @access private
     * @memberof WebServiceMethod
     * @property {String} _name Contains the name of method. */
    this._name = "";
    /** 
     * @access private
     * @memberof WebServiceMethod
     * @property {Array} _param Contains array of method parameters. */
    this._param = [];
    /** 
     * @access private
     * @memberof WebServiceMethod
     * @property {String} _service Contains the service info. */
    this._service = "";
    /** 
     * @access private
     * @memberof WebServiceMethod
     * @property {String} _service Contains the service envelope. */
    this._envelopetype = "";

    /** This function initializes the web service method
     * @access private
     * @memberof WebServiceMethod
     * @param {Object} service Object of service information.
     * @param {Object} objMethod Object of service method.
     * @returns None
     */
    this.init = function(service, objMethod) {
        if (service === undefined || service === "undefined") {
            console.log("invalid service method\r" + objMethod);
            return;
        }
        if ( typeof (objMethod) !== "object") {
            console.log("invalid service method\r" + objMethod);
            return;
        }
        if (objMethod.param === undefined || typeof (objMethod.param) !== "object") {
            console.log("invalid service method\r" + objMethod);
            return;
        }
        if (objMethod.name === undefined || objMethod.name === "") {
            console.log("invalid service method\r" + objMethod);
            return;
        }
        if (objMethod.ajaxParam !== undefined && typeof (objMethod.ajaxParam) === "object") {
            this._ajaxParam = objMethod.ajaxParam;
        }
        if (objMethod.envelopetype !== undefined) {
            this._envelopetype = objMethod.envelopetype;
        }
        this._name = objMethod.name;
        this._param = objMethod.param;
        this._service = service;
    };

    /** This function is used to call the web service
     * @access private
     * @memberof WebServiceMethod
     * @param {Object} context Object of context.
     * @param {Function} successCallback Object reference of success handler.
     * @param {Function} errorCallback Object reference of error handler
     * @param {Array} arrParam Array of parameters.
     * @param {String} callType Object of service.
     * @param {Boolean} hasProgBar Progress bar availability
     * @param {String} strMetakey Meta data key.
     * @returns None
     */
    this.run = function(context, successCallback, errorCallback, arrParam, callType, hasProgBar, strMetakey) {

        var objCall, objData, webServiceCallType, soapEnvelope;

        if (callType === undefined) {
            callType = this._name;
        }

        if (hasProgBar === undefined) {
            hasProgBar = true;
        }

        objData = {
            methodName : this._name,
            params : arrParam
        };

        switch (this._envelopetype) {
            case PlayerConst.SOAP_WEB_SERVICE:
                //						soapEnvelope = this.getSOAPEnvelopDataWithTNS(objData);
                soapEnvelope = this.getSOAPEnvelopData(objData);
                webServiceCallType = PlayerConst.WEB_SERVICE_CALL;
                break;

            case PlayerConst.REST_WEB_SERVICE:
                this._service.url = this.getRESTUrl(objData);
                webServiceCallType = PlayerConst.REST_SERVICE_CALL;
                break;

            default:
                soapEnvelope = this.getSOAPEnvelopData(objData);
                webServiceCallType = PlayerConst.WEB_SERVICE_CALL;
        }

        if (soapEnvelope === false) {
            console.log("Can not continue. Parameter missing.");
            return;
        }

        objCall = {
            url : this._service.url,
            success : function(objData, textStatus, jqXHR, objCall) {
                successCallback.apply(context, [objData, textStatus, jqXHR, objCall]);
            },
            error : function() {
                errorCallback.apply(context);
            },
            hasProgressBar : hasProgBar,
            data : soapEnvelope,
            method : this._name,
            callType : callType,
            requestType : webServiceCallType
        };

        if (strMetakey) {
            objCall.metaKey = strMetakey;
        }

        ServiceManagerFactory.getContext().send(objCall);
    };

    /** This function is used to get the url for REST based service
     * @access private
     * @memberof WebServiceMethod
     * @param {Object} objData Object that contains method name and paratmeter
     * @returns None
     */
    this.getRESTUrl = function(objData) {
        var i, iLen, strURL = "";
        //new String();
        strURL = this._service.url + objData.methodName + "?";

        iLen = this._param.length;

        for ( i = 0; i < iLen; i += 1) {
            strURL += "&" + objData.params[i].paramName + "=" + objData.params[i].value;
        }
        return strURL;
    };

    /** This function is used to get the evelope data for SOAP based service
     * @access private
     * @memberof WebServiceMethod
     * @param {Object} objData Object that contains method name and paratmeter
     * @returns None
     */
    this.getSOAPEnvelopData = function(objData) {
        var bParameterMissing, i, iLen, strMessage, strMethodNameSpace;
        strMethodNameSpace = this._service.namespace;
        strMessage = '<?xml version="1.0" encoding="utf-8"?>';
        strMessage += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
        strMessage += '<soap:Body>';
        strMessage += '<' + objData.methodName + ' ' + strMethodNameSpace + '>';

        iLen = this._param.length;

        for (i = 0; i < iLen; i+=1) {
            if (this._param[i].optional === "false" && objData.params[i] === undefined) {
                bParameterMissing = true;
                console.log(this._param[i].name + " :: is a reqired Parameter for " + this._name + " service.");
                return false;
            }

            strMessage += '<' + objData.params[i].paramName + '>' + objData.params[i].value + '</' + objData.params[i].paramName + '>';
            //
        }

        strMessage += '</' + objData.methodName + '>';
        strMessage += '</soap:Body>';
        strMessage += '</soap:Envelope>';

        return strMessage;
    };
};
