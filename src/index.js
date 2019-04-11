const program = require('commander');
const extract = require('./extract');
const replace = require('./replace');
const restore = require('./restore');

program.version('0.0.1').usage('[command] [options]');

program.command('replace [dir]').action(dir => {
  replace(dir || process.cwd());
});

program.command('extract [dir]').action(dir => {
  extract(dir || process.cwd());
});
program.command('restore [dir]').action(dir => {
  restore(dir || process.cwd());
});

program.parse(process.argv);
