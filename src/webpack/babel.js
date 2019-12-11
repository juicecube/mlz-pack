const configs = require('./config');
const merge = require('@mlz/babel-merge');
const path = require('path');

module.exports = () => {
  const config = configs.get();
  let babelCfg = {
    cacheDirectory: true,
    cacheCompression: false,
    'presets': [
      [
        '@babel/preset-env',
        {
          'modules': false,
          useBuiltIns: "usage",
          corejs: 3,
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript', // ts
    ],
    'plugins': [
      ['import', {
        'libraryName': 'antd',
        'style': 'css',
      }],
      ['react-css-modules', {
        'generateScopedName': config.cssScopeName,
        handleMissingStyleName: "warn",
        webpackHotModuleReloading: true,
        'filetypes': {
          '.scss': {
            'syntax': 'postcss-scss',
            "plugins": [
              [
                "postcss-import-sync2",
                {
                  resolve: function(id, basedir) {
                    let nextId = id;
                    return path.resolve(basedir, nextId);
                  }
                }
              ],
            ],
          },
        },
      }],
      [
        '@babel/plugin-transform-runtime',
        {
          'corejs': false,
          'helpers': true,
          'regenerator': true,
          'useESModules': false,
        },
      ],
      ['@babel/plugin-proposal-decorators', { 'legacy': true }],
      ["@babel/plugin-proposal-class-properties", { "loose" : true }],
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-optional-chaining',
      '@babel/plugin-proposal-nullish-coalescing-operator',
      'const-enum',
    ],
  };
  if (config.babel) {
    babelCfg = merge(babelCfg, config.babel);
  }
  return babelCfg;
};