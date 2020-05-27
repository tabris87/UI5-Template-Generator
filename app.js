const xmlReader = require('xml-reader');
const reader = xmlReader.create();

const model = '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' +
    '<featureModel>' +
    '    <properties/>' +
    '    <struct>' +
    '        <and abstract="true" mandatory="true" name="TemplateGenerator">' +
    '            <feature mandatory="true" name="Base"/>' +
    '            <alt abstract="true" mandatory="true" name="CodeBase">' +
    '                <and name="Application">' +
    '                    <alt abstract="true" mandatory="true" name="Layout">' +
    '                        <feature name="Single"/>' +
    '                        <feature name="MasterDetail"/>' +
    '                        <feature name="FlexibleColumnLayout"/>' +
    '                    </alt>' +
    '                    <alt abstract="true" mandatory="true" name="FirstPage">' +
    '                        <feature name="FreeStyleFirst"/>' +
    '                        <feature name="List"/>' +
    '                        <feature name="Table"/>' +
    '                        <feature name="WorkList"/>' +
    '                        <feature name="Toolpage"/>' +
    '                    </alt>' +
    '                    <alt abstract="true" name="SecondPage">' +
    '                        <feature name="FreeStyleSecond"/>' +
    '                        <feature name="ObjectpageSecond"/>' +
    '                    </alt>' +
    '                    <alt abstract="true" name="ThirdPage">' +
    '                        <feature name="FreeStyleThird"/>' +
    '                        <feature name="ObjectpageThird"/>' +
    '                    </alt>' +
    '                </and>' +
    '                <feature name="Library"/>' +
    '            </alt>' +
    '        </and>' +
    '    </struct>' +
    '    <constraints>' +
    '        <rule>' +
    '            <imp>' +
    '                <var>ThirdPage</var>' +
    '                <var>FlexibleColumnLayout</var>' +
    '            </imp>' +
    '        </rule>' +
    '    </constraints>' +
    '    <calculations Auto="true" Constraints="true" Features="true" Redundant="true" Tautology="true"/>' +
    '    <comments/>' +
    '    <featureOrder userDefined="false"/>' +
    '</featureModel>';

function traverse(node, level, print) {
    //startPrinting
    if (node.name === "struct") {
        node.children.forEach((subNode) => traverse(subNode, ++level, true));
        return
    }

    if (print) {
        process.stdout.write(`Level ${level}: ${node.name}\n`);
        debugger;
    }

    node.children.forEach((subNode) => traverse(subNode, level === 0 ? 0 : level++, print));
};

reader.on("done", data => traverse(data, 0, false));
reader.parse(model);