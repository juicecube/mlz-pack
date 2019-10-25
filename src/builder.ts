import { Env } from './types';
import { build, WebpackConfig, serve } from './webpack';
import { config } from './config';
import { filter } from './utils';

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
    console.log(cfg);
    serve(cfg);
  }

  private getWebpackBaseConfig(env:Env) {
    const baseConfig = config.get();
    const baseWebpackConfig:Partial<WebpackConfig> = {
      isDev: env !== 'prod',
      rootPath: baseConfig.baseUrl,
      entryPath: baseConfig.entry,
      htmlPlugin: baseConfig.html,
      alias: baseConfig.alias,
      definePlugin: baseConfig.globalVariable,
      pxToRemPlugin: baseConfig.pxToRem,
      analyze: baseConfig.analyze,
      libs: baseConfig.libs,
      buildPath: baseConfig.buildPath,
      devServer: baseConfig.port ? {
        port: baseConfig.port,
      } : undefined,
    };
    const valueConfig = filter(baseWebpackConfig, (item) => item !== undefined);

    return valueConfig;
  }
}

export const mlzBuilder = new Builder();