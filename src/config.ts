import fs from 'fs';
import path from 'path';

class Config {
  static jsonConfigName = 'mlz-pack.json';
  static jsConfigName = 'mlz-pack.js';
  static getPath(filename:string) : string {
    let currDir:string = process.cwd();

    while (!fs.existsSync(path.join(currDir, filename))) {
      currDir = path.join(currDir, '../');

      // unix跟目录为/， win32系统根目录为 C:\\格式的
      if (currDir === '/' || /^[a-zA-Z]:\\$/.test(currDir)) {
        return '';
      }
    }

    return currDir;
  }

  /**
     * @function getBuildConfig
     * @desc     Find builder type in feflow.json
     */
  static getBuildConfig() {
    let builderOptions;

    if (Config.getPath(this.jsonConfigName)) {
      const jsonConfigFile = path.join(Config.getPath(this.jsonConfigName), `./${this.jsonConfigName}`);
      const fileContent = fs.readFileSync(jsonConfigFile, 'utf-8');

      let mlzPackCfg;

      try {
        mlzPackCfg = JSON.parse(fileContent);
      } catch (ex) {
        console.error('请确保mlz-pack.json配置是一个Object类型，并且含有builderOptions字段');
      }

      builderOptions = mlzPackCfg.builderOptions;

      if (!builderOptions) {
        console.error('请确保mlz-pack.js配置包含builderOptions字段，且内容不为空');
        return {};
      }

      return builderOptions;
    } else if (Config.getPath(this.jsConfigName)) {
      const jsConfigFile = path.join(Config.getPath(this.jsConfigName), `./${this.jsConfigName}`);

      const mlzPackCfg = require(jsConfigFile);

      builderOptions = mlzPackCfg.builderOptions;

      if (!builderOptions) {
        console.error('请确保mlz-pack.js配置包含builderOptions字段，且内容不为空');
        return {};
      }
      return builderOptions;
    } else {
      console.error('未找到 mlz-pack 配置文件 mlz-pack.json 或者 mlz-pack.js');
      return {};
    }
  }
}

export default Config;