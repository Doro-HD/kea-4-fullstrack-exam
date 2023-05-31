<script>
  import { session } from '../lib/authorize.js'

  const headingClass = 'display-1'
</script>

{#if $session.username}
  <div class='text-center'>
      <h1 class={headingClass}>Welcome back {$session.username}</h1>
  </div>
{:else}
  <div class='text-center'>
    <h1 class={headingClass}>Welcome to archivist</h1>
    <p>The new upstart in the archiving world, from cooking recipies to pokemon, the sky is the limit.</p>
  </div>
{/if}
