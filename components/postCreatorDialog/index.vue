<template>
  <vs-dialog
    ref="dialog"
    v-model="active"
    class="post-creator"
    overflow-hidden
    not-close
    prevent-close
  >
    <template #header>
      <dialog-header @onClose="onClose">
        <!--Title-->
        <template v-if="type === EPost.SHARE">
          {{ $t('post.repost') }}</template
        >

        <template v-else-if="isEditMode"> {{ $t('post.edit') }}</template>

        <template v-else> {{ $t('post.create') }}</template>

        <template #right>
          <vs-button
            class="h-10 icon m-0 font-medium rounded-full"
            transparent
            active
            :disabled="!canPost"
            @click="post"
          >
            {{ isEditMode ? $t('post.save') : $t('post.post') }}
          </vs-button>
        </template>
      </dialog-header>
    </template>

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

    <!--Text area-->
    <div class="pb-3">
      <tiptap
        ref="tiptap"
        test-data="postTextArea"
        :content="content"
        @onUpdate="onEditorUpdate"
      ></tiptap>
    </div>

    <div class="w-full flex items-center justify-center">
      <!--Repost preview-->
      <post
        v-if="type === EPost.SHARE && repostObj"
        :id="repostObj._id"
        ref="post"
        class="mt-auto"
        preview-only
        :type="repostObj.type"
        :content="repostObj.content"
        :media="repostObj.media"
        :user="repostObj.user"
        :liked-users="repostObj.likedUsers"
        :updated-at="repostObj.updatedAt"
        :created-at="repostObj.createdAt"
        :num-comments="repostObj.numComments"
        :num-likes="repostObj.numLikes"
        :num-reports="repostObj.numReports"
        :num-shares="repostObj.numShares"
        :num-views="repostObj.numViews"
        :comments="repostObj.comments"
        :privacy="repostObj.privacy"
        :permission="repostObj.permission"
        :shared-post="repostObj.parentID"
      />
    </div>

    <template v-if="type !== EPost.SHARE">
      <!--Image editor using croppie-->
      <image-editor ref="imageEditor" @onConfirm="onEditorConfirm" />

      <file-uploader
        ref="uploader"
        :files="files"
        :max-items="10"
        :is-edit-mode="isEditMode"
        @onEditFile="onEditFile"
        @onError="onUploadError"
        @onUpdate="onUploaderUpdate"
      />
    </template>

    <template #footer>
      <!--Custom footer-->
      <div class="w-full pb-2 flex flex-col px-3">
        <span
          v-if="maxWords"
          class="ml-auto mr-3 text-sm text-gray-400 sticky bottom-0"
        >
          {{ wordCount }}/{{ maxWords }}
        </span>

        <div class="flex justify-between items-center">
          <template v-if="type !== EPost.SHARE">
            <!--Image-->
            <vs-button
              transparent
              class="text-teal-400 p-0 font-medium -ml-1"
              @click="openFileUploader"
            >
              <iconify-icon icon="image" class="text-xl mr-1" />
              <span class="text-gray-400" v-text="$t('post.photo_or_video')" />
            </vs-button>
          </template>

          <div class="flex">
            <!--Permission-->
            <permission-select
              ref="permissionSelect"
              class="-mr-3"
              @onChange="onPermissionChange"
            ></permission-select>

            <!--Privacy-->
            <privacy-select
              v-if="!isEditMode"
              ref="privacySelect"
              @onChange="onPrivacyChange"
            />
          </div>
        </div>

        <vs-button
          data-test="post-btn"
          class="h-10 bg-orange-500 m-0 font-bold rounded-full"
          color="primary"
          active
          flat
          :disabled="!canPost"
          block
          @click="post"
        >
          {{ isEditMode ? $t('post.save') : $t('post.post') }}
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script>
import { EPrivacy, EPost } from '@/server/types/post';
import { mapState } from 'vuex';
import post from '@/components/post/index';
import imageEditor from './imageEditor';
import fileUploader from './fileUploader';
import tiptap from './tiptap';
import privacySelect from './privacySelect';
import permissionSelect from './permissionSelect';
//NOTE: This component need to coporate with vuex see store folder
/**
 * All events
 * @event onPost fire when post triggered Return this (itself)
 * @event onPostEdited fire when post triggered Return this (itself)
 */
