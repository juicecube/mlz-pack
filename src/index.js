const config = require('./config');
const mlzBuilder = require('./builder');

// 入口文件，提供api调用的方式
class Pack {
  // 打包
  static build(env, option) {
    // 通过env执行不同的build 功能集成在builder.ts (方便管理依赖)
    // 初始化编译配置文件的config
    config.init(option);
    mlzBuilder.build(env);
  }

  // 起开发环境服务
  static serve(option) {
    config.init(option);
    mlzBuilder.serve();
  }

  // 导出webpack配置
  static eject() {
    mlzBuilder.eject();
  }
}

module.exports = Pack;
