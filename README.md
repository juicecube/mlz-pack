## 技术方案
### 1⃣️ 通过不同的配置文件管理不同环境的配置
- 基本配置 webpack.base.config.js
- 开发配置 webpack.dev.config.js
- 生产配置 webpack.prod.config.js
- ssr配置 webpack.ssr.config.js  
...
### 2⃣️ 抽离成一个npm包统一管理
- 规范：git commit日志，README，tslint
- 质量：冒烟测试，单元测试，测试覆盖率，CI
### 3⃣️ 功能设计
#### 基本配置 webpack.base.config.js
- 资源解析
  - 解析es6
  - 解析react
  - 解析css
  - 解析sass
  - 解析图片
  - 解析字体
- 目录清理
- 命令行信息显示优化
- 错误捕获和处理
#### 开发配置 webpack.dev.config.js
- 代码热更新
  - css热更新
  - js热更新
- sourcemap
#### 生产配置 webpack.prod.config.js
- 代码压缩
- css inline
- 文件指纹
- tree-shaking
- scoped Hoisting
- 速度优化： 基础包cdn
- 体积优化： 代码分割
### 4⃣️ 定制化
- 单页/多页
- pc端/移动端
- ...
