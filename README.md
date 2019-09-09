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
读取项目根目录下的mlz-pack.json或者mlz-pack.js，定制化配置  
可以通过 mlz-pack --init 初始化配置文件
```js
{
  // 开发服务端口号 
  "port": 9000,
  // 是否开启px转化rem
  "usePx2rem": false,
  // 是否是多页应用，默认为单页应用
  "multipage": false,
  // 静态资源cdn地址
  "cdnPath": "https://static-k12edu.codemao.cn/mlz_teacher/build/",
  // 打包输出目录
  "outputDir": "./dist",
  // 速度分析
  "speed-analysis": false,
  // 体积分析
  "volume-analysis": false
  ...
}
```
### 5⃣️ 使用方式（命令行工具）
本地安装
```
npm i mlz-pack --save-dev
```
package.json
```js
{
  "scripts": {
    "dev": "mlz-pack dev",
    "build": "mlz-pack build"
    ...
  }
}
```

