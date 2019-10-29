const path = require('path');

module.exports = {
  webpack: {
    "rootPath": __dirname,
    "entryPath": {index: path.join(__dirname, './src/index.ts')},
    devServer: {
      port: 4000,
    },
    alias: {
      src: path.join(__dirname, 'src'),
    },
    definePlugin: {
      Debug: false
    },
    analyzePlugin: false,
    htmlPlugin: {
      template: path.join(__dirname, 'src/index.html'),
    }
  }
}