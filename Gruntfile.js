const webpackConfigFn = require('./webpack.config.js');

module.exports = function(grunt) {
  const EDITIONS = ['beta', 'staging', 'production'];
  const BROWSERS = ['chrome', 'firefox'];

  const edition = grunt.option('edition');
  const browser = grunt.option('browser');
  const instanceUrl = grunt.option('instance');
  try {
    if (!EDITIONS.includes(edition)) {
      throw 'No edition specified. Should be one of: ' + EDITIONS;
    }
    if (!BROWSERS.includes(browser)) {
      throw 'No browser specified. Should be one of: ' + BROWSERS;
    }
    if (!instanceUrl) {
      throw 'No instance provided, such as "https://trot.to"';
    }
  } catch (e) {
    grunt.log.error(e);

    grunt.fail.warn('Encountered error. Example usage:' +
        ' yarn dev --edition=production --browser=chrome --instance=https://trot.to');
  }

  const outputDir = `dists/dist_${edition}_${browser}/`;
  const zipPath = outputDir.slice(0, outputDir.length - 1) + '.zip';

  const webpackConfig = webpackConfigFn('', {
    distDir: outputDir,
    edition,
    browser,
    instanceUrl
  });

  const webpackOptions = {
    stats: !process.env.NODE_ENV || process.env.NODE_ENV === 'development',
    mode: process.env.NODE_ENV || 'development'
  };

  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
    // ensure dev webpack output doesn't use eval as that won't allow the dev extension to be loaded without messing
    // with manifest.json
    webpackOptions.devtool = 'source-map';
  } else {
    // Don't minimize when building to production in order to simplify review by browser teams. Performance impact
    // should be immaterial.
    webpackOptions.optimization = { minimize: false };
  }

  var config = {
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      output_dir: {
        src: [
          outputDir + '**',
          zipPath
        ]
      }
    },
    copy: {
      main: {
        files: [
          {expand: true, cwd: 'src', src: '**/*.{html,png,json}', dest: outputDir},
          {expand: true, cwd: 'editions/' + edition, src: 'icon*.png', dest: outputDir}
        ]
      }
    },
    update_json: {
      manifest_file: {
        src: [
          `editions/${edition}/manifest_overrides.json`,
          `editions/${edition}/${browser}/manifest_overrides.json`
        ],
        dest: outputDir + 'manifest.json',
        fields: ['name', 'version', 'description', 'permissions', 'optional_permissions', 'storage']
      }
    },
    webpack: {
      options: webpackOptions,
      prod: webpackConfig,
      dev: Object.assign({ watch: true }, webpackConfig)
    },
    concurrent: {
      dev: {
        tasks: ['watch:other_assets', 'webpack:dev'],
        options: {
          logConcurrentOutput: true
        }
      }
    },
    watch: {
      other_assets: {
        files: [
          'src/*.{html,png,json}',
          'editions/**'
        ],
        tasks: ['build_other'],
        options: {
          spawn: false
        }
      }
    },
    zip: {
      'extension': {
        cwd: outputDir,
        src: outputDir + '*',
        dest: zipPath
      }
    }
  };

  grunt.initConfig(config);

  grunt.loadNpmTasks('grunt-webpack');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-update-json');
  grunt.loadNpmTasks('grunt-zip');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.registerTask('build_other', ['copy', 'update_json']);

  grunt.registerTask('build_dist', ['clean', 'build_other', 'webpack:prod', 'zip:extension']);

  grunt.registerTask('default', ['clean', 'build_other', 'concurrent:dev']);
};
