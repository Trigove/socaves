<template>
  <vs-avatar
    v-bind="attrs"
    :style="cssVars"
    :role="isGuest ? '' : 'button'"
    @click="
      isGuest || noClick ? () => {} : $router.push(`/profile/${user.username}`)
    "
  >
    <!--For smart perfetch-->
    <nuxt-link
      v-if="!isGuest && !noClick"
      ref="profile"
      class="hidden"
      :to="`/profile/${user.username}`"
    ></nuxt-link>

    <template v-if="!avatar">
      {{ name }}
    </template>

    <!--For close frd-->
    <template v-if="isClose" #badge>
      <span> ▲ </span>
    </template>

    <img v-if="avatar" :src="avatar" alt="" />
  </vs-avatar>
</template>

<script>
import colors from 'tailwindcss/colors';

export default {
  inheritAttrs: false,
  props: {
    //Click to profile or not
    noClick: {
      type: Boolean,
      default: false,
    },
    isClose: {
      type: Boolean,
      default: false,
    },
    user: {
      type: [Object, Boolean],
      default: () => {
        return {
          username: 'guest',
          personalInfo: {
            name: 'Guest',
          },
        };
      },
    },
  },
  data() {
    return {
      myUser: {},
      isGuest: true,
    };
  },
  computed: {
    avatar() {
      const avatar = this.myUser?.avatar ?? false;
      return avatar;
    },
    attrs() {
      const attrs = this.$attrs;
      attrs.color = this.color;

      if (this.isClose) {
        attrs.badge = true;
      }
      return attrs;
    },
    name() {
      return this.shortenName(
        this.myUser.personalInfo?.name ??
          this.myUser.username ??
          this.myUser.author
      );
    },
    cssVars() {
      return {
        '--bg-color': this.hexToRgb(
          this.alphabetToColor(this.myUser?.username?.charAt(0) ?? 'GT')
        ),
      };
    },
  },
  watch: {
    user: {
      handler() {
        this.myUser = this.user;
        if (!this.myUser) {
          this.myUser = {
            username: '#guest',
            personalInfo: {
              name: 'Guest',
            },
          };
        } else {
          this.isGuest = false;
        }
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    alphabetToColor(alphabet) {
      if (alphabet) alphabet = alphabet.toLowerCase();
      if (this.myUser.username === '#guest') return colors.orange[500];
      if (/(.*[a-b0].*)/.test(alphabet)) return colors.teal[500];
      if (/(.*[c-d1].*)/.test(alphabet)) return colors.indigo[500];
      if (/(.*[e-f2].*)/.test(alphabet)) return colors.cyan[500];
      if (/(.*[g-h3].*)/.test(alphabet)) return colors.purple[500];
      if (/(.*[i-j4].*)/.test(alphabet)) return colors.pink[500];
      if (/(.*[k-l5].*)/.test(alphabet)) return colors.rose[500];
      if (/(.*[m-n6].*)/.test(alphabet)) return colors.violet[500];
      if (/(.*[o-p7].*)/.test(alphabet)) return colors.lightBlue[500];
      if (/(.*[q-r8].*)/.test(alphabet)) return colors.blue[500];
      if (/(.*[s-t9].*)/.test(alphabet)) return colors.orange[500];
      if (/(.*[v-w].*)/.test(alphabet)) return colors.lime[500];
      if (/(.*[x-y].*)/.test(alphabet)) return colors.amber[500];
      return colors.emerald[500];
    },

    hexToRgb(hex = '') {
      hex = hex.replace('#', '');
      const bigint = parseInt(hex, 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = bigint & 255;
      return r + ',' + g + ',' + b;
    },

    //Turn long name into two words
    shortenName(name = '') {
      const chi = new RegExp('^[\u4E00-\uFA29]*$'); //Chinese character range
      const eng = new RegExp('^[\uE7C7-\uE7F3]*$'); //non Chinese character range
      let first = '';
      let last = '';

      name = name.trim().toUpperCase();

      if (!chi.test(name) || eng.test(name)) {
        if ((name.match(/ /g) || []).length === 1) {
          first = name.slice(0, 1);
          last = name.slice(name.indexOf(' ') + 1, name.indexOf(' ') + 2);
          return first + last;
        }

        if ((name.match(/ /g) || []).length > 1) {
          first = name.slice(0, 1);
          last = name.slice(
            name.lastIndexOf(' ') + 1,
            name.lastIndexOf(' ') + 2
          );
          return first + last;
        }

        if (name.length > 1) {
          first = name.slice(0, 1);
          last = name.slice(name.length - 1, name.length);
          return first + last;
        }

        return name;
      }

      return name.replace(/\s/g, '').slice(name.length - 2, name.length);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .vs-avatar {
  background-color: rgba(var(--bg-color), 0.2) !important;
  color: rgb(var(--bg-color)) !important;
  font-weight: 600;
  border: solid 0.1px #e1e1e1;

  &__badge.isSlot {
    @apply rounded-full;
    padding: 0.25px 3px;
  }
}
</style>
