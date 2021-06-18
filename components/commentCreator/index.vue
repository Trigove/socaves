<template>
  <div
    class="editor relative"
    :style="cssVars"
    :class="{ 'opacity-40 pointer-events-none ': isDisabled }"
  >
    <!--Comment input-->

    <div class="flex align-center">
      <div
        class="w-full rounded-3xl relative comment-container"
        style="background: rgba(var(--vs-gray-2), 1); min-height: 36px"
      >
        <client-only>
          <editor-content
            ref="editor"
            data-test="commentBar"
            class="
              editor__content
              text-sm
              py-2
              px-3
              mr-1
              w-full
              max-h-36
              overflow-auto
            "
            :editor="editor"
          />

          <template v-if="!noMedia">
            <!--Image editor using croppie-->
            <image-editor ref="imageEditor" @onConfirm="onEditorConfirm" />

            <!--File picker-->
            <input
              ref="fileInput"
              class="hidden"
              type="file"
              :accept="acceptFileTypes"
              name="img"
              @click="resetImageUploader"
              @change="onPick"
            />

            <file-uploader
              ref="uploader"
              :class="{ 'p-3 pb-0': !isUploaderEmpty }"
              :files="files"
              :max-items="1"
              @onEditFile="onEditFile"
              @onUpdate="onUploaderUpdate"
            />

            <vs-button
              v-if="isUploaderEmpty"
              transparent
              icon
              aria-label="image upload"
              class="absolute right-3 bottom-1 text-gray-400 btn-p-0 text-lg"
              :color="$color.gray[300]"
              @click="openFileUploader"
            >
              <iconify-icon icon="image" />
            </vs-button>
          </template>
        </client-only>
      </div>

      <vs-button
        v-if="!noSend"
        class="send-button text-orange-500 text-lg mt-auto"
        data-test="SendBtn"
        style="padding-bottom: 1.5px"
        transparent
        icon
        aria-label="send"
        :disabled="!canComment"
        :color="$color.gray[100]"
        @click="comment"
      >
        <iconify-icon icon="send" />
      </vs-button>
    </div>
  </div>
</template>

<script>
//**IMPORTANT: THIS IS USING TIPTAP 2 */
//Please see: https://next.tiptap.dev/guide/configuration/#configure-the-editor-1
/**
 * All events
 * @event onUpdate fire when editor is updated
 * @event onComment fire on send button being click return a tmpPost object
 */
import { Editor, EditorContent, VueRenderer } from '@tiptap/vue-2';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
// import Link from '@tiptap/extension-link';
import { EPrivacy } from '@/server/types/post';
import Mention from '@tiptap/extension-mention';
import Placeholder from '@tiptap/extension-placeholder';
import imageEditor from '@/components/postCreatorDialog/imageEditor';
import fileUploader from '@/components/postCreatorDialog/fileUploader';
import History from '@tiptap/extension-history';
// import { nanoid } from 'nanoid';
import MentionList from './mentionList';
import videoTimeExt from './videoTimeExt';

