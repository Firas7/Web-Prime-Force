import { actionTree, getterTree, mutationTree } from 'nuxt-typed-vuex';
import { searchService } from '~/services/search.service';
import { SearchResult } from '../models/search.model';

export const state = () => ({
  searchResults: {} as SearchResult,
});

export const getters = getterTree(state, {
  searchResults: (state) => {
    return state.searchResults;
  },
});

export const mutations = mutationTree(state, {
  setSearchResults(state, payload: SearchResult) {
    state.searchResults = payload;
  },
});

export const actions = actionTree(
  { state, getters, mutations },
  {
    initialise({ commit }) {
      commit('setSearchResults', {
        time: 0,
        length_total: 0,
        length_page: 0,
        result: [],
      });
    },
    async fetchSearchResults({ commit }, { searchTerm, startIndex, limit }) {
      commit('setSearchResults', {
        time: -1,
        length_total: 0,
        length_page: 0,
        result: [],
      });
      await searchService
        .getSearchResults(searchTerm, startIndex, limit)
        .then((searchResults: SearchResult) => {
          commit('setSearchResults', searchResults);
          return;
        });
    },
  }
);

export type RootState = ReturnType<typeof state>;
