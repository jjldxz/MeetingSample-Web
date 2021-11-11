<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  })
}
</script>

<style>
/* CSS */
html {
  overflow: hidden !important;
}
body {
  -webkit-app-region: drag;
  user-select: none;
}
#app {
  width: 100%;
  max-width: 100% !important;
  background: none;
}
button {
  -webkit-app-region: no-drag;
}
input {
  -webkit-app-region: no-drag;
}
textarea {
  -webkit-app-region: no-drag;
}
canvas {
  -webkit-app-region: no-drag;
}
.v-avatar {
  -webkit-app-region: no-drag;
}
.v-list-item {
  -webkit-app-region: no-drag;
}
.v-tab {
  -webkit-app-region: no-drag;
}
.v-icon {
  -webkit-app-region: no-drag;
}
.v-textarea {
  -webkit-app-region: no-drag;
}
</style>
