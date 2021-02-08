import { getterTree, mutationTree } from 'nuxt-typed-vuex';
import {
  ClaimcaseModel,
  ClaimcaseCountStateModel,
} from '~/models/claimcase.model';
import { Status } from '~/models/status.enum';
import { actionTree } from '~/node_modules/nuxt-typed-vuex';
import { claimcaseService } from '~/services/claimcase.service';
import { ClaimcaseCountStateModel_Default } from '../models/claimcase.model';

export const state = () => ({
  claimcases: [] as ClaimcaseModel[],
  countsByState: {} as ClaimcaseCountStateModel,
  claimcase: {} as ClaimcaseModel,
  image: {} as Object,
});

export const getters = getterTree(state, {
  getClaimCase: (state) => {
    return state.claimcase;
  },
  getClaimCases: (state) => {
    return state.claimcases;
  },
  getCountsByState: (state) => {
    return state.countsByState;
  },
  getClaimCaseID: (state) => {
    return state.claimcase._id;
  },
  getClaimCaseSecret: (state) => {
    return state.claimcase.secret;
  } /*
  getClaimcaseImageIDs: state => {
    return state.claimcase.images;
  },*/,
  getClaimcaseImageFile: (state) => {
    return state.image;
  },
  getStatus: (state) => {
    return state.claimcase.status;
  },
  /*
  getContractID: state => {
    return state.claimcase.contractID;
  },*/
});

export const mutations = mutationTree(state, {
  setClaimCase(state, payload: ClaimcaseModel) {
    state.claimcase = payload;
  },
  setClaimCases(state, payload: ClaimcaseModel[]) {
    state.claimcases = payload;
  },
  setCountsByState(state, payload: ClaimcaseCountStateModel) {
    state.countsByState = payload;
  } /*
  setSendMail(state, sendMail: boolean) {
    state.claimcase.sendMail = sendMail;
  },*/,
  setClaimCaseID(state, id: string) {
    state.claimcase._id = id;
  },
  setClaimCaseSecret(state, secret: string) {
    state.claimcase.secret = secret;
  },
  setImage(state, image: Object) {
    state.image = image;
  },
  setStatus(state, status: Status) {
    state.claimcase.status = status;
  },
  setContractID(state, contractID: string) {
    throw new Error('NOT YET IMPLEMENTED' + state + contractID);

    //state.claimcase.contractID = contractID;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    initialise({ commit }, claimcase: ClaimcaseModel) {
      commit('setClaimCases', []);
      commit('setClaimCase', claimcase);
      commit('setCountsByState', ClaimcaseCountStateModel_Default);
      commit('setImage', '');
    },
    async fetchClaimCases({ commit }) {
      claimcaseService.getAllClaimcases().then((payload: ClaimcaseModel[]) => {
        commit('setClaimCases', payload);
      });
    },
    async fetchCountsByState({ commit }) {
      claimcaseService
        .getCountState()
        .then((payload: ClaimcaseCountStateModel) => {
          commit('setCountsByState', payload);
        });
    },
    async fetchClaimCasesByPartnerId({ commit }, partnerId: string) {
      await claimcaseService
        .getClaimcasesByPartnerId(partnerId)
        .then((payload: ClaimcaseModel[]) => {
          commit('setClaimCases', payload);
        });
    },
    async addClaimCase({ commit }, payload: Partial<ClaimcaseModel>) {
      await claimcaseService
        .postClaimcase(payload)
        .then((claimcaseID: string) => {
          commit('setClaimCaseID', claimcaseID);
        });
    } /*
    async updateClaimCaseWithSecret(
      { state, commit },
      payload: ClaimcaseModel
    ) {
      await claimcaseService
        .putClaimcaseWithSecret(
          state.claimcase._id,
          state.claimcase.secret,
          payload
        )
        .then(status => {
          if (status === Status.SUCCESS) {
            claimcaseService
              .getAllClaimcases()
              .then((payload: ClaimcaseModel[]) => {
                commit('setClaimCases', payload);
              });
          }
        });
    },*/,

    async uploadClaimcaseImage({ state }, image: FormData) {
      await claimcaseService.putClaimcaseImages(state.claimcase._id, image);
    },
    async fetchClaimcaseImage({ state, commit }, imageID: string) {
      await claimcaseService
        .getClaimcaseImage(state.claimcase._id, imageID)
        .then((payload) => {
          commit('setImage', payload);
        });
    },
    async fetchClaimCaseWithSecret({ state, commit }) {
      await claimcaseService
        .getClaimcaseWithSecret(state.claimcase._id, state.claimcase.secret)
        .then((payload: ClaimcaseModel) => {
          commit('setClaimCase', payload);
        });
    },
  }
);

export type RootState = ReturnType<typeof state>;
