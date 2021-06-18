<script>
/**
 * All events
 * @event onRefresh fire when onRefresh is trigger
 */

import PullToRefresh from 'pulltorefreshjs';
export default {
  mounted() {
    PullToRefresh.init({
      mainElement: 'main',
      instructionsPullToRefresh: this.$t('pull_to_refresh'),
      instructionsReleaseToRefresh: this.$t('release_to_refresh'),
      instructionsRefreshing: this.$t('refreshing'),
      shouldPullToRefresh: () =>
        //Prevent accdenitally trigger when some overlay is opened
        // this.$router.currentRoute.path === '/' &&
        document.querySelectorAll('.fancybox-is-open').length < 1 &&
        document.querySelectorAll('.vs-dialog').length < 1 &&
        !window.scrollY,
      onRefresh: () => {
        this.$emit('onRefresh');
      },
    });
  },
  beforeDestroy() {
    PullToRefresh.destroyAll();
  },
  render() {
    return this.$slots.default;
  },
};
</script>
