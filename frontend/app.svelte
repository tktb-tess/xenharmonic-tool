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

<style>
  pre {
    white-space: pre-wrap;
    overflow-wrap: break-word;
  }
</style>
