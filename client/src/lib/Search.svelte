<script>
  import { createEventDispatcher } from "svelte";
  import { BASE_URL } from "../stores/base";

  export let path
  export let query = ''
  export let resourceName


  if (query.length > 0) {
    query += '&'
  }

  let name = ''
  let tags = ''

  const dispatcher = createEventDispatcher()

  async function searchByName() {
    let queryString = '?' + query

    if (name !== '') {
      queryString += 'name=' + name + '&'
    }

    if (tags !== '') {
      queryString += 'tags=' + tags
    }

    const response = await fetch($BASE_URL + path + queryString, {
      credentials: 'include'
    })
    const data = await response.json()

    dispatcher('searching', data)
  } 
</script>

<form on:submit|preventDefault={searchByName}>
  <div class='mb-3'>
    <label for='{resourceName}-name' class='form-label'>{resourceName} name</label>
    <input id='{resourceName}-name' type='text' class='form-control' bind:value={name}>
  </div>

  <div class='mb-3'>
    <label for='{resourceName}-tags' class='form-label'>{resourceName} tags</label>
    <input id='{resourceName}-tags' type='text' class='form-control' bind:value={tags}>
  </div>

  <button type='submit' class='btn btn-outline-secondary'>Search</button>
</form>
