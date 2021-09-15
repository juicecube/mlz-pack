const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
// ! 不支持webpack5
const SpeedMeasurePlugin = require('speed-measure-webpack5-plugin');
const ncp = require('ncp').ncp;

const devCfg = require('./dev.config.js');
const prodCfg = require('./product.config');
const config = require('./config');
const Server = require('./devServer');

/**
 * build
 * 获取webpack配置，并启动webpack进行打包
*/
function build(baseCfg, cb) {
  const webpackConfig = getWebpackConfig(baseCfg);
  const compiler = webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.log(err);
      process.exit(2);
    }
    console.log(stats && stats.toString({
      chunks: false,
      colors: true,
      children: false,
    }));
  });
  // 打包完成执行回调
  compiler.hooks.done.tap({ name: 'done' }, () => {
    cb && cb(compiler);
  });
}

/** 开启webpack-dev-deserver */
function serve(baseCfg, cb) {
  const webpackConfig = getWebpackConfig(baseCfg);
  Server(webpackConfig, { port: config.get().devServer.port }, cb);
}

// 获取webpack，通过从写的webpack配置和
function getWebpackConfig(baseCfg) {
  if (fs.existsSync(path.join(process.cwd(), 'webpack.config.js'))) {
    const configs = require(path.join(process.cwd(), 'webpack.config.js'));
    return configs;
  }
  config.init(baseCfg);
  let webpackConfig;
  // 打包速度分析工具
  const smp = new SpeedMeasurePlugin();
  if (!baseCfg.isDev) {
    // 正式环境
    webpackConfig = prodCfg();
  } else {
    // 开发环境
    webpackConfig = devCfg();
  }
  // ! 不支持webpack5
  webpackConfig = smp.wrap(webpackConfig);
  return webpackConfig;
}

/**
 * 导出webpack文件夹里面的webpack配置文件
 * 生成webpack入口文件
 */
function eject() {
  const sourcePath = __dirname; // 原地址
  const destPath = path.resolve(process.cwd(), 'webpack'); // 目标地址
  const tempFile = path.resolve(__dirname, 'webpack.config.temp'); // webpack入口文件模板
  const destWebpackConfig = path.resolve(process.cwd(), 'webpack.config.js'); // webpack入口文件地址
  const noEjectFiles = [ // 不需要导出的文件
    path.resolve(process.cwd(), 'webpack/webpack.config.temp'),
    path.resolve(process.cwd(), 'webpack/index.js'),
  ];

  // 拷贝文件夹到目标地址
  ncp(sourcePath, destPath, (err) => {
    if (err) {
      return console.error(err);
    }
    // 生成webpack入口文件
    fs.copyFile(tempFile, destWebpackConfig, (err) => {
      if (err) {throw err;}
      // 删除不需要的导出的文件
      for (let i = 0; i < noEjectFiles.length; i++) {
        fs.unlink(noEjectFiles[i], (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }
      console.log('Eject done!');
    });
  });
}

module.exports = { build, serve, eject };
