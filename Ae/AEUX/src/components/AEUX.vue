<template>
    <Wrapper v-if="prefsLoaded">
        <Dropzone />
        <!-- <Button-Group :active="prefs.newComp" exclusive> -->
        <Button-Group :active="(prefs.newComp) ? 0: 1" exclusive @update="val => setPref('newComp', val == 0)">
			<Button prefix-icon="plus" label="New Comp" tall margin="0px" />
			<Button
				prefix-icon="arrow-down"
				label="Current"
				tall
				margin="0px"
			/>
		</Button-Group>
        <Dropdown
			v-show="prefs.newComp"
			:items="compScaleOptions"
			:active="prefs.compScale - 1"
			label="Comp size multiplier"
			label-to-right
			@update="val => setPref('compScale', parseInt(compScaleOptions[val].value) + 1)"
		/>

        <Fold
			label="Options"
			:open="prefs.expand.options"
            @clicked="fold('options')"
            :margin-top="!prefs.newComp ? '6px' : ''"
		>
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
            :open="prefs.expand.groups"
            @clicked="fold('groups')">
			<Button-Group grid column>
				<Button
					left
					tall
					icon-size="20px"
					prefix-icon="image-filter-center-focus-weak"
					label="Precomp"
                    @click="aeCall('groupToPrecomp')"
				/>
				<Button
					left
					tall
					icon-size="20px"
					prefix-icon="arrow-expand-all"
					label="Un-Precomp"
                    @click="aeCall('precompToLayers')"
				/>
				<Button
					left
					tall
					icon-size="20px"
					prefix-icon="eye-off"
					label="Toggle guide layer visibility"
                    @click="aeCall('toggleGroupVisibility')"
				/>
				<Button
					left
					tall
					icon-size="20px"
					prefix-icon="delete"
					label="Delete group layers"
                    @click="aeCall('deleteGroupLayers')"
				/>
			</Button-Group>
		</Fold>

        <Fold label="System" :open="prefs.expand.system" @clicked="fold('system')">
            <Button block goto="https://aeux.io" @altClick="openConfig">Learn stuff</Button>
            <Panel-Info name uppercase version>
                <i>Brought to you by your friends at Google motion design</i>
            </Panel-Info>
        </Fold>
    </Wrapper>
  <!-- <div class="content" v-if="prefsLoaded">
            <div class="build-source">
                    <div class="button-group">
                        <div class="button" v-bind:class="{selected: prefs.newComp}" @click="setPref('newComp', true)"><span class="icon">
                            <svg width="24" height="24" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
                            </span>New Comp
                        </div><div class="button" v-bind:class="{selected: !prefs.newComp}" @click="setPref('newComp', false)"><span class="icon">
                            <svg width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>
                            </span>Current
                        </div>
                    </div>

                    <div v-show="prefs.newComp">
                        <dropdown
                            class="comp-scale"
                            label=""
                            :items="compScaleOptions"
                            :active="prefs.compScale - 1"
                            @update="val => setPref('compScale', parseInt(compScaleOptions[val].value) + 1)"
                        />
                        <div class="comp-scale-label">
                            Comp size multiplier
                        </div>
                        
                    </div>
            </div>

            <section-toggle label="options" :open="prefs.expand.options" @clicked="fold('options')">
                <checkbox
                    :checked="prefs.parametrics"
                    @clicked="val => setPref('parametrics', val)"
                    label="Detect parametric shapes"
                />
                <checkbox
                    :checked="prefs.precompGroups"
                    @clicked="val => setPref('precompGroups', val)"
                    label="Precomp groups"
                />
                <div class="option">
                    <input type="number" class="number-input" id="frameRate" v-model="prefs.frameRate" @change="savePrefs()">
                    <label for="frameRate">New comp fps</label>
                </div>
            </section-toggle>


            <section-toggle label="groups" :open="prefs.expand.groups" @clicked="fold('groups')">
                <div class="func-button full-width" @click="aeCall('groupToPrecomp')"><span class="icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M5 15H3v4c0 1.1.9 2 2 2h4v-2H5v-4zM5 5h4V3H5c-1.1 0-2 .9-2 2v4h2V5zm14-2h-4v2h4v4h2V5c0-1.1-.9-2-2-2zm0 16h-4v2h4c1.1 0 2-.9 2-2v-4h-2v4zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                    </svg>
                </span>Precomp
                </div>

                <div class="func-button full-width" @click="aeCall('precompToLayers')"><span class="icon">
                    <svg viewBox="0 0 24 24" width="24"><clipPath id="a"><path d="m0 0h24v24h-24z"/></clipPath><path clip-path="url(#a)" d="m15 3 2.3 2.3-2.89 2.87 1.42 1.42 2.87-2.89 2.3 2.3v-6zm-12 6 2.3-2.3 2.87 2.89 1.42-1.42-2.89-2.87 2.3-2.3h-6zm6 12-2.3-2.3 2.89-2.87-1.42-1.42-2.87 2.89-2.3-2.3v6zm12-6-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87-2.3 2.3h6z"/><path clip-path="url(#a)" d="m0 0h24v24h-24z" fill="none"/></svg>
                </span>Un-Precomp
                </div>

                <div class="func-button full-width" @click="aeCall('toggleGroupVisibility')"><span class="icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
                    </svg>
                </span>Toggle guide layer visibility
                </div>

                <div class="func-button full-width" @click="aeCall('deleteGroupLayers')"><span class="icon">
                    <svg viewBox="0 0 24 24">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                    </span>Delete group layers
                </div>
            </section-toggle>

            <section-toggle label="system" :open="prefs.expand.system" @clicked="fold('system')">
                <button 
                    class="btn-text full"
                    @click.exact="openDocLink" 
                    @click.alt="openConfig">
                    Learn stuff
                </button>
                <panel-info :text="`${spy.extName} - ${spy.extVersion}`"><i>Brought to you by your friends at Google motion design</i></panel-info>
            </section-toggle>

    </div> -->
