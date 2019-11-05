module.exports = function(grunt) {
  var EDITIONS = ['lite', 'beta', 'staging', 'power_user'];

  var edition = grunt.option('edition');
  if (EDITIONS.indexOf(edition) === -1) {
    throw 'No extension specified. Should be one of: ' + EDITIONS;
  }

  var outputDir = 'dist_' + edition + '/';

  var config = {
    pkg: grunt.file.readJSON('package.json'),

    copy: {
      main: {
        files: [
          {expand: true, cwd: 'src', src: '**', dest: outputDir},
          {expand: true, cwd: 'editions/' + edition, src: 'icon.png', dest: outputDir}
        ]
      }
    },
    update_json: {
      manifest_file: {
        src: 'editions/' + edition + '/manifest_overrides.json',
        dest: outputDir + 'manifest.json',
        fields: ['name', 'version', 'description', 'permissions', 'optional_permissions', 'storage']
      }
    },
    zip: {},
    watch: {
      scripts: {
        files: ['src/**'],
        tasks: ['build-dist'],
        options: {
          spawn: false
        }
      }
    }
  };

  config.zip[outputDir.replace('/', '.zip')] = outputDir + '*';

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-update-json');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('build-dist', function() {
    grunt.task.run('copy', 'update_json', 'zip');
  });

  grunt.registerTask('default', ['build-dist', 'watch']);
};
