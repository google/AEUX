/*jshint esversion: 6, asi: true */

// disable the context menu (eg. the right click menu) to have a more native feel
document.addEventListener('contextmenu', (e) => {
  e.preventDefault()
})


window.setDarkMode = (darkMode) => {
    vm.darkMode = darkMode
}
window.setPrefs = (prefs) => {
    if (prefs) {
        vm.prefs = prefs
    }
}
window.flashUI = (darkMode) => {
    vm.darkMode = !vm.darkMode
    setTimeout(() => {
        vm.darkMode = !vm.darkMode
    }, 100);
    setTimeout(() => {
        vm.darkMode = darkMode
    }, 200);
}
window.setFooterMsg = (msg) => {
    vm.setFooterMsg(msg)
    vm.thinking = false;
}
import Vue from 'vue/dist/vue.min.js'

var vm = new Vue({
    el: '#app',
    data: {
        darkMode: false,
        thinking: false,
        footerMsg: null,
        prefs: {
            exportRefImage: false,
        }
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
        rasterizeGroups() {
            window.postMessage('rasterizeGroups')
            this.thinking = 'rasterizeGroups'
        },
        setFooterMsg(msg) {
            this.footerMsg = msg

            setTimeout(() => {
                this.footerMsg = null
            }, 5000);
        },
        setPrefs() {
            setTimeout(() => {
                window.postMessage('setPrefs', JSON.stringify(this.prefs))
            }, 50);
        },
    }
})