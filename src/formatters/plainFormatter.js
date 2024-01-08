import _ from 'lodash';

const stringify = (value) => {
  const result = _.isPlainObject(value) ? '[complex value]' : JSON.stringify(value).replaceAll('"', '\'');
  return result;
};

const formatByPlain = (diffTree) => {
  const iter = (tree, pathToProp) => {
    const lines = tree.map((child) => {
      const { key, type, mainValue } = child;
      const normalizedValue = stringify(mainValue);
      const currentPath = _.filter([pathToProp, key], (prop) => prop !== '').join('.');
      switch (type) {
        case 'added':
          return `Property '${currentPath}' was added with value: ${normalizedValue}`;
        case 'removed':
          return `Property '${currentPath}' was removed`;
        case 'modified':
          return `Property '${currentPath}' was updated. From ${normalizedValue} to ${stringify(child.additionalValue)}`;
        case 'parent':
          return iter(mainValue, currentPath);
        case 'unchanged':
          return '';
        default:
          throw new Error('Unknown type');
      }
    });
    const filteredLines = lines.filter((line) => line);
    return filteredLines.join('\n');
  };
  return iter(diffTree, '');
};

export default formatByPlain;
