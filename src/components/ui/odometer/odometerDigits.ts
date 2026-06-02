export type OdometerDigitParts = {
  prefix: string;
  suffix: string;
  integerDigits: number[];
  decimalDigits: number[];
};

export function decomposeOdometerAmount(
  amount: number,
  {
    prefix = '',
    suffix = '',
    decimalPlaces = 1,
  }: {
    prefix?: string;
    suffix?: string;
    decimalPlaces?: number;
  },
): OdometerDigitParts {
  const abs = Math.abs(amount);
  const fixed = abs.toFixed(decimalPlaces);
  const [integerPart, decimalPart = ''] = fixed.split('.');

  return {
    prefix,
    suffix,
    integerDigits: integerPart.split('').map((char) => Number(char)),
    decimalDigits: decimalPart.padEnd(decimalPlaces, '0').split('').map((char) => Number(char)),
  };
}

export function alignOdometerDigitParts(
  from: OdometerDigitParts,
  to: OdometerDigitParts,
): { from: OdometerDigitParts; to: OdometerDigitParts; suffix: string } {
  const maxIntLength = Math.max(from.integerDigits.length, to.integerDigits.length);
  const maxDecLength = Math.max(from.decimalDigits.length, to.decimalDigits.length);

  const padDigits = (digits: number[], length: number) => {
    const padding = length - digits.length;
    return [...Array(Math.max(0, padding)).fill(-1), ...digits];
  };

  return {
    from: {
      ...from,
      integerDigits: padDigits(from.integerDigits, maxIntLength),
      decimalDigits: padDigits(from.decimalDigits, maxDecLength),
    },
    to: {
      ...to,
      integerDigits: padDigits(to.integerDigits, maxIntLength),
      decimalDigits: padDigits(to.decimalDigits, maxDecLength),
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
