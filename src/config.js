const path = require('path');
const merge = require('lodash.merge');

const { getPath } = require('./utils');

class Config {
  constructor() {
    this.config = {
      webpack: {},
    };
    this.jsonConfigName = 'mlz-pack.json';
    this.jsConfigName = 'mlz-pack.js';
  }
  
  

  init(configs) {
    let rootPath = process.cwd(); // 项目根目录
    // 有传入mlz-pack配置的地址
    if (configs && typeof configs === 'string') {
      const subConfigs = require(configs);
      merge(this.config, subConfigs);
      return;
    }

    // 没有传入config对象时
    const jsonPath = getPath(this.jsonConfigName);
    const jsPath = getPath(this.jsConfigName);
    let subConfig = {};
    if (jsonPath) {
      rootPath = path.dirname(jsonPath);
      subConfig = require(jsonPath);
    } else if (jsPath) {
      rootPath = path.dirname(jsPath);
      subConfig = require(jsPath);
    }
    // 如果配置中存在根目录就使用，不存在就使用mlz-pack.json或者mlz-pack.js所在的目录为根目录
    // 传入配置
    merge(this.config, { webpack: { rootPath }}, subConfig);
    if (configs) {
      merge(this.config, configs);
    }
  }

  clear() {
    this.config =  {
      webpack: {},
    };
  }

  /**
   * @function getBuildConfig
   * @desc     Find builder type in mlz-pack.json
   */
  get() {
    return this.config;
  }
}

module.exports = new Config();