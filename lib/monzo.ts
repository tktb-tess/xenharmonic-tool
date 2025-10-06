import { getPrimesLte, decideLength } from './util';

export class Monzo {
  readonly #mnz: (readonly [number, number])[];
  static readonly name = 'Monzo';
  readonly [Symbol.toStringTag] = Monzo.name;

  /**
   * create Monzo
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

    // 重複する基底を全部足し合わせる
    // その後前の方を0にする
    for (let i = 0; i < arr_.length - 1; i++) {
      if (arr_[i][0] === arr_[i + 1][0]) {
        arr_[i + 1][1] += arr_[i][1];
        arr_[i][1] = 0;
      }
    }

    this.#mnz = arr_.filter(([, exp]) => exp !== 0);
  }

  /**
   * parses string into monzo
   * @param str
   * @returns
   */
  static parse(str: string) {
    if (!str.match(/^(\d+:)?-?\d+(,(\d+:)?-?\d+)*$/g)) {
      throw Error('could not parse');
    }
    const units = str.split(',');
    const pList = getPrimesLte(decideLength(units.length)).slice(
      0,
      units.length
    );
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
    return new Monzo(arr);
  }

  /**
   * into string
   * @returns
   */
  toString() {
    return this.#mnz.map(([basis, exp]) => `${basis}:${exp}`).join(',');
  }

  /**
   * returns mutable array
   * @returns
   */
  getArray(): [number, number][] {
    return this.#mnz.map(([basis, exp]) => [basis, exp]);
  }

  toJSON() {
    return this.#mnz;
  }

  static #getBases(left: Monzo, right: Monzo) {
    const bases_ = left.#mnz.map(([b]) => b).concat(right.#mnz.map(([b]) => b));
    return [...new Set(bases_)].sort((a, b) => a - b);
  }

  /**
   * add two monzos
   * @param other
   * @returns
   */
  add(other: Monzo) {
    const bases = Monzo.#getBases(this, other);
    const results: [number, number][] = bases.map((basis) => {
      const exp1 = this.#mnz.find(([b]) => b === basis)?.at(1) ?? 0;
      const exp2 = other.#mnz.find(([b]) => b === basis)?.at(1) ?? 0;
      return [basis, exp1 + exp2];
    });

    return new Monzo(results);
  }

  /**
   * subtract `right` from `this`
   * @param right
   * @returns
   */
  subtract(right: Monzo) {
    const bases = Monzo.#getBases(this, right);
    const results: [number, number][] = bases.map((basis) => {
      const exp1 = this.#mnz.find(([b]) => b === basis)?.at(1) ?? 0;
      const exp2 = right.#mnz.find(([b]) => b === basis)?.at(1) ?? 0;
      return [basis, exp1 - exp2];
    });

    return new Monzo(results);
  }

  /**
   * returns a cent value of an input monzo
   * @returns
   */
  getCents() {
    return this.#mnz
      .map(([basis, exp]) => 1200 * exp * Math.log2(basis))
      .reduce((prev, cur) => prev + cur, 0);
  }

  /**
   * returns a bigint array with length 2 representing a numerator and a denominator of an input monzo ratio
   * @param
   * @returns `[numerator, denominator]`
   */
  getRatio(): [bigint, bigint] {
    const num = this.#mnz
      .filter(([, exp]) => exp > 0)
      .map(([basis, exp]) => BigInt(basis) ** BigInt(exp))
      .reduce((prev, cur) => prev * cur, 1n);

    const denom = this.#mnz
      .filter(([, exp]) => exp < 0)
      .map(([basis, exp]) => BigInt(basis) ** -BigInt(exp))
      .reduce((prev, cur) => prev * cur, 1n);

    return [num, denom];
  }

  /**
   * returns a Tenney height of an input monzo
   * @param
   * @returns
   */
  getTenneyHeight() {
    return this.#mnz
      .map(([basis, exp]) => Math.log2(basis) * Math.abs(exp))
      .reduce((prev, cur) => prev + cur, 0);
  }

  /**
   * returns Tenney-Euclidean norm of input monzo
   * @param
   * @returns
   */
  getTENorm() {
    const ms = this.#mnz
      .map(([basis, exp]) => (Math.log2(basis) * exp) ** 2)
      .reduce((prev, cur) => prev + cur, 0);

    return Math.sqrt(ms);
  }

  /**
   * returns Venedetti height of input monzo
   * @param
   * @returns
   */
  getVenedettiHeight() {
    return this.#mnz
      .map(([basis, exp]) => BigInt(basis) ** BigInt(Math.abs(exp)))
      .reduce((prev, cur) => prev * cur, 1n);
  }

  /**
   * returns array of period-seperated basis (or null) and monzo vector
   * @param monzo
   * @returns `[period-separated basis string (if the same as normal basis, will be null), monzo vector string]`
   */
  getMonzoVector(): [string | null, string] {
    const bases = this.#mnz.map(([b]) => b);
    const values = this.#mnz.map(([, v]) => v);

    const pList = getPrimesLte(decideLength(bases.length)).slice(
      0,
      bases.length
    );

    const vStr = values.length > 0 ? values.join('\x20') : '0';
    return isEqualBasis(bases, pList)
      ? [null, `[${vStr}\u27e9`]
      : [`${bases.join('.')}`, `[${vStr}\u27e9`];
  }
}

const isEqualBasis = (one: number[], another: number[]) => {
  if (one.length !== another.length) return false;
  const { length } = one;
  for (let i = 0; i < length; i++) {
    if (one[i] !== another[i]) return false;
  }
  return true;
};

// const fromRatio: (num: bigint, denom: bigint) => Val;
