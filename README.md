# mlz-pack | 内置webpack的依赖处理的打包工具

[![CircleCI](https://travis-ci.org/juicecube/mlz-pack.svg?branch=master)](https://travis-ci.org/juicecube/mlz-pack)

## 安装

本地项目安装

由于内含mozjpeg-bin，optipng-bin两个binary包，需要.npmrc中添加以下配置，直接安装很大几率安装不成功。

```
mozjpeg_binary_site=https://npm.taobao.org/mirrors/mozjpeg-bin
optipng_binary_site=https://npm.taobao.org/mirrors/optipng-bin
```
```
npm i @mlz/pack -D
```

## 使用

支持serve和build两种命令，server用于本地开发，build用于代码构建。

package.json
```js
{
  "scripts": {
    "start": "mlz-pack serve",
    "build": "mlz-pack build"
    ...
  }
}
```
serve命令的使用

```
Usage: mlz-pack serve [options] [entry]

serve your project in development mode

Options:
  -p, --port <port>  port used by the server (default: 8080)
  -h, --help         output usage information
```

build命令的使用

```
Usage: mlz-pack build [options] [entry]

build your project from a entry file(.js||.ts||.tsx), default: src/index.tsx

Options:
  -e, --env <environment>  dev or prod（default: prod）
  -d, --dest <dest>        output directory (default: build)
  -h, --help               output usage information
```



## 自定义配置

读取项目根目录下的*mlz-pack.js*

*Tips:*

开启热加载需要在入口文件加入以下代码：

```
if(module.hot){
  module.hot.accept()
}
```

### webpack配置

| Name 	| Type 	| Default 	| Description 	|
|:-------------------------------------:	|:--------------------------------------------:	|:---------------------------------------------------------------------------------:	|:---------------------------------------------------------------------------------------------------:	|
| **[`rootPath`](#rootPath)** 	| `{string}` 	| `process.cwd()` 	| 项目的根目录 	|
| **[`entryPath`](#entryPath)** 	| `{string \| string[] \| Entry \| EntryFunc}` 	| `{ index: path.resolve(process.cwd(), 'src/index.tsx') }` 	| 入口文件（webpack的entry） 	|
| **[`buildPath`](#buildPath)** 	| `{string}` 	| `build` 	| build文件 	|
| **[`publicPath`](#publicPath)** 	| `{string}` 	| `\/` 	| js,css,图片等资源前缀 	|
| **[`tsconfig`](#tsconfig)** 	| `{string}` 	| `undefined` 	| tsconfig路径（可选） 	|
| **[`devServer`](#devServer)** 	| `{port:string;open:boolean;}` 	| `{port: 8080, open: true}` 	| dev-server相关配置 	|
| **[`pxtorem`](#pxtorem)** 	| `Object` 	| `undefined` 	| 是否开启px转rem，还有相关配置 	|
| **[`cssScopeName`](#cssScopeName)** 	| `{string}` 	| `[local]__[hash:base64:5] | [path][name]__[local]` 	| css的className编译规则，默认：dev环境是`[path][name]__[local]`，正式环境是`[name]__[hash:base64:5]` 	|
| **[`alias`](#alias)** 	| `{[key:string]:string}` 	| `undefined` 	| 别名，可不填，默认会读tsconfig里的paths 	|
| **[`definePlugin`](#definePlugin)** 	| `{[key:string]:any}` 	| `undefined` 	| 全局变量 	|
| **[`analyzePlugin`](#analyzePlugin)** 	| `boolean` 	| `false` 	| 是否开启bundle分析 	|
| **[`htmlPlugin`](#htmlPlugin)** 	| `Object` 	| `{filename: 'index.html',template: path.resolve(process.cwd(), 'src/index.ejs')}` 	| htmlplugin的参数设置 	|
| **[`libs`](#libs)** 	| {[key:string]:string[]} 	| `undefined` 	| 用于单独切分第三方依赖的bundle的配置 	|
| **[`loaderOptions`](#loaderOptions)** 	| `RuleSetRule[]` 	| `undefined` 	| loader扩展 	|
| **[`pluginOptions`](#pluginOptions)** 	| `any[]` 	| `undefined` 	| plugin扩展 	|
| **[`babel`](#babel)** 	| `any` 	| `undefined` 	| babel扩展 	|

### `url`
```ts
// mlz-config.js
module.exports = {
  webpack: {
    // 根目录地址，默认：process.cwd()
    rootPath:string;
    // 入口文件，默认：{ index: path.resolve(process.cwd(), 'src/index.tsx') }
    entryPath:string | string[] | Entry | EntryFunc;
    // build文件夹，默认：'build'
    buildPath:string;
    // js，css，图片等资源文件前缀，默认：'/'
    publicPath:string;
    // tsconfig的路径
    tsconfig?:string;
    // 开发环境server的端口号
    devServer:{
      port:string;
      open:boolean;
    },
    // 是否开启px转rem，并且具体配置
    pxtorem?:{
      rootValue?:number;
      propList?:string[];
      selectorBlackList?:string[];
      replace?:boolean;
      minPixelValue?:number;
    };
    // css的className编译规则，默认：dev环境是[path][name]__[local]，正式环境是[name]__[hash:base64:5]
    cssScopeName:string,
    // 用于单独切分第三方依赖的bundle，例如：libs: { vender: ['react', 'react-dom']}就会将react和react-dom两个包单独打包成一个bundle
    libs?:{[key:string]:string[]};
    // 别名，可不填，默认会读tsconfig里的paths
    alias?:{[key:string]:string};
    // 全局变量
    definePlugin?:{[key:string]:any};
    // 是否开启bundle分析
    analyzePlugin?:boolean;
    // htmlPlugin相关配置
    htmlPlugin:{
      template?:string;
      favicon?:string;
      filename?:string;
      [key:string]:any;
    };
    // loader扩展
    loaderOptions?:RuleSetRule[];
    // plugin扩展
    pluginOptions?:any[];
    // babel扩展
    babel?:any;
  }
};
```


### TODO
1.定制化配置: 可以通过 mlz-pack --init 初始化配置文件