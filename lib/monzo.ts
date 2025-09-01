import { getPrimesLte, decideLength } from './util';

declare const mnzBrand: unique symbol;

type Monzo = (readonly [number, number])[] & {
  readonly [mnzBrand]: typeof mnzBrand;
};

const stringify = (mnz: Monzo) =>
  mnz.map(([basis, exp]) => `${basis}:${exp}`).join(',');

const create = (array: (readonly [number, number])[]) => {
  const arr_: [number, number][] = array.map(([b, e]) => [b, e]);
  arr_.forEach(([basis, exp]) => {
    if (!Number.isFinite(basis) || !Number.isFinite(exp)) {
      throw Error('invalid array');
    }
  });

  // 基底の小さい順にソート
  arr_.sort(([a], [b]) => {
    return a - b;
  });

  // 重複する基底を全部足し合わせる
  // その後前の方を0にする
  for (let i = 0; i < arr_.length - 1; i++) {
    if (arr_[i][0] === arr_[i + 1][0]) {
      arr_[i + 1][1] += arr_[i][1];
      arr_[i][1] = 0;
    }
  }

  return arr_.filter(([, exp]) => exp !== 0) as (readonly [
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

const isEqual = (monzo1: Monzo, monzo2: Monzo) => {
  return Monzo.stringify(monzo1) === Monzo.stringify(monzo2);
};

const toArray = (monzo: Monzo): [number, number][] => {
  return monzo.map(([a, b]) => [a, b]);
};

const getBases = (left: Monzo, right: Monzo) => {
  const bases_ = left.map(([b]) => b).concat(right.map(([b]) => b));
  return [...new Set(bases_)].sort((a, b) => a - b);
};

const add = (left: Monzo, right: Monzo) => {
  const bases = getBases(left, right);
  const results: [number, number][] = bases.map((basis) => {
    const exp1 = left.find(([b]) => b === basis)?.at(1) ?? 0;
    const exp2 = right.find(([b]) => b === basis)?.at(1) ?? 0;
    return [basis, exp1 + exp2];
  });

  return Monzo.create(results);
};

const subtract = (left: Monzo, right: Monzo) => {
  const bases = getBases(left, right);
  const results: [number, number][] = bases.map((basis) => {
    const exp1 = left.find(([b]) => b === basis)?.at(1) ?? 0;
    const exp2 = right.find(([b]) => b === basis)?.at(1) ?? 0;
    return [basis, exp1 - exp2];
  });

  return Monzo.create(results);
};

// const fromRatio = (num: bigint, denom: bigint) => {};

const Monzo = {
  /**
   * changes monzo into string form
   * 
   * @param mnz
   * @example
   * const mnz1 = Monzo.create([[2, -4], [3, 4], [5, -1]]);
   * console.log(Monzo.stringify(mnz1)); // '2:-4,3:4,5:-1'
   */
  stringify,
  /**
   * creates monzo from an array of `[basis, exponent]`
   * @param arr
   * @returns
   */
  create,
  /**
   * parses string into a monzo
   * @param str
   * @example
   * const monzo = Monzo.parse('-4,4,-1');
   * console.log(monzo); // [[2, -4], [3, 4], [5, -1]]
   */
  parse,
  /**
   * determines whether one monzo is equal to another
   * @param monzo1
   * @param monzo2
   * @example
   * const mnz1 = Monzo.create([[2, -4], [3, 4], [5, -1]]);
   * const mnz2 = Monzo.parse('-4,4,-1');
   * Monzo.isEqual(mnz1, mnz2); // true
   */
  isEqual,
  /**
   * converts into an array of `[basis, exponent]`
   */
  toArray,
  /**
   * returns `left + right`
   */
  add,
  /**
   * returns `left - right`
   */
  subtract,
};

export default Monzo;
