const path = require('path');

module.exports = {
  "baseUrl": __dirname,
  "entry": [path.join(__dirname, './src/index.ts')],
  html:{
    filename: 'index.html',
  },
  alias: {
    src: path.join(__dirname, 'src'),
  },
  globalVariable: {
    Debug: false
  },
  analyze: false,
  port: 5000,
}