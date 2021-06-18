<template>
  <vs-dialog
    v-model="active"
    overflow-hidden
    not-close
    style="--mdc-theme-primary: var(--color-orange-500)"
  >
    <template #header>
      <dialog-header @onClose="active = false">
        {{ user.username ? user.username : '' }}
      </dialog-header>

      <!--MDI Tab bar https://material.io/develop/web/supporting/tab-bar-->
      <div ref="tabBar" class="mdc-tab-bar mt-2" role="tablist">
        <div class="mdc-tab-scroller">
          <div class="mdc-tab-scroller__scroll-area">
            <div class="mdc-tab-scroller__scroll-content">
              <template v-for="(item, i) in items">
                <button
                  v-if="item.type !== ''"
                  :key="i"
                  class="mdc-tab"
                  :class="{ 'mdc-tab--active': i === 0 }"
                  role="tab"
                  aria-selected="true"
                  tabindex="0"
                >
                  <span class="mdc-tab__content">
                    <span class="mdc-tab__text-label">{{ item }}</span>
                  </span>
                  <span
                    class="mdc-tab-indicator"
                    :class="{ 'mdc-tab-indicator--active': i === 0 }"
                  >
                    <span
                      class="
                        mdc-tab-indicator__content
                        mdc-tab-indicator__content--underline
                      "
                    ></span>
                  </span>
                  <span class="mdc-tab__ripple"></span>
                </button>
              </template>

              <button
                v-if="$auth.loggedIn && user._id === $auth.user._id"
                class="mdc-tab"
                role="tab"
                aria-selected="true"
                tabindex="0"
              >
                <span class="mdc-tab__content">
                  <span class="mdc-tab__text-label">{{
                    $t('user.close_frd')
                  }}</span>
                </span>
                <span class="mdc-tab-indicator">
                  <span
                    class="
                      mdc-tab-indicator__content
                      mdc-tab-indicator__content--underline
                    "
                  ></span>
                </span>
                <span class="mdc-tab__ripple"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <transition-group tag="div" :name="isBack ? 'slideback' : 'slide'">
      <!--Followers-->
      <section
        v-show="currentIndex === 0"
        :key="0"
        class="absolute w-full max-w-[95%] pb-2"
      >
        <template v-if="isFollowsLoading">
          <placeholder v-for="(item, i) in 8" :key="i" />
        </template>

        <follow-item
          v-for="(item, i) in followers"
          :key="i"
          :user="item.follower"
        ></follow-item>
      </section>

      <!--Followings-->
      <section
        v-show="currentIndex === 1"
        :key="1"
        class="absolute w-full max-w-[95%] pb-2"
      >
        <template v-if="isFollowsLoading">
          <placeholder v-for="(item, i) in 8" :key="i" />
        </template>

        <follow-item
          v-for="(item, i) in followings"
          :key="i"
          :user="item.parentID"
        ></follow-item>
      </section>

      <!--Close friend-->
      <section
        v-show="currentIndex === 2"
        :key="2"
        class="absolute w-full max-w-[95%] pb-2"
      >
        <template v-if="isFriendsLoading">
          <placeholder v-for="(item, i) in 8" :key="i" />
        </template>

        <div
          v-for="(item, i) in friends"
          :key="i"
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
          "
        >
          <avatar circle :user="item" :is-close="item.isCloseFriend"></avatar>

          <!--Name-->
          <div class="ml-3 flex">
            <div>
              <p class="text-sm truncate font-semibold">
                {{ name(item) }}
              </p>
              <p class="text-gray-500 text-xs truncate font-medium">
                {{ item.username }}
              </p>
            </div>
          </div>

          <div class="ml-auto">
            <vs-button
              v-if="item._id !== $auth.user._id"
              class="
                rounded-full
                sm:px-2
                py-2.5
                font-medium
                max-w-[76px]
                h-[25px]
              "
              :class="
                item.isCloseFriend
                  ? 'bg-transparent text-grey-500'
                  : 'bg-orange-500 text-white'
              "
              border
              size="small"
              @click="onCloseFriend(item)"
            >
              {{ !item.isCloseFriend ? $t('user.add') : $t('user.remove') }}
            </vs-button>
          </div>
        </div>
      </section>
    </transition-group>
  </vs-dialog>
</template>

<script>
import { MDCTabBar } from '@material/tab-bar';
import { ERelationship } from '@/server/types/relationship';
import placeholder from '@/components/searchDialog/placeholder';
import followItem from '@/components/profileStat/followItem';

