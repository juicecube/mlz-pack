## 技术方案
### 1⃣️ 抽离成一个npm包统一管理
- 规范：git commit日志，README，tslint
- 质量：冒烟测试，单元测试，测试覆盖率，CI
### 2⃣️ 功能设计
#### 基本配置 
- 资源解析
  - 解析es6
  - 解析ts
  - 解析react
  - 解析css
  - 解析sass
  - 解析图片
  - 解析字体
  - ...
- 目录清理
- 命令行信息显示优化
- 错误捕获和处理
- 多进程打包
- ...
#### 开发配置 
- 代码热更新
  - css热更新
  - js热更新
- sourcemap
- ...
#### 生产配置 
- 代码压缩
- 图片压缩
- css inline
- 文件指纹
- tree-shaking
- scoped Hoisting
- 速度优化：基础包cdn
- 体积优化：代码分割
- 打包分析
- 多进程压缩
- ...
### 4⃣️ 自定义配置
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
    },
    // loader扩展
    loaderOptions?:RuleSetRule[];
    // plugin扩展
    pluginOptions?:any[]
  }
};
```
TODO:
1.定制化配置: 可以通过 mlz-pack --init 初始化配置文件

### 5⃣️ 使用方式（命令行工具）
本地安装
```
npm i @mlz/pack --save-dev
```
package.json
```js
{
  "scripts": {
    "dev": "mlz-pack serve",
    "build": "mlz-pack build"
    ...
  }
}
```
支持的命令有：

本地安装后执行：mlz-pack即可看到

