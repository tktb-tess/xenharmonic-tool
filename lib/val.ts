import { getPrimesLte, decideLength } from './util';

export class Val {
  readonly #val: (readonly [number, number])[];
  static readonly name = 'Val';
  readonly [Symbol.toStringTag] = Val.name;

  /**
   * create val from array
   * @param array 
   */
  constructor(array: (readonly [number, number])[]) {
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

    this.#val = arr_.filter(([, exp]) => exp !== 0);
  }

  /**
   * parse string into val
   * @param str 
   * @returns 
   */
  static parse(str: string) {
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
    return new Val(arr);
  }

  /**
   * 
   * @returns 
   */
  toString() {
    return this.#val.map(([basis, exp]) => `${basis};${exp}`).join(',');
  }

  /**
   * return patent val for given EDO and limit
   * @param edo 
   * @param limit 
   * @returns 
   */
  static patentValFor(edo: number, limit: number) {
    if (edo < 1) throw Error('`edo` must be positive');
    if (limit < 2) throw Error('`limit` must be 2 or larger');

    const pList = getPrimesLte(limit).filter((p) => p <= limit);

    const arr = pList.map((p): [number, number] => [
      p,
      Math.round(edo * Math.log2(p)),
    ]);

    return new Val(arr);
  }

  /**
   * whether two vals are the same
   * @param val1 
   * @param val2 
   * @returns 
   */
  static isEqual(val1: Val, val2: Val) {
    return val1.toString() === val2.toString();
  }

  static #getBases(left: Val, right: Val) {
    const bases_ = left.#val.map(([b]) => b).concat(right.#val.map(([b]) => b));
    return [...new Set(bases_)].sort((a, b) => a - b);
  }

  /**
   * return mutable array
   * @returns 
   */
  getArray(): [number, number][] {
    return this.#val.map(([a, b]) => [a, b]);
  }

  toJSON() {
    return this.#val;
  }

  /**
   * add two val
   * @param other 
   * @returns 
   */
  add(other: Val) {
    const bases = Val.#getBases(this, other);
    const results: [number, number][] = bases.map((basis) => {
      const exp1 = this.#val.find(([b]) => b === basis)?.at(1) ?? 0;
      const exp2 = other.#val.find(([b]) => b === basis)?.at(1) ?? 0;
      return [basis, exp1 + exp2];
    });

    return new Val(results);
  }

  /**
   * subtract `other` from `this`
   * @param other 
   * @returns 
   */
  subtract(other: Val) {
    const bases = Val.#getBases(this, other);
    const results: [number, number][] = bases.map((basis) => {
      const exp1 = this.#val.find(([b]) => b === basis)?.at(1) ?? 0;
      const exp2 = other.#val.find(([b]) => b === basis)?.at(1) ?? 0;
      return [basis, exp1 - exp2];
    });

    return new Val(results);
  }
}
