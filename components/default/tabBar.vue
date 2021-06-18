<template>
  <nav
    class="
      md:hidden
      grid grid-cols-10
      tab-bar
      bg-white
      border-t border-gray-200
      w-full
      fixed
      bottom-0
      z-50
    "
  >
    <nuxt-link
      :class="[{ active: $router.currentRoute.path === '/' }, linkStyles.class]"
      :style="linkStyles.style"
      to="/"
      :title="$t('home')"
      @click.native="scrollToTop($router.currentRoute.path === '/')"
    >
      <iconify-icon icon="home" class="text-2xl" />
    </nuxt-link>

    <div
      role="button"
      :title="$t('search.title')"
      v-bind="linkStyles"
      @click="search"
    >
      <iconify-icon icon="search" style="font-size: 25px" />
    </div>

    <div
      role="button"
      :title="$t('post.new')"
      v-bind="linkStyles"
      @click="newPost"
    >
      <iconify-icon icon="newPost" class="text-2xl" />
    </div>

    <nuxt-link
      :class="[
        { active: $router.currentRoute.path === '/coming-soon' },
        linkStyles.class,
      ]"
      :style="linkStyles.style"
      to="/coming-soon"
      :title="$t('chat_title')"
    >
      <iconify-icon icon="chat" class="text-2xl" />
    </nuxt-link>

    <div class="col-span-2 flex items-center justify-center">
      <avatar :user="$auth.user" class="text-xs" circle size="28"> </avatar>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      linkStyles: {
        style: 'color: rgb(120 131 143)',
        class:
          'col-span-2 flex items-center justify-center transition-colors duration-300',
      },
    };
  },
  mounted() {},
  methods: {
    search() {
      this.$store.dispatch('search/open');
    },

    scrollToTop(canScroll) {
      if (canScroll && window) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    newPost() {
      if (this.$auth.loggedIn) {
        if (this.$router.currentRoute.path !== '/') {
          this.$router.push('/');
        }

        this.$store.dispatch('postCreator/open');
        return;
      }

      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss" scoped>
.tab-bar {
  height: calc(
    #{$tab-bar-height} + env(safe-area-inset-bottom, 0)
  ); //A fix for iphone
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.active {
  color: var(--color-orange-500) !important;
}
</style>
