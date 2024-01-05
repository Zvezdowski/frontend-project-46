import parseFile from './parsers.js';
import formatDiffTree from './formatters/index.js';
import { buildTree } from './buildTree.js';

const genDiff = (filepath1, filepath2, formatName = 'stylish') => {
  const obj1 = parseFile(filepath1);
  const obj2 = parseFile(filepath2);
  const diffTree = buildTree(obj1, obj2);
  return formatDiffTree(diffTree, formatName);
};

export default genDiff;
