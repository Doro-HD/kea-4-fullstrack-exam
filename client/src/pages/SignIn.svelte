<script>
  import { link } from 'svelte-navigator'
  import { useNavigate } from "svelte-navigator"
  import { setSession, session } from '../lib/authorize';
  import Columns from "../lib/Columns.svelte";

  let username = 'kenta'
  let password = 'admin123'

  let isInvalidSignIn = false
  let invalidUserMessage = ''

  const navigate = useNavigate()

  if (session.isAuthorized) {
    navigate('/')
  }

  async function submit() {
    const response = await fetch('http://127.0.0.1:8080/auth/signIn', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })

    const responseData = await response.json()
    if (responseData.user) {
      setSession(responseData.user.username, responseData.user.sessionExpiration)

      navigate('/')
    } else {
      isInvalidSignIn = true
      invalidUserMessage = responseData.message
    }
  }
</script>

<Columns colSize=4>
  <svelte:fragment slot='center'>
    <form on:submit|preventDefault={submit}>
      <div class='mb-3'>
        <label for='username' class='form-label'>Username</label>
        <input id='username' type='text' class='form-control' bind:value={username}>
      </div>

      <div class='mb-3'>
        <label for='password' class='form-label'>Password</label>
        <input id='password' type='password' class='form-control' bind:value={password}>
      </div>

      <div class='row'>
        <div class='col'>
          <button type='submit' class='btn btn-outline-secondary'>Sign in</button>
        </div>
        <div class='col'>
          <a href='/signUp' class='link-secondary' use:link>Dont have an account?</a>
        </div>
      </div>
    </form>
    {#if isInvalidSignIn}
    	<p>{invalidUserMessage}</p>
    {/if}
  </svelte:fragment>
</Columns>
