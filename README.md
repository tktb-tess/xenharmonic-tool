# xenharmonic-tool

Functions and data in Xenharmonic theory

Available in both browser and Node.js environments.


## Usage

### Monzo

```ts
import { Monzo, getCents, getRatio, getTenneyHeight, getTemperOutEdos } from '@tktb-tess/xenharmonic-tool';

// create from array of [basis, exponent]
const marvelComma = Monzo.create([
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
console.log(getCents(marvelComma)); // 7.711522991318361
console.log(getRatio(marvelComma)); // [225n, 224n]
console.log(getTenneyHeight(marvelComma)); // 15.62113611327464

// gets an array of EDOs whose patent val tempers out the monzo
console.log(getTemperOutEdos(marvelComma, 100)); //

```

### Val

```ts
import { Val, isTemperedOut } from '@tktb-tess/xenharmonic-tool';

// create from array of [basis, exponent]
const sampleVal = Val.create([
    [2, 12],
    [3, 19],
    [2, 28],
]);

// create from string form of `basis1;exponent1,basis2;exponent2,...`
const sampleVal2 = Val.parse('2;19,3;30,5;44,7;53');

// bases can be omitted, will be filled like the same as monzo
const sampleVal2 = Val.parse('19,30,44,53');

// creates 13-limit patent val for 22EDO
const patentValFor22Edo = Val.patentValOf(22, 13);


const marvelComma = Monzo.parse('-5,2,2,-1');

// whether or not the val tempers out the monzo
console.log(isTemperedOut(marvelComma, patentValFor22Edo)); // true




```

