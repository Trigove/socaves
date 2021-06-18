<template>
  <vs-dialog
    v-model="active"
    prevent-close
    not-padding
    overflow-hidden
    not-close
  >
    <template #header>
      <dialog-header @onClose="active = false">
        {{ $t('post.annotation') }}
        <template #right>
          <vs-button
            class="h-10 icon m-0 font-medium rounded-full"
            transparent
            active
            @click="post"
          >
            {{ $t('post.post') }}
          </vs-button>
        </template>
      </dialog-header>
    </template>

    <!--wrapper-->
    <div class="relative pt-1">
      <!--Cropping viewport-->
      <cropper
        ref="cropper"
        class="cropper overflow-hidden"
        :src="src"
        :auto-zoom="true"
        :min-width="50"
        :min-height="50"
        :stencil-props="{
          handlers: {
            eastNorth: true,
            westNorth: true,
            westSouth: true,
            eastSouth: true,
          },
        }"
        image-restriction="stencil"
        background-class="cropper-background"
        @change="change"
        @ready="cropperReady"
      />

      <!--For laoding-->
      <loading-spinner
        v-if="isLoading"
        class="absolute block z-10"
        style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
      ></loading-spinner>
    </div>

    <comment-creator
      ref="commentCreator"
      :tippy-zindex="99001"
      class="my-1 mx-2"
      no-send
      no-media
    ></comment-creator>
  </vs-dialog>
</template>

<script>
/**
 * All events
 * @event onPost fire when post button being clicked return itself
 */
//Cropper doc: https://norserium.github.io/vue-advanced-cropper/introduction/getting-started.html#minimal-working-example
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.bubble.css';
import commentCreator from '@/components/commentCreator/index';
import signUrl from '@/mixins/signUrl';

export default {
  name: 'Annotaion',
  components: {
    Cropper,
    commentCreator,
  },
  mixins: [signUrl],
  data() {
    return {
      active: false,
      isLoading: true,
      parentID: '',
      fileName: '',
      src: '',
      type: 'image/jpeg',
    };
  },
  computed: {
    cropper() {
      if (this.$refs.cropper) return this.$refs.cropper;
      return null;
    },
  },
  mounted() {
    // this.$nextTick(() => {
    //   if (this.cropper) {
    //     [...this.cropper.$el.querySelectorAll('.vue-preview__image')].map(
    //       (el) => {
    //         el.crossOrigin = 'Anonymous';
    //       }
    //     );
    //   }
    // });
  },
  methods: {
    //Open dialog and set the edit image blob
    /**
     * Open the annotaion dialog
     */
    open({ parentID, fileName, src, privacy, type }) {
      console.log(parentID, fileName, src, privacy, type);
      this.parentID = parentID; //Post id
      this.fileName = fileName;
      console.log('anno', `https://ik.imagekit.io/socaves/${this.fileName}`);
      this.src = this.withQuery(src, privacy, '/tr:w-800');
      this.type = type;
      console.log(this.type, privacy);
      this.active = true; //Open the dialog
    },

    post() {
      this.$emit('onPost', this);
    },

    getHTML() {
      return this.$refs.commentCreator.getHTML();
    },

    //Return media w/ annotaion object
    getAnnotaion() {
      const { coordinates, image } = this.$refs.cropper.getResult();
      return [
        {
          fileName: this.fileName,
          type: this.type,
          annotation: {
            coordinates,
            image: {
              height: image.height,
              width: image.width,
            },
          },
        },
      ];
    },

    close() {
      this.active = false;
    },

    change(_e) {},

    getResult() {
      console.log(this.$refs.cropper.getResult());
    },

    //Invoked on success of an image loading
    cropperReady() {
      this.isLoading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .vs-dialog__header,
::v-deep .vs-dialog__footer {
  padding: 10px 16px;
}

::v-deep .cropper {
  max-height: 500px;
  width: 600px;
  // height: calc(100vh - 100px);
  height: calc(100vh - 200px);
}

::v-deep .toolBarButton {
  border-radius: 15px;
  padding: 0.3em 0.75em;
  outline: 0;
  transition: background-color 0.1s ease-out, color 0.1s ease-out,
    box-shadow 0.1s ease-out;

  &:focus {
    outline: 0;
  }

  &:hover {
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
  }
}

//Helper for absolute position with top center
.abs-top-center {
  left: 50%;
  transform: translate(-50%, 0);
}

::v-deep .comment-container {
  background: transparent !important;
}

/* Fullscreen for mobile */
@media (max-width: theme('screens.md')) {
  @include fullscreen-vs-dialog();

  .cropper {
    max-width: 100%;
    width: 100vw !important;
    max-height: none !important;
    // height: calc(var(--real-height) - 65px) !important;
    height: calc(
      var(--real-height) - env(safe-area-inset-bottom, 0) - 90px
    ) !important;
  }
}
</style>
