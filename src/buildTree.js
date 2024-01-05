import _ from 'lodash';

const getUniqueKeys = (obj1, obj2) => {
  const obj1Keys = Object.keys(obj1);
  const obj2Keys = Object.keys(obj2);
  const commonKeys = [...obj1Keys, ...obj2Keys];
  const uniqueKeys = _.uniq(commonKeys);
  const sortedKeys = _.sortBy(uniqueKeys);
  return sortedKeys;
};

const isObject = (value) => {
  if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
    return true;
  }
  return false;
};

const makeChild = (key, type, mainValue, additionalValue = undefined) => {
  if (additionalValue !== undefined) {
    return {
      key, type, mainValue, additionalValue,
    };
  }
  return { key, type, mainValue };
};

const makeTree = (children) => ({ children });

const buildTree = (obj1, obj2) => {
  const uniqueKeys = getUniqueKeys(obj1, obj2);
  const children = uniqueKeys.map((key) => {
    if (!Object.hasOwn(obj1, key)) {
      return makeChild(key, 'added', obj2[key]);
    }
    if (!Object.hasOwn(obj2, key)) {
      return makeChild(key, 'removed', obj1[key]);
    }
    if (obj1[key] === obj2[key]) {
      return makeChild(key, 'unchanged', obj1[key]);
    }
    if (isObject(obj1[key]) && isObject(obj2[key])) {
      return makeChild(key, 'parent', buildTree(obj1[key], obj2[key]));
    }
    return makeChild(key, 'modified', obj1[key], obj2[key]);
  });
  const tree = makeTree(children);
  return tree;
};

export { isObject, buildTree };
