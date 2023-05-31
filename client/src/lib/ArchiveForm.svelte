<script>
  import { createEventDispatcher } from "svelte";
  import { useNavigate } from "svelte-navigator";
  import { BASE_URL } from "../stores/base";

  let archiveName = ''
  let tags = ''
  let description = ''
  let isPrivate = false

  let hasResponseMessage = false
  let responseMessage = ''
  let responseMessageColor = ''

  let canCancelNavigation = false
  let cancelNavigation = false

  const dispatcher = createEventDispatcher()
  const navigate = useNavigate()

  async function submitArchive() {
    const response = await fetch($BASE_URL + '/protected/archives', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ archiveName, tags, description, isPrivate })
    })
    const data = await response.json()

    hasResponseMessage = true
    if (response.ok) {
      responseMessage = 'Archive was created, you will be redirected to it shortly, unless cancelled'
      responseMessageColor = 'green'

      archiveName = ''
      tags = ''
      description = ''
      isPrivate = false

      dispatcher('archiveCreated', data)

      canCancelNavigation = true
      setTimeout(() => {
        if (!cancelNavigation) {
          navigate('/archives/' + data.archive.id)
        } else {
          hasResponseMessage = false
          canCancelNavigation = false
        }
      }, 5000)
    } else {
      responseMessage = data.message
      responseMessageColor = 'red'
    }
  }
</script>

<div>
  {#if hasResponseMessage}
    <p style:color={responseMessageColor}>{responseMessage}</p>
  {/if}
  {#if canCancelNavigation}
  	<button class='btn btn-outline-danger' on:click={() => cancelNavigation = true}>Cancel redirect</button>
  {/if}
</div>
<form on:submit|preventDefault={submitArchive}>
  <div class='mb-3'>
    <label for='archive-name' class='form-label'>Name</label>
    <input id='archive-name' type='text' class='form-control' bind:value={archiveName}>
  </div>

  <div class='mb-3'>
    <label for='archive-tags' class='form-label'>Tags</label>
    <input id='archive-tags' type='text' class='form-control' bind:value={tags}>
  </div>

  <div class='mb-3'>
    <label for='archive-description' class='form-label'>Description</label>
    <textarea id='archive-description' type='text' class='form-control' bind:value={description}></textarea>
  </div>

  <div class="mb-3 form-check">
    <label class="form-check-label" for="is-private">Private archive</label>
    <input type="checkbox" id="is-private" class="form-check-input" bind:checked={isPrivate}>
  </div>

  <button type='submit' class='btn btn-outline-secondary'>Create</button>
</form>
