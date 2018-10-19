sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/GroupHeaderListItem"
], function(Controller, History, JSONModel, GroupHeaderListItem) {
	"use strict";
	
	return Controller.extend("hm.dhbw.cas.controller.BaseController", {
		
		/**
		 * Getter method for the view model by name.
		 * @public
		 * @param {String} 					sName 	the model name
		 * @returns {sap.ui.model.*Model}			the model object
		 */
		getModel : function(sName) {
			var oModel = this.getView().getModel(sName);
			
			if(oModel) {
				return oModel;
			}
			else {
				return this.getOwnerComponent().getModel(sName);
			}
		},
		
		/**
		 * Setter method for the view model by name.
		 * @public
		 * @param {sap.ui.model.*Model}	oModel	the model object
		 * @param {String} 				sName 	the model name
		 */
		setModel : function(oModel, sName) {
			if(sName) {
				this.getView().setModel(oModel, sName);
			}
			else {
				this.getView().setModel(oModel);
			}
		},
		
		/**
		 * Getter model for the router object.
		 * @public
		 * @returns {sap.m.routing.Router} the router object
		 */
		getRouter : function() {
			return this.getOwnerComponent().getRouter();
		},
		
		/**
		 * Getter method for a resource text.
		 * @public
		 * @param {String}		sId			the resource text id
		 * @param {Object[]}	aParameters	optional; text parameters
		 * @returns {String}				the resource text
		 */
		getTextResource : function(sId, aParameters) {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle().getText(sId, aParameters);
		},
		
		/**
		 * Returns the group header.
		 * @public
		 */
		getGroupHeader : function(oGroup) {
			return new GroupHeaderListItem({
				title : this.getTextResource("course_type_" + oGroup.key.toLowerCase() + "_long"),
				upperCase : false
			});
		},
		
		/**
		 * Shows the busy dialog.
		 * @public
		 */
		showBusyDialog : function() {
			var that = this;
			
			if(!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("hm.dhbw.cas.view.fragments.BusyDialog", this);
				this.getView().addDependent(this._oDialog);
				this._oBusyDialog.setModel(new JSONModel({
					title : this.getTextResource("dialog_loading_title"),
					description : this.getTextResource("dialog_loading_description")
				}));
			}
			
			setTimeout( function() {
				that._oDialog.open();
			}, 0);
		},
		
		/**
		 * Hides the busy dialog.
		 * @public
		 */
		hideBusyDialog : function() {
			var that = this;
			
			if(this._dialog) {
				setTimeout( function() {
					that._dialog.close();
				}, 0);
			}
		},
		
		/**
		 * Event method for the init event of the controller.
		 * @public
		 */
		onInit : function() {
			
		},
		
		/**
		 * Event method for the back button.
		 * @public
		 */
		onBack : function() {
			window.history.go(-1);
		},
		
		/**
		 * Event method for the exit event of the controller.
		 * @public
		 */
		onExit : function() {
			this.destroy(true);
		}
	});
});