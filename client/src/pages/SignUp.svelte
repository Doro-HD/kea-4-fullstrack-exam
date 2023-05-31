<script>
  import { link, useNavigate } from 'svelte-navigator'
  import { setSession } from '../lib/authorize.js'
  import { BASE_URL } from '../stores/base';
  import Columns from "../lib/Columns.svelte";

  const navigate = useNavigate()

  let username = ''
  let password = ''

  async function signUp() {
    const response = await fetch($BASE_URL + '/auth/signUp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    })

    const data = await response.json()
    console.log(data)

    
    if (response.ok) {
      setSession(data.user.username, data.user.sessionExpiration)

      navigate('/')
    }
  }
</script>

<Columns colSize=4>
  <svelte:fragment slot='center'>
    <form on:submit|preventDefault={signUp}>
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
          <button type='submit' class='btn btn-outline-secondary'>Sign up</button>
        </div>
        <div class='col'>
          <a href='/signIn' class='link-secondary' use:link>Already have an account?</a>
        </div>
      </div>
    </form>
  </svelte:fragment>
</Columns>