export const state = () => ({
  suggestions: [], //Cache suggestion api
});

export const mutations = {
  setSuggestions(state, payload) {
    state.suggestions = payload;
  },
};