export default {
  components: {
    EditorContent,
    imageEditor,
    fileUploader,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    tippyZindex: {
      type: Number,
      default: 100,
    },
    //Hide send button
    noSend: {
      type: Boolean,
      default: false,
    },
    //Hide media uploader
    noMedia: {
      type: Boolean,
      default: false,
    },
    privacy: {
      type: String,
      default: EPrivacy.PUBLIC,
    },
  },
  data() {
    return {
      files: [],
      isDisabled: false,
      editor: null,
      wordCount: 0, //word count for tiptap
      query: null,
      suggestionRange: null,
      filteredUsers: [],
      navigatedUserIndex: 0,
      maxWords: 3000,
      isUploaderEmpty: true,
      acceptFileTypes:
        'image/x-png,image/gif,image/jpeg,video/mp4,video/x-m4v,video/x-matroska,.mkv',
    };
  },
  computed: {
    cssVars() {
      return {
        '--placeholder': `"${this.$t('post.write_something')}"`,
      };
    },
    canComment() {
      return (
        (!this.wordCount <= 0 || !this.isUploaderEmpty) &&
        this.wordCount < this.maxWords
      );
    },
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  created() {
    this.isDisabled = this.disabled;
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        Document,
        Paragraph,
        Text,
        // Link,
        History,
        Placeholder,
        videoTimeExt,
        Mention.configure({
          HTMLAttributes: {
            class: 'mention',
          },
          suggestion: {
            items: (query) => {
              if (query) {
                return this.getQueryList(query);
              }
              return [];
            },
            render: () => {
              let component;
              let popup;

              return {
                onStart: (props) => {
                  component = new VueRenderer(MentionList, {
                    parent: this,
                    propsData: props,
                  });

                  popup = this.$tippy('body', {
                    getReferenceClientRect: props.clientRect,
                    theme: 'mention-tippy',
                    appendTo: () => document.body,
                    content: component.element,
                    arrow: false,
                    showOnCreate: true,
                    interactive: true,
                    trigger: 'manual',
                    placement: 'bottom-start',
                    zIndex: this.tippyZindex,
                  });
                },

                onUpdate(props) {
                  component.updateProps(props);

                  popup[0].setProps({
                    getReferenceClientRect: props.clientRect,
                  });
                },

                onKeyDown(props) {
                  return component.ref?.onKeyDown(props);
                },

                onExit() {
                  popup[0].destroy();
                  component.destroy();
                },
              };
            },
          },
        }),
      ],
      onCreate: ({ editor }) => {
        this.$emit('onUpdate', editor);
      },
      onUpdate: ({ editor }) => {
        this.wordCount = editor.state.doc.textContent.trim().length;
        this.$emit('onUpdate', editor);
      },
    });
    // console.log(this.editor);
  },

  methods: {
    async getQueryList(query) {
      let res;
      try {
        res = await this.$axios.get(`/utils/users/search?q=${query}`);
      } catch (err) {
        console.error(err);
      }
      return res.data
        .map((user) => user.username)
        .filter((item) => item.toLowerCase().startsWith(query.toLowerCase()))
        .slice(0, 5);
    },

    //Add a video time tag
    addVideoTimeTag(id, seconds) {
      console.log(this.editor);
      this.editor?.commands.insertContent(
        `<a data-video-time dataTime="${seconds}" dataId="${id}"> </a>`
      );
    },

    //Fix for not triggering see: https://stackoverflow.com/questions/54124977/vuejs-input-file-selection-event-not-firing-upon-selecting-the-same-file
    resetImageUploader() {
      this.$refs.fileInput.value = '';
    },

    //Trigger after file being picked
    onPick(evt) {
      console.log('onPick', evt.target.files);
      //Pass the picked files to the parent (Dialog)
      this.files = [...evt.target.files];
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

    openFileUploader() {
      this.$refs.fileInput.click();
    },

    reset() {
      this.$refs.fileInput.value = '';
      this.files = [];
      if (this.$refs.uploader) {
        this.$refs.uploader.clear();
      }
      this.editor.commands.clearContent();
      this.wordCount = this.editor.getCharacterCount();
    },

    comment() {
      this.$emit('onComment', this);
    },

    getHTML() {
      //Clean the html
      return this.editor.getHTML().replace(/<p><\/p>/g, ''); //Remove empty p tags;
    },

    //Return file picker files
    getFiles() {
      return this.$refs.uploader.getFiles();
    },

    //When uploader is update
    onUploaderUpdate({ isEmpty }) {
      this.isUploaderEmpty = isEmpty;
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

::v-deep .ProseMirror {
  padding-right: 25px;
}

::v-deep .send-button {
  &:disabled {
    color: #808080 !important;
  }
  .vs-button__content {
    @apply p-0;

    svg {
      height: 1.2em;
    }
  }
}

::v-deep .mention {
  background-color: rgba(#f97316, 0.1);
  border-radius: 0.3rem;
  font-weight: 500;
  padding: 0.1rem 0.3rem;
}

// .editor__content {
//   background: rgba(var(--vs-gray-2), 1);
// }
</style>
