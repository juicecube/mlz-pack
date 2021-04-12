import { RuleSetRule, Entry, EntryFunc } from 'webpack';

export interface BaseConfig {
  [propName:string]:any;
}
export interface DeepCopyData {
  [propName:string]:any;
}

export type WebpackConfig = {
  isDev:boolean;
  rootPath:string;
  entryPath:string | string[] | Entry | EntryFunc;
  buildPath:string;
  publicPath:string;
  devServer:{
    port:string;
  },
  pxtorem?:{
    rootValue?:number;
    propList?:string[];
    selectorBlackList?:string[];
    replace?:boolean;
    minPixelValue?:number;
  };
  cssScopeName:string,
  libs?:{[key:string]:string[]};
  alias?:{[key:string]:string};
  definePlugin?:{[key:string]:any};
  analyzePlugin?:boolean;
  htmlPlugin:{
    template?:string;
    favicon?:string;
    filename?:string;
    [key:string]:any;
  },
  loaderOptions?:RuleSetRule[];
  pluginOptions?:any[];
  externals?:{[key:string]:string};
};

export type Env = 'dev' | 'prod';