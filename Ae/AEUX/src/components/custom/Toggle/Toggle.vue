<template>
  <div
    @click="updateState"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
    :class="['toggle-box-item', { disabled, centered, custom, readOnly }]"
    :style="{ color: color }"
  >
    <slot v-if="hasSlotContent" />
    <div :class="['toggle-box-contents', state ? 'true' : 'false']" v-else>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 18 18"
        style="height: 24.8px"
      >
        <rect class="negative" x="1.08" y="1.08" width="15.84" height="15.84" />
        <rect class="on" x="4" y="4" width="10" height="10" />
        <path
          class="outline"
          d="M16,0H2A2,2,0,0,0,0,2V16a2,2,0,0,0,2,2H16a2,2,0,0,0,2-2V2A2,2,0,0,0,16,0Zm-.23,15.77H2.23V2.23H15.77Z"
        />
      </svg>
      <span v-if="label.length" class="label">{{ label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    prop: "state",
    event: "input",
  },
  props: {
    state: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
    onIcon: {
      type: String,
      default: "checkbox-intermediate",
    },
    offIcon: {
      type: String,
      default: "checkbox-blank-outline",
    },
    custom: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: "18px",
    },
    color: {
      type: String,
      default: "",
    },
    centered: {
      type: Boolean,
      default: false,
    },
    checkbox: {
      type: Boolean,
      default: false,
    },
    radio: {
      type: Boolean,
      default: false,
    },
    switch: {
      type: Boolean,
      default: false,
    },
    debug: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Boolean,
      default: false,
    },
    prefsId: {
      type: String,
      default: "",
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [require("./mixinPrefs").default],
  mounted() {
    if (this.prefsId.length) {
      this.checkLocalPrefs();
      let lastState = this.checkPrefsFor(this.prefsId);
      if (lastState === null) {
        this.realState = this.state;
      } else {
        this.realState = lastState.value;
        this.$emit("prefs", lastState);
      }
    }
  },
  data: function () {
    return {
      type: "toggle",
      realState: this.state,
      sets: [
        {
          name: "radio",
          onIcon: "radiobox-marked",
          offIcon: "radiobox-blank",
        },
        {
          name: "checkbox",
          onIcon: "checkbox-intermediate",
          offIcon: "checkbox-blank-outline",
        },
        {
          name: "switch",
          onIcon: "toggle-box-switch",
          offIcon: "toggle-box-switch-off",
        },
      ],
    };
  },
  computed: {
    hasSlotContent() {
      return this.$slots.default;
    },
    activeIcon() {
      let activeSet = this.sets.find((item) => {
        return this[item.name];
      });
      let result = !activeSet
        ? this.realState || this.value
          ? this.onIcon
          : this.offIcon
        : this.realState || this.value
        ? activeSet.onIcon
        : activeSet.offIcon;
      return result;
    },
  },
  watch: {
    state(val) {
      this.realState = val;
      this.$emit("input", val);
    },
    value(val) {
      this.realState = val;
      this.$emit("input", val);
    },
  },
  methods: {
    updateState() {
      if (this.disabled || this.readOnly) return null;
      this.$emit("click");
      this.realState = !this.realState;
      this.$emit("update", this.realState);
      this.$emit("input", this.realState);
      if (this.prefsId.length) {
        this.setPrefsById(this.prefsId, this.realState);
      }
    },
  },
};
</script>

<style>
svg {
  width: 14px;
  min-width: 14px;
}

.toggle-box-contents .outline {
  fill: var(--color-icon);
}

.toggle-box-contents .negative {
  fill: var(--color-bg);
}

.toggle-box-contents.false .on {
  fill: var(--color-bg);
}
.toggle-box-contents.true .on {
  fill: var(--color-icon);
}

.toggle-box-contents {
  margin-left: 2px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  align-items: center;
}

.toggle-box-item {
  box-sizing: border-box;
  width: fit-content;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;
  overflow: hidden;
  color: var(--color-icon);
}

.toggle-box-item.readOnly {
  pointer-events: none;
}

.toggle-box-item:not(.custom) {
  align-items: center;
}
.toggle-box-item.custom {
  align-items: flex-start;
}

.disabled {
  opacity: 0.4;
  pointer-events: none;
}

.label {
  padding-left: 8px;
}
.custom .label {
  margin-top: 2px;
}
</style>
