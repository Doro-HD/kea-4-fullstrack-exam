<script>
  import { onMount } from "svelte";
  import { useNavigate } from "svelte-navigator";
  import { BASE_URL } from "../stores/base";
  import Columns from '../lib/Columns.svelte'
  import SummaryCard from "../lib/SummaryCard.svelte";
  import ProtectedRoute from "../lib/ProtectedRoute.svelte";
  import Search from "../lib/Search.svelte";


  export let id

  let archiveTitle = ''
  let archiveDescription = ''
  let cards = []


  let hasFetchError = false
  let errorMessage = ''

  const navigate = useNavigate()

  onMount(async () => {
    const archiveResponse = await fetch($BASE_URL + '/protected/archives/' + id, {
      credentials: 'include'
    })

    const archiveData = await archiveResponse.json()

    //exit point
    if (!archiveResponse.ok) {
      hasFetchError = true
      errorMessage = archiveData.message || 'Server error'

      return
    }

    archiveTitle = archiveData.archive?.archiveName
    archiveDescription = archiveData?.archive.description

    const cardsResponse = await fetch($BASE_URL + '/protected/cards?archiveId=' + id, {
      credentials: 'include'
    })
    const cardsData = await cardsResponse.json()

    //exit point
    if(!cardsResponse.ok) {
      hasFetchError = true
      errorMessage = cardsData.message || 'Server error'

      return
    }

    cards = cardsData.cards
  })

  function redirectCreateCard() {
    navigate(`/archives/${id}/cards/create`)
  }

  function seachResult(event) {
    const data = event.detail

    cards = data.cards
  }
</script>

<ProtectedRoute />

{#if hasFetchError}
  <p>{errorMessage}</p>
{:else}
  <Columns colSize=8 borderLess={true}>
    <svelte:fragment slot='left'>
      <Search
        on:searching={seachResult}
        path='/protected/cards'
        query='archiveId={id}'
        resourceName='Card'
      />
    </svelte:fragment>
    <svelte:fragment slot='center'>
      <div class='text-center'>
        <h1 class='display-1'>{archiveTitle}</h1>
        <p>{archiveDescription}</p>
      </div>
      <div class='d-grid gap-2 my-3'>
        <button class='btn btn-secondary' on:click={redirectCreateCard}>Create card</button>
      </div>
      {#each cards as card}
      	<SummaryCard
          title={card.name}
          tags={card.tags}
          description={card.summary}
          resourceLink={`/archives/${id}/cards/${card._id}`}
          linkText='Look up card'
        />
      {/each}
    </svelte:fragment>
  </Columns>
{/if}