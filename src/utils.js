import _ from 'lodash';

const getUniqueKeys = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const commonKeys = [...obj1Keys, ...obj2Keys];
  const uniqueKeys = _.uniq(commonKeys);
  const sortedKeys = _.sortBy(uniqueKeys);
  return sortedKeys;
};

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
  getChildren, getType, getKey, getMainValue, getAdditionalValue, isObject, getUniqueKeys,
};
