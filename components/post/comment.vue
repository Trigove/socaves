<!-- eslint-disable vue/no-v-html -->
<template>
  <div
    ref="comment"
    class="flex px-3 justify-center"
    :class="{
      'pointer-events-none opacity-50 transition-opacity duration-300':
        isDeleting || placeholder,
    }"
  >
    <div class="pr-3 sm:text-xs text-xxs">
      <avatar :user="user" class="sm:w-9 sm:h-9 w-6 h-6" circle> </avatar>
    </div>

    <div class="lg:text-sm text-xs" style="width: 90%">
      <!--Content-->
      <div class="bg-bg rounded-xl py-2 px-3 flex flex-col">
        <!--Username-->
        <div class="flex items-center">
          <nuxt-link
            class="font-semibold mr-2"
            :to="`/profile/${user.username}`"
          >
            {{ author }}
          </nuxt-link>

          <!--Autor tag-->
          <div>
            <span
              v-if="user._id === postAuthor._id"
              class="
                bg-orange-500
                font-medium
                text-white
                px-1.5
                rounded-full
                text-[11px]
              "
            >
              {{ $t('comment.author') }}
            </span>
          </div>
        </div>

        <!--For content-->
        <read-more :content="content" class="editor__content mt-1.5" no-shadow>
        </read-more>

        <template v-if="media.length > 0 && !placeholder">
          <annotaion-preview
            v-if="media[0].hasOwnProperty('annotation')"
            :privacy="privacy"
            :coordinates="media[0].annotation.coordinates"
            :image="media[0].annotation.image"
            :src="withQuery(media[0].src, privacy, '')"
          ></annotaion-preview>

          <!--For media-->
          <div v-else-if="media[0].type.includes('image/')" class="mt-3 mb-1">
            <a
              class="outline-none"
              :data-fancybox="id"
              :href="withQuery(media[0].src, privacy, '/tr:w-2000')"
            >
              <div class="aspect-w-16 aspect-h-9 rounded-xl">
                <img
                  v-lazy-load
                  class="
                    object-cover
                    rounded-xl
                    bg-gray-100
                    border-0
                    w-full
                    h-full
                  "
                  :data-srcset="`
                  ${withQuery(media[0].src, privacy, '/tr:w-225')} 225w,
                  ${withQuery(media[0].src, privacy, '/tr:w-300')} 300w,
                  ${withQuery(media[0].src, privacy, '/tr:w-500')} 500w  `"
                  :data-src="withQuery(media[0].src, privacy, '/tr:w-500')"
                  alt=""
                />
              </div>
            </a>
          </div>

          <!--For video-->
          <div
            v-else-if="media[0].type.includes('video/')"
            class="mt-3 mb-1 rounded-xl overflow-hidden"
          >
            <a :data-fancybox="id" :href="withQuery(media[0].src, privacy, '')">
            </a>
            <client-only>
              <plyr>
                <video
                  id="swiper-player"
                  controls
                  playsinline
                  :data-type="media[0].type"
                >
                  <source
                    :src="withQuery(media[0].src, privacy, '')"
                    :type="media[0].type"
                  />
                </video>
              </plyr>
            </client-only>
          </div>
        </template>

        <!--Media place holder-->
        <div
          v-else-if="placeholder && media.length > 0"
          class="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden"
        >
          <div
            class="
              skeleton-loading
              object-cover
              rounded-xl
              block
              bg-gray-200
              h-full
              w-full
            "
          />
        </div>
      </div>

      <!-- Tool section-->
      <div class="text-gray-400 flex text-xs mt-2 tool items-center">
        <span class="ml-2">{{ formatDate(createdAt, true) }}</span>

        <span class="ml-3" v-text="like" />
        <!-- <span class="ml-3">{{ comment }}</span> -->
        <!-- <button class="ml-3 font-semibold" data-test="commentReplyBtn">
          {{ $t('comment.reply') }}
        </button> -->

        <more
          v-if="$auth.loggedIn"
          :parent-id="id"
          :creator-user-id="user._id"
          :delete-title="$t('comment.delete_title')"
          :delete-message="$t('comment.delete_message')"
          :can-delete="!permission.includes(EPermission.NO_DEL_COMMENT)"
          :can-edit="false"
          @onDelete="deleteComment"
        >
          <template v-slot="{ open }">
            <button
              data-test="commentMoreBtn"
              class="ml-3 font-semibold"
              @click="open"
            >
              {{ $t('comment.more') }}
            </button>
          </template>
        </more>

        <button
          class="like-btn ml-auto mr-2"
          :class="{ liked: isLiked }"
          @click="onLike"
        >
          <iconify-icon icon="love" class="text-gray-400 text-sm" />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { formatMixin } from '@/mixins/format';
import annotaionPreview from '@/components/post/annotationPreview';
import linkClickRouting from '@/mixins/linkClickRouting';
import { EPermission, EPrivacy } from '@/server/types/post';
import signUrl from '@/mixins/signUrl';
import more from './more';

/**
 * All events
 * @event onReply fire when reply btn clicked
 * @event onDeleteComplete fire when delete of the comment is complete return comment id
 * @event onVideoTimeClick fire when a video time link is being clicked return fileName + time (in sec)
 */
export default {
  name: 'Comment',
  components: { annotaionPreview, more },
  mixins: [formatMixin, linkClickRouting, signUrl],
  props: {
    //Use it as placeholder?
    placeholder: {
      type: Boolean,
      default: false,
    },
    id: {
      type: String,
      default: '',
    },
    //Author of the post (user obj)
    postAuthor: {
      type: Object,
      default: () => {},
    },
    user: {
      type: Object,
      default: () => {},
    },
    media: {
      type: Array,
      default: () => [],
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    content: {
      type: String,
      required: true,
    },
    updatedAt: {
      type: [Date, String],
      default: () => new Date(),
    },
    createdAt: {
      type: [Date, String],
      default: () => new Date(),
    },
    numComments: {
      type: Number,
      default: 0,
    },
    numLikes: {
      type: Number,
      default: 0,
    },
    numReports: {
      type: Number,
      default: 0,
    },
    numShares: {
      type: Number,
      default: 0,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    //Can the user delete the comemnt
    canDelete: {
      type: Boolean,
      default: true,
    },
    permission: {
      type: Array,
      default: () => [],
    },
    privacy: {
      type: String,
      default: EPrivacy.PUBLIC,
    },
  },
  data() {
    return {
      editable: false,
      editor: null,
      isDeleting: false,
      EPermission,
      videoTime: [],
    };
  },
  computed: {
    author() {
      return this.user.personalInfo.name ?? this.user.username;
    },

    like() {
      const i18n = this.$t('post.like', {
        num: this.formatNumber(this.numLikes),
      });

      return this.formatPlural(i18n, this.numLikes);
    },

    comment() {
      const i18n = this.$t('post.comment', {
        num: this.formatNumber(this.numComments),
      });

      return this.formatPlural(i18n, this.numComments);
    },
  },
  mounted() {
    this.addVideoTimeListeners();
  },

  beforeUnmount() {
    this.removeVideoTimeListeners();
  },

  updated() {
    this.removeVideoTimeListeners();
    this.$nextTick(() => {
      this.addVideoTimeListeners();
    });
  },

  methods: {
    reply() {
      this.$emit('onReply');
    },

    //Detect all <a data-video-time> </a> element and add event listner to it
    addVideoTimeListeners() {
      this.videoTime = this.$el.querySelectorAll('a[data-video-time]');
      for (let i = 0; i < this.videoTime.length; i++) {
        this.videoTime[i].addEventListener(
          'click',
          this.onVideoTimeClick,
          false
        );
      }
    },

    removeVideoTimeListeners() {
      for (let i = 0; i < this.videoTime.length; i++) {
        this.videoTime[i].removeEventListener(
          'click',
          this.onVideoTimeClick,
          false
        );
      }
      this.videoTime = [];
    },

    //Handel video time being click
    onVideoTimeClick(e) {
      const el = e.srcElement;
      const time = el.getAttribute('data-time'); //In sec
      const fileName = el.getAttribute('data-id');
      this.$emit('onVideoTimeClick', { time, fileName });
    },

    async deleteComment() {
      try {
        this.isDeleting = true;

        await this.$axios.delete(`/posts/${this.id}`);

        this.$el.style.opacity = 0;

        // Remove itself
        setTimeout(() => {
          this.$emit('onDeleteComplete', this.id);
          this.$destroy();
          this.$el.parentNode.removeChild(this.$el);
        }, 600);
      } catch (err) {
        console.log(err);
        this.isDeleting = false;
      }
    },

    async onLike() {
      if (this.$auth.loggedIn) {
        //isLiked = !isLiked
        // console.log(EPost.POST);
        const param = {
          parentID: this.id,
          type: 'COMMENT',
        };

        if (!this.isLiked) {
          try {
            this.$emit('onLike', this.id);

            await this.$axios.put('posts/likes', param);
          } catch (error) {
            console.log(error);
            //TODO: Error handel
            this.$emit('onUnlike', this.id);
          }
        } else {
          try {
            this.$emit('onUnlike', this.id);

            await this.$axios.put('posts/likes', param);
          } catch (error) {
            console.log(error);
            this.$emit('onLike', this.id);
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tool button {
  background-color: transparent;
  border: none;
  outline: none;
}

button:disabled {
  opacity: 0.4;
  pointer-events: none;
}

::v-deep .plyr {
  @apply rounded-xl;
  overflow: hidden;
}

::v-deep .cropper-background {
  background: none;
}

::v-deep .icon-marker {
  width: 0.8em;
}

::v-deep .vue-advanced-cropper__background {
  background: transparent !important;
}
</style>
