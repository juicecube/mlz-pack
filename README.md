### 使用方式（命令行工具）
本地安装

.npmrc中添加

```
mozjpeg_binary_site=https://npm.taobao.org/mirrors/mozjpeg-bin
optipng_binary_site=https://npm.taobao.org/mirrors/optipng-bin
```
```
npm i @mlz/pack -D
```
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
支持的命令有：

本地安装后执行：mlz-pack即可看到

Tips:
开启热加载需要在入口文件加入以下代码：
```
if(module.hot){
  module.hot.accept()
}
```

### 自定义配置
读取项目根目录下的mlz-pack.json或者mlz-pack.js
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
    // 开发环境server的端口号
    devServer:{
      port:string;
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
TODO:
1.定制化配置: 可以通过 mlz-pack --init 初始化配置文件