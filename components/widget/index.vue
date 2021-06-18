<template>
  <div class="flex flex-col w-[250px] sticky top-[90px]">
    <template v-if="$auth.loggedIn">
      <!-- <chat-widget></chat-widget> -->
      <suggest-user-widget></suggest-user-widget>
      <donate-widget class="mt-8"></donate-widget>
    </template>

    <template v-else>
      <join-us-widget></join-us-widget>
      <donate-widget class="mt-8"></donate-widget>
    </template>
  </div>
</template>

<script>
// import chatWidget from './chatWidget';
import suggestUserWidget from './suggestUserWidget';
import joinUsWidget from './joinUsWidget';
import donateWidget from './donateWidget';

export default {
  components: {
    // chatWidget,
    suggestUserWidget,
    joinUsWidget,
    donateWidget,
  },
};
</script>
