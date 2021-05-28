<template>
    <div
        :class="[{ disabled, readOnly }, 'file-picker-wrapper']"
        :style="{
            width: width,
        }"
    >
        <input
            style="display: none; tabindex: -1"
            ref="filepicker"
            type="file"
            name="testing 1 2 3"
            @change="fileHandler"
            :multiple="multiple"
            :accept="realAccepts"
        />
        <!-- <div @click="clickOnSlot" v-if="$slots.default">
            <slot />
        </div> -->
        <div v-if="!multiple && clearable" class="file-picker-contents input">
            <Pseudo-Input
                @focus="clickOnSlot"
                :placeholder="realPlaceholder"
                :pseudo="true"
                :label="realLabel"
                :no-label="noLabel"
                ref="pseudoinput"
                :flat="flat"
                :filled="filled"
                v-model="realContents"
                :append-outer-icon="realIcon"
                @append-outer-click="clickOnSlot"
                include-tooltip
                :style="`width: ${
                    this.isRealClearable ? 'calc(100% - 38px)' : '100%'
                };`"
                truncate
            />
            <div class="file-picker-clear-icon input" v-show="isRealClearable">
                <Button :icon="clearIcon" flat @click="clear" />
            </div>
        </div>
        <!-- <Pseudo-Input
                @focus="clickOnSlot"
                v-if="!multiple && !clearable"
                :pseudo="true"
                :placeholder="realPlaceholder"
                :label="realLabel"
                :no-label="noLabel"
                ref="pseudoinput"
                :flat="flat"
                :filled="filled"
                v-model="realContents"
                :append-outer-icon="realIcon"
                @append-outer-click="clickOnSlot"
                truncate
            /> -->
    </div>
</template>

<script>
import vPath from "path";
import { openDialog, evalScript } from "cluecumber";
import spy from "cep-spy";
const fspath = window.__adobe_cep__ ? require("path") : null;
const fs = window.__adobe_cep__ ? require("fs") : null;

export default {
    props: {
        label: {
            type: String,
            default: "",
        },
        isRelative: {
            type: Boolean,
            default: false,
        },
        width: {
            type: String,
            default: "100%",
        },
        folder: {
            type: Boolean,
            default: false,
        },
        noLabel: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
        flat: {
            type: Boolean,
            default: false,
        },
        filled: {
            type: Boolean,
            default: false,
        },
        icon: {
            type: String,
            default: "",
        },
        placeholder: {
            type: String,
            default: "",
        },
        title: {
            type: String,
            default: "",
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        cols: {
            type: Number,
            default: null,
        },
        rows: {
            type: Number,
            default: 2,
        },
        accepts: {
            type: [String, Array],
            default: () => {
                return ["*"];
            },
        },
        autoParse: {
            type: Boolean,
            default: true,
        },
        prefs: {
            type: Object,
            default: function () {
                return {};
            },
        },
        fullPath: {
            type: Boolean,
            default: false,
        },
        flatten: {
            type: Boolean,
            default: true,
        },
        readFolders: {
            type: Boolean,
            default: false,
        },
        encoding: {
            type: String,
            default: "UTF-8",
        },
        autoRead: {
            type: Boolean,
            default: false,
        },
        debug: {
            type: Boolean,
            default: false,
        },
        depth: {
            type: Number,
            default: 0,
        },
        prefix: {
            type: String,
            default: "./",
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        clearIcon: {
            type: String,
            default: "close",
        },
        prefsId: {
            type: String,
            default: "",
        },
        resizeable: {
            type: Boolean,
            default: true,
        },
    },
    data: () => ({
        contents: [],
        readContents: [],
        text: "No file selected",
        type: "filepicker",
    }),
    components: {
        "Pseudo-Input": require("./Input.vue").default,
    },
    mounted() {
        this.loadPrefValue();
    },
    computed: {
        isRealClearable() {
            return (
                this.clearable &&
                ((this.isRealRelativeExport &&
                    this.prefs.relativePath.length) ||
                    (!this.isRealRelativeExport &&
                        this.prefs.absolutePath))
            );
        },
        realAccepts() {
            return !/string/.test(typeof this.accepts)
                ? this.accepts.join(", ")
                : this.accepts;
        },
        realIcon() {
            if (this.icon.length) return this.icon;
            else return this.folder ? "folder-outline" : "file-outline";
        },
        realLabel() {
            if (this.label.length) return this.label;
            else
                return `Choose ${this.folder ? "Folder" : "File"}${
                    this.multiple ? "s" : ""
                }`;
        },
        realTitle() {
            if (this.title.length) return this.title;
            else
                return `Choose ${this.folder ? "Folder" : "File"}${
                    this.multiple ? "s" : ""
                }`;
        },
        realContents: {
            get() {
                return this.contents.length
                    ? this.sanitizeContentsByDepth()
                    : ``;
            },
            set(val) {
                return val;
            },
        },
        isRealRelativeExport() {
            return this.prefs.relativeExport && spy.appName == "AEFT";
        },
        realPlaceholder() {
            return this.isRealRelativeExport
                ? "./Anubis"
                : `No ${this.folder ? "Folder" : "File"}${
                      this.multiple ? "s" : ""
                  } selected`;
        },
        realDepth() {
            return this.folder
                ? this.readFolders
                    ? this.depth + 2
                    : this.depth + 1
                : this.depth + 1;
        },
    },
    watch: {
        isRealRelativeExport(val) {
            // console.log("RELATIVE:", val);
            let target = val
                ? this.prefs.relativePath
                : this.prefs[`absolutePath`];
            this.setPath(target || "");
        },
    },
    methods: {
        message() {
            // console.log("Hello");
        },
        get() {
            return {
                read: this.readContents,
                contents: this.contents,
                display: this.realContents,
            };
        },
        set(array) {
            if (this.multiple) this.contents = array;
            else this.contents = [array[0]];
        },
        clear() {
            this.$refs.filepicker.type = "text";
            this.$refs.filepicker.type = "file";
            this.$refs.filepicker.value = "";
            this.$emit("clear");

            let targKey = this.isRealRelativeExport
                ? "relativePath"
                : `absolutePath`;
            let temp = {};
            temp[targKey] = "";
            this.$emit("prefs-update", temp);
            // if (this.prefsId && this.prefsId.length)
            //     this.deletePrefById(this.prefsId);
            this.reset();
        },
        sanitizeContentsByDepth() {
            let result = [];
            this.contents.forEach((path) => {
                if (this.fullPath) result.push(`${path}`);
                else
                    result.push(
                        `${this.prefix}${path
                            .split(/\/{1,}|\/{1,}/)
                            .reverse()
                            .slice(0, this.realDepth)
                            .reverse()
                            .join("/")}`
                    );
            });
            return result.length > 1 ? result.join(", ") : result[0];
        },
        // Opens a native open dialog and returns the target folder/file path as obj.path
        openDialog(title, isFolder = false) {
            if (!window.__adobe_cep__) return null;
            let menu = cep.fs.showOpenDialogEx(true, isFolder, title);
            let result;
            if (menu.err) result = { error: menu.err };
            else if (!menu.data.length) result = { error: "Canceled" };
            else result = menu.data;
            return result;
        },
        async clickOnSlot() {
            const self = this;
            try {
                if (!this.multiple && this.$refs.pseudoinput)
                    this.$refs.pseudoinput.blur();
                else if (this.multiple && this.$refs.pseudotextarea)
                    this.$refs.pseudotextarea.blur();
            } catch (err) {
                //
            }
            if (!this.folder) await this.openFilePicker();
            else await this.openFolderPicker();
        },
        async openFilePicker() {
            if (this.debug) console.log("accept:", `"${this.realAccepts}"`);
            this.$refs.filepicker.click();
        },
        getDrive(cPath) {
            let result;
            try {
                result = vPath.dirname(cPath);
                return this.getDrive(result);
            } catch (err) {
                return cPath;
            }
        },
        async openFolderPicker() {
            let result = await this.openDialog(this.realTitle, true);
            if (this.debug) {
                console.log("Folder picked:");
                console.log(result);
            }
            if (!result || !result.length) {
                return null;
            }

            /**
             * @ERROR - The relative bug is likely right here
             * https://github.com/battleaxedotco/anubis/issues/31
             */

            if (this.isRealRelativeExport) {
                let parentPath = await evalScript(
                    `(function() { return Folder(app.project.file.parent).fsName }())`
                );
                let childPath = result[0];
                parentPath = parentPath.replace(/\\/gm, "/");

                let temp,
                    isDriveSwitch =
                        this.getDrive(parentPath) !== this.getDrive(childPath);

                if (isDriveSwitch) {
                    this.$root.$children[0].footerMessage =
                        "Drive switching in relative paths not supported";
                    return null;
                } else {
                    temp = vPath.relative(parentPath, childPath);
                    console.log(temp);

                    // Check if on same parent level
                    temp =
                        vPath.dirname(parentPath) == childPath
                            ? `./${temp}`
                            : temp;

                    // Ensure slashes are righthand
                    temp = temp.replace(/\\/gm, "/");

                    // If adjacent sibling / cousin, always prepend
                    temp = /[^\.]/.test(temp) ? `./${temp}` : temp;

                    // If directly on parent, always prepend
                    temp = !temp.length ? "./" : temp;

                    temp = /^\.\/\.\./.test(temp) ? temp.substring(2) : temp;

                    console.log("RESULT:", temp);
                }

                let data = {};
                data["relativePath"] = temp;
                this.$emit("prefs-update", data);
                this.setPath(temp);
            } else {
                let data = {};
                data[`absolutePath`] = result[0];
                await this.folderHandler(result);
                this.$emit("prefs-update", data);
            }
        },
        async setPath(string) {
            this.$nextTick(() => {
                this.folderHandler([string]);
            });
        },
        async folderHandler(array) {
            if (!array || !array.length) {
                if (!window.__adobe_cep__) {
                    console.error(
                        `Sorry! Folders can't work in browser due. Try this in an Adobe panel, though.`
                    );
                    return null;
                } else return null;
            }
            this.reset();
            this.contents = array;

            this.$emit("input", array);
        },
        async generateDropFolderData() {
            let temp = [];
            for (let file of this.contents) {
                const stats = fs.statSync(file);
                let clone = {
                    lastModified: stats.mtimeMs,
                    lastModifiedDate: stats.mtime,
                    size: stats.size,
                    name: file.match(/[^\/|\\]{1,}$/)[0],
                    path: file,
                    webkitRelativePath: "",
                    type: "",
                };
                temp.push(clone);
            }
            return temp;
        },
        async fileHandler(e) {
            console.log(e.target.files);
            // Stop this function if the user has pressed cancel
            if (!e.target.files.length) {
                this.$emit("cancel");
                return null;
            }
            // Otherwise reset previous values
            this.reset();
            let fileList = e.target.files;
            let temp = [];
            if (this.autoRead) {
                for (let file of fileList)
                    this.readContents.push(await this.getAsText(file));
            }
            this.contents = this.makeIterable(fileList).map((item) => {
                return /object/i.test(typeof item)
                    ? item.path
                        ? item.path.replace(/\\/gm, "/")
                        : item.name
                    : /string/i.test(typeof item)
                    ? item.replace(/\\/gm, "/")
                    : item;
            });
            if (this.debug) {
                if (this.autoRead) console.log(this.readContents);
                else console.log(this.contents);
            }
            if (this.autoRead)
                this.$emit(
                    "read",
                    this.multiple ? this.readContents : this.readContents[0]
                );

            // @@@ TARGET?
            this.$emit(
                "input",
                this.multiple ? this.contents : this.contents[0]
            );
            this.$emit("drop", this.makeIterable(e.target.files));
            if (this.isRelative) {
                this.setPrefsById(this.prefsId, this.contents.join(";"));
            }
        },
        makeIterable(list) {
            let result = [];
            for (var i = 0; i < list.length; i++) result.push(list[i]);
            return result;
        },
        getAsText(readFile) {
            return new Promise((resolve, reject) => {
                if (!readFile)
                    reject(
                        this.createError(
                            "Unsupported file type for Read event",
                            readFile
                        )
                    );
                if (/object/i.test(typeof readFile)) {
                    var reader = new FileReader();
                    reader.readAsText(readFile, this.encoding);
                    reader.onload = () => {
                        let result = reader.result;
                        result = this.isJSON(result)
                            ? this.autoParse
                                ? JSON.parse(result)
                                : result
                            : result;
                        resolve(result);
                    };
                    reader.onerror = this.errorHandler;
                } else if (/string/i.test(typeof readFile) && fs) {
                    resolve(fs.readFileSync(readFile, "utf-8"));
                } else {
                    reject("prefs-id file reading cannot be done in Browser.");
                }
            });
        },
        async loaded(evt) {
            let result = evt.target.result;
            result = this.isJSON(result)
                ? this.autoParse
                    ? JSON.parse(result)
                    : result
                : result;
            return result;
        },
        isJSON(data) {
            try {
                JSON.parse(data);
                return true;
            } catch (e) {
                return false;
            }
        },
        async expandFolderData(data) {
            let origin = data;
            for (let i = 0; i < data.length; i++) {
                let originalpath = data[i].path;
                data[i] = !/(\\|\/)\w*\.\w*/.test(data[i].path)
                    ? await this.readDir(data[i].path)
                    : data[i];
                data[i] = data[i].length
                    ? data[i].map((file) => {
                          let child = new File([""], `${file}`, {});
                          let clone = {};
                          let keys = [
                              "name",
                              "lastModified",
                              "lastModifiedDate",
                              "path",
                              "size",
                              "type",
                              "webkitRelativePath",
                          ];
                          keys.forEach((key) => {
                              clone[key] = child[key];
                          });
                          clone.path = `${originalpath.replace(
                              /(\\|\/)$/,
                              ""
                          )}/${file}`.replace(/\\/gm, "/");
                          return clone;
                      })
                    : data[i];
            }
            return this.flatten ? data.flat() : data;
        },
        async readDir(thispath) {
            return new Promise((resolve, reject) => {
                fs.readdir(
                    fspath.resolve(thispath),
                    { encoding: "utf-8" },
                    (err, files) => {
                        if (err) reject(err);
                        resolve(files);
                    }
                );
            });
        },
        createError(message, evt) {
            this.errorHandler({
                target: { error: message },
            });
            console.log("HTML not yet supported! Files only.");
        },
        errorHandler(evt) {
            this.reset();
            if (evt.target.error.name == "NotReadableError") console.error(evt);
            else console.error(evt.target.error);
        },
        reset() {
            this.contents = [];
            this.readContents = [];
            this.text = "No file selected";
        },
        //
        async confirmHandler(data) {
            if (this.readFolders)
                data = window.__adobe_cep__
                    ? await this.expandFolderData(data)
                    : this.createError(`Cannot read folders in browser!`);
            data.length
                ? this.$emit("input", data)
                : this.createError("Unsupported file type for Drop event");
        },
        //
        /**
         * @PREFS
         */
        loadPrefValue() {
            let value = this.isRealRelativeExport
                ? this.prefs.relativePath
                : this.prefs[`absolutePath`];
            this.setPath(value || "");
            // if (this.prefsId.length && !this.prefs.relativeExport) {
            //     console.log("ABSOLUTE");
            //     this.checkLocalPrefs();
            //     let lastState = this.checkPrefsFor(this.prefsId);
            //     if (lastState === null) {
            //         // Do nothing...
            //     } else {
            //         let content = lastState.value.split(";");
            //         this.contents = content;
            //         if (this.folder) {
            //             this.folderHandler(content);
            //         } else {
            //             this.fileHandler({
            //                 target: {
            //                     files: content,
            //                 },
            //             });
            //         }
            //         this.$emit("prefs", content);
            //         console.log("PREFS:", content);
            //     }
            // } else if (this.prefs.relativeExport) {
            //     console.log("RELATIVE");
            //     this.setPath(this.prefs.relativePath);
            //     // this.folderHandler(this.prefs.relativePath);
            // }
        },
        checkLocalPrefs(id = null) {
            let storage = window.localStorage;
            let defaults = storage.getItem("brutalism-prefs");
            if (!defaults) {
                storage.setItem(
                    "brutalism-prefs",
                    JSON.stringify({
                        fold: [],
                        toggle: [],
                        input: [],
                        inputScroll: [],
                        dropdown: [],
                        textArea: [],
                        fileInput: [],
                    })
                );
            }
        },
        checkPrefsFor(id) {
            let prefs = this.getPrefs();
            if (!prefs[this.type] || !prefs[this.type].length) return null;
            let target = prefs[this.type].find((item) => {
                return item.id == id;
            });
            return target ? target : null;
        },
        setPrefs(data) {
            return window.localStorage.setItem(
                "brutalism-prefs",
                JSON.stringify(data)
            );
        },
        getPrefs() {
            this.checkLocalPrefs();
            return JSON.parse(window.localStorage.getItem("brutalism-prefs"));
        },
        deletePrefById(id) {
            let wasFound = false;
            let prefs = this.getPrefs();
            Object.keys(prefs).forEach((key) => {
                let foundItem = prefs[key].find((item) => {
                    return item.id == id;
                });
                if (foundItem) wasFound = true;
            });
            console.log(prefs[this.type]);
            if (wasFound) {
                console.log("FOUND", id);
                if (Object.keys(prefs).includes(this.type))
                    prefs[this.type] = prefs[this.type].filter((item) => {
                        return item.id !== id;
                    });
            }
            console.log(prefs[this.type]);
            return this.setPrefs(prefs);
        },
        setPrefsById(id, value) {
            let wasFound = false;
            let prefs = this.getPrefs();
            Object.keys(prefs).forEach((key) => {
                let foundItem = prefs[key].find((item) => {
                    return item.id == id;
                });
                if (foundItem) (foundItem.value = value), (wasFound = true);
            });
            if (!wasFound) {
                if (Object.keys(prefs).includes(this.type))
                    prefs[this.type].push({
                        id: this.prefsId,
                        value: value,
                    });
                else {
                    prefs[this.type] = [
                        {
                            id: this.prefsId,
                            value: value,
                        },
                    ];
                }
            }
            return this.setPrefs(prefs);
        },
        deletePrefs() {
            window.localStorage.removeItem("brutalism-prefs");
        },
    },
};
</script>

<style>
.input-wrapper.filled {
    background: none !important;
}
.file-picker-wrapper.disabled {
    opacity: 0.4;
    pointer-events: none;
}

.file-picker-wrapper.readOnly {
    pointer-events: none;
}
.file-picker-contents {
    display: flex;
    flex-wrap: wrap;
}

.file-picker-clear-icon {
    padding: 0px !important;
    height: 100%;
}

.file-picker-contents.input {
    align-items: flex-end;
}
.file-picker-clear-icon.input {
    margin: 0px 0px 4px 0px;
}

.file-picker-contents.textarea {
    align-items: flex-start;
}
.file-picker-clear-icon.textarea {
    margin: 23px 0px 0px 0px;
}

.file-picker-wrapper .textarea-append-outer-icon {
    cursor: pointer;
}
</style>
