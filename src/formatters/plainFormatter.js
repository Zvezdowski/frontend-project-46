import {
  getProps, getCondition, getKey, getMainValue, getAdditionalValue, isObject,
} from '../utils.js';

const genPathOfProp = (existingPath, newKey) => ([existingPath, newKey].filter((element) => element !== '').join('.'));

const isDiffStructure = (value) => (Object.hasOwn(value, 'props'));

const normalizeValue = (value) => {
  const rawValue = typeof value === 'string' ? `'${value}'` : value;
  const normalizedValue = isObject(rawValue) && !isDiffStructure(value) ? '[complex value]' : rawValue;
  return normalizedValue;
};

const formatByPlain = (diffStructure) => {
  const iter = (structure, pathOfProp) => {
    const props = getProps(structure);
    const lines = props.reduce((acc, prop) => {
      const condition = getCondition(prop);
      const value = normalizeValue(getMainValue(prop));
      const key = getKey(prop);
      const path = genPathOfProp(pathOfProp, key);
      if (condition === 'added') {
        const line = `Property '${path}' was added with value: ${value}`;
        return [...acc, line];
      }
      if (condition === 'removed') {
        const line = `Property '${path}' was removed`;
        return [...acc, line];
      }
      if (condition === 'modified') {
        const additionalValue = normalizeValue(getAdditionalValue(prop));
        const line = `Property '${path}' was updated. From ${value} to ${additionalValue}`;
        return [...acc, line];
      }
      if (condition === 'nested') {
        const line = iter(value, path);
        return [...acc, line];
      }
      return [...acc];
    }, []);
    const result = lines.flat().join('\n');
    return result;
  };

  return iter(diffStructure, '');
};

export default formatByPlain;
