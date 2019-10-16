import { BaseConfig, Env } from './types';
import { config } from './config';
import { mlzBuilder } from './builder';

class Init {
  // TODO option传参是mlz-pack.json或mlz-pack.js的地址
  static run (env:Env, option?:any) {
    console.log(env);
    // 通过env执行不同的build 功能集成在builder.ts (方便管理依赖)

    // 初始化编译配置文件的config
    config.init(option);
    
    mlzBuilder.run(env);

    // oldVersion
    // const builderOptions:BaseConfig = config.getConfig();
    // if (env === 'dev') {
    //   const baseConfig = Builder.createBaseConfig('dev', builderOptions);
    //   const devConfig:BaseConfig = Builder.createDevConfig(baseConfig, builderOptions);
    //   console.log('开始开发环境构建', devConfig);
    //   Server(devConfig, builderOptions.port || '8080');
    // } else if (env === 'prod') {
    //   console.log('Base:');
    //   const baseConfig = Builder.createBaseConfig('prod', builderOptions);
    //   console.log('Base:', baseConfig);
    //   const prodConfig:BaseConfig = Builder.createProdConfig(baseConfig, builderOptions);
    //   console.log('开始生产环境构建', prodConfig);
    //   webpack(prodConfig, (err, stats) => {
    //     if (err) {
    //       console.log(err);
    //       process.exit(2);
    //     }
    //     console.log(stats && stats.toString({
    //       chunks: false,
    //       colors: true,
    //       children: false,
    //     }));
    //   });
    // }
  }
}

export default Init;