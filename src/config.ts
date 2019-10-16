import path from 'path';

import { getPath } from './utils';

class Config {
  private config = {
    baseUrl: process.cwd(),
    entry: [],
  };
  private jsonConfigName = 'mlz-pack.json';
  private jsConfigName = 'mlz-pack.js';

  public init(filePath?:string) {
    // 有传入mlz-pack配置的地址
    if (filePath) {
      const subConfig = import(filePath);
      Object.assign(this.config, subConfig);
      return;
    }

    // 没有传入时
    const jsonPath = getPath(this.jsonConfigName);
    const jsPath = getPath(this.jsConfigName);
    console.log('jsPath', jsPath);
    let subConfig = {};
    let rootPath = process.cwd(); // 项目根目录
    if (jsonPath) {
      rootPath = path.dirname(jsonPath);
      subConfig = require(jsonPath);
    } else if (jsPath) {
      rootPath = path.dirname(jsonPath);
      subConfig = require(jsPath);
      console.log('subConfig', subConfig);
    }
    // 如果配置中存在根目录就使用，不存在就使用mlz-pack.json或者mlz-pack.js所在的目录为根目录
    Object.assign(this.config, { baseUrl: rootPath }, subConfig);
  }

  /**
   * @function getBuildConfig
   * @desc     Find builder type in mlz-pack.json
   */
  public get() {
    return this.config;
  }
}

export const config = new Config();