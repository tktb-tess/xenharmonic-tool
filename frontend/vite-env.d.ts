/// <reference types="vite/client" />

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

export type { Commas };
