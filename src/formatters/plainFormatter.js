import _ from 'lodash';

const stringify = (value) => JSON.stringify(value).replaceAll('"', '\'');

const formatByPlain = (diffTree) => {
  const iter = (tree, pathToProp) => {
    const { children } = tree;
    const lines = children.map((child) => {
      const { key, type, mainValue } = child;
      const normalizedValue = _.isPlainObject(mainValue) ? '[complex value]' : stringify(mainValue);
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
    const filteredLines = _.filter(lines, (line) => (line !== ''));
    return filteredLines.flat().join('\n');
  };
  return iter(diffTree, '');
};

export default formatByPlain;
