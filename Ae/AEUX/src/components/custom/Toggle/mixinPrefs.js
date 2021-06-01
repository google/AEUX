export default {
    methods: {
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
                        fileInput: []
                    })
                );
            }
        },
        checkPrefsFor(id) {
            let prefs = this.getPrefs();
            if (!prefs[this.type] || !prefs[this.type].length) return null;
            let target = prefs[this.type].find(item => {
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
            Object.keys(prefs).forEach(key => {
                let foundItem = prefs[key].find(item => {
                    return item.id == id;
                });
                if (foundItem) wasFound = true;
            });
            if (wasFound) {
                if (Object.keys(prefs).includes(this.type))
                    prefs[this.type] = prefs[this.type].filter(item => {
                        return item.id !== id;
                    });
            }
            return this.setPrefs(prefs);
        },
        setPrefsById(id, value) {
            let wasFound = false;
            let prefs = this.getPrefs();
            Object.keys(prefs).forEach(key => {
                let foundItem = prefs[key].find(item => {
                    return item.id == id;
                });
                if (foundItem) (foundItem.value = value), (wasFound = true);
            });
            if (!wasFound) {
                if (Object.keys(prefs).includes(this.type))
                    prefs[this.type].push({
                        id: this.prefsId,
                        value: value
                    });
                else {
                    prefs[this.type] = [
                        {
                            id: this.prefsId,
                            value: value
                        }
                    ];
                }
            }
            return this.setPrefs(prefs);
        },
        deletePrefs() {
            window.localStorage.removeItem("brutalism-prefs");
        }
    }
};
