<script lang="ts">
  import {
    getCents,
    getRatio,
    getTemperOutEdos,
    Monzo,
    getMonzoVector,
  } from '../dist/bundle';
  let strForm = $state('');
  const monzo = $derived.by(() => {
    try {
      return Monzo.parse(strForm);
    } catch (e) {
      if (e instanceof Error) {
        return e;
      }
      return Error('invalid input');
    }
  });
  const marvelComma = Monzo.parse('-5,2,2,-1');
  const syntonicComma = Monzo.parse('-4,4,-1');
</script>

<label for="mnz">Monzo</label>
<input type="text" id="mnz" bind:value={strForm} />

<p>Monzo data</p>
{#if monzo instanceof Error}
  <pre>Error: {monzo.message}</pre>
{:else}
  {@const [basis, exp] = getMonzoVector(monzo)}
  <pre>
Cents: {getCents(monzo)} ¢
Ratio: {getRatio(monzo).join('/')}
Monzo: {basis} {exp}
Tempering out EDOs up to 1000:
{getTemperOutEdos(1000, monzo).join(', ')}
</pre>
{/if}

<p>{getTemperOutEdos(100, marvelComma, syntonicComma)}</p>

<style>
  pre {
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
</style>
