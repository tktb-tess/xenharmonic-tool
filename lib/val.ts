import { getPrimesLte } from './util';

const __val_brand: unique symbol = Symbol();

type Val = (readonly [number, number])[] & {
  [__val_brand]: unknown;
};

/**
 * changes val into string form \
 * e.g. `[[2, 12], [3, 19], [5, 28]]` (12edo) -> `2;12,3;19,5;28`
 * @param val
 * @returns
 */
const stringify = (val: Val) =>
  val.map(([basis, exp]) => `${basis};${exp}`).join(',');

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

  // 重複する基底を消す
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i][0] === arr[i + 1][0]) {
      arr[i][1] = 0;
    }
  }

  return arr.filter(([, exp]) => exp !== 0) as (readonly [
    number,
    number
  ])[] as Val;
};

const decideLength = (i: number) => {
  if (i === 0) return 0;
  if (i < 4) {
    return i + 2;
  }
  return Math.ceil(i * (Math.log(i) + Math.log(Math.log(i))));
};

const parse = (str: string) => {
  if (!str.match(/^(\d+;)?-?\d+(,(\d+;)?-?\d+)*$/g)) {
    throw Error('could not parse');
  }
  const units = str.split(',');
  const pList = getPrimesLte(decideLength(units.length));
  const arr = units.map((s, i): [number, number] => {
    if (s.match(/^-?\d+$/g)) {
      return [pList[i], Number(s)];
    } else if (s.match(/^\d+;-?\d+$/g)) {
      const [b, e] = s.split(';');
      return [Number(b), Number(e)];
    } else {
      throw Error('could not parse');
    }
  });
  return create(arr);
};

const patentValOf = (edo: number, limit: number) => {
  if (edo < 1) throw Error('`edo` must be positive');
  if (limit < 2) throw Error('`limit` must be 2 or larger');

  const pList = getPrimesLte(limit);
  const arr = pList.map((p): [number, number] => [
    p,
    Math.round(edo * Math.log2(p)),
  ]);

  return create(arr);
};

const Val = {
  stringify,
  create,
  parse,
  patentValOf,
};

export default Val;
