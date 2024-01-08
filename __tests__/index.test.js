import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import genDiff from '../src/index.js';
import parseData from '../src/parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (fixtureName) => (`${__dirname}/../__fixtures__/${fixtureName}`);

const beforeJsonPath = getFixturePath('before.json');
const afterJsonPath = getFixturePath('after.json');
const beforeYamlPath = getFixturePath('before.yaml');
const afterYamlPath = getFixturePath('after.yaml');
const stylishResult = fs.readFileSync(getFixturePath('stylishResult.txt')).toString().slice(0, -1);
const plainResult = fs.readFileSync(getFixturePath('plainResult.txt')).toString().slice(0, -1);
const jsonResult = fs.readFileSync(getFixturePath('jsonResult.txt')).toString().slice(0, -1);

describe.each([
  [beforeJsonPath, afterJsonPath, 'stylish', stylishResult],
  [beforeYamlPath, afterYamlPath, 'plain', plainResult],
  [beforeJsonPath, afterJsonPath, 'json', jsonResult],
])('Gendiff formats test suite', (fixturePath1, fixturePath2, formatName, result) => {
  test(`Gendiff ${formatName} format test`, () => {
    expect(genDiff(fixturePath1, fixturePath2, formatName)).toBe(result);
  });
});

const yamlFixturePath = getFixturePath('parserFixture.yaml');
const jsonFixturePath = getFixturePath('parserFixture.json');
const parserResult = { banana: 1, apple: 'delicious' };

describe.each([
  [yamlFixturePath, parserResult],
  [jsonFixturePath, parserResult],
])('Parsers test suite', (fixturePath, result) => {
  test('Parser test', () => {
    const dataFormat = path.extname(fixturePath).slice(1);
    const fixtureData = fs.readFileSync(fixturePath);
    expect(parseData(fixtureData, dataFormat)).toStrictEqual(result);
  });
});
