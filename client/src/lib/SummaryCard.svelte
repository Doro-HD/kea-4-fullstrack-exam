<script>
  import { link } from "svelte-navigator";

  export let title
  export let tags
  export let description
  export let resourceLink
  export let linkText
</script>

<div class='card mb-3'>
  <div class='card-header'>
    <h3 class='card-title text-center'>{title}</h3>
    {#each tags as tag}
      <span class='badge rounded-pill text-bg-secondary me-1'>{tag}</span>
    {/each}
  </div>
  <div class='card-body'>
    <p class='card-text'>{description}</p>
  </div>
  <div class='card-footer text-center'>
    <a href={resourceLink} class='link-secondary' use:link>{linkText}</a>
  </div>
</div>