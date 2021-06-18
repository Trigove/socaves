<template>
  <div>
    <div class="flex justify-between pb-1">
      <div class="flex items-center">
        <!--BAck button-->
        <vs-button
          class="block text-2xl lg:hidden"
          transparent
          icon
          :color="$color.gray[100]"
          @click="$emit('onBack')"
        >
          <iconify-icon icon="chevronLeft" class="text-gray-400" />
        </vs-button>

        <div>
          <avatar :user="user" size="40" badge-color="success" circle badge>
          </avatar>
        </div>

        <div class="flex flex-col pl-3">
          <span class="text-sm font-bold">{{ user.username }}</span>
          <p class="text-xs font-bold text-gray-500">{{ $t('chat.Online') }}</p>
        </div>
      </div>

      <div class="flex">
        <vs-button class="text-xl" transparent icon :color="$color.gray[100]">
          <iconify-icon icon="phoneCall" class="text-gray-400" />
        </vs-button>

        <vs-button class="text-xl" transparent icon :color="$color.gray[100]">
          <iconify-icon icon="video" class="text-gray-400" />
        </vs-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {},
    },
  },
};
</script>
