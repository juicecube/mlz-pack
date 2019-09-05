import { BaseConfig } from './types';
import Config from './config';
import Builder from './builder';
import webpack from 'webpack';
import Server from './server';

class Init {
  static run (env:string) {
    const builderOptions:BaseConfig = Config.getBuildConfig();
    if (env === 'dev') {
      const devConfig:BaseConfig = Builder.createDevConfig(builderOptions);
      console.log('开始开发环境构建', devConfig);
      Server(devConfig);
    } else if (env === 'prod') {
      const prodConfig:BaseConfig = Builder.createProdConfig(builderOptions);
      console.log('开始生产环境构建', prodConfig);
      webpack(prodConfig, (err, stats) => {
        if (err) {
          console.log(err);
          process.exit(2);
        }
        console.log(stats && stats.toString({
          chunks: false,
          color: true,
          children: false,
        }));
      });
    }
  }
}

export default Init;