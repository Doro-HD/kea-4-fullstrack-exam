<script>
  import { useNavigate } from 'svelte-navigator';
  import { session } from '../lib/authorize'

  const navigate = useNavigate()
  
  if (!$session.username) {
    navigate('/')
  }
</script>