<template>
  <vs-tooltip v-model="active" top shadow not-hover>
    <!--Button-->
    <vs-button
      :class="{ 'text-gray-400': permission.length <= 0 }"
      transparent
      @click="active = !active"
    >
      <iconify-icon icon="shieldQuarter" class="sm:text-xl text-lg mr-0.5" />
      {{
        permission.length > 0
          ? $t('permission.selected', { num: permission.length })
          : $t('permission.title')
      }}
    </vs-button>

    <template #tooltip>
      <div class="p-1.5">
        <div v-for="(val, i) in permissionSelect" :key="i">
          <vs-checkbox v-model="permission" :val="val">
            <div class="flex items-center">
              <span
                class="ml-2 text-gray-500 text-sm"
                v-text="$t(`permission.${val}`)"
              />
            </div>
          </vs-checkbox>
        </div>
      </div>
    </template>
  </vs-tooltip>
</template>

<script>
/**
 * permission selector
 * @event onChange fire when permission changed
 */

import { EPermission } from '@/server/types/post';

export default {
  data() {
    return {
      active: false,
      permission: [],
      permissionSelect: Object.values(EPermission),
    };
  },
  watch: {
    permission(val) {
      this.$emit('onChange', val);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .vs-icon-check span .line1 {
  transform: translate(-3px, 1px);
}
</style>
