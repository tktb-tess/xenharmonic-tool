# xenharmonic-tool

Functions and data in Xenharmonic theory

Available in both browser and Node.js environments.

ESM only.

## Usage

```bash
npm i @tktb-tess/xenharmonic-tool
```

### Monzo

```ts
import { Monzo, getCents, getRatio, getTenneyHeight, getTemperOutEdos } from '@tktb-tess/xenharmonic-tool';

// create from array of [basis, exponent]
const marvelComma = new Monzo([
    [2, -5],
    [3, 2],
    [5, 2],
    [7, -1],
]);

// create from string form of `basis1:exponent1,basis2:exponent2,...`
const syntonicComma = Monzo.parse('2:-4,3:4,5:-1');

// if bases are omitted, they will be filled with prime numbers from 2 in ascending order.
// a following monzo is equal to the previous one.
const syntonicComma2 = Monzo.parse('-4,4,-1');

// gets some values
console.log(marvelComma.getCents()); // 7.711522991318361
console.log(marvelComma.getRatio()); // [225n, 224n]
console.log(marvelComma.getTenneyHeight()); // 15.62113611327464

console.log(marvelComma.toString()): // 2:-5,3:2,5:2,7:-1

// gets an array of EDOs whose patent val tempers out the monzos
console.log(getTemperOutEdos(100, marvelComma, syntonicComma)); // [12, 19, 31, 43, 50, 62, 74, 81, 93]

```

### Val

```ts
import { Val, Monzo, isTemperedOut } from '@tktb-tess/xenharmonic-tool';

// create from array of [basis, exponent]
const sampleVal = new Val([
    [2, 12],
    [3, 19],
    [2, 28],
]);

// create from string form of `basis1;exponent1,basis2;exponent2,...`
const sampleVal2 = Val.parse('2;19,3;30,5;44,7;53');

// bases can be omitted, will be filled like the same as monzo
const sampleVal2 = Val.parse('19,30,44,53');

// creates 13-limit patent val for 22EDO
const patentValFor22Edo = Val.patentValFor(22, 13);

console.log(patentValFor22Edo.toString()): // 2;22,3;35,5;51,7;62,11;76,13;81

const marvelComma = Monzo.parse('-5,2,2,-1');

// whether or not the val tempers out the monzo
console.log(isTemperedOut(patentValFor22Edo, marvelComma)); // true

```

