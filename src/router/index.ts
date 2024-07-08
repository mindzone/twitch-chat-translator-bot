import { createRouter, createWebHistory } from 'vue-router'

import Home from '@/views/Home.vue';
import GettingStarted from '@/views/GettingStarted.vue';
import Dashboard from '@/views/Dashboard.vue';
import ManageWelcomeMessages from '@/views/settings/ManageWelcomeMessages.vue';

const routes = [
    {path: '/', component: Home},
    {path: '/getting-started', component: GettingStarted},
    {path: '/dashboard', component: Dashboard},
    {path: '/settings/welcome-messages', component: ManageWelcomeMessages},
    // { path: '/about', component: AboutView },
]

export const router = createRouter({
    history: createWebHistory(),
    routes,
});