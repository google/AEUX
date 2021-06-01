<template>
    <div
        class="button"
        :class="[
            {
                uppercase,
                block,
                primary,
                left,
                right,
                flat,
                filled,
                disabled,
                color,
                tall,
                custom,
                toolbar,
                bg,
                outline,
                secondary,
                pill,
                active,
                hover,
            },
        ]"
        :style="{
            background: realBG,
            color: realColor,
            height: height,
            margin: margin,
        }"
        @click.exact="handleClick"
        @click="$emit('clickevt', $event)"
        @mouseenter="toggleHover(true)"
        @mouseleave="toggleHover(false)"
    >
        <div
            ref="tooltipWrapper"
            :class="['button-tooltip-wrapper', { left, right }]"
            v-if="hasTooltip"
        >
            <span
                ref="tooltip"
                :class="[
                    'button-tooltip',
                    showTooltip
                        ? 'button-tooltip-active'
                        : 'button-tooltip-idle',
                    top ? 'top' : 'bottom',
                    { noSlide },
                ]"
                :style="[
                    {
                        'transition-delay': delay,
                        'transition-duration': duration,
                        'transition-timing-function': timing,
                        opacity: debug && !showTooltip ? '1' : '',
                        'font-weight': noBold ? '500' : '600',
                    },
                ]"
                >{{ tooltip }}</span
            >
        </div>
        <div v-if="$slots.default" class="button-custom-interior">
            <slot />
        </div>
        <div v-else class="button-interior">
            <span v-if="label.length" :style="computedLabelStyle()">
                {{ label }}
            </span>
            <Icon
                :class="{ prefixIcon }"
                :size="iconSize"
                v-if="icon.length || prefixIcon.length"
                :name="icon || prefixIcon"
            />
        </div>
    </div>
</template>

<script>
import { openURL, evalScript, copy } from "cluecumber";

