<template>
  <div id="app">
    <Panel>
        <AEUX />
    </Panel>
  </div>
</template>

<script>
// You can access this App.vue file from any other component via `this.$root.$children[0]`
// See `./components/HelloWorld.vue` for example of CSInterface and this.app

// Create your own components and import them here
import AEUX from "./components/AEUX.vue";

// Dynamic identification object that reports all panel and host information:
// https://github.com/Inventsable/CEP-Spy
import spy from "cep-spy";

export default {
  name: "app",
  components: {
    AEUX,
  },
  data: () => ({
    
  }),
  methods: {

  }
};
</script>

<style>

</style>
