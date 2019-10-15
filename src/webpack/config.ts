const path = require('path');

export type WebpackConfig = {
  IS_DEV:boolean,
  ROOT_PATH:string,
  SRC_PATH:string,
  BUILD_PATH:string,
  CDN_PATH:string,
  RUNTIME:Object,
  DEBUG:boolean,
  ANALYZE:boolean,
  CSS_SCOPED_NAME:string,
  libs: {
    vender:string[],
    cmaoVender:string[],
  },
  libraries:string[],
};

class Config {
  private config : WebpackConfig = {
    IS_DEV: process.env.NODE_ENV !== 'production',
    ROOT_PATH: path.resolve(__dirname, '..'),
    SRC_PATH: path.resolve(__dirname, '../src'),
    BUILD_PATH: path.resolve(__dirname, '../build'),
    CDN_PATH: '/',
    RUNTIME: {},
    DEBUG: false,
    ANALYZE: false,
    CSS_SCOPED_NAME: '[name]__[hash:5]',
    libs: {
      vender: [
        'react',
        'react-dom',
        'redux',
        'react-redux',
        'react-router',
        'react-router-dom',
      ],
      cmaoVender: [
        '@cmao',
      ],
    },
    libraries: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
      'react-router',
      'react-router-dom',
    ],
  };

  public init(param?:Partial<WebpackConfig>) {
    if (param) {
      Object.assign(this.config, param);
    } else {
      this.config.CSS_SCOPED_NAME = this.config.IS_DEV ? '[name]__[local]' : '[name]__[hash:5]';
    }
  }
  
  public get() : WebpackConfig {
    return this.config;
  }
}

export const config = new Config();