import { it, expect } from 'vitest';
import {
  getCents,
  getRatio,
  getTENorm,
  getTenneyHeight,
  Monzo,
  Val,
} from '../dist/bundle';

it('generating patent val correctly', () => {
  const val31edo = Val.patentValOf(31, 19);
  const check = Val.parse('31,49,72,87,107,115,127,132');

  console.log(Val.stringify(val31edo), Val.stringify(check));

  expect(Val.stringify(val31edo)).toBe(Val.stringify(check));
});

it('generating monzo correctly', () => {
  const kleisma = Monzo.create([
    [2, -6],
    [3, -5],
    [5, 6],
  ]);
  const kleisma2 = Monzo.parse('-6,-5,6');
  const cent1 = getCents(kleisma);
  const cent2 = getCents(kleisma2);
  console.log(cent1, cent2);
  expect(cent1).toBe(cent2);
});

it('generating monzo correctly 2', () => {
  const magicComma = Monzo.parse('-10,-1,5');
  const ratio1 = getRatio(magicComma).join('/');
  const ratio2 = '3125/3072';
  console.log(ratio1, ratio2);
  expect(ratio1).toBe(ratio2);
});

it('managing empty array correctly', () => {
  const unison = Monzo.create([]);
  console.log('cent:', getCents(unison));
  console.log('ratio:', getRatio(unison).join('/'));
  console.log('Tenney height:', getTenneyHeight(unison));
  console.log('TE norm:', getTENorm(unison));
  expect(getCents(unison)).toBe(0);
});

it('?', () => {
  const marvelComma = Monzo.create([
    [2, -5],
    [3, 2],
    [5, 2],
    [7, -1],
  ]);
  console.log(getCents(marvelComma));
  console.log(getRatio(marvelComma));
  console.log(getTenneyHeight(marvelComma));
  expect(true).toBe(true);
});
