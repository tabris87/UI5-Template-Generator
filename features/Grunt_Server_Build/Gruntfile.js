function setupConfig(grunt) {
    original(grunt);
    const serveStatic = require('serve-static');

    grunt.config.merge({
        connect: {
            server_build: {
                options: {
                    base: 'dist',
                    directory: 'dist',
                    port: 9000,
                    middleware: function (connect, options, defaultMiddleware) {
                        return [
                            require('grunt-connect-proxy2/lib/utils').proxyRequest,
                            serveStatic('dist'),
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
            server_build: {
                files: ['dist/**/*.*'],
                tasks: []
            }
        }
    });
}

function registerTasks(grunt) {
    grunt.registerTask('serve_build', ['configureProxies:server_build', 'connect:server_build', 'watch:server_build']);
    original(grunt);
}