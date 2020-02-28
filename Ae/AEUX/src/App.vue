<template>
  <div id="app">
    <Menus />
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
// import menus from "./components/menus.vue";

// Dynamic CSS variables that automatically handle all app themes and changes:
// https://github.com/Inventsable/starlette
// import starlette from "starlette";

// Dynamic identification object that reports all panel and host information:
// https://github.com/Inventsable/CEP-Spy
// import spy from "cep-spy";

export default {
  name: "app",
  components: {
    AEUX,
    // menus
  },
  data: () => ({
    // csInterface: null,
    // vulcan: null
  }),
  created() {
    // this.csInterface = new CSInterface();
    // this.vulcan = new Vulcan();
  },
  mounted() {
    // console.clear();
    // starlette.init();
    // this.csInterface = new CSInterface();
    // this.csInterface.addEventListener("console", this.consoler);

    // // Utility components already mounted prior to this
    // console.log(
    //   `${spy.extName} ${spy.extVersion} : ${spy.isDev ? "DEV" : "BUILD"}`
    // );

    // this.loadUniversalScripts();
  },
  methods: {
    // dispatchEvent(name, data) {
    //   var event = new CSEvent(name, "APPLICATION");
    //   event.data = data;
    //   this.csInterface.dispatchEvent(event);
    // },
    // loadScript(path) {
    //   this.csInterface.evalScript(`$.evalFile('${path}')`);
    // },
    // loadUniversalScripts() {
    //   // Preloads any script located inside ./src/host/universal
    //   let utilFolder = window.cep.fs.readdir(
    //     `${spy.path.root}/src/host/universal/`
    //   );
    //   if (!utilFolder.err) {
    //     let valids = utilFolder.data.filter(file => {
    //       return /\.(jsx|jsfl)$/.test(file);
    //     });
    //     valids.forEach(file => {
    //       this.loadScript(`${spy.path.root}/src/host/universal/${file}`);
    //     });
    //   }
    //   // Preloads any script located in ./src/host/[appName]/
    //   let hostFolder = window.cep.fs.readdir(
    //     `${spy.path.root}/src/host/${spy.appName}/`
    //   );
    //   if (!hostFolder.err) {
    //     let valids = hostFolder.data.filter(file => {
    //       return /\.(jsx|jsfl)$/.test(file);
    //     });
    //     valids.forEach(file => {
    //       this.loadScript(`${spy.path.root}/src/host/${spy.appName}/${file}`);
    //     });
    //   } else {
    //     console.log(
    //       `${spy.path.root}/src/host/${spy.appName} has no valid files or does not exist`
    //     );
    //   }
    // },
  }
};
</script>

<style>

</style>
