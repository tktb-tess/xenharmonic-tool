import { Monzo } from './monzo';
import { Val } from './val';

/**
 * returns braket of val and monzo
 * @param mnz monzo
 * @param val val
 */
export const braket = (val: Val, mnz: Monzo) => {
  return mnz
    .getArray()
    .map(([basis, exp]) => {
      const m = val.getArray().find(([b]) => basis === b);
      if (!m)
        throw Error(`Unexpected error: couldn't find corresponding val basis`);

      return exp * m[1];
    })
    .reduce((prev, cur) => prev + cur, 0);
};

/**
 * whether the val tempers out the monzo
 * @param mnz monzo
 * @param val val
 */
export const isTemperedOut = (val: Val, mnz: Monzo) => {
  return braket(val, mnz) === 0;
};

/**
 * returns an array of EDOs whose patent val tempers out input monzo
 * @param mnz
 * @param maxEdo
 * @returns
 */
export const getTemperOutEdos = (maxEdo: number, ...monzos: Monzo[]) => {
  if (maxEdo < 1) throw RangeError('`maxEdo` must be positive');
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
