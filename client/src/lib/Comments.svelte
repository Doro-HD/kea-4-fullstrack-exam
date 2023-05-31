<script>
  import { onMount, onDestroy } from "svelte";
  import { useParams } from "svelte-navigator";
  import io from 'socket.io-client'
  import { BASE_URL } from "../stores/base";
    import { slide } from "svelte/transition";

  export let roomId

  const params = useParams()

  let socket

  let text = ''
  let comments = []

  onMount(async () => {
    const response = await fetch($BASE_URL + '/protected/comments?cardId=' + $params.cardId, {
      credentials: 'include'
    })


    //todo: add error message
    if (!response.ok) {

      return
    }

    const data = await response.json()
    comments = data.comments

    socket = io($BASE_URL)
    socket.emit('join-comment-section', { roomId })

    socket.on('comment-created', data => addComment(data.comment))
  })

  onDestroy(() => {
    socket.emit('leave-comment-section', { roomId })
  })

  async function createComment() {
    const sentAt = new Date().toISOString()

    const response = await fetch($BASE_URL + '/protected/comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ cardId: $params.cardId, sentAt, text })
    })

    //exit point
    if (!response.ok) {
      //todo: add error message
      
      return
    }

    const data = await response.json()

    socket.emit('comment-request', { roomId, comment: data.comment })
    addComment(data.comment)
  }

  function addComment(comment) {
    comments.push(comment)
    comments = comments

    text = ''
  }
</script>

<form on:submit|preventDefault={createComment}>
  <div class='mb-3'>
    <textarea bind:value={text}></textarea>
  </div>

  <button class='btn btn-outline-secondary'>Comment</button>
</form>

{#each comments as comment}
  <!-- comment.sentAt is an iso string, not very user friendly so we format it -->
  {@const date = new Intl.DateTimeFormat('da').format(new Date(comment.sentAt))}
  <div class='card mb-3' transition:slide|local>
    <div class='card-body'>
      <h5 class='card-title'>{comment.username}</h5>
      <h6 class='card-subtitle text-body-secondary mb-3'>{date}</h6>

      <p class='card-text'>{comment.text}</p>
    </div>
  </div>
{/each}