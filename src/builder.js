const { build, serve, eject } = require('./webpack');
const config = require('./config');

class Builder {
  // TODO 根据不同的配置选择打包工具
  build(env) {
    this.startWebpackBuilder(env);
  }

  serve() {
    this.startWebpackDevServer();
  }

  eject() {
    eject();
  }

  // webpack打包
  startWebpackBuilder(env) {
    const cfg = config.get().webpack;
    build({ isDev: env === 'dev', ...cfg });
  }

  // 启动webpack-dev-server
  startWebpackDevServer() {
    const cfg = config.get().webpack;
    serve({ ...cfg, isDev: true });
  }
}

module.exports = new Builder();