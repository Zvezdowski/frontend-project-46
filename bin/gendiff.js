#!/usr/bin/env node

import { Command } from 'commander';
import { parseJsonFromPath, genDiff } from '../src/index.js';

const program = new Command();

program.name('gendiff')
  .description('Compares two configuration files and shows a difference.')
  .version('0.0.1')
  .arguments('<filepath1> <filepath2>')
  .action((filepath1, filepath2) => {
    const obj1 = parseJsonFromPath(filepath1);
    const obj2 = parseJsonFromPath(filepath2);
    const diff = genDiff(obj1, obj2);
    console.log(diff);
  });

program.option('-f, --format <type>', 'output format');

program.parse();
