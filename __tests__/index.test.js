import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import genDiff from '../src/index.js';
import parseFile from '../src/parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (fixtureName) => (`${__dirname}/../__fixtures__/${fixtureName}`);

test('genDiff json', () => {
  const jsonResult = fs.readFileSync(getFixturePath('jsonResult.txt')).toString().slice(0, -1);
  expect(genDiff(getFixturePath('secondCase/before.json'), getFixturePath('secondCase/after.json'), 'json')).toBe(jsonResult);
});

test('genDiff plain', () => {
  const plainResult = fs.readFileSync(getFixturePath('plainResult.txt')).toString().slice(0, -1);
  expect(genDiff(getFixturePath('firstCase/before.yaml'), getFixturePath('firstCase/after.yaml'), 'plain')).toBe(plainResult);
});

test('genDiff stylish', () => {
  const stylishResult = fs.readFileSync(getFixturePath('stylishResult.txt')).toString().slice(0, -1);
  expect(genDiff(getFixturePath('firstCase/before.json'), getFixturePath('firstCase/after.json'))).toStrictEqual(stylishResult);
  expect(genDiff(getFixturePath('firstCase/before.yaml'), getFixturePath('firstCase/after.yaml'))).toStrictEqual(stylishResult);
});

test('parse YAML', () => {
  const fixturePath = 'parserFixture.yaml';
  const result = { banana: 1, apple: 'delicious' };
  expect(parseFile(getFixturePath(fixturePath))).toStrictEqual(result);
});

test('parse JSON', () => {
  const fixturePath = 'parserFixture.json';
  const result = { banana: 1, apple: 'delicious' };
  expect(parseFile(getFixturePath(fixturePath))).toStrictEqual(result);
});
