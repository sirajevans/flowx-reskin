export type OdometerIntegerToken = number | 'comma';

export type OdometerDigitParts = {
  prefix: string;
  suffix: string;
  integerTokens: OdometerIntegerToken[];
  decimalDigits: number[];
  groupThousands?: boolean;
};

function tokensToDigits(tokens: OdometerIntegerToken[]): number[] {
  return tokens.filter((token): token is number => token !== 'comma');
}

function groupDigitsMatchingTemplate(
  digits: number[],
  template: OdometerIntegerToken[],
): OdometerIntegerToken[] {
  const result: OdometerIntegerToken[] = [];
  let digitIndex = 0;

  for (const token of template) {
    if (token === 'comma') {
      result.push('comma');
      continue;
    }

    result.push(digits[digitIndex] ?? -1);
    digitIndex += 1;
  }

  return result;
}

export function addThousandSeparators(digits: number[]): OdometerIntegerToken[] {
  const tokens: OdometerIntegerToken[] = [];
  const len = digits.length;

  for (let i = 0; i < len; i++) {
    tokens.push(digits[i]);
    if (digits[i] < 0) continue;

    let digitsAfter = 0;
    for (let j = i + 1; j < len; j++) {
      if (digits[j] >= 0) digitsAfter += 1;
    }

    if (digitsAfter > 0 && digitsAfter % 3 === 0) {
      tokens.push('comma');
    }
  }

  return tokens;
}

export function decomposeOdometerAmount(
  amount: number,
  {
    prefix = '',
    suffix = '',
    decimalPlaces = 1,
    groupThousands = false,
  }: {
    prefix?: string;
    suffix?: string;
    decimalPlaces?: number;
    groupThousands?: boolean;
  },
): OdometerDigitParts {
  const abs = Math.abs(amount);
  const fixed = abs.toFixed(decimalPlaces);
  const [integerPart, decimalPart = ''] = fixed.split('.');
  const integerDigits = integerPart.split('').map((char) => Number(char));

  return {
    prefix,
    suffix,
    integerTokens: groupThousands ? addThousandSeparators(integerDigits) : integerDigits,
    decimalDigits: decimalPart.padEnd(decimalPlaces, '0').split('').map((char) => Number(char)),
    groupThousands,
  };
}

export function alignOdometerDigitParts(
  from: OdometerDigitParts,
  to: OdometerDigitParts,
): { from: OdometerDigitParts; to: OdometerDigitParts; suffix: string } {
  const fromDigits = tokensToDigits(from.integerTokens);
  const toDigits = tokensToDigits(to.integerTokens);
  const maxIntLength = Math.max(fromDigits.length, toDigits.length);
  const maxDecLength = Math.max(from.decimalDigits.length, to.decimalDigits.length);
  const groupThousands = Boolean(from.groupThousands || to.groupThousands);

  const padDigits = (digits: number[], length: number) => {
    const padding = length - digits.length;
    return [...Array(Math.max(0, padding)).fill(-1), ...digits];
  };

  const paddedFromDigits = padDigits(fromDigits, maxIntLength);
  const paddedToDigits = padDigits(toDigits, maxIntLength);

  const toIntegerTokens = groupThousands
    ? addThousandSeparators(paddedToDigits)
    : paddedToDigits;
  const fromIntegerTokens = groupThousands
    ? groupDigitsMatchingTemplate(paddedFromDigits, toIntegerTokens)
    : paddedFromDigits;

  return {
    from: {
      ...from,
      integerTokens: fromIntegerTokens,
      decimalDigits: padDigits(from.decimalDigits, maxDecLength),
      groupThousands,
    },
    to: {
      ...to,
      integerTokens: toIntegerTokens,
      decimalDigits: padDigits(to.decimalDigits, maxDecLength),
      groupThousands,
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

export function formatGroupedNumber(amount: number, decimalPlaces: number): string {
  return Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
}
