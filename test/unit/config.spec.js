
const path = require('path');
const config = require('../../src/config');

describe('baseConfig', () => {
  it('get initial config', () => {
    expect(config.get()).toStrictEqual({
      webpack: {},
    });
  });

  it('init config', () => {
    config.clear();
    config.init({
      webpack: {
        rootPath: __dirname,
      }
    });
    expect(config.get()).toStrictEqual({
      webpack: {
        entry: 'index.ts',
        rootPath: __dirname,
      }
    });
  });
  
  it('init config file path', () => {
    config.clear();
    config.init(path.resolve(__dirname, '../../mlz-pack.js'));
    expect(config.get()).toStrictEqual({
      webpack: {
        entry: 'index.ts',
      }
    });
  });

  it('init config noting', async () => {
    // config with noting
    config.clear();
    await expect(config.get()).toStrictEqual({
      webpack: {}
    });
    config.init();
    await expect(config.get()).toStrictEqual({
      webpack: {
        rootPath: path.dirname(path.join(__dirname, '../../mlz-pack.js')),
        entry: 'index.ts',
      }
    });
  });

});