## 配置文件思路

由于整体此打包工具设计的思路是：

支持多种打包工具处理依赖，默认使用webpack进行打包。

默认将webpack最佳实践的文件处理内置到打包工具内，允许用户在现有内置的loader和plugin的基础上进行部分的配置。

配置文件总体分两类：

### 项目的配置文件
项目的配置文件指的是对外暴露的一些可配置的配置，具体的思路是：

- 确认使用哪种打包方式
- 根据打包方式的不同暴露不同的config

由于当前打包工具只内置了webpack，所以对外暴露的可配置的选项有：
```ts
export type WebpackConfig = {
  isDev:boolean;
  rootPath:string;
  entryPath:string | string[] | Entry | EntryFunc;
  buildPath:string;
  publicPath:string;
  devServer:{
    port:string;
  },
  output: {
    filename:string,
    chunkFilename:string,
    pathinfo:boolean,
    ...
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
  pluginOptions?:any[]
};
```

