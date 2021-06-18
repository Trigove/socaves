<script>
import Plyr from 'plyr';
export default {
  name: 'Plyr',
  props: {
    /** Options object for plyr config. **/
    options: {
      type: Object,
      required: false,
      default: () => {},
    },
    //For swiper or not
    forSwiper: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      player: {},
    };
  },
  computed: {
    // opts() {
    //   const options = this.options;
    //   if (
    //     !Object.prototype.hasOwnProperty.call(
    //       this.options,
    //       'hideYouTubeDOMError'
    //     )
    //   ) {
    //     options.fullscreen.iosNative = true;
    //     options.hideYouTubeDOMError = true;
    //   }
    //   return options;
    // },
  },
  mounted() {
    this.player = new Plyr(this.$el, {
      ratio: '16:9',
      fullscreen: {
        enabled: 'force',
        iosNative: true,
      },
      ...this.options,
    });

    //See here https://github.com/sampotts/plyr#events

    this.$nextTick(() => {
      this.$el.addEventListener('ready', (e) => {
        const player = e.detail.plyr;

        if (this.forSwiper) {
          //No swiping for control part
          player.elements.controls.classList.add('swiper-no-swiping');
        }

        this.$emit('ready', e);

        player.on('canplay', (e) => {
          this.$emit('canPlay', e);
        });

        // player.on('seeking', (e) => {
        //   this.$emit('seeking', e);
        // });

        // player.on('seeked', (e) => {
        //   this.$emit('seeked', e);
        // });

        player.on('exitfullscreen', (e) => {
          this.$emit('exitFullscreen', e);
        });
      });
    });
  },
  beforeUnmount() {
    try {
      this.player.destroy();
    } catch (e) {
      if (
        !(
          this.opts.hideYouTubeDOMError &&
          e.message === 'The YouTube player is not attached to the DOM.'
        )
      ) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  },
  render() {
    const slots = this.$slots.default;
    return typeof slots === 'function' ? slots()[0] : slots;
  },
};
</script>
