<script>
  import { onMount } from 'svelte';
  import { BASE_URL } from '../stores/base';
  import ProtectedRoute from '../lib/ProtectedRoute.svelte'
  import Columns from '../lib/Columns.svelte'
  import SummaryCard from '../lib/SummaryCard.svelte';
  import Search from '../lib/Search.svelte';
  import StaticDrawer from '../lib/StaticDrawer.svelte'
  import ArchiveForm from '../lib/ArchiveForm.svelte';

  //isSelf defines weather it is the user's own archives that should be retrieved
  export let isSelf

  const apiUrl = `/protected/archives`
  const query = 'self=true'

  let archives = []

  onMount(async () => {
    const response = await fetch($BASE_URL + apiUrl +  '?' + query, {
      credentials: 'include'
    })

    if (!response.ok) {
      throw new Error('Could not get archives.')
    }

    const data = await response.json()

    archives = data.archives
  })

  function addArchive(event) {
    archives.push(event.detail.archive)
    archives = archives
  }

  function searchResult(event) {
    archives = event.detail.archives
  }
</script>

<ProtectedRoute />

<Columns colSize='8' borderLess={true}>
  <svelte:fragment slot='left'>
    <Search
      on:searching={searchResult}
      path={apiUrl }
      query={query}
      resourceName='Archive'
    />
  </svelte:fragment>
  <svelte:fragment slot='center'>
    {#if isSelf}
    	<h1 class='display-4 text-center'>Your Archives</h1>

      <div class='d-grid gap-2 my-3'>
        <StaticDrawer
          title='Creating new Archive'
          openText='Create new Archive'
        >
          <ArchiveForm on:archiveCreated={addArchive}/>
        </StaticDrawer>
      </div>
    {:else}
    	<h1 class='display-4 text-center'>Public Archives</h1>
    {/if}
    {#each archives as archive}
      <SummaryCard
        title={archive.archiveName}
        tags={archive.tags}
        description={archive.description}
        resourceLink={'/archives/' + archive._id}
        linkText='Visit Archive'
      />
    {/each}
  </svelte:fragment>
</Columns>

