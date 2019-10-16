import { BaseConfig, Env } from './types';
import { start } from './webpack'
import { config } from './config';

class Builder {
  // TODO 根据不同的配置选择打包工具
  public run(env:Env) {
    console.log(env);
    this.startWebpackBuilder(env);
  }

  private startWebpackBuilder(env:Env) {
    const baseConfig = config.get();
    const baseWebpackConfig = {};
    start(env)
  }
}

export const mlzBuilder = new Builder();