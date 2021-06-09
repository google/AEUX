<template>
    <div class="server" >
    </div>
</template>

<script>
// import { evalScript, openPath, loadScript } from "brutalism";
import amulets from 'amulets'
import WebSocket from 'ws'
import fs from 'fs'

export default {
    props: {
        devName: {
            type: String,
            default: 'sumUX'
        },
        scriptName: {
            type: String,
            default: 'AEUX'
        },
        port: {
            type: Number,
            default: 4000
        },
    },
    data: () => ({
        server: null,
        prefs: {},
    }),
    methods: {
        newWebSocket() {
            this.server = new WebSocket.Server({port: 7240})
            this.server.on('connection', (ws) => {
                console.log('new connection');
                ws.on('message', (message) => {
                    let msg = JSON.parse(message)
                    console.log('MSG', msg);

                    if (msg.method == 'writeFiles') {
                        amulets.getPrefs()
                        .then(prefs => {
                            return prefs
                        })
                        .then(prefs => {
                            amulets.checkPath(prefs.absolutePath)
                            this.writeFiles(msg, prefs.absolutePath)
                            .then(folderPath => {
                                msg.data.layerData[0].folderPath = folderPath
                                msg.data.prefs = prefs
                                // build layers
                                amulets.evalScript('buildLayers', msg.data)
                                .then(result => {
                                    console.log('RESULT', result);
                                    ws.send(JSON.stringify(result))
                                })
                            })
                            .catch(error =>
                                ws.send(JSON.stringify(error))
                                // alert(`Catch: ${error}`)
                            )
                        })

                    } else {
                        amulets.evalScript(msg.method, msg.data)
                        .then(result => {
                            console.log('RESULT', result);
                            ws.send(JSON.stringify(result))
                        })
                    }

                    amulets.switchApps('aftereffects')
                })
            })
        },
        writeFiles(msg, path) {
            try {
            return new Promise((resolve, reject) => {
                let folderPath = (path == '') ?  window.cep.fs.showOpenDialogEx(false, true, 'Save images').data[0] : path
                if (!folderPath) {
                    reject('No path selected for images')
                }
    
                let images = msg.images;
                let fileNames = []
    
                images.forEach(image => {
                    let data = image.imgData
                    let fileName = image.name
                    fileNames.push(fileName)
    
                    let savePath = `${folderPath}/${fileName}`
    
                    fs.writeFileSync(decodeURI(savePath), data, 'base64', function(err) {
                        console.log(err);
                    });
                });

                resolve(folderPath)
            })
            } catch (error) { alert(`try/catch: ${error}`) }
        },
    },
    mounted() {
        amulets.configure({devName: this.devName, scriptName: this.scriptName})
        this.newWebSocket()        
    },
}
</script>
