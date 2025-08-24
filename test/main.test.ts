import { it, expect } from 'vitest';
import { getPUnder20bits } from '../dist/main';

it('test1', async () => {
  const p = await getPUnder20bits(20000);
  console.log(p);
  expect(typeof p).toBe('number');
});

