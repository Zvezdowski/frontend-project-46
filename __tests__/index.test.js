import fs from 'fs';
import genDiff, { getFixturePath, genStructureOfDiff } from '../src/index.js';
import formatByStylish from '../src/formatters/stylishFormatter.js';
import result from '../__fixtures__/nested/result.js';

test('genDiff json format on nested', () => {
  const jsonOutput = fs.readFileSync(getFixturePath('nested/jsonFormatter/jsonOutput.txt')).toString().slice(0, -1);
  expect(genDiff(getFixturePath('nested/jsonFormatter/file1.json'), getFixturePath('nested/jsonFormatter/file2.json'), 'json')).toBe(jsonOutput);
});

test('genDiff plain format on nested', () => {
  const defaultResult = fs.readFileSync(getFixturePath('nested/plainFormatter/defaultResult.txt')).toString().slice(0, -1);
  expect(genDiff(getFixturePath('nested/file1.yaml'), getFixturePath('nested/file2.yaml'), 'plain')).toBe(defaultResult);
});

test('genDiff stylish format on flat', () => {
  expect(genDiff(getFixturePath('terminalCases/before1.json'), getFixturePath('terminalCases/after1.json'))).toBe('{\n    apple: delicious\n    banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before2.json'), getFixturePath('terminalCases/after2.json'))).toBe('{\n  - apple: delicious\n  + apple: fresh\n    banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before3.json'), getFixturePath('terminalCases/after3.json'))).toBe('{\n    apple: delicious\n  - banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before4.json'), getFixturePath('terminalCases/after4.json'))).toBe('{\n    apple: delicious\n  + banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before5.json'), getFixturePath('terminalCases/after5.json'))).toBe('{\n  + apple: delicious\n  + banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before6.json'), getFixturePath('terminalCases/after6.json'))).toBe('{\n  - apple: delicious\n  - banana: 1\n}');
  const flatResult = fs.readFileSync(getFixturePath('flat/result.txt')).toString().slice(0, -1);
  expect(genDiff(getFixturePath('flat/before.json'), getFixturePath('flat/after.json'))).toBe(flatResult);
  expect(genDiff(getFixturePath('flat/before.yaml'), getFixturePath('flat/after.yml'))).toBe(flatResult);
});

test('genDiff stylish format on nested', () => {
  expect(genDiff(getFixturePath('nested/file1.json'), getFixturePath('nested/file2.json'))).toStrictEqual(result);
  expect(genDiff(getFixturePath('nested/file1.yaml'), getFixturePath('nested/file2.yaml'))).toStrictEqual(result);
});

test('Throw error test on genDiff', () => {
  expect(() => (genDiff(getFixturePath('nested/file1.json'), getFixturePath('nested/file2.json'), 'unknown'))).toThrow();
});

test('Format by stylish', () => {
  expect(formatByStylish(genStructureOfDiff({
    team: 'Chicago Bulls',
    coach: 'Phil Jackson',
    year: '1991 - 1992',
    roster: {
      center: {
        name: 'Will Perdue',
      },
      powerForward: {
        name: 'Scott Williams',
      },
      smallForward: {
        name: 'Scottie Pippen',
      },
      shootingGuard: {
        name: 'Michael Jordan',
      },
    },
  }, {
    team: 'Chicago Bulls',
    year: '1992 - 1993',
    roster: {
      powerForward: {
        name: 'King Stacey',
      },
      smallForward: {
        name: 'Scottie Pippen',
      },
      shootingGuard: {
        name: 'Michael Jordan',
        rings: 2,
      },
      pointGuard: {
        name: 'Corey Williams',
      },
    },
  }))).toBe(`{
  - coach: Phil Jackson
    roster: {
      - center: {
            name: Will Perdue
        }
      + pointGuard: {
            name: Corey Williams
        }
        powerForward: {
          - name: Scott Williams
          + name: King Stacey
        }
        shootingGuard: {
            name: Michael Jordan
          + rings: 2
        }
        smallForward: {
            name: Scottie Pippen
        }
    }
    team: Chicago Bulls
  - year: 1991 - 1992
  + year: 1992 - 1993
}`);
});
