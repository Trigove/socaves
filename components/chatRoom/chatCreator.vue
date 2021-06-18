<template>
  <div
    class="editor relative pb-3 px-2"
    :style="cssVars"
    :class="{ 'opacity-40 pointer-events-none ': isDisabled }"
  >
    <media-dialog
      ref="mediaDialog"
      :files="files"
      @onSend="onMediaSend"
    ></media-dialog>

    <!--Comment input-->
    <div class="flex items-center">
      <div
        class="w-full rounded-xl relative comment-container min-h-36"
        style="background: rgba(var(--vs-gray-2), 1)"
      >
        <client-only>
          <editor-content
            ref="editor"
            data-test="chatBar"
            :class="{ 'opacity-40 pointer-events-none ': isRecording }"
            class="editor__content text-sm py-2 px-3 mr-1 w-full overflow-auto"
            :editor="editor"
          />

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
        </client-only>
      </div>

      <!--Voice message button-->
      <vs-button
        v-if="wordCount > 0"
        class="send-button text-orange-500 text-lg pb-[1.5px] mt-auto"
        data-test="SendBtn"
        transparent
        icon
        aria-label="send"
        :disabled="!canSend"
        :color="$color.gray[100]"
        @click="send"
      >
        <iconify-icon icon="send" />
      </vs-button>

      <template v-else>
        <vs-button
          icon
          transparent
          class="text-xl btn-p-0 mx-3"
          :class="{
            'text-red-500': isRecording,
            'text-gray-400': !isRecording,
          }"
          :color="$color.gray[100]"
          @click="record"
        >
          <IconifyIcon icon="mic" />
        </vs-button>

        <!--Voic message control and time-->
        <transition name="fade">
          <div v-if="isRecording" class="flex">
            <vs-button
              icon
              transparent
              class="text-xl text-red-500"
              :color="$color.red[500]"
              @click="discardRecord"
            >
              <IconifyIcon icon="close" />
            </vs-button>

            <p class="my-3">{{ formattedElapsedTime }}</p>

            <vs-button
              icon
              transparent
              class="text-xl text-green-500"
              :color="$color.green[500]"
              @click="sendRecord"
            >
              <IconifyIcon icon="check" />
            </vs-button>
          </div>
        </transition>

        <vs-button
          v-if="!isRecording"
          transparent
          icon
          aria-label="image upload"
          class="text-gray-400 btn-p-0 text-xl mx-3"
          :color="$color.gray[300]"
          @click="openFileUploader"
        >
          <iconify-icon icon="image" />
        </vs-button>
      </template>
    </div>
  </div>
</template>

<script>
//**IMPORTANT: THIS IS USING TIPTAP 2 */
//Please see: https://next.tiptap.dev/guide/configuration/#configure-the-editor-1
/**
 * All events
 * @event onUpdate fire when editor is updated
 * @event onSend fire on send button retun this
 */
import { Editor, EditorContent } from '@tiptap/vue-2';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Placeholder from '@tiptap/extension-placeholder';
import History from '@tiptap/extension-history';
import { addSeconds, format } from 'date-fns';
import { nanoid } from 'nanoid';
import mediaDialog from './mediaDialog';

export default {
  components: {
    EditorContent,
    mediaDialog,
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
  },
  data() {
    return {
      files: [],
      media: [], //Use to save IMedia
      isDisabled: false,
      editor: null,
      wordCount: 0, //word count for tiptap
      filteredUsers: [],
      maxWords: 5000,
      isUploaderEmpty: true,
      acceptFileTypes:
        'image/x-png,image/gif,image/jpeg,video/mp4,video/x-m4v,video/x-matroska,.mkv',
      //For voice messgae
      isRecording: false,
      isSendRecording: false,
      mediaRecorder: null,
      audioChunks: [],
      elapsedTime: 0,
      timer: null,
      isRecordTimeHidden: false,
    };
  },
  computed: {
    formattedElapsedTime() {
      const helperDate = addSeconds(new Date(0), this.elapsedTime / 1000);
      return format(helperDate, 'mm:ss');
    },

    canSend() {
      return !this.wordCount <= 0 && this.wordCount < this.maxWords;
    },

    cssVars() {
      return {
        '--placeholder': `"${this.$t('chat.placeholder')}"`,
      };
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
    //Fix for not triggering see: https://stackoverflow.com/questions/54124977/vuejs-input-file-selection-event-not-firing-upon-selecting-the-same-file
    resetImageUploader() {
      this.$refs.fileInput.value = '';
    },

    //Trigger after file being picked
    onPick(evt) {
      console.log('onPick', evt.target.files);
      //Pass the picked files to the parent (Dialog)
      this.files = [...evt.target.files];
      this.openMediaDialog();
    },

    openFileUploader() {
      this.$refs.fileInput.click();
    },

    reset() {
      this.$refs.fileInput.value = '';
      this.files = [];
      this.editor.commands.clearContent();
      this.wordCount = this.editor.getCharacterCount();
    },

    //Emit from media upload dialog
    onMediaSend(e) {
      this.$emit('onSend', e);
    },

    send() {
      this.$emit('onSend', this);
      this.reset();
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

    //When uploader is update
    onUploaderUpdate({ isEmpty }) {
      this.isUploaderEmpty = isEmpty;
    },

    //Handel record button
    record() {
      if (this.isRecording) {
        this.stopRecord();
        return;
      }
      this.startRecord();
    },

    openMediaDialog() {
      this.$refs.mediaDialog.open();
    },

    startRecord() {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        //Clear prev auido chunk if have any
        this.audioChunks = [];

        this.mediaRecorder = new MediaRecorder(stream);

        this.mediaRecorder.start();

        //Start recording timer
        this.startTimer();

        this.isRecording = true;

        console.log('start');

        this.mediaRecorder.addEventListener('dataavailable', (event) => {
          this.audioChunks.push(event.data);
        });

        this.mediaRecorder.addEventListener('stop', this.onRecordStop);
      });
    },

    stopRecord() {
      this.mediaRecorder?.stop();
    },

    sendRecord() {
      this.isSendRecording = true;
      this.stopRecord();
    },

    discardRecord() {
      this.isSendRecording = false;
      if (this.mediaRecorder) {
        this.audioChunks = [];
        this.stopRecord();
      }
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    //Handel on record stop event (After recorded)
    async onRecordStop() {
      console.log('Recording stoped');

      //Clear the timer
      this.clearTimer();

      //Stop the mircophone access
      this.mediaRecorder.stream
        .getTracks() // get all tracks from the MediaStream
        .forEach((track) => track.stop()); // stop each of them

      this.isRecording = false;

      if (this.isSendRecording) {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/ogg' });
        console.log(audioBlob.type);

        const base64data = await this.getBase64(audioBlob);

        this.media.push({
          fileName: nanoid(),
          type: audioBlob.type,
          src: base64data,
        });

        console.log(base64data);

        this.$emit('onSend', this);

        this.base64data = null;
        this.audioBlob = null;
        this.media = [];
      }
    },

    showRecordTime() {
      this.isRecordTimeHidden = !this.isRecordTimeHidden;
    },

    hideRecordTime() {
      this.isRecordTimeHidden = false;
    },

    startTimer() {
      this.timer = setInterval(() => {
        this.elapsedTime += 1000;
      }, 1000);
    },

    clearTimer() {
      clearInterval(this.timer);
      this.elapsedTime = 0;
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
</style>
