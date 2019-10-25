const path = require('path');

export type WebpackConfig = {
  isDev:boolean;
  rootPath:string;
  entryPath:string[];
  buildPath:string;
  publicPath:string;
  devServer:{
    port:string;
  },
  htmlPlugin:{
    template?:string;
    favicon?:string;
    filename?:string;
    options?:{[key:string]:any};
  },
  analyze:boolean;
  cssScopeName:string,
  libs:{[key:string]:string[]};
  alias?:{[key:string]:string};
  definePlugin?:{[key:string]:any};
  pxToRemPlugin?:{
    rootValue?:number;
    blacklist?:string[];
  };
};

class Config {
  private config:WebpackConfig = {
    isDev: process.env.NODE_ENV !== 'production',
    devServer: {
      port: '8080',
    },
    rootPath: '',
    entryPath: [''],
    htmlPlugin: {
      filename: 'index.html',
      options: {},
    },
    buildPath: '',
    publicPath: '/',
    analyze: false,
    cssScopeName: '[path][name]__[local]',
    libs: {
      vender: [],
    },
  };

  public init(param?:Partial<WebpackConfig>) {
    this.config.rootPath = process.cwd();
    this.config.entryPath = [path.join(this.config.rootPath, 'src/index.tsx')];
    this.config.buildPath = path.join(this.config.rootPath, 'build');
    this.config.cssScopeName = this.config.isDev ? '[path][name]__[local]' : '[name]__[hash:base64:5]';
    if (param) {
      Object.assign(this.config, param);
    }
  }

  public get() : WebpackConfig {
    return this.config;
  }
}

export const config = new Config();