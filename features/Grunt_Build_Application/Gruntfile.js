function setupConfig(grunt) {
    original(grunt);
    grunt.config.merge({
        openui5_preload: {
            component: {
                options: {
                    resources: {
                        cwd: 'webapp',
                        prefix: '<fop.template.ui5>'
                    },
                    dest: 'dist'
                },
                components: '<fop.template.ui5>'
            }
        },
        cssmin: {
            build: {
                files: [{
                    expand: true,
                    cwd: 'webapp',
                    src: 'css/*.css',
                    dest: 'dist'
                }]
            }
        },
        copy: {
            component: {
                files: [{
                        expand: true,
                        cwd: 'webapp',
                        src: ['*.js', '**/*.js', '!test/**'],
                        dest: 'dist',
                        rename: function (dest, src) {
                            return dest + '/' + src.replace('.', "-dbg.");
                        }
                    },
                    {
                        expand: true,
                        cwd: 'webapp',
                        src: [
                            '**/*.jpg',
                            '**/*.jpeg',
                            '**/*.svg',
                            '**/*.png',
                            '**/*.bmp',
                            '**/*.gif',
                            '**/*.css',
                            '**/*.html',
                            '**/*.json',
                            '**/*.xml',
                            '**/*.properties',
                            'manifest.json',
                            '!test/**',
                            '!*_mock.html'
                        ],
                        dest: 'dist'
                    }
                ]
            }
        },
        uglify: {
            component: {
                files: [{
                    expand: true,
                    src: [
                        '*.js',
                        '**/*.js',
                        '!test/**'
                    ],
                    dest: 'dist',
                    cwd: 'webapp'
                }]
            }
        }
    });
}

function loadNPMTasks(grunt) {
    original(grunt);
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
}

function registerTasks(grunt) {
    grunt.registerTask('build', ['cssmin:build', 'openui5_preload:component', 'uglify:component', 'copy:component']);
    original(grunt);
}