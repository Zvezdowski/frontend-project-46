import path from 'path';
import fs from 'fs';
import parseFile from './parsers.js';
import formatDiffTree from './formatters/index.js';
import buildTree from './buildTree.js';

const buildPath = (filepath) => path.resolve(process.cwd(), filepath);

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const extention1 = path.extname(filepath1);
  const extention2 = path.extname(filepath2);
  const absolutePath1 = buildPath(filepath1);
  const absolutePath2 = buildPath(filepath2);
  const fileData1 = fs.readFileSync(absolutePath1);
  const fileData2 = fs.readFileSync(absolutePath2);
  const obj1 = parseFile(fileData1, extention1);
  const obj2 = parseFile(fileData2, extention2);
  const diffTree = buildTree(obj1, obj2);
  return formatDiffTree(diffTree, formatName);
};

export default genDiff;
