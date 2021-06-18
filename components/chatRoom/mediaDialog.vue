<!--eslint-disable vue/no-v-html-->
<template>
  <vs-dialog
    v-model="active"
    :style="cssVars"
    :loading="isLoading"
    overflow-hidden
    not-close
    prevent-close
  >
    <template #header>
      <dialog-header @onClose="active = false">
        {{ $t('chat.media') }}

        <template #right>
          <vs-button
            class="h-10 icon m-0 font-medium rounded-full"
            :disabled="!canSend"
            transparent
            active
            @click="send"
          >
            {{ $t('chat.send') }}
          </vs-button>
        </template>
      </dialog-header>
    </template>

    <!--wrapper-->
    <editor-content
      ref="editor"
      class="editor__content text-sm w-full overflow-auto pb-3"
      :editor="editor"
    />

    <!--Image editor using croppie-->
    <image-editor ref="imageEditor" @onConfirm="onEditorConfirm" />

    <div class="w-full flex items-center justify-center">
      <file-uploader
        ref="uploader"
        :can-remove="false"
        class="w-full"
        :files="files"
        :max-items="1"
        @onEditFile="onEditFile"
      />
    </div>

    <template #footer>
      <div class="w-full py-2 px-3">
        <vs-button
          data-test="post-btn"
          class="h-10 bg-orange-500 m-0 font-bold rounded-full"
          color="primary"
          active
          flat
          block
          :disabled="!canSend"
          @click="send"
        >
          {{ $t('chat.send') }}
        </vs-button>
      </div>
    </template>
  </vs-dialog>
</template>

<script>
import { Editor, EditorContent } from '@tiptap/vue-2';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';
import History from '@tiptap/extension-history';
import fileUploader from '@/components/postCreatorDialog/fileUploader';
import imageEditor from '@/components/postCreatorDialog/imageEditor';
import { nanoid } from 'nanoid';

/**
 * All events
 * @event onSend fire on send button retun this
 */

export default {
  components: {
    EditorContent,
    fileUploader,
    imageEditor,
  },
  props: {
    files: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      active: false,
      maxWords: 5000,
      wordCount: 0,
      editor: null,
      isLoading: false,
    };
  },
  computed: {
    cssVars() {
      return {
        '--placeholder': `"${this.$t('chat.placeholder')}"`,
      };
    },

    canSend() {
      return this.wordCount < this.maxWords;
    },
  },

  watch: {
    active(val) {
      if (!val) {
        this.reset();
      }
    },
  },

  mounted() {
    this.editor = new Editor({
      extensions: [Document, Paragraph, Text, History, Placeholder],
      onCreate: ({ editor }) => {
        this.$emit('onUpdate', editor);
      },
      onUpdate: ({ editor }) => {
        this.wordCount = editor.getCharacterCount();
        this.$emit('onUpdate', editor);
      },
    });
    // console.log(this.editor);
  },

  methods: {
    open() {
      this.active = true;
    },

    getHTML() {
      //Clean the html
      return this.$xss(this.editor.getHTML(), {
        whiteList: {
          p: [],
          br: [],
          b: [],
          strong: [],
          s: [],
          i: [],
          em: [],
        },
      });
    },

    reset() {
      if (this.$refs.uploader) {
        this.$refs.uploader.clear();
      }
      this.editor.commands.clearContent();
      this.wordCount = this.editor.getCharacterCount();
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    async send() {
      this.isLoading = true;

      const files = this.getFiles();

      const media = []; //Convert media to base 64 type: IMedia
      //let base64File = await this.getBase64(files[0]);

      for (let i = 0; i < files.length; i++) {
        const base64File = await this.getBase64(files[i]);
        media.push({
          fileName: nanoid(),
          type: files[i].type,
          src: base64File,
        });
      }

      this.isLoading = false;
      this.active = false;

      this.$emit('onSend', {
        getHTML: () => this.getHTML(),
        media,
      });
    },

    getFiles() {
      return this.$refs.uploader.getFiles();
    },

    //Handel edit button being click
    onEditFile(fileItem) {
      console.log(fileItem);
      this.$refs.imageEditor.open(fileItem);
    },

    //Handel when file being edit
    onEditorConfirm(item) {
      //Update the new file to the file uploader
      this.$refs.uploader.updateFile(item.id, item.file);
    },
  },
};
</script>

<style lang="scss" scoped>
/* Placeholder (at the top) */
::v-deep .ProseMirror p.is-editor-empty:first-child::before {
  content: var(--placeholder);
  float: left;
  color: #ced4da;
  pointer-events: none;
  height: 0;
}

::v-deep .vs-dialog {
  width: 500px;

  &__content {
    overflow-x: hidden;
    height: calc(var(--real-height) - 500px);
    min-height: 230px;
    @apply px-4;
    max-height: 600px;
  }
}

/* Fullscreen for mobile */
@media (max-width: theme('screens.md')) {
  @include fullscreen-vs-dialog(100px);
}
</style>
