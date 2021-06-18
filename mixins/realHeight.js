//As a fix of 100vh problem https://stackoverflow.com/questions/37112218/css3-100vh-not-constant-in-mobile-browser
export default {
  mounted() {
    window.addEventListener('resize', this.onResize);
    this.setRealHeight();
  },
  beforeDestroy() {
    // Unregister the event listener before destroying this Vue instance
    window.removeEventListener('resize', this.onResize);
  },
  methods: {
    onResize() {
      this.setRealHeight();
    },
    setRealHeight() {
      document.documentElement.style.setProperty(
        '--real-height',
        `${window.innerHeight}px`
      );

      //   if (window.matchMedia('(display-mode: standalone)').matches) {
      //     //If address bar is hidden use 100vh is ok in pwa
      //     //As a fix of https://bugs.webkit.org/show_bug.cgi?id=170595
      //     document.documentElement.style.setProperty('--real-height', '100vh');
      //   } else {
      //     document.documentElement.style.setProperty(
      //       '--real-height',
      //       `${window.innerHeight}px`
      //     );
      //   }
      // },
    },
  },
};
