/// <reference types="vite/client" />

interface BaseCoomaData {
  readonly id: string;
  readonly name: string[];
  readonly colorName: readonly [string, string];
  readonly namedBy?: string;
}

interface RationalCommaData extends BaseCoomaData {
  readonly commaType: 'rational';
  readonly monzo: (readonly [number, number])[];
}

interface IrrationalCommaData extends BaseCoomaData {
  readonly commaType: 'irrational';
  readonly ratio: string;
  readonly cents: number;
}

type CommaData = RationalCommaData | IrrationalCommaData;

type CommaMetadata = {
  readonly lastUpdate: string;
  readonly numberOf: number;
};

type Commas = {
  readonly metadata: CommaMetadata;
  readonly commas: CommaData[];
};

export { Commas, CommaData };
