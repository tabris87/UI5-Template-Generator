const {
    Project
} = require('featureCLI');

const oProject = new Project({
    buildFolder: './template',
    projectFiles: './src',
    "configs": [{
            "name": "default",
            "features": [
                "Base",
                "Single",
                "FreeStyleFirst"
            ]
        },
        {
            "name": "TwoPageFreestyle",
            "features": [
                "Base",
                "Single",
                "FreeStyleFirst",
                "FreeStyleSecond"
            ]
        },
        {
            "name": "ThreePageFreestyle",
            "features": [
                "Base",
                "FlexibleColumnLayout",
                "FreeStyleFirst",
                "FreeStyleSecond",
                "FreeStyleThird"
            ]
        }
    ],
    plugins: [{
        name: "featurecli-plugin-xml",
        
        config: {}
    }]
});


oProject.build('default');
debugger;