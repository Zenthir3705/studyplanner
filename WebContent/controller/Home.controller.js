sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/m/MessagePopover",
	"sap/m/MessageItem",
	"hm/dhbw/cas/controller/BaseController",
	"hm/dhbw/cas/controller/CourseManager"
], function(JSONModel, MessagePopover, MessageItem, BaseController, CourseManager) {
	"use strict";
	
	return BaseController.extend("hm.dhbw.cas.controller.Home", {
		
		//************************************************************************
		//
		//	Event handler
		//
		//************************************************************************
		
		/**
		 * Event method for the init event of the controller.
		 * @public
		 */
		onInit : function() {
			BaseController.prototype.onInit.call(this);
			this.getRouter().getRoute("home").attachMatched(this.onRouteMatched, this);
			
			CourseManager.validateStudies();
		},
		
		/**
		 * Event method for route matching.
		 * Determines the view state and changes the view.
		 * @public
		 * @param {sap.ui.base.Event} oEvent the route matching event
		 */
		onRouteMatched : function(oEvent) {
			var sIds = oEvent.getParameter("arguments")["?options"] ? oEvent.getParameter("arguments")["?options"].courses : undefined;
			
			if(sIds) {
				CourseManager.addCourses(sIds.split(","));
			}
		},
		
		/**
		 * Event method for the list item press event.
		 * @public
		 */
		onCourse : function(oEvent) {
			var oContext = oEvent.getSource().getBindingContext("studies"),
			oObject = oContext.getObject();
			
			this.getRouter().navTo("course", { id : oObject.id }, false);
		},
		
		/**
		 * Event method for the list item press event.
		 * @public
		 */
		onDeleteCourse : function(oEvent) {
			var oContext = oEvent.getParameter("listItem").getBindingContext("studies"),
			oObject = oContext.getObject();
			
			CourseManager.removeCourse(oObject.id);
		},
		
		/**
		 * Event method for the messages list button.
		 * @public
		 */
		onMessages : function(oEvent) {
			if(!this._messagePopover) {
				this._messagePopover = new MessagePopover({
					items : {
						path : "messages>/items",
						template : new MessageItem({
							type : "{messages>type}",
							title : "{messages>title}",
							subtitle : "{messages>subtitle}",
						})
					}
				});
				this.getView().addDependent(this._messagePopover);
			}
			this._messagePopover.toggle(oEvent.getSource());
		},
		
		/**
		 * Event method for the course list button.
		 * @public
		 */
		onCourseList : function(oEvent) {
			this.getRouter().navTo("list", { }, false);
		}
	});
});