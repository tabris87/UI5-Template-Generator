function setupConfig(grunt) {
    original(grunt);
    const serveStatic = require('serve-static');

    grunt.config.merge({
        connect: {
            server: {
                options: {
                    base: 'webapp',
                    directory: 'webapp',
                    port: 8000,
                    middleware: function (connect, options, defaultMiddleware) {
                        return [
                            require('grunt-connect-proxy2/lib/utils').proxyRequest,
                            serveStatic('webapp'),
                            defaultMiddleware
                        ];
                    }
                },
                proxies: [{
                    context: '/resources',
                    host: 'sapui5.hana.ondemand.com',
                    port: 443,
                    https: true
                }]
            }
        },
        watch: {
            server: {
                files: ['webapp/**/*.*'],
                tasks: []
            }
        }
    });
}

function loadNPMTasks(grunt) {
    original(grunt);
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-connect-proxy2');
    grunt.loadNpmTasks('grunt-contrib-watch');
}

function registerTasks(grunt) {
    grunt.registerTask('serve', ['configureProxies:server', 'connect:server', 'watch:server']);
    original(grunt);
}