import { getPrimesLte, decideLength } from './util';

declare const mnzBrand: unique symbol;

type Monzo = (readonly [number, number])[] & {
  readonly [mnzBrand]: typeof mnzBrand;
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
  const pList = getPrimesLte(decideLength(units.length)).slice(0, units.length);
  const arr = units.map((s, i): [number, number] => {
    if (s.match(/^-?\d+$/)) {
      return [pList[i], Number(s)];
    } else if (s.match(/^\d+:-?\d+$/)) {
      const [b, e] = s.split(':');
      return [Number(b), Number(e)];
    } else {
      throw Error('could not parse');
    }
  });
  return create(arr);
};

/**
 * determines whether one monzo is equal to another
 * @param monzo1 
 * @param monzo2 
 * @returns 
 */
const isEqual = (monzo1: Monzo, monzo2: Monzo) => {
  return Monzo.stringify(monzo1) === Monzo.stringify(monzo2);
};

// const fromRatio = (num: bigint, denom: bigint) => {};

const Monzo = {
  stringify,
  create,
  parse,
  isEqual,
};

export default Monzo;
