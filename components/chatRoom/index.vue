<template>
  <div
    ref="chatBox"
    class="
      chat-room-container
      flex flex-col
      lg:col-span-8 lg:relative
      col-span-12
      bg-white
      overflow-auto
      absolute
      w-full
      h-full
    "
    :class="{
      overlay: isOverlay,
      'transition-transform duration-500': !preload,
      'not-overlay': !isOverlay && !preload,
      'not-overlay-preload': !isOverlay && preload,
    }"
  >
    <template v-if="!isEmpty">
      <!-- Title bar -->
      <title-bar
        :user="user"
        class="bg-white w-full px-3"
        @onBack="back"
      ></title-bar>

      <!--Messages container-->
      <!-- :class="
            item.sentByMe ? 'bg-orange-400 ml-auto' : 'bg-orange-500 mr-auto'
          " -->
      <div class="flex flex-col overflow-y-auto p-3 text-sm h-full">
        <div
          v-for="(item, i) in messages"
          :key="i"
          :class="i == 0 ? 'mt-auto' : ''"
        >
          <chat-bubble
            :room-id="roomId"
            :msg-id="item.msgId"
            :media="item.media"
            :sent-by-me="item.sentByMe"
            :content="item.content"
            :time="item.sentTime"
          />
        </div>
      </div>

      <!-- Message input -->
      <chat-creator @onSend="onSendMessage"></chat-creator>
    </template>

    <!-- empty placeholder -->
    <div v-else class="hidden col-span-8 lg:block max-h-screen-real-nav">
      <div class="flex flex-col items-center justify-center h-screen-real-nav">
        <img
          class="w-full"
          style="max-width: 200px"
          src="~/assets/img/chaticon.png"
        />

        <span
          class="pt-5 text-2xl font-bold text-gray-700"
          v-text="$t('chat.no_message')"
        />

        <span class="pt-3 text-lg text-gray-600" v-text="$t('chat.tips')" />
      </div>
    </div>
  </div>
</template>

<script>
import { nanoid } from 'nanoid';
import ioConfig from '@/server/api/message/ioEvent';
import { formatMixin } from '@/mixins/format';
import chatBubble from './chatBubble';
import chatCreator from './chatCreator';
import titleBar from './titleBar';

export default {
  components: { titleBar, chatBubble, chatCreator },
  mixins: [formatMixin],
  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      messages: [],
      socket: null,
      isOverlay: false,
      preload: true,
      roomId: '',
    };
  },
  computed: {
    isEmpty() {
      return !this.user;
    },
  },
  beforeUnmount() {
    if (this.socket) {
      this.socket.disconnect();
    }

    console.log('beforeUnmount');
  },
  updated() {
    // console.log('updated');
    // console.log(this.socket);
    // console.log(this.messages);
    this.socket.on(ioConfig.SEND_MSG, (message) => {
      const incomingMessage = {
        ...message,
        sentByMe: this.$auth.user._id === message.fromUser,
        isRead: true,
        receiveTime: Date.now(),
      };

      // console.log('this.socket', this.messages);
      this.messages.push(incomingMessage);

      this.$nextTick(() => {
        if (document.getElementById(incomingMessage.msgId)) {
          document
            .getElementById(incomingMessage.msgId)
            .scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  },
  beforeDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  },
  methods: {
    //Handel stacking for mobile
    back() {
      this.isOverlay = false;
    },

    show(roomId, socket) {
      this.roomId = roomId;
      this.socket = socket;
      this.messages = [];
      this.isOverlay = true;
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    onSendMessage({ getHTML, media }) {
      if (!media) {
        media = null;
      }

      this.sendMessage(getHTML(), media);
    },

    sendMessage(content = '', media = null) {
      console.log(this.socket.rooms);
      const id = nanoid();
      let newMessage = null;
      if (media.length) {
        newMessage = {
          msgId: id,
          roomId: this.roomId,
          fromUser: this.$auth.user._id,
          toUser: nanoid(),
          content,
          media,
          sentByMe: true,
          isRead: false,
          sentTime: Date.now(),
        };
      } else {
        newMessage = {
          msgId: id,
          roomId: this.roomId,
          fromUser: this.$auth.user._id,
          toUser: nanoid(),
          content,
          sentByMe: true,
          isRead: false,
          sentTime: Date.now(),
        };
      }

      // console.log(newMessage);
      this.inputMessage = '';
      this.media = null;
      // console.log('send1', this.media);
      console.log(this.roomId);
      this.socket.emit(ioConfig.SEND_MSG, newMessage, this.roomId);
      this.messages.push(newMessage);
      // console.log('send3', this.messages);
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-room-container {
  &.overlay {
    z-index: 10 !important;
    transform: translateX(100%);
    animation: slide-in 0.3s forwards;
  }

  &.not-overlay {
    transform: translateX(100%);
    animation: slide-out 0.3s forwards;

    &-preload {
      transform: translateX(100%);
      animation: slide-out 0s forwards;
    }
  }
}

@keyframes slide-in {
  100% {
    transform: translateX(0%);
  }
}

@keyframes slide-out {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(100%);
    z-index: -10 !important;
  }
}

@media (min-width: theme('screens.lg')) {
  .chat-room-container {
    transition: none !important;

    &.overlay {
      z-index: 10 !important;
      transform: none !important;
    }

    &.not-overlay {
      z-index: 10 !important;
      transform: none !important;

      &-preload {
        transform: none !important;
      }
    }
  }
}

@media (max-width: theme('screens.sm')) {
  .chat-bubble {
    max-width: 200px !important;
  }
}
.chat-bubble {
  max-width: 380px;
}

audio {
  height: 20px;
}

audio::-webkit-media-controls-panel {
  background-color: #f97316;
}

.timeStamp {
  font-size: 1px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to/* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
