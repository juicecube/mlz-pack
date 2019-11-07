const config = require('./config');
const mlzBuilder = require('./builder');

class Init {
  static build (env, option) {
    // 通过env执行不同的build 功能集成在builder.ts (方便管理依赖)
    // 初始化编译配置文件的config
    config.init(option);
    mlzBuilder.build(env);
  }

  static serve(option) {
    config.init(option);
    mlzBuilder.serve();
  }

  static eject() {
    mlzBuilder.eject();
  }
}

module.exports = Init;