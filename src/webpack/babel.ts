import { config as configs } from './config';

export const getBabelConfig = () => {
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
      require.resolve('@babel/preset-typescript'), // ts
    ],
    'plugins': [
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
      [require.resolve('@babel/plugin-proposal-class-properties')],
    ],
  };
  return babelCfg;
};