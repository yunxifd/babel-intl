import program from 'commander';
const collect = (value, previousValue) => {
  if (typeof value !== 'string') return previousValue;
  const values = value.split(',');
  return previousValue ? previousValue.concat(values) : values;
};
program
  .version('0.0.1')
  .usage('[command] [options]')
  .option('--ignore [list]', 'list of glob paths to **not** compile', collect);

program.command('replace [dir]').action((dir, cmd) => {
  console.log('replace', dir, cmd);
});

program
  .command('extract [dir]')
  .option('-o,--out-file <filename>', 'set output into witch single file')
  .action((dir, cmd) => {
    console.log('extract', dir, cmd);
  });

program.parse(process.argv);
