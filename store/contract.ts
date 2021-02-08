import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex';
import { ContractModel } from '~/models/contract.model';
import { Status } from '~/models/status.enum';
import { contractService } from '~/services/contract.service';

export const state = () => ({
  contracts: [] as ContractModel[],
  documents: {} as number,
});

export const getters = getterTree(state, {
  contracts: (state) => {
    return state.contracts;
  },
  documents: (state) => {
    return state.documents;
  },
});

export const mutations = mutationTree(state, {
  setContracts(state, payload: ContractModel[]) {
    state.contracts = payload;
  },
  setDocuments(state, payload: number) {
    state.documents = payload;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    initialise({ commit }) {
      commit('setContracts', []);
    },
    async fetchContractsByPartnerId({ commit }, partnerId: string) {
      await contractService
        .getContractsByPartnerId(partnerId)
        .then((contracts: ContractModel[]) => {
          commit('setContracts', contracts);
        });
    },
    async fetchUserContractsByPartnerId({ commit }, partnerId: string) {
      await contractService
        .getUserContractsByPartnerId(partnerId)
        .then((contracts: ContractModel[]) => {
          commit('setContracts', contracts);
        });
    },
    async fetchContractByContractId({ commit }, contractId: string) {
      await contractService
        .getContractById(contractId)
        .then((contracts: ContractModel[]) => {
          commit('setContracts', contracts);
        });
    },
    async fetchContracts({ commit }, { startIndex, limit }) {
      await contractService.getContracts(startIndex, limit).then((data) => {
        if (!!data.contracts && data.contracts.length !== 0) {
          commit('setContracts', data.contracts);
        }
        commit('setDocuments', data.documents);
      });
    },
    async saveContract({ commit }, { contract, startIndex, limit }) {
      await contractService.addContract(contract).then((status: Status) => {
        if (status === Status.SUCCESS) {
          contractService.getContracts(startIndex, limit).then((data) => {
            commit('setContracts', data.contracts);
            commit('setDocuments', data.documents);
          });
        }
      });
    },
    async editContract({ commit }, payload) {
      await contractService
        .editContract(payload._id, payload)
        .then((status: Status) => {
          if (status === Status.SUCCESS) {
            contractService.getContractById(payload._id).then((contract) => {
              commit('setContracts', contract);
            });
          }
        });
    },
    async deleteContract({ commit }, { contractId, startIndex, limit }) {
      await contractService
        .deleteContract(contractId)
        .then((status: Status) => {
          if (status === Status.SUCCESS) {
            contractService.getContracts(startIndex, limit).then((data) => {
              commit('setContracts', data.contracts);
              commit('setDocuments', data.documents);
            });
          }
        });
    },
  }
);

export type RootState = ReturnType<typeof state>;
