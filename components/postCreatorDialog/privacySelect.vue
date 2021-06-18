<template>
  <vs-tooltip v-model="active" top shadow not-hover>
    <!--Button-->
    <vs-button class="text-gray-400" transparent @click="active = !active">
      <iconify-icon
        :icon="privacyToIcon(privacy)"
        class="sm:text-base text-[15px] mr-1"
      />
      {{ privacyToName(privacy) }}
    </vs-button>

    <template #tooltip>
      <div class="max-w-full w-35 pa-3 m-3 flex flex-col justify-start">
        <vs-radio
          v-for="(val, i) in privacySelect"
          :key="i"
          v-model="privacy"
          :val="val"
          class="mr-auto"
          :class="{ 'mt-4': i !== 0 }"
        >
          <div class="flex items-center">
            <iconify-icon
              :icon="privacyToIcon(val)"
              class="text-xl text-gray-400"
            />
            <span class="ml-2 text-gray-500" v-text="privacyToName(val)" />
          </div>
        </vs-radio>
      </div>
    </template>
  </vs-tooltip>
</template>

<script>
/**
 * Privacy selector
 * @event onChange fire when privacy changed
 */

import { EPrivacy } from '@/server/types/post';
import privacyHelper from '@/mixins/privacyHelper';

export default {
  mixins: [privacyHelper],
  data() {
    return {
      active: false,
      privacy: EPrivacy.PUBLIC,
      privacySelect: Object.values(EPrivacy),
    };
  },
  watch: {
    privacy(val) {
      this.$emit('onChange', val);
    },
  },
};
</script>
