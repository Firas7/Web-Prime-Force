import { getAccessorType } from 'nuxt-typed-vuex';
import * as locale from '~/store/locale.js';
import * as accessToken from '~/store/accessToken';
import * as adminSearch from '~/store/adminSearch';
import * as claimcase from '~/store/claimcase';
import * as contract from '~/store/contract';
import * as insured from '~/store/insured';
import * as user from '~/store/user';
import * as branchForm from '~/store/branchForm';
import * as clerk from '~/store/clerk';
import * as agent from '~/store/agent';
import * as tenant from '~/store/tenant';
import * as chat from '~/store/chat';
import { actions, getters, mutations, state } from '~/store/submodule';

export const accessorType = getAccessorType({
  state,
  getters,
  mutations,
  actions,
  modules: {
    locale,
    user,
    accessToken,
    contract,
    claimcase,
    insured,
    branchForm,
    adminSearch,
    clerk,
    agent,
    chat,
    tenant,
  },
});

export const strict = false;
