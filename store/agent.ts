import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex';
import { AgentModel } from '~/models/agent.model';
import { agentService } from '~/services/agent.service';

export const state = () => ({
  agent: {} as AgentModel,
});

export const getters = getterTree(state, {
  getAgent: (state) => {
    return state.agent;
  },
});

export const mutations = mutationTree(state, {
  setAgent(state, newAgent: AgentModel) {
    state.agent = newAgent;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    async fetchAgentByPartnerId({ commit }, partnerId: string) {
      await agentService
        .getAgentByPartnerId(partnerId)
        .then((agent: AgentModel) => {
          commit('setAgent', agent);
          return;
        });
    },
  }
);

export type RootState = ReturnType<typeof state>;
