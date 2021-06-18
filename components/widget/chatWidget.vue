<template>
  <!-- chat box-->
  <div
    v-if="chatList.length > 0"
    class="px-4 py-3 text-sm bg-white rounded-2xl shadow-base"
  >
    <h4 class="pb-2 text-sm font-medium text-gray-400">
      {{ $t('chat.title') }}
    </h4>
    <!-- status and name and icon -->

    <div v-for="(item, i) in chatList" :key="i" class="relative flex py-2">
      <div class="mr-3">
        <avatar
          size="50"
          class="sm:w-[40px] sm:h-[40px] w-12 h-12 text-sm"
          :user="item.user"
          circle
          no-click
        />
      </div>

      <div class="w-full pb-2 truncate border-b">
        <a class="pr-4 text-xs font-bold text-black">{{
          item.user.username
        }}</a>
        <p class="pr-4 text-xs text-green-400">{{ $t('chat.Online') }}</p>
      </div>
    </div>

    <div class="flex justify-center pt-1 text-xs font-medium text-gray-400">
      <nuxt-link to="/chat">{{ $t('post.see_more') }}</nuxt-link>
    </div>
  </div>
</template>

<script>
export default {
  async fetch() {
    let res;
    try {
      res = await this.$axios.get('/chatList');
      for (let i = 0; i < res.data.length; i++) {
        const roomId =
          res.data[i]._id > this.$auth.user._id
            ? `${res.data[i]._id}_${this.$auth.user._id}`
            : `${this.$auth.user._id}_${res.data[i]._id}`;
        this.chatList.push({
          roomId,
          date: '',
          msg: "Let's chat",
          user: res.data[i],
        });
      }
    } catch (err) {
      console.error(err);
    }
  },
  data() {
    return {
      chatList: [],
    };
  },
};
</script>
