import type Monzo from './monzo';
import type Val from './val';
import { bailliePSW } from '@tktb-tess/util-fns';

/**
 * returns an array of primes in the range of `i` or less
 * @param i
 * @returns
 */
const getPrimesLte = (i: number) => {
  return [...Array(i)]
    .map((_, i) => BigInt(i + 1))
    .filter((n) => bailliePSW(n))
    .map((p) => Number(p));
};

/**
 * returns a cent value of an input monzo
 * @param mnz
 * @returns
 */
const getCents = (mnz: Monzo) => {
  return mnz
    .map(([basis, exp]) => 1200 * exp * Math.log2(basis))
    .reduce((prev, cur) => prev + cur, 0);
};

/**
 * returns a bigint array with length 2 representing a numerator and a denominator of an input monzo ratio
 * @param mnz
 * @returns `[numerator, denominator]`
 */
const getRatio = (mnz: Monzo): [bigint, bigint] => {
  const num = mnz
    .filter(([, exp]) => exp > 0)
    .map(([basis, exp]) => BigInt(basis) ** BigInt(exp))
    .reduce((prev, cur) => prev * cur, 1n);

  const denom = mnz
    .filter(([, exp]) => exp < 0)
    .map(([basis, exp]) => BigInt(basis) ** -BigInt(exp))
    .reduce((prev, cur) => prev * cur, 1n);

  return [num, denom];
};

/**
 * returns a Tenney height of an input monzo
 * @param mnz
 * @returns
 */
const getTenneyHeight = (mnz: Monzo) => {
  return mnz
    .map(([basis, exp]) => Math.log2(basis) * Math.abs(exp))
    .reduce((prev, cur) => prev + cur, 0);
};

/**
 * returns Tenney-Euclidean norm of input monzo
 * @param mnz
 * @returns
 */
const getTENorm = (mnz: Monzo) => {
  const ms = mnz
    .map(([basis, exp]) => (Math.log2(basis) * exp) ** 2)
    .reduce((prev, cur) => prev + cur, 0);

  return Math.sqrt(ms);
};

/**
 * returns Venedetti height of input monzo
 * @param mnz monzo
 * @returns
 */
const getVenedettiHeight = (mnz: Monzo) => {
  return mnz
    .map(([basis, exp]) => BigInt(basis) ** BigInt(Math.abs(exp)))
    .reduce((prev, cur) => prev * cur, 1n);
};

/**
 * returns an array of EDOs whose patent val tempers out input monzo
 * @param mnz
 * @param maxEdo
 * @returns
 */
const getTemperOutEdos = (maxEdo: number, ...monzos: Monzo[]) => {
  if (maxEdo < 1) throw Error('`maxEdo` must be positive');
  return [...Array(maxEdo)]
    .map((_, i) => i + 1)
    .filter((edo) => {
      return monzos.every((mnz) => {
        const inner = mnz
          .map(([b, e]) => Math.round(edo * Math.log2(b)) * e)
          .reduce((prev, cur) => prev + cur, 0);
        return inner === 0;
      });
    });
};

/**
 * whether the val tempers out the monzo
 * @param mnz monzo
 * @param val val
 */
const isTemperedOut = (mnz: Monzo, val: Val) => {
  const braket = mnz
    .map(([basis, exp]) => {
      const m = val.find(([b]) => basis === b);
      if (!m) throw Error('cannot be found corresponding val basis');
      const [, vExp] = m;
      return exp * vExp;
    })
    .reduce((prev, cur) => prev + cur, 0);
  return braket === 0;
};

export {
  getCents,
  getRatio,
  getTENorm,
  getTenneyHeight,
  getVenedettiHeight,
  getPrimesLte,
  getTemperOutEdos,
  isTemperedOut,
};
