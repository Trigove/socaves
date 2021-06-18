<template>
  <div>
    <vs-dialog v-model="activeDelDialog" width="350px">
      <template #header>
        <dialog-header @onClose="activeDelDialog = false">
          {{ deleteTitle }}
        </dialog-header>
      </template>

      <div>
        <p>{{ deleteMessage }}</p>
      </div>

      <template #footer>
        <div class="flex">
          <vs-button
            class="ml-auto font-medium text-sm"
            data-test="deletePost-btn"
            transparent
            danger
            @click="onDelete"
          >
            {{ $t('post.delete') }}
          </vs-button>

          <vs-button
            class="font-medium text-sm text-gray-500"
            transparent
            dark
            @click="activeDelDialog = false"
          >
            {{ $t('post.cancel') }}
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <vs-dialog v-model="activeCopyLink" width="350px">
      <template #header>
        <dialog-header @onClose="activeCopyLink = false">
          {{ $t('post.copy_link') }}
        </dialog-header>
      </template>

      <div class="overflow-hidden">
        <vs-input
          ref="urlInput"
          v-model="url"
          class="text-sm"
          placeholder="URL"
        />
      </div>

      <template #footer>
        <div class="flex">
          <vs-button
            class="ml-auto font-medium text-sm text-gray-500"
            transparent
            dark
            @click="activeCopyLink = false"
          >
            {{ $t('post.cancel') }}
          </vs-button>

          <vs-button
            class="font-medium text-sm text-orange-500"
            transparent
            dark
            @click="copyLink"
          >
            {{ $t('post.copy') }}
          </vs-button>
        </div>
      </template>
    </vs-dialog>

    <!--More-->
    <vs-tooltip v-model="active" class="ml-auto" right shadow not-hover>
      <!--More Button slot-->
      <slot :open="open"></slot>

      <template #tooltip>
        <div class="px-2">
          <vs-button
            v-if="parentId"
            class="text-sm font-medium btn-p-0 text-black"
            :class="{ 'mb-3': $auth.loggedIn }"
            transparent
            @click="openCopyLink"
          >
            <div class="mr-1.5">
              <iconify-icon icon="link" class="text-xl" />
            </div>
            {{ $t('post.copy_link') }}
          </vs-button>

          <template v-if="$auth.loggedIn">
            <vs-button
              v-if="$auth.$state.user._id == creatorUserId && canEdit"
              class="text-sm font-medium btn-p-0 text-black mb-3"
              transparent
              @click="onEdit"
            >
              <div class="mr-2">
                <iconify-icon icon="edit" class="text-lg" />
              </div>
              {{ $t('post.edit') }}
            </vs-button>

            <vs-button
              class="text-sm font-medium btn-p-0"
              transparent
              @click="onReport"
            >
              <div class="mr-2">
                <iconify-icon icon="flag" class="text-lg" />
              </div>
              {{ $t('post.report') }}
            </vs-button>

            <vs-button
              v-if="$auth.$state.user._id == creatorUserId && canDelete"
              class="text-sm font-medium btn-p-0 mt-3"
              data-test="delete-Btn"
              danger
              transparent
              @click="openDelete"
            >
              <div class="mr-2">
                <iconify-icon
                  icon="trash"
                  style="width: 1.2em"
                  class="text-red-500 text-base"
                />
              </div>
              {{ $t('post.delete') }}
            </vs-button>
          </template>
        </div>
      </template>
    </vs-tooltip>
  </div>
</template>

<script>
/**
 * All events
 * @event onDelete Delete btn being clicked
 * @event onEdit Edit btn being clicked
 * @event onReport Report btn being clicked
 */

export default {
  name: 'More',
  props: {
    //The user id of the post creator
    creatorUserId: {
      type: String,
      required: true,
    },

    deleteTitle: {
      type: String,
      required: true,
    },

    deleteMessage: {
      type: String,
      required: true,
    },

    parentId: {
      type: String,
      default: '',
    },

    //Show delete button or not
    canDelete: {
      type: Boolean,
      default: true,
    },

    //Show edit button or not
    canEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      active: false,
      activeCopyLink: false,
      activeDelDialog: false,
      url: '',
    };
  },
  mounted() {
    this.url = `${window.location.protocol}//${window.location.host}/post/${this.parentId}`;
  },
  methods: {
    onDelete() {
      this.$emit('onDelete');
      this.activeDelDialog = false;
    },

    onEdit() {
      this.active = false;
      this.$emit('onEdit');
    },

    openDelete() {
      this.active = false;
      this.activeDelDialog = true;
    },

    async onReport() {
      try {
        this.active = false;

        this.$emit('onReport');

        await this.$axios.post('/reports', {
          parentID: this.parentId,
          userID: this.creatorUserId,
        });

        this.$vs.notification({
          duration: 2500,
          color: this.$color.orange[500],
          position: 'bottom-right',
          title: this.$t('info'),
          text: this.$t('post.reported'),
        });
      } catch (e) {
        this.$vs.notification({
          duration: 2500,
          color: this.$color.orange[500],
          position: 'bottom-right',
          title: this.$t('info'),
          text: this.$t('error'),
        });
      }
    },

    open() {
      this.active = true;
    },

    openCopyLink() {
      this.active = false;
      this.activeCopyLink = true;
    },

    copyLink() {
      if (this.$refs.urlInput) {
        const el = this.$refs.urlInput.$el.querySelector('input');
        el.select();
        el.setSelectionRange(0, 99999); //For mobile devices
        document.execCommand('copy');
        this.activeCopyLink = false;
      }
    },

    async onShare() {
      try {
        if (navigator.share) {
          await navigator.share({
            title: 'Socaves',
            url: `${window.location.protocol}//${window.location.host}/post/${this.id}`,
          });
        }
      } catch (error) {}
    },
  },
};
</script>
