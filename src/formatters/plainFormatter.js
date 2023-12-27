import _ from 'lodash';
import {
  getChildren, getType, getKey, getMainValue, getAdditionalValue, isObject,
} from '../utils.js';

const genPathOfProp = (existingPath, newKey) => ([existingPath, newKey].filter((element) => element !== '').join('.'));

const isDiffStructure = (value) => (Object.hasOwn(value, 'children'));

const normalizeValue = (value) => {
  const rawValue = typeof value === 'string' ? `'${value}'` : value;
  const normalizedValue = isObject(rawValue) && !isDiffStructure(value) ? '[complex value]' : rawValue;
  return normalizedValue;
};

const formatByPlain = (diffStructure) => {
  const iter = (structure, pathOfProp) => {
    const children = getChildren(structure);
    const lines = children.map((child) => {
      const type = getType(child);
      const value = normalizeValue(getMainValue(child));
      const key = getKey(child);
      const path = genPathOfProp(pathOfProp, key);
      const additionalValue = type === 'modified' ? normalizeValue(getAdditionalValue(child)) : undefined;
      switch (type) {
        case 'added':
          return `Property '${path}' was added with value: ${value}`;
        case 'removed':
          return `Property '${path}' was removed`;
        case 'modified':
          return `Property '${path}' was updated. From ${value} to ${additionalValue}`;
        case 'parent':
          return iter(value, path);
        case 'unchanged':
          return '';
        default:
          throw new Error('Unknown type');
      }
    });
    const sortedLines = _.filter(lines, (line) => (line !== ''));
    const result = sortedLines.flat().join('\n');
    return result;
  };

  return iter(diffStructure, '');
};

export default formatByPlain;
