function setupConfig(grunt) {
    original(grunt);
    grunt.config.merge({
        openui5_theme: {
            library: {
                files: [{
                    expand: true,
                    cwd: 'src',
                    src: '**/themes/**/library.source.less',
                    dest: 'dist'
                }],
                options: {
                    rootPaths: ['src'],
                    library: {
                        name: '<fop.template.library>'
                    }
                }
            }
        },
        openui5_preload: {
            library: {
                options: {
                    resources: {
                        cwd: 'src',
                        prefix: '<fop.template.library>',
                        src: [
                            '**/*.js'
                        ]
                    },
                    dest: 'dist',
                    compatVersion: "edge"
                },
                libraries: true
            }
        },
        copy: {
            library: {
                files: [{
                        expand: true,
                        cwd: 'src',
                        src: ['*.js', '**/*.js'],
                        dest: 'dist',
                        rename: function (dest, src) {
                            return dest + '/' + src.replace('.', "-dbg.");
                        }
                    },
                    {
                        expand: true,
                        cwd: 'src',
                        src: ['!*.js', '!**/*.js', '*.*', '**/*.*'],
                        dest: 'dist'
                    }
                ]
            }
        },
        uglify: {
            library: {
                files: [{
                    expand: true,
                    src: [
                        '*.js',
                        '**/*.js',
                        '!test/**'
                    ],
                    dest: 'dist',
                    cwd: 'src'
                }]
            }
        }
    })
}

function loadNPMTasks(grunt) {
    original(grunt);
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
}

function registerTasks(grunt) {
    grunt.registerTask('build', ['openui5_theme:library', 'openui5_preload:library', 'uglify:library', 'copy:library']);
    original(grunt);
}