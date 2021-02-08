/*
export const state = () => ({
    locales: ['de', 'en'],
    default: 'de',
    locale: 'de'
})

export const getters = {
    getLocale: (state: RootState) => (state.locale ? state.locale : state.default),
};

export const mutations = {
    setLang(state: RootState, locale: string) {
        if (state.locales.includes(locale)) {
            state.locale = locale
        }
    },

    initialiseStore() {
        console.log('initialised')
    },
}

export type RootState = ReturnType<typeof state>
*/
export const state = () => ({
  locales: ['de', 'en'],
  locale: 'de',
});

export const mutations = {
  SET_LANG(state, locale) {
    if (state.locales.includes(locale)) {
      state.locale = locale;
    }
  },
};
