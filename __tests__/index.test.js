import {
  genDiff, getFixturePath, formatByStylish, compareObjects,
} from '../src/index.js';
import { result2 } from '../__fixtures__/result.js';
import result from '../__fixtures__/nested/result.js';

test('genDiff on flat', () => {
  expect(genDiff(getFixturePath('terminalCases/before1.json'), getFixturePath('terminalCases/after1.json'))).toBe('{\n    apple: delicious\n    banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before2.json'), getFixturePath('terminalCases/after2.json'))).toBe('{\n  - apple: delicious\n  + apple: fresh\n    banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before3.json'), getFixturePath('terminalCases/after3.json'))).toBe('{\n    apple: delicious\n  - banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before4.json'), getFixturePath('terminalCases/after4.json'))).toBe('{\n    apple: delicious\n  + banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before5.json'), getFixturePath('terminalCases/after5.json'))).toBe('{\n  + apple: delicious\n  + banana: 1\n}');
  expect(genDiff(getFixturePath('terminalCases/before6.json'), getFixturePath('terminalCases/after6.json'))).toBe('{\n  - apple: delicious\n  - banana: 1\n}');
  expect(genDiff(getFixturePath('before.json'), getFixturePath('after.json'))).toBe(result2);
  expect(genDiff(getFixturePath('before.yaml'), getFixturePath('after.yml'))).toBe(result2);
});

test('genDiff on nested', () => {
  expect(genDiff(getFixturePath('nested/file1.json'), getFixturePath('nested/file2.json'))).toStrictEqual(result);
  expect(genDiff(getFixturePath('nested/file1.yaml'), getFixturePath('nested/file2.yaml'))).toStrictEqual(result);
});

test('Throw error test on genDiff', () => {
  expect(() => (genDiff(getFixturePath('nested/file1.json'), getFixturePath('nested/file2.json'), 'unknown'))).toThrow();
});

test('Format by stylish', () => {
  expect(formatByStylish(compareObjects({
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
