/*
 ### jQuery JSON to XML Plugin v1.0 - 2013-04-15 ###
 * http://www.magicsw.com/
 *//*
  *//*
   This simple script converts JSON into XML.
   */
// Avoid collisions
;if (window.jQuery)(function($) {
    // Add function to jQuery namespace
    $.extend({
        // Convert text to XML DOM
        json2xml: function(rootNodeName, objJson){
            var convertToXml = function(name, objJson, objParent) {
                // if __tagsList...just return as it doesn't need any processing
                if (name === "__tagsList") {
                    return "";
                }
                if (objJson instanceof  Object)
                {
                    if (objJson.length == undefined)
                    {
                        var strSelf = "<" + name;
                        var strChildren = "";
                        for (var i in objJson)
                        {
                            if (objJson[i] instanceof Object || objJson[i] instanceof Array)
                            {
                                strChildren += convertToXml(i, objJson[i], objJson);
                            }
                            else if (objJson.__tagsList && objJson.__tagsList instanceof Object && objJson.__tagsList.hasOwnProperty(i))
                            {
                                strChildren += convertToXml(i, objJson[i], objJson);
                            }
                            else
                            {
                                strSelf += " " + convertToXml(i, objJson[i], objJson);
                            }

                        }
                        strSelf += ">" + strChildren + "</" + name + ">";
                        return strSelf;
                    }
                    else if (objJson.length > 0)
                    {
                        var strSelf = "";
                        var iLen = objJson.length;
                        for (var i = 0; i < iLen; i++)
                        {
                            if (objJson[i] instanceof Object || objJson[i] instanceof Array)
                            {
                                strSelf += convertToXml(name, objJson[i], objJson);
                            }
                        }
                        return strSelf;
                    }
                }
                else
                {
                    if (objParent && objParent.__tagsList && objParent.__tagsList instanceof Object && objParent.__tagsList.hasOwnProperty(name))
                    {
                        return "<" + name + ">" + String(objJson) + "</" + name + ">";
                    }
                    return name + "='" + String(objJson) + "'";
                }
                return "";
            };
            if (objJson == null || typeof(objJson) != "object")
            {
                return null;
            }
            return convertToXml(rootNodeName, objJson);

            
        },
        escapeXmlChars: function(str) {
            if (typeof (str) === "string")
                return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
            else
                return str;
        },
        unescapeXmlChars: function(str) {
            return str.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, '\/');
        }
    }); // extend $
})(jQuery);
