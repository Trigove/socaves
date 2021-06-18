<template>
  <div class="flex items-center justify-center">
    <div
      class="
        w-28
        flex flex-col
        justify-center
        items-center
        rounded-xl
        border border-gray-200
        p-2
      "
      style="height: 8.5rem"
    >
      <avatar :user="user" size="50" circle />

      <nuxt-link
        :to="localePath(`/profile/${user.username}`)"
        class="text-center w-20 my-1"
      >
        <p class="text-xs truncate font-semibold">
          {{ name(user) }}
        </p>
        <p class="text-gray-500 truncate font-medium text-[11px]">
          {{ user.username }}
        </p>
      </nuxt-link>

      <button
        v-if="user._id !== $auth.user._id"
        class="
          transition-all
          duration-300
          rounded-full
          text-xs
          px-3
          font-medium
          h-[22px]
          flex
          items-center
          justify-center
        "
        :class="
          isFollowing
            ? 'bg-transparent border-[1.5px] border-orange-500 text-orange-500'
            : 'bg-orange-500 text-white'
        "
        @click="follow"
      >
        <span>
          {{ isFollowing ? $t('user.following') : $t('user.follow') }}
        </span>
      </button>

      <!-- <button class="rounded-3xl bg-orange-50 w-20 focus:outline-none">
            <span class="text-orange-500 font-semibold text-xs">Following</span>
          </button> -->
    </div>
  </div>
</template>

<script>
import { ERelationship } from '@/server/types/relationship';
import { mapState } from 'vuex';

export default {
  props: {
    user: {
      type: [Object, Boolean],
      default: () => {
        return {
          username: 'guest',
          personalInfo: {
            name: 'Guest',
          },
        };
      },
    },
  },

  data() {
    return {
      isFollowing: false,
    };
  },

  computed: {
    //Fix
    ...mapState('widget', ['suggestions']),
  },

  watch: {
    '$store.state.user': {
      handler(user) {
        if (this.user._id === user.id) {
          this.isFollowing = user.isFollowing;
          this.updateWidget();
          console.log('changed', user.isFollowing);
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.isFollowing = this.user.isFollowing;
  },

  methods: {
    name(user) {
      if (user) {
        return user.personalInfo?.name ?? user.username ?? '';
      }
      return '';
    },

    updateWidget() {
      const newSuggestions = [...this.suggestions];

      newSuggestions.forEach((item, i) => {
        if (item._id === this.user._id) {
          newSuggestions[i].isFollowing = this.isFollowing;
        }
      });

      this.$store.commit('widget/setSuggestions', newSuggestions);
    },

    async follow() {
      const userId = this.user._id;

      //Unfollow ppl
      if (this.isFollowing) {
        try {
          this.$store.commit('user/unfollow', userId);

          await this.$axios.put(
            `/follows/${ERelationship.USER}/${this.user._id}`
          );
        } catch (error) {
          this.$store.commit('user/follow', userId);
        }
        return;
      }

      //Follow ppl
      try {
        this.$store.commit('user/follow', userId);

        await this.$axios.put(
          `/follows/${ERelationship.USER}/${this.user._id}`
        );
      } catch (error) {
        this.$store.commit('user/unfollow', userId);
      }
    },
  },
};
</script>
