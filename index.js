const {
    Project
} = require('smithery');
const oProject = new Project({
    buildFolder: './template',
    projectFiles: './src',
    configs: [{
        name: "default",
        features: [
            "Base",
            "Single",
            "FreeStyleFirst"
        ]
    },
    {
        name: "TwoPageFreestyle",
        features: [
            "Base",
            "Single",
            "FreeStyleFirst",
            "FreeStyleSecond"
        ]
    },
    {
        name: "ThreePageFreestyle",
        features: [
            "Base",
            "FlexibleColumnLayout",
            "FreeStyleFirst",
            "FreeStyleSecond",
            "FreeStyleThird"
        ]
    }
    ],
    plugins: [{
        name: "smithery-plugin-xml",

        config: {}
    }]
});

oProject.build('default');