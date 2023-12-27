import { dirname } from 'path';
import { fileURLToPath } from 'url';
import parseFile from '../src/parsers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (fixtureName) => (`${__dirname}/../__fixtures__/${fixtureName}`);

const result = { banana: 1, apple: 'delicious' };

test('parse YAML', () => {
  const fixturePath = 'parsersFixtures/parserFixture.yaml';
  expect(parseFile(getFixturePath(fixturePath))).toStrictEqual(result);
});

test('parse JSON', () => {
  const fixturePath = 'parsersFixtures/parserFixture.json';
  expect(parseFile(getFixturePath(fixturePath))).toStrictEqual(result);
});

test('Switch default', () => {
  const fixtureName = 'parsersFixtures/throw.error';
  expect(() => {
    parseFile(getFixturePath(fixtureName));
  }).toThrow(new Error('Unknown extention'));
});
