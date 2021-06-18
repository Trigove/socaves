<template>
  <div
    class="
      sm:shadow-base
      bg-white
      sm:max-w-lg
      w-full
      sm:rounded-2xl sm:px-5
      pb-1
      pt-5
      px-3
    "
  >
    <!--Drag and drop zone-->
    <div
      ref="dropzone"
      class="
        fixed
        z-[99999]
        bg-orange-500
        w-full
        h-full
        opacity-50
        left-0
        top-0
      "
      :class="{ hidden: !showDropZone }"
    ></div>

    <!--Comment part-->
    <div class="flex items-center justify-center">
      <div>
        <avatar :user="$auth.user" circle size="45"> </avatar>
      </div>

      <div
        class="w-full click-dark-brightness ml-2 overflow-hidden"
        role="button"
        data-test="postBar"
        @click="
          $auth.loggedIn
            ? $store.dispatch('postCreator/open')
            : $router.push('/login')
        "
      >
        <vs-input
          disabled
          aria-labelledBy="create post"
          data-test="textInput"
          :placeholder="
            $t('post.placeholder', {
              name: $auth.loggedIn ? $auth.user.username : this.$t('guest'),
            })
          "
          class="pointer-events-none opacity-100"
        />
      </div>
    </div>

    <!--Divider-->
    <div class="mt-4 border-b border-gray-100"></div>

    <!--Media part-->
    <div class="flex flex-wrap">
      <!--Image-->
      <vs-button
        icon
        :color="$color.teal[400]"
        transparent
        class="text-teal-400 p-0 font-medium -ml-1"
        data-test="imageBtn"
        @click="
          $auth.loggedIn ? $refs.fileInput.click() : $router.push('/login')
        "
      >
        <iconify-icon icon="image" class="text-xl mr-1" />
        <span class="text-gray-400" v-text="$t('post.photo')" />
      </vs-button>

      <!--Video-->
      <vs-button
        icon
        :color="$color.red[400]"
        transparent
        class="text-red-400 p-0 font-medium -ml-1"
        @click="
          $auth.loggedIn ? $refs.fileInput.click() : $router.push('/login')
        "
      >
        <iconify-icon icon="video" class="text-xl mr-1" />
        <span class="text-gray-400" v-text="$t('post.video')" />
      </vs-button>

      <!--File picker-->
      <input
        ref="fileInput"
        class="hidden"
        type="file"
        :accept="acceptFileTypes"
        multiple
        @click="resetImageUploader"
        @change="onPick"
      />
    </div>

    <slot></slot>
  </div>
</template>

<script>
import { mapState } from 'vuex';

//A componet that create post
export default {
  name: 'PostCreator',
  data() {
    return {
      showDropZone: false,
    };
  },

  computed: {
    ...mapState('postCreator', ['acceptFileTypes']),
    dropZone() {
      if (this.$refs.dropzone) return this.$refs.dropzone;
      return null;
    },
  },

  mounted() {
    // 1
    window.addEventListener('dragenter', () => {
      this.showDropZone = true;
    });

    // 3
    this.dropZone.addEventListener('dragleave', () => {
      console.log('dragleave');
      this.showDropZone = false;
    });

    this.dropZone.addEventListener('dragover', this.allowDrag);

    // 4
    this.dropZone.addEventListener('drop', this.handleDrop);
  },
  methods: {
    allowDrag(e) {
      console.log('File(s) in drop zone');
      e.preventDefault();
    },

    handleDrop(e) {
      this.showDropZone = false;
      console.log('File(s) dropped');

      // Prevent default behavior (Prevent file from being opened)
      e.preventDefault();
      console.log(e.dataTransfer.items);

      const dataTransfer = e.dataTransfer.items;
      const files = [];

      for (let i = 0; i < dataTransfer.length; i++) {
        // If dropped items aren't files, reject them
        if (dataTransfer[i].kind === 'file') {
          const file = dataTransfer[i].getAsFile();
          files.push(file);
          console.log(file);
        }
      }

      this.$store.commit('postCreator/open', {
        files,
      }); //Open the dialog
    },

    //Fix for not triggering see: https://stackoverflow.com/questions/54124977/vuejs-input-file-selection-event-not-firing-upon-selecting-the-same-file
    resetImageUploader() {
      this.$refs.fileInput.value = '';
    },

    //Trigger after file being picked
    onPick(evt) {
      console.log('onPick', evt.target.files);
      //Pass the picked files to the parent (Dialog)
      this.$store.commit('postCreator/open', {
        files: [...evt.target.files],
      }); //Open the dialog
    },

    openFileUploader() {
      this.$refs.fileInput.click();
    },
  },
};
</script>

<style lang="scss" scoped>
//Used for hover have parent color for btn text
.vs-button:hover {
  span {
    color: currentColor !important;
  }
}
</style>
