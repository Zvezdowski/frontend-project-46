import _ from 'lodash';
import { isObject } from '../buildTree.js';

const genPathOfProp = (existingPath, newKey) => ([existingPath, newKey].filter((element) => element !== '').join('.'));

const isDiffTree = (value) => (Object.hasOwn(value, 'children'));

const normalizeValue = (value) => {
  const rawValue = typeof value === 'string' ? `'${value}'` : value;
  const normalizedValue = isObject(rawValue) && !isDiffTree(value) ? '[complex value]' : rawValue;
  return normalizedValue;
};

const formatByPlain = (diffTree) => {
  const iter = (tree, pathToProp) => {
    const { children } = tree;
    const lines = children.map((child) => {
      const { key, type, mainValue } = child;
      const value = normalizeValue(mainValue);
      const currentPath = genPathOfProp(pathToProp, key);
      switch (type) {
        case 'added':
          return `Property '${currentPath}' was added with value: ${value}`;
        case 'removed':
          return `Property '${currentPath}' was removed`;
        case 'modified':
          return `Property '${currentPath}' was updated. From ${value} to ${normalizeValue(child.additionalValue)}`;
        case 'parent':
          return iter(value, currentPath);
        case 'unchanged':
          return '';
        default:
          throw new Error('Unknown type');
      }
    });
    const filteredLines = _.filter(lines, (line) => (line !== ''));
    return filteredLines.flat().join('\n');
  };
  return iter(diffTree, '');
};

export default formatByPlain;
