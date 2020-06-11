import Vue from 'vue';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.config.devtools = false;

// Brutalism library support
import {
  Alert,
  ButtonGroup,
  Button,
  Col,
  Divider,
  Dropdown,
  Dropzone,
  FileInput,
  Fold,
  Footer,
  Icon,
  InputScroll,
  Input,
  Menus,
  Panelify,
  PanelInfo,
  Panel,
  Row,
  Tabs,
  TextArea,
  Toggle,
  Wrapper,
} from "brutalism";

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
Vue.component("Input-Scroll", InputScroll);
Vue.component("Input", Input);
Vue.component("Menus", Menus);
Vue.component("Panelify", Panelify);
Vue.component("Panel-Info", PanelInfo);
Vue.component("Panel", Panel);
Vue.component("Row", Row);
Vue.component("Tabs", Tabs);
Vue.component("TextArea", TextArea);
Vue.component("Toggle", Toggle);
Vue.component("Wrapper", Wrapper);

new Vue({
  render: h => h(App)
}).$mount('#app');
