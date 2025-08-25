import { it, expect } from 'vitest';
import {
  getCents,
  getRatio,
  getTENorm,
  getTenneyHeight,
  Monzo,
  Val,
  getTemperOutEdos,
  isTemperedOut,
} from '../dist/bundle';

it('generating patent val correctly', () => {
  const val31edo = Val.patentValOf(31, 19);
  const check = Val.parse('31,49,72,87,107,115,127,132');

  console.log('val31edo:', Val.stringify(val31edo));
  console.log('check:', Val.stringify(check));

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
  console.log('cent1:', cent1);
  console.log('cent2:', cent2);
  expect(cent1).toBe(cent2);
});

it('generating monzo correctly 2', () => {
  const magicComma = Monzo.parse('-10,-1,5');
  const ratio1 = getRatio(magicComma).join('/');
  const ratio2 = '3125/3072';
  console.log('ratio1:', ratio1);
  console.log('ratio2:', ratio2);
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

it('check tempering out Edos', () => {
  const mercatorComma = Monzo.parse('-84,53');
  const temperingOutEdos = getTemperOutEdos(mercatorComma, 1000);

  console.log('temperingOutEdos:', temperingOutEdos);
  expect(temperingOutEdos).toSatisfy((edos: number[]) => {
    return edos.every((edo) => edo % 53 === 0);
  });
});

it('detecting tempering out correctly', () => {
  const val12 = Val.patentValOf(12, 5);
  const val19 = Val.patentValOf(19, 5);
  const val31 = Val.patentValOf(31, 5);
  const val43 = Val.patentValOf(43, 5);
  const syntonicComma = Monzo.parse('-4,4,-1');
  console.log('val12:', val12);
  console.log('val19:', val19);
  console.log('val31:', val31);
  console.log('val43:', val43);

  expect([val12, val19, val31, val43]).toSatisfy((vals: Val[]) =>
    vals.every((v) => isTemperedOut(syntonicComma, v))
  );
});
