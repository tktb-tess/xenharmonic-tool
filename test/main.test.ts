import { it, expect, describe } from 'vitest';
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

describe('check tempering out Edos', () => {
  it('1', () => {
    const mercatorComma = Monzo.parse('-84,53');
    const temperingOutEdos = getTemperOutEdos(1000, mercatorComma);

    console.log('temperingOutEdos:', temperingOutEdos);
    expect(temperingOutEdos).toSatisfy((edos: number[]) => {
      return edos.every((edo) => edo % 53 === 0);
    });
  });

  it('2', () => {
    const ragisma = Monzo.parse('-1,-7,4,1');
    const breedsma = Monzo.parse('-5,-1,-2,4');
    const temperingOutEdos = getTemperOutEdos(10000, ragisma, breedsma);

    console.log('temperingOutEdos:', temperingOutEdos);
    expect(temperingOutEdos).toSatisfy((edos: number[]) => {
      return edos.every((edo) => edo % 9 === 0);
    });
  });
});

describe('detecting tempering out correctly', () => {
  const val22 = Val.patentValOf(22, 13);
  const val31 = Val.patentValOf(31, 7);
  const syntonicComma = Monzo.parse('-4,4,-1');
  const archytasComma = Monzo.parse('2:6,3:-2,7:-1');
  const marvelComma = Monzo.parse('-5,2,2,-1');
  console.log('val22:', val22);
  console.log('val31:', val31);

  it('marvel comma', () => {
    expect(marvelComma).toSatisfy((comma: Monzo) =>
      [val22, val31].every((val) => isTemperedOut(comma, val))
    );
  });

  it("Archytas' comma", () => {
    expect(archytasComma).toSatisfy((comma: Monzo) =>
      isTemperedOut(comma, val22)
    );
  });

  it('syntonic comma', () => {
    expect(syntonicComma).toSatisfy((comma: Monzo) =>
      isTemperedOut(comma, val31)
    );
  });
});
