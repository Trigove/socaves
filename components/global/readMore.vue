<!--eslint-disable vue/no-v-html-->
<template>
  <div>
    <article
      ref="content"
      class="relative overflow-hidden break-words"
      :class="{
        clipper: !isSeeingMore && isContentOverflow,
        overflowShadow: !noShadow && !isSeeingMore && isContentOverflow,
      }"
      @click="isTouchDevice && isContentOverflow ? seeLessMore() : () => {}"
      v-html="displayContent"
    ></article>

    <!--Button for overflow content only-->
    <div
      v-if="isContentOverflow"
      role="button"
      tabindex="0"
      class="font-semibold mt-2 outline-none"
      @click="seeLessMore"
      v-text="isSeeingMore ? $t('post.show_less') : $t('post.see_more')"
    />
  </div>
</template>

<script>
import clip from 'text-clipper';

//A component that supress the height of the content
export default {
  props: {
    content: {
      type: String,
      default: '',
    },
    //Have shadow effect or not
    noShadow: {
      type: Boolean,
      default: false,
    },
    //Prvent xss and auto linking
    formatHtml: {
      type: Boolean,
      default: true,
    },
    //Is the content html or not
    isHtml: {
      type: Boolean,
      default: true,
    },
    maxCharacters: {
      type: Number,
      default: 500,
    },
    maxLines: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      isSeeingMore: false,
      isContentOverflow: false,
      unclippedContent: '',
      clippedContent: '',
      displayContent: '',
    };
  },
  computed: {
    isTouchDevice() {
      if (window && navigator) {
        return (
          'ontouchstart' in window ||
          navigator.maxTouchPoints > 0 ||
          navigator.msMaxTouchPoints > 0
        );
      }
      return false;
    },
  },
  created() {
    if (this.isHtml && this.formatHtml) {
      this.unclippedContent = this.$Autolinker(this.content);
    } else {
      this.unclippedContent = this.content;
    }

    this.clippedContent = clip(this.unclippedContent, this.maxCharacters, {
      html: this.isHtml,
      maxLines: this.maxLines,
    });

    //Overflow occur hide it at first
    if (this.clippedContent.length !== this.unclippedContent.length) {
      this.isContentOverflow = true;
      this.isSeeingMore = false;
    } else {
      this.isSeeingMore = true;
    }

    this.update();
  },
  methods: {
    seeLessMore() {
      this.isSeeingMore = !this.isSeeingMore;
      this.update();
    },
    update() {
      if (this.isSeeingMore) {
        this.displayContent = this.unclippedContent;
      } else {
        this.displayContent = this.clippedContent;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
article {
  &.clipper {
    &.overflowShadow {
      &:before {
        content: '';
        width: 100%;
        height: 25px;
        bottom: 0;
        z-index: 1;
        position: absolute;
        background: linear-gradient(
          rgba(255, 255, 255, 0),
          rgba(255, 255, 255, 0.5),
          white
        );
      }
    }
  }
}
</style>
