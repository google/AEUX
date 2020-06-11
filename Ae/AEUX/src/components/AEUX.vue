<template>
    <Wrapper v-if="prefsLoaded">
        <!-- <Dropzone /> -->
        <Row margin="0 auto 8px auto">
            <Button-Group 
                :active="(prefs.newComp) ? 0 : 1" 
                exclusive 
                @update="val => setPref('newComp', val == 0)">
                <Button 
                    prefix-icon="plus" 
                    label="New Comp" 
                    tooltip="Add layers to new comp"
                    tall 
                    margin="0px" />
                <Button
                    prefix-icon="arrow-down"
                    label="Current"
                    tooltip="Add layers to open comp"
                    tall
                    margin="0px" />
            </Button-Group>
        </Row>

        <Fold
			label="Options"
			:open="true"
            prefs-id="foldOptions">
            <Dropdown
                v-show="prefs.newComp"
                :items="compScaleOptions"
                :active="prefs.compScale - 1"
                label="Comp size multiplier"
                label-to-right
                @update="val => setPref('compScale', parseInt(compScaleOptions[val].value) + 1)"
            />
            <Input-Scroll 
                v-show="prefs.newComp"
                label='Frame rate:' 
                lazy
                suffix="fps" 
                @change="val => setPref('frameRate', val)"
                :value="prefs.frameRate"
                :reset-value="prefs.frameRate"
                :min="1" 
                :max="99" />
            <Input-Scroll 
                v-show="prefs.newComp"
                label='Comp duration:' 
                lazy
                suffix="seconds" 
                @change="val => setPref('duration', val)"
                :value="prefs.duration"
                :reset-value="prefs.duration"
                :min="1" 
                :max="1000" />
			<Toggle
				label="Detect parametric shapes"
				:state="prefs.parametrics"
				@update="val => setPref('parametrics', val)"
			/>
			<Toggle
				label="Precomp groups"
				:state="prefs.precompGroups"
				@update="val => setPref('precompGroups', val)"
			/>
		</Fold>

        <Fold label="Groups" 
            :open="false"
            prefs-id="foldGroups">
			<Button-Group grid column>
				<Button
					left
					tall
					icon-size="20px"
					prefix-icon="image-filter-center-focus-weak"
                    tooltip="Group selected layers"
					label="Precomp"
                    @click="aeCall('groupToPrecomp')"
				/>
				<Button
					left
					tall
					icon-size="20px"
					prefix-icon="arrow-expand-all"
                    tooltip="Expand layers from selected precomps"
					label="Un-Precomp"
                    @click="aeCall('precompToLayers')"
				/>
				<Button
					left
					tall
					icon-size="20px"
					prefix-icon="eye-off"
                    tooltip="Show/hide all guide layers"
					label="Toggle guide layer visibility"
                    @click="aeCall('toggleGroupVisibility')"
				/>
				<Button
					left
					tall
					icon-size="20px"
					prefix-icon="delete"
                    tooltip="Remove all AEUX created guide layers"
					label="Delete group layers"
                    @click="aeCall('deleteGroupLayers')"
				/>
			</Button-Group>
		</Fold>

        <Fold label="System" 
            :open="false" 
            prefs-id="foldSystem">
            <Button 
                block 
                goto="https://aeux.io" 
                tooltip="aeux.io"
                @click.alt.native="openConfig">
                Learn stuff
            </Button>
            <Panel-Info name uppercase version>
                <i>Brought to you by your friends at Google motion design</i>
            </Panel-Info>
        </Fold>
        <Footer :footerMessage.sync="footerMessage" />
    </Wrapper>
</template>

<script>
/*jshint esversion: 6, asi: true*/


// import { log } from "util";
import fs from 'fs'
import amulets from 'amulets'

amulets.configure({
    devName: 'sumUX',
    scriptName: 'AEUX'
})

