sap.ui.define(['sap/ui/core/UIComponent'], function (UIComponent) {
    'use strict';
    return UIComponent.extend('fop.template.ui5.Component', {
        metadata: { manifest: 'json' },
        init_APPLICATION: function () {
            UIComponent.prototype.init.apply(this, arguments);
        },
        init: function () {
            init_APPLICATION();
            this.getRouter().initialize();
        }
    });
});