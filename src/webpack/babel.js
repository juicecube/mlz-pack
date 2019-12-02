const configs = require('./config');
const merge = require('babel-merge');

module.exports = () => {
  const config = configs.get();
  let babelCfg = {
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
        'filetypes': {
          '.scss': {
            'syntax': 'postcss-scss',
          },
        },
      }],
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