<template>
  <div class="content" v-if="prefsLoaded">
            <div class="build-source">
                <!-- <div class="build-button message" v-show="!prefs.artboard">Push layers from Sketch or drop an AEUX.json file</div>
                <div class="build-button" v-if="prefs.artboard" @click="readFileAndBuildLayers()">
                    <span class="badge" v-bind:class="{new: newLayers}">{{ prefs.artboard.layerCount }}</span>
                    <div class="build-comp">Build Comp</div>
                    <div class="artboard-name">{{ prefs.artboard.name }}</div>
                </div> -->

                <!-- <div class="row"> -->
                    <div class="button-group">
                        <div class="button" v-bind:class="{selected: prefs.newComp}" @click="setPref('newComp', true)"><span class="icon">
                            <svg width="24" height="24" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
                            </span>New Comp
                        </div><div class="button" v-bind:class="{selected: !prefs.newComp}" @click="setPref('newComp', false)"><span class="icon">
                            <svg width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0z"/><path d="M20 12l-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"/></svg>
                            </span>Current
                        </div>
                    </div>
                    <!-- <div class="button import" @click="openFile()"><span class="icon">
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5c0-1.38 1.12-2.5 2.5-2.5s2.5 1.12 2.5 2.5v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5c0 1.38 1.12 2.5 2.5 2.5s2.5-1.12 2.5-2.5V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z"/>
                        </svg></span>
                    </div> -->
                <!-- </div> -->


                <!-- <div class="row"> -->
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
                <!-- </div> -->
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

    </div>
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
				groups: false,
				options: false,
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
            console.log(this.prefs.compScale);
            
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
@font-face {
	font-family: 'Roboto';
	src: url('/assets/fonts/Roboto-Light.ttf') format('truetype');
	font-weight: normal;
	font-style: normal;
}
@font-face {
	font-family: 'Roboto Mono';
	src: url('/assets/fonts/RobotoMono-Regular.ttf') format('truetype');
	font-weight: normal;
	font-style: normal;
}
body, pre {
    color: #d2d2d2;
    overflow-x: hidden;
    overflow: hidden;
    -webkit-user-select: none;
    cursor: default;
    font-family: 'Roboto', sans-serif;
    /* font-size: 11px; */
    line-height: 1.5em;
    letter-spacing: 0.05em;
    margin: 0;
    min-width: 170px;
    /* background-color: #111; */
}
#app {
    height: 100vh;
    box-sizing: border-box;
    border: solid 2px rgba(3, 119, 187, 0);
}
.content {
    padding: 0 8px;
    height: 100%;
    overflow-y: scroll;
    /* padding-right: 24px; */
    margin-right: -16px;
}
a {
    color: #fff;
}
.header {
    padding-left: 8px;
    background-color: rgba(1,1,1,0.1);
}
.header>div {
    display: inline-block;
}
.footer {
    z-index: 1;
    bottom: 0;
    position: absolute;
    width: 100vw;
    background-color: #0377BC;
    text-align: center;
    padding: 4px;
    padding-right: 32px;
    line-height: 1.15em;
    /* white-space: pre-wrap; */
    word-wrap: break-word;
    font-family: inherit;
}
.lift-enter-active, .lift-leave-active {
  transition: opacity .5s;
  transition: margin-bottom .5s;
}
.lift-enter, .lift-leave-to {
  opacity: 0;
  margin-bottom: -30px;
}
.message {
    vertical-align: middle;
}
.row {
    /* width: 100%;
    float: left; */
    display: block;
    min-width: 190px;
}
.tab-name {
    width: 50px;
    text-transform: capitalize;
    position: relative;
    /* font-family: 'Roboto Mono', monospace; */
    font-size: 12px;
    vertical-align: middle;
    text-align: center;
}
.tab>svg {
    fill: rgb(172, 212, 6);
}
.group-heading {
    position: relative;
    /* font-family: 'Roboto Mono', monospace; */
    text-transform: uppercase;
    font-size: 10px;
    vertical-align: middle;
    padding: 4px 0 6px 0;
    display: block;
    height: 12px;
    overflow: hidden;
    letter-spacing: 0.1em;
}
.button {
    border: none;
    /* font-family: 'Roboto Mono', monospace; */
    /* text-transform: uppercase; */
    background-color: #393939;
    color: #dddddd;
    /* margin: 1px; */
    display: inline-block;
}
.nav {
    background-color: rgba(255, 255, 255, 0);
    border-radius: 2px;
    height: 28px;
    width: 36px;
}
button:focus {
    outline: 0;
}
button:hover {
    background-color: #0377BC;
}
button.selected {
    background-color: rgba(255, 255, 255, 0.15);
}
.button-group {
    /* width: auto;
    margin-bottom: 4px; */
    display: inline;
    /* float: left; */
}
.button-group>.button {
    background-color: rgba(255, 255, 255, 0.08);
    box-sizing: border-box;
    /* border: 1px solid rgba(0, 0, 0, 0); */
    /* min-width: 39%; */
    display: inline-block;
    height: 24px;
    margin: 0;
    padding: 5px 10px 0 2px;
    /* text-transform: uppercase; */
    font-size: 10px;
    overflow: hidden;
}
.button>span.icon {
    float: left;
    margin-right: 2px;
    margin-top: -2px;
}
.button>span.icon>svg {
    width: 18px;
    height: 18px;
    fill: #d2d2d2;
}
.button-group>.selected {
    background-color: rgba(255, 255, 255, 0.15);
    /* border: 1px solid rgba(255, 255, 255, 0.6); */
    border-radius: 1px;
}
button.full-width {
    width: 100%;
    height: 32px;
    padding-bottom: 4px;
}
.build-source, .group {
    vertical-align: middle;
    margin: 6px 0;
    /* float: left; */
    width: 100%;
    /* height: 58px; */
    display: flow-root;
}
.build-location {
    border-bottom: solid 1px rgba(128, 128, 128, 0.2);
}
.fold-group {
    border-top: solid 1px rgba(128, 128, 128, 0.2);
    float: left;
    margin-bottom: 4px;
    width: 100%;
}
.fold-content {
    padding-bottom: 4px;
    float: left;
    width: 100%;
}
.fold-icon {
    float: right;
    margin-top: -2px;
    fill: #d2d2d2;
    height: 18px;
    transform-origin: 50% 50%;
    transition: all 0.15s cubic-bezier(0.0, 0.0, 0.2, 1);
}
.fold-icon.flip {
    transform: rotate(-90deg);
}
.io-sketch {
    overflow: hidden;
}
.import {
    /* float: right; */
    padding: 4px 2px 0 3px;
}
.help {
    float: right;
    padding-top: 4px;
    padding-right: 3px;
    fill: #fff;
}
.func-button {
    /* border: 1px solid rgba(255, 255, 255, 0.15); */
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
    display: block;
    padding: 3px 8px;
    margin: 6px 0;
    /* text-transform: uppercase; */
    /* font-family: 'Roboto Mono', monospace; */
    font-size: 10px;
}
.func-button svg {
    margin-right: 4px;
    width: 18px;
    height: 18px;
    fill: #d2d2d2;
    margin-bottom: -5px;
}
.build-button {
    border: 1px solid rgba(255, 255, 255, 0.6);
    background-color: rgba(255, 255, 255, 0.15);
    border-radius: 2px;
    display: block;
    padding: 6px 8px;
    margin-bottom: 8px;
    vertical-align: middle;
    max-height: 64px;
}
.build-comp {
    font-style: italic;
    text-transform: uppercase;
}
.artboard-name {
    color: #eee;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
span.badge {
    float: right;
    background-color: #474747;
    border: #393939 solid 1px;
    border-radius: 4px;
    padding: 2px 4px;
    margin-top: 5px;
}
span.badge.new {
    background-color: #0377BC;
}
.nav .badge.new {
    border-radius: 6px;
    padding: 3px 3px;
    top: 9px;
    margin-left: 9px;
    position: absolute;
}
span.icon {
    margin-right: 4px;
}
span.dropdown {
    float: right;
    background-color: #0377BC;
}
.tooltiptext {
    visibility: hidden;
    float: none;
    pointer-events: none;
    background-color: #5e5e5e;
    color: #eee;
    text-align: center;
    line-height: 1.5em;
    padding: 4px 6px;
    border-radius: 1px;
    font-family: 'Roboto', sans-serif;
    text-align: left;
    text-transform: none;
    font-size: 10px;
    display: block;

    /* Position the tooltip text */
    position: absolute;
    z-index: 1;
    margin-top: 2px;

    opacity: 0;
    transition: opacity 0.3s;
    transition-delay: .25s;
}
.tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
}

