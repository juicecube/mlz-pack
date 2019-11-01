import path from 'path';
import merge from 'lodash.merge';

import { WebpackConfig } from '../types';
import { filter } from '../utils';

class Config {
  private config:WebpackConfig = {
    isDev: process.env.NODE_ENV !== 'production',
    rootPath: process.cwd(),
    entryPath: { index: path.resolve(process.cwd(), 'src/index.tsx') },
    buildPath: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
    devServer: {
      port: '8080',
    },
    cssScopeName: '[path][name]__[local]',
    analyzePlugin: false,
    htmlPlugin: {
      filename: 'index.html',
      template: path.resolve(process.cwd(), 'src/index.ejs'),
    },
  };

  public init(param?:Partial<WebpackConfig>) {
    this.config.cssScopeName = this.config.isDev ? this.config.cssScopeName : '[name]__[hash:base64:5]';
    if (param) {
      const temp_config = filter(param, (value) => value !== undefined);
      merge(this.config, temp_config);
    }
  }

  public get() : WebpackConfig {
    return this.config;
  }
}

export const config = new Config();