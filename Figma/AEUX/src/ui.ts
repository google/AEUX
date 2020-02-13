import * as fileType from 'file-type'
import Vue from 'vue/dist/vue.esm.js'
import * as aeux from './aeux.js'
import './ui.css'

var vm = new Vue({
	el: '#app',
	data: {
		count: null,
		thinking: false,
		footerMsg: null,
		// showfooterMsg: false,
		// prefs: {
		// 	flatten: true,
		// 	detatchFixed: true,
		// }
	},
	methods: {  
		exportSelection () {
            this.thinking = 'fetchAEUX'
            setTimeout(() => {
                parent.postMessage({ pluginMessage: { type: 'exportSelection' } }, '*')
            }, 500);
			
        },
        detachComponents () {
            parent.postMessage({ pluginMessage: { type: 'detachComponents' } }, '*')
        },
        flattenLayers () {
            parent.postMessage({ pluginMessage: { type: 'flattenLayers' } }, '*')
        },
    },
		
})

onmessage = (event) => {
    let msg = event.data.pluginMessage;
    console.log(msg);
  
	if (msg && msg.type === 'fetchAEUX') {
        // console.log(msg.imageBytesList);
        
        let aeuxData = aeux.convert(msg.data[0])		// convert layer data
        console.log(aeuxData);

        fetch(`http://127.0.0.1:7240/evalscript`, {
        method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                method: 'buildLayers',
                data: {layerData: aeuxData},
                switch: 'aftereffects',
                getPrefs: true,
            })
        })
        .then(response => {
            vm.thinking = false
            console.log(response);
            setfooterMsg(aeuxData[0].layerCount, 'sent to Ae');
            return response.json()}
        )
        .catch(e => {
            console.error(e)
            vm.thinking = false
        });
    }
    if (msg && msg.type === 'footerMsg') {
        console.log('LayerCount', msg.layerCount);
        setfooterMsg(msg.layerCount, msg.action);
    }
	if (msg && msg.type === 'fetchImagesAndAEUX') {
        vm.thinking = 'fetchAEUX'
        let aeuxData = aeux.convert(msg.data[0])		// convert layer data
        console.log(aeuxData);
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

        console.log(aeuxData);

        fetch(`http://127.0.0.1:7240/writeFiles`, {
        method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                // method: 'buildLayers',
                // data: {layerData: aeuxData},
                switch: 'aftereffects',
                // getPrefs: true,
                images: imageList
            })
        })
        .then(response => response.json())
        .then(res => {
            // Ae image export canceled
            if (res.errno == -2) {
                setfooterMsg(null, 'Image creation canceled')
                return 
            }
            console.log(res);
            aeuxData[0].folderPath = res.path
            
            fetch(`http://127.0.0.1:7240/evalscript`, {
            method: "POST",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    method: 'buildLayers',
                    data: {layerData: aeuxData},
                    // switch: 'aftereffects',
                    getPrefs: true,
                })
            })
        })
        .then( () => vm.thinking = false )
        .catch(e => {
            console.error(e)
            vm.thinking = false
        });
    }
}

function setfooterMsg(layerCount, action) {
    if (!layerCount) {
        vm.footerMsg = action
    } else if (layerCount == 1) {
        vm.footerMsg = layerCount + ' layer ' + action
    } else {
        vm.footerMsg = layerCount + ' layers ' + action
    }

    setTimeout(() => {
        vm.footerMsg = null
    }, 5000);
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