import {
  getChildren, getType, getKey, getMainValue, getAdditionalValue, isObject,
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

const printSimpleProp = (child, depth) => {
  const key = getKey(child);
  const type = getType(child);
  const mainValue = getMainValue(child);

  const indentBeforeLine = tab.repeat(depth + 1);
  const indentBeforeBrace = tab.repeat(depth);
  const lineOfKey = `${indentBeforeLine}"key": "${key}"`;
  const lineOfType = `${indentBeforeLine}"type": "${type}"`;
  const lineOfMainValue = `${indentBeforeLine}"mainValue": ${printJsonObject(mainValue, depth + 1)}`;

  if (type === 'modified') {
    const additionalValue = getAdditionalValue(child);
    const lineOfAdditionalValue = `${indentBeforeLine}"additionalValue": ${printJsonObject(additionalValue)}`;
    return `${indentBeforeBrace}{\n${lineOfKey},\n${lineOfType},\n${lineOfMainValue},\n${lineOfAdditionalValue}\n${indentBeforeBrace}}`;
  }

  return `${indentBeforeBrace}{\n${lineOfKey},\n${lineOfType},\n${lineOfMainValue}\n${indentBeforeBrace}}`;
};

const formatByJson = (diffStructure) => {
  const iter = (structure, depth) => {
    const indentBeforeBrace = tab.repeat(depth + 1);
    const children = getChildren(structure);
    const lines = children.map((child) => {
      const type = getType(child);
      if (type === 'parent') {
        const key = getKey(child);
        const indentBeforeLine = tab.repeat(depth + 2);
        const mainValue = getMainValue(child);
        const lineOfKey = `${indentBeforeLine}"key": "${key}"`;
        const lineOfType = `${indentBeforeLine}"type": "${type}"`;
        const lineOfMainValue = `${indentBeforeLine}"mainValue": ${iter(mainValue, depth + 3)}`;
        const parentProp = `${indentBeforeBrace}{\n${lineOfKey},\n${lineOfType},\n${lineOfMainValue}\n${indentBeforeBrace}}`;
        return parentProp;
      }
      const simpleProp = printSimpleProp(child, depth + 1);
      return simpleProp;
    });

    return `{\n${tab.repeat(depth)}"children": [\n${lines.join(',\n')}\n${tab.repeat(depth)}]\n${tab.repeat(depth - 1)}}`;
  };

  const result = iter(diffStructure, 1);
  console.log(result);
  return result;
};

export default formatByJson;
