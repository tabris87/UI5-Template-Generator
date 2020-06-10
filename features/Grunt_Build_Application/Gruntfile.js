function setupConfig(grunt) {
    original(grunt);
    grunt.config.merge({
        openui5_preload: {
            component: {
                options: {
                    resources: {
                        cwd: 'webapp',
                        prefix: 'fop.template.ui5'
                    },
                    dest: 'dist'
                },
                components: 'fop.template.ui5'
            }
        }
    });
}

function loadNPMTasks(grunt) {
    original(grunt);
}

function registerTasks(grunt) {
    original(grunt);
}