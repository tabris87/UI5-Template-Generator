const xmlReader = require('xml-reader');
const colors = require('colors');
const reader = xmlReader.create();
const stdin = process.stdin;
const stdout = process.stdout;
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

//#region https://stackoverflow.com/questions/5006821/nodejs-how-to-read-keystrokes-from-stdin/5059872#5059872
/* // without this, we would only get streams once enter is pressed
stdin.setRawMode( true );

// resume stdin in the parent process (node app won't quit all by itself
// unless an error or process.exit() happens)
stdin.resume();

// i don't want binary, do you?
stdin.setEncoding( 'utf8' );

// on any data into stdin
stdin.on( 'data', function( key ){
  // ctrl-c ( end of text )
  if ( key === '\u0003' ) {
    process.exit();
  }
  // write the key to stdout all normal like
  process.stdout.write( key );
}); */
//#endregion

//#region model
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
//#endregion

class ModelRenderer {
    static readline = require('readline');

    static contains(oObj, sAttribute, sDefault = "") {
        return oObj[sAttribute] ? oObj[sAttribute] : sDefault
    }

    /**
     * Constructor of the ModelRenderer
     * @param {oObject} model the javascript object representation of the model
     */
    constructor(model) {
        this._model = model;
        this._addSelectInformation = false;
        this._linesDrawn = 0;
    }

