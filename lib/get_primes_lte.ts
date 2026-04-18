import { bailliePSW } from './bpsw';

export const getPrimesLte = (i: number) => {
  return [...Array(i)]
    .map((_, i) => BigInt(i + 1))
    .filter((n) => bailliePSW(n))
    .map((p) => Number(p));
};
