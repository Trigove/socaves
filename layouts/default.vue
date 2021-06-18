<template>
  <div class="bg-bg">
    <!--Search dialog-->
    <search-dialog></search-dialog>
    <!--Side bar and navigation bar above md-->
    <nav-bar ref="navbar" class="nav-padding" />
    <main class="flex min-h-screen-real-nav main-padding">
      <Nuxt />
    </main>
    <!--Tab bar for mobile below md-->
    <tab-bar />
  </div>
</template>

<script>
import mRealHeight from '@/mixins/realHeight';
import navBar from '@/components/default/navBar';
import tabBar from '@/components/default/tabBar';
import searchDialog from '@/components/searchDialog';

export default {
  name: 'Default',
  components: { navBar, tabBar, searchDialog },
  mixins: [mRealHeight],
  scrollToTop: false,
  mounted() {
    const perfEntries = performance.getEntriesByType('navigation');
    if (perfEntries[0].type === 'reload') {
      const sheet = document.styleSheets[0];
      sheet.insertRule('* { pointer-events: none; }', sheet.cssRules.length);
      // console.info('TYPE_RELOAD');
    }
    const last = document.styleSheets[0].cssRules.length - 1;
    document.styleSheets[0].cssRules[last].style.removeProperty(
      'pointer-events'
    );
  },
  head() {
    return {
      script: [
        //IntersectionObserver polyfill
        {
          hid: 'polyfill',
          src: 'https://polyfill.io/v3/polyfill.min.js?features=ResizeObserver%2CIntersectionObserver%2CIntersectionObserverEntry%2CMutationObserver',
          defer: true,
        },
      ],
    };
  },
};
</script>

<style lang="scss" scoped>
.nav-padding {
  padding-bottom: $navbar-height;
}

@media (min-width: theme('screens.md')) {
  .main-padding {
    padding-left: calc(
      #{$sidebar-width} + env(safe-area-inset-left, 0)
    ) !important;
  }
}

@media (max-width: theme('screens.md')) {
  .main-padding {
    padding-bottom: calc(
      #{$tab-bar-height} + env(safe-area-inset-bottom, 0)
    ) !important;
  }
}
</style>
