const path = require('path');
const webpack = require('webpack');

import { config } from './config';

// TODO fix dll
export const dllCfg = () => {
  return {
    // entry: {
    //   vender: [
    //     ...config.get().libs.vender,
    //   ],
    // },
    mode: 'development' as 'development',
    output: {
      path: path.resolve(__dirname, 'dll'),
      filename: '[name].dll.js',
      library: '[name]_[hash]',
    },
    plugins: [
      new webpack.DllPlugin({
        path: path.resolve(__dirname, 'dll/[name]-manifest.json'),
        name: '[name]_[hash]',
      }),
    ],
  };
};
