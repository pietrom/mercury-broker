module.exports = function(grunt) {
  grunt.initConfig({
    jasmine: {
    pivotal: {
      src: 'src/main/js/**/*.js',
      options: {
        specs: 'src/test/js/**/*.spec.js',
        helpers: 'src/test/js/**/*.helper.js'
      }
    }
  }
  });

  // Register tasks.
  grunt.loadNpmTasks('grunt-contrib-jasmine');

  // Default task.
  grunt.registerTask('default', 'jasmine');
};
