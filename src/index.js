const program = require('commander');

program.version('0.0.1').usage('[command] [options]');

program.command('replace <dir>').action(dir => {
  console.log(dir);
});

program.command('extract <dir>').action(dir => {
  console.log(dir);
});

program.parse(process.argv);
