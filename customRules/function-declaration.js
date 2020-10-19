"use strict";

const getOriginalCalls = function (featureFST) {
    if (featureFST.body.type === "BlockStatement" && Array.isArray(featureFST.body.body)) {
        var aContains = featureFST.body.body.map((node) => {
            if (node.type === "ExpressionStatement" && node.expression.type === "CallExpression" && node.expression.callee.type === "Identifier" && node.expression.callee.name === "original") {
                return node;
            } else {
                return;
            }
        }).filter((bVal) => {
            return typeof bVal !== "undefined"
        });
        return aContains;
    } else {
        return [];
    }
}

const rule = {
    resolve: function (baseFST, featureFST) {
        var originals = getOriginalCalls(featureFST);
        if (originals.length > 0) {
            // if original calls exists, add the baseFST function as new property
            debugger;
            baseFST.id.name = `${baseFST.name}_${baseFST.featureName}`;
            originals.forEach((node) => {
                node.expression.callee.name = baseFST.id.name;
            });
        }
        featureFST.parent = baseFST.parent;
        baseFST.featureName = featureFST.featureName;

        return originals.length > 0 ? [baseFST, featureFST] : featureFST;
    },
    target: ['js', 'ecma'],
    selector: 'FunctionDeclaration'
};

module.exports = rule;