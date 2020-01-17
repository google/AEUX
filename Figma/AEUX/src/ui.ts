import * as fileType from 'file-type'
import Vue from 'vue/dist/vue.esm.js'
import * as aeux from './aeux.js'
// import Lore from '/Users/adamplouff/Dropbox/Projects/Code/npm/lore-server/index.js'
import './ui.css'

// const lore = new Lore(7240)

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
            console.log(response);
            return response.json()}
        )
        .catch(e => {
            console.error(e)
        });
    }
    if (msg && msg.type === 'footerMsg') {
        console.log('LayerCount', msg.layerCount);
        footerMessage(msg.layerCount, msg.action);
    }
	if (msg && msg.type === 'exportJsonAndImages') {
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
        .catch(e => {
            console.error(e)
        });

        

        // fetch(`http://127.0.0.1:7240/evalscript`, {
        // method: "POST",
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json'
        //     },
        //     body: JSON.stringify({
        //         method: 'buildLayers',
        //         data: {layerData: aeuxData},
        //         switch: 'aftereffects',
        //         getPrefs: true,
        //     })
        // })
        // .then(response => {
        //     console.log(response);
        //     return response.json()}
        // )
        // .catch(e => {
        //     console.error(e)
        // });
        


        // lore.message({
        //     method: 'buildLayersAndImages',
        //     layerData: aeuxData,
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
    if (!layerCount) {
        vm.footerMessage = action
    } else if (layerCount == 1) {
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