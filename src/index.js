import path from 'path';
import fs from 'fs';
import parseData from './parsers.js';
import formatDiffTree from './formatters/index.js';
import buildTree from './buildTree.js';

const buildPath = (filepath) => path.resolve(process.cwd(), filepath);

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const dataFormat1 = path.extname(filepath1).slice(1);
  const dataFormat2 = path.extname(filepath2).slice(1);
  const absolutePath1 = buildPath(filepath1);
  const absolutePath2 = buildPath(filepath2);
  const fileData1 = fs.readFileSync(absolutePath1);
  const fileData2 = fs.readFileSync(absolutePath2);
  const obj1 = parseData(fileData1, dataFormat1);
  const obj2 = parseData(fileData2, dataFormat2);
  const diffTree = buildTree(obj1, obj2);
  return formatDiffTree(diffTree, formatName);
};

export default genDiff;
