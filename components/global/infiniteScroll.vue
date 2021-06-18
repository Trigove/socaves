<template>
  <div>
    <client-only>
      <div v-if="isLoading" :class="loadingClass">
        <loading-spinner></loading-spinner>
      </div>

      <!--Lazy loading-->
      <div ref="lazyLoading"></div>
    </client-only>
  </div>
</template>

<script>
export default {
  props: {
    isLoading: {
      type: Boolean,
      default: false,
    },
    loadingClass: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      observer: null,
      observerOptions: {
        root: null,
        rootMargin: '0px 0px 0px 0px',
        threshold: 0.01,
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.observer = new IntersectionObserver(
        this.observerCallback,
        this.observerOptions
      );

      if (this.$refs.lazyLoading) {
        this.observer.observe(this.$refs.lazyLoading);
      }
    });
  },
  beforeDestroy() {
    this.observer?.disconnect();
  },
  methods: {
    observerCallback(entries, _observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.$emit('isIntersecting');
          console.log('isIntersecting');
        }
      });
    },
  },
};
</script>
