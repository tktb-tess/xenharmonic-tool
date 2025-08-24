import type Monzo from './monzo';
import pUnder20bits from './prime-list.json';

const getPUnder20bits = (i: number) => {
    if (i >= pUnder20bits.length) {
        throw Error('exceeded length');
    }
    return pUnder20bits[i];
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

export { getCents, getRatio, getTENorm, getTenneyHeight, getVenedettiHeight, getPUnder20bits };
