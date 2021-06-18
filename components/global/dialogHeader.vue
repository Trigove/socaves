<template>
  <div class="relative flex w-full justify-center" style="height: 20px">
    <vs-button
      v-if="!hideClose"
      data-test="commentCloseBtn"
      class="text-gray-800 absolute left-0"
      :color="$color.gray[800]"
      circle
      icon
      transparent
      style="top: 30%; transform: translateY(-50%); margin-left: -10px"
      :disabled="notClose"
      @click="onClick"
    >
      <iconify-icon class="text-2xl" icon="close" />
    </vs-button>

    <h3 class="not-margin font-bold capitalize">
      <slot></slot>
    </h3>

    <!--Right slot-->
    <div class="absolute right-0" style="margin-top: -0.55rem">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<!--usage-->
<!-- <dialog-header @click="active = false">{{
        $t('post.edit_img')
      }}</dialog-header> -->

<script>
/**
 * Helper componet for simplify of the dialog header
 * @property {boolean} hideClose  Hide the close button?
 * @event onClose fire when close button being clicked
 */

export default {
  props: {
    hideClose: {
      type: Boolean,
      default: false,
    },
    notClose: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClick() {
      this.$emit('onClose');
    },
  },
};
</script>
