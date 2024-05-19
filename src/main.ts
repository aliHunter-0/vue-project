import '@/utils/firebase';
import './assets/main.css';

import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Init the app
const app = createApp(App);

// Useat
app.use(router);

// Mount it
app.mount('#app');
