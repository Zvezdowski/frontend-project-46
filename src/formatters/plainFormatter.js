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
      if (type === 'added') {
        return `Property '${path}' was added with value: ${value}`;
      }
      if (type === 'removed') {
        return `Property '${path}' was removed`;
      }
      if (type === 'modified') {
        const additionalValue = normalizeValue(getAdditionalValue(child));
        return `Property '${path}' was updated. From ${value} to ${additionalValue}`;
      }
      if (type === 'parent') {
        return iter(value, path);
      }
      return '';
    });
    const sortedLines = _.filter(lines, (line) => (line !== ''));
    const result = sortedLines.flat().join('\n');
    return result;
  };

  return iter(diffStructure, '');
};

export default formatByPlain;
