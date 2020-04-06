"use strict";

const Node = require('featurecli-commons').types.Node;

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

const rebuildOriginalFunction = function (originalNode, newNode) {
    newNode.type = originalNode.type; //copy the correct type

    newNode.parent = originalNode.parent;

    newNode.kind = originalNode.kind;
    newNode.path = originalNode.path;
    newNode.name = originalNode.name;
    newNode.featureName = originalNode.featureName;

    var newKey = new Node();
    newKey.type = originalNode.key.type;
    newKey.name = originalNode.key.name;
    newKey.path = originalNode.key.path;
    newKey.parent = newNode;

    newNode.key = newKey; //copy the property key

    newNode.value = originalNode.value;
    newNode.value.parent = newNode;
    return newNode;
}

const rule = {
    resolve: function (baseFST, featureFST, oContext) {
        debugger;
        //TODO: differentiate between different types of sub nodes!!!

        /* var originals = getOriginalCalls(featureFST);
        // if original calls exists, add the baseFST function as new property
        var newProperty = rebuildOriginalFunction(baseFST.parent, new Node());
        newProperty.key.name = baseFST.parent.key.name + '_' + baseFST.featureName;
        baseFST.parent.parent.properties.push(newProperty)
        originals.forEach((node) => {
            node.expression.callee.name = baseProperty.key.name;
        })
        debugger;

        //Problem is the return of a single node for the imposing process
        //But at this point we need multiple nodes to be returned which is not possible
        //TODO: find a solution
        featureFST.parent.parent = baseFST.parent.parent;
        return featureFST; */
    },
    target: ['js', 'ecma'],
    selector: 'Property[value="{type=FunctionExpression}"]',
    selectorFeature: 'Property[name="{type=FunctionExpression}"]'
};

module.exports = rule;