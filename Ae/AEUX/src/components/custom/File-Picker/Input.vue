<template>
    <div
        :class="[{ disabled, readOnly, pseudo, noLabel }, 'input-container']"
        :style="[
            {
                width: width,
                margin: margin,
            },
        ]"
    >
        <span class="input-label" v-if="label.length && !noLabel">{{
            label
        }}</span>
        <div
            :class="[
                { flat, filled },
                'input-wrapper',
                !flat && !filled ? 'default' : '',
            ]"
            @mouseenter="hover = true"
            @mouseleave="hover = false"
            :style="[
                {
                    'justify-content': alignPos,
                },
            ]"
        >
            <div
                :class="['input-contents', pseudo ? 'pseudo' : '']"
                @click="$emit('clickinside')"
            >
                <Icon
                    v-if="prependOuterIcon.length"
                    :class="[
                        'input-prepend-outer-icon',
                        focusable ? '' : 'noPointerEvents',
                    ]"
                    :name="prependOuterIcon"
                    :size="iconSize"
                />
                <div
                    :class="[
                        { filled, flat },
                        'input-inside',
                        !flat && !filled ? 'default' : '',
                        hasFocus ? 'active' : 'idle',
                        focusable ? '' : 'noPointerEvents',
                    ]"
                >
                    <Icon
                        v-if="prependIcon.length"
                        class="input-prepend-icon"
                        :color="activeColor"
                        :name="prependIcon"
                        :size="iconSize"
                    />
                    <span v-if="prefix.length">{{ prefix }}</span>
                    <input
                        :title="tooltipText"
                        ref="input"
                        :type="inputType"
                        :maxlength="maxLength"
                        :placeholder="placeholder"
                        :class="[
                            { flat, filled, truncate },
                            'input-value',
                            uppercase ? 'uppercase' : '',
                            !flat && !filled ? 'default' : '',
                            hasFocus ? 'active' : 'idle',
                            pseudo ? 'pseudo' : '',
                        ]"
                        v-model="val"
                        @mouseup="altFocus"
                        @blur="blur"
                        @focus="focus"
                        @input="inputEvent"
                        @keyup.enter="submit"
                        :spellcheck="spellcheck"
                        :tabindex="disabled ? '-1' : ''"
                    />
                    <div
                        v-if="appendIcon.length"
                        style="padding-right: 5px"
                        class="input-append-icon"
                        @click="$emit('append-click', val)"
                    >
                        <Icon
                            :color="activeColor"
                            :name="appendIcon"
                            :size="iconSize"
                        />
                    </div>
                </div>

                <div
                    v-if="appendOuterIcon.length && !copyContent"
                    :class="[
                        'input-append-outer-icon',
                        focusable ? '' : 'noPointerEvents',
                    ]"
                    @click="$emit('append-outer-click', val)"
                >
                    <Icon :name="appendOuterIcon" :size="iconSize" />
                </div>
                <div
                    v-else-if="copyContent"
                    :class="[
                        'input-append-outer-icon',
                        focusable ? '' : 'noPointerEvents',
                    ]"
                    @click="copyInputContent"
                >
                    <Icon :name="dynamicCopyIcon" :size="iconSize" />
                </div>
            </div>

            <div
                :class="[
                    'input-indicator-wrapper',
                    focusable ? '' : 'noPointerEvents',
                ]"
                :style="[
                    {
                        'justify-content': alignPos,
                    },
                ]"
            >
                <div
                    v-if="!filled"
                    :class="[
                        hasFocus || hover ? 'active' : 'idle',
                        'input-indicator',
                    ]"
                    :style="[
                        {
                            background: hasFocus
                                ? realColor
                                : 'var(--color-default)',
                            height: underlineSize,
                        },
                    ]"
                />
            </div>
        </div>
        <div v-if="error" class="input-error-message">{{ error }}</div>
    </div>
</template>

<script>
import { copy } from "cluecumber";

