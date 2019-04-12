sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/m/IconTabFilter",
	"sap/m/List",
	"sap/m/StandardListItem",
	"hm/dhbw/cas/controller/BaseController",
	"hm/dhbw/cas/controller/CourseManager"
], function(JSONModel, Filter, FilterOperator, IconTabFilter, List, StandardListItem, BaseController, CourseManager) {
	"use strict";
	
	return BaseController.extend("hm.dhbw.cas.controller.Home", {
		
		
		/**
		 * Event method for the init event of the controller.
		 * @public
		 */
		onInit : function() {
			BaseController.prototype.onInit.call(this);
			
			//Generate the tab filters
			this._generateTabFilters();
		},

		/**
		 * Generates the tab filters according to the chosen studies type
		 * @private
		 */
		_generateTabFilters : function() {
			const that = this,
			oTabBar = this.byId("lsTabBar"),
			sDiscipline = this.getModel("studies").getProperty("/discipline"),
			aTypes = this.getModel("config").getProperty("/" + sDiscipline + "/types");

			for(let i=0 ; i<aTypes.length ; i++) {
				oTabBar.addItem(new IconTabFilter({
					text : "{i18n>course_type_" + aTypes[i].toLowerCase() + "_long} ({courses>/" + aTypes[i].toLowerCase() + "})",
					content : [
						new List({
							mode : "None"
						}).bindItems({
							path : "courses>/items",
							sorter : {
								path : "courses>id",
								descending : false
							},
							filters : [
								new Filter("type",FilterOperator.EQ, aTypes[i])
							],
							template : new StandardListItem({
								title : "{courses>id}: {courses>title}",
								description : "{courses>responsible}",
								type : "Navigation",
								press : that.onListItem.bind(that)
							})
						})
					]
				}));
			}
		},
		
		/**
		 * Event method for the choose courses button press event.
		 * @public
		 */
		onChooseCourses : function() {
			this.getModel("view").setProperty("/state", "Edit");
		},
		
		/**
		 * Event method for the add courses button press event.
		 * @public
		 */
		onAddCourses : function() {
			var aContexts = this.byId("lsCourses").getSelectedContexts("courses"),
			aIds = [ ];
			
			//Add all to studies model
			for(let i=0 ; i<aContexts.length ; i++) {
				aIds.push(aContexts[i].getObject().id);
			}
			CourseManager.addCourses(aIds);
			
			this.getModel("view").setProperty("/state", "Display");
			this.getRouter().navTo("home", { }, false);
		},
		
		/**
		 * Event method for the cancel choosing courses button press event.
		 * @public
		 */
		onCancelChoosing : function() {
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