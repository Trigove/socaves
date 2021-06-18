<template>
  <div>
    <!--More-->
    <vs-tooltip v-model="active" class="ml-auto" right shadow not-hover>
      <!--More Button slot-->
      <slot :open="open"></slot>

      <template #tooltip>
        <div class="px-2">
          <vs-button
            v-if="$auth.loggedIn"
            class="text-sm font-medium btn-p-0 mb-3 text-black"
            data-test="repostBtn"
            transparent
            @click="repost"
          >
            <div class="mr-2">
              <iconify-icon icon="retweet" style="font-size: 0.98rem" />
            </div>
            {{ $t('post.repost') }}
          </vs-button>

          <vs-button
            class="text-sm font-medium btn-p-0 text-black"
            transparent
            @click="share"
          >
            <div class="mr-2">
              <iconify-icon icon="shareAlt" class="text-xl" />
            </div>
            {{ $t('post.more') }}
          </vs-button>
        </div>
      </template>
    </vs-tooltip>
  </div>
</template>

<script>
/**
 * All events
 * @event onRepost fire when share repost is being clicked return repost id
 */
export default {
  name: 'Share',
  props: {
    parentId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      active: false,
      activeDialog: false,
      url: '',
    };
  },
  mounted() {
    this.url = `${window.location.protocol}//${window.location.host}/post/${this.parentId}`;
  },
  methods: {
    repost() {
      this.active = false;
      this.$emit('onRepost');
    },

    async share() {
      this.active = false;

      try {
        if (navigator.share) {
          await navigator.share({
            title: `Check out this post in SOCAVES`,
            url: this.url,
          });
          return;
        }

        this.copyLink();
      } catch (err) {
        console.log(err);
      }
    },

    link() {
      this.active = false;
      this.activeDialog = true;
    },

    copyLink() {
      if (this.$refs.urlInput) {
        const el = this.$refs.urlInput.$el.querySelector('input');
        el.select();
        el.setSelectionRange(0, 99999); //For mobile devices
        document.execCommand('copy');
        this.active = false;
      }
    },

    open() {
      this.active = true;
    },
  },
};
</script>