</template>

<script>
/*jshint esversion: 6, asi: true*/


// import { log } from "util";
import fs from 'fs'
import amulets from 'amulets'

amulets.options({
    devName: 'sumUX'
})

const port_ae = 7240

let vm =  {
	name: "AEUX",
	// props: {
	// 	msg: String
    // },
    components: {
        checkbox: require("/Users/adamplouff/Code Projects/Modules/Mimelord/src/components/Mimelord/checkbox/Checkbox.vue").default,
        dropdown: require("/Users/adamplouff/Code Projects/Modules/Mimelord/src/components/Mimelord/dropdown/Dropdown.vue").default,
        "section-toggle": require("/Users/adamplouff/Code Projects/Modules/Mimelord/src/components/Mimelord/Section-Toggle.vue").default,
        "panel-info": require("/Users/adamplouff/Code Projects/Modules/Mimelord/src/components/Mimelord/Panel-Info.vue").default,
    },
	data: () => ({
    aeuxVersion: 0.7,
		prefs: {
			// updateTime: 0,
			// autoBuild: false,
			newComp: true,
			precompGroups: false,
			parametrics: true,
			compScale: 3,
			expand: {
                options: true,
				groups: false,
				system: false,
			},
			// artboard: null,
			frameRate: 60,
        },
        prefsLoaded: false,
		// showHelp: false,
		compScaleOptions: [
			{label: '1x', value: '0'},
			{label: '2x', value: '1'},
			{label: '3x', value: '2'},
			{label: '4x', value: '3'},
			{label: '5x', value: '4'},
            {label: '6x', value: '5'},
		],
		// userPath: this.cs.getSystemPath(SystemPath.USER_DATA) + '/sumUX/AEUX/',
		// newLayers: false,
		// dropHighlight: false,
		footerMessage: null,
	}),
	methods: {
    aeCall (msg) {
        amulets.evalScript(msg)
    },
    openDocLink () {
        amulets.webLink('http://aeux.io')
    },
    openConfig () {
        amulets.openUserFolder('config')
    },
    //// read the prefs file outside of the signed extension at intitialization
    getPrefs() {
        this.prefs = amulets.getPrefs(this.prefs)
        console.log(this.prefs);
        this.prefsLoaded = true
    },
    getPrefsSync() {
        /// read the layer data file
        let prefs = fs.readFileSync(this.userPath + 'config/prefs.json')
        console.log(prefs);
        
        return JSON.parse(prefs) || this.prefs
    },
    //// save prefs to disk
    savePrefs() {
        amulets.savePrefs(this.prefs)
    },
    //// collapse/expand panel groups
    fold(name) {
        this.prefs.expand[name] = !this.prefs.expand[name]
        this.savePrefs()
    },
    //// set pref and save to prefs file
    setPref (pref, value) {
            this.prefs[pref] = value
            console.log(pref, this.prefs[pref]);
            this.savePrefs()      
    },
    //// message to AE to start building layers from JSON
    buildLayers(data) {
      // console.log('data');
      // alert(JSON.stringify(data, false, 2))
      let prefs = amulets.getPrefs()
    //   let prefs = this.getPrefsSync()
      /// compare Ae panel version with Sketch panel version
      // if (data[0].aeuxVersion > this.aeuxVersion) {
      //     var msgData = {
      //         text: data[0].hostApp + ' is using a newer version of AEUX. Please download the updated Ae extension.',
      //         url: toolDocUrl,
      //     }
      //     evalScript('updateAePanel', msgData);
      //     return;
      // }

      /// obj to stringify and send to AE
      var compObj = {
          prefs: {
            newComp: prefs.newComp,
            parametrics: prefs.parametrics,
            compScale: prefs.compScale,
            precompGroups: prefs.precompGroups,
            frameRate: prefs.frameRate || 60,
          },
          layerData: data,
          // sourcePath: path.split('/').slice(0,-1).join('/'),
      }        


      amulets.evalScript( 'buildLayers', compObj ).then((results) => {
          /// error msg because the json returned nothing
          if (!JSON.parse(results)) {
              this.footerMessage = 'Open an existing comp first';
              setTimeout(function () {
                  this.footerMessage = null;
              }, 2000);
              return;
          }

          /// show footer message
          var msg = JSON.parse(results).msg;
          this.footerMessage = this.parseFooterMessages(msg);
          setTimeout(function () {
              this.footerMessage = null;
          }, 2500);
      });
      this.newLayers = false;
    },
        
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
		
	},
	computed: {
		// Use as this.app
		app() {
			return this.$root.$children[0];
		},
		// Use as this.cs
		cs() {
			return this.app.csInterface;
        },
        userPath() {
            return this.cs.getSystemPath(SystemPath.USER_DATA) + '/sumUX/AEUX/'
        },
        spy() {
            return require("cep-spy").default;
        },
	},
	mounted() {
		console.log("Top-level root instance (App.vue):");
		console.log(this.app);
		console.log("CSInteface:");
        console.log(this.cs);
        
        this.getPrefs()					// reads available prefs json file that is outside of the signed extensions

        amulets.newServer(port_ae)
	}
}

export default vm

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
