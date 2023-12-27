const getChildren = (diffStructure) => (diffStructure.children);

const getType = (child) => (child.type);

const getKey = (child) => (child.key);

const getMainValue = (child) => (child.mainValue);

const getAdditionalValue = (child) => (child.additionalValue);

const isObject = (value) => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true;
  }
  return false;
};

export {
  getChildren, getType, getKey, getMainValue, getAdditionalValue, isObject,
};