export default {
    // components: {
    // },
	data: () => ({
        aeuxVersion: 0.7,
		prefs: {
			newComp: true,
			precompGroups: false,
			parametrics: true,
			compScale: 3,
			frameRate: 60,
			duration: 5,
        },
        prefsLoaded: false,
		compScaleOptions: [
			{label: '1x', value: '0'},
			{label: '2x', value: '1'},
			{label: '3x', value: '2'},
			{label: '4x', value: '3'},
			{label: '5x', value: '4'},
            {label: '6x', value: '5'},
		],
        footerMessage: null,
        docLink: 'https://docs.google.com/document/d/1weEWK3uJbsnHHO5rlSq95hVi9rGlPd9q1t2bf1glbQk/edit?usp=sharing',
        // docLink: 'http://aeux.io',
	}),
	methods: {
    aeCall (msg) {
        amulets.evalScript(msg)
    },
    openDocLink () {
        amulets.webLink(this.docLink)
    },
    openConfig () {
        amulets.openUserFolder('config')
    },
    //// read the prefs file outside of the signed extension at intitialization
    // getPrefs() {
    //     this.prefs = amulets.getPrefs(this.prefs)
    //     console.log('prefs', this.prefs);
    //     this.prefsLoaded = true
    // },
    // getPrefsSync() {
    //     /// read the layer data file
    //     let prefs = fs.readFileSync(this.userPath + 'config/prefs.json')
    //     console.log(prefs);
        
    //     return JSON.parse(prefs) || this.prefs
    // },
    //// save prefs to disk
    // savePrefs() {
    //     amulets.savePrefs(this.prefs)
    // },
    //// collapse/expand panel groups
    // fold(name) {
    //     this.prefs.expand[name] = !this.prefs.expand[name]
    //     this.savePrefs()
    // },
    //// set pref and save to prefs file
    setPref (pref, value) {
        this.prefs[pref] = value
        console.log(pref, this.prefs[pref]);
        amulets.savePrefs(this.prefs)
        // this.savePrefs()      
    },
    //// message to AE to start building layers from JSON
    // buildLayers(data) {
    //   // console.log('data');
    //   // alert(JSON.stringify(data, false, 2))
    //   let prefs = amulets.getPrefs()
    // //   let prefs = this.getPrefsSync()
    //   /// compare Ae panel version with Sketch panel version
    //   // if (data[0].aeuxVersion > this.aeuxVersion) {
    //   //     var msgData = {
    //   //         text: data[0].hostApp + ' is using a newer version of AEUX. Please download the updated Ae extension.',
    //   //         url: toolDocUrl,
    //   //     }
    //   //     evalScript('updateAePanel', msgData);
    //   //     return;
    //   // }

    //   /// obj to stringify and send to AE
    //   var compObj = {
    //       prefs: {
    //         newComp: prefs.newComp,
    //         parametrics: prefs.parametrics,
    //         compScale: prefs.compScale,
    //         precompGroups: prefs.precompGroups,
    //         frameRate: prefs.frameRate || 60,
    //       },
    //       layerData: data,
    //       // sourcePath: path.split('/').slice(0,-1).join('/'),
    //   }        


    //   amulets.evalScript( 'buildLayers', compObj ).then((results) => {
    //       /// error msg because the json returned nothing
    //       console.log(JSON.parse(results));
          
    //       if (!JSON.parse(results)) {
    //           this.footerMessage = 'Open an existing comp first';
    //           return;
    //       }

    //       /// show footer message
    //       var msg = JSON.parse(results).msg;
    //       this.footerMessage = this.parseFooterMessages(msg);
    //   });
    //   this.newLayers = false;
    // },
        
//// read a file from disk then send json data to AE to build layers
    // buildLayersFromFile (path, updateBgFiles) {
	// 		fs.readFile(path, 'utf8', (err, layerData) => {
	// 			var parsedData = JSON.parse(layerData);

	// 			/// compare Ae panel version with Sketch panel version
	// 			if (parsedData[0].aeuxVersion > versionNumber) {
	// 				var msgData = {
	// 					text: parsedData[0].hostApp + ' is using a newer version of AEUX. Please download the updated Ae extension.',
	// 					url: toolDocUrl,
	// 				}
	// 				evalScript('updateAePanel', msgData);
	// 				return;
	// 			}

	// 			/// obj to stringify and send to AE
	// 			var compObj = {
	// 				prefs: {
	// 					newComp: this.prefs.newComp,
	// 					parametrics: this.prefs.parametrics,
	// 					compScale: this.prefs.compScale,
	// 					precompGroups: this.prefs.precompGroups,
	// 					frameRate: this.prefs.frameRate || 60,
	// 				},
	// 				layerData: parsedData,
	// 				sourcePath: path.split('/').slice(0,-1).join('/'),
	// 			}
    //             console.log('compObj');
    //             buildLayers(compObj);


    //             /// dropping a file to update the admin files
    //             if (updateBgFiles) {
    //                 // console.log(parsedData)
    //                 var updateTime = new Date().getTime();
    //                 var manifest = {
    //                     updateTime: updateTime,
    //                     artboardName: parsedData[0].name,
    //                     layerCount: parsedData[0].layerCount,
    //                   }

    //                 this.prefs.updateTime = updateTime;
    //                 this.prefs.artboard = {
    //                     name: parsedData[0].name,
    //                     layerCount: parsedData[0].layerCount,
    //                 }
    //                 this.savePrefs();
    //                 checkDir(userPath + 'msg/');
    //                 save_text(userPath + 'msg/manifest.json', JSON.stringify(manifest, false, 2));
    //                 save_text(userPath + 'msg/aeux.json', layerData);
    //             }
	// 		});
    // },
        parseFooterMessages(msg) {
            /// reset var
            var messagesToPost = [];

            /// available messages
            var messages = [
                null,
                'Unsupported:\nText gradient fills',
                'Unsupported:\nAngular gradients',
                'Unsupported:\nComp width exceeds 30,000px',
                'Unsupported:\nComp height exceeds 30,000px',
                'Error:\nCan\'t save preset file',
                'Error:\nCan\'t locate image file',
                'Error:\nFigma image downloads CC2018+',
            ]

            /// filter out duplicate messages
            var uniqueMessages = msg.filter( onlyUnique );

            /// add all messages into an array
            for (var i = 0; i < uniqueMessages.length; i++) {
                // if (i == 0) {
                    // messagesToPost.push('Unsupported:')
                // }
                messagesToPost.push(messages[ uniqueMessages[i] ])
            }

            /// create one string from all the messages
            return messagesToPost.join('\n');

            function onlyUnique(value, index, self) {
                return self.indexOf(value) === index;
            }
        },
		//// open dialog for reading a file from disk
		// openFile: function () {
		// 	var path = window.cep.fs.showOpenDialog();  
		// 	console.log(path);
			          
        //     // vm.buildLayersFromFile(path);

		// },
		openBetaDoc () {
            amulets.webLink('https://docs.google.com/document/d/1weEWK3uJbsnHHO5rlSq95hVi9rGlPd9q1t2bf1glbQk/edit?usp=sharing')
        }
	},
	computed: {
		// Use as this.app
		// app() {
		// 	return this.$root.$children[0];
		// },
		// Use as this.cs
		// cs() {
		// 	return this.app.csInterface;
        // },
        // userPath() {
        //     return this.cs.getSystemPath(SystemPath.USER_DATA) + '/sumUX/AEUX/'
        // },
        // spy() {
        //     return require("cep-spy").default;
        // },
	},
	mounted() {      
        amulets.getPrefs(this.prefs)
        .then(prefs => { 
            console.log(prefs);
            
            this.prefs = prefs 
            this.prefsLoaded = true
        })
        // amulets.newServer(port_ae)
	}
}

</script>

<style>

</style>
