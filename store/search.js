export const state = () => ({
  active: false, //Trigger the search dialog
});

export const mutations = {
  open(state) {
    state.active = true;
  },

  close(state) {
    state.active = false;
  },
};

export const actions = {
  open(context) {
    context.commit('open');
  },
  close(context) {
    context.commit('close');
  },
};
