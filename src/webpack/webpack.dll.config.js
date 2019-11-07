const path = require('path');
const webpack = require('webpack');

// TODO fix dll
module.exports = () => {
  return {
    // entry: {
    //   vender: [
    //     ...config.get().libs.vender,
    //   ],
    // },
    mode: 'development',
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
