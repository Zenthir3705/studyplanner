sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"hm/dhbw/cas/controller/PDFReader",
	"hm/dhbw/cas/controller/CourseManager"
], function(UIComponent, JSONModel, PDFReader, CourseManager) {
	"use strict";
	
	return UIComponent.extend("hm.dhbw.cas.Component", {
		
		metadata : {
			manifest : "json"
		},
		
		/**
		 * Event method for the init event of the component.
		 * Initializes the device model, router and user role.
		 * @public
		 */
		init : function() {
			UIComponent.prototype.init.apply(this, arguments);
			
			//Initialize the courses
			this.getModel("config").attachEventOnce("requestCompleted", function() {
				this.getModel("courses_wi").attachEventOnce("requestCompleted", function() {
					CourseManager.initialize(this, "WI");
					this.getRouter().initialize();
				}, this);
			}, this);

			//Commented out (model is in a .json file now)
			/*this._showBusyDialog();
			
			PDFReader.loadResources(this, {
				success : function(aCourses) {
					CourseManager.initialize(this, "WI", aCourses);

					this.getRouter().initialize();
					this._hideBusyDialog();
				}.bind(this),
				error : function() {
					this.getRouter().initialize();
				}.bind(this)
			});*/
		},
		
		/**
		 * Shows the busy dialog.
		 * @private
		 */
		_showBusyDialog : function() {
			var that = this;
			
			if(!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("hm.dhbw.cas.view.fragments.BusyDialog", this);
				this._oDialog.setModel(new JSONModel({
					title : this.getModel("i18n").getProperty("dialog_loading_title"),
					description : this.getModel("i18n").getProperty("dialog_loading_description")
				}));
			}
			
			setTimeout( function() {
				that._oDialog.open();
			}, 0);
		},
		
		/**
		 * Hides the busy dialog.
		 * @private
		 */
		_hideBusyDialog : function() {
			var that = this;
			
			if(this._oDialog) {
				setTimeout( function() {
					that._oDialog.close();
				}, 0);
			}
		}
	});
});