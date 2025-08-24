import { getPUnder20bits } from './util';
const __mnz_brand: unique symbol = Symbol();

type Monzo = (readonly [number, number])[] & {
  [__mnz_brand]: unknown;
};

/**
 * changes monzo into string form \
 * e.g. `[[2, -4], [3, 4], [5, -1]]` (syntonic comma) -> `2:-4,3:4,5:-1`
 * @param mnz
 * @returns
 */
const stringify = (mnz: Monzo) =>
  mnz.map(([basis, exp]) => `${basis}:${exp}`).join(',');

const create = (arr: [number, number][]) => {
  arr.forEach(([basis, exp]) => {
    if (!Number.isFinite(basis) || !Number.isFinite(exp)) {
      throw Error('invalid array');
    }
  });

  // 基底の小さい順にソート
  arr.sort(([a], [b]) => {
    return a - b;
  });

  // 重複する基底を全部足し合わせる
  // その後前の方を0にする
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i][0] === arr[i + 1][0]) {
      arr[i + 1][1] += arr[i][1];
      arr[i][1] = 0;
    }
  }

  return arr.filter(([, exp]) => exp !== 0) as (readonly [
    number,
    number
  ])[] as Monzo;
};

const parse = (str: string) => {
  if (!str.match(/^(\d+:)?-?\d+(,(\d+:)?-?\d+)*$/g)) {
    throw Error('could not parse');
  }
  const units = str.split(',');

  const mnz: [number, number][] = units.map((s, i) => {
    if (s.match(/^-?\d+$/g)) {
      const b = getPUnder20bits(i);
      return [b, Number(s)];
    } else if (s.match(/^\d+:-?\d+$/g)) {
      const [b, e] = s.split(':');
      return [Number(b), Number(e)];
    } else {
      throw Error('could not parse');
    }
  });
  return create(mnz);
};

// const fromRatio = (num: bigint, denom: bigint) => {};

const Monzo = {
  stringify,
  create,
  parse,
};

export default Monzo;
