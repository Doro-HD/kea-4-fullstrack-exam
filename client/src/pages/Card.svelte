<script>
  import { onMount } from "svelte";
  import { useNavigate, useParams } from "svelte-navigator";
  import ProtectedRoute from "../lib/ProtectedRoute.svelte";
  import { BASE_URL } from "../stores/base";
  import Columns from "../lib/Columns.svelte";
  import Comments from "../lib/Comments.svelte";

  const params = useParams()

  let cardName = ''
  let cardTags = []
  let cardText = ''
  let cardAttributes = []

  const navigate = useNavigate()

  onMount(async () => {
    const response = await fetch($BASE_URL + '/protected/cards/' + $params.cardId, {
      credentials: 'include'
    })

    //exit point
    if (!response.ok) {

      return
    }

    const data = await response.json()

    const { _id, archiveId, name, tags, summary, text, ...attributes } = data.card

    cardName = name
    cardText = text
    cardAttributes = attributes
  })
</script>

<ProtectedRoute />

<Columns 
  expand={{ leftExpand: true }}
>
  <svelte:fragment slot='center'>
    <h1 class='display-1 text-center'>{cardName}</h1>
    <p>{cardText}</p>

    <Comments roomId={$params.cardId}/>
  </svelte:fragment>
  <svelte:fragment slot='right'>
    <ul>
      {#each Object.keys(cardAttributes) as attributeKey}
        <li>
          {attributeKey}: {cardAttributes[attributeKey]}
        </li>
      {/each}
    </ul>
  </svelte:fragment>
</Columns>