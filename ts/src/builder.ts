import { Env } from './types';
import { build, serve, eject } from './webpack';
import { config } from './config';

class Builder {
  // TODO 根据不同的配置选择打包工具
  public build(env:Env) {
    this.startWebpackBuilder(env);
  }

  public serve() {
    this.startWebpackDevServer();
  }

  public eject() {
    eject();
  }

  // webpack打包
  private startWebpackBuilder(env:Env) {
    const cfg = config.get().webpack;
    build({ isDev: env === 'dev', ...cfg });
  }

  // 启动webpack-dev-server
  private startWebpackDevServer() {
    const cfg = config.get().webpack;
    serve({ ...cfg, isDev: true });
  }
}

export const mlzBuilder = new Builder();