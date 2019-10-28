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

export type Env = 'dev' | 'prod';