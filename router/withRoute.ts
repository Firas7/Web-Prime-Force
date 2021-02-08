import VueRouter, { Route } from 'vue-router';

/* can also extend Vue to make sure nothing is colliding */
export interface WithRoute {
  $route: Route;
  $router: VueRouter;
}
