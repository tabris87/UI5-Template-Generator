#!/usr/bin/env node

const fs = require('fs');
const cp = require('child_process');
const inquirer = require('inquirer');
const readline = require('readline');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

const {
    Project
} = require('featureCLI');

const build = sConfig => {
    const oProject = new Project({
        buildFolder: "./template",
        projectFiles: "./features",
        configs: "./configurations",
        projectRules: "./customRules",
        plugins: [{
                name: "featurecli-plugin-xml",
                config: {}
            },
            {
                name: "featurejs-plugin-json",
                config: {}
            },
            {
                name: "featurejs-plugin-ecma",
                config: {
                    parser: {
                        version: "es6"
                    }
                }
            }
        ]
    });

    try {
        oProject.build(sConfig);
    } catch (oError) {
        console.log(oError.message);
        console.log(oError.stack);
        process.exit(1);
    }
}

const configurator = () => {
    let child = cp.spawn('npx', ["featureCLI-configurator", "configure", "./models/model.xml", "./configurations"], {
        shell: true,
        stdio: [process.stdin, process.stdout, process.stderr]
    });
}

fs.readdir('./configurations', (err, aFiles) => {
    if (err) {
        debugger;
    }
    let bExistingsConfigs = aFiles.filter(name => name.endsWith('.config')).length > 0;
    let aChoices = aFiles.filter(name => name.endsWith('.config')).map(name => name.replace('.config', ''));
    aChoices.push(new inquirer.Separator());
    aChoices.push('Create New');
    aChoices.push(new inquirer.Separator());

    if (bExistingsConfigs) {
        inquirer.prompt([{
                type: "list",
                name: "config",
                message: "Which configuration should be build?",
                default: "Create New",
                choices: aChoices,

            }])
            .then(answers => {
                if (answers.config !== "Create New") {
                    build(answers.config)
                } else {
                    configurator();
                }
            })
            .catch(error => {
                process.exit();
            })
    } else {
        let counter = 0;
        const choice = () => {
            rl.question('There is currently no configuration. Do you want to exit or create a new one? (exit/NEW)', answers => {
                if (answers.toLowerCase() !== "exit" || answers !== "new") {
                    if (counter > 3) {
                        process.exit();
                    }
                    counter++;
                } else {
                    if (answers.toLowerCase() === "exit") {
                        process.exit();
                    }
                    configurator();
                }
            });
        }
        choice();
    }
});