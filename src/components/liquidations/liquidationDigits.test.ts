import { describe, expect, it } from 'vitest';
import {
  alignLiquidationDigitParts,
  decomposeLiquidationAmount,
  getDigitScrollPath,
} from './liquidationDigits';

describe('decomposeLiquidationAmount', () => {
  it('splits amount into static prefix/suffix and digit slots', () => {
    expect(decomposeLiquidationAmount(184_300_000)).toEqual({
      prefix: '$',
      suffix: 'M',
      integerDigits: [1, 8, 4],
      decimalDigit: 3,
    });
    expect(decomposeLiquidationAmount(4_600_000)).toEqual({
      prefix: '$',
      suffix: 'M',
      integerDigits: [4],
      decimalDigit: 6,
    });
  });
});

describe('alignLiquidationDigitParts', () => {
  it('pads integer digits to the same width', () => {
    const from = decomposeLiquidationAmount(184_300_000);
    const to = decomposeLiquidationAmount(4_600_000);
    const aligned = alignLiquidationDigitParts(from, to);

    expect(aligned.from.integerDigits).toEqual([1, 8, 4]);
    expect(aligned.to.integerDigits).toEqual([-1, -1, 4]);
  });
});

describe('getDigitScrollPath', () => {
  it('builds ascending and descending digit paths', () => {
    expect(getDigitScrollPath(1, 4)).toEqual([1, 2, 3, 4]);
    expect(getDigitScrollPath(8, 3)).toEqual([8, 7, 6, 5, 4, 3]);
    expect(getDigitScrollPath(5, 5)).toEqual([5]);
  });
});
