#!/usr/bin/env node

import { Command } from 'commander';
import { genDiff, formatByStylish, compareObjects } from '../src/index.js';

const program = new Command();

program.name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .option('-f, --format <type>', 'output format', 'stylish')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    const { format } = program.opts();
    const diff = genDiff(filepath1, filepath2, format);
    console.log(diff);
  });

program.parse();
