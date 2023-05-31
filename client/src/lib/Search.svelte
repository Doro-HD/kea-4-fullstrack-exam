<script>
  import { createEventDispatcher } from "svelte";

  export let url
  export let options = {}

  let name = ''
  let tags = ''

  const dispatcher = createEventDispatcher()

  async function searchByName() {
    let queryString = ''

    if (name !== '') {
      queryString += '&name=' + name
    }

    if (tags !== '') {
      queryString += '&tags=' + tags
    }

    const response = await fetch(url + queryString, options)
    const data = await response.json()

    dispatcher('searching', data)
  } 
</script>

<form on:submit|preventDefault={searchByName}>
  <div class='mb-3'>
    <label for='archive-name' class='form-label'>Archive name</label>
    <input id='archive-name' type='text' class='form-control' bind:value={name}>
  </div>

  <div class='mb-3'>
    <label for='archive-tags' class='form-label'>Archive tags</label>
    <input id='archive-tags' type='text' class='form-control' bind:value={tags}>
  </div>

  <button type='submit' class='btn btn-outline-secondary'>Search</button>
</form>
