"use strict";

const rule = {
    resolve: function (baseFST, featureFST, oContext) {
        baseFST.parent = featureFST.parent;
        return [baseFST, featureFST];
    },
    target: ['js', 'ecma'],
    selector: 'ExpressionStatement[name="grunt.registerTask"]'
};

module.exports = rule;