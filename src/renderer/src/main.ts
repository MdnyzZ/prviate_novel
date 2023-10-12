import { createApp } from 'vue'

import router from './router';
import store from './store';

import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import App from './App.vue'

import '@renderer/assets/css/tailwind.css';

const app = createApp(App)

app.use(router);
app.use(store);
app.use(ArcoVueIcon);

app.mount('#app')
