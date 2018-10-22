// import babel from '@babel/core';
// import glob from 'glob';
// import program from 'commander';
const program = require('commander');

program.version('0.0.1');

program.command('replace [dir]').action((dir, cmd) => {});

program
  .command('extract [dir]')
  .option('-o,--output <filename>', '指定输出到哪个文件')
  .action((dir, cmd) => {
    console.log(dir, cmd.output);
  });

program.parse(process.argv);
