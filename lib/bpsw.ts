const residue = (n: bigint, modulo: bigint): bigint => {
  if (modulo < 0n) modulo *= -1n;
  const ans = n % modulo;
  return ans < 0n ? ans + modulo : ans;
};

const modPow = (base: bigint, power: bigint, mod: bigint) => {
  if (mod < 1n) throw RangeError('`mod` must be positive');
  if (power < 0n) throw RangeError('`power` must not be negative');

  base = residue(base, mod);

  if (mod === 1n) return 0n;
  if (base % mod === 1n || base % mod === 0n) return base;
  if (base === mod - 1n) return power & 1n ? mod - 1n : 1n;

  let result = 1n;

  while (power > 0n) {
    if (power & 1n) result = (result * base) % mod;
    base = (base * base) % mod;
    power >>= 1n;
  }
  return result;
};

const jacobiSymbol = (a: bigint, n: bigint) => {
  if (n < 1n || n % 2n === 0n) {
    throw RangeError('`n` is out of range');
  }

  while (a < 0n) {
    a += n;
  }
  a %= n;

  let result = 1n;
  while (a !== 0n) {
    while (a % 2n === 0n) {
      a /= 2n;
      const nMod8 = n % 8n;
      if (nMod8 === 3n || nMod8 === 5n) {
        result *= -1n;
      }
    }
    [a, n] = [n, a];

    if (a % 4n === 3n && n % 4n === 3n) {
      result *= -1n;
    }
    a %= n;
  }

  return n === 1n ? result : 0n;
};

export const isSquare = (n: bigint) => {
  if (n < 0n) return false;
  if (n === 0n) return true;
  let x = 1n;
  let y = n;
  while (x + 1n < y) {
    const mid = (x + y) / 2n;

    if (mid * mid < n) {
      x = mid;
    } else {
      y = mid;
    }
  }
  return n === x ** 2n || n === (x + 1n) ** 2n;
};

/*
 * translated from python codes in
 * https://github.com/armchaircaver/Baillie-PSW/blob/623b2541b8c659dcb4312a3ddc6c00802e34f1a1/baillie_psw.py
 *
 */

const millerRabin = (n: bigint) => {
  if (n <= 1n) return false;
  if (n % 2n === 0n) return n === 2n;
  let d_ = n - 1n;
  let s_ = 0n;

  while (d_ % 2n === 0n) {
    d_ >>= 1n;
    s_ += 1n;
  }
  const [d, s] = [d_, s_];

  const a = 2n;
  let y = modPow(a, d, n);

  if (y === 1n) return true;

  for (let i = 0n; i < s; i++) {
    if (y === n - 1n) return true;
    y = (y * y) % n;
  }
  return false;
};

const DChooser = (n: bigint): [bigint, bigint] => {
  let D = 5n;
  let j = jacobiSymbol(D, n);

  while (j > 0n) {
    D = D > 0n ? D + 2n : D - 2n;
    D *= -1n;

    if (D === -15n && isSquare(n)) {
      // The value of D isn't 0, but we are just communicating
      // that we have found a square
      return [0n, 0n];
    }
    j = jacobiSymbol(D, n);
  }
  return [D, j];
};

const div2Mod = (x: bigint, n: bigint) => {
  return (x & 1n) === 1n ? residue((x + n) >> 1n, n) : residue(x >> 1n, n);
};

const UVSubscript = (
  k: bigint,
  n: bigint,
  P: bigint,
  D: bigint,
): [bigint, bigint] => {
  let U = 1n;
  let V = P;
  const digits = k.toString(2).slice(1);

  for (const digit of digits) {
    [U, V] = [residue(U * V, n), div2Mod(V * V + D * U * U, n)];

    if (digit === '1') {
      [U, V] = [div2Mod(P * U + V, n), div2Mod(D * U + P * V, n)];
    }
  }

  return [U, V];
};

const lucasSPP = (n: bigint, D: bigint, P: bigint, Q: bigint) => {
  if (n % 2n !== 1n) {
    throw RangeError('`n` must be odd');
  }
  let d = n + 1n;
  let s = 0n;

  while (d % 2n === 0n) {
    d >>= 1n;
    s += 1n;
  }
  //console.log('d:', d, 's:', s);

  const [U, V_] = UVSubscript(d, n, P, D);
  let V = V_;

  //console.log('U:', U, 'V:', V);

  if (U === 0n) return true;

  Q = modPow(Q, d, n);

  for (let i = 0n; i < s; i++) {
    //console.log(i, V, Q);
    if (V === 0n) return true;

    V = residue(V * V - 2n * Q, n);
    Q = modPow(Q, 2n, n);
  }
  return false;
};

const smallPrimes: readonly bigint[] = [
  2n,
  3n,
  5n,
  7n,
  11n,
  13n,
  17n,
  19n,
  23n,
  29n,
  31n,
  37n,
  41n,
  43n,
  47n,
  53n,
  59n,
  61n,
  67n,
  71n,
  73n,
  79n,
  83n,
  89n,
  97n,
  101n,
  103n,
  107n,
  109n,
  113n,
  127n,
  131n,
  137n,
  139n,
  149n,
  151n,
  157n,
  163n,
  167n,
  173n,
  179n,
  181n,
  191n,
  193n,
  197n,
  199n,
  211n,
  223n,
  227n,
  229n,
  233n,
  239n,
  241n,
  251n,
  257n,
  263n,
  269n,
  271n,
  277n,
  281n,
  283n,
  293n,
  307n,
  311n,
  313n,
  317n,
  331n,
  337n,
  347n,
  349n,
  353n,
  359n,
  367n,
  373n,
  379n,
  383n,
  389n,
  397n,
  401n,
  409n,
  419n,
  421n,
  431n,
  433n,
  439n,
  443n,
  449n,
  457n,
  461n,
  463n,
  467n,
  479n,
  487n,
  491n,
  499n,
];

export const bailliePSW = (n: bigint): boolean => {
  if (n <= 1n) return false;
  if (n % 2n === 0n) return n === 2n;

  // 小さな素数で試し割り
  for (const p of smallPrimes) {
    if (n % p === 0n) {
      return n === p;
    }
  }

  if (!millerRabin(n)) {
    return false;
  }

  const [D, j] = DChooser(n);
  if (j === 0n) return false;

  const Q = (1n - D) / 4n;
  return lucasSPP(n, D, 1n, Q);
};
