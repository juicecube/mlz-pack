import { getPath } from './utils';

class Config {
  private config = {};
  private rootPath = '';
  private jsonConfigName = 'mlz-pack.json';
  private jsConfigName = 'mlz-pack.js';

  public init(filePath?:string) {
    // 有传入mlz-pack配置的地址
    if (filePath) {
      this.config = import(filePath);
      return;
    }

    // 没有传入时
    const jsonPath = getPath(this.jsonConfigName);
    const jsPath = getPath(this.jsConfigName);
    if (jsonPath) {
      this.config = import(jsonPath);
    } else if (jsonPath) {
      this.config = import(jsPath);
    }
  }

  /**
   * @function getBuildConfig
   * @desc     Find builder type in mlz-pack.json
   */
  public getConfig() {
    return this.config;
  }
}

export const config = new Config();