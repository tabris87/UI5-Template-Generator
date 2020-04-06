sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
    "use strict";
    return UIComponent.extend('fop.template.ui5.Component', {
        init: function () {
            original();
            // create the views based on the url/hash
            this.getRouter().initialize();
        }
    });
});