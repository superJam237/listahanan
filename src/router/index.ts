import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Register from "../views/Register.vue"
import Login from "../views/Login.vue"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Login,
  },
  {
    path: "/register",
    name: "Register Account",
    component: Register,
  },
  {
    path: "/login",
    name: "LogIn Account",
    component: Login,
  },
  {
    path: "/notes",
    name: "Notes",
    component: () => import(/* webpackChunkName: "notes" */ '../views/Notes.vue'),
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('user')

  if (to.matched.some(record => record.meta.requiresAuth) && !loggedIn) {
    next('/login')
  } else {
    next()
  }

})

export default router;
