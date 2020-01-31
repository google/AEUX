/*jshint esversion: 6, asi: true */

// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  window.postMessage('nativeLog', 'Called from the webview')
})


window.setDarkMode = (darkMode) => {
    vm.darkMode = darkMode
}
window.setFooterMsg = (msg) => {
    vm.setFooterMsg(msg)
    vm.thinking = false;
    // vm.darkMode = !vm.darkMode
}
import Vue from 'vue/dist/vue.min.js'

var vm = new Vue({
    el: '#app',
    data: {
        darkMode: false,
        thinking: false,
        footerMsg: null,
    },
    methods: {
        helpLink() {
            // window.postMessage('nativeLog', 'Called from the webview')
            window.postMessage('externalLinkClicked', 'https://aeux.io')
        },
        fetchAEUX() {
            window.postMessage('fetchAEUX')
            this.thinking = 'fetchAEUX'
        },
        detachSymbols() {
            window.postMessage('detachSymbols')
            this.thinking = 'detachSymbols'
        },
        flattenCompounds() {
            window.postMessage('flattenCompounds')
            this.thinking = 'flattenCompounds'
        },
        setFooterMsg(msg) {
            this.footerMsg = msg

            setTimeout(() => {
                this.footerMsg = null
            }, 5000);
        }
    }
})