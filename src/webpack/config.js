const path = require('path');
const merge = require('lodash.merge');
const fs = require('fs');

class Config {
  constructor() {
    this.config = this.getInitialVal();
  }

  getInitialVal() {
    return {
      isDev: process.env.NODE_ENV !== 'production',
      loading: {
        html: fs.readFileSync(path.join(__dirname, './loading/index.html')),
        css: '<style>' + fs.readFileSync(path.join(__dirname, './loading/index.css')) + '</style>',
      },
      rootPath: process.cwd(),
      entryPath: { index: path.resolve(process.cwd(), 'src/index.tsx') },
      buildPath: path.resolve(process.cwd(), 'build'),
      publicPath: '/',
      devServer: {
        port: '8080',
        open: true,
      },
      cssScopeName: '[path][name]__[local]',
      analyzePlugin: false,
      htmlPlugin: {
        filename: 'index.html',
        template: path.resolve(process.cwd(), 'src/index.ejs'),
      },
    } 
  }
  
  init(param) {
    this.config.cssScopeName = this.config.isDev ? this.config.cssScopeName : '[name]__[hash:base64:5]';
    if (param) {
      const tempConfig = this.filter(param, (value) => value !== undefined);
      merge(this.config, tempConfig);
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