    _firstPrefix(bAlt, bOnly, bLastIndex) {
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

    _selectionField(bAlt, bMandatory) {
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

    _createParentPrefix(node) {
        if (node.parent) {
            let sParentPrefix = this._createParentPrefix(node.parent);

            let sCurPrefix = node.parent.prefix;

            switch (sCurPrefix) {
                case String.fromCharCode(9562):
                    sCurPrefix = " ";
                    break;
                case String.fromCharCode(9492):
                    sCurPrefix = " ";
                    break;
                case String.fromCharCode(9568):
                    sCurPrefix = String.fromCharCode(9553);
                    break;
                case String.fromCharCode(9500):
                    sCurPrefix = "|";
                    break;
                default:
                    sCurPrefix = sCurPrefix;
            }

            return sParentPrefix + (sCurPrefix ? sCurPrefix : "");
        } else {
            return "";
        }
    }

    _traverse(node, level = -1, print = false, childIndex = -1) {
        //startPrinting
        if (node.name === "struct") {
            level++;
            node.prefix = " ";
            node.children.forEach((subNode, index) => this._traverse(subNode, level, true, index));
            return
        }

        if (print) {
            if (!node.selected) {
                node.selected = ModelRenderer.contains(node.attributes, "mandatory", false) ? true : false;
            }

            let parentPrefix = this._createParentPrefix(node);
            let prefix = this._firstPrefix(node.parent.name === "alt", node.parent.children.length === 1, node.parent.children.length - 1 === childIndex);
            let selectField = this._addSelectInformation ? this._selectionField(node.parent.name === "alt", ModelRenderer.contains(node.attributes, "mandatory", false) || node.selected) : "";
            let featureName = ModelRenderer.contains(node.attributes, "name", "unnamed");
            let output = ModelRenderer.contains(node.attributes, "mandatory", undefined) ? colors.underline.cyan(featureName) : featureName;
            output = ModelRenderer.contains(node.attributes, "abstract", undefined) ? colors.gray(featureName) : output;


            let outputString = `${parentPrefix}${level!==0 ? prefix : ""}${level!==0 ? selectField : ""}${output}`;

            node.prefix = prefix;
            console.log(outputString);
            this._linesDrawn++;
        }

        if (level > -1) {
            level++;
        }
        node.children.forEach((subNode, index) => this._traverse(subNode, level === 0 ? 0 : level, print, index));
    }

    _markFeature(node, sFeatureName) {
        if (ModelRenderer.contains(node.attributes, "name", "") === sFeatureName) {
            node.selected = !node.selected;
            return true;
        }
        return node.children.map(child => this._markFeature(child, sFeatureName)).reduce((total, cur) => total || cur, false);
    }

    _getMarkedFeatures(node, bTreeReached) {
        //only start if we passed the struct node
        debugger;
        if (!node.selected && !bTreeReached) {
            if (node.name === "struct") {
                return node.children
                    .map(child => this._getMarkedFeatures(child, true))
                    .reduce((t, c) => typeof c === "string" ? [...t, c] : [...t, ...c], [])
                    .filter((item) => item.trim() !== '');
            } else {
                return node.children
                    .map(child => this._getMarkedFeatures(child))
                    .reduce((t, c) => typeof c === "string" ? [...t, c] : [...t, ...c], [])
                    .filter((item) => item.trim() !== '');
            }
            //only return features which are selected, just possible top down, stop if not selected
        } else if (node.selected && bTreeReached) {
            if (!ModelRenderer.contains(node.attributes, "abstract")) {
                return [
                        ModelRenderer.contains(node.attributes, "name", ""),
                        ...node.children
                        .map(child => this._getMarkedFeatures(child, bTreeReached))
                    ]
                    .reduce((t, c) => typeof c === "string" ? [...t, c] : [...t, ...c], [])
                    .filter((item) => item.trim() !== '');
            } else {
                return node.children
                    .map(child => this._getMarkedFeatures(child, bTreeReached))
                    .reduce((t, c) => typeof c === "string" ? [...t, c] : [...t, ...c], [])
                    .filter((item) => item.trim() !== '');
            }
        } else {
            return "";
        }
    }

    markFeatureSelected(sFeatureName) {
        return this._markFeature(this._model, sFeatureName);
    }

    showSelected(bShow = false) {
        this._addSelectInformation = bShow;
    }

    render() {
        if (this._linesDrawn !== 0) {
            Array(this._linesDrawn).forEach(() => ModelRenderer.readline.clearLine())
        }
        this._traverse(this._model);
    };

    showLegend() {
        console.log('\n');
        const sMandatory = `Mandatory:   ${colors.cyan.underline('<FeatureName>')}`;
        const sAbstract = `Abstract:    ${colors.gray('<FeatureName>')}`;
        const sOptional = this._addSelectInformation ?
            `Optional:    '${String.fromCharCode(9492)}','${String.fromCharCode(9500)}' - ${colors.red('| |')} <- unselected, ${colors.green('|X|')} <- selected` :
            `Optional:    '${String.fromCharCode(9492)}','${String.fromCharCode(9500)}'`
        const sAlternative = this._addSelectInformation ?
            `Alternative: '${String.fromCharCode(9562)}','${String.fromCharCode(9568)}' - ${colors.red('( )')} <- unselected, ${colors.green('(0)')} <- selected` :
            `Alternative: '${String.fromCharCode(9562)}','${String.fromCharCode(9568)}'`;

        console.log(sMandatory);
        console.log(sAbstract);
        console.log(sOptional);
        console.log(sAlternative);
    }

    getSelectedFeatures() {
        return this._getMarkedFeatures(this._model);
    }
}

let renderer;

const questions = {
    programPath: {
        text: `What do you want to do: \n(1) show model tree -> show\n(2) create configuration -> configure\n\nYou can choose by entering the number or key word (-> <keyword>)`,
        callback: answer => {
            if (answer === "1" || answer === "show") {
                renderer.render();
                renderer.showLegend();
                rl.close();
            } else if (answer === "2" || answer === "configure") {
                renderer.showSelected(true);
                renderer.render();
                rl.question(questions['ask'].text, questions['ask'].callback);
                /* ask(); */
            } else {
                rl.question(questions['programPath'].text, questions['programmPath'].callback);
                /* programPath(); */
            }
        }
    },
    ask: {
        text: 'Mark/Unmark a feature by typing the name (:q for finishing configuration): ',
        callback: answer => {
            if (answer === ":q") {
                rl.question(questions["writeConfig"].text, questions["writeConfig"].callback);
            } else {
                let marked = renderer.markFeatureSelected(answer);
                if (marked) {
                    rl.clearLine();
                    renderer.render();
                    rl.question(questions["ask"].text, questions["ask"].callback);
                    /* ask(); */
                } else {
                    console.log("Sry the feature cannot be found! Did you misspelled it?");
                    rl.clearLine();
                    rl.clearLine();
                    rl.question(questions["ask"].text, questions["ask"].callback);
                    /* ask(); */
                }
            }
        }
    },
    writeConfig: {
        text: 'Do you want to write the configuration? (y/N)',
        callback: (answer = "N") => {
            if (answer.toUpperCase() === "N") {
                rl.close();
            } else {
                rl.question(questions["configName"].text, questions["configName"].callback);
                /* configName(); */
            }
        }
    },
    configName: {
        text: 'How do want to call it?',
        callback: answer => {
            console.log(`${colors.bold.underline(answer.toUpperCase())}: ${renderer.getSelectedFeatures()}`);
            rl.close();
        }
    }
}

reader.on("done", data => {
    renderer = new ModelRenderer(data);
    rl.question(questions['programPath'].text, questions['programPath'].callback);
});
reader.parse(model);