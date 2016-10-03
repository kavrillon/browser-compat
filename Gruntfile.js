

module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        dirs: {
            grunt: '.grunt',
            sassCache: '.sass-cache',
            temp: '.tmp',
            dist: 'dist',
            app: 'src',
            fonts: '<%= dirs.app %>/fonts',
            images: '<%= dirs.app %>/images',
            js: '<%= dirs.app %>/js',
            styles: '<%= dirs.app %>/styles'
        },
        watch: {
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: ['<%= dirs.app %>/**/*.html',
                    '<%= dirs.fonts %>/**/*.*',
                    '<%= dirs.temp %>/**/*.css',
                    '<%= dirs.js %>/**/*.js',
                    '<%= dirs.images %>/**/*.*'
                ]
            },
            css: {
                files: ['<%= dirs.styles %>/**/*.scss'],
                tasks: ['sass:dev']
            }
        },
        connect: {
            options: {
                port: 8080,
                livereload: 35729,
                hostname: 'localhost'
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '<%= dirs.temp %>',
                        '<%= dirs.app %>'
                    ]
                }
            }
        },
        sass: {
            dev: {
                options: {
                    style: 'expanded',
                    lineNumber: true
                },
                files: {
                    '<%= dirs.temp %>/css/app.css': '<%= dirs.styles %>/app.scss'
                }
            },
            build: {
                options: {
                    style: 'compressed'
                },
                files: {
                    '<%= dirs.temp %>/css/app.css': '<%= dirs.styles %>/app.scss'
                }
            }
        },
        postcss: {
            options: {
                processors: [
                    require('oldie'),
                    require('postcss-flexibility')
                ]
            },
            dist: {
                src: '<%= dirs.temp %>/css/app.css',
                dest: '<%= dirs.temp %>/css/app.oldie.css'
            }
        },
        autoprefixer: {
            options: {
                browsers: ['last 2 versions', 'ie 8', 'ie 9', 'android >= 3']
            },
            dist: {
                src: '<%= dirs.temp %>/css/app.css',
                dest: '<%= dirs.temp %>/css/app.css'
            }
        },
        scsslint: {
            allFiles: [
                '<%= dirs.app %>/styles/**/*.scss'
            ],
            options: {
                config: '.scss-lint.yml',
                colorizeOutput: true
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: {
                src: ['<%= dirs.js %>/**/*.js']
            }
        },
        clean: {
            sassCache: '<%= dirs.sassCache %>',
            grunt: '<%= dirs.grunt %>',
            temp: '<%= dirs.temp %>',
            server: '<%= dirs.dist %>'
        },
        copy: {
            images: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.images %>',
                    src: '**/*',
                    dest: '<%= dirs.dist %>/images'
                }]
            },
            html: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.app %>/',
                    src: '**/*.html',
                    dest: '<%= dirs.dist %>'
                }]
            },
            js: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.js %>',
                    src: '**/*.js',
                    dest: '<%= dirs.dist %>/js'
                }]
            },
            css: {
                files: [{
                    expand: true,
                    cwd: '<%= dirs.temp %>',
                    src: '**/*.css',
                    dest: '<%= dirs.dist %>'
                }]
            }
        },
        'gh-pages': {
            options: {
                base: 'dist'
            },
            src: ['**']
        }
    });

    grunt.registerTask('default', 'serve');

    grunt.registerTask('lint', [
        'scsslint',
        'jshint'
    ]);

    grunt.registerTask('serve', [
        'clean',
        'sass:dev',
        'autoprefixer',
        'postcss',
        'connect:livereload',
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        //'lint',
        'sass:build',
        'autoprefixer',
        'postcss',
        'copy'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'gh-pages'
    ]);
};
