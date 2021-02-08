/*
import Vue from "vue";
import Router from "vue-router";
import { Admin, Default } from '~/layouts';


Vue.use(Router);
let router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Welcome",
      component: Default
    },
    {
      path: "/login",
      name: "Welcome",
      component: Default
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: Admin,
      meta: {
        requiresAuth: true
      }
    }
  ]
});
router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (localStorage.getItem("jwt") == null) {
      next({
        path: "/login",
        params: { nextUrl: to.fullPath }
      });
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.guest)) {
    if (localStorage.getItem("jwt") == null) {
      next();
    } else {
      next({ name: "dashboard" });
    }
  } else {
    next();
  }
});
export default router;
*/
