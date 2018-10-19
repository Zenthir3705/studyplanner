sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"hm/dhbw/cas/controller/BaseController",
	"hm/dhbw/cas/controller/CourseManager"
], function(JSONModel, BaseController, CourseManager) {
	"use strict";
	
	return BaseController.extend("hm.dhbw.cas.controller.Home", {
		
		
		/**
		 * Event method for the init event of the controller.
		 * @public
		 */
		onInit : function() {
			BaseController.prototype.onInit.call(this);
			this.setModel(new JSONModel({
				state : "Display"
			}), "view");
		},
		
		/**
		 * Event method for the choose courses button press event.
		 * @public
		 */
		onChooseCourses : function(oEvent) {
			this.getModel("view").setProperty("/state", "Edit");
		},
		
		/**
		 * Event method for the add courses button press event.
		 * @public
		 */
		onAddCourses : function(oEvent) {
			var aContexts = this.byId("lsCourses").getSelectedContexts("courses"),
			aIds = [ ];
			
			//Add all to studies model
			for(let i=0 ; i<aContexts.length ; i++) {
				aIds.push(aContexts[i].getObject().id);
			}
			CourseManager.addCourses(aIds)
			
			this.getModel("view").setProperty("/state", "Display");
			this.getRouter().navTo("home", { }, false);
		},
		
		/**
		 * Event method for the cancel choosing courses button press event.
		 * @public
		 */
		onCancelChoosing : function(oEvent) {
			this.getModel("view").setProperty("/state", "Display");
		},
		
		/**
		 * Event method for the list item press event.
		 * @public
		 */
		onListItem : function(oEvent) {
			var oContext = oEvent.getSource().getBindingContext("courses"),
			oObject = oContext.getObject();
			
			this.getRouter().navTo("course", { id : oObject.id }, false);
		},
		
		/**
		 * Event method for the back button presse event.
		 * @public
		 */
		onBack : function() {
			this.getRouter().navTo("home", { }, false);
		}
	});
});