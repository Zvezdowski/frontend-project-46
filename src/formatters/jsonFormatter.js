import {
  getProps, getCondition, getKey, getMainValue, getAdditionalValue, isObject,
} from '../utils.js';

const tab = '  ';

const printJsonObject = (object, depth) => {
  if (!isObject(object)) {
    return typeof object === 'string' ? `"${object}"` : object;
  }
  const keys = Object.keys(object);
  const lines = keys.map((key) => {
    const line = `${tab.repeat(depth + 1)}"${key}": ${printJsonObject(object[key], depth + 1)}`;
    return line;
  });

  return `{\n${lines.join(',\n')}\n${tab.repeat(depth)}}`;
};

const printSimpleProp = (prop, depth) => {
  const key = getKey(prop);
  const condition = getCondition(prop);
  const mainValue = getMainValue(prop);

  const indentBeforeLine = tab.repeat(depth + 1);
  const indentBeforeBrace = tab.repeat(depth);
  const lineOfKey = `${indentBeforeLine}"key": "${key}"`;
  const lineOfCondition = `${indentBeforeLine}"condition": "${condition}"`;
  const lineOfMainValue = `${indentBeforeLine}"mainValue": ${printJsonObject(mainValue, depth + 1)}`;

  if (condition === 'modified') {
    const additionalValue = getAdditionalValue(prop);
    const lineOfAdditionalValue = `${indentBeforeLine}"additionalValue": ${printJsonObject(additionalValue)}`;
    return `${indentBeforeBrace}{\n${lineOfKey},\n${lineOfCondition},\n${lineOfMainValue},\n${lineOfAdditionalValue}\n${indentBeforeBrace}}`;
  }

  return `${indentBeforeBrace}{\n${lineOfKey},\n${lineOfCondition},\n${lineOfMainValue}\n${indentBeforeBrace}}`;
};

const formatByJson = (diffStructure) => {
  const iter = (structure, depth) => {
    const indentBeforeBrace = tab.repeat(depth + 1);
    const props = getProps(structure);
    const lines = props.map((prop) => {
      const condition = getCondition(prop);
      if (condition === 'nested') {
        const key = getKey(prop);
        const indentBeforeLine = tab.repeat(depth + 2);
        const mainValue = getMainValue(prop);
        const lineOfKey = `${indentBeforeLine}"key": "${key}"`;
        const lineOfCondition = `${indentBeforeLine}"condition": "${condition}"`;
        const lineOfMainValue = `${indentBeforeLine}"mainValue": ${iter(mainValue, depth + 3)}`;
        const nestedProp = `${indentBeforeBrace}{\n${lineOfKey},\n${lineOfCondition},\n${lineOfMainValue}\n${indentBeforeBrace}}`;
        return nestedProp;
      }
      const simpleProp = printSimpleProp(prop, depth + 1);
      return simpleProp;
    });

    return `{\n${tab.repeat(depth)}"props": [\n${lines.join(',\n')}\n${tab.repeat(depth)}]\n${tab.repeat(depth - 1)}}`;
  };

  const result = iter(diffStructure, 1);
  return result;
};

export default formatByJson;
