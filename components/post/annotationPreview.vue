<template>
  <div>
    <!--For preview image annotation-->
    <!--Loading placeholder-->
    <div v-if="!isAnnotationReady" class="aspect-w-16 aspect-h-9 mt-3 w-full">
      <div
        style="height: 235px"
        class="
          skeleton-loading
          object-cover
          block
          bg-gray-200
          h-full
          w-full
          rounded-xl
        "
      />
    </div>

    <div
      class="
        mt-3
        mb-1
        bg-gray-200
        rounded-xl
        overflow-hidden
        relative
        cursor-pointer
        transition-opacity
        duration-700
        ease-in-out
      "
      style="-webkit-mask-image: -webkit-radial-gradient(white, black)"
      role="button"
      :class="{ 'opacity-0': !ready, 'opacity-100': ready }"
      @click="annotationFullView"
    >
      <div
        v-if="annotationSrc"
        :style="{ backgroundImage: `url('${annotationSrc}')` }"
        class="image-background"
      ></div>

      <cropper
        ref="cropper"
        class="w-full h-full"
        style="max-height: 235px"
        background-class="cropper-background"
        :src="annotationSrc"
        :auto-zoom="!viewOriginal"
        :resize-image="false"
        :move-image="false"
        :default-position="{
          left: coordinates.left,
          top: coordinates.top,
        }"
        :default-size="{
          width: coordinates.width,
          height: coordinates.height,
        }"
        :stencil-props="{
          handlers: {},
          movable: false,
          resizable: false,
        }"
        :max-canvas-size="0"
        :transitions="transitions"
        image-restriction="fit-area"
        @ready="onCropperReady"
      />
    </div>

    <div
      v-if="isAnnotationReady"
      class="flex mt-1 ml-1 items-center"
      @click="annotationFullView"
    >
      <iconify-icon
        v-if="viewOriginal"
        icon="marker"
        class="text-orange-500 text-sm icon-marker"
      />

      <iconify-icon
        v-else
        icon="fillImageAlt"
        class="text-orange-500 text-[16px]"
      />

      <span
        class="ml-1 text-gray-400 font-medium text-xs"
        role="button"
        v-text="
          viewOriginal ? $t('comment.view_annotation') : $t('comment.view_img')
        "
      />
    </div>
  </div>
</template>

<script>
import { Cropper } from 'vue-advanced-cropper';
import 'vue-advanced-cropper/dist/style.css';
import signUrl from '@/mixins/signUrl';
import { EPrivacy } from '@/server/types/post';

export default {
  name: 'AnnotaionPreview',
  components: { Cropper },
  mixins: [signUrl],
  props: {
    src: {
      type: String,
      default: 'data:,',
    },
    image: {
      type: Object,
      required: true,
    },
    coordinates: {
      type: Object,
      required: true,
    },
    privacy: {
      type: String,
      default: EPrivacy.PUBLIC,
    },
    fileName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      annotationSrc: null,
      isAnnotationReady: false,
      transitions: true, //For cropper
      viewOriginal: false,
      ready: false,
      observer: null,
      observerOptions: {
        threshold: 0.01,
      },
    };
  },

  computed: {
    cropper() {
      if (this.$refs.cropper) return this.$refs.cropper;
      return null;
    },
  },

  mounted() {
    //Lazy loading
    this.$nextTick(() => {
      if (this.cropper) {
        //Add crossOrigin attribute
        // [...this.cropper.$el.querySelectorAll('.vue-preview__image')].map(
        //   (el) => {
        //     el.crossOrigin = 'Anonymous';
        //   }
        // );

        //Lazy loading
        this.observer = new IntersectionObserver(
          this.observerCallback,
          this.observerOptions
        );

        //Observe the post element
        this.observer.observe(this.$el);
      }
    });
  },

  beforeDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  },

  methods: {
    onCropperReady() {
      this.transitions = false;
      this.zoomToAnnotation();
      this.isAnnotationReady = true;

      // console.log(this.cropper);

      this.$nextTick(() => {
        setTimeout(() => {
          this.transitions = true;
          this.ready = true;
        }, 10);
      });
    },

    toAnnotationCoords() {
      //Set the cropper coordinates as the annotated point
      const imageSize = this.cropper.imageSize;
      const { width, height, left, top } = this.coordinates;
      // const newImage = this.image;

      const newCoordinates = {
        width: width * (imageSize.width / this.image.width),
        height: height * (imageSize.height / this.image.height),
        left: left * (imageSize.width / this.image.width),
        top: top * (imageSize.height / this.image.height),
      };

      console.log('newCoordinates');

      this.cropper.setCoordinates(newCoordinates, {
        autoZoom: !this.viewOriginal,
      });

      this.cropper.reset();
    },

    //Zoom to annotation point
    zoomToAnnotation() {
      // const publicProperties = this.cropper.getPublicProperties();
      const foreground = this.cropper.$el.querySelector(
        '.vue-advanced-cropper__foreground'
      );

      foreground.style.opacity = 0.5;

      this.toAnnotationCoords();

      this.viewOriginal = false;
    },

    //Zoom out of annotaion point (View orginal image)
    zoomOutAnnotation() {
      // const publicProperties = this.cropper.getPublicProperties();
      const foreground = this.cropper.$el.querySelector(
        '.vue-advanced-cropper__foreground'
      );

      foreground.style.opacity = 0;

      this.cropper.zoom(0);

      this.toAnnotationCoords();

      console.log('zoom out');

      this.viewOriginal = true;
    },

    //For onAnnotationView
    annotationFullView() {
      if (!this.viewOriginal) {
        this.zoomOutAnnotation();
      } else {
        this.zoomToAnnotation();
      }
    },

    //Cropper lazy loading observer
    //Load the image when the cropepr is visisble in the user viewport
    observerCallback(entries, _observer) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.annotationSrc = this.withQuery(
            this.src,
            this.privacy,
            '/tr:w-700'
          );
          this.observer.disconnect();
          this.observer = null;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .image-background {
  position: absolute;
  width: calc(100% + 20px);
  height: calc(100% + 20px);
  left: -10px;
  top: -10px;
  background-size: cover;
  background-position: 50%;
  backdrop-filter: blur(5px); //Fix for weird edge
  filter: blur(5px) brightness(0.65);
}

::v-deep .icon-marker {
  width: 0.8em;
}

// ::v-deep .vue-advanced-cropper__background {
//   background: transparent !important;
// }
</style>
