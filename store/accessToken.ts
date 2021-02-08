import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex';
import { UserGroup } from '~/models/user-group.enum';
import { authService } from '~/services/auth.service';

var jwt = require('jsonwebtoken');

export const state = () => ({
  accessToken: '',
  userId: '',
  scope: [] as UserGroup[],
});

export const getters = getterTree(state, {
  accessToken: (state) => {
    return !!state.accessToken;
  },
  userId: (state) => {
    return !!state.userId
      ? state.userId
      : authService.getId(localStorage.getItem('access_token') || '');
  },
  getScope: () => {
    return getScope();
  },
  isInsured: (state) => {
    let scope = authService.getScope(
      localStorage.getItem('access_token') || ''
    );
    if (scope != undefined) {
      state.scope = scope;
      return scope.indexOf(UserGroup.INSURED) > -1;
    }
    return false;
  },
});

export const mutations = mutationTree(state, {
  setAccessToken(state, newValue: string) {
    state.accessToken = newValue;
  },
  setUserId(state, newValue: string) {
    state.userId = newValue;
  },
  setScope(state, scope: UserGroup[]) {
    state.scope = scope;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    async addAccessToken({ commit }, token: string) {
      commit('setAccessToken', token);
      return;
    },
    async addUserId({ commit }, token: string) {
      commit('setUserId', token);
      return;
    },
    async addScope({ commit }, scope: UserGroup[]) {
      commit('setScope', scope);
      return;
    },
  }
);

function getScope(): UserGroup[] {
  const decodedToken: any = jwt.decode(localStorage.getItem('access_token'));
  return decodedToken.scope;
}

export type RootState = ReturnType<typeof state>;
