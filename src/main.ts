import { createApp } from "vue";
import App from "./App.vue";
import './assets/index.css'
import { router } from "@/router";
import { i18n } from "@/lib/i18n.ts";

createApp(App)
    .use(router)
    .use(i18n)
    .mount("#app");
