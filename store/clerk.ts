import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex';
import { ClerkModel } from '~/models/clerk.model';
import { clerkService } from '~/services/clerk.service';

export const state = () => ({
  clerk: {} as ClerkModel,
});

export const getters = getterTree(state, {
  getClerk: (state) => {
    return state.clerk;
  },
});

export const mutations = mutationTree(state, {
  setClerk(state, newClerk: ClerkModel) {
    state.clerk = newClerk;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchClerkByPartnerId({ commit }, partnerId: string) {
      await clerkService
        .getClerkByPartnerId(partnerId)
        .then((clerk: ClerkModel) => {
          commit('setClerk', clerk);
          return;
        });
    },
  }
);

export type RootState = ReturnType<typeof state>;
