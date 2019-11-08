const devConfig = require('./webpack/dev.config');
const prodConfig = require('./webpack/product.config');

const webpackConfig = process.env.NODE_ENV === 'development' ? devConfig() : prodConfig();

module.exports = webpackConfig;