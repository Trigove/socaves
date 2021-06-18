<template>
  <div class="file-uploader__container">
    <transition-group name="list" tag="div" class="flex flex-col">
      <div
        v-for="item in fileData"
        :key="item.id"
        class="file-preview__wrapper"
        :class="{ 'aspect-w-16 aspect-h-9': item.file.type.includes('image/') }"
        :style="
          item.file.type.includes('image/')
            ? `background-image: url('${getFileURL(item.file)}');`
            : ''
        "
      >
        <div class="file-preview__top">
          <!--Remove file-->
          <button
            v-if="canRemove"
            class="file-preview__round-button"
            @click="removeFile(item.id)"
          >
            <iconify-icon icon="close" style="font-size: 20px" />
          </button>

          <!--Edit file-->
          <button
            v-if="item.file.type.includes('image/')"
            class="file-preview__round-button ml-auto"
            @click="onEditFile(item)"
          >
            <iconify-icon icon="edit" style="font-size: 13px" />
          </button>
        </div>
        <div class="file-preview__backdrop-blur"></div>

        <!--For image-->
        <img
          v-if="item.file.type.includes('image/')"
          class="object-contain"
          :src="getFileURL(item.file)"
          @load="removeLoading(item.id)"
        />

        <!--Loading-->
        <loading-spinner
          v-if="!item.file.type.includes('video/')"
          :id="`loading-${item.id}`"
          class="absolute"
          style="
            display: block;
            z-index: 2;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          "
        ></loading-spinner>

        <!--For video-->
        <plyr
          v-if="item.file.type.includes('video/')"
          @canPlay="removeLoading(item.id)"
        >
          <video controls playsinline>
            <source :src="getFileURL(item.file)" :type="item.file.type" />
          </video>
        </plyr>
      </div>
    </transition-group>
  </div>
</template>

<script>
/**
 * File uploader that with media preview featuews
 * @event onEditFile fire when the edit button being click
 * @event onUpdate fire the file array being update, pass back instance
 * @event onError fire when error occur, pass back error info
 */
import { debounce } from 'debounce';

