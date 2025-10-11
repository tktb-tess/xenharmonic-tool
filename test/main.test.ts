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

  // console.log('val31edo:', val31edo.toString());
  // console.log('check:', check.toString());

  expect(Val.isEqual(val31edo, check)).toBe(true);
});

it('generating monzo correctly', () => {
  const kleisma = new Monzo([
    [2, -6],
    [3, -5],
    [5, 6],
  ]);
  const kleisma2 = Monzo.parse('-6,-5,6');
  // console.log('cent1:', cent1);
  // console.log('cent2:', cent2);

  expect(Monzo.isEqual(kleisma, kleisma2)).toBe(true);
});

it('generating monzo correctly 2', () => {
  const magicComma = Monzo.parse('-10,-1,5');
  const ratio1 = magicComma.getRatio().join('/');
  const ratio2 = '3125/3072';
  // console.log('ratio1:', ratio1);
  // console.log('ratio2:', ratio2);
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

    // console.log('temperingOutEdos:', ...temperingOutEdos);
    expect(temperingOutEdos.every((edo) => edo % 9 === 0)).toBe(true);
  });
});

describe('detecting tempering out correctly', () => {
  const val22 = Val.patentValFor(22, 13);
  const val31 = Val.patentValFor(31, 7);
  const syntonicComma = Monzo.parse('-4,4,-1');
  const archytasComma = Monzo.parse('6,-2,7:-1');
  const marvelComma = Monzo.parse('-5,2,2,-1');
  // console.log('val22:', val22.getArray());
  // console.log('val31:', val31.getArray());

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

  const mnzs = commas
    .filter((c) => c.commaType === 'rational')
    .map(({ monzo, name }) => [name[0], new Monzo(monzo)] as const);

  const sample = JSON.stringify(Object.fromEntries(mnzs.slice(0, 10)));
  // console.log(sample);
  expect(sample).includes('[');
});

describe('stringify and parse', () => {
  it('monzo', () => {
    const mnz = Monzo.parse('-4,4,-1');
    const mnz2 = Monzo.parse(mnz.toString());

    expect(Monzo.isEqual(mnz, mnz2)).toBe(true);
  });
  it('val', () => {
    const val = Val.patentValFor(29, 13);
    const val2 = Val.parse(val.toString());

    expect(Val.isEqual(val, val2)).toBe(true);
  });
});
