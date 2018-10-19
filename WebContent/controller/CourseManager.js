sap.ui.define([
	"sap/ui/model/json/JSONModel"
], function(JSONModel) {
	"use strict";
	
	return {
		
		_courses : undefined,
		_studies : undefined,
		_messages : undefined,
		_i18n : undefined,
		
		/**
		 * Loads a pdf and creates the appropriate model.
		 * @public
		 * @param {Object} oCallback the callback object (success, error function)
		 */
		initialize : function(oComponent, aCourses) {
			let oData = {
				core : 0,
				chosen : 0,
				wi : 0,
				inf : 0,
				bwl : 0,
				"?" : 0,
				items : aCourses
			};
				
			for(let i=0 ; i<aCourses.length ; i++) {
				oData[aCourses[i].type.toLowerCase()] += 1;
			}
			oData.chosen = aCourses.length - oData.core;
				
			oComponent.setModel(this._courses = new JSONModel(oData), "courses");
				
			//Initialize the studies model
			oComponent.setModel(this._studies = new JSONModel({
				title : "Mein Studium",
				courses : aCourses.filter(function(oItem) {
					return oItem.type === "CORE";
				}),
				core : 0,
				chosen : {
					total : 0,
					wi : 0,
					inf : 0,
					bwl : 0
				}
			}), "studies");
			
			oComponent.setModel(this._messages = new JSONModel({
				total : 0,
				items : [ ]
			}), "messages");
			
			this._i18n = oComponent.getModel("i18n");
		},
		
		/**
		 * Adds multiple courses to the studies model
		 * @public
		 * @param {String[]} aIds the course ids
		 */
		addCourses : function(aIds) {
			for(let i=0 ; i<aIds.length ; i++) {
				this.addCourse(aIds[i], true);
			}
			this.validateStudies();
		},
		
		/**
		 * Adds a course to the studies model
		 * @public
		 * @param {String} sId the course id
		 */
		addCourse : function(sId, bMultiple) {
			var oModel = this._studies,
			iIndex = this._courses.getProperty("/items").findIndex(x => x.id === sId),
			oCourse = this._courses.getProperty("/items")[iIndex];
			
			if(!oCourse) {
				return false;
			}
			
			//Check if we have this course already
			if(oModel.getProperty("/courses").find(x => x.id === sId)) {
				return false;
			}
			
			//Add the course and validate
			this._courses.setProperty("/items/" + iIndex + "/chosen", true);
			oModel.getProperty("/courses").push(oCourse);
			if(!bMultiple) {
				this.validateStudies();
			}
			return true;
		},
		
		/**
		 * Removes a course to the studies model
		 * @public
		 * @param {String} sId the course id
		 */
		removeCourse : function(sId) {
			var oModel = this._studies,
			iIndex = this._courses.getProperty("/items").findIndex(x => x.id === sId);

			this._courses.setProperty("/items/" + iIndex + "/chosen", false);
			oModel.setProperty("/courses", oModel.getProperty("/courses").filter(function(oItem) {
				return oItem.id !== sId;
			}));
			
			this.validateStudies();
			return true;
		},
		
		/**
		 * Validates the studies model.
		 * @public
		 */
		validateStudies : function() {
			var oModel = this._studies,
			aMessages = [ ];
			
			oModel.setProperty("/core", 0);
			oModel.setProperty("/chosen/total", 0);
			oModel.setProperty("/chosen/wi", 0);
			oModel.setProperty("/chosen/inf", 0);
			oModel.setProperty("/chosen/bwl", 0);
			
			for(let i=0 ; i<oModel.getProperty("/courses").length ; i++) {
				if(oModel.getProperty("/courses")[i].type === "CORE") {
					oModel.setProperty("/core", oModel.getProperty("/core") + 1);
				}
				else {
					oModel.setProperty("/chosen/total", oModel.getProperty("/chosen/total") + 1);
					oModel.setProperty("/chosen/" + oModel.getProperty("/courses")[i].type.toLowerCase(), oModel.getProperty("/chosen/" + oModel.getProperty("/courses")[i].type.toLowerCase()) + 1);
				}
			}
			
			//Check the core courses
			if(oModel.getProperty("/core") !== this._courses.getProperty("/core")) {
				aMessages.push({
					id : "CORE",
					type : "Error",
					title : this._i18n.getProperty("error_not_enough_courses_core", [ this._courses.getProperty("/core") ])
				});
			}
			
			//Check the chosen courses
			if(oModel.getProperty("/chosen/total") < 9) {
				aMessages.push({
					id : "CHOSEN",
					type : "Error",
					title : this._i18n.getProperty("error_not_enough_courses")
				});
			}
			else if(oModel.getProperty("/chosen/total") > 9) {
				aMessages.push({
					id : "CHOSEN",
					type : "Warning",
					title : this._i18n.getProperty("error_too_many_courses")
				});
			}
			
			//Check the wi courses
			if(oModel.getProperty("/chosen/wi") < 2) {
				aMessages.push({
					id : "WI",
					type : "Error",
					title : this._i18n.getProperty("error_not_enough_courses_wi")
				});
			}
			//Check the inf courses
			if(oModel.getProperty("/chosen/inf") < 2) {
				aMessages.push({
					id : "INF",
					type : "Error",
					title : this._i18n.getProperty("error_not_enough_courses_inf")
				});
			}
			//Check the bwl courses
			if(oModel.getProperty("/chosen/bwl") < 2) {
				aMessages.push({
					id : "BWL",
					type : "Error",
					title : this._i18n.getProperty("error_not_enough_courses_bwl")
				});
			}
			
			this._messages.setProperty("/total", aMessages.length);
			this._messages.setProperty("/items", aMessages);
			
			this._studies.updateBindings();
			this._messages.updateBindings();
		}
	};
});