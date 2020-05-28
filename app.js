const xmlReader = require('xml-reader');
const colors = require('colors');

const reader = xmlReader.create();

const model =
    '<?xml version="1.0" encoding="UTF-8" standalone="no"?>' +
    '<featureModel>' +
    '    <properties/>' +
    '    <struct>' +
    '        <and abstract="true" mandatory="true" name="TemplateGenerator">' +
    '            <feature mandatory="true" name="Base"/>' +
    '            <alt abstract="true" mandatory="true" name="CodeBase">' +
    '                <and name="Application">' +
    '                    <alt abstract="true" mandatory="true" name="Navigation">' +
    '                        <alt name="Routing">' +
    '                            <and abstract="true" name="Simple">' +
    '                                <and mandatory="true" name="OnePage">' +
    '                                    <and name="TwoPage">' +
    '                                        <feature name="ThreePage"/>' +
    '                                    </and>' +
    '                                </and>' +
    '                            </and>' +
    '                            <alt name="MasterDetail">' +
    '                                <feature name="WithDummyDetail"/>' +
    '                                <feature name="WithEmptyDetail"/>' +
    '                            </alt>' +
    '                            <alt name="FlexibleColumnLayout">' +
    '                                <feature name="TwoPageStartOne"/>' +
    '                                <feature name="MasterDetailType"/>' +
    '                            </alt>' +
    '                        </alt>' +
    '                        <feature name="NoRouting"/>' +
    '                    </alt>' +
    '                    <and mandatory="true" name="FirstPage">' +
    '                        <alt abstract="true" name="Pattern">' +
    '                            <feature name="Table"/>' +
    '                            <feature name="List"/>' +
    '                            <feature name="Worklist"/>' +
    '                            <feature name="Toolpage"/>' +
    '                        </alt>' +
    '                    </and>' +
    '                    <and name="SecondPage">' +
    '                        <feature name="ObjectPageSecond"/>' +
    '                    </and>' +
    '                    <and name="ThirdPage">' +
    '                        <feature name="ObjectPageThird"/>' +
    '                    </and>' +
    '                </and>' +
    '                <feature name="Library"/>' +
    '            </alt>' +
    '        </and>' +
    '    </struct>' +
    '    <constraints>' +
    '        <rule>' +
    '            <description>Without routing we can not have a third or even a second page.</description>' +
    '            <imp>' +
    '                <var>NoRouting</var>' +
    '                <not>' +
    '                    <disj>' +
    '                        <var>SecondPage</var>' +
    '                        <var>ThirdPage</var>' +
    '                    </disj>' +
    '                </not>' +
    '            </imp>' +
    '        </rule>' +
    '        <rule>' +
    '            <imp>' +
    '                <var>TwoPage</var>' +
    '                <var>SecondPage</var>' +
    '            </imp>' +
    '        </rule>' +
    '        <rule>' +
    '            <imp>' +
    '                <var>ThreePage</var>' +
    '                <var>ThirdPage</var>' +
    '            </imp>' +
    '        </rule>' +
    '        <rule>' +
    '            <imp>' +
    '                <var>MasterDetail</var>' +
    '                <conj>' +
    '                    <var>FirstPage</var>' +
    '                    <var>SecondPage</var>' +
    '                </conj>' +
    '            </imp>' +
    '        </rule>' +
    '    </constraints>' +
    '    <calculations Auto="true" Constraints="true" Features="true" Redundant="true" Tautology="true"/>' +
    '    <comments/>' +
    '    <featureOrder userDefined="false"/>' +
    '</featureModel>';

const contains = (oObj, sAttribute, sDefault = "") => oObj[sAttribute] ? oObj[sAttribute] : sDefault;

const firstPrefix = (bAlt, bOnly, bLastIndex) => {
    if (bAlt) {
        if (bOnly || bLastIndex) {
            return String.fromCharCode(9562); //"╚"
        } else {
            return String.fromCharCode(9568); //"⊫"
        }
    } else {
        if (bOnly || bLastIndex) {
            return String.fromCharCode(9492) //"˪"
        } else {
            return String.fromCharCode(9500) //"⊢"
        }
    }
}

const selectionField = (bAlt, bMandatory) => {
    if (bAlt) {
        if (bMandatory) {
            return colors.green('(0)');
        } else {
            return colors.red('( )');
        }
    } else {
        if (bMandatory) {
            return colors.green('|X|');
        } else {
            return colors.red('| |');
        }
    }
}

const createParentPrefix = (node) => {
    if (node.parent) {
        let sParentPrefix = createParentPrefix(node.parent);

        if (contains(node.attributes, "name", "") === "Application") debugger;
        let sCurPrefix = node.parent.prefix;

        switch (sCurPrefix) {
            case String.fromCharCode(9562):
                debugger;
                sCurPrefix = " ";
                break;
            case String.fromCharCode(9492):
                debugger;
                sCurPrefix = " ";
                break;
            case String.fromCharCode(9568):
                debugger;
                sCurPrefix = String.fromCharCode(9553);
                break;
            case String.fromCharCode(9500):
                debugger;
                sCurPrefix = "|";
                break;
            default:
                debugger;
                sCurPrefix = sCurPrefix;
        }

        /* sParentPrefix = sParentPrefix === String.fromCharCode(9562) ? " " : sParentPrefix;
        sParentPrefix = sParentPrefix === String.fromCharCode(9492) ? " " : sParentPrefix;
        sParentPrefix = sParentPrefix === String.fromCharCode(8875) ? String.fromCharCode(9553) : node.prefix; // "║"
        sParentPrefix = sParentPrefix === String.fromCharCode(9500) ? "|" : sParentPrefix; */

        return sParentPrefix + (sCurPrefix ? sCurPrefix : "");
    } else {
        return "";
    }
}

const traverse = (node, level = -1, print = false, childIndex = -1) => {
    //startPrinting
    if (node.name === "struct") {
        level++;
        node.prefix = " ";
        node.children.forEach((subNode, index) => traverse(subNode, level, true, index));
        return
    }

    if (print) {
        let parentPrefix = createParentPrefix(node);
        let prefix = firstPrefix(node.parent.name === "alt", node.parent.children.length === 1, node.parent.children.length - 1 === childIndex);
        let selectField = selectionField(node.parent.name === "alt", contains(node.attributes, "mandatory", false));
        let featureName = contains(node.attributes, "name", "unnamed");
        let output = contains(node.attributes, "mandatory", undefined) ? colors.underline.cyan(featureName) : featureName;
        output = contains(node.attributes, "abstract", undefined) ? colors.gray(featureName) : output;


        let outputString = `${parentPrefix}${level!==0 ? prefix : ""}${level!==0 ? selectField : ""}${output}`;

        node.prefix = prefix;
        console.log(outputString);
    }

    if (level > -1) {
        level++;
    }
    node.children.forEach((subNode, index) => traverse(subNode, level === 0 ? 0 : level, print, index));
};

reader.on("done", data => {
    traverse(data)

    console.log('\n');

    console.log(`Mandatory:   ${colors.cyan.underline('<FeatureName>')}`);
    console.log(`Abstract:    ${colors.gray('<FeatureName>')}`);
    console.log(`Optional:    ${colors.red('| |')} <- unselected, ${colors.green('|X|')} <- selected`);
    console.log(`Alternative: '${String.fromCharCode(9562)}','${String.fromCharCode(9568)}' - ${colors.red('( )')} <- unselected, ${colors.green('(0)')} <- selected`);
});
reader.parse(model);