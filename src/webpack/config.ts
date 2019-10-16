const path = require('path');

export type WebpackConfig = {
  isDev:boolean,
  rootPath:string,
  entryPath:string[],
  htmlPath:string,
  buildPath:string,
  publicPath:string,
  debug:boolean,
  analyze:boolean,
  cssScopeName:string,
  libs: {[key:string]: string[]},
};

class Config {
  private config : WebpackConfig = {
    isDev: process.env.NODE_ENV !== 'production',
    rootPath: '',
    entryPath: [''],
    htmlPath: '',
    buildPath: '',
    publicPath: '/',
    debug: false,
    analyze: false,
    cssScopeName: '[name]__[hash:5]',
    libs: {
      vender: [],
    },
  };

  public init(param?:Partial<WebpackConfig>) {
    this.config.rootPath = process.cwd();
    this.config.buildPath = path.join(this.config.rootPath, 'build');
    this.config.cssScopeName = this.config.isDev ? '[name]__[local]' : '[name]__[hash:5]';
    if (param) {
      Object.assign(this.config, param);
    }
  }
  
  public get() : WebpackConfig {
    return this.config;
  }
}

export const config = new Config();