import { genDiff, getFixturePath } from '../src/index.js';
import { result2 } from '../__fixtures__/result.js';

test('genDiff', () => {
  expect(genDiff(getFixturePath('terminalCases/before1.json'), getFixturePath('terminalCases/after1.json'))).toBe('{\n    apple: delicious\n    banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before2.json'), getFixturePath('terminalCases/after2.json'))).toBe('{\n  - apple: delicious\n  + apple: fresh\n    banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before3.json'), getFixturePath('terminalCases/after3.json'))).toBe('{\n    apple: delicious\n  - banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before4.json'), getFixturePath('terminalCases/after4.json'))).toBe('{\n    apple: delicious\n  + banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before5.json'), getFixturePath('terminalCases/after5.json'))).toBe('{\n  + apple: delicious\n  + banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before6.json'), getFixturePath('terminalCases/after6.json'))).toBe('{\n  - apple: delicious\n  - banana: 1\n}');
  expect(genDiff(getFixturePath('before.json'), getFixturePath('after.json'))).toBe(result2);
  expect(genDiff(getFixturePath('before.yaml'), getFixturePath('after.yml'))).toBe(result2);
});
