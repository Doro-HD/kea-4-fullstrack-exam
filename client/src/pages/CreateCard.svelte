<script>
  import { slide } from 'svelte/transition'
  import { useNavigate } from 'svelte-navigator';
  import Columns from '../lib/Columns.svelte'
  import { BASE_URL } from '../stores/base';
  import ProtectedRoute from '../lib/ProtectedRoute.svelte';

  export let archiveId

  let name = ''
  let tagsString = ''
  let summary = ''
  let text = ''

  let attributeName = ''
  let attributeValue = ''
  //id is used for the keyed each block when generating the attribute list
  let nextAttributeId = 1
  let attributes = []

  //used to determine if a field should display fields for editing an attribute
  let editableAttributeId = 0

  const navigate = useNavigate()

  async function createCard() {
    const tags = tagsString.split(/\s+/)

    const requestBody = { archiveId, name, tags, summary, text }
    attributes.forEach(attribute => requestBody[attribute.attributeName] = attribute.attributeValue)

    const response = await fetch($BASE_URL + '/protected/cards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(requestBody)
    })

    if (response.ok) {
      navigate('/archives/' + archiveId)
    }
  }

  function addAttribute() {
    //todo: consider adding error message to the user here
    //exit point
    if (attributeName === '' || attributeValue === '') {
      return
    }

    //todo: consider adding error message to the user here
    //exit point
    const attributeFound = attributes.find(attribute => attribute.attributeName === attributeName)
    if (attributeFound) {
      return
    }

    attributes.push({ 
      attributeName,
      attributeValue,
      tempAttributeName: attributeName,
      tempAttributeValue: attributeValue,
      id: nextAttributeId++
    })    

    attributes = attributes

    attributeName = ''
    attributeValue = ''
  }

  function removeAttribute(index) {
    attributes.splice(index, 1)
    attributes = attributes
  }

  //will redirect user back to the page for this archive
  function cancel() {
    navigate('/archives/' + archiveId)
  }
</script>

<ProtectedRoute />

<Columns expand={{ leftExpand: true }}>
  <svelte:fragment slot='center'>
    <h4>Generel information:</h4>
    <form on:submit|preventDefault={createCard}>
      <div class='mb-3'>
        <label for='card-name' class='form-label'>Name</label>
        <input id='card-name' class='form-control' bind:value={name}>
      </div>

      <div class='mb-3'>
        <label for='card-tags' class='form-label'>Tags</label>
        <input id='card-tags' class='form-control' bind:value={tagsString}>
      </div>

      <div class='mb-3'>
        <label for='card-summary' class='form-label'>Summary</label>
        <textarea id='card-summary' class='form-control' bind:value={summary}></textarea>
      </div>

      <div class='mb-3'>
        <label for='card-text' class='form-label'>Text</label>
        <textarea id='card-text' class='form-control' bind:value={text}></textarea>
      </div>

      <div class='row text-center'>
        <div class='col'>
          <button type='submit' class='btn btn-lg btn-outline-secondary'>Create card</button>
        </div>
        <div class='col'>
          <button class='btn btn-outline-danger mt-2' on:click={cancel}>Cancel</button>
        </div>
      </div>
    </form>
  </svelte:fragment>
  <svelte:fragment slot='right'>
    <h4>Attributes:</h4>
    <form on:submit|preventDefault={addAttribute}>
      <div class='mb-3'>
        <label for='attribute-name' class='form-label'>Name:</label>
        <input id='attribute-name' class='form-control' bind:value={attributeName}>
      </div>

      <div class='mb-3'>
        <label for='attribute-value' class='form-label'>Value:</label>
        <input id='attribute-value' class='form-control' bind:value={attributeValue}>
      </div>

      <button class='btn btn-outline-secondary'>Add attribute</button>
    </form>

    <br>

    <ul>
      <!-- using keyed each block to make transitions more fluent -->
      {#each attributes as attribute, i (attribute.id)}
        <li class='mb-3' transition:slide|local>
          <p>
            {attribute.attributeName}: {attribute.attributeValue}
            {#if editableAttributeId !== attribute.id}
              <span class='text-danger' on:click={() => removeAttribute(i)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle" viewBox="0 0 16 16">
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </span>
              <span class='text-secondary' on:click={() => editableAttributeId = attribute.id}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pen" viewBox="0 0 16 16">
                  <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                </svg>
              </span>
            {:else}
              <div>
                <div class='mb-3'>
                	<label for='edit-name' class='form-label'>Name:</label>
                  <input for='edit-name' type='text' class='form-control' bind:value={attribute.tempAttributeName}>
                </div>

                <div class='mb-3'>
                	<label for='edit-value-{i}' class='form-label'>Value:</label>
                  <input id='edit-value-{i}' type='text' class='form-control' bind:value={attribute.tempAttributeValue}>
                </div>

                <div class='row text-center'>
                  <div class='col'>
                    <button class='btn btn-sm btn-outline-secondary' on:click={() => {
                      editableAttributeId = 0

                      attribute.attributeName = attribute.tempAttributeName
                      attribute.attributeValue = attribute.tempAttributeValue
                    }}>Confirm</button>
                  </div>
                  <div class='col'>
                    <button class='btn btn-sm btn-outline-danger' on:click={() => {
                      editableAttributeId = 0

                      attribute.tempAttributeName = attribute.attributeName
                      attribute.tempAttributeValue = attribute.tempAttributeValue
                    }}>Cancel</button>
                  </div>
                </div>
              </div>
            {/if}
          </p>
        </li>
      {/each}
    </ul>
  </svelte:fragment>
</Columns>