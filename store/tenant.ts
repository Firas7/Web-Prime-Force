import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex';
import { TenantModel } from '~/models/tenant.model';
import { tenantService } from '~/services/tenant.service';
import { Status } from '~/models/status.enum';

export const state = () => ({
  tenants: [] as TenantModel[],
  documents: {} as number,
});

export const getters = getterTree(state, {
  getTenants: (state) => {
    return state.tenants;
  },
});

export const mutations = mutationTree(state, {
  setTenants(state, tenants: TenantModel[]) {
    state.tenants = tenants;
  },
  setDocuments(state, payload: number) {
    state.documents = payload;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    initialise({ commit }) {
      commit('setTenants', []);
    },
    async fetchTenants({ commit }, { startIndex, limit }) {
      await tenantService.getTenants(startIndex, limit).then((data) => {
        if (!!data.tenants && data.tenants.length !== 0) {
          commit('setTenants', data.tenants);
        }
        commit('setDocuments', data.documents);
      });
    },

    async deleteTenant({ commit }, { id, startIndex, limit }) {
      await tenantService.deleteTenant(id).then((status: Status) => {
        if (status === Status.SUCCESS) {
          tenantService.getTenants(startIndex, limit).then((data) => {
            commit('setTenants', data.tenants);
            commit('setDocuments', data.documents);
          });
        }
      });
    },
    async saveTenant({ commit }, { tenant, startIndex, limit }) {
      await tenantService.addTenant(tenant).then((status: Status) => {
        if (status === Status.SUCCESS) {
          tenantService.getTenants(startIndex, limit).then((data) => {
            commit('setTenants', data.tenants);
            commit('setDocuments', data.documents);
          });
        }
      });
    },
    async editTenant({ commit }, { tenant, startIndex, limit }) {
      await tenantService
        .editTenant(tenant._id, tenant)
        .then((status: Status) => {
          if (status === Status.SUCCESS) {
            tenantService.getTenants(startIndex, limit).then((tenants) => {
              commit('setTenants', tenants.tenants);
              commit('setDocuments', tenants.documents);
            });
          }
        });
    },
  }
);

export type RootState = ReturnType<typeof state>;
