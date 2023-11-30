import { genDiff } from '../src/index.js';

test('genDiff', () => {
  expect(genDiff({ banana: 1, apple: 'delicious' }, { banana: 1, apple: 'delicious' })).toBe('{\n    apple: delicious\n    banana: 1\n}');
  expect(genDiff({ banana: 1, apple: 'delicious' }, { banana: 1, apple: 'fresh' })).toBe('{\n  - apple: delicious\n  + apple: fresh\n    banana: 1\n}');
  expect(genDiff({ banana: 1, apple: 'delicious' }, { apple: 'delicious' })).toBe('{\n    apple: delicious\n  - banana: 1\n}');
  expect(genDiff({ apple: 'delicious' }, { banana: 1, apple: 'delicious' })).toBe('{\n    apple: delicious\n  + banana: 1\n}');
  expect(genDiff({}, { banana: 1, apple: 'delicious' })).toBe('{\n  + apple: delicious\n  + banana: 1\n}');
  expect(genDiff({ banana: 1, apple: 'delicious' }, {})).toBe('{\n  - apple: delicious\n  - banana: 1\n}');
});
