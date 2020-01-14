├── bin                        // command line入口
│   └── mlz-pack
├── jest.config.js             // 单元测试配置
├── package-lock.json
├── package.json
├── src                        // 源码
│   ├── builder.js             // 打包器（暂时内置webpack，后续加入其他打包工具）
│   ├── config.js              // 读取用户本地的mlz-pack.js，初始化配置
│   ├── index.js               // pack的入口文件，提供build, serve, eject方法（支持api调用）
│   ├── mlz-pack.js            // cli命令的注册
│   ├── utils.js               // 工具函数文件
│   └── webpack                // webpack打包等相关配置
│       ├── babel.js           // babel配置
│       ├── common.config.js   // 开发环境和正式环境都会用到的一些配置
│       ├── config.js          // webpack配置的默认配置文件
│       ├── dev.config.js      // 开发环境独有的配置
│       ├── devServer.js       // 开发环境webpack-dev-server配置
│       ├── happy.js           // happypack配置（暂时没用，会引起各种副作用）
│       ├── index.js           // webpack对外的接口文件
│       ├── loading            // 默认的页面的loading设置
│       │   ├── index.css
│       │   └── index.html
│       ├── product.config.js  // 正式环境配置
│       └── webpack.config.temp// eject出去的入口webpack配置 
├── test                       // 单元测试和冒烟测试 