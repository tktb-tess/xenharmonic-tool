import './main.css';
import { Monzo } from '@tktb-tess/xenharmonic-tool/monzo';
import { Val } from '@tktb-tess/xenharmonic-tool/val';
import * as Util from '@tktb-tess/xenharmonic-tool/util';
import type { Commas } from './vite-env';

console.log('Monzo', Monzo);
console.log('Val', Val);
console.log('Util', Util);

const url = `https://tktb-tess.github.io/commas/out/commas-neue.json`;

const c: Commas = await fetch(url).then((r) => r.json());

const rationals = c.commas.filter((c) => c.commaType === 'rational');

const mnzs = rationals.map(({ name, monzo }) => ({
  name: name[0],
  monzo: Monzo.parse(monzo),
}));

const formatCents = (cents: number) => {
  if (cents === 0 || cents >= 0.1) {
    return cents.toFixed(5);
  }

  const regex = /(?<m>\d\.\d*)e\+?(?<e>-?\d+)/;
  const groups = regex.exec(cents.toExponential(5))?.groups;
  const m = groups?.m;
  const e = groups?.e;

  if (!m || !e) {
    throw Error(`unexpected: ${cents.toExponential(5)}`);
  }

  return `${m} × 10<sup>${e}</sup>`;
};

const rows = mnzs.map(({ name, monzo }) => {
  const tr = document.createElement('tr');
  const nameTd = document.createElement('td');
  const centsTd = document.createElement('td');
  const mnzvTd = document.createElement('td');
  const mnzbTd = document.createElement('td');
  nameTd.textContent = name;
  const cents = monzo.getCents();
  const centsStr = formatCents(cents);
  centsTd.innerHTML = `${centsStr} cents`;
  centsTd.classList.add('tnum');
  const { basis, monzo: monzoS } = monzo.getMonzoVector();
  mnzvTd.textContent = monzoS;
  mnzbTd.textContent = basis;
  tr.replaceChildren(nameTd, centsTd, mnzvTd, mnzbTd);
  return tr;
});

const tbody = document.createElement('tbody');
tbody.append(...rows);
const table = document.createElement('table');
table.append(tbody);
const app = document.getElementById('app');

if (!(app instanceof HTMLDivElement)) {
  throw TypeError(Object.prototype.toString.call(app));
}

app.append(table);

const o = {
  ...Monzo,
  ...Val,
  ...Util,
  __proto__: null,
  [Symbol.toStringTag]: 'XenTool',
} as const;

Object.defineProperty(window, 'XenTool', {
  value: o,
  enumerable: true,
});
