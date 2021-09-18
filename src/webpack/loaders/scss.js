const configs = require('../config');
const getPostcss = require('./postCss');

module.exports = () => {
  const config = configs.get();

  return [
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: config.cssScopeName,
          // new
          context: process.cwd(),
        },
        importLoaders: 3,
        sourceMap: false,
      },
    },
    {
      loader: 'postcss-loader',
      options: getPostcss(),
    },
    {
      loader: 'sass-loader',
      options: {
        implementation: require('sass'),
      },
    },
  ];
};
