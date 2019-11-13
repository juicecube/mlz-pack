const path = require('path');

process.chdir(path.join(__dirname, '../ts-example'));

const { build } = require('../../src/webpack/index');

build({
  isDev: true,
  entryPath: { index: path.resolve(__dirname, '../ts-example/index.tsx') },
  htmlPlugin: {
    template: path.resolve(__dirname, '../ts-example/index.html'),
  },
});