export default {
    props: {
        value: {
            type: String,
            default: "",
        },
        clearable: {
            type: Boolean,
            default: false,
        },
        clearIcon: {
            type: String,
            default: "close",
        },
        includeTooltip: {
            type: Boolean,
            default: false,
        },
        prefix: {
            type: String,
            default: "",
        },
        noLabel: {
            type: Boolean,
            default: false,
        },
        label: {
            type: String,
            default: "",
        },
        color: {
            type: String,
            default: "var(--color-selection)",
        },
        debug: {
            type: Boolean,
            default: false,
        },
        maxLength: {
            type: Number,
            default: null,
        },
        placeholder: {
            type: String,
            default: "",
        },
        inputType: {
            type: String,
            default: "text",
        },
        disabled: {
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
        underlineSize: {
            type: String,
            default: "1.5px",
        },
        iconSize: {
            type: String,
            default: "16px",
        },
        left: {
            type: Boolean,
            default: false,
        },
        right: {
            type: Boolean,
            default: false,
        },
        prependIcon: {
            type: String,
            default: "",
        },
        appendIcon: {
            type: String,
            default: "",
        },
        prependOuterIcon: {
            type: String,
            default: "",
        },
        appendOuterIcon: {
            type: String,
            default: "",
        },
        autoSelect: {
            type: Boolean,
            default: false,
        },
        clickPlaceholder: {
            type: Boolean,
            default: false,
        },
        uppercase: {
            type: Boolean,
            default: false,
        },
        truncate: {
            type: Boolean,
            default: false,
        },
        spellcheck: {
            type: Boolean,
            default: false,
        },
        copyContent: {
            type: Boolean,
            default: false,
        },
        clipboardCooldown: {
            type: Number,
            default: 1000,
        },
        prefsId: {
            type: String,
            default: "",
        },
        readOnly: {
            type: Boolean,
            default: false,
        },
        focusable: {
            type: Boolean,
            default: true,
        },
        pseudo: {
            type: Boolean,
            default: false,
        },
    },
    mixins: [
        require("../Button/mixinStyleProps").default,
        require("../Toggle/mixinPrefs").default,
    ],
    data: () => ({
        val: null,
        lastVal: null,
        hasFocus: false,
        hover: false,
        error: null,
        isMounted: false,
        tooltipText: "",
        type: "input",
        dynamicCopyIcon: "content-copy",
    }),
    mounted() {
        if (this.prefsId.length) {
            this.checkLocalPrefs();
            let lastState = this.checkPrefsFor(this.prefsId);
            if (lastState === null) {
                this.val = this.lastVal = this.value;
            } else {
                this.val = this.lastVal = lastState.value;
                this.$emit("prefs", lastState);
            }
        } else {
            this.val = this.lastVal = this.value;
        }

        if (this.appendOuterIcon && this.copyContent) {
            this.dynamicCopyIcon = this.appendOuterIcon;
        }
        this.isMounted = true;
    },
    watch: {
        value(val) {
            this.val = val;
        },
        val(value) {
            // if (value !== this.lastVal) this.$emit("update", value);
            // this.lastVal = value;
        },
        hasFocus(val) {
            this.$emit(val ? "focus" : "blur");
            if (!val) {
                if (this.val !== this.lastVal) {
                    this.$emit("update", this.val);
                    if (this.prefsId.length)
                        this.setPrefsById(this.prefsId, this.val);
                }
                this.lastVal = this.val;
            }
        },
        hover(val) {
            this.tooltipText = this.checkOverflow() ? this.val : "";
        },
    },
    computed: {
        alignPos() {
            return this.left
                ? "flex-start"
                : this.right
                ? "flex-end"
                : "center";
        },
        activeColor() {
            return (this.hasFocus && this.filled) ||
                (this.hasFocus && !this.flat)
                ? "var(--color-input-focus-text)"
                : this.filled && this.hover && !this.hasFocus
                ? "var(--default-color) !important"
                : this.filled
                ? "var(--color-icon)"
                : this.flat && this.hasFocus
                ? this.realColor
                : "";
        },
        realColor() {
            if (!this.color.length) return `var(--color-selection);`;
            else {
                if (!/-/.test(this.color)) return this.color;
                return `var(--color-${this.color
                    .replace(/var\(/, "")
                    .replace(/(--color-|color-)/, "")
                    .replace(/\)$/, "")})`;
            }
        },
    },
    methods: {
        checkOverflow() {
            if (!this.isMounted) return false;
            let curOverflow = this.$refs.input.style.overflow;
            if (!curOverflow || curOverflow === "visible")
                this.$refs.input.style.overflow = "hidden";

            let isOverflowing =
                this.$refs.input.clientWidth < this.$refs.input.scrollWidth ||
                this.$refs.input.clientHeight < this.$refs.input.scrollHeight;

            this.$refs.input.style.overflow = curOverflow;
            return isOverflowing;
        },
        clear() {
            this.value = this.val = "";
            if (this.prefsId.length) this.setPrefsById(this.prefsId, "");
        },
        altFocus(evt) {
            if (this.clickPlaceholder && this.val == '') { this.val = this.placeholder };
            if (this.autoSelect) evt.preventDefault();
        },
        copyInputContent() {
            const self = this;
            let lastIcon = this.dynamicCopyIcon;
            let clipboard = copy(this.$refs.input.value);
            this.dynamicCopyIcon = "clipboard-check";
            this.$emit("clipboard", clipboard);
            setTimeout(() => {
                self.dynamicCopyIcon = lastIcon;
            }, this.clipboardCooldown);
        },
        focus(evt = null) {
            this.hasFocus = true;
            this.$refs.input.focus();
            if (this.autoSelect)
                this.$nextTick(() => {
                    if (evt.target.select) evt.target.select();
                });
        },
        blur() {
            this.hasFocus = false;
            this.$refs.input.blur();
            if (this.clickPlaceholder && this.val == this.placeholder) { this.val = '' };
        },
        reset() {
            this.hasFocus = this.hover = false;
        },
        inputEvent(evt) {
            this.$emit("change", this.val);
            this.$emit("input", this.val);
        },
        submit() {
            this.$emit("submit", this.val);
            this.blur();
        },
    },
};
</script>

<style>
.input-container.readOnly {
    pointer-events: none;
}

.input-container.pseudo {
    margin-bottom: 0px;
}

.input-contents.pseudo {
    cursor: pointer !important;
}

.noPointerEvents {
    pointer-events: none;
}

.input-container.disabled {
    opacity: 0.4;
    pointer-events: none;
}

.input-label {
    font-size: 10px;
    position: relative;
    height: 3px;
    top: -4px;
}

.input-container:not(.noLabel) {
    margin: 6px 0px 10px 0px;
}
.input-container {
    padding: 1px 4px;
    width: calc(100% - 8px);
    font-size: 12px;
    font-family: "Open Sans", sans-serif;
    color: var(--color-icon);
}
.input-wrapper {
    display: flex;
    justify-content: center;
    align-items: baseline;
    position: relative;
    flex-wrap: wrap;
}
.input-contents,
.input-inside {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: baseline;
}

.input-value.pseudo {
    cursor: pointer !important;
}

.input-value::selection {
    background-color: var(--highlight-bg);
    color: var(--highlight-text);
}

.truncate {
    white-space: nowrap;
    text-overflow: ellipsis;
}

.input-value {
    margin: 0px;
    padding: 2px 0px 2px 4px;
    overflow: visible;
    background: transparent;
    outline: none;
    border: none !important;
    border-style: solid;
    width: 100%;
    color: var(--default-color);
    border-radius: 2px 2px 0px 0px;
}

.input-value.default.idle {
    color: var(--color-icon);
}

.input-container:hover .input-value.default.idle {
    color: var(--dropdown-scrollbar-thumb-hover);
}

.uppercase {
    text-transform: uppercase;
}

.input-inside:hover:not(.active) {
    color: var(--default-color) !important;
}

.input-inside.active:not(.filled):not(.flat) {
    background: var(--color-input-focus);
    color: var(--color-input-text);
}

.input-inside.filled.idle {
    background: var(--color-input);
    border: 1.5px solid var(--color-input-border) !important;
    color: var(--color-input-text) !important;
}
.input-inside.filled.active {
    background: var(--color-input-focus);
    border: 1.5px solid var(--color-input-focus-border) !important;
    color: var(--color-input-focus-text) !important;
}

.input-value.active:not(.flat):not(.filled) {
    background: var(--color-input-focus);
    color: var(--color-input);
}

.input-contents,
.input-inside {
    border-radius: 3px;
    display: flex;
    align-items: baseline;
}

.input-error-message {
    padding: 4px;
}

.input-indicator {
    background: var(--color-selection);
    transition: all 200ms var(--quad) 20ms;
    /* position: absolute;
	bottom: 0px; */
}

.input-indicator-wrapper {
    width: 100%;
    display: flex;
    overflow: visible;
    height: 3px;
    align-items: flex-start;
}

.flat .input-indicator.active,
.default .input-indicator {
    width: 100%;
}
.flat .input-indicator.idle {
    width: 0%;
}

.input-append-outer-icon,
.input-prepend-outer-icon {
    padding: 0px 5px;
    margin: 2px 0px 0px 0px;
    height: 100%;
}

.input-prepend-icon {
    padding-left: 5px;
}

.input-append-icon {
    padding-right: 5px;
}
</style>
