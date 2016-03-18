module.exports = function(grunt) {
 
    grunt.initConfig({
 
        pkg: grunt.file.readJSON('package.json'),
 
        // Pre-commands
        run: {
            prepare: {
                exec: 'rm -rf ../static/ && mkdir ../static' // We want to clean all statics when running Grunt
            },
            bower: {
                exec: 'bower install'
            },
            after_build: {
                exec: 'rm -rf ./build/' // Compiled files from ES6 to ES5
            }
        },

        /**
         *  ----------- JAVASCRIPT -------------
         * 
         */

        // Uglify JS files
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '* Copyright (c) <%= grunt.template.today("yyyy") %> \n*/',
            },
            dist: {
                files: {
                    '../static/js/main.min.js': '../static/js/main.js'
                },
                options: {
                    mangle: false
                }
            }
        },

        // Transpile to ES5 JS
        babel: {
            options: {
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    ext: '.js',
                    src: './js/**/*.js',
                    dest: './build/'
                }]
            }
        },

        browserify: {
            dist: {
               options: {
                  transform: [
                     ["babelify", {presets: ["es2015"] }]
                  ]
               },
               files: {
                  "../static/js/main.js": ["./js/app.js"]
               }
            }
         },

        // Check JS Syntax!
        jshint: {
            files: ['gruntfile.js', '../static/js/**/*.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true
                }
            }
                
        },


        /**
         *  ----------- SASS -------------
         * 
         */
        // Compile SASS into CSS
        compass: {
            dist: {
                options: {
                    sassDir: './sass',
                    cssDir: '../static/css',
                    environment: 'production',
                    outputStyle: 'compressed'
                }
            },
            dev: {
                options: {
                    sassDir: './sass',
                    cssDir: '../static/css',
                    environment: 'development'
                }
            }
        },

        /**
         *  ----------- OTHER TASKS-------------
         * 
         */

        // Copy only useful files into /static after bower install
        bowercopy: {
            // Javascript files
            js: {
                options: {
                    destPrefix: '../static/js'
                },
                files: {
                    'bootstrap.min.js': 'bootstrap/dist/js/bootstrap.min.js',
                    'jquery.min.js': 'jquery/dist/jquery.min.js',
                    'jquery.min.map': 'jquery/dist/jquery.min.map',
                }
            },
            // CSS Files
            css: {
                options: {
                    destPrefix: '../static/css'
                },
                files: {
                    'bootstrap.min.css': 'bootstrap/dist/css/bootstrap.min.css',
                    'bootstrap.min.css.map': 'bootstrap/dist/css/bootstrap.min.css.map',
                }
            },
            // Fonts files
            fonts: {
                options: {
                    destPrefix: '../static/fonts'
                },
                files: {
                    '': 'bootstrap/dist/fonts/*'
                }
            },
            // Images
            images: {
                options: {
                    destPrefix: '../static/images'
                },
                files: {
                    '': '../images/*'
                }
            },/*
            // Angular HTML Views 
            angular_templates: {
                options: {
                    destPrefix: '../static/js/views'
                },
                files: {
                    '': '../js/views/*'
                }
            }*/
        },

        // Watcher
        watch: {
            scripts: {
                files: [
                    './sass/**/*.scss',
                    './js/**/*.js'
                ],
                tasks: ['compass:dev']
            }
        }
 
    });
 
    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-run');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.loadNpmTasks('grunt-bowercopy');

 
    // Default task.
    grunt.registerTask('default', ['run:prepare', 'run:bower', 'compass:dev', 'browserify',  'uglify', 'bowercopy', 'run:after_build']);
 
};
