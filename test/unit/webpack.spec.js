const merge = require('lodash.merge');

const config = require('../../src/webpack/config');

describe('Webpack', () => {
  const initialWebpackConfig = config.getInitialVal();
  describe('config', () => {
    it('get config', () => {
      expect(config.get()).toEqual(initialWebpackConfig);
    });

    it('filter', () => {
      expect(config.filter({ a: 2, b: 1 }, (item) => item === 1)).toEqual({ b: 1 });
    });

    it('init empty config', () => {
      config.init({});
      expect(config.get()).toEqual(initialWebpackConfig);
    });

    it('init undefined config', () => {
      config.init({ isDev: undefined, rootPath: undefined });
      expect(config.get()).toEqual(initialWebpackConfig);
    });

    it('init with valuable config', () => {
      const initValue = {
        isDev: false,
        publicPath: undefined,
        devServer: {
          port: '8081',
        },
      };
      config.init(initValue);
      expect(config.get()).toEqual(merge(initialWebpackConfig, {
        isDev: false,
        cssScopeName: '[local]__[hash:base64:5]',
        devServer: {
          port: '8081',
        },
      }));
    });

  });
});
