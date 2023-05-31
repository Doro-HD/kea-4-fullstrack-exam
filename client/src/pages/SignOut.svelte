<script>
  import { useNavigate } from "svelte-navigator";
  import { destroySession } from '../lib/authorize.js'

  const navigate = useNavigate()

  destroySession()

  navigate('/')
</script>