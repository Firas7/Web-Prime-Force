import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex';
import { LinkedPartner } from '~/models/linked-partner.model';
import { ProfileModel } from '~/models/profile.model';
import { Status } from '~/models/status.enum';
import { UserModel } from '~/models/user.model';
import { userService } from '~/services/user.service';

export const state = () => ({
  user: {} as UserModel,
});

export const getters = getterTree(state, {
  user: (state) => {
    return state.user;
  },

  getPartnerID: (state) => {
    if (state.user.linkedPartner != undefined) {
      return state.user.linkedPartner.partnerId;
    }
    return undefined;
  },
});

export const mutations = mutationTree(state, {
  setUser(state, newValue: UserModel) {
    state.user = newValue;
  },
  setPartnerId(state, linkedPartner: LinkedPartner) {
    state.user = { ...state.user, linkedPartner };
  },
  setPartnerIdConfirmed(state, isConfirmed: boolean) {
    if (state.user.linkedPartner) {
      state.user.linkedPartner.confirmed = isConfirmed;
    }
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    initialise({ commit }, user: UserModel) {
      commit('setUser', user);
    },
    async fetchUser({ commit }, id: string) {
      await userService.getUser(id).then((user: UserModel) => {
        commit('setUser', user);
        return;
      });
    },
    async addPartnerId({ commit }, partnerId: string) {
      userService.linkPartnerId(partnerId).then((statusCode: number) => {
        if (statusCode === 200) {
          commit('setPartnerId', { confirmed: false, partnerId: partnerId });
        }
      });
    },
    async confirmPartnerId({ commit }, validationCode: string) {
      userService
        .confirmPartnerId(validationCode)
        .then((statusCode: number) => {
          if (statusCode === 200) {
            commit('setPartnerIdConfirmed', true);
          }
        });
    },
    async updateUser({ commit }, updatedUser: UserModel) {
      const profile: ProfileModel = {
        _id: updatedUser._id,
        firstname: updatedUser.coredata.firstname,
        lastname: updatedUser.coredata.lastname,
        email: updatedUser.email,
      };
      userService.updateUser(profile).then((status: Status) => {
        if (status === Status.SUCCESS) {
          commit('setUser', updatedUser);
        }
      });
    },
  }
);

export type RootState = ReturnType<typeof state>;
