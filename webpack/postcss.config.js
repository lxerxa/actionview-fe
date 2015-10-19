export default [
  require('postcss-import')(),
  require('postcss-url')(),
  require('precss')(),
  require('autoprefixer')({ browsers: ['last 2 versions'] })
];
