# xenharmonic-tool

Functions and data in Xenharmonic theory

Available in both browser and Node.js environments.


## usage

```ts
import { Monzo, getCents, getRatio, getTenneyHeight } from '@tktb-tess/xenharmonic-tool';

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


console.log(getCents(marvelComma)); // 7.711522991318361
console.log(getRatio(marvelComma)); // [ 225n, 224n ]
console.log(getTenneyHeight(marvelComma)); // 15.62113611327464

```

