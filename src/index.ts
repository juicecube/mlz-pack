import { Env } from './types';
import { config, PackConfig } from './config';
import { mlzBuilder } from './builder';

class Init {
  static build (env:Env, option?:string|PackConfig) {
    // 通过env执行不同的build 功能集成在builder.ts (方便管理依赖)
    // 初始化编译配置文件的config
    config.init(option);
    mlzBuilder.build(env);
  }

  static serve(option?:any) {
    config.init(option);
    mlzBuilder.serve();
  }

  static eject() {
    mlzBuilder.eject();
  }
}

export default Init;