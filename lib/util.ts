import { Monzo } from './monzo';
import { Val } from './val';
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
        const braket = mnz
          .getArray()
          .map(([b, e]) => Math.round(edo * Math.log2(b)) * e)
          .reduce((prev, cur) => prev + cur, 0);
        return braket === 0;
      });
    });
};

/**
 * whether the val tempers out the monzo
 * @param mnz monzo
 * @param val val
 */
const isTemperedOut = (val: Val, mnz: Monzo) => {
  return braket(val, mnz) === 0;
};

/**
 * returns braket of val and monzo
 * @param mnz monzo
 * @param val val
 */
const braket = (val: Val, mnz: Monzo) => {
  return mnz
    .getArray()
    .map(([basis, exp]) => {
      const m = val.getArray().find(([b]) => basis === b);
      if (!m) throw Error('cannot be found corresponding val basis');
      const [, vExp] = m;
      return exp * vExp;
    })
    .reduce((prev, cur) => prev + cur, 0);
};

/**
 * p_n <= n * (ln n + ln(ln n)) (n >= 4)
 * @param i
 * @returns
 */
const decideLength = (i: number) => {
  if (i === 0) return 0;
  if (i < 4) {
    return i + 2;
  }
  return Math.ceil(i * (Math.log(i) + Math.log(Math.log(i))));
};

export { getPrimesLte, getTemperOutEdos, braket, isTemperedOut, decideLength };
