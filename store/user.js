export const state = () => ({
  id: '',
  isFollowing: false,
});

export const mutations = {
  follow(state, id) {
    state.id = id;
    state.isFollowing = true;
  },

  unfollow(state, payload) {
    state.id = payload;
    state.isFollowing = false;
  },
};
