import { BaseConfig, Env } from './types';
import Config from './config';
import Builder from './builder';
import webpack from 'webpack';
import Server from './server';

class Init {
  static run (env:Env) {
    const builderOptions:BaseConfig = Config.getBuildConfig();
    if (env === 'dev') {
      const baseConfig = Builder.createBaseConfig('dev', builderOptions);
      const devConfig:BaseConfig = Builder.createDevConfig(baseConfig, builderOptions);
      console.log('开始开发环境构建', devConfig);
      Server(devConfig, builderOptions.port || '8080');
    } else if (env === 'prod') {
      const baseConfig = Builder.createBaseConfig('prod', builderOptions);
      const prodConfig:BaseConfig = Builder.createProdConfig(baseConfig, builderOptions);
      console.log('开始生产环境构建', prodConfig);
      webpack(prodConfig, (err, stats) => {
        if (err) {
          console.log(err);
          process.exit(2);
        }
        console.log(stats && stats.toString({
          chunks: false,
          colors: true,
          children: false,
        }));
      });
    }
  }
}

export default Init;