import ElementPlus from 'element-plus';
import { createApp } from 'vue';

import "@/assets/main.css";
import '@/assets/misans.css';
import '@flaticon/flaticon-uicons/css/all/all.css';
import 'element-plus/dist/index.css';

import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';

const app = createApp(App)
const pinia = createPinia();
app.use(ElementPlus)

app.use(router)
app.use(pinia)

app.mount('#app')

