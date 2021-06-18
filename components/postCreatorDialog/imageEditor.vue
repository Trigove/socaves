<template>
  <vs-dialog v-model="active" prevent-close not-padding not-close>
    <template #header>
      <dialog-header :not-close="isSaving" @onClose="active = false">
        {{ $t('post.edit_img') }}
        <template #right>
          <vs-button
            class="h-10 icon m-0 font-medium rounded-full"
            :disabled="isSaving"
            transparent
            active
            @click="getResult"
          >
            {{ $t('post.save') }}
          </vs-button>
        </template>
      </dialog-header>
    </template>

    <!--wrapper-->
    <div class="relative pt-1">
      <!--Center toolbar-->
      <div class="absolute z-10 mt-2 abs-top-center">
        <!--Flip image button-->
        <button
          class="toolBarButton text-white"
          title="flip"
          @click="flip(true, false)"
        >
          <iconify-icon icon="flipHorizontal" class="opacity-75" />
        </button>

        <!--Flip image button-->
        <button class="toolBarButton text-white" @click="rotate(90)">
          <iconify-icon icon="rotate90" class="opacity-75" />
        </button>
      </div>

      <!--For laoding-->
      <loading-spinner
        v-if="isLoading"
        class="absolute block z-10"
        style="top: 50%; left: 50%; transform: translate(-50%, -50%)"
      ></loading-spinner>

      <!--Cropping viewport-->
      <cropper
        ref="cropper"
        class="cropper overflow-hidden"
        :src="editImage.src"
        :stencil-props="{
          handlers: {
            eastNorth: true,
            north: false,
            westNorth: true,
            west: false,
            westSouth: true,
            south: false,
            eastSouth: true,
            east: false,
          },
          maxAspectRatio: aspect.wide,
          ...stencilProps,
        }"
        :min-width="300"
        :min-height="300"
        :auto-zoom="true"
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

    <!-- <template #footer>
      <div class="flex">
        Orginal
        <vs-button :active="false" icon transparent flat>
          <iconify-icon icon="crop16To9" class="text-xl" />
        </vs-button>

        Wide
        <vs-button icon transparent flat>
          <iconify-icon icon="crop75" class="text-xl" />
        </vs-button>

        Square
        <vs-button icon transparent flat>
          <iconify-icon icon="cropSquare" class="text-xl" />
        </vs-button>
      </div>
    </template> -->
  </vs-dialog>
</template>

<script>
//Cropper doc: https://norserium.github.io/vue-advanced-cropper/introduction/getting-started.html#minimal-working-example
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import 'vue-advanced-cropper/dist/theme.bubble.css';

export default {
  components: {
    Cropper,
  },

  props: {
    stencilProps: {
      type: Object,
      default: () => {},
    },
  },

  data() {
    return {
      active: false,
      isLoading: true,
      isSaving: false,
      editImage: {
        id: 0, //ID of the file
        src: '', //Store current editing img url
        type: 'image/jpeg', //Store the current editing image type
        name: '',
      },
      aspect: {
        wide: 16 / 9,
        square: 1,
      },
    };
  },
  watch: {
    isSaving(val) {
      if (val) {
        document.body.style.cursor = 'wait';
      } else {
        document.body.style.cursor = 'default';
      }
    },
  },
  methods: {
    //Open dialog and set the edit image blob
    /**
     * Open the image editor dialog
     * @param {object} fileItem File item that in the file uploader which consist a file objcect and id
     */
    open({ id, file }) {
      this.active = true; //Open the dialog
      this.editImage.id = id;
      this.editImage.src = file.src ?? URL.createObjectURL(file);
      this.editImage.type = file.type;
      this.editImage.name = file.fileName ?? file.name;
      console.log(this.editImage.type);
    },

    change(_e) {},

    //Flip the image in vertical
    flip(x, y) {
      if (this.$refs.cropper.customImageTransforms.rotate % 180 !== 0) {
        this.$refs.cropper.flip(!x, !y);
      } else {
        this.$refs.cropper.flip(x, y);
      }
    },

    //Rotate image
    rotate(angle) {
      this.$refs.cropper.rotate(angle);
    },

    //Async canvas to blob
    getCanvasBlob(canvas) {
      return new Promise((resolve, reject) => {
        try {
          canvas.toBlob(resolve);
        } catch (err) {
          reject(err);
        }
      });
    },

    async getResult() {
      this.isSaving = true;
      console.log(this.$refs.cropper.getResult());
      const { canvas } = this.$refs.cropper.getResult();
      const blob = await this.getCanvasBlob(canvas);
      const file = await new File([blob], this.editImage.name, {
        type: this.editImage.type,
      });

      const object = {
        id: this.editImage.id,
        file, //Store the file:blob
      };

      /**
       * Fire when editor edit complete
       *
       * @event onConfirm
       * @type {object}
       * @property {boolean} id - File id (Same as filePicker's file id)
       * @property {file} file Edited image id
       */
      this.$emit('onConfirm', object);
      this.isSaving = false;
      this.active = false; //Close current dialog
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
  height: calc(100vh - 204px);
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

::v-deep .vs-dialog {
  width: initial !important;

  &__content {
    max-height: none !important;
  }
}

/* Fullscreen for mobile */
@media (max-width: theme('screens.md')) {
  @include fullscreen-vs-dialog(0);

  .cropper {
    max-width: 100%;
    width: 100vw !important;
    max-height: none !important;
    // height: calc(var(--real-height) - 65px) !important;
    height: calc(
      var(--real-height) - env(safe-area-inset-bottom, 0)
    ) !important;
  }
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
</style>
