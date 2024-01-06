import yaml from 'js-yaml';

const parseFile = (fileData, extention) => {
  switch (extention) {
    case '.yaml':
    case '.yml':
      return yaml.load(fileData);
    case '.json':
      return JSON.parse(fileData);
    default:
      throw new Error(`Unknown extention: ${extention}`);
  }
};

export default parseFile;
