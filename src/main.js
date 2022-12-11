import { createApp } from 'vue/dist/vue.esm-bundler';
import App from './App.vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import VueCookies from 'vue-cookies';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import Login from './components/Login.vue';
import Home from './components/Home.vue';
import AdminHome from './components/admin/Home.vue';
import Table from './components/admin/Table.vue';
import RemoteLab from './components/RemoteLab.vue';

const session = new Session('http://localhost:8080');

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', component: Login },
    { path: '/home', component: Home },
    { path: '/admin', component: AdminHome },
    { path: '/admin/activity', component: Table, props: ActivityModel },
    { path: '/admin/view', component: Table, props: ViewModel },
    { path: '/admin/controller', component: Table, props: ControllerModel },
    { path: '/admin/users', component: Table, props: UserModel },
    { path: '/admin/courses', component: Table, props: CourseModel },
    { path: '/remotelab', component: RemoteLab, props: { builtin: true } },
    // {path: '/activity/:name', component: ActivityPanel },
    // {path: '/view', component: ViewsPanel },
    // {path: '/courses/edit', component: CourseEditorPanel },
  ],
});

router.beforeResolve(async (to, from, next) => {
  const user = await session.authenticate().catch((error) => {});
  // console.log('RESOLVIN')
  // console.log(user)
  // console.log(to.path)
  // if (user && to.path == '/') {
  //   return next('/');
  // }
  // if (!user && to.path != '/') {
  //   return next('/');
  // }
  next();
});

createApp(App, { session }).use(router).use(VueCookies).mount('#app');
