<script>
  import { Router, Route, link } from 'svelte-navigator'
  import { BASE_COLOUR } from './stores/base.js'
  import { session } from './lib/authorize.js'
  import Home from './pages/Home.svelte'
  import SignIn from './pages/SignIn.svelte';
  import SignUp from './pages/SignUp.svelte';
  import SignOut from './pages/SignOut.svelte'
  import Archives from './pages/Archives.svelte'
  import Archive from './pages/Archive.svelte'
  import CreateCard from './pages/CreateCard.svelte'
  import Card from './pages/Card.svelte'

</script>

<Router>
  <nav class='navbar navbar-expand-lg' style='background-color: {$BASE_COLOUR};'>
    <div class='container-fluid'>
      <a class='navbar-brand' href='#'>Archivist</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class='navbar-nav me-auto mb-2 mb-lg-0'>
        {#if $session.username}
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Archives
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item" href="/archives/self" use:link>Your arhives</a></li>
              <li><a class="dropdown-item" href="/archives" use:link>Browse archives</a></li>
            </ul>
          </li>
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/signOut" use:link>Sign out</a>
          </li>
        {:else}
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/" use:link>Home</a>
          </li>
          <li class="nav-item">
            <a class="nav-link active" aria-current="page" href="/signIn" use:link>Sign in</a>
          </li>
          <li class='nav-item'>
            <a class="nav-link active" aria-current="page" href="/signUp" use:link>Sign up</a>
          </li>
        {/if}
        </ul>
      </div>
    </div>
  </nav>
  <div class='container mt-4'>
    <Route path='/'>
      <Home />
    </Route>
    <Route path='/archives/*'>
      <Route path='/'>
        <Archives isSelf={false}/>
      </Route>
      <Route path='/self'>
        <Archives isSelf={true}/>
      </Route>
      <Route path='/:archiveId/*' let:params>
        <Route path='/'>
          <Archive id={params.archiveId} />
        </Route>
        <Route path='/cards/*'>
          <Route path='/create'>
            <CreateCard archiveId={params.archiveId} />
          </Route>
          <Route path='/:cardId'>
            <Card />
          </Route>
        </Route>
      </Route>
    </Route>
    <Route path='/signOut'>
      <SignOut />
    </Route>
    <Route path='/signIn'>
      <SignIn />
    </Route>
    <Route path='/signUp'>
      <SignUp />
    </Route>
  </div>
</Router> 
