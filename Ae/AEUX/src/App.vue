<template>
    <div id="app">
        <Menus debug refresh />
        <Panel>
            <Server v-if="isServer" devName="sumUX" scriptName="AEUX" :port="7240" />
            <AEUX v-else />
        </Panel>
    </div>
</template>

<script>

import AEUX from '@/components/AEUX.vue'
// import Server from '@/components/Server.vue'
import Server from 'amulets/VueComponents/Server'

export default {
    data: () => ({
        isServer: false,
    }),
    components: {
        AEUX,
        Server,
    },
    mounted() {
        this.isServer = window.__adobe_cep__.getExtensionId().split('.').pop() == 'server'
    }
}
</script>

<style>

</style>
