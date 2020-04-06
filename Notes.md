# Component.js
In der Component.js fehlt die Auflösung des Original vom ROUTING-Feature.

# How to find original expression
1. node.body == "BlockStatement" && node.body.body == Array
2. ForEach node.body.body:
   1. body_node == "ExpressionStatement"
   2. body_node.expression == "CallExpression"
   3. body_node.expression.callee == "Identifier" && body_node.expression.callee.name == "original"


3. If all matches:
   1. take body_node.expression
   2. replace arguments by baseFST.params
4. create new baseFST property.key:
   1. baseFST.parent.key.name = baseFST.parent.key.name + '_' + baseFST.featureName
5. replace original.callee.name by new baseFST property.key