/**
 * This contains the definition of all the web services.
 * @fileoverview 
 * @author Magic Software
 * @version 1.0.0
 * @since 1.0.0
 * @license Copyright 2013 Magic Software Private Limited.
 * @copyright (c) 2013 Magic Software
 *
 */

/**
 * An array to be accessed for getting objects for diffrent webservice's objects.
 * Developer will require to add the web services definition in an Array and in following object format.<br>
 * {<br>
 *		//name of the service bus. we can have as many service buses as we want. Ideally there should one for each endpoint.<br>
 *		name: "soapwebservice",<br>
 *		// End point url of the service bus. we can have as many urls. One for each hosting environment.<br>
 *		endpoint: "http://userws.onestopscience.com/users.asmx",<br>
 *		// specify the name space for this service bus. assumption is there will be one namespace for the methods of a service bus.<br>
 *		namespace: 'xmlns="http://curriculum.macmillaneducation.com"', <br>
 *		//define all the methods in the methods array<br>
 *		methods:<br>
 *			[<br>
 *				//create one object for each method <br>
 *				{<br>
 *					//name of the method. as defined in the WSDL<br>
 *					name: "loginuser",<br>
 *					envelopetype: PlayerConst.SOAP_WEB_SERVICE,<br>
 *					//parameters accepted by the method. this is optional if method does not required parameters this can be removed <br>
 *					param: [<br>
 *								//define one object for each parameter<br>
 *								{<br>
 *									//name of the parameter as specified in the WSDL<br>
 *									name: "username",<br>
 *									//type of the parameter as specified in the WSDL. In our case it can be only string or a number<br>
 *									type: "string",<br>
 *									true - if this parameter is optional. As specified in the WSDL<br>
 *									optional: "false"<br>
 *								},<br>
 *								{<br>
 *									name: "password",<br>
 *									type: "string",<br>
 *									optional: "false"<br>
 *								},<br>
 *								{<br>
 *									name: "productid",<br>
 *									type: "number",<br>
 *									optional: "false"<br>
 *								}<br>
 *							]<br>
 *				}<br>
 *			]<br>
 * }<br>
 */
var WebServiceDefinitions = [

	/*
		define the first service
		metadata services
	 */
	{
		/* name of the service bus. we can have as many service buses as we want.
		Ideally there should one for each endpoint */
		name: "soapwebservice",

		/* end point url of the service bus. we can have as many urls.
		one for each hosting environment. which end point to use comes from the OSSConfig.js */

		endpoint: "http://userws.onestopscience.com/users.asmx",

		/* specify the name space for this service bus.
		 assumption is there will be one namespace for the methods of a service bus */
        namespace: 'xmlns="http://curriculum.macmillaneducation.com"',

		/* define all the methods in the methods array */
		methods:
		[
				/* create one object for each method */
				{
					/* name of the method. as defined in the WSDL */
					name: "loginuser",
					envelopetype: PlayerConst.SOAP_WEB_SERVICE,
						
				
					/* parameters accepted by the method. this is optional
					  if method does not required parameters this can be removed */
					param: [
							/* define one object for each parameter */
							{
								name: "username",	/* name of the parameter as specified in the WSDL */
								type: "string",		/* type of the parameter as specified in the WSDL. In our case it can be only string or a number */
								optional: "false"	/* true - if this parameter is optional. As specified in the WSDL */
							},
							{
								name: "password",
								type: "string",
								optional: "false"
							},
							{
								name: "productid",
								type: "number",
								optional: "false"
							}
						]
				
				}
            ]
	},
	{
		/* name of the service bus. we can have as many service buses as we want.
		Ideally there should one for each endpoint */
		name: "restwebservice",

		/* end point url of the service bus. we can have as many urls.
		one for each hosting environment. which end point to use comes from the OSSConfig.js */

		endpoint: "http://api.geonames.org/",

		/* specify the name space for this service bus.
		 assumption is there will be one namespace for the methods of a service bus */
		namespace: 'temp',//we only require to put some string here, for REST API's it is not being used

		/* define all the methods in the methods array */
		methods:
		[
				/* create one object for each method */
				{
					/* name of the method. as defined in the WSDL */
					name: "weatherIcaoJSON",
					envelopetype: PlayerConst.REST_WEB_SERVICE,
						
				
					/* parameters accepted by the method. this is optional
					  if method does not required parameters this can be removed */
					param: [
							/* define one object for each parameter */
							{
								name: "ICAO",	/* name of the parameter as specified in the WSDL */
								type: "string",		/* type of the parameter as specified in the WSDL. In our case it can be only string or a number */
								optional: "false"	/* true - if this parameter is optional. As specified in the WSDL */
							},
							{
								name: "username",
								type: "string",
								optional: "true"
							}
						]
				
				}
            ]
	}
	// service definitions ends here
];