import {
  Monzo,
  getCents,
  getRatio,
  getTenneyHeight,
  getTENorm,
} from '../dist/bundle';

const app = document.getElementById('app')!;

const marvel = Monzo.parse('-84,53');

app.innerHTML = `
<p>cents: ${getCents(marvel)}</p>
<p>ratio: ${getRatio(marvel).join('/')}</p>
<p>Tenney height: ${getTenneyHeight(marvel)}</p>
<p>TE norm: ${getTENorm(marvel)}</p>
`;
