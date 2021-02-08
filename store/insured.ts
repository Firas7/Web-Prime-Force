import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex';
import { InsuredModel } from '~/models/insured.model';
import { insuredService } from '~/services/insured.service';

export const state = () => ({
  insured: {} as InsuredModel,
});

export const getters = getterTree(state, {
  getInsured: (state) => {
    return state.insured;
  },
});

export const mutations = mutationTree(state, {
  setInsured(state, newInsured: InsuredModel) {
    state.insured = newInsured;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchInsuredByPartnerId({ commit }, partnerId: string) {
      await insuredService
        .getInsuredByPartnerID(partnerId)
        .then((insured: InsuredModel) => {
          commit('setInsured', insured);
          return;
        });
    },
    async fetchInsuredByUserPartnerId({ commit }, partnerId: string) {
      await insuredService
        .getInsuredByUserPartnerID(partnerId)
        .then((insured: InsuredModel) => {
          commit('setInsured', insured);
          return;
        });
    },
    async fetchInsuredById({ commit }, id: string) {
      await insuredService.getInsuredByID(id).then((insured: InsuredModel) => {
        commit('setInsured', insured);
        return;
      });
    },
    async fetchInsuredByPartnerIdInUser({ commit }, partnerId: string) {
      await insuredService
        .getInsuredByPartnerIdInUser(partnerId)
        .then((insured: InsuredModel) => {
          commit('setInsured', insured);
          return;
        });
    },
  }
);

export type RootState = ReturnType<typeof state>;
