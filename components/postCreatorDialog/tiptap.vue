<template>
  <div class="editor relative">
    <client-only>
      <!--   <div class="mb-2 sticky top-10 bg-white z-10">
      <div v-if="editor" class="menubar">
        <button
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('bold') }"
          @click="editor.chain().focus().toggleBold().run()"
        >
          <iconify-icon icon="bold" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('italic') }"
          @click="editor.chain().focus().toggleItalic().run()"
        >
          <iconify-icon icon="italic" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('strike') }"
          @click="editor.chain().focus().toggleStrike().run()"
        >
          <iconify-icon icon="strike" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('underline') }"
          @click="editor.chain().focus().toggleUnderline().run()"
        >
          <iconify-icon icon="underline" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('code') }"
          @click="editor.chain().focus().toggleCode().run()"
        >
          <iconify-icon icon="code" />
        </button>

        <button
          class="menubar__button"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          @click="editor.chain().focus().toggleBlockquote().run()"
        >
          <iconify-icon icon="quote" />
        </button>
      </div>
    </div>-->

      <editor-menu-bar
        v-slot="{ commands, isActive }"
        :editor="editor"
        class="mb-2 bg-white z-10 w-full sticky -top-3"
      >
        <div class="menubar">
          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.bold() }"
            @click="commands.bold"
          >
            <iconify-icon icon="bold" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.italic() }"
            @click="commands.italic"
          >
            <iconify-icon icon="italic" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.strike() }"
            @click="commands.strike"
          >
            <iconify-icon icon="strike" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.underline() }"
            @click="commands.underline"
          >
            <iconify-icon icon="underline" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.code() }"
            @click="commands.code"
          >
            <iconify-icon icon="code" />
          </button>

          <button
            class="menubar__button"
            :class="{ 'is-active': isActive.blockquote() }"
            @click="commands.blockquote"
          >
            <iconify-icon icon="quote" />
          </button>
        </div>
      </editor-menu-bar>

      <editor-content
        ref="editor"
        data-test="postTextBox"
        class="editor__content"
        :editor="editor"
      />
    </client-only>
  </div>
</template>

<script>
/**
 * Tiptap editor events
 * @event onUpdate fire when editor update return component itself
 */

import { Editor, EditorContent, EditorMenuBar } from 'tiptap';
import {
  Blockquote,
  CodeBlock,
  HardBreak,
  Bold,
  Code,
  Italic,
  Strike,
  Underline,
  Placeholder,
  History,
} from 'tiptap-extensions';
// import AutoLink from '@/libs/tiptap-extensions/autoLink';

export default {
  components: {
    EditorContent,
    EditorMenuBar,
  },
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      editor: {},
      isEmpty: true, //is content empty
      wordCount: 0, //word count for tiptap
      myContent: '',
    };
  },
  beforeDestroy() {
    this.editor.destroy();
  },
  created() {
    this.myContent = this.content;
    this.updateWordCount();
  },
  mounted() {
    this.editor = new Editor({
      extensions: [
        new Blockquote(),
        new CodeBlock(),
        new HardBreak(),
        new Bold(),
        new Code(),
        new Italic(),
        new Strike(),
        new Underline(),
        // new AutoLink(),
        new History(),
        new Placeholder({
          emptyEditorClass: 'is-editor-empty',
          emptyNodeClass: 'is-empty',
          emptyNodeText: this.$t('post.write_something'),
          showOnlyWhenEditable: true,
          showOnlyCurrent: true,
        }),
      ],
      content: this.content,
      autoFocus: true,
      onUpdate: ({ getHTML }) => {
        this.myContent = getHTML();
        this.updateWordCount();
      },
    });
  },
  methods: {
    getHTML() {
      //Clean the html
      return this.myContent.replace(/<p><\/p>/g, ''); //Remove empty p tags;
    },
    updateWordCount() {
      //Update word count
      this.wordCount = this.myContent.replace(/<[^>]*>?/gm, '').trim().length;
      this.isEmpty = this.wordCount <= 0;
      this.$emit('onUpdate', this);
    },
  },
};
</script>

<style scoped>
::v-deep.editor p.is-editor-empty:first-child::before {
  content: attr(data-empty-text);
  float: left;
  color: #aaa;
  pointer-events: none;
  height: 0;
}

/* ::v-deep .ProseMirror {
  min-height: 200px;
} */
</style>
