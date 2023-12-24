const getProps = (diffStructure) => (diffStructure.props);

const getCondition = (prop) => (prop.condition);

const getKey = (prop) => (prop.key);

const getMainValue = (prop) => (prop.mainValue);

const getAdditionalValue = (prop) => (prop.additionalValue);

const isObject = (value) => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true;
  }
  return false;
};

export {
  getProps, getCondition, getKey, getMainValue, getAdditionalValue, isObject,
};
