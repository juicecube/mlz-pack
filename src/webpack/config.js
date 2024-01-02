const path = require('path');
const fs = require('fs');
const merge = require('lodash.merge');

class Config {
  constructor() {
    this.config = this.getInitialVal();
  }

  getInitialVal() {
    const isDev = process.env.NODE_ENV !== 'production';
    return {
      isDev,
      loading: {
        html: fs.readFileSync(path.join(__dirname, './loading/index.html')),
        css: `<style>${ fs.readFileSync(path.join(__dirname, './loading/index.css')) }</style>`,
      },
      alias: {
        root: process.cwd(),
        raf: path.resolve(process.cwd(), 'node_modules/raf/'),
      },
      target: 'web',
      dropConsole: true,
      rootPath: process.cwd(),
      entryPath: { index: path.resolve(process.cwd(), 'src/index.tsx') },
      buildPath: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
      assetsPublicPath: '/',
      devServer: {
        port: '8080',
        open: true,
      },
      svgr: false,
      cssScopeName: isDev ? '[path][name]__[local]' : '[local]__[hash:base64:5]',
      analyzePlugin: false,
      hardSourcePlugin: false,
      extraCssPlugin: true,
      imageminPlugin: true,
      htmlPlugin: {
        filename: 'index.html',
        template: path.resolve(process.cwd(), 'src/index.ejs'),
      },
      codeInspector: false,
    };
  }

  init(param) {
    if (param) {
      if (typeof param.isDev === 'boolean' && param.isDev !== this.config.isDev) {
        this.config.cssScopeName = param.isDev ? '[path][name]__[local]' : '[local]__[hash:base64:5]';
      }
      const tempConfig = this.filter(param, (value) => value !== undefined);
      merge(this.config, tempConfig);
      if (tempConfig.assetsPublicPath === undefined) {
        this.config.assetsPublicPath = this.config.publicPath;
      }
    }
  }

  get() {
    return this.config;
  }

  filter(obj, func) {
    const keys = Object.keys(obj);
    const newObj = {};
    keys.map((item) => {
      if (func(obj[item], item)) {
        newObj[item] = obj[item];
      }
    });
    return newObj;
  }
}
module.exports = new Config();
