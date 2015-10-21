module.exports = function(grunt) {
	var target = grunt.option('target');
	grunt.initConfig({
		compass: {
			dist: {
				options: {
					config:'config.rb',
					cssDir: 'deploy/css',
					outputStyle: 'compressed' //expanded, nested, compact, or compressed
				}
			}
		},
		watch: {
			css: {
				files: 'sass/*.scss',
				tasks: ['compass']
			}
		},
		uglify: {
	      dist: {
	        src: 'js/main.js',
	        dest: 'deploy/js/main.js'
	      }
	    },
	    copy: {
		  main: {
		    files: [
				{
				    src: 'index.html',
				    dest: 'deploy/index.html'
				},
				{
					expand: true,
					src: ['libs/**'],
					dest: 'deploy/',
					filter: 'isFile'
				}
			]
		  },
		},
	});

	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');

	grunt.registerTask('default', []);
	grunt.registerTask('scss', ['watch']);
	grunt.registerTask('dist', ['uglify', 'compass', 'copy']);
}

