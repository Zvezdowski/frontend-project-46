import formatByPlain from './plainFormatter.js';
import formatByStylish from './stylishFormatter.js';
import formatByJson from './jsonFormatter.js';

const formatDiffTree = (diffTree, formatName) => {
  switch (formatName) {
    case 'stylish':
      return formatByStylish(diffTree);
    case 'plain':
      return formatByPlain(diffTree);
    case 'json':
      return formatByJson(diffTree);
    default:
      throw new Error(`Unknown format name: '${formatName}`);
  }
};

export default formatDiffTree;
