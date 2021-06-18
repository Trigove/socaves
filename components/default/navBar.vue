<template>
  <div>
    <vs-navbar ref="navbar" v-model="active" square fixed not-line>
      <!--Icon-->
      <template #left>
        <div class="flex items-center">
          <!--Open and close menu button for mobile-->

          <vs-button
            class="text-lg md:hidden flex"
            icon
            style="min-width: 35px"
            transparent
            aria-label="menu"
            @click.native="activeSidebar = !activeSidebar"
          >
            <iconify-icon icon="menu" />
          </vs-button>

          <!--icon-->
          <nuxt-link
            to="/"
            class="-mb-1"
            @click.native="scrollToTop($router.currentRoute.path === '/')"
          >
            <img
              :alt="$t('title')"
              width="40"
              height="40"
              class="sm:w-10 w-8 my-auto"
              src="~/assets/img/icon.png"
            />
          </nuxt-link>

          <div
            role="button"
            class="click-dark-brightness ml-4 md:block hidden"
            @click="search"
          >
            <vs-input
              disabled
              data-test="postbar"
              class="
                w-60
                pointer-events-none
                opacity-100
                search-bar
                text-gray-500
              "
              :placeholder="$t('search_bar')"
            >
              <template #icon>
                <iconify-icon icon="search" class="text-md" />
              </template>
            </vs-input>
          </div>
        </div>
      </template>

      <!--login signup button-->
      <template #right>
        <!-- Notification btn -->
        <!-- <div class="cursor-pointer" @click="display = !display">
          <iconify-icon
            icon="bell"
            class="text-gray-400 hover:text-orange-500 text-3xl ml-auto"
          />
        </div> -->

        <vs-button
          v-if="!$auth.loggedIn"
          data-test="login-btn"
          to="/login"
          transparent
          flat
        >
          {{ $t('login_signup') }}
        </vs-button>
        <!--Logged in-->
        <vs-button
          v-else
          data-test="logout-btn"
          transparent
          flat
          @click="logout"
        >
          {{ $t('logout') }}
        </vs-button>
      </template>
    </vs-navbar>

    <!--Sidebar for web-->
    <vs-sidebar
      v-model="active"
      color="primary"
      open
      square
      not-shadow
      reduce
      class="md:flex hidden sidebar"
    >
      <vs-sidebar-item
        v-for="(item, i) in items"
        :id="item.id"
        :key="i"
        :data-tippy-content="item.name"
        :aria-label="item.name"
        :to="item.path"
        @click.native="scrollToTop($router.currentRoute.path === item.path)"
      >
        <template #icon>
          <iconify-icon :icon="item.icon" />
        </template>
      </vs-sidebar-item>
    </vs-sidebar>

    <!--Side bar for mobile-->
    <vs-sidebar
      v-model="active"
      color="primary"
      :open.sync="activeSidebar"
      square
      not-shadow
      class="md:hidden flex"
    >
      <vs-sidebar-item
        v-for="(item, i) in items"
        :id="item.id"
        :key="i"
        :disbaled="item.authOnly ? $auth.user : true"
        :to="item.path"
        @click.native="activeSidebar = false"
      >
        <template #icon>
          <iconify-icon :icon="item.icon" />
        </template>
        {{ item.name }}
      </vs-sidebar-item>
    </vs-sidebar>

    <!--Overlay for sidebar when open-->
    <div
      v-if="activeSidebar"
      class="overlay"
      @click="activeSidebar = false"
    ></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      display: false,
      activeSidebar: false,
      active: null,
      items: [
        {
          name: this.$t('home'),
          id: 'home',
          path: '/',
          icon: 'home',
          authOnly: false,
        },
        {
          name: this.$t('chat_title'),
          id: 'chat',
          path: '/chat',
          icon: 'chat',
          authOnly: true,
        },
        {
          name: this.$t('profile'),
          id: 'profile',
          path: '/profile',
          icon: 'user',
          authOnly: true,
        },
        {
          name: this.$t('settings'),
          id: 'settings',
          path: '/settings',
          icon: 'settings',
          authOnly: false,
        },
      ],
      prevScrollpos: 0,
      mql: null,
    };
  },
  watch: {
    '$route.currentRoute': {
      handler() {
        //Fix for modal
        if (typeof window !== 'undefined') {
          if (document.body.style.overflow === 'hidden') {
            document.body.style.overflow = null;
          }
        }

        const currentPath = this.$route.path;
        if (currentPath === '/' || currentPath.includes('/post')) {
          this.active = 'home';
        }

        if (currentPath.includes('profile')) {
          this.active = 'profile';
        }

        if (currentPath.includes('/chat')) {
          this.active = 'chat';
        }

        if (currentPath.includes('/settings')) {
          this.active = 'settings';
        }
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    this.$tippy('[data-tippy-content]', {
      placement: 'left',
      arrow: false,
      touch: 'hold',
    });

    // this.prevScrollpos = window.pageYOffset;

    // this.mql = window.matchMedia('(max-width: 768px)');
    // this.mql.addEventListener('change', this.hideScroll);
    // window.addEventListener('scroll', this.hideScroll);
  },
  destroyed() {
    // window.removeEventListener('scroll', this.hideScroll);
    // this.mql.removeEventListener('change', this.hideScroll);
  },
  methods: {
    search() {
      this.$store.dispatch('search/open');
    },

    async logout() {
      await this.$auth.logout();
      console.log('Logout');
      this.$router.go('blank');
    },

    scrollToTop(canScroll) {
      if (canScroll) {
        this.$scrollIntoView(document.body.firstElementChild, {
          align: { top: 0 },
        });
      }
    },

    //Hide nav when scroll
    hideScroll() {
      if (this.mql.matches) {
        const currentScrollPos = window.pageYOffset;
        if (this.prevScrollpos > currentScrollPos || window.scrollY <= 0) {
          this.$refs.navbar.$el.style.top = '0';
        } else {
          this.$refs.navbar.$el.style.top = '-60px';
        }
        this.prevScrollpos = currentScrollPos;
      } else {
        this.$refs.navbar.$el.style.top = '0';
      }
    },
    displayComponent() {
      this.display = true;
    },
    hideComponent() {
      this.display = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.search-bar ::v-deep .vs-input__label {
  opacity: 1;
}

//Overlay for side bar
.overlay {
  height: 100%;
  width: 100%;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
  overflow-x: hidden;
}

.sidebar {
  width: calc(#{$sidebar-width} + env(safe-area-inset-left, 0)) !important;
  padding-left: env(safe-area-inset-left) !important;
}

::v-deep .vs-sidebar__item {
  @apply font-medium;
  &.active {
    @apply font-semibold;
  }
}

::v-deep .vs-button--transparent:hover::before {
  opacity: 0 !important;
}

::v-deep .vs-navbar__item {
  @apply font-medium;
}

::v-deep .vs-sidebar-content {
  min-width: $sidebar-width;
  padding-top: calc(#{$navbar-height} + 2rem);
  z-index: 998 !important;
  //display: none;
}

::v-deep .vs-navbar__line {
  background-color: var(--color-orange-500);
}

::v-deep .vs-navbar-content {
  z-index: 999 !important;
}

::v-deep .vs-navbar {
  height: $navbar-height;
}

::v-deep
  .vs-sidebar-content.reduce
  .vs-sidebar__item.hasIcon
  .vs-sidebar__item__text {
  margin-left: -$sidebar-width;
}

::v-deep .vs-sidebar__item__text-tooltip {
  left: calc(#{$sidebar-width} + 10px) !important;
}

::v-deep .vs-sidebar__item__icon {
  min-width: $sidebar-width;
}

::v-deep .vs-navbar__center {
  visibility: hidden;
  width: 0;
}

::v-deep .vs-navbar__line {
  visibility: hidden;
}

::v-deep .vs-sidebar__item.hasIcon.active {
  padding-left: 0px !important;
}

::v-deep .vs-navbar {
  @apply px-0;
}

@media (min-width: theme('screens.md')) {
  ::v-deep .vs-navbar__center {
    visibility: visible !important;
  }

  ::v-deep .vs-navbar__line {
    visibility: visible !important;
  }

  ::v-deep .vs-navbar {
    padding-left: calc(env(safe-area-inset-left, 0) + 15px) !important;
  }

  // ::v-deep .vs-sidebar-content {
  //   display: flex !important;
  // }
}
</style>