export default {
  props: {
    //File array
    files: {
      type: Array,
      default: () => [],
    },

    //Is it for edit mode?
    isEditMode: {
      type: Boolean,
      default: false,
    },

    maxItems: {
      type: Number,
      default: 0,
    },

    //Have remove media button?
    canRemove: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fileData: [],
      isEmpty: true,
    };
  },
  watch: {
    files: {
      deep: true,
      immediate: true,
      handler(newVal, oldVal) {
        oldVal = oldVal ?? [];
        //console.log(newVal, oldVal);
        const newItems = newVal.filter((x) => !oldVal.includes(x));

        //   console.log('newItems', newItems);

        newItems.map((item) => {
          try {
            this.add(item);
          } catch (e) {
            console.log(e);
            this.$emit('onError', e);
          }
        });

        this.$emit('onUpdate', this);
      },
    },
    fileData: {
      deep: true,
      immediate: true,
      handler(val) {
        this.isEmpty = val.length <= 0;
        this.$emit('onUpdate', this);
      },
    },
  },
  methods: {
    clear() {
      this.fileData = [];
    },
    //Return the file src link for preview
    getFileURL(file) {
      if (file.src) {
        return file.src;
      }

      return URL.createObjectURL(file);
    },
    //Genetrate id
    generateID() {
      return Math.random().toString(16).slice(10);
    },

    //Step1: Add a file
    add(file) {
      if (this.maxItems > 0) {
        if (this.fileData.length < this.maxItems) {
          this.addFile(file);
          return;
        }

        this.throwMaxItemError();
      } else {
        //No max item limit
        this.addFile(file);
      }
      // console.log(this.fileData);
    },

    throwMaxItemError: debounce(function () {
      let error = new Error();

      error = {
        ...error,
        code: 'MAX_ITEM_EXCEEDED',
        message: this.$t('uploader.MAX_ITEM_EXCEEDED', {
          num: this.maxItems,
        }),
      };

      this.$emit('onError', error);

      throw error;
    }, 500),

    //Step2: Push file with size and format checking
    addFile(file) {
      const object = {
        id: this.generateID(),
        file, //Store the file:blob
      };

      let error = new Error();

      console.log(file);

      // Check the file size of the video and image
      // Image: 15Mb
      // Video: 200Mb

      if (file.type.includes('image/')) {
        if (!(file.size >= 15 * 1024 * 1024)) {
          this.fileData.push(object);
          console.log('Image add');
        } else {
          error = {
            ...error,
            code: 'IMAGE_FILE_TOO_LARGE',
            message: this.$t('uploader.IMAGE_FILE_TOO_LARGE', {
              name: file.name,
            }),
            file,
          };

          throw error;
        }
      } else if (file.type.includes('video/')) {
        if (!(file.size >= 200 * 1024 * 1024)) {
          this.fileData.push(object);
          console.log('Video add');
        } else {
          error = {
            ...error,
            code: 'VIDEO_FILE_TOO_LARGE',
            message: this.$t('uploader.VIDEO_FILE_TOO_LARGE', {
              name: file.name,
            }),
            file,
          };

          throw error;
        }
      } else {
        //Not supported file type
        error = {
          ...error,
          code: 'FILE_TYPE_NOT_SUPPORTED',
          message: this.$t('uploader.FILE_TYPE_NOT_SUPPORTED', {
            name: file.name,
          }),
          file,
        };

        throw error;
      }
    },

    //Remove file by id
    removeFile(id) {
      this.fileData = this.fileData.filter((item) => item.id !== id);
    },
    //On edit file button being clicked
    onEditFile(fileItem) {
      //Rteurn the file item
      /*
        id: this.generateID(),
        file, //Store the file:blob
      */
      this.$emit('onEditFile', fileItem);
    },
    //Remove loading when media loaded
    //Pass in id, will remove corrseponding loading
    removeLoading(loadingID) {
      // console.log(loadingID, 'remove loading');
      if (document.querySelector(`#loading-${loadingID}`)) {
        document.querySelector(`#loading-${loadingID}`).remove();
      }
    },
    //Return pure file array
    getFiles() {
      return this.fileData.map((item) => item.file);
    },
    //Update a file
    updateFile(id, newFile) {
      this.fileData.map((item, i) => {
        if (item.id === id) {
          this.fileData[i].file = newFile;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$border-radius: 8px;
$image-preview-bg: #272727;
$round-button-size: 28px;
$photo-max-width: 400px;

::v-deep .plyr {
  width: 100%;
  height: 100%;
  max-height: 250px;
}

.file-uploader__container {
  display: flex;
  flex-direction: column;
}

// .media-contain {
//   z-index: 1;
//   display: block;
//   max-width: $photo-max-width;
//   max-height: 250px;
//   width: auto;
//   height: auto;
// }

.list-enter-active,
.list-leave-active {
  transition: all 0.35s ease-in-out;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.file-preview {
  &__wrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    z-index: 2;
    overflow: hidden;
    background-color: $image-preview-bg;
    margin-bottom: 1rem;
    overflow: hidden;
    border-radius: $border-radius;

    //For background image
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
  }

  &__top {
    display: flex;
    padding: 0.8rem;
    z-index: 2;
    width: 100%;
    position: absolute;
    background: linear-gradient(
      0deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.47) 64%,
      rgba(0, 0, 0, 0.86) 100%
    );
    top: 0;
    height: 80px;
  }

  //Blur effect
  &__backdrop-blur {
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: $border-radius;
  }

  &__round-button {
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    outline: 0;
    color: #fff;
    background-color: black;
    border-radius: 50%;
    width: $round-button-size;
    height: $round-button-size;
    transition: all 0.1s linear;
    //Used for pseudo elemnt stacking
    transform-style: preserve-3d;

    &::after {
      content: ' ';
      position: absolute;
      width: calc(#{$round-button-size} - 10px);
      height: calc(#{$round-button-size} - 10px);
      transform: translateZ(-1px) translateX(-50%);
      left: 50%;
      transition: width 0.3s, height 0.3s;
      border-radius: 50%;
      background-color: #fff;
    }

    &:hover::after {
      transform: translateZ(-1px) translateX(-50%);
      width: 32px;
      height: 32px;
    }
  }
}
</style>