.help-overlay {
    z-index: 2;
    opacity: 1;
    position: absolute;
    background-color: #0377BC;
    color: #fff;
    /* width: 154px; */
    height: 100vh;
    padding: 8px;
    margin-right: -8px;
    /* margin-top: -8px; */
    /* text-align: center; */

    line-height: 1.15em;
}
.help-overlay .tooltiptext {
    background-color: #85c3e7;
    color: #2e2d2d;
}
.help-overlay .group-heading {
    float: left;
    padding: 0;
}
.help-overlay .help {
    padding-right: 20px;
    /* margin-top: -6px; */
}
.help-overlay .content {
    height: 100%;
    width: 100%;
    /* float: left; */
    overflow-y: scroll;
    /* overflow-x: hidden; */
    margin-top: 8px;
    padding: 0;
    padding-right: 8px;
    -webkit-mask-image: -webkit-gradient(linear, left 88%, left bottom, from(rgba(0,0,0,1)), to(rgba(0,0,0,0)))
}
.help-overlay .icon {
    float: left;
    margin-top: 3px;
    display: inline;
}
.help-overlay .func-button .icon {
    margin-top: -3px;
}
.help-overlay svg {
    pointer-events: none;
    fill: #fff;

    /* float: left; */
    /* margin-bottom: 4px; */
    width: 14px;
    /* margin-top: -5px; */
}
.help-overlay .group-heading {
    color: #fff;
}
.help-overlay .group {
    float: left;
    margin-bottom: 8px;
    margin-right: 20px;
    padding-bottom: 8px;
    width: auto;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.help-overlay .link {
    /* text-transform: uppercase; */
    margin: 16px 0 16px -10px;
    text-align: center;
    width: 100vw;
    padding-bottom: 20px;
    font-size: 14px;
    font-style: italic;
}
.help-overlay .link:hover {
    text-decoration: underline;
}
.help-overlay .title {
    display: inline;
    padding: 4px 0 0 4px;
    margin-bottom: 4px;
    font-size: 13px;
    float: left;
}
.help-overlay .box {
    border: 1px solid rgba(255, 255, 255, 0.2);
    padding: 6px 4px 4px 4px;
    width: 90%;
    font-style: italic;
    text-transform: uppercase;
}
.help-overlay .icon.box {
    width: auto;
    padding: 2px 6px;
}
.help-overlay .badge {
    float: right;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    padding: 2px;
    font-size: 9px;
    font-style: normal;
    margin-top: -2px;
}
.help-overlay .text {
    display: block;
    float: left;
    font-weight: 300;
    margin-bottom: 4px;
    width: 100%;
}
.help-overlay hr {
    float: left;
    width: 100%;
    border: none;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity .3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
input#file-path {
    font-family: 'Roboto Mono', monospace;
    width: 100%;
    padding: 4px 8px;
    margin: 8px -18px 0 0;
    border: none;
}
.number-input {
    background-color: #454545;
    color: #EFEFEF;
    font-family: 'Source Code Pro', monospace;
    border: 1px solid rgba(255, 255, 255, 0.75);
    /* padding-left: 5px; */
    outline: 0;
    /* margin-top: 2px;
    margin-left: 3px; */
    margin: 2px 3px;
    width: 36px;
    text-align: center;
}
input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.option {
    height: 16px;
    margin-bottom: 4px;
    margin-left: -2px;
    margin-top: 2px;
    width: 100%;
    padding-bottom: 4px;
}
.option-checkbox {
    box-sizing: border-box;
    -webkit-appearance: none;
	border: 1px solid rgba(255, 255, 255, 0.75);
	padding: 5px;
	border-radius: 1px;
	display: inline-block;
	position: relative;
    vertical-align: bottom;
    outline: 0;
}
.option-checkbox:checked:after {
    background-color: rgba(255, 255, 255, 0.75);
    width: 8px;
    height: 8px;
    margin: -4px;
    content: ' ';
    position: absolute;
}
select {
    box-sizing: border-box;
    -webkit-appearance: none;
    overflow: scroll;
    outline: 0;
    background-color: rgba(255, 255, 255, 0.15);
	border: 1px solid rgba(255, 255, 255, 0.75);
    padding: 1px 4px;
    margin-left: 4px;
    border-radius: 1px;
    color: #f0f0f0;
    /* font-family: 'Roboto Mono', monospace; */
    width: 40px;
}

.comp-scale {
    width: 50px;
    float: left;
    margin: 0 !important;
}
.comp-scale-label {
    float: left;
    margin: 9px 7px;
}
.full {
    width: 100%;
}
.btn-text {
    background-color: var(--color-scrollbar-thumb);
    border-radius: 2px;
    border: 1px solid var(--color-btn-pill-active);
    color: var(--color-btn-pill-border);
    padding: 2px 8px 4px 8px;
    margin: 4px 0;
}
.btn-text:hover {
    background-color: var(--color-btn-disabled);
    /* color: var(--color-bg); */
}
.btn-text:active {
    background-color: var(--color-btn-active);
    /* color: var(--color-bg); */
}
</style>
