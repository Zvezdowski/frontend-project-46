import formatByPlain from './plainFormatter.js';
import formatByStylish from './stylishFormatter.js';
import formatByJson from './jsonFormatter.js';

const getFormatterByStyle = (style) => {
  switch (style) {
    case 'stylish':
      return formatByStylish;
    case 'plain':
      return formatByPlain;
    case 'json':
      return formatByJson;
    default:
      throw new Error('Unknown style formatter');
  }
};

export default getFormatterByStyle;
