const path = require('path');
const merge = require('@mlz/babel-merge');
const pathsTsconfig = require('tsconfig-paths');
const genericNames = require('generic-names');

const configs = require('../config');

module.exports = () => {
  const config = configs.get();
  // 读取tsconfig中的path和config中的alias来生成alias数组，以供module-resolver和postcss-import做地址转换
  const tsconfigPath = config.tsconfig || path.resolve(process.cwd(), 'tsconfig.json');
  const alias = config.alias;
  try {
    const result = pathsTsconfig.loadConfig(tsconfigPath);
    if (result.resultType === 'success' && result.paths) {
      const paths = result.paths;
      Object.keys(paths).forEach((item) => {
        const key = item.replace('/*', '');
        const value = path.resolve(result.absoluteBaseUrl, paths[item][0].replace('/*', '').replace('*', ''));
        alias[key] = value;
      });
    }
  } catch(e) {
    console.log(e);
  }

  let babelCfg = {
    cacheDirectory: false,
    cacheCompression: false,
    'presets': [
      [
        '@babel/preset-env',
        {
          'modules': false,
          // useBuiltIns: "usage",
          // corejs: 3,
        },
      ],
      '@babel/preset-react',
      '@babel/preset-typescript', // ts
    ],
    'plugins': [
      ['import', {
        'libraryName': 'antd',
        'style': 'css',
      }, 'antd'],
      ['import', {
        'libraryName': '@mlz/doraemon',
        'camel2DashComponentName': false,
      }, 'doraemon'],
      ['module-resolver', {
        'extensions': ['.js', '.jsx', '.mjs', '.ts', '.tsx', '.css', '.scss'],
        'alias': alias,
      }],
      ['react-css-modules', {
        'generateScopedName': genericNames(config.cssScopeName),
        webpackHotModuleReloading: true,
        handleMissingStyleName: 'warn',
        'filetypes': {
          '.scss': {
            'syntax': 'postcss-scss',
            'plugins': [
              [
                'postcss-import-sync2',
                {
                  resolve: function(id, basedir) {
                    const nextId = id;
                    const keys = Object.keys(alias);
                    const key = id.split('/')[0];
                    if (keys.find((item) => item === key)) {
                      return path.resolve(alias[key], id.replace(key, '.'));
                    }
                    return path.resolve(basedir, nextId);
                  },
                },
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
      ['@babel/plugin-proposal-class-properties', { 'loose': false }],
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
