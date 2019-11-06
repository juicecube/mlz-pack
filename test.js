const BinWrapper = require('bin-wrapper');
const path = require('path');

const url = `https://npm.taobao.org/mirrors/optipng-bin/v6.0.0/vendor/`;

const bin = new BinWrapper()
	.src(`${url}macos/optipng`, 'darwin')
	.src(`${url}linux/x86/optipng`, 'linux', 'x86')
	.src(`${url}linux/x64/optipng`, 'linux', 'x64')
	.src(`${url}freebsd/x86/optipng`, 'freebsd', 'x86')
	.src(`${url}freebsd/x64/optipng`, 'freebsd', 'x64')
	.src(`${url}sunos/x86/optipng`, 'sunos', 'x86')
	.src(`${url}sunos/x64/optipng`, 'sunos', 'x64')
	.src(`${url}win/optipng.exe`, 'win32')
	.dest(path.resolve(__dirname, '../vendor'))
  .use(process.platform === 'win32' ? 'optipng.exe' : 'optipng');
  
(async () => {
  await bin.run(['--version']);
  console.log('optipng is working');
})();