export default {
  components: {
    placeholder,
    followItem,
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tabBar: null,
      tabBarAdapter: null,
      isBack: false,
      active: false,
      currentIndex: 0,
      followers: [],
      followings: [],
      isFollowsLoading: false,
      isFollowsFetched: false,
      friends: [],
      isFriendsLoading: false,
      isFreindsFetched: false,
      items: [this.$t('user.followers'), this.$t('user.following')],
    };
  },
  watch: {
    currentIndex(newVal, oldVal) {
      if (newVal < oldVal) {
        this.isBack = true;
      } else {
        this.isBack = false;
      }
    },
    active(val) {
      if (!val) {
        this.tabBar = null;
      }
    },
  },
  methods: {
    parentIDPurify(item) {
      // eslint-disable-next-line no-prototype-builtins
      if (item.hasOwnProperty('parentID') && item.parentID) {
        return item.parentID;
      }

      return item;
    },

    //Open w/ tabbar index
    open(index = 0) {
      this.active = true;

      this.$nextTick(() => {
        this.tabBar = new MDCTabBar(this.$refs.tabBar);

        //See https://material.io/develop/web/supporting/tab-bar
        this.tabBarAdapter = this.tabBar.foundation.adapter;

        //Listen on tab bar change
        this.tabBar.listen('MDCTabBar:activated', this.onTabBarChange);

        this.setTabBarIndex(index);

        this.fetch();
      });
    },

    onTabBarChange(e) {
      this.currentIndex = e.detail.index;
      this.fetch();
    },

    fetch() {
      if (
        (this.currentIndex === 0 || this.currentIndex === 1) &&
        !this.isFollowsFetched
      ) {
        this.fetchFollows();
      }

      if (this.currentIndex === 2 && !this.isFreindsFetched) {
        this.fetchFriends();
      }
    },

    setTabBarIndex(index) {
      this.tabBarAdapter.setActiveTab(index);
    },

    async fetchFriends() {
      try {
        this.isFriendsLoading = true;

        const friendRes = await this.$axios.get('utils/users/friends');

        this.friends = friendRes.data.friends;

        this.isFreindsFetched = true;
        this.isFriendsLoading = false;
      } catch (err) {
        console.log(err);
        this.isFriendsLoading = false;
      }
    },

    async fetchFollows() {
      try {
        this.isFollowsLoading = true;

        const res = await this.$axios.get(`/users/${this.user._id}/follows`);

        const myFriendIDs = this.$auth.user.friends.map((friend) => friend._id);
        this.followers = res.data.followers.map((follower) => {
          const isFriend = myFriendIDs.includes(
            follower.follower._id.toString()
          );
          follower.follower.isFollowing = !!isFriend;
          return follower;
        });

        if (this.user._id !== this.$auth.user._id) {
          this.followings = res.data.followings.map((following) => {
            const isFriend = myFriendIDs.includes(
              following.parentID._id.toString()
            );
            following.parentID.isFollowing = !!isFriend;
            return following;
          });
        } else {
          this.followings = res.data.followings;
        }

        this.isFollowsLoading = false;
        this.isFollowsFetched = true;
      } catch (err) {
        console.log(err);
        this.isFollowsLoading = false;
      }
    },

    name(user) {
      if (user) {
        return user.personalInfo?.name ?? user.username ?? '';
      }
      return '';
    },

    async onFollow(item) {
      // console.log('onfollow', item);
      //Unfollow ppl
      if (item.isFollowing) {
        try {
          item.isFollowing = false;

          await this.$axios.put(`/follows/${ERelationship.USER}/${item._id}`);
        } catch (error) {
          item.isFollowing = true;
        }
        return;
      }

      //Follow ppl
      try {
        item.isFollowing = true;

        this.followings.push({
          parentID: item,
        });

        this.followings = [...new Set(this.followings)];

        let canFriend = false;

        this.followers.forEach((follower) => {
          if (follower.follower.username === item.username) {
            canFriend = true;
          }
        });

        if (canFriend) {
          this.friends.push(item);
        }

        await this.$axios.put(`/follows/${ERelationship.USER}/${item._id}`);
      } catch (error) {
        item.isFollowing = false;
      }
    },

    async onCloseFriend(item) {
      // Remove close friend
      if (item.isCloseFriend) {
        try {
          item.isCloseFriend = false;
          await this.$axios.put('/utils/users/closeFriends', {
            userId: item._id,
          });
        } catch (e) {
          console.log(e);
          item.isCloseFriend = true;
        }
        return;
      }

      // Add close friend
      try {
        item.isCloseFriend = true;
        await this.$axios.put('/utils/users/closeFriends', {
          userId: item._id,
        });
      } catch (e) {
        console.log(e);
        item.isCloseFriend = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .vs-dialog {
  width: 500px;

  &__content {
    overflow-x: hidden;
    height: calc(var(--real-height) - 230px);
    padding-left: 0.75rem !important;
    padding-right: 0.75rem !important;
    min-height: 230px;
    max-height: 600px;
    margin-bottom: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}

::v-deep .vs-input {
  padding-top: 0.25rem !important;
  padding-bottom: 0.25rem !important;
}

.slide-leave-active,
.slide-enter-active {
  transition: 0.5s;
}
.slide-enter {
  transform: translate(100%, 0);
}
.slide-leave-to {
  transform: translate(-110%, 0);
}

.slideback-leave-active,
.slideback-enter-active {
  transition: 0.5s;
}
.slideback-enter {
  transform: translate(-110%, 0);
}
.slideback-leave-to {
  transform: translate(100%, 0);
}

/* Fullscreen for mobile */
@media (max-width: theme('screens.md')) {
  @include fullscreen-vs-dialog(100px);
}
</style>
