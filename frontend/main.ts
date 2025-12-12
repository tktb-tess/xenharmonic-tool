import * as X from '@tktb-tess/xenharmonic-tool';
import type { Commas } from './vite-env';

const url = `https://tktb-tess.github.io/commas/out/commas.json`;

const c: Commas = await fetch(url).then((r) => r.json());

const rationals = c.commas.filter((c) => c.commaType === 'rational');

const mnzs = rationals.map(({ name, monzo }) => ({
  name: name[0],
  monzo: new X.Monzo(monzo),
}));

const rows = mnzs.map(({ name, monzo }) => {
  const tr = document.createElement('tr');
  const ntd = document.createElement('td');
  const mtd = document.createElement('td');
  const movtd = document.createElement('td');
  ntd.textContent = name;
  const cents = monzo.getCents();
  mtd.textContent = `${
    cents < 0.1 ? cents.toExponential(4) : cents.toFixed(4)
  } cents`;
  const { basis, monzo: monzoS } = monzo.getMonzoVector();
  movtd.textContent = basis ? `${basis}\u3000${monzoS}` : monzoS;
  tr.append(ntd, mtd, movtd);
  return tr;
});

const tbody = document.createElement('tbody');
tbody.append(...rows);
const table = document.createElement('table');
table.append(tbody);
const app = document.getElementById('app')!;
app.append(table);

const o = { ...X, __proto__: null, [Symbol.toStringTag]: 'XenTool' } as const;

Object.defineProperty(window, 'XenTool', {
  value: o,
  enumerable: true,
});
