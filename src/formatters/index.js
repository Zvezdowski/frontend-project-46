import formatByPlain from './plainFormatter.js';
import formatByStylish from './stylishFormatter.js';

const getFormatterByStyle = (style) => {
  switch (style) {
    case 'stylish':
      return formatByStylish;
    case 'plain':
      return formatByPlain;
    default:
      throw new Error('Unknown style formatter');
  }
};

export default getFormatterByStyle;
