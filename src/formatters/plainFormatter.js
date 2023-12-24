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
      const newAcc = acc;
      const condition = getCondition(prop);
      const value = normalizeValue(getMainValue(prop));
      const key = getKey(prop);
      const path = genPathOfProp(pathOfProp, key);
      if (condition === 'added') {
        newAcc.push(`Property '${path}' was added with value: ${value}`);
      } else if (condition === 'removed') {
        newAcc.push(`Property '${path}' was removed`);
      } else if (condition === 'modified') {
        const additionalValue = normalizeValue(getAdditionalValue(prop));
        newAcc.push(`Property '${path}' was updated. From ${value} to ${additionalValue}`);
      } else if (condition === 'nested') {
        newAcc.push(iter(value, path));
      }
      return newAcc;
    }, []);
    const result = lines.flat().join('\n');
    return result;
  };

  return iter(diffStructure, '');
};

export default formatByPlain;
