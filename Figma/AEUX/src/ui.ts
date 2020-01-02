import * as saveAs from 'file-saver'
import * as JSZip from 'JSZip'
import * as fileType from 'file-type'
import Vue from 'vue/dist/vue.esm.js'
import * as aeux from './aeux.js'
import Lore from '/Users/adamplouff/Dropbox/Projects/Code/npm/lore-server/index.js'
import './ui.css'

const lore = new Lore(7240)

var vm = new Vue({
	el: '#app',
	data: {
		count: null,
		message: 'Hey nerd!',
		showMessage: false,
		showHelp: false,
		thinking: false,
		running: false,
		footerMessage: null,
		showFooterMessage: false,
		prefs: {
			flatten: true,
			detatchFixed: true,
		}
	},
	methods: {  
		exportSelection () {
			parent.postMessage({ pluginMessage: { type: 'getSelection' } }, '*')
        },
        flattenLayers () {
            parent.postMessage({ pluginMessage: { type: 'flattenLayers' } }, '*')
        },
    },
		
})

onmessage = (event) => {
    let msg = event.data.pluginMessage;
    console.log(msg);
  
	if (msg && msg.type === 'exportJson') {
		// console.log(msg.imageBytesList);
        let aeuxData = aeux.convert(msg.data[0])		// convert layer data
        // console.log(aeuxData);

        lore.message({
            method: 'buildLayers',
            layerData: aeuxData,
        })
        .then(response => {
            if (!response.ok) {
                footerMessage('0', 'sent. \nIs AEUX open in Ae?');
            } else {
                footerMessage(aeuxData[0].layerCount, 'sent to Ae');
            }
        })
        .catch(() => {
            footerMessage('0', 'sent. \nIs AEUX open in Ae?');
        })
    }
    if (msg && msg.type === 'footerMsg') {
        console.log('LayerCount', msg.layerCount);
        footerMessage(msg.layerCount, msg.action);
    }
	if (msg && msg.type === 'exportJsonAndImages') {
        let aeuxData = aeux.convert(msg.data[0])		// convert layer data

        // const zip = new JSZip()
        //     const folder = zip.folder('AEUX')

        msg.images.forEach(img => {
            const filetype = fileType(img.bytes)
            const blob = new Blob([img.bytes], { type: filetype.mime })
            const name = img.name + '.' + filetype.ext

            aeuxData[0].images.push({
                name, 
                imgData: _arrayBufferToBase64(img.bytes)
            })
            // folder.file(name, blob);
        })

        console.log(aeuxData);
        
        lore.message({
            method: 'buildLayersAndImages',
            layerData: aeuxData,
        })
            
            // folder.file('AEUX.json', JSON.stringify(aeuxData, undefined, 2))

            // zip.generateAsync({type: 'blob'})
            // .then(blob => saveAs(blob, 'AEUX.zip'))
            // .then(() => {
            //     console.log('test');
                
            //     lore.message({
            //         method: 'buildLayersFromZip',
            //         layerData: aeuxData,
            //     })
            // })
            // .catch(e => console.log(e));

        // if (msg.images.length < 2) {
        //     // log just export a single image and lore the data across
        //     const img = msg.images[0]
        //     const filetype = fileType(img.bytes)
        //     const blob = new Blob([img.bytes], { type: filetype.mime })
        //     const name = img.name + '.' + filetype.ext

        //     saveAs(blob, name)
        //     setTimeout(() => {
        //         console.log('aeuxData', aeuxData);
                
        //         lore.message({
        //             method: 'buildLayers',
        //             layerData: aeuxData,
        //         })
        //     }, 500);

        
        // } else {
        // multi image export
            // const zip = new JSZip()
            // const folder = zip.folder('AEUX')

            // msg.images.forEach(img => {
            //     const filetype = fileType(img.bytes)
            //     const blob = new Blob([img.bytes], { type: filetype.mime })
            //     const name = img.name + '.' + filetype.ext   

            //     folder.file(name, blob);
            // })
            
            // folder.file('AEUX.json', JSON.stringify(aeuxData, undefined, 2))

            // zip.generateAsync({type: 'blob'})
            // .then(blob => saveAs(blob, 'AEUX.zip'))
            // .then(() => {
            //     console.log('test');
                
            //     lore.message({
            //         method: 'buildLayersFromZip',
            //         layerData: aeuxData,
            //     })
            // })
            // .catch(e => console.log(e));
        // }
        
	}
}
// onmessage = (event) => {
// 	let msg = event.data.pluginMessage;
// 	if (msg && msg.type === 'exportJson') {
// 		console.log(msg.imageBytesList);
// 		let aeuxData = aeux.convert(msg.data[0])		// convert layer data
		
// 		let blob = new Blob([JSON.stringify(aeuxData, undefined, 2)], {
// 			type: "text/plain;charset=ansi"
// 		});

// 		saveAs(blob, "AEUX.json");
// 		console.log('save');
// 	}
// 	if (msg && msg.type === 'exportJsonAndImages') {
//         const zip = new JSZip()
//         const folder = zip.folder('AEUX')
//         let aeuxData = aeux.convert(msg.layers[0])		// convert layer data

//         msg.images.forEach(img => {
//             const filetype = fileType(img.bytes)
//             const blob = new Blob([img.bytes], { type: filetype.mime })
//             const name = img.name + '.' + filetype.ext;

//             folder.file(name, blob);
//         })
        
//         folder.file('AEUX.json', JSON.stringify(aeuxData, undefined, 2))

//         zip.generateAsync({type: 'blob'})
//         .then(blob => saveAs(blob, 'AEUX.zip'))
//         .catch(e => console.log(e));
// 	}
// }

function footerMessage(layerCount, action) {
    if (layerCount == 1) {
        vm.footerMessage = layerCount + ' layer ' + action
    } else {
        vm.footerMessage = layerCount + ' layers ' + action
    }

    setTimeout(() => {
        vm.footerMessage = null
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