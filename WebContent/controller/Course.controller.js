sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"hm/dhbw/cas/controller/BaseController",
	"hm/dhbw/cas/controller/CourseManager"
], function(JSONModel, MessageToast, BaseController, CourseManager) {
	"use strict";
	
	return BaseController.extend("hm.dhbw.cas.controller.Course", {
		
		/**
		 * Event method for the init event of the controller.
		 * @public
		 */
		onInit : function() {
			BaseController.prototype.onInit.call(this);
			this.getRouter().getRoute("course").attachMatched(this.onRouteMatched, this);
		},
		
		/**
		 * Event method for route matching.
		 * Determines the view state and changes the view.
		 * @public
		 * @param {sap.ui.base.Event} oEvent the route matching event
		 */
		onRouteMatched : function(oEvent) {
			var sId = oEvent.getParameter("arguments").id,
			oCourse = this.getModel("courses").getProperty("/items").find(x => x.id === sId);
			
			this.setModel(new JSONModel(oCourse), "course");
		},
		
		/**
		 * Event method for the add course button.
		 * @public
		 */
		onAddCourse : function() {
			if(CourseManager.addCourse(this.getModel("course").getProperty("/id"))) {
				this.getModel("course").setProperty("/chosen", true);
			}
			MessageToast.show(this.getTextResource("message_course_added"));
		},
		
		/**
		 * Event method for the remove course button.
		 * @public
		 */
		onRemoveCourse : function() {
			if(CourseManager.removeCourse(this.getModel("course").getProperty("/id"))) {
				this.getModel("course").setProperty("/chosen", false);
			}
			MessageToast.show(this.getTextResource("message_course_removed"));
		}
	});
});