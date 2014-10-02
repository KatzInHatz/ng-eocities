module.exports = {
  dist: 'dist',

  compile_dir: 'bin',

  demo: {
    dir: 'demoApp',
    index: 'demoApp/index.html'
  },

  app_files: {
    js: [
      'src/**/*.js',
      '!src/**/*.spec.js',
      'src/ngEocities.js'
      ],
    jsunit: ['./src/**/*.spec.js'],
    
    styles: [
      'src/**/*.styl'
    ]
  },

  vendor_files: {
    js: [
      '/angular/angular.js'
    ]
  }
};   
