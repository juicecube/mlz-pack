const configs = require('../config');

module.exports = () => {
  const config = configs.get();
  if (config.isDev) {
    return;
  }
  const options = {};
  // 配置有plugin、全量覆盖
  if (config.postCssPlugins) {
    options.plugins = config.postCssPlugins.map((plugin) => require(plugin.name)(plugin.options || {}));
    return options;
  }
  const plugins = [autoprefixer()];
  if (config.pxtorem) {
    plugins.push(pxtorem(config.pxtorem));
  }
  options.plugins = plugins;
  return options;
};