import { bailliePSW } from '@tktb-tess/util-fns';
import { writeFileSync } from 'node:fs';

console.log('start.');
const limit = 2 ** 20;
const arrayLength = limit / 8;
const buf = Buffer.alloc(arrayLength);

for (let i = 0; i < arrayLength; i++) {
  let byte = 0;
  for (let j = 0; j < 8; j++) {
    if (bailliePSW(BigInt(8 * i + j))) {
      byte += 1 << j;
    }
  }
  buf[i] = byte;
}

writeFileSync('lib/prime-list.bin', buf);
console.log('end.');
