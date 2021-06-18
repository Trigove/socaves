<template>
  <div
    class="
      flex
      items-center
      text-lg
      hover:bg-gray-50
      active:bg-gray-100
      px-2
      py-3
      rounded-xl
      transition-colors
      duration-200
      justify-between
    "
  >
    <nuxt-link
      :to="localePath(`/profile/${user.username}`)"
      class="flex items-center"
    >
      <avatar circle :user="user"></avatar>

      <!--Name-->
      <div class="ml-3 flex">
        <div>
          <p class="text-sm truncate font-semibold">
            {{ name(user) }}
          </p>
          <p class="text-gray-500 text-xs truncate font-medium">
            {{ user.username }}
          </p>
        </div>
      </div>
    </nuxt-link>

    <!--TODO: isFollowing-->
    <button
      v-if="user._id !== $auth.user._id"
      class="
        rounded-full
        text-sm
        py-2
        px-3
        font-medium
        h-[25px]
        flex
        items-center
        justify-center
        transition-all
        duration-300
      "
      :class="
        isFollowing
          ? 'bg-transparent  border-[1.5px] border-orange-500 text-orange-500'
          : 'bg-orange-500 text-white'
      "
      @click="follow(user)"
    >
      <span>
        {{ isFollowing ? $t('user.following') : $t('user.follow') }}
      </span>
    </button>
  </div>
</template>

<script>
import { ERelationship } from '@/server/types/relationship';

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

  watch: {
    '$store.state.user': {
      handler(user) {
        if (this.user._id === user.id) {
          this.isFollowing = user.isFollowing;
          console.log('changed', user.isFollowing);
        }
      },
      deep: true,
    },
  },

  mounted() {
    this.isFollowing = this.user.isFollowing ?? true;
  },

  methods: {
    name(user) {
      if (user) {
        return user.personalInfo?.name ?? user.username ?? '';
      }
      return '';
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
