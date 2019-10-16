import { BaseConfig, Env } from './types';
import { start, WebpackConfig } from './webpack'
import { config } from './config';

class Builder {
  // TODO 根据不同的配置选择打包工具
  public run(env:Env) {
    console.log(env);
    this.startWebpackBuilder(env);
  }

  private startWebpackBuilder(env:Env) {
    const baseConfig = config.get();
    console.log(baseConfig);
    const baseWebpackConfig: Partial<WebpackConfig> = {
      isDev: env !== 'prod',
      rootPath: baseConfig.baseUrl,
      entryPath: baseConfig.entry,
    };
    console.log('baseConfig', baseWebpackConfig);
    start(env, baseWebpackConfig);
  }
}

export const mlzBuilder = new Builder();