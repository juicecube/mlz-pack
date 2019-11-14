const path = require('path');
const merge = require('lodash.merge');

const config = require('../../src/webpack/config');

describe('Webpack', () => {
  const initialWebpackConfig = {
    isDev: process.env.NODE_ENV !== 'production',
    rootPath: process.cwd(),
    entryPath: { index: path.resolve(process.cwd(), 'src/index.tsx') },
    buildPath: path.resolve(process.cwd(), 'build'),
    publicPath: '/',
    devServer: {
      port: '8080',
      open: true,
    },
    cssScopeName: '[path][name]__[local]',
    analyzePlugin: false,
    htmlPlugin: {
      filename: 'index.html',
      template: path.resolve(process.cwd(), 'src/index.ejs'),
    },
  };
  describe('config', () => {
    // it('get config', () => {
    //   expect(config.get()).toEqual(initialWebpackConfig);
    // })

    it('filter', () => {
      expect(config.filter({a: 2, b: 1}, (item) => item === 1)).toEqual({b: 1});
    });

    it('init empty config', () => {
      config.init({});
      expect(config.get()).toEqual(initialWebpackConfig);
    });

    it('init undefined config', () => {
      config.init({isDev: undefined, rootPath: undefined});
      expect(config.get()).toEqual(initialWebpackConfig);
    });

    it('init with valuable config', () => {
      const initValue = {
        isDev: false,
        publicPath: undefined,
        devServer: {
          port: '8081',
        }
      };
      config.init(initValue)
      expect(config.get()).toEqual(merge(initialWebpackConfig, {
        isDev: false,
        devServer: {
          port: '8081',
        }
      }));
    });

  });
});