import { dirname } from 'path';
import { fileURLToPath } from 'url';
import parseFile from '../src/parsers.js';
import { result1 } from '../__fixtures__/result.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturePath = (fixtureName) => (`${__dirname}/../__fixtures__/${fixtureName}`);

test('parse YAML', () => {
  const fixtureName = 'blank.yaml';
  expect(parseFile(getFixturePath(fixtureName))).toStrictEqual(result1);
});

test('parse JSON', () => {
  const fixtureName = 'blank.json';
  expect(parseFile(getFixturePath(fixtureName))).toStrictEqual(result1);
});

test('Switch default', () => {
  const fixtureName = 'throw.error';
  expect(() => {
    parseFile(getFixturePath(fixtureName));
  }).toThrow(new Error('Unknown extention'));
});
