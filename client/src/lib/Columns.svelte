<script>
  export let colSize = '10'
  export let expand = {}
  export let borderLess = false

  const displayLeftBorder = $$slots.left && !borderLess
  const displayRightBorder = $$slots.right && !borderLess
</script>

<div class='row'>
  {#if !expand.leftExpand}
    <div class='col' class:left-divider={displayLeftBorder}>
      <slot name='left' />
    </div>
  {/if}
  <div class='col-{colSize}'>
    <slot name='center' />
  </div>
  <div class='col' class:right-divider={displayRightBorder}>
    <slot name='right' />
  </div>
</div>

<style>
  div.left-divider {
    border-right: 1px solid grey
  }

  div.right-divider {
    border-left: 1px solid grey
  }
</style>