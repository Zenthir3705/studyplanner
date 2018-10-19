sap.ui.define([ ], function() {
	"use strict";
	
	return {
		
		/**
		 * Loads a pdf and creates the appropriate model.
		 * @public
		 * @param {Object} oCallback the callback object (success, error function)
		 */
		loadResources : function(oController, oCallback) {
			var that = this;
			
			this._loadPDF("data/M_W_Wirtschaftsinformatik_Modulhandbuch.pdf", {
				success : function(aPages) {
					let aCourses = [ ];
					
					//Loop over all pages and create the courses
					for(let i=1, aContent, aCourseIds, oCourse, sType = "" ; i<aPages.length ; i++) {
						aContent = aPages[i].content;
						
						//Create a new course
						if(aContent[0].indexOf("(WM2") !== -1 || aContent[0].indexOf("(W2M") !== -1 || aContent[0].indexOf("(TM4") !== -1) {
							//Get the course id
							aCourseIds = aContent[0].split("(");
							oCourse = {
								id : aCourseIds[1].replace(")", "").trim(),
								title : aCourseIds[0].trim(),
								type : "?",
								responsible : ( aContent[16].indexOf("Prof") !== -1 || aContent[16].indexOf("Dr") !== -1 ) ? aContent[16] : aContent[15],
								exam : aContent[39],
								examTime : aContent[37],
								chosen : false,
								skills : {
									professional : "",
									self : "",
									social_ethnic : "",
									transfer : ""
								},
								content : "",
								special : "",
								requirements : "",
								literature : "",
								dates : [ ]
							};
							aCourses.push(oCourse);
							sType = "Course";
						}
							
						//Read all texts
						let sSkill;
						for(let j=0 ; j<aContent.length ; j++) {
							if(aContent[j].indexOf("Qualifikationsziele") !== -1 && sType === "Course") {
								sType = "Skill";
								sSkill = "professional";
							}
							else if(aContent[j].indexOf("Sachkompetenz") !== -1 && sType === "Skill") {
								sSkill = "self";
							}
							else if(aContent[j].indexOf("Selbstkompetenz") !== -1 && sType === "Skill") {
								sSkill = "social_ethnic";
							}
							else if(aContent[j].indexOf("Sozial-ethische Kompetenz") !== -1 && sType === "Skill") {
								sSkill = "transfer";
							}
							else if(( aContent[j].indexOf("Übergreifende Handlungs") !== -1  && sType === "Skill" ) 
									|| ( aContent[j].indexOf("Besonderheiten und Voraussetzungen") !== -1 && sType === "Content" )) {
								sType = "";
							}
							else if(aContent[j] === "Inhalte" && sType === "") {
								sType = "Content";
							}
							else if(aContent[j].indexOf("Besonderheiten") !== -1 && sType === "") {
								sType = "Special";
							}
							else if(aContent[j].indexOf("Voraussetzungen") !== -1 && sType === "Special") {
								sType = "Requirements";
							}
							else if(aContent[j].indexOf("Literatur") !== -1 && sType === "Requirements") {
								sType = "Literature";
							}
							else if(aContent[j].indexOf("Modulbeschreibung für Master") !== -1) {
								j = aContent.length;
							}
							else if(sType !== "" && sType !== "Course"){
								if(sType === "Skill") {
									oCourse.skills[sSkill] += aContent[j];
								}
								else {
									oCourse[sType.toLowerCase()] += aContent[j] + "\n";
								}
							}
						}
					}
					
					//Load the course types
					that._loadPDF("data/M_W_Wirtschaftsinformatik_Modulangebot.pdf", {
						success : function(aPages) {
							let sType = "CORE";
							
							//Loop over all pages and create the courses
							for(let i=6, aContent, sId, oCourse ; i<aPages.length ; i++) {
								aContent = aPages[i].content;
								
								for(let j=0 ; j<aContent.length ; j++) {
									if(aContent[j].indexOf("Wahlmodule Wirt") !== -1) {
										sType = "WI";
									}
									else if(aContent[j].indexOf("Wahlmodule Inf") !== -1) {
										sType = "INF";
									}
									else if(aContent[j].indexOf("Wahlmodule Betriebs") !== -1) {
										sType = "BWL";
									}
									else if(aContent[j].substring(0, 3) === "XMX" 
										|| aContent[j].substring(0, 3) === "W2M" 
										|| aContent[j].substring(0, 3) === "WM2" 
										|| aContent[j].substring(0, 2) === "TM") {
										sId = aContent[j].split(" ")[0];
										
										//Get the correct course from the course array
										oCourse = aCourses.find(x => x.id === sId);
										if(oCourse) {
											oCourse.type = sType;
											oCourse.typeDesc = oController.getModel("i18n").getProperty("course_type_" + sType.toLowerCase());
											oCourse.typeDescLong = oController.getModel("i18n").getProperty("course_type_" + sType.toLowerCase() + "_long");
											
											if(oCourse.type === "CORE") {
												oCourse.chosen = true;
											}
										}
									}
								}
							}
							
							//Load the course types
							that._loadPDF("data/Terminplanung 2018 19.pdf", {
								success : function(aPages) {
									//Loop over all pages and create the courses
									for(let i=0, aContent, oCourse ; i<aPages.length ; i++) {
										aContent = aPages[i].content;
										
										for(let j=10, oContent ; j<aContent.length ; j++) {
											oContent = aContent[j];
											
											//Check if a new course starts
											if(oContent.substring(0, 3) === "XMX" 
												|| oContent.substring(0, 3) === "W2M" 
												|| oContent.substring(0, 3) === "WM2" 
												|| oContent.substring(0, 2) === "TM") {
												oCourse = aCourses.find(x => x.id === oContent);
												j += 1;
												continue;
											}
											else if(oCourse) {
												//Check if its a new date
												if(!isNaN(oContent.substring(0, 2))) {
													//Get the location
													let aParts = aContent[j+2] ? aContent[j+2].split("(") : undefined,
													aLocations = aParts && aParts[1] ? aParts[1].replace(")", "").trim().split(",") : [ ],
													sLocation = "",
													sLocationDesc = "",
													oDate;
													
													for(let k=0 ; k<aLocations.length ; k++) {
														sLocation = aLocations[k].trim() + ", ";
														sLocationDesc = oController.getModel("i18n").getProperty("location_" + aLocations[k].trim().toLowerCase()) + ", ";
													}
													sLocation = sLocation.substring(0, sLocation.length - 2);
													sLocationDesc = sLocationDesc.substring(0, sLocationDesc.length - 2);
													
													oDate = {
														from : oContent.trim(),
														to : aParts && aParts[0] ? aParts[0].trim() : "",
														location : sLocation,
														locationDesc : sLocationDesc
													};
													
													that._addDateToCourse(oCourse, oDate);
													
													j += 2;
												}
											}
											else if(oContent.indexOf("* DHBW Standorte:") !== -1) {
												j = aContent.length;
											}
										}
									}
									
									oCallback.success(aCourses);
								},
								error : oCallback.error
							});
						},
						error : oCallback.error
					});
				},
				error : oCallback.error
			});
		},
		
		/**
		 * Loads a pdf and creates the appropriate model.
		 * @private
		 * @param {String} sPath the pdf path
		 * @param {Object} oCallback the callback object (success, error function)
		 */
		_loadPDF : function(sPath, oCallback) {
			var that = this;
			
			PDFJS.getDocument(sPath).then(
				function(oDocument) {
					let aPromises = Array(oDocument.pdfInfo.numPages).fill(undefined);
					
					//Read all pages (ignore the first one)
					for(let i=0 ; i<oDocument.pdfInfo.numPages ; i++) {
						(function(iPageNo) {
							aPromises[iPageNo - 1] = that._getPageText(iPageNo, oDocument);
						})(i + 1);
					}
					
					//When all promises are resolved
					Promise.all(aPromises).then(oCallback.success);
				},
				oCallback.error
			);
		},
		
		/**
		 * Returns the text of a single page (as a promise).
		 * @private
		 */
		_getPageText : function(iPageNo, oDocument) {
			var that = this;
			
			return new Promise(function(oResolve, oReject) {
				oDocument.getPage(iPageNo).then(function(oPage) {
					oPage.getTextContent().then(function(oContent) {						
						let aContent = [ ];
						
						for(let i=0 ; i<oContent.items.length ; i++) {
							if(oContent.items[i].str.trim() !== "") {
								aContent.push(oContent.items[i].str);
							}
						}
						
						oResolve({
							id : iPageNo,
							content : aContent
						});
					});
				});
			});
		},
		
		/**
		 * Adds a date to the given course.
		 * @private
		 */
		_addDateToCourse : function(oCourse, oDate) {
			var iIndex = oCourse.dates.length > 0 ? oCourse.dates[oCourse.dates.length - 1].index : 0;
			
			if(oCourse.dates.length % 2 === 0) {
				oDate.index = iIndex + 1;
			}
			else {
				oDate.index = iIndex;
			}
			oCourse.dates.push(oDate);
			
			/*if(oCourse.dates.length === 0 || oCourse.dates[0].items.length === 2) {
				oCourse.dates.push({
					items : [ oDate ]
				});
			}
			else {
				oCourse.dates[oCourse.dates.length - 1].items.push(oDate);
			}*/
		},
	};
});