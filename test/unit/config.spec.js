const config = require('../../src/config');

describe('baseConfig', () => {
  it('get initial config', () => {
    expect(config.get()).toStrictEqual({
      webpack: {},
    });
  });

  it('init config with data', () => {
    config.init({
      webpack: {
        rootPath: __dirname,
      }
    });
    expect(config.get()).toStrictEqual({
      webpack: {
        rootPath: __dirname,
      }
    })
  });
});