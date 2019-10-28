import path from 'path';
import { RuleSetRule, Entry, EntryFunc } from 'webpack';

export type WebpackConfig = {
  isDev:boolean;
  rootPath:string;
  entryPath:string | string[] | Entry | EntryFunc;
  buildPath:string;
  publicPath:string;
  devServer:{
    port:string;
  },
  cssScopeName:string,
  libs?:{[key:string]:string[]};
  alias?:{[key:string]:string};
  definePlugin?:{[key:string]:any};
  analyzePlugin?:boolean;
  pxToRemPlugin?:{
    rootValue?:number;
    blacklist?:string[];
  };
  htmlPlugin:{
    template?:string;
    favicon?:string;
    filename?:string;
    [key:string]:any;
  },
  loaderOptions?:RuleSetRule[];
  pluginOptions?:any[]
};

class Config {
  private config:WebpackConfig = {
    isDev: process.env.NODE_ENV !== 'production',
    rootPath: process.cwd(),
    entryPath: { index: path.resolve(process.cwd(), 'src/index.tsx') },
    buildPath: 'build',
    publicPath: '/',
    devServer: {
      port: '8080',
    },
    cssScopeName: '[path][name]__[local]',
    analyzePlugin: false,
    htmlPlugin: {
      filename: 'index.html',
    },
  };

  public init(param?:Partial<WebpackConfig>) {
    this.config.cssScopeName = this.config.isDev ? this.config.cssScopeName : '[name]__[hash:base64:5]';
    if (param) {
      Object.assign(this.config, param);
    }
  }

  public get() : WebpackConfig {
    return this.config;
  }
}

export const config = new Config();