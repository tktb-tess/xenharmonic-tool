import { getPrimesLte, decideLength } from './util';

declare const valBrand: unique symbol;

type Val = (readonly [number, number])[] & {
  readonly [valBrand]: typeof valBrand;
};

const stringify = (val: Val) =>
  val.map(([basis, exp]) => `${basis};${exp}`).join(',');

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

  // 重複する基底を消す
  for (let i = 0; i < arr_.length - 1; i++) {
    if (arr_[i][0] === arr_[i + 1][0]) {
      arr_[i][1] = 0;
    }
  }

  return arr_.filter(([, exp]) => exp !== 0) as (readonly [
    number,
    number
  ])[] as Val;
};

const parse = (str: string) => {
  if (!str.match(/^(\d+;)?-?\d+(,(\d+;)?-?\d+)*$/g)) {
    throw Error('cannot parse');
  }
  const units = str.split(',');
  const pList = getPrimesLte(decideLength(units.length));
  const arr: [number, number][] = units.map((s, i) => {
    if (s.match(/^-?\d+$/g)) {
      return [pList[i], Number(s)];
    } else if (s.match(/^\d+;-?\d+$/g)) {
      const [b, e] = s.split(';');
      return [Number(b), Number(e)];
    } else {
      throw Error('cannot parse');
    }
  });
  return create(arr);
};

const patentValFor = (edo: number, limit: number) => {
  if (edo < 1) throw Error('`edo` must be positive');
  if (limit < 2) throw Error('`limit` must be 2 or larger');

  const pList = getPrimesLte(limit).filter((p) => p <= limit);

  const arr = pList.map((p): [number, number] => [
    p,
    Math.round(edo * Math.log2(p)),
  ]);

  return create(arr);
};

const isEqual = (val1: Val, val2: Val) => {
  return stringify(val1) === stringify(val2);
};

const toArray = (monzo: Val): [number, number][] => {
  return monzo.map(([a, b]) => [a, b]);
};

const getBases = (left: Val, right: Val) => {
  const bases_ = left.map(([b]) => b).concat(right.map(([b]) => b));
  return [...new Set(bases_)].sort((a, b) => a - b);
};

const add = (left: Val, right: Val) => {
  const bases = getBases(left, right);
  const results: [number, number][] = bases.map((basis) => {
    const exp1 = left.find(([b]) => b === basis)?.at(1) ?? 0;
    const exp2 = right.find(([b]) => b === basis)?.at(1) ?? 0;
    return [basis, exp1 + exp2];
  });

  return create(results);
};

const subtract = (left: Val, right: Val) => {
  const bases = getBases(left, right);
  const results: [number, number][] = bases.map((basis) => {
    const exp1 = left.find(([b]) => b === basis)?.at(1) ?? 0;
    const exp2 = right.find(([b]) => b === basis)?.at(1) ?? 0;
    return [basis, exp1 - exp2];
  });

  return create(results);
};

const Val = {
  /**
   * changes val into string form
   * @param val
   * @example
   * const val1 = Val.create([[2, 12], [3, 19], [5, 28]]);
   * console.log(Val.stringify(val1)); // '2;12,3;19,5;28'
   */
  stringify,
  /**
   * creates val from an array of `[basis, step]`
   * @param arr
   * @returns
   */
  create,
  /**
   * parses string into val
   * @param str
   * @example
   * const val1 = Val.parse('12,19,28');
   * console.log(val1); // [[2, 12], [3, 19], [5, 28]]
   */
  parse,
  /**
   * returns patent val for input edo up to limit
   * @param edo
   * @param limit prime limit
   * @example
   * const patentFor31Edo = Val.patentValFor(31, 7);
   * console.log(patentFor31Edo); // [[2, 31], [3, 49], [5, 72], [7, 87]]
   */
  patentValFor,
  /**
   * determines whether one val is equal to another
   * @param val1
   * @param val2
   * @returns
   */
  isEqual,
  /**
   * returns an array of `[basis, step]`
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

export default Val;
