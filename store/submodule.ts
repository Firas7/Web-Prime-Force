import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex';
import { userService } from '~/services/user.service';

export const state = () => ({
  firstName: '',
  lastName: '',
});

export const getters = getterTree(state, {
  fullName: (state) => state.firstName + ' ' + state.lastName,
});

export const mutations = mutationTree(state, {
  setFirstName(state, newValue: string) {
    state.firstName = newValue;
  },
  setLastName(state, newValue: string) {
    state.lastName = newValue;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    initialise({ commit }) {
      commit('setFirstName', 'John');
      commit('setLastName', 'Baker');
    },
    setName({ commit }, newName: string) {
      userService.getUser('5dcbcc301e974e009b092a8c');
      const names = newName.split(' ');
      commit('setFirstName', names[0]);
      if (names.length > 1) commit('setLastName', names[1]);
    },
  }
);
