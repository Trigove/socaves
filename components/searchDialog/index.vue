<!--eslint-disable vue/no-v-html-->
<template>
  <vs-dialog
    v-model="active"
    overflow-hidden
    not-close
    prevent-close
    style="--mdc-theme-primary: var(--color-orange-500)"
  >
    <template #header>
      <dialog-header @onClose="close">
        {{ $t('search.title') }}
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
            </div>
          </div>
        </div>
      </div>
    </template>

    <!--wrapper-->

    <vs-input
      ref="input"
      v-model="query"
      class="mb-2"
      autofocus
      :aria-labelledby="$t('search.title')"
      :placeholder="$t('search.title')"
    >
      <template #icon>
        <div>
          <iconify-icon icon="search" class="text-gray-500" />
        </div>
      </template>
    </vs-input>

    <transition-group
      :key="componentKey"
      tag="div"
      :name="isBack ? 'slideback' : 'slide'"
    >
      <div
        v-show="currentIndex === 0"
        :key="0"
        class="absolute w-full max-w-[95%] pb-2"
      >
        <nuxt-link
          v-for="(item, i) in userList"
          :key="i"
          :to="`/profile/${item.username}`"
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
          @click.native="close"
        >
          <div>
            <avatar circle :user="item"></avatar>
          </div>

          <!--Name-->
          <div class="ml-3 flex">
            <div>
              <p class="text-sm truncate font-semibold">
                {{ item.username }}
              </p>
              <p class="text-gray-500 text-xs truncate font-medium">
                {{ item.username }}
              </p>
            </div>
          </div>
        </nuxt-link>

        <!--Loading Placeholder-->
        <template v-if="userListLoading">
          <placeholder v-for="(item, i) in 8" :key="i" />
        </template>

        <div
          v-if="userList.length <= 0 && !isTyping"
          class="font-medium md:text-[14.5px] text-sm text-gray-500 mx-2 mt-2"
        >
          <!--No result placeholder-->
          <span v-if="query && !userListLoading">
            {{ $t('search.no_result') }}
          </span>
          <!--Suggest placeholder-->
          <span v-if="!query && !userListLoading"
            >{{ $t('search.try_search') }}
          </span>
        </div>
      </div>

      <!--For followings-->
      <div
        v-show="currentIndex === 1"
        :key="1"
        class="absolute w-full max-w-[95%] pb-2"
      >
        <template v-for="(item, i) in postList">
          <nuxt-link
            :key="i"
            :to="`/post/${item._id}`"
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
            @click.native="close"
          >
            <div>
              <avatar circle :user="item.user ? item.user : item"></avatar>
            </div>

            <!--Name-->
            <div class="ml-3 flex">
              <div>
                <p class="text-sm truncate font-semibold">
                  {{ item.user ? item.user.username : '' }}
                </p>
                <!--Content-->
                <p
                  class="text-gray-500 text-xs font-medium"
                  style="word-break: break-all"
                  v-html="clipHTML(item.content)"
                ></p>
              </div>
            </div>
          </nuxt-link>
        </template>

        <!--Loading Placeholder-->
        <template v-if="postListLoading">
          <placeholder v-for="(item, i) in 8" :key="i" />
        </template>

        <div
          v-if="postList.length <= 0 && !isTyping"
          class="font-medium md:text-[14.5px] text-sm text-gray-500 mx-2 mt-2"
        >
          <!--No result placeholder-->
          <span v-if="query && !postListLoading">
            {{ $t('search.no_result') }}
          </span>
          <!--Suggest placeholder-->
          <span v-if="!query && !postListLoading"
            >{{ $t('search.try_search') }}
          </span>
        </div>
      </div>
    </transition-group>
  </vs-dialog>
</template>

<script>
import { debounce } from 'debounce';
import { MDCTabBar } from '@material/tab-bar';
import clip from 'text-clipper';
import placeholder from './placeholder';

export default {
  components: { placeholder },
  data() {
    return {
      tabBar: null,
      tabBarAdapter: null,
      isBack: false,
      componentKey: 0,
      currentIndex: 0,
      query: '',
      prevUserQuery: '', //Store previously query avoid query again
      prevPostQuery: '',
      isTyping: false, //Is user typing
      userListLoading: false,
      userList: [],
      postListLoading: false,
      postList: [],
      friends: [],
      items: [this.$t('search.user'), this.$t('search.post')],
    };
  },
  computed: {
    active() {
      return this.$store.state.search.active;
    },
  },
  watch: {
    currentIndex(newVal, oldVal) {
      if (newVal < oldVal) {
        this.isBack = true;
      } else {
        this.isBack = false;
      }
    },

    query(val) {
      this.isTyping = true;
      this.query = val;
      this.onSearch();
    },

    active(val) {
      if (!val) {
        this.tabBar = null;
      }

      if (val) {
        this.onDialogOpen();
      }
    },
  },
  methods: {
    close() {
      this.$store.dispatch('search/close');
    },

    clipHTML(html) {
      return clip(html, 50, {
        html: true,
        maxLines: 2,
      });
    },

    //Open w/ tabbar index
    async onDialogOpen() {
      await this.$nextTick;

      //Focus on search input
      setTimeout(() => {
        this.$refs.input.$el.querySelector('input').focus();
      }, 100);

      this.tabBar = new MDCTabBar(this.$refs.tabBar);

      //See https://material.io/develop/web/supporting/tab-bar
      this.tabBarAdapter = this.tabBar.foundation.adapter;

      console.log(this.tabBar);

      //Listen on tab bar change
      this.tabBar.listen('MDCTabBar:activated', this.onTabBarChange);
    },

    onTabBarChange(e) {
      this.currentIndex = e.detail.index;
      this.onSearch();
    },

    //Handel searching
    onSearch: debounce(function () {
      this.isTyping = false;
      this.search();
    }, 500),

    async search() {
      //For user
      if (this.currentIndex === 0) {
        //Avoid query again
        if (this.query !== this.prevUserQuery && this.query) {
          this.userListLoading = true;
          this.userList = [];

          console.log(this.query);

          const res = await this.$axios.get(
            `/utils/users/search?q=${this.query}`
          );

          this.prevUserQuery = this.query;

          //Give some delay to the user let them see the placeholder
          setTimeout(() => {
            this.userListLoading = false;
            this.userList = res.data;
            this.forceUpdate();
          }, 250);

          console.log(res);
        }
      }

      if (!this.query && this.currentIndex === 0) {
        this.userList = [];
        this.prevUserQuery = '';
      }

      if (this.currentIndex === 1) {
        //Avoid query again
        if (this.query !== this.prevPostQuery && this.query) {
          this.postListLoading = true;
          this.postList = [];

          // console.log(this.query);

          const res = await this.$axios.get(`/posts/search?q=${this.query}`);

          this.prevPostQuery = this.query;

          //Give some delay to the user let them see the placeholder
          setTimeout(() => {
            this.postListLoading = false;
            this.postList = res.data;
            this.forceUpdate();
          }, 250);

          // console.log(res.data);
        }
      }
      if (!this.query && this.currentIndex === 1) {
        this.postList = [];
        this.prevPostQuery = '';
      }
    },

    forceUpdate() {
      this.componentKey += 1;
    },

    name(user) {
      if (user) {
        return user.personalInfo.name ?? user.username ?? '';
      }
      return '';
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
    min-height: 230px;
    @apply px-4;
    max-height: 600px;
    margin-bottom: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}

::v-deep .vs-input {
  @apply py-1;
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
