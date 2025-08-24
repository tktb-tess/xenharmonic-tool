import { bailliePSW } from '@tktb-tess/util-fns';
import { writeFileSync } from 'node:fs';

console.log('start.');
const pList = Array(2 ** 20)
  .fill(0)
  .map((_, i) => BigInt(i))
  .filter((n) => bailliePSW(n))
  .map((p) => Number(p));


console.log(pList.length, 'primes');
writeFileSync('lib/prime-list.json', JSON.stringify(pList));
console.log('end.');
