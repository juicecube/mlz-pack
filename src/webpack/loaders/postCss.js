const configs = require('../config');

module.exports = () => {
  const config = configs.get();
  // 配置有plugin、全量覆盖
  if (config.postCssPlugins) {
    options.plugins = config.postCssPlugins.map((plugin) => require(plugin.name)(plugin.options || {}));
    return options;
  }
  // 未配置plugin情况
  const options = {};
  if (config.pxtorem) {
    options.plugins.push(pxtorem(config.pxtorem));
  }
  // 正式环境添加autoprefixer
  if (!config.isDev) {
    options.plugins.push(autoprefixer());
  }
  return {
    postcssOptions: options,
  };
};
