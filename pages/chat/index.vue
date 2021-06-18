<template>
  <!-- main layout -->
  <div class="relative grid w-full grid-cols-12 overflow-hidden chat-container">
    <!-- left hand side -->
    <div class="flex flex-col col-span-12 bg-white lg:col-span-4">
      <!--Top-->
      <div class="flex flex-col px-5 pb-5 bg-gray-50">
        <!--Title part-->
        <div
          class="
            flex
            items-center
            justify-between
            h-16
            mb-3
            border-b
            bg-gray-50
          "
        >
          <h2
            class="mx-3 text-xl font-bold text-gray-700"
            v-text="$t('chat.title')"
          />

          <!-- <vs-button
            class="text-xl bg-gray-100"
            flat
            circle
            icon
            :color="$color.gray[100]"
            @click="$refs.settings.open()"
          >
            <iconify-icon icon="settings" class="text-gray-400" />
          </vs-button> -->
        </div>

        <div class="flex flex-col items-center justify-center">
          <div class="text-3xl">
            <avatar
              :user="$auth.user"
              badge-color="success"
              size="90"
              circle
              badge
            >
            </avatar>
          </div>

          <span class="pt-2 text-lg text-gray-700"> {{ name }} </span>
        </div>

        <div class="overflow-hidden">
          <vs-input
            v-model="query"
            aria-labelledBy="search"
            :placeholder="$t('chat.search_bar')"
            class="mt-4 text-lg"
          >
            <template #icon>
              <iconify-icon icon="search" color="71717A" />
            </template>
          </vs-input>
        </div>
      </div>

      <!-- Last chat list-->
      <div class="relative">
        <div class="sticky top-0 flex items-center justify-between mx-4 my-3">
          <span class="text-sm text-gray-600" v-text="$t('chat.last_chat')" />
          <!-- <vs-button
            class="text-lg bg-gray-100"
            flat
            circle
            icon
            :color="$color.gray[100]"
          >
            <iconify-icon icon="more" class="text-gray-400" />
          </vs-button> -->
        </div>

        <!--Chat list-->
        <div class="py-5 overflow-y-auto bg-white chat-list-container">
          <div
            v-for="(item, i) in filterItems(chatList)"
            :key="i"
            role="button"
            class="
              flex
              items-center
              p-4
              pb-3
              transition-colors
              duration-200
              rounded-lg
              hover:bg-gray-50
              active:bg-gray-100
            "
            @click="showChatRoom(item)"
          >
            <div class="mr-2.5">
              <avatar
                size="50"
                class="sm:w-[50px] sm:h-[50px] w-12 h-12 text-lg"
                :user="item.user"
                circle
                no-click
              />
            </div>

            <div class="flex flex-col justify-center w-full">
              <span class="text-sm font-bold sm:text-base">{{
                item.user.username
              }}</span>
              <p class="text-xs text-gray-500">{{ item.msg }}</p>
            </div>

            <span class="text-xs text-gray-500 min-w-[50px]">{{
              item.date
            }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Chat room -->
    <chat-room ref="chatRoom" :user="user"></chat-room>

    <!-- empty placeholder -->
    <!-- <div v-else class="hidden col-span-8 lg:block max-h-screen-real-nav">
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
    </div> -->

    <!-- chat system -->
    <!-- <inside-chat v-else></inside-chat> -->
    <settings ref="settings" />
  </div>
</template>

<script>
import chatRoom from '@/components/chatRoom/index';
import settings from '@/components/chat/settings';
import { io } from 'socket.io-client';

export default {
  layout: 'defaultNoTabBar',
  components: { chatRoom, settings },

  middleware({ $auth, redirect }) {
    if (!$auth.loggedIn) {
      return redirect('/login');
    }

    return redirect('/coming-soon');
  },

  async asyncData({ $axios, $auth }) {
    let res;
    const chatList = [];
    try {
      res = await $axios.get('/chatList');
      for (let i = 0; i < res.data.length; i++) {
        const roomId =
          res.data[i]._id > $auth.user._id
            ? `${res.data[i]._id}_${$auth.user._id}`
            : `${$auth.user._id}_${res.data[i]._id}`;
        chatList.push({
          roomId,
          date: '',
          msg: "Let's chat",
          user: res.data[i],
        });
        // console.log(chatList);
      }
    } catch (err) {
      console.error(err);
    }

    return { chatList };
  },

  data() {
    return {
      isChatEmpty: true,
      query: '',
      user: null,
      chatList: [],
      socket: null,
      oldRm: 'SOCAVES',
    };
  },

  computed: {
    name() {
      if (!this.$auth.user) {
        return this.$t('guest');
      }

      return this.$auth.user.personalInfo.name ?? this.$auth.user.username;
    },

    chatRoom() {
      if (this.$refs.chatRoom) return this.$refs.chatRoom;
      return null;
    },
  },

  mounted() {
    //Fix for trigger animation at load
    setTimeout(() => {
      this.preload = false;
    }, 800);
    this.$axios.get('/chats/init').then((_resp) => {
      this.socket = io({
        query: { roomId: 'SOCAVES' },
      });
    });
  },

  methods: {
    filterItems(presets) {
      return presets.filter((item) => {
        const regex = new RegExp('(' + this.query + ')', 'i');
        return item.user.username.match(regex);
      });
    },

    showChatRoom(item) {
      this.user = item.user;
      this.socket.emit('move', this.oldRm, item.roomId);
      this.oldRm = item.roomId;
      this.chatRoom.show(item.roomId, this.socket);
    },
  },

  head() {
    return {
      title: this.$t('chat.title'),
      meta: [{ hid: 'robots', name: 'robots', content: 'noindex' }],
    };
  },
};
</script>

<style lang="scss" scoped>
.chat-list-container {
  max-height: calc(var(--real-height) - 410px);
}

.chat-container {
  height: calc(
    var(--real-height) - #{$navbar-height} - env(safe-area-inset-bottom, 0)
  );
}
</style>
