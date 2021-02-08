import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex';
import {
  BranchFormModel,
  BranchFormAnswerModel,
} from '~/models/branch-form/branch-form.model';
import { branchFormService } from '~/services/branch-form.service';
import { Status } from '~/models/status.enum';
import { UserModel } from '~/models/user.model';

export const state = () => ({
  branchForm: {} as BranchFormModel,
  branchFormAnswerModel: {} as BranchFormAnswerModel,
  cachedFormAnswers: [] as BranchFormAnswerModel[],
  user: {} as UserModel,
});

export const getters = getterTree(state, {
  branchForm: (state) => {
    return state.branchForm;
  },
  branchFormAnswerModel: (state) => {
    return state.branchFormAnswerModel;
  },

  getStatus: (state) => {
    return state.branchFormAnswerModel.status;
  },

  getPartnerId: (state) => {
    return state.branchFormAnswerModel.partnerId;
  },

  getContractId: (state) => {
    return state.branchFormAnswerModel.contractId;
  },

  getBranch: (state) => {
    return state.branchFormAnswerModel.branch;
  },

  getCachedFormAnswers: (state) => {
    return state.cachedFormAnswers;
  },
});

export const mutations = mutationTree(state, {
  setBranchForm(state, payload: BranchFormModel) {
    state.branchForm = payload;
  },

  setBranchFormAnswerModel(state, payload: BranchFormAnswerModel) {
    state.branchFormAnswerModel = payload;
  },

  setCachedFormAnswers(state, payload: BranchFormAnswerModel[]) {
    state.cachedFormAnswers = payload;
  },

  setStatus(state, status: Status) {
    state.branchFormAnswerModel.status = status;
  },

  setPartnerId(state, partnerId: string | undefined) {
    if (state.branchFormAnswerModel.partnerId === undefined) {
      state.branchFormAnswerModel.partnerId = partnerId;
    }
  },
  setContractId(state, contractId: string | undefined) {
    if (state.branchFormAnswerModel.contractId === undefined) {
      state.branchFormAnswerModel.contractId = contractId;
    }
  },
  setBranch(state, branch: string) {
    state.branchFormAnswerModel.branch = branch;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    initialise({ commit }) {
      commit('setBranchForm', {} as BranchFormModel);
      commit('setBranchFormAnswerModel', {} as BranchFormAnswerModel);
      commit('setCachedFormAnswers', []);
    },
    async fetchBranchFormByVersion(
      { commit },
      payload: { branch: string; version: string }
    ) {
      await branchFormService
        .getBranchFormByVersion(payload.branch, payload.version)
        .then((payload: BranchFormModel) => {
          commit('setBranchForm', payload);
        });
    },
    async fetchBranchFormAnswerById({ commit }, id: string) {
      await branchFormService.fetchClaimById(id).then((response) => {
        commit('setBranchFormAnswerModel', response);
      });
    },
    async fetchBranchFromAnswersByPartnerId({ commit }, partnerId: string) {
      await branchFormService
        .fetchClaimByPartnerId(partnerId)
        .then((response) => {
          commit('setCachedFormAnswers', response);
        });
    },
  }
);

export type RootState = ReturnType<typeof state>;
