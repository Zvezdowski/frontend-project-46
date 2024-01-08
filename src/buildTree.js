import _ from 'lodash';

const buildTree = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const keys = _.sortBy(_.union(keys1, keys2));
  const children = keys.map((key) => {
    if (!Object.hasOwn(obj1, key)) {
      return { key, type: 'added', mainValue: obj2[key] };
    }
    if (!Object.hasOwn(obj2, key)) {
      return { key, type: 'removed', mainValue: obj1[key] };
    }
    if (obj1[key] === obj2[key]) {
      return { key, type: 'unchanged', mainValue: obj1[key] };
    }
    if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
      return { key, type: 'parent', mainValue: buildTree(obj1[key], obj2[key]) };
    }
    return {
      key, type: 'modified', mainValue: obj1[key], additionalValue: obj2[key],
    };
  });
  return children;
};

export default buildTree;
