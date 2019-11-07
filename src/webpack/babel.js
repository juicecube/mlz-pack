const configs = require('./config');

module.exports = () => {
  const config = configs.get();
  const babelCfg = {
    'presets': [
      [
        '@babel/preset-env',
        {
          'modules': false,
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
      [
        '@babel/plugin-transform-runtime',
        {
          'corejs': false,
          'helpers': true,
          'regenerator': true,
          'useESModules': false,
        },
      ],
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-proposal-class-properties',
    ],
  };
  return babelCfg;
};