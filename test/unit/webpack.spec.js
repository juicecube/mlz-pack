const path = require('path');

const config = require('../../src/webpack/config');

describe('Webpack', () => {
  it('config', () => {
    expect(config.get()).toEqual({
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
    });
  });
});