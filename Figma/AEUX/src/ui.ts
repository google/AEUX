import * as fileType from 'file-type'
import Vue from 'vue/dist/vue.esm.js'
import * as aeux from './aeux.js'
import { saveAs } from 'file-saver';
import './ui.css'
var vm = new Vue({
	el: '#app',
	data: {
		count: null,
		thinking: false,
        footerMsg: null,
        imagePath: null,
        btnMsg: 'Getting layer data',
        btnCancel: 'Cancel',
        prefs: {
            exportRefImage: false,
            imgSaveDialog: false,
        }
	},
	methods: {  
        exportSelection(e) {
            if (!this.thinking) {
                this.thinking = 'fetchAEUX'
                setTimeout(() => {
                    let shiftKey = e.shiftKey
                    parent.postMessage({ pluginMessage: { type: 'exportSelection', exportJSON: shiftKey } }, '*')
                }, 50);
            } else {
                // cancel
                this.thinking = null
                // parent.postMessage({ pluginMessage: { type: 'exportCancel' } }, '*')
            }
        },
        addRasterizeFlag () {
            parent.postMessage({ pluginMessage: { type: 'addRasterizeFlag' } }, '*')
        },
        // detachComponents () {
        //     parent.postMessage({ pluginMessage: { type: 'detachComponents' } }, '*')
        // },
        // flattenLayers () {
        //     parent.postMessage({ pluginMessage: { type: 'flattenLayers' } }, '*')
        // },
        // rasterizeSelection () {
        //     parent.postMessage({ pluginMessage: { type: 'rasterizeSelection' } }, '*')
        // },
        // imageRefToAe () {
        //     parent.postMessage({ pluginMessage: { type: 'imageRefToAe' } }, '*')
        // },
        setPrefs () {
            setTimeout(() => {
                parent.postMessage({ pluginMessage: { type: 'setPrefs', prefs: this.prefs } }, '*')
            }, 50);
            
        },
    },
	mounted() {
        parent.postMessage({ pluginMessage: { type: 'getPrefs', defaultPrefs: this.prefs } }, '*')      // get the prefs
    }
})

// receiving messages back from code.ts
onmessage = (event) => {
    let msg = event.data.pluginMessage;
    console.log(msg);
  
    if (msg && msg.type === 'retPrefs') {
        vm.prefs = msg.prefs 
    }

    if (msg && msg.type === 'exportAEUX') {
        // console.log(msg.imageBytesList);
        if (!msg.data) {
            setfooterMsg(null, 'Select layers first');
            return
        }
        let aeuxData = aeux.convert(msg.data[0])		// convert layer data
        console.log(aeuxData);

        var blob = new Blob([JSON.stringify(aeuxData, null, 2)], {
            type: "text/plain;charset=ansi"
        });

        saveAs(blob, "AEUX.json");
        console.log('save');

        vm.thinking = false
    }

	if (msg && msg.type === 'fetchAEUX') {
        // console.log(msg.imageBytesList);
        if (!msg.data) {
            setfooterMsg(null, 'Select layers first');
            return
        }
        
        let aeuxData = aeux.convert(msg.data[0])		// convert layer data
        console.log(aeuxData);

        const socket = new WebSocket('ws://localhost:7250')
        socket.onopen = () => {
            socket.send(
                JSON.stringify({
                    method: 'buildLayers',
                    data: { layerData: aeuxData },
                })
            )
        }
        socket.onmessage = (e) => {
            console.log('To Client:', e)
            if (e.type == 'message') {
                setfooterMsg(aeuxData[0].layerCount, 'sent to Ae')
            }
            vm.thinking = false
        }
        socket.onerror = (e) => {
            console.log('ERROR', e);
            setfooterMsg(null, 'Failed to connect to Ae');
            vm.thinking = false
        };
    }
    if (msg && msg.type === 'footerMsg') {
        // console.log('LayerCount', msg.layerCount);
        setfooterMsg(msg.layerCount, msg.action);
    }
	if (msg && msg.type === 'fetchImagesAndAEUX') {
        vm.thinking = 'fetchAEUX'
        let aeuxData = aeux.convert(msg.data[0])		// convert layer data
        // console.log(aeuxData);
        let imageList = [];

        msg.images.forEach(img => {
            const filetype = fileType(img.bytes)
            // const blob = new Blob([img.bytes], { type: filetype.mime })
            const name = img.name + '.' + filetype.ext

            imageList.push({
                name, 
                imgData: _arrayBufferToBase64(img.bytes)
            })
            // folder.file(name, blob);
        })

        if (msg.refImg) {
            aeuxData.push(msg.refImg)
        }

        console.log(aeuxData);

        const socket = new WebSocket('ws://localhost:7250')
        socket.onopen = () => {
            socket.send(
                JSON.stringify({
                    method: 'writeFiles',
                    data: { layerData: aeuxData },
                    images: imageList,
                    // switch: 'aftereffects',
                    // getPrefs: true,
                })
            )
        }
        socket.onmessage = (e) => {
            console.log('To Client:', e)
            if (e.type == 'message') {
                setfooterMsg(aeuxData[0].layerCount, 'sent to Ae')
            }
            vm.thinking = false
        }
        socket.onerror = (e) => {
            console.log('ERROR', e);
            setfooterMsg(null, 'Failed to connect to Ae');
            vm.thinking = false
        };
    }
}

function setfooterMsg(layerCount, action) {
    if (layerCount === null) {
        vm.footerMsg = action
    } else if (layerCount == 1) {
        vm.footerMsg = layerCount + ' layer ' + action
    } else {
        vm.footerMsg = layerCount + ' layers ' + action
    }

    setTimeout(() => {
        vm.footerMsg = null
    }, 5000);

    vm.thinking = false
}

function _arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
}