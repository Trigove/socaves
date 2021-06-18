<template>
  <vs-dialog v-model="active" overflow-hidden not-close :style="cssVars">
    <template #header>
      <dialog-header @onClose="active = false">
        {{ $t('post.comment_title') }}
      </dialog-header>
    </template>

    <!--Comment list-->
    <slot> </slot>

    <div v-if="isLoading" class="w-full px-2" data-test="commentList">
      <placeholder v-for="(item, i) in 8" :key="i" />
    </div>

    <template #footer>
      <div ref="footer" class="p-2 z-10 bg-white">
        <comment-creator
          v-if="$auth.loggedIn"
          ref="commentCreator"
          :tippy-zindex="99001"
          @onComment="onComment"
        ></comment-creator>
      </div>
    </template>
  </vs-dialog>
</template>

<script>
import commentCreator from '@/components/commentCreator/index';
import placeholder from './commentPlaceholder';

export default {
  name: 'CommentDialog',
  components: {
    placeholder,
    commentCreator,
  },
  props: {
    parentId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      active: false,
      isLoading: false,
      placeholder: false,
      footerHeight: 0,
      resizeObserver: null,
      componentKey: 0,
    };
  },

  computed: {
    cssVars() {
      return {
        '--footer-height': this.footerHeight,
      };
    },
  },

  watch: {
    active(val) {
      this.$nextTick(() => {
        if (val) {
          this.resizeObserver = new ResizeObserver(
            this.updateDialogHeight
          ).observe(this.$refs.footer);
        }

        if (!val) {
          this.resizeObserver?.disconnect();
        }
      });
    },
  },
  beforeDestroy() {
    this.resizeObserver?.disconnect();
  },
  methods: {
    open() {
      this.active = true;
    },

    close() {
      this.active = false;
    },

    //Rerender the comments array
    forceRerender() {
      this.componentKey += 1;
    },

    updateDialogHeight() {
      if (this.$refs.footer) {
        this.footerHeight = `${this.$refs.footer.clientHeight}px`;
      }
    },

    onComment({ getHTML, getFiles }) {
      this.$parent.postComment(getHTML(), getFiles());
      this.$refs.commentCreator.reset();
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .vs-dialog {
  width: 500px;
  overflow: hidden;

  &__content {
    max-height: 600px;
    height: calc(var(--real-height) - var(--footer-height) - 80px);
    display: flex;
    flex-direction: column;
    margin-bottom: 0 !important;
    padding: 0 !important;
  }
}

/* Fullscreen for mobile */
@media (max-width: theme('screens.md')) {
  ::v-deep .vs-dialog__content {
    height: calc(
      var(--real-height) - var(--footer-height, 0) - 40px -
        env(safe-area-inset-bottom, 0)
    ) !important;
  }

  @include fullscreen-vs-dialog();
}
</style>
