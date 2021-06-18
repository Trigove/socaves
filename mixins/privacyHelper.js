import { EPrivacy } from '@/server/types/post';

export default {
  methods: {
    //Translate privacy enums to name
    privacyToName(val) {
      return this.$t(`privacy.${val}`);
    },
    //Translate privacy enums to icons name
    privacyToIcon(val) {
      if (EPrivacy.PUBLIC === val) return 'public';
      if (EPrivacy.FRIENDS === val) return 'friends';
      if (EPrivacy.PRIVATE === val) return 'private';
      if (EPrivacy.CUSTOM === val) return 'friendList';
    },
  },
};
