import fs from 'fs';
import genDiff, { getFixturePath, makeChild } from '../src/index.js';

test('genDiff json', () => {
  const jsonResult = fs.readFileSync(getFixturePath('nested/jsonFormatter/jsonResult.txt')).toString().slice(0, -1);
  expect(genDiff(getFixturePath('nested/secondCase/before.json'), getFixturePath('nested/secondCase/after.json'), 'json')).toBe(jsonResult);
});

test('genDiff plain', () => {
  const plainResult = fs.readFileSync(getFixturePath('nested/plainFormatter/plainResult.txt')).toString().slice(0, -1);
  expect(genDiff(getFixturePath('nested/firstCase/before.yaml'), getFixturePath('nested/firstCase/after.yaml'), 'plain')).toBe(plainResult);
});

test('genDiff stylish', () => {
  const stylishResult = fs.readFileSync(getFixturePath('nested/stylishFormatter/stylishResult.txt')).toString().slice(0, -1);
  expect(genDiff(getFixturePath('nested/firstCase/before.json'), getFixturePath('nested/firstCase/after.json'))).toStrictEqual(stylishResult);
  expect(genDiff(getFixturePath('nested/firstCase/before.yaml'), getFixturePath('nested/firstCase/after.yaml'))).toStrictEqual(stylishResult);
});

test('makeChild', () => {
  expect(makeChild('key', 'parent', {})).toStrictEqual({ key: 'key', type: 'parent', mainValue: {} });
  expect(makeChild('key', 'modified', 'before', 'after')).toStrictEqual({
    key: 'key', type: 'modified', mainValue: 'before', additionalValue: 'after',
  });
});