export default {
    props: {
        block: {
            type: Boolean,
            default: false,
        },
        pill: {
            type: Boolean,
            default: false,
        },
        outline: {
            type: Boolean,
            default: false,
        },
        left: {
            type: Boolean,
            default: false,
        },
        right: {
            type: Boolean,
            default: false,
        },
        primary: {
            type: Boolean,
            default: false,
        },
        secondary: {
            type: Boolean,
            default: false,
        },
        filled: {
            type: Boolean,
            default: false,
        },
        flat: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        tall: {
            type: Boolean,
            default: false,
        },
        custom: {
            type: Boolean,
            default: false,
        },
        prefixIcon: {
            type: String,
            default: "",
        },
        icon: {
            type: String,
            default: "",
        },
        iconSize: {
            type: String,
            default: "16px",
        },
        label: {
            type: String,
            default: "",
        },
        to: {
            type: String,
            default: "",
        },
        goto: {
            type: String,
            default: "",
        },
        toolbar: {
            type: Boolean,
            default: false,
        },
        tooltip: {
            type: String,
            default: "",
        },
        top: {
            type: Boolean,
            default: false,
        },
        delay: {
            type: String,
            default: "",
        },
        duration: {
            type: String,
            default: "",
        },
        timing: {
            type: String,
            default: "var(--quad)",
        },
        noSlide: {
            type: Boolean,
            default: false,
        },
        debug: {
            type: Boolean,
            default: false,
        },
        noBold: {
            type: Boolean,
            default: false,
        },
        evalScript: {
            type: String,
            default: "",
        },
        copy: {
            type: String,
            default: "",
        },
        override: {
            type: Boolean,
            default: false,
        },
    },
    data: () => ({
        groupItem: false,
        passClick: false,
        hover: false,
        showTooltip: false,
        tooltipOverride: false,
        sizeDebouncer: null,
        isResizing: false,
        realClipboard: "",
        hasCopy: false,
        active: false,
    }),
    // require("./mixinUID").default,
    mixins: [require("./mixinStyleProps").default],
    watch: {
        copy(val) {
            this.realClipboard = val;
        },
        hover(val) {
            this.$emit(`mouse${val ? "enter" : "leave"}`);
            if (!this.tooltipOverride) {
                this.showTooltip = val;
            }
        },
        tooltipOverride(val) {
            if (val) {
                setTimeout(() => {
                    this.tooltipOverride = false;
                }, 2000);
            }
        },
        showTooltip(val) {
            // console.log(val);
        },
    },
    mounted() {
        if (/button-group/i.test(this.$parent.$vnode.tag)) {
            this.groupItem = true;
            this.passClick =
                !this.$parent.multiselect && !this.$parent.exclusive;
        }
        if (this.hasTooltip) {
            window.addEventListener(
                "resize",
                this.debounce(this.checkTooltipPos, 300)
            );
            this.checkTooltipPos();
        }
        if (this.copy.length) {
            this.realClipboard = this.copy;
        }
        /**
         * @UPDATE - Fix :active pseudo-selectors on expanded status by relaying to boolean class .active
         */
        document.addEventListener("mousedown", (evt) => {
            if (this.hover) this.active = true;
        });
        document.addEventListener("mouseup", (evt) => {
            if (this.active) this.active = false;
        });
    },
    computed: {
        hasTooltip() {
            return this.tooltip.length > 0;
        },
        realColor() {
            if (!this.color.length) return `var(--button-color);`;
            else {
                if (!/-/.test(this.color)) return this.color;
                return `var(--color-${this.color
                    .replace(/var\(/, "")
                    .replace(/(--color-|color-)/, "")
                    .replace(/\)$/, "")})`;
            }
        },
        realBG() {
            if (!this.bg.length) return `var(--button);`;
            else {
                if (!/-/.test(this.bg)) return this.bg;
                return `var(--color-${this.bg
                    .replace(/var\(/, "")
                    .replace(/(--color-|color-)/, "")
                    .replace(/\)$/, "")})`;
            }
        },
    },
    methods: {
        toggleHover(state) {
            if (!this.override) this.hover = state;
            else if (this.hover) this.hover = false;
        },
        forceHideTooltip() {
            this.tooltipOverride = true;
            this.showTooltip = false;
        },
        async handleClick(evt) {
            const self = this;
            let possibles = [
                {
                    type: "GotoButton",
                    condition: this.goto.length > 0,
                    callback: () => openURL(self.goto),
                },
                // Was this missing? There's a :to parameter. For routes?
                // {
                // 	type: "ToButton",
                // 	condition: this.to.length > 0,
                // 	callback: () => this.$router.push(this.to)
                // },
                {
                    type: "NormalButton",
                    condition:
                        (this.passClick || !this.groupItem) &&
                        !this.goto.length &&
                        !this.to.length,
                    callback: () => self.$emit("click", evt),
                },
                {
                    type: "GroupButton",
                    condition: !this.passClick && this.groupItem,
                    callback: () => self.$parent.setActiveByUID(self.uuid),
                },
            ];
            // Since only one value will be true, use filter to remove any false conditions
            // Immediately call the remaining Array item's callback
            let target = possibles.filter((type) => type.condition)[0];
            target.callback();

            if (this.evalScript.length) {
                let result = await evalScript(this.evalScript);
                this.$emit("evalScript", result);
            }
            if (this.copy.length) {
                this.copyTextToClipboard();
            }
        },
        // This should accurately place :label and :icon with left/right positions
        computedLabelStyle() {
            let str = ``;
            str += `${
                this.icon.length || this.prefixIcon.length
                    ? `margin-${
                          this.left ? "right" : this.right ? "left" : "right"
                      }: 6px;`
                    : ""
            }`;
            str += `${
                this.icon.length || this.prefixIcon.length
                    ? `order: ${
                          this.right || this.prefixIcon.length
                              ? "1"
                              : this.left
                              ? "-1"
                              : "0"
                      }`
                    : ""
            }`;
            return str;
        },
        debounce(func, delay) {
            let inDebounce;
            return function () {
                const context = this;
                const args = arguments;
                clearTimeout(inDebounce);
                inDebounce = setTimeout(() => func.apply(context, args), delay);
            };
        },
        copyTextToClipboard() {
            let clipboard = copy(this.realClipboard);
            this.$emit("clipboard", clipboard);
        },
        checkTooltipPos() {
            const self = this;
            setTimeout(() => {
                let tooltip = self.$refs.tooltip;
                if (self.left || self.right || !tooltip) return null;
                if (
                    tooltip.style.left == "0px" &&
                    tooltip.style.right == "0px"
                ) {
                    tooltip.style.left = "";
                    tooltip.style.right = "";
                } else if (tooltip.style.left || tooltip.style.right) {
                    if (tooltip.style.left) {
                        let leftpos = tooltip.style.left.match(/\d*/)[0];
                        if (+leftpos <= 0) tooltip.style.left = "";
                    }
                    if (tooltip.style.right) {
                        let rightpos = tooltip.style.left.match(/\d*/)[0];
                        if (+rightpos >= window.innerWidth)
                            tooltip.style.right = "";
                    }
                }
                let position = tooltip.getBoundingClientRect();
                if (position.left < 0) {
                    tooltip.style.left = 0;
                    tooltip.style.right = "";
                } else if (position.right >= window.innerWidth) {
                    tooltip.style.left = "";
                    tooltip.style.right = 0;
                }
            }, 50);
        },
    },
};
</script>

