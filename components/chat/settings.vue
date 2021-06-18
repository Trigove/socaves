<template>
  <!-- <vs-button @click="active = !active"> Open Dialog </vs-button> -->
  <vs-dialog v-model="active" overflow-hidden not-close prevent-close>
    <template #header>
      <dialog-header @onClose="active = false">
        <span
          class="pt-5 text-2xl font-bold text-gray-600"
          v-text="$t('chat.settings')"
        />
      </dialog-header>
    </template>
    <hr />
    <div>
      <!-- account option -->
      <div class="pt-2 pb-2">
        <span
          class="pt-5 text-sm font-bold text-black"
          v-text="$t('chat.settingAccount')"
        />
      </div>
      <div class="pb-2">
        <div
          class="flex p-2 pb-3 rounded-lg cursor-pointer hover:bg-orange-100"
        >
          <img
            class="w-full pr-3 max-h-40 max-w-max"
            style="max-width: 60px"
            src="~/assets/img/friendicon.png"
          />

          <div class="flex flex-col justify-center w-full">
            <span class="font-bold">{{ $t('chat.username') }}</span>
            <p class="text-xs text-gray-500">{{ $t('chat.view_profile') }}</p>
          </div>
        </div>
      </div>
    </div>
    <hr />
    <!-- Notice option -->
    <div class="pt-2 pb-2">
      <div>
        <span
          class="pt-5 text-sm font-bold text-black"
          v-text="$t('chat.setting_notice')"
        />
      </div>
      <div class="flex p-2 pb-3 rounded-lg cursor-pointer hover:bg-white">
        <!-- <img
                class="pr-3 max-h-40"
                style="max-width: 50px"
                src="~/assets/img/noticeIcon.png"
              /> -->
        <div
          class="
            flex
            items-center
            justify-center
            bg-gray-200
            rounded-full
            w-11
            h-11
          "
        >
          <svg
            width="24"
            height="20"
            viewBox="0 0 24 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 15H0V5H5V15ZM7 5V15L16 20V0L7 5ZM24 9H19V11H24V9ZM22.416 2.768L18.084 5.268L19.084 7L23.416 4.5L22.416 2.768ZM23.416 15.5L19.084 13L18.084 14.732L22.416 17.232L23.416 15.5Z"
              fill="#52525B"
            />
          </svg>
        </div>

        <div class="flex flex-col justify-center ml-3">
          <span class="text-base font-bold">
            {{ $t('chat.setting_notice_sound') }}</span
          >
          <p class="text-xs text-gray-500">
            {{ $t('chat.setting_notice_sound_description') }}
          </p>
        </div>
        <div class="ml-auto center con-switch">
          <vs-switch />
        </div>
      </div>
    </div>
    <hr />
    <!-- Other option -->
    <div class="pt-2 pb-2">
      <div>
        <span
          class="pt-5 text-sm font-bold text-black"
          v-text="$t('chat.setting_others')"
        />
      </div>
      <div class="flex p-2 pb-3 rounded-lg cursor-pointer hover:bg-orange-100">
        <img
          class="w-full pr-3 max-h-40"
          style="max-width: 50px"
          src="~/assets/img/blockedUser.png"
        />

        <div class="flex flex-col justify-center w-full">
          <span class="font-bold" v-text="$t('chat.blockedUser')" />
        </div>
      </div>
      <div class="flex p-2 pb-3 rounded-lg cursor-pointer hover:bg-orange-100">
        <img
          class="w-full pr-3 max-h-40"
          style="max-width: 50px"
          src="~/assets/img/help.png"
        />

        <div class="flex flex-col justify-center w-full">
          <span class="font-bold" v-text="$t('chat.Help')" />
        </div>
      </div>
    </div>
    <template #footer> </template>
  </vs-dialog>
</template>

<script>
export default {
  data() {
    return { active: false };
  },
  methods: {
    open() {
      this.active = true;
    },
    close() {
      this.active = false;
    },
  },
};
</script>
