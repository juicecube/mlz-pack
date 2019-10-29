import { Env } from './types';
import { build, serve } from './webpack';
import { config } from './config';
import { WebpackConfig } from './types';

class Builder {
  // TODO 根据不同的配置选择打包工具
  public build(env:Env) {
    console.log(env);
    this.startWebpackBuilder(env);
  }

  public serve() {
    this.startWebpackDevServer();
  }

  // webpack打包
  private startWebpackBuilder(env:Env) {
    const cfg = this.getWebpackBaseConfig(env);
    build(cfg);
  }

  // 启动webpack-dev-server
  private startWebpackDevServer() {
    const cfg = this.getWebpackBaseConfig('dev');
    serve(cfg);
  }

  private getWebpackBaseConfig(env:Env) {
    const baseConfig = config.get();
    console.log(baseConfig);
    const baseWebpackConfig:Partial<WebpackConfig> = {
      isDev: env !== 'prod',
      ...baseConfig.webpack,
    };

    return baseWebpackConfig;
  }
}

export const mlzBuilder = new Builder();