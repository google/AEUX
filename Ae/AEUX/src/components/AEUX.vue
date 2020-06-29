<template>
    <Wrapper v-if="prefsLoaded">
        <!-- <Dropzone /> -->
        <Row margin="0 auto 8px auto" style="width: 168px">
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
                size="10"
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
                size="10"
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
        //// set pref and save to prefs file
        setPref (pref, value) {
            this.prefs[pref] = value
            console.log(pref, this.prefs[pref]);
            amulets.savePrefs(this.prefs)
            // this.savePrefs()      
        },
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
