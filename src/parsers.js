import yaml from 'js-yaml';

const parseData = (fileData, dataFormat) => {
  switch (dataFormat) {
    case 'yaml':
    case 'yml':
      return yaml.load(fileData);
    case 'json':
      return JSON.parse(fileData);
    default:
      throw new Error(`Unknown extention: ${dataFormat}`);
  }
};

export default parseData;
