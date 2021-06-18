<template>
  <div
    class="
      flex
      items-center
      sm:justify-center sm:shadow-base
      bg-white
      sm:max-w-lg
      w-full
      sm:rounded-2xl sm:p-6
      p-3
    "
  >
    <client-only>
      <stat-dialog ref="statDialog" :user="myUser"></stat-dialog>
    </client-only>

    <div class="flex flex-col items-center justify-center">
      <!--avatar-->
      <div class="flex sm:items-center mb-1">
        <div class="sm:mr-6 mr-4 sm:mb-0 mb-3">
          <avatar
            size="85"
            class="sm:text-4xl sm:w-28 sm:h-28 w-16 h-16 text-2xl"
            :user="user"
            circle
          ></avatar>
        </div>

        <!--Name and username-->
        <div class="flex flex-col justify-center">
          <div class="flex flex-wrap items-center">
            <!--Name-->
            <div class="mr-3 w-full">
              <div class="flex items-center overflow-hidden">
                <!--Verified badge-->
                <p class="font-bold text-base break-words">
                  {{ name }}
                </p>

                <div>
                  <iconify-icon
                    v-if="user.isVerified"
                    class="ml-1 text-xs text-orange-500"
                    icon="verified"
                  />
                </div>
              </div>

              <p class="text-xs break-words text-gray-400">
                @{{ user.username }}
              </p>
            </div>

            <!--Buttons-->
            <div v-if="$auth.loggedIn" class="flex my-2.5">
              <!--Message button-->
              <!-- <nuxt-link to="/chat">
                <vs-button
                  v-if="$auth.user.username !== user.username"
                  class="
                    rounded-full
                    sm:px-2
                    px-1
                    font-medium
                    opacity-95
                    m-0
                    mr-2
                    bg-orange-500
                    text-white
                  "
                  flat
                  size="small"
                  :aria-label="$t('message')"
                >
                  <iconify-icon icon="message" class="text-lg" />
                  <span class="ml-1">
                    {{ $t('message') }}
                  </span>
                </vs-button>
              </nuxt-link> -->

              <!--Follow button for user-->
              <vs-button
                v-if="$auth.user.username !== user.username"
                class="rounded-full font-medium px-1 opacity-95 m-0"
                border
                size="small"
                :class="{
                  'bg-orange-500 text-white': !user.isFollowing,
                }"
                @click="onFollow"
              >
                <iconify-icon
                  :icon="user.isFollowing ? 'userCheck' : 'userPlus'"
                  class="text-xl"
                />

                <span class="ml-1">
                  {{
                    user.isFollowing ? $t('user.following') : $t('user.follow')
                  }}</span
                >
              </vs-button>

              <!--Edit-->
              <vs-button
                v-if="$auth.user.username == user.username"
                class="rounded-full font-medium px-1 opacity-95 m-0"
                border
                size="small"
                :aria-label="$t('user.follow')"
                to="/settings"
              >
                <iconify-icon icon="edit" class="text-xl" />

                <span class="ml-1">{{ $t('user.edit') }}</span>
              </vs-button>
            </div>
          </div>

          <!--Stats-->
          <div class="flex items-center">
            <div class="flex flex-col items-center">
              <span class="text-black sm:text-lg text-sm font-bold">
                {{ formatNumber(myUser.numPosts) }}
              </span>
              <span class="text-gray-400 text-xs">{{ $t('user.post') }}</span>
            </div>

            <div
              role="button"
              class="flex flex-col items-center ml-6"
              @click="openDialog"
            >
              <span class="text-black sm:text-lg text-sm font-bold">
                {{ formatNumber(myUser.numFollowers) }}
              </span>
              <span class="text-gray-400 text-xs">{{ $t('follower') }}</span>
            </div>

            <div
              role="button"
              class="flex flex-col items-center ml-6"
              @click="openDialog(1)"
            >
              <span class="text-black sm:text-lg text-sm font-bold">
                {{ formatNumber(myUser.numFollowing) }}
              </span>
              <span class="text-gray-400 text-xs">{{ $t('following') }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mr-auto pl-1">
        <!--For content-->
      </div>
    </div>
  </div>
</template>

<script>
import { formatMixin } from '@/mixins/format';
import { ERelationship } from '@/server/types/relationship';
import statDialog from './statDialog';

export default {
  components: { statDialog },
  mixins: [formatMixin],
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      myUser: {},
      myFollower: 0,
    };
  },

  computed: {
    name() {
      if (this.user) {
        return this.user.personalInfo?.name ?? this.user.username ?? '';
      }
      return false;
    },
  },

  watch: {
    '$store.state.user': {
      handler(user) {
        if (this.user._id === user.id) {
          this.myUser.isFollowing = user.isFollowing;

          if (user.isFollowing) {
            this.myUser.numFollowers += 1;
          } else if (this.myUser.numFollowers > 0) {
            this.myUser.numFollowers -= 1;
          }
        }
      },
      deep: true,
    },
  },

  created() {
    this.myUser = this.user;
    this.myFollower = this.follower;
  },

  mounted() {
    console.log(this.user);
  },

  methods: {
    //Open w/ tabbar index
    openDialog(index = 0) {
      if (this.$auth.loggedIn) {
        this.$refs.statDialog.open(index);
      } else {
        this.$router.push('/login');
      }
    },

    async onFollow() {
      const userId = this.user._id;

      //Unfollow ppl
      if (this.myUser.isFollowing) {
        try {
          this.$store.commit('user/unfollow', userId);

          await this.$axios.put(
            `/follows/${ERelationship.USER}/${this.myUser._id}`
          );
        } catch (e) {
          this.$store.commit('user/follow', userId);
        }
        return;
      }

      //Follow ppl
      try {
        this.$store.commit('user/follow', userId);

        await this.$axios.put(
          `/follows/${ERelationship.USER}/${this.myUser._id}`
        );
      } catch (e) {
        this.$store.commit('user/unfollow', userId);
      }
    },
  },
};
</script>
