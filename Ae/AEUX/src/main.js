import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.config.devtools = false;

// Brutalism library support
import {
	ButtonGroup,
	Button,
	Col,
	Divider,
	Dropdown,
	Fold,
	Icon,
	Menus,
	PanelInfo,
	Panel,
	Row,
	Select,
	Toggle,
	Wrapper,
	Dropzone
} from "../../../../../Modules/brutalism/src/brutalism";

require("../node_modules/@mdi/font/css/materialdesignicons.css");

Vue.component("Button-Group", ButtonGroup);
Vue.component("Button", Button);
Vue.component("Col", Col);
Vue.component("Divider", Divider);
Vue.component("Dropdown", Dropdown);
Vue.component("Fold", Fold);
Vue.component("Icon", Icon);
Vue.component("Menus", Menus);
Vue.component("Panel-Info", PanelInfo);
Vue.component("Panel", Panel);
Vue.component("Row", Row);
Vue.component("Select", Select);
Vue.component("Toggle", Toggle);
Vue.component("Wrapper", Wrapper);
Vue.component("Dropzone", Dropzone);

new Vue({
  render: h => h(App)
}).$mount('#app');
