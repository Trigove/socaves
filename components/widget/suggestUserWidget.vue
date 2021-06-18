<template>
  <div
    v-if="suggestions.length > 0"
    class="shadow-base bg-white rounded-2xl px-4 py-3 text-sm"
  >
    <p class="text-gray-400 mb-3 text- font-medium">{{ $t('suggested') }}</p>

    <!--Grid-->
    <div :key="componentKey" class="grid grid-cols-2 gap-3">
      <suggest-user v-for="(item, i) in suggestions" :key="i" :user="item" />
    </div>
  </div>
</template>

<script>
import suggestUser from '@/components/widget/suggestUser';
import { mapState } from 'vuex';

export default {
  components: {
    suggestUser,
  },

  async fetch() {
    try {
      if (this.suggestions.length <= 0) {
        const res = await this.$axios.get('/utils/users/random');
        //Set suggestions
        this.$store.commit('widget/setSuggestions', res.data);
      }
    } catch (err) {
      console.log(err);
    }
  },

  data() {
    return {
      componentKey: 0,
    };
  },

  computed: {
    //Fix
    ...mapState('widget', ['suggestions']),
  },

  methods: {
    name(user) {
      if (user) {
        return user.personalInfo.name ?? user.username;
      }
      return '';
    },

    // updateUserFollow(userId, isFollowing) {
    //   const newSuggestions = [...this.suggestions];

    //   newSuggestions.forEach((item, i) => {
    //     if (item._id === userId) {
    //       newSuggestions[i].isFollowing = isFollowing;
    //     }
    //   });

    //   this.$store.commit('widget/setSuggestions', newSuggestions);

    //   this.forceRerender();
    // },
  },
};
</script>
