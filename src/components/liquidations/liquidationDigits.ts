export type LiquidationDigitParts = {
  prefix: '$';
  suffix: 'M' | 'K' | 'B' | '';
  integerDigits: number[];
  decimalDigit: number;
};

export function decomposeLiquidationAmount(amount: number): LiquidationDigitParts {
  const abs = Math.abs(amount);
  let scaled = amount;
  let suffix: LiquidationDigitParts['suffix'] = '';

  if (abs >= 1e9) {
    scaled = amount / 1e9;
    suffix = 'B';
  } else if (abs >= 1e6) {
    scaled = amount / 1e6;
    suffix = 'M';
  } else if (abs >= 1e3) {
    scaled = amount / 1e3;
    suffix = 'K';
  }

  const [integerPart, decimalPart = '0'] = scaled.toFixed(1).split('.');

  return {
    prefix: '$',
    suffix,
    integerDigits: integerPart.split('').map((char) => Number(char)),
    decimalDigit: Number(decimalPart),
  };
}

export function alignLiquidationDigitParts(
  from: LiquidationDigitParts,
  to: LiquidationDigitParts,
): { from: LiquidationDigitParts; to: LiquidationDigitParts; suffix: LiquidationDigitParts['suffix'] } {
  const maxIntLength = Math.max(from.integerDigits.length, to.integerDigits.length);

  const padIntegerDigits = (digits: number[]) => {
    const padding = maxIntLength - digits.length;
    return [...Array(Math.max(0, padding)).fill(-1), ...digits];
  };

  return {
    from: {
      ...from,
      integerDigits: padIntegerDigits(from.integerDigits),
    },
    to: {
      ...to,
      integerDigits: padIntegerDigits(to.integerDigits),
    },
    suffix: to.suffix,
  };
}

export function getDigitScrollPath(fromDigit: number, toDigit: number): number[] {
  const from = Math.max(0, fromDigit);
  const to = Math.max(0, toDigit);

  if (from === to) {
    return [from];
  }

  const path: number[] = [];
  if (to >= from) {
    for (let digit = from; digit <= to; digit += 1) {
      path.push(digit);
    }
  } else {
    for (let digit = from; digit >= to; digit -= 1) {
      path.push(digit);
    }
  }

  return path;
}
