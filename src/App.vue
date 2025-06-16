<template>
  <router-view />
</template>

<script setup>
// No script needed for App.vue now, as routing handles the views
</script>

<style>
html,
body,
#app {
  height: 100%;
  margin: 0;
  padding: 0;
}

html:not(.resume-preview) {
  font-family: 'Lato', sans-serif !important;
}

</style>
