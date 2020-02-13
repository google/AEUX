import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.config.devtools = false;

// Brutalism library support
import {
	ButtonGroup, Button, Col, Divider, Dropdown, Dropzone, FileInput, Fold, Icon, InputNumber, InputScroll, Menus, PanelInfo, Panel, Row, Tabs, Toggle, Wrapper, Altpan, Autofocus, Pan
} from "../../../../../Modules/brutalism/src/brutalism";

require("../node_modules/@mdi/font/css/materialdesignicons.css");

Vue.component("Button-Group", ButtonGroup);
Vue.component("Button", Button);
Vue.component("Col", Col);
Vue.component("Divider", Divider);
Vue.component("Dropdown", Dropdown);
Vue.component("Dropzone", Dropzone);
Vue.component("File-Input", FileInput);
Vue.component("Fold", Fold);
Vue.component("Icon", Icon);
Vue.component("Input-Number", InputNumber);
Vue.component("Input-Scroll", InputScroll);
Vue.component("Menus", Menus);
Vue.component("Panel-Info", PanelInfo);
Vue.component("Panel", Panel);
Vue.component("Row", Row);
Vue.component("Tabs", Tabs);
Vue.component("Toggle", Toggle);
Vue.component("Wrapper", Wrapper);
Vue.directive("altpan", Altpan);
Vue.directive("autofocus", Autofocus);
Vue.directive("pan", Pan);

new Vue({
  render: h => h(App)
}).$mount('#app');