<style>
.menu-clipboard {
    margin: 0;
    padding: 0;
    /* display: none; */
    position: absolute;
    top: 0px;
    outline: none;
    width: 0px;
    height: 0px;
    opacity: 0;
    pointer-events: none;
}
.button {
    position: relative;
    background: var(--button);
    color: var(--button-color);
    border: 1px solid transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-shrink: inherit;
    padding: 4px 6px;
    border-radius: 2px;
    height: 24px; /* -- Altered to prevent mdi-icons from cropping at top.
						Better solution likely exists */
    box-sizing: border-box;
    cursor: default;
    user-select: none;
}
.button-custom-interior {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.button,
.button > div,
.button > span {
    white-space: nowrap;
    text-overflow: ellipsis;
    /* 
		overflow: hidden; 
		Done to prevent tooltip cropping
	*/
}

.button:not(.custom) > svg {
    min-width: 16px;
    width: 16px;
    height: 16px;
    margin-top: -1px;
    margin-bottom: -1px;
    fill: var(--color-icon);
}
.button.custom > svg {
    min-width: 24px;
    width: 24px;
    height: 24px;
    margin-top: -1px;
    margin-bottom: -1px;
}

.button.pill {
    border-radius: 30px;
    min-width: 60px;
    text-transform: uppercase;
    letter-spacing: 0.15ch;
    padding-left: 15px;
    padding-right: 15px;
}

.outline {
    background: transparent;
    border-color: var(--button-primary-border);
}

.outline.secondary {
    background: transparent;
    border-color: var(--button-primary-border);
    border-width: 1.5px;
}

.button.outline:hover {
    color: var(--color-bg);
    background: var(--button-primary);
}

.button.outline.secondary:active {
    border-color: var(--color-selection);
    background: var(--color-selection);
}

.button.outline:active {
    border-color: var(--button-filled-hover-border);
    background: var(--button-primary);
}

.button.custom {
    height: fit-content;
}

.uppercase {
    text-transform: uppercase;
}

.centered {
    display: flex;
    justify-content: center;
    align-items: center;
}

.button > * {
    margin-right: 6px;
}
.button > :last-child {
    margin-right: 0;
}
.button.hover {
    background: var(--button-hover);
    /* border-color: var(--color-btn-icon-active-border) */
}
.button.active {
    background: var(--button-active);
}

.filled {
    background: var(--button-filled);
}

.filled:hover {
    background: var(--button-filled);
    border-color: var(--button-filled-hover-border);
}
.filled.active {
    color: var(--color-bg);
    background: var(--button-filled-active);
}

.tall {
    height: 26px;
}
.left {
    justify-content: flex-start;
}
.right {
    justify-content: flex-end;
}
.primary {
    background: rgba(160, 160, 160, 0.3);
    border-color: var(--button-primary-border);
}
.primary:hover {
    background: rgba(160, 160, 160, 0.45);
    border-color: var(--button-primary-border);
}
.primary.active {
    color: var(--color-bg);
    background: var(--button-primary);
}
.flat,
.toolbar {
    background: transparent;
}
/* 	
	not .active so it doesn't interfere with exclusive button groups 
	.flat:hover:not(.active) -- except this breaks flat button clicking?

*/
.flat:hover,
.toolbar:hover {
    background: var(--button-flat-hover);
    border-color: var(--button-flat-hover-border);
}

.flat:active,
.toolbar:active {
    background: var(--button-flat-active);
    border-color: var(--button-flat-active-border);
}
.button.toolbar {
    width: 34px;
    height: 34px;
    /* padding: 4; */
    margin: 0;
}
.button.toolbar svg {
    /* width: 10px; */
    margin: auto;
    min-width: 22px;
    width: 22px;
    height: 22px;
    /* margin-top: -1px; */
    /* margin-bottom: -1px; */
}
.disabled {
    opacity: 0.4;
    pointer-events: none;
}
.bg:hover {
    border-color: rgba(255, 255, 255, 0.2);
}
.bg.active {
    border-color: rgba(255, 255, 255, 0.5);
}
.block {
    width: 100%;
    margin-right: 0;
}

/* 

	TOOLTIP

 */

.button-tooltip-wrapper {
    position: absolute;
    width: 100%;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    pointer-events: none;
}

.button-tooltip {
    position: absolute;
    width: fit-content;
    height: fit-content;
    padding: 2px 4px;
    background-color: var(--tooltip-bg);
    color: var(--tooltip-color);
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.2);
    transition: all 160ms var(--quint) 0.4s;
}

.left > .button-tooltip,
.button-tooltip.left {
    left: 0;
}

.right > .button-tooltip,
.button-tooltip.right {
    right: 0;
}

.top {
    bottom: 10px;
    /* top: 22px; */
}

.bottom {
    top: 24px;
}

.button-tooltip-idle {
    opacity: 0;
}

.button-tooltip-idle.top:not(.noSlide) {
    bottom: -14px;
    /* top: 19px; */
}

.button-tooltip-idle.bottom:not(.noSlide) {
    top: 18px;
}

.button-tooltip-active {
    opacity: 1;
}

.button-interior {
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}
</style>
