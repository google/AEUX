/*jshint esversion: 6, asi: true */

// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})

// call the plugin from the webview
document.getElementById('button').addEventListener('click', () => {
  window.postMessage('nativeLog', 'Called from the webview')
})

// call the wevbiew from the plugin
window.setRandomNumber = (randomNumber) => {
  document.getElementById('answer').innerHTML = 'Random number from the plugin: ' + randomNumber
}

window.setDarkMode = (darkMode) => {
    vm.darkMode = darkMode
}
window.setFooterMsg = (msg) => {
    vm.setFooterMsg(msg)
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
            // window.postMessage('nativeLog', 'Called from the webview')
            window.postMessage('fetchAEUX')
            this.thinking = 'pushJson'
        },
        setFooterMsg(msg) {
            this.footerMsg = msg

            setTimeout(() => {
                this.footerMsg = null
            }, 5000);
        }
    }
})