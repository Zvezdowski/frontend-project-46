const getSpecialChar = (type) => {
  if (type === 'added') {
    return '+';
  }
  if (type === 'removed' || type === 'modified') {
    return '-';
  }
  return ' ';
};

const printValue = (object, depth) => {
  if (typeof object !== 'object' || Array.isArray(object) || object === null) {
    return object;
  }
  const keys = Object.keys(object);
  const indent = '    ';
  const lines = keys.map((key) => (`${indent.repeat(depth)}${key}: ${printValue(object[key], depth + 1)}`));
  const result = `{\n${lines.join('\n')}\n${indent.repeat(depth - 1)}}`;
  return result;
};

const makeIndent = (depth, specialChar) => {
  const space = ' ';
  const indent = `${space.repeat(4 * depth - 2)}${specialChar}${space}`;
  return indent;
};

const formatByStylish = (diffTree) => {
  const iter = (tree, depth) => {
    const { children } = tree;
    const lines = children.reduce((acc, child) => {
      const { type, key, mainValue } = child;
      const specialChar = getSpecialChar(type);
      const indent = makeIndent(depth, specialChar);
      const mainLine = `${indent}${key}: ${printValue(mainValue, depth + 1)}`;
      switch (type) {
        case 'added':
        case 'removed':
        case 'unchanged':
          return [...acc, mainLine];
        case 'modified':
          return [...acc, mainLine, `${makeIndent(depth, '+')}${key}: ${printValue(child.additionalValue, depth + 1)}`];
        case 'parent':
          return [...acc, `${indent}${key}: ${iter(mainValue, depth + 1)}`];
        default:
          throw new Error(`Unknown type: ${type}`);
      }
    }, []);
    return `{\n${lines.join('\n')}\n${'    '.repeat(depth - 1)}}`;
  };
  return iter(diffTree, 1);
};

export default formatByStylish;
