import { genDiff, parseJsonFromPath } from '../src/index.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

test('genDiff', () => {
  expect(genDiff({ banana: 1, apple: 'delicious' }, { banana: 1, apple: 'delicious' })).toBe('{\n    apple: delicious\n    banana: 1\n}');
  expect(genDiff({ banana: 1, apple: 'delicious' }, { banana: 1, apple: 'fresh' })).toBe('{\n  - apple: delicious\n  + apple: fresh\n    banana: 1\n}');
  expect(genDiff({ banana: 1, apple: 'delicious' }, { apple: 'delicious' })).toBe('{\n    apple: delicious\n  - banana: 1\n}');
  expect(genDiff({ apple: 'delicious' }, { banana: 1, apple: 'delicious' })).toBe('{\n    apple: delicious\n  + banana: 1\n}');
  expect(genDiff({}, { banana: 1, apple: 'delicious' })).toBe('{\n  + apple: delicious\n  + banana: 1\n}');
  expect(genDiff({ banana: 1, apple: 'delicious' }, {})).toBe('{\n  - apple: delicious\n  - banana: 1\n}');
});

test('parseJsonFromPath', () => {
  const fileName = 'blank.json';
  expect(parseJsonFromPath(`${__dirname}/../__fixtures__/${fileName}`)).toStrictEqual({ banana: 1, apple: 'delicious' });
});

