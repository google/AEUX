import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.config.devtools = false;

// Brutalism library support
import {
	Alert, ButtonGroup, Button, Col, Divider, Dropdown, Dropzone, FileInput, Fold, Footer, Icon, InputNumber, InputScroll, Input, Menus, PanelInfo, Panel, RotationControl, Row, Tabs, TextArea, Toggle, Wrapper, Altpan, Autofocus, Pan
} from "../../../../../Modules/brutalism/src/brutalism";

require("../node_modules/@mdi/font/css/materialdesignicons.css");

Vue.component("Alert", Alert);
Vue.component("Button-Group", ButtonGroup);
Vue.component("Button", Button);
Vue.component("Col", Col);
Vue.component("Divider", Divider);
Vue.component("Dropdown", Dropdown);
Vue.component("Dropzone", Dropzone);
Vue.component("File-Input", FileInput);
Vue.component("Fold", Fold);
Vue.component("Footer", Footer);
Vue.component("Icon", Icon);
Vue.component("Input-Number", InputNumber);
Vue.component("Input-Scroll", InputScroll);
Vue.component("Input", Input);
Vue.component("Menus", Menus);
Vue.component("Panel-Info", PanelInfo);
Vue.component("Panel", Panel);
Vue.component("Rotation-Control", RotationControl);
Vue.component("Row", Row);
Vue.component("Tabs", Tabs);
Vue.component("TextArea", TextArea);
Vue.component("Toggle", Toggle);
Vue.component("Wrapper", Wrapper);
Vue.directive("altpan", Altpan);
Vue.directive("autofocus", Autofocus);
Vue.directive("pan", Pan);

new Vue({
  render: h => h(App)
}).$mount('#app');
