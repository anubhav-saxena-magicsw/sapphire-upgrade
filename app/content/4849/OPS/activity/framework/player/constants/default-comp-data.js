/*jslint nomen: true*/
/*globals Backbone,_,$,console*/
/**
 * DefaultCompData
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
	var DefaultCompData;
	DefaultCompData = function() {
		return _.extend(this, Backbone.Events);
	};

	/**
	 * this method is responsible to return default component json node
	 * @param {String} strCompType component type (eg DnD, Image, FIB)
	 * @param {String} StrCompId component id
	 * @param {String} strStyleClass style class name
	 * @return {Object} prepared json node
	 * @access public
	 * @memberof DefaultCompData#
	 */
	DefaultCompData.prototype.getDefaultData = function(strCompType, strCompId, strStyleClass) {
		var compJSON = this.rawData[strCompType], arrComp, nCounter, i, strTempId, objDataToSend, groupNo;
		objDataToSend = {};
		compJSON = JSON.stringify(compJSON);
		//converting json object to string
		compJSON = $.parseJSON(compJSON);
		//converting string to object to crate a fresh copy
		compJSON.id = compJSON.type + "_" + this.getUniqueNumber();
		compJSON.data.styleClass = compJSON.id;

		arrComp = this.getChildComponentList([compJSON], 0);
		if (arrComp.length > 1) {
			nCounter = Number(strCompId.split("_")[1]);
			groupNo = nCounter;
			for ( i = 1; i < arrComp.length; i = i + 1) {
				nCounter = nCounter + 1;
				strTempId = arrComp[i].type + "_" + this.getUniqueNumber();
				if (strCompType === "SCQ" && arrComp[i].type === "radio") {
					arrComp[i].data.name = "scq" + groupNo;
				}
				//"name": "group1",
				arrComp[i].id = strTempId;
				arrComp[i].data.styleClass = strTempId;
			}
			objDataToSend.compCount = arrComp.length - 1;
			objDataToSend.arrayComp = arrComp;
		}
		objDataToSend.JsonData = compJSON;
		return objDataToSend;
	};

	DefaultCompData.prototype.getUniqueNumber = function() {
		var r, uuid, d = new Date().getTime();
		uuid = 'xxxxxxxx_xx'.replace(/[xy]/g, function(c) {
			r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	};

	/**
	 * 'prepareExistingData' introduced to manage copied json object node.
	 * this method is also responsible to append the unique id for each component node and its
	 * child node and assign new style class to these component.
	 *
	 * @param {Object} objDataToPrepare
	 * @return {Object} modified json object
	 * @access private
	 * @memberof DefaultCompData#
	 */
	DefaultCompData.prototype.prepareExistingData = function(objDataToPrepare, bAssignedNewId) {
		var i = 0, compJSON, arrComp, strCompId, dataToReturn = {};
		compJSON = JSON.stringify(objDataToPrepare.filteredData.jsonElement);
		compJSON = $.parseJSON(compJSON);
		arrComp = this.getChildComponentList([compJSON], 0);
		if (bAssignedNewId === false || bAssignedNewId === undefined) {
			for ( i = 0; i < arrComp.length; i = i + 1) {
				strCompId = compJSON.type + "_" + this.getUniqueNumber();
				arrComp[i].id = strCompId;
				arrComp[i].data.styleClass = strCompId;
			}
		}

		dataToReturn.compJSON = compJSON;
		dataToReturn.arrayComp = arrComp;
		return dataToReturn;
	};

	/**
	 * Preparing child list
	 * @param {Object} compData
	 * @param {Object} index
	 * @param {Object} arrList
	 * @param {Object} parentId
	 */
	DefaultCompData.prototype.getChildComponentList = function(compData, index, arrList, parentId) {
		var dataObject = compData[index], arrUpdatedData;
		arrUpdatedData = arrList;
		if (arrUpdatedData === undefined) {
			arrUpdatedData = [];
		}

		dataObject.parentObject = {
			"parentId" : parentId
		};

		arrUpdatedData.push(dataObject);

		if (dataObject.components !== undefined && dataObject.components.length > 0) {
			//parentId = dataObject.id;
			this.getChildComponentList(dataObject.components, 0, arrUpdatedData, dataObject.id);
		}
		index = index + 1;
		if (compData.length > index) {
			return this.getChildComponentList(compData, index, arrUpdatedData, parentId);
		}

		return arrUpdatedData;

	};

	/**
	 * default json node for each component
	 */
	DefaultCompData.prototype.rawData = {

		"HINT" : {
			"id" : "",
			"type" : "hint",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"time" : ""
			},
			"events" : [],
			"components" : [{
				"id" : "",
				"type" : "label",
				"data" : {
					"text" : "Hint Text",
					"styleClass" : ""
				},
				"parentObject" : {}
			}],
			"html" : {
				"align" : "center"
			}
		},
		/////////////////////////////////////// TAB //////////////////////////////////////////
		"TAB" : {
			"id" : "",
			"type" : "tab",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"view" : "",
				"index" : ""
			},
			"events" : [],
			"components" : [],
			"html" : {
				"align" : "center"
			}
		},
		/////////////////////////////////////// TAB //////////////////////////////////////////
		"FLIPCARD" : {
			"id" : "",
			"type" : "flipcard",
			"state" : "attached",
			"data" : {
				"styleClass" : "hi",
				"view" : "front-face",
				"movement" : "horizontal",
				"value" : ""
			},
			"events" : [],
			"components" : [{
				"id" : "",
				"type" : "case",
				"state" : "attached",
				"data" : {
					"styleClass" : ""
				},
				"html" : {
					"align" : "left"
				}
			}, {
				"id" : "",
				"type" : "case",
				"state" : "attached",
				"data" : {
					"styleClass" : ""
				},
				"html" : {
					"align" : "left"
				}
			}],
			"html" : {
				"align" : "center"
			}
		},
		/////////////////////////////////////// DRAGGABLE //////////////////////////////////////////
		"DRAGGABLE" : {
			"id" : "",
			"type" : "draggable",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"value" : "",
				"clone" : "false"
			},
			"components" : [],
			"html" : {
				"align" : "center"
			}
		},
		/////////////////////////////////////// DROPPABLE //////////////////////////////////////////
		"DROPPABLE" : {
			"id" : "",
			"type" : "droppable",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"value" : ""
			},
			"components" : [],
			"html" : {
				"align" : "center"
			}
		},
		/////////////////////////////////////// IMAGE //////////////////////////////////////////
		IMAGE : {
			"id" : "",
			"type" : "image",
			"data" : {
				"styleClass" : "",
				"src" : ""
			},
			"html" : {
				"align" : "center",
				"alt" : "image"
			}
		},
		/////////////////////////////////////// CASE //////////////////////////////////////////
		CASE : {
			"id" : "",
			"type" : "case",
			"state" : "attached",
			"data" : {
				"styleClass" : ""
			},
			"html" : {
				"align" : "left"
			}
		},
		/////////////////////////////////////// CANVAS //////////////////////////////////////////
		CANVAS : {
			"id" : "",
			"type" : "canvas",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"drawenable" : "True",
				"canvascolor" : "#efefef",
				"brushcolor" : "black"
			},
			"html" : {

			}
		},
		/////////////////////////////////////// Pencil //////////////////////////////////////////
		PENCIL : {
			"id" : "",
			"type" : "pencil",
			"state" : "attached",
			"data" : {
				"label" : "Pencil",
				"styleClass" : "",
				"pencilcolor" : "black",
				"pencilwidth" : "1",
				"linked" : "",
				"imgurl" : ""
			},
			"html" : {

			}
		},
		/////////////////////////////////////// Eraser //////////////////////////////////////////
		ERASER : {
			"id" : "",
			"type" : "eraser",
			"state" : "attached",
			"data" : {
				"label" : "Eraser",
				"styleClass" : "",
				"erasercolor" : "white",
				"linked" : "",
				"imgurl" : ""
			},
			"html" : {

			}
		},
		/////////////////////////////////////// POPUP //////////////////////////////////////////
		POPUP : {
			"id" : "",
			"type" : "popup",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"default" : "show"
			},
			"html" : {
				"align" : "center"
			}
		},

		//////////////////////////////////////// COLORACCESSIBILITY /////////////////////////////////////////
		COLOR : {
			"id" : "",
			"type" : "coloraccessibility",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"view" : "horizontal"
			},
			"html" : {
				"align" : "left"
			},
			"components" : [{
				"id" : "",
				"type" : "button",
				"state" : "attached",
				"data" : {
					"label" : "Gray",
					"toggle" : "false",
					"styleClass" : "",
					"stylelist" : {
						"over" : "",
						"active" : "",
						"disabled" : ""
					}
				},
				"events" : [],
				"html" : {
					"align" : "center"
				}
			}, {
				"id" : "",
				"type" : "button",
				"state" : "attached",
				"data" : {
					"label" : "Invert",
					"toggle" : "false",
					"styleClass" : "",
					"stylelist" : {
						"over" : "",
						"active" : "",
						"disabled" : ""
					}
				},
				"events" : [],
				"html" : {
					"align" : "center"
				}
			}, {
				"id" : "",
				"type" : "button",
				"state" : "attached",
				"data" : {
					"label" : "Color",
					"toggle" : "false",
					"styleClass" : "",
					"stylelist" : {
						"over" : "",
						"active" : "",
						"disabled" : ""
					}
				},
				"events" : [],
				"html" : {
					"align" : "center"
				}
			}]
		},

		/////////////////////////////////////// ANSWER //////////////////////////////////////////
		ANSWER : {
			"id" : "",
			"type" : "answer",
			"state" : "attached",
			"data" : {
				"answer" : "",
				"styleClass" : ""
			},
			"components" : []
		},
		/////////////////////////////////////// LABEL //////////////////////////////////////////
		LABEL : {
			"id" : "",
			"type" : "label",
			"data" : {
				"text" : "Label",
				"styleClass" : ""
			}
		},

		/////////////////////////////////////// BUTTON //////////////////////////////////////////
		BUTTON : {
			"id" : "",
			"type" : "button",
			"data" : {
				"label" : "Button",
				"toggle" : "false",
				"styleClass" : "",
				"stylelist" : {
					"over" : "",
					"active" : "",
					"disabled" : ""
				}
			},
			"events" : [],
			"html" : {
				"align" : "center"
			}
		},
		/////////////////////////////////////// RADIO //////////////////////////////////////////
		RADIO : {
			"id" : "",
			"type" : "radio",
			"data" : {
				"styleClass" : "",
				"name" : "",
				"value" : "",
				"checked" : "false",
				"view" : "radio"
			},
			"events" : []
		},
		/////////////////////////////////////// MULTIPLECHOICE //////////////////////////////////////////
		MULTIPLECHOICE : {
			"id" : "",
			"type" : "multiplechoice",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"attempts" : "",
				"shuffle" : ""
			},
			"events" : [],
			"components" : [],
			"html" : {
				"align" : "center"
			}
		},

		/////////////////////////////////////// INPUTTEXT //////////////////////////////////////////
		INPUTTEXT : {
			"id" : "",
			"type" : "inputtext",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"text" : "Text"
			},
			"events" : [],
			"components" : []
		},

		/////////////////////////////////////// FEEDBACK //////////////////////////////////////////

		FEEDBACK : {
			"id" : "",
			"type" : "feedback",
			"state" : "attached",
			"data" : {
				"styleClass" : ""
			},
			"events" : [],
			"components" : [],
			"html" : {
				"align" : "center"
			}
		},
		/////////////////////////////////////// AUDIOHOTSPOT //////////////////////////////////////////
		AUDIOHOTSPOT : {
			"id" : "",
			"type" : "audiohotspot",
			"data" : {
				"styleClass" : "",
				"hidden" : "false",
				"passiveaudio" : "false",
				"source" : [{
					"path" : "",
					"type" : "mp3"
				}, {
					"path" : "",
					"type" : "ogg"
				}]
			}
		},
		/////////////////////////////////////// VIDEO //////////////////////////////////////////
		VIDEO : {
			"id" : "",
			"type" : "videoplayer",
			"data" : {
				"styleClass" : "",
				"passivevideo" : "false",
				"source" : [{
					"path" : "",
					"type" : "mp4"
				}, {
					"path" : "",
					"type" : "ogv"
				}],
				"width" : "100%",
				"height" : "100%"
			}
		},
		/////////////////////////////////////// WIZARD //////////////////////////////////////////
		WIZARD : {
			"id" : "",
			"type" : "wizard",
			"data" : {
				"styleClass" : "",
				"default" : 0
			},
			"components" : [{
				"id" : "",
				"type" : "label",
				"data" : {
					"text" : "Label",
					"styleClass" : ""
				}
			}],
			"events" : [{
				"changeWizardView" : [{
					"target" : "self",
					"method" : "changeWizardView"
				}]
			}]
		},
		/////////////////////////////////////// LIFE //////////////////////////////////////////
		LIFE : {
			"id" : "",
			"type" : "life",
			"data" : {
				"styleClass" : "",
				"default" : ""
			},
			"components" : [{
				"id" : "",
				"type" : "label",
				"data" : {
					"text" : "Label",
					"styleClass" : ""
				}
			}]

		},
		/////////////////////////////////////// LIVES //////////////////////////////////////////
		LIVES : {
			"id" : "",
			"type" : "lives",
			"data" : {
				"styleClass" : "",
				"default" : ""
			},
			"parentObject" : {},
			"components" : [{
				"id" : "",
				"type" : "life",
				"data" : {
					"styleClass" : "",
					"default" : ""
				},
				"parentObject" : {}
			}, {
				"id" : "",
				"type" : "life",
				"data" : {
					"styleClass" : "",
					"default" : ""
				},
				"parentObject" : {}
			}, {
				"id" : "",
				"type" : "life",
				"data" : {
					"styleClass" : "",
					"default" : ""
				},
				"parentObject" : {}
			}]
		},

		/////////////////////////////////////// MCQ //////////////////////////////////////////

		MCQ : {
			"id" : "",
			"type" : "case",
			"state" : "attached",
			"data" : {
				"styleClass" : "case_dfdb6e12_24"
			},
			"html" : {
				"align" : "left"
			},
			"components" : [{
				"id" : "",
				"type" : "label",
				"data" : {
					"text" : "Click on label and type 'question text' in its property panel.",
					"styleClass" : ""
				}
			}, {
				"id" : "",
				"type" : "multiplechoice",
				"state" : "attached",
				"data" : {
					"styleClass" : "",
					"attempts" : "",
					"shuffle" : ""
				},
				"events" : [],
				"components" : [{
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "radio",
						"data" : {
							"styleClass" : "",
							"name" : "",
							"value" : "",
							"checked" : "false",
							"view" : "checkbox"
						},
						"events" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Option 1",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "radio",
						"data" : {
							"styleClass" : "",
							"name" : "",
							"value" : "",
							"checked" : "false",
							"view" : "checkbox"
						},
						"events" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Option 2",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "radio",
						"data" : {
							"styleClass" : "",
							"name" : "",
							"value" : "",
							"checked" : "false",
							"view" : "checkbox"
						},
						"events" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Option 3",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "radio",
						"data" : {
							"styleClass" : "",
							"name" : "",
							"value" : "",
							"checked" : "false",
							"view" : "checkbox"
						},
						"events" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Option 4",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "feedback",
					"state" : "attached",
					"data" : {
						"styleClass" : ""
					},
					"events" : [],
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Well Done! All Correct!!!!",
							"styleClass" : ""
						}
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Try Again!!!!",
							"styleClass" : ""
						}
					}],
					"html" : {
						"align" : "left"
					}
				}]
			}]
		},

		/////////////////////////////////////// MATCHING CHILD//////////////////////////////////////////

		MATCHINGCHILD : {
			"id" : "",
			"type" : "matchingChild",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"answer" : "",
				"category" : "question"
			},
			"html" : {
				"align" : "left"
			}
		},

		/////////////////////////////////////// MATCHING //////////////////////////////////////////

		MATCHING : {
			"id" : "",
			"type" : "case",
			"state" : "attached",
			"data" : {
				"styleClass" : ""
			},
			"html" : {
				"align" : "left"
			},
			"components" : [{
				"id" : "",
				"type" : "label",
				"data" : {
					"text" : "Match The Following Items.",
					"styleClass" : ""
				},
				"html" : {
					"align" : "left"
				}
			}, {
				"id" : "",
				"type" : "case",
				"state" : "attached",
				"data" : {
					"styleClass" : ""
				},
				"components" : [{
					"id" : "",
					"type" : "matching",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"lineColor" : "rgb(128, 128, 128)",
						"lineWidth" : "",
						"leftCoordinate" : "",
						"rightCoordinate" : "",
						"topCoordinate" : "",
						"incorrectlineColor" : ""
						
					},
					"components" : [{
						"id" : "",
						"type" : "matchingChild",
						"data" : {
							"styleClass" : "",
							"answer" : "",
							"category" : "question"
						}
					}, {
						"id" : "",
						"type" : "matchingChild",
						"data" : {
							"styleClass" : "",
							"answer" : "",
							"category" : "answer"
							
						}
					}, {
						"id" : "",
						"type" : "case",
						"state" : "attached",
						"data" : {
							"styleClass" : ""
						},
						"html" : {
							"align" : "left"
						}
					},{
						"id" : "",
						"type" : "matchingChild",
						"data" : {
							"styleClass" : "",
							"answer" : "",
							"category" : "question"
						}
					}, {
						"id" : "",
						"type" : "matchingChild",
						"data" : {
							"styleClass" : "",
							"answer" : "",
							"category" : "answer"
						}
					}, {
						"id" : "",
						"type" : "case",
						"state" : "attached",
						"data" : {
							"styleClass" : ""
						},
						"html" : {
							"align" : "left"
						}
					}, {
						"id" : "",
						"type" : "matchingChild",
						"data" : {
							"styleClass" : "",
							"answer" : "",
							"category" : "question"
						}
					}, {
						"id" : "",
						"type" : "matchingChild",
						"data" : {
							"styleClass" : "",
							"answer" : "",
							"category" : "answer"
						}
					}, {
						"id" : "",
						"type" : "case",
						"state" : "attached",
						"data" : {
							"styleClass" : ""
						},
						"html" : {
							"align" : "left"
						}
					}, {
						"id" : "",
						"type" : "feedback",
						"state" : "attached",
						"data" : {
							"styleClass" : ""
						},
						"components" : [{
							"id" : "",
							"type" : "label",
							"data" : {
								"text" : "Well Done! All Correct!!!!",
								"styleClass" : ""
							}
						}, {
							"id" : "",
							"type" : "label",
							"data" : {
								"text" : "Try Again!!!!",
								"styleClass" : ""
							}
						}],
						"html" : {
							"align" : "left"
						}
					}]
				}]
			}]
		},

		/////////////////////////////////////// FIB //////////////////////////////////////////
		FIB : {
			"id" : "",
			"type" : "case",
			"state" : "attached",
			"data" : {
				"styleClass" : ""
			},
			"html" : {
				"align" : "left"
			},
			"components" : [{
				"id" : "",
				"type" : "label",
				"data" : {
					"text" : "Click on label and type 'question text' in its property panel.",
					"styleClass" : ""
				}
			}, {
				"id" : "",
				"type" : "multiplechoice",
				"state" : "attached",
				"data" : {
					"styleClass" : "",
					"attempts" : ""
				},
				"events" : [],
				"components" : [{
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Add option text ",
							"styleClass" : ""
						}
					}, {
						"id" : "",
						"type" : "inputtext",
						"state" : "attached",
						"data" : {
							"styleClass" : ""
						},
						"events" : [],
						"components" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : " here.",
							"styleClass" : "LABEL_33"
						}
					}]
				}, {
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Add option text ",
							"styleClass" : ""
						}
					}, {
						"id" : "",
						"type" : "inputtext",
						"state" : "attached",
						"data" : {
							"styleClass" : ""
						},
						"events" : [],
						"components" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : " here.",
							"styleClass" : ""
						}
					}],
					"parentObject" : {}
				}, {
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Add option text ",
							"styleClass" : ""
						}
					}, {
						"id" : "",
						"type" : "inputtext",
						"state" : "attached",
						"data" : {
							"styleClass" : ""
						},
						"events" : [],
						"components" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : " here.",
							"styleClass" : ""
						}
					}],
					"parentObject" : {}
				}, {
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Add option text ",
							"styleClass" : ""
						}
					}, {
						"id" : "",
						"type" : "inputtext",
						"state" : "attached",
						"data" : {
							"styleClass" : ""
						},
						"events" : [],
						"components" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : " here.",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "feedback",
					"state" : "attached",
					"data" : {
						"styleClass" : ""
					},
					"events" : [],
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Well Done! All Correct!!!!",
							"styleClass" : ""
						}
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Try Again!!!!",
							"styleClass" : ""
						}
					}],
					"html" : {
						"align" : "left"
					}
				}]
			}]
		},
		/////////////////////////////////////// SCQ //////////////////////////////////////////
		SCQ : {
			"id" : "",
			"type" : "case",
			"state" : "attached",
			"data" : {
				"styleClass" : "case_dfdb6e12_24"
			},
			"html" : {
				"align" : "left"
			},
			"components" : [{
				"id" : "",
				"type" : "label",
				"data" : {
					"text" : "Click on label and type 'question text' in its property panel.",
					"styleClass" : ""
				}
			}, {
				"id" : "",
				"type" : "multiplechoice",
				"state" : "attached",
				"data" : {
					"styleClass" : "",
					"attempts" : ""
				},
				"events" : [],
				"components" : [{
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "radio",
						"data" : {
							"styleClass" : "",
							"name" : "",
							"value" : "",
							"checked" : "false",
							"view" : "radio"
						},
						"events" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Option 1",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "radio",
						"data" : {
							"styleClass" : "",
							"name" : "",
							"value" : "",
							"checked" : "false",
							"view" : "radio"
						},
						"events" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Option 2",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "radio",
						"data" : {
							"styleClass" : "",
							"name" : "",
							"value" : "",
							"checked" : "false",
							"view" : "radio"
						},
						"events" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Option 3",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "answer",
					"state" : "attached",
					"data" : {
						"answer" : "",
						"styleClass" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "radio",
						"data" : {
							"styleClass" : "",
							"name" : "",
							"value" : "",
							"checked" : "false",
							"view" : "radio"
						},
						"events" : []
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Option 4",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "feedback",
					"state" : "attached",
					"data" : {
						"styleClass" : ""
					},
					"events" : [],
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Well Done! All Correct!!!!",
							"styleClass" : ""
						}
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Try Again!!!!",
							"styleClass" : ""
						}
					}],
					"html" : {
						"align" : "left"
					}
				}]
			}]
		},
		/////////////////////////////////////// DnD //////////////////////////////////////////
		DnD : {
			"id" : "",
			"type" : "case",
			"state" : "attached",
			"data" : {
				"styleClass" : ""
			},
			"html" : {
				"align" : "left"
			},
			"components" : [{
				"id" : "",
				"type" : "label",
				"data" : {
					"text" : "Following are some draggable text items. Place items to correct color holder.......",
					"styleClass" : ""
				}
			}, {
				"id" : "",
				"type" : "dnd",
				"parentId" : "",
				"data" : {
					"styleClass" : "",
					"cloning" : "false",
					"ondropalignment" : "CENTER"
				},
				"components" : [{
					"id" : "",
					"type" : "draggable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"clone" : "false",
						"value" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Green",
							"styleClass" : ""
						}
					}],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "draggable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"clone" : "false",
						"value" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Grey",
							"styleClass" : ""
						}
					}],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "draggable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"clone" : "false",
						"value" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Orange",
							"styleClass" : ""
						}
					}],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "draggable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"clone" : "false",
						"value" : ""
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Pink",
							"styleClass" : ""
						}
					}],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "droppable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : ""
					},
					"components" : [],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "droppable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : ""
					},
					"components" : [],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "droppable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : ""
					},
					"components" : [],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "droppable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : ""
					},
					"components" : [],
					"html" : {
						"align" : "center"
					}
				}],
				"html" : {
					"align" : "left"
				}
			}]
		},
		/////////////////////////////////////// DragDrop //////////////////////////////////////////
		DragDrop : {
			"id" : "",
			"type" : "case",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
			},
			"html" : {
				"align" : "left"
			},
			"components" : [{
				"id" : "",
				"type" : "label",
				"data" : {
					"text" : "Drag the color boxes to their matching color droppables",
					"styleClass" : ""
				}
			}, {
				"id" : "",
				"type" : "dnd",
				"parentId" : "",
				"data" : {
					"styleClass" : "",
					"cloning" : "false",
					"ondropalignment" : "HORIZONTAL",
					"type" : "MANY_TO_ONE"
				},
				"components" : [{
					"id" : "",
					"type" : "draggable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : "",
						"clone" : "false"
					},
					"components" : [],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "draggable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : "",
						"clone" : "false"
					},
					"components" : [],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "draggable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : "",
						"clone" : "false"
					},
					"components" : [],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "draggable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : "",
						"clone" : "false"
					},
					"components" : [],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "droppable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : ""
					},
					"components" : [],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "droppable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : ""
					},
					"components" : [],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "hint",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"time" : ""
					},
					"events" : [],
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Hint Text",
							"styleClass" : ""
						}
					}],
					"html" : {
						"align" : "center"
					}
				}, {
					"id" : "",
					"type" : "feedback",
					"state" : "attached",
					"data" : {
						"styleClass" : ""
					},
					"events" : [],
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Well Done! All Correct!!!!",
							"styleClass" : ""
						}
					}, {
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "Try Again!!!!",
							"styleClass" : ""
						}
					}],
					"html" : {
						"align" : "left"
					}
				}],
				"html" : {
					"align" : "center"
				}
			}]
		},
		/////////////////////////////////////// COUNTDOWNTIMER //////////////////////////////////////////
		COUNTDOWNTIMER : {
			"id" : "",
			"type" : "countdown-timer",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"decrementalcountdown" : "true",
				"totalseconds" : "30",
				"warningafter" : "5",
				"timeformat" : "2",
				"timerseperator" : ":",
				"tickrate" : "1000",
				"dispatchheartbeat" : "false",
				"heratbeattimeinterval" : "5",
				"clockmode" : "false"
			},
			"events" : [],
			"html" : {
				"align" : "center"
			}
		},

		/////////////////////////////////////// ANIMATION //////////////////////////////////////////
		ANIMATION : {
			"id" : "",
			"type" : "animation",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"animation" : [],
				"speed" : "",
				"continuous" : "true",
				"dindex" : ""
			},
			"events" : [],
			"parentObject" : {},
			"html" : {
				"align" : "center"
			}
		},

		/////////////////////////////////////// ANIMATIONPLAYER //////////////////////////////////////////

		ANIMATIONPLAYER : {
			"id" : "",
			"type" : "animation-player",
			"parentId" : "",
			"data" : {
				"styleClass" : "",
				"bLoop" : "false",
				"bReverse" : "false",
				"spriteWidth" : "100"
			},
			"events" : []
		},

		///////////////////////////////////////  SORTABLE  ////////////////////////////////////////////

		SORTABLE : {
			"id" : "",
			"type" : "sortable",
			"state" : "attached",
			"data" : {
				"styleClass" : "",
				"value" : ""
			},
			"components" : [{
				"id" : "",
				"type" : "label",
				"data" : {
					"text" : "label",
					"styleClass" : ""
				}
			}]
		},

		//////////////////////////////////// REORDERING  ////////////////////////////////////////////
		REORDERING : {
			"id" : "",
			"type" : "case",
			"templateId" : "",
			"script" : "case",
			"data" : {
				"styleClass" : ""
			},
			"events" : [],
			"components" : [{
				"id" : "",
				"type" : "label",
				"parentId" : "",
				"data" : {
					"text" : "Sort following numbers!!!",
					"styleClass" : ""
				}
			}, {
				"id" : "",
				"type" : "label",
				"parentId" : "",
				"data" : {
					"text" : "Great Job!!!",
					"styleClass" : ""
				}
			}, {
				"id" : "",
				"type" : "label",
				"parentId" : "",
				"data" : {
					"text" : "Try Again!!!",
					"styleClass" : ""
				}
			}, {
				"id" : "",
				"type" : "sorting",
				"state" : "attached",
				"parentId" : "",
				"data" : {
					"styleClass" : "",
					"placeholder" : "placeholder",
					"direction" : "HORIZONTAL",
					"answer" : "1|2|3|4|5",
					"shuffle" : "true"
				},
				"events" : [],
				"components" : [{
					"id" : "",
					"type" : "sortable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : "1"
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "ONE",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "sortable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : "2"
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "TWO",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "sortable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : "3"
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "THREE",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "sortable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : "4"
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "FOUR",
							"styleClass" : ""
						}
					}]
				}, {
					"id" : "",
					"type" : "sortable",
					"state" : "attached",
					"data" : {
						"styleClass" : "",
						"value" : "5"
					},
					"components" : [{
						"id" : "",
						"type" : "label",
						"data" : {
							"text" : "FIVE",
							"styleClass" : ""
						}
					}]
				}]
			}]
		}

	};

	return DefaultCompData;
});
