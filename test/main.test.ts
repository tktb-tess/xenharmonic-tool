import { it, expect, describe } from 'vitest';
import {
  Monzo,
  Val,
  getTemperOutEdos,
  isTemperedOut,
} from '@tktb-tess/xenharmonic-tool';

type CommaType =
  | {
      readonly commaType: 'rational';
      readonly monzo: (readonly [number, number])[];
    }
  | {
      readonly commaType: 'irrational';
      readonly ratio: string;
      readonly cents: number;
    };

type CommaData = CommaType & {
  readonly id: string;
  readonly name: string[];
  readonly colorName: readonly [string, string];
  readonly namedBy?: string;
};

type CommaMetadata = {
  readonly lastUpdate: string;
  readonly numberOf: number;
};

type Commas = {
  readonly metadata: CommaMetadata;
  readonly commas: CommaData[];
};

it('generating patent val correctly', () => {
  const val31edo = Val.patentValFor(31, 19);
  const check = Val.parse('31,49,72,87,107,115,127,132');

  console.log('val31edo:', val31edo.toString());
  console.log('check:', check.toString());

  expect(Val.isEqual(val31edo, check)).toBe(true);
});

it('generating monzo correctly', () => {
  const kleisma = new Monzo([
    [2, -6],
    [3, -5],
    [5, 6],
  ]);
  const kleisma2 = Monzo.parse('-6,-5,6');
  const cent1 = kleisma.getCents();
  const cent2 = kleisma2.getCents();
  console.log('cent1:', cent1);
  console.log('cent2:', cent2);
  expect(cent1).toBe(cent2);
});

it('generating monzo correctly 2', () => {
  const magicComma = Monzo.parse('-10,-1,5');
  const ratio1 = magicComma.getRatio().join('/');
  const ratio2 = '3125/3072';
  console.log('ratio1:', ratio1);
  console.log('ratio2:', ratio2);
  expect(ratio1).toBe(ratio2);
});

it('managing empty array correctly', () => {
  const unison = new Monzo([]);
  console.log('cent:', unison.getCents());
  console.log('ratio:', unison.getRatio().join('/'));
  console.log('Tenney height:', unison.getTenneyHeight());
  console.log('TE norm:', unison.getTENorm());
  expect(unison.getCents()).toBe(0);
});

describe('check tempering out Edos', () => {
  it('Mercator', () => {
    const mercatorComma = Monzo.parse('-84,53');
    const temperingOutEdos = getTemperOutEdos(1000, mercatorComma);

    // console.log('temperingOutEdos:', temperingOutEdos);
    expect(temperingOutEdos.every((edo) => edo % 53 === 0)).toBe(true);
  });

  it('ennealimmal', () => {
    const ragisma = Monzo.parse('-1,-7,4,1');
    const breedsma = Monzo.parse('-5,-1,-2,4');
    const temperingOutEdos = getTemperOutEdos(10000, ragisma, breedsma);

    console.log('temperingOutEdos:', ...temperingOutEdos);
    expect(temperingOutEdos.every((edo) => edo % 9 === 0)).toBe(true);
  });
});

describe('detecting tempering out correctly', () => {
  const val22 = Val.patentValFor(22, 13);
  const val31 = Val.patentValFor(31, 7);
  const syntonicComma = Monzo.parse('-4,4,-1');
  const archytasComma = Monzo.parse('6,-2,7:-1');
  const marvelComma = Monzo.parse('-5,2,2,-1');
  console.log('val22:', val22.getArray());
  console.log('val31:', val31.getArray());

  it('marvel comma', () => {
    expect([val22, val31].every((val) => isTemperedOut(val, marvelComma))).toBe(
      true
    );
  });

  it("Archytas' comma", () => {
    expect(isTemperedOut(val22, archytasComma)).toBe(true);
  });

  it('syntonic comma', () => {
    expect(isTemperedOut(val31, syntonicComma)).toBe(true);
  });
});

it('parse comma list', async () => {
  const url = 'https://tktb-tess.github.io/commas/out/commas.json';
  const { commas }: Commas = await fetch(url).then((r) => r.json());
  const result: [string, Monzo][] = [];

  commas.forEach((comma) => {
    if (comma.commaType === 'rational') {
      result.push([comma.name[0], new Monzo(comma.monzo)]);
    }
  });

  console.log(
    result
      .map(([name, mnz]) => `${name} ${mnz.toString()}`)
      .slice(0, 20)
      .join('\n')
  );

  expect(0).toBe(0);
});