export default {
  name: 'PostCreatorDialog',
  components: {
    imageEditor,
    fileUploader,
    tiptap,
    privacySelect,
    permissionSelect,
    post,
  },
  data() {
    return {
      EPost,
      content: '', //Default content
      maxWords: 8000,
      isTiptapEmpty: true, //Is tiptap content empty
      wordCount: 0, //Tiptap word count
      isUploaderEmpty: true, //Is uploader empty
      selectedPrivacy: EPrivacy.PUBLIC, //Selected privacy
      selectedPermission: [], //Selected privacy
    };
  },
  computed: {
    canPost() {
      if (this.type === EPost.SHARE) {
        return true;
      }

      //Only can post when content is not empty or have files
      return (
        (!this.isTiptapEmpty || !this.isUploaderEmpty) &&
        this.wordCount < this.maxWords
      );
    },

    ...mapState('postCreator', [
      'active',
      'type',
      'repostObj',
      'isEditMode',
      'editObj',
      'files',
      'acceptFileTypes',
    ]),
  },
  watch: {
    active(val) {
      if (!val) {
        this.reset();
      }

      if (val) {
        this.onDialogOpen();
      }
    },
  },
  mounted() {
    console.log(this.editObj);
  },
  methods: {
    onClose() {
      this.reset();
      this.$store.dispatch('postCreator/close');
    },

    //If dialog opened
    async onDialogOpen() {
      //Edit mode put content in for edit
      if (this.isEditMode) {
        console.log(this.editObj);
        this.content = this.editObj.content;

        await this.$nextTick;

        //Auto select privacy based on edit post
        // this.$refs.privacySelect.privacy = this.editObj.privacy;
        this.$refs.permissionSelect.permission = this.editObj.permission;
      }

      //Share post privacy need to be
      if (this.type === EPost.SHARE) {
        await this.$nextTick;
        this.$refs.privacySelect.privacy = this.repostObj.parentPrivacy;

        //Update swiper
        this.$refs.post?.$el.querySelector('.swiper')?.swiper?.update();
      }
    },

    reset() {
      this.content = '';
      if (this.$refs.uploader) {
        this.$refs.uploader.clear();
      }
    },

    post() {
      if (this.isEditMode) {
        this.$emit('onPostEdited', this);
      } else {
        this.$emit('onPost', this);
      }

      this.$store.dispatch('postCreator/close');
      this.reset();
    },

    getHTML() {
      return this.$refs.tiptap.getHTML();
    },

    getFiles() {
      return this.$refs.uploader?.getFiles() ?? [];
    },

    //Handel edit button of file uploader being click
    onEditFile(fileItem) {
      console.log(fileItem);
      this.$refs.imageEditor.open(fileItem);
    },

    //Handel when file being edit
    onEditorConfirm(item) {
      //Update the new file to the file uploader
      this.$refs.uploader.updateFile(item.id, item.file);
    },

    showErrorNotification(text) {
      this.$vs.notification({
        duration: 2500,
        color: this.$color.orange[500],
        position: 'bottom-right',
        title: this.$t('info'),
        text,
      });
    },

    //Handel uploader error
    onUploadError(e) {
      this.showErrorNotification(e.message);
    },

    //When uploader is update
    onUploaderUpdate({ isEmpty }) {
      this.isUploaderEmpty = isEmpty;
    },

    //When editor is empty is update
    onEditorUpdate({ wordCount, isEmpty }) {
      this.wordCount = wordCount;
      this.isTiptapEmpty = isEmpty;
      //console.log(wordCount, isEmpty);
    },

    //Handel privacy selector change
    onPrivacyChange(val) {
      this.selectedPrivacy = val;
    },

    onPermissionChange(val) {
      this.selectedPermission = val;
    },

    //Fix for not triggering see: https://stackoverflow.com/questions/54124977/vuejs-input-file-selection-event-not-firing-upon-selecting-the-same-file
    resetImageUploader() {
      this.$refs.fileInput.value = '';
    },

    //Trigger after file being picked
    onPick(evt) {
      console.log('onPick', evt.target.files);

      //Pass the picked files to the parent (Dialog)
      this.$store.commit('postCreator/addFiles', {
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
/* Fullscreen for mobile */
@media (max-width: theme('screens.md')) {
  .post-creator {
    @include fullscreen-vs-dialog(155px);
  }

  ::v-deep .vs-dialog__content {
    max-height: none !important;
  }
}

::v-deep.post-creator .vs-dialog {
  width: 500px;

  &__content {
    max-height: 600px;
    height: calc(var(--real-height) - 200px);
    margin-bottom: 0 !important;
  }
}
</style>
