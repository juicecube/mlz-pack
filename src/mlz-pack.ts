import program from 'commander';
import init from './index';
program
  .option('dev', '开发环境配置')
  .option('prod', '生产环境配置');

program.parse(process.argv);

if (program.dev) {
  init('dev');
}
if (program.prod) {
  init('prod');
}