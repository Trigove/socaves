<template>
  <div
    class="bg-white w-full"
    :class="{
      'pointer-events-none opacity-50 transition-opacity duration-300':
        isDeleting || placeholder,
      'sm:shadow-base sm:rounded-2xl sm:max-w-lg py-3': !previewOnly,
      'border-gray-200 border rounded-2xl mx-2 py-1.5': previewOnly,
    }"
  >
    <!--Header if preview it would be a nuxt link that portal to the post-->
    <div
      class="flex items-center px-3"
      :class="{
        'text-xs pt-1': previewOnly,
        '-mb-2': previewOnly && content.length > 0 && media.length <= 0,
      }"
      :role="previewOnly ? 'button' : ''"
      @click="previewOnly ? toPost() : () => {}"
    >
      <div :class="previewOnly ? 'mr-2' : 'mr-3'">
        <avatar :user="user" :size="previewOnly ? '30' : '40'" circle> </avatar>
      </div>

      <!--Title-->
      <div class="flex flex-col">
        <!--Name and badge-->
        <div class="flex items-center">
          <nuxt-link
            class="font-semibold"
            :class="{
              'text-[13px]': previewOnly,
              'text-sm ': !previewOnly,
            }"
            :to="`/profile/${user.username}`"
          >
            {{ author }}
          </nuxt-link>

          <!--Verified badge-->
          <iconify-icon
            v-if="user.isVerified"
            class="ml-1 text-xs text-orange-500"
            icon="verified"
          />
        </div>

        <!--Post date-->
        <div class="flex items-center text-gray-400">
          <span
            ref="date"
            :class="{ 'text-[11px]': previewOnly }"
            class="text-xs mr-1.5"
          >
            {{ formatDate(createdAt, true) }}
          </span>

          <!--Permission and privacy badge-->
          <div class="flex items-center">
            <iconify-icon
              ref="privacyBadge"
              :icon="privacyToIcon(privacy)"
              :class="[
                {
                  'text-orange-500': privacy === EPrivacy.CUSTOM,
                },
                'text-[10px] outline-none',
              ]"
            />

            <!--Permission badge-->
            <iconify-icon
              v-if="permission.length > 0"
              ref="permissionBadge"
              icon="shieldQuarter"
              class="text-[11.5px] ml-1 outline-none"
            />

            <!--Is edited-->
            <span
              v-if="authorUpdatedAt > createdAt && !placeholder"
              ref="edited"
              class="text-[11px] ml-1.5"
            >
              {{ $t('post.edited') }}
            </span>
          </div>
        </div>
      </div>

      <more
        v-if="!previewOnly"
        :creator-user-id="user._id"
        :parent-id="id"
        class="ml-auto"
        :delete-title="$t('post.delete_title')"
        :delete-message="$t('post.delete_message')"
        @onDelete="deletePost"
        @onEdit="editPost"
      >
        <template v-slot="{ open }">
          <vs-button
            icon
            transparent
            :color="$color.gray[500]"
            aria-label="more"
            @click="open"
          >
            <iconify-icon class="text-xl" icon="more" />
          </vs-button>
        </template>
      </more>
    </div>

    <!--Content-->
    <post-content
      :id="id"
      ref="postContent"
      :preview-only="previewOnly"
      :media="media"
      :type="type"
      :content="content"
      :placeholder="placeholder"
      :privacy="privacy"
      :shared-post="sharedPost"
      class="mt-3"
    >
      <template v-if="!previewOnly" #control>
        <div class="pr-3" :class="media.length < 2 ? 'mt-3' : 'mt-2'">
          <!--Post stat-->
          <div
            class="text-gray-400 flex text-xs px-3"
            data-test="likeCommentBar"
          >
            <span v-text="like" />
            <span
              role="button"
              class="ml-3 hover:underline"
              @click="openComment"
              v-text="comment"
            />
            <span class="ml-auto" v-text="share" />
          </div>

          <div class="flex mt-2 px-2">
            <!--Love button-->
            <vs-button
              class="bg-gray-100 h-9 w-9 like-btn"
              :class="{ liked: myIsLiked }"
              data-test="likeBtn"
              flat
              circle
              icon
              aria-label="Like"
              :disabled="permission.includes(EPermission.NO_LIKE)"
              :color="$color.gray[100]"
              :data-tippy-guest="!$auth.loggedIn"
              @click="onLike"
            >
              <iconify-icon icon="love" class="text-gray-400 text-base" />
            </vs-button>

            <!--Comment button-->
            <vs-button
              :disabled="permission.includes(EPermission.NO_COMMENT)"
              class="bg-gray-100 h-9 w-9 text-base"
              data-test="commentBtn"
              flat
              circle
              icon
              aria-label="Comment"
              :color="$color.gray[100]"
              @click="openComment"
            >
              <iconify-icon icon="comment" class="text-gray-400" />
            </vs-button>

            <!--Annotation button **disable for gif**-->
            <vs-button
              v-if="media.length > 0"
              :disabled="
                activeMedia.type.includes('gif') ||
                permission.includes(EPermission.NO_ANNOTATION) ||
                permission.includes(EPermission.NO_COMMENT)
              "
              class="bg-gray-100 h-9 w-9"
              flat
              circle
              icon
              aria-label="Annotation"
              :color="$color.gray[100]"
              :data-tippy-guest="!$auth.loggedIn"
              @click="annotation"
            >
              <iconify-icon icon="annotation" class="text-gray-400 text-xl" />
            </vs-button>

            <!--Share button-->
            <share class="ml-auto" :parent-id="id" @onRepost="onRepost">
              <template v-slot="{ open }">
                <vs-button
                  class="bg-gray-100 h-9 w-9 ml-auto"
                  data-test="ShareBtn"
                  flat
                  circle
                  icon
                  aria-label="Share"
                  :disabled="permission.includes(EPermission.NO_SHARE)"
                  :color="$color.gray[100]"
                  @click="open"
                >
                  <iconify-icon icon="share" class="text-gray-400 text-base" />
                </vs-button>
              </template>
            </share>
          </div>
        </div>
      </template>
    </post-content>

    <comment-dialog
      v-if="!previewOnly && !permission.includes(EPermission.NO_COMMENT)"
      ref="commentDialog"
      :post-author="user"
      :parent-id="id"
    >
      <transition-group
        :key="commentComponentKey"
        name="fade"
        class="w-full px-2"
        tag="div"
      >
        <comment
          v-for="item in myComments"
          :id="item._id"
          :key="item._id"
          :post-author="user"
          :content="item.content"
          :media="item.media"
          :user="item.user"
          :liked-users="item.likedUsers"
          :updated-at="item.updatedAt"
          :created-at="item.createdAt"
          :num-comments="item.numComments"
          :num-likes="item.numLikes"
          :num-reports="item.numReports"
          :num-shares="item.numShares"
          :num-views="item.numViews"
          :comments="item.comments"
          :placeholder="item.placeholder"
          :permission="permission"
          :privacy="privacy"
          :is-liked="item.isLiked"
          class="my-3"
          @onUnlike="onCommentUnlike"
          @onLike="onCommentLike"
          @onDeleteComplete="onCommentDeleteComplete"
          @onVideoTimeClick="onVideoTimeClick"
        ></comment>
      </transition-group>
    </comment-dialog>

    <comment-creator
      v-if="!previewOnly && $auth.loggedIn"
      ref="commentCreator"
      :disabled="permission.includes(EPermission.NO_COMMENT)"
      class="px-3 mt-4"
      @onComment="onComment"
    ></comment-creator>

    <annotation-dialog
      ref="annotationDialog"
      :permission="permission"
      @onPost="onAnnotationPost"
    ></annotation-dialog>
  </div>
</template>

<script>
import { formatMixin } from '@/mixins/format';
import commentCreator from '@/components/commentCreator/index';
import privacyHelper from '@/mixins/privacyHelper';
import { nanoid } from 'nanoid';
import { EPost, EPrivacy, EPermission } from '@/server/types/post';
import postContent from './content';
import commentDialog from './commnetDialog';
import annotationDialog from './annotationDialog';
import more from './more';
import share from './share';
import comment from './comment';

/**
 * All events
 * @event onDeleteComplete fire when delete of the post complete return comment id
 */

export default {
  name: 'Post',
  components: {
    postContent,
    commentCreator,
    commentDialog,
    annotationDialog,
    more,
    share,
    comment,
  },
  mixins: [privacyHelper, formatMixin],
  props: {
    id: {
      type: String,
      default: '',
    },
    //Use it as placeholder? (Non clickable low opacity)
    placeholder: {
      type: Boolean,
      default: false,
    },
    //Use it as sahred post preview? For shared post recursive
    previewOnly: {
      type: Boolean,
      default: false,
    },
    media: {
      type: Array,
      default: () => [],
    },
    user: {
      type: Object,
      default: () => {
        return {
          _id: 'old_data_id',
          username: 'old_data',
          personalInfo: {
            name: 'old_data',
          },
        };
      },
    },
    likedUsers: {
      type: Array,
      default: () => [],
    },
    content: {
      type: String,
      default: '',
    },
    updatedAt: {
      type: [String, Date],
      default: () => new Date(),
    },
    authorUpdatedAt: {
      type: [String, Date],
      default: () => new Date(),
    },
    createdAt: {
      type: [String, Date],
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
    comments: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: EPost.POST,
    },
    //This is share post object
    sharedPost: {
      type: Object,
      default: () => {},
    },
    privacy: {
      type: String,
      default: EPrivacy.PUBLIC,
    },
    permission: {
      type: Array,
      default: () => [],
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      EPermission,
      EPrivacy,
      dateTippy: null,
      permissionTippy: null,
      privacyTippy: null,
      isDeleting: false,
      myNumComments: 0,
      myNumLikes: 0,
      myIsLiked: false,
      commentComponentKey: 0, //For force update
      isCommentsLoaded: false,
      myComments: [], //Copy of comments for fixing props mutauion problem
      //Swiper active media would be handel in content.vue
      activeMedia: {
        src: '',
        el: null,
        type: '',
        // isLoaded: true,
      },
      tippyOptions: {
        theme: 'date-tippy',
        placement: 'bottom',
        arrow: false,
        touch: 'hold',
      },
    };
  },
  computed: {
    author() {
      return this.user?.username ?? this.user?.personalInfo.name ?? 'Old data';
    },

    like() {
      const i18n = this.$t('post.like', {
        num: this.formatNumber(this.myNumLikes),
      });

      return this.formatPlural(i18n, this.myNumLikes);
    },

    comment() {
      const i18n = this.$t('post.comment', {
        num: this.formatNumber(this.myNumComments),
      });

      return this.formatPlural(i18n, this.myNumComments);
    },

    share() {
      const i18n = this.$t('post.share', {
        num: this.formatNumber(this.numShares),
      });

      return this.formatPlural(i18n, this.numShares);
    },
  },
  created() {
    this.myNumLikes = this.numLikes;
    this.myNumComments = this.numComments;
    this.myComments = this.comments;

    //Check if the user liked the post before
    this.myIsLiked = this.isLiked;
  },
  mounted() {
    this.dateTippy = this.$tippy(this.$refs.date, {
      content: new Date(this.createdAt).toString().replace(/GMT.*/g, ''),
      ...this.tippyOptions,
    });

    if (this.$refs.permissionBadge) {
      this.permissionTippy = this.$tippy(this.$refs.permissionBadge, {
        content: this.$t('permission.info'),
        ...this.tippyOptions,
      });
    }

    if (this.$refs.privacyBadge) {
      this.privacyTippy = this.$tippy(this.$refs.privacyBadge, {
        content: this.$t(`privacy.${this.privacy}`),
        ...this.tippyOptions,
      });
    }

    if (this.$refs.edited) {
      this.permissionTippy = this.$tippy(this.$refs.edited, {
        content: new Date(this.updatedAt).toString().replace(/GMT.*/g, ''),
        ...this.tippyOptions,
      });
    }
  },
  methods: {
    // onContentMount() {
    //   this.isLoading = false;
    // },
    //Handel user edit post
    editPost() {
      const editObj = { _id: this.id, ...this.$props };
      this.$store.commit('postCreator/openEdit', editObj);
    },

    //Bring user to post link
    toPost() {
      this.$router.push(`/post/${this.id}`);
    },

    onComment({ getHTML, getFiles }) {
      this.postComment(getHTML(), getFiles());
      this.$refs.commentCreator.reset();
      this.openComment();
    },

    onAnnotationPost({ getHTML, getAnnotaion }) {
      this.postComment(getHTML(), getAnnotaion(), true);
      this.$refs.annotationDialog.close();
      this.openComment();
    },

    //On user clicked repost button
    onRepost() {
      let repostId = '';
      let repostObj = {};

      //If it is a shared post already we need to share the inner post instead of parent post
      if (this.type === EPost.SHARE) {
        repostId = this.sharedPost._id;
        repostObj = this.sharedPost;
      } else {
        repostId = this.id;
        repostObj = this.$props;
      }

      repostObj = { _id: repostId, parentPrivacy: this.privacy, ...repostObj };

      this.$store.commit('postCreator/openShare', repostObj);
    },

    async postComment(content = '', files = [], annotaion = false) {
      const tmpId = nanoid();

      try {
        console.log('postComment files', files);

        this.myComments.unshift({
          _id: tmpId,
          user: this.$auth.user,
          content,
          media: files,
          placeholder: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        this.isDisabled = true;

        const formData = new FormData();

        const Post = {
          user: this.$auth.user._id,
          content,
          tags: null,
          privacy: this.privacy,
          parentID: this.id, //Post id
          type: EPost.COMMENT,
        };

        if (annotaion) {
          Post.media = files;
        }

        const cleanPost = Object.fromEntries(
          Object.entries(Post).filter(([_, v]) => v != null)
        );

        formData.append('post', JSON.stringify(cleanPost));

        if (!annotaion) {
          files.map((file) => {
            console.log('files.map((file) =>', file);
            formData.append('media', file);
          });
        }

        let res = await this.$axios.put('posts', formData);

        for (const pair of formData.entries()) {
          console.log(pair[0] + ', ' + pair[1]);
        }

        res = res.data.newPost;
        res.user = this.$auth.user;
        delete res.content;

        //Update placeholder element, replace it with new data
        this.myComments.map((item, i) => {
          if (item._id === tmpId) {
            this.myComments[i] = { ...res, content, placeholder: false };
          }
        });

        this.myNumComments += 1;

        this.forceRerenderComment();
      } catch (err) {
        //Remove the placeholder error occur
        this.myComments = this.myComments.filter((item) => item._id !== tmpId);
        this.forceRerenderComment();
        console.log(err);
      }
    },

    //Force rerender comments
    forceRerenderComment() {
      this.commentComponentKey += 1;
    },

    //Handel after comment succefully deleted
    onCommentDeleteComplete(id) {
      console.log('Comment del:', id);
      //Remove it from array after delete
      this.myComments = this.myComments.filter((item) => item._id !== id);
      this.myNumComments -= 1;
    },

    //Handel when video time link being click
    onVideoTimeClick({ time, fileName }) {
      //Close the comment dialog
      this.$refs.commentDialog?.close();
      this.$refs.postContent?.navigateToVideo(fileName, time);
    },

    //Handel comment liked
    onCommentLike(id) {
      if (this.$auth.loggedIn) {
        console.log('onCommentLike', id);
        this.myComments.map((item, i) => {
          if (item._id === id) {
            console.log(item);
            item = this.myComments[i];
            console.log(item);
            item.numLikes += 1;
            item.isLiked = true;
          }
        });
        return;
      }

      return this.$router.push('/login');
    },

    //Handel comment unlike
    //TODO: Wait for grace
    onCommentUnlike(id) {
      console.log('onCommentUnlike', id);

      if (this.$auth.loggedIn) {
        this.myComments.map((item, i) => {
          if (item._id === id) {
            console.log(item);
            item = this.myComments[i];
            item.numLikes -= 1;
            item.isLiked = false;
          }
        });
        return;
      }

      return this.$router.push('/login');
    },

    async onLike() {
      if (this.$auth.loggedIn) {
        const param = {
          parentID: this.id,
        };

        if (!this.myIsLiked) {
          try {
            this.myIsLiked = true;
            this.myNumLikes += 1;

            await this.$axios.put('posts/likes', param);
          } catch (error) {
            //TODO: Error handel
            this.myIsLiked = false;
            this.myNumLikes -= 1;
          }
        } else {
          try {
            this.myIsLiked = false;
            this.myNumLikes -= 1;

            await this.$axios.put('posts/likes', param);
          } catch (error) {
            this.myIsLiked = true;
            this.myNumLikes += 1;
          }
        }

        return;
      }

      return this.$router.push('/login');
    },

    async deletePost() {
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

    //open comment dialog
    async openComment() {
      try {
        if (!this.permission.includes(EPermission.NO_COMMENT)) {
          this.$refs.commentDialog.open();

          //Fetch comment if not loaded
          if (!this.isCommentsLoaded && this.myNumComments > 0) {
            this.$refs.commentDialog.isLoading = true;

            console.log('Get comment');

            let res = await this.$axios(`/posts/${this.id}/comments`);
            this.isCommentsLoaded = true;
            this.$refs.commentDialog.isLoading = false;
            res = res.data;

            res.map((item) => this.myComments.push(item));

            this.myComments = this.myComments.filter(
              (v, i, a) => a.findIndex((t) => t._id === v._id) === i
            ); //Remove duplicate

            this.forceRerenderComment();
            console.log('com', this.myComments);
          } else {
            this.$refs.commentDialog.isLoading = false;
          }
        }
      } catch (e) {
        console.log(e);
        this.$refs.commentDialog.isLoading = false;
      }
    },

    annotation() {
      if (this.$auth.loggedIn) {
        const type = this.activeMedia.type;

        //Add video time tag to comment section
        if (type.includes('video/')) {
          const video = this.activeMedia.el;

          console.log(video.id, video.currentTime);

          this.$refs.commentCreator.addVideoTimeTag(
            video.id,
            video.currentTime
          );
        }

        if (type.includes('image/')) {
          const cleanUrl = (url) => {
            return url.replace(/#.*$/, '').replace(/\?.*$/, '');
          };

          let src = '';
          let fileName = '';

          this.media.map((item) => {
            // console.log(item.src, this.activeMedia.src);
            if (cleanUrl(item.src) === cleanUrl(this.activeMedia.src)) {
              src = item.src;
              fileName = item.fileName;
            }
          });

          this.$refs.annotationDialog.open({
            parentID: this.id,
            fileName,
            privacy: this.privacy,
            src,
            type: this.activeMedia.type,
          });
        }
        return;
      }

      return this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .like-btn {
  transition: none !important;

  .vs-ripple-content {
    display: none !important;
  }

  &.liked {
    &.vs-button {
      background-color: var(--color-orange-50) !important;
    }

    svg {
      animation: 0.25s linear bounce;

      path {
        fill: var(--color-orange-500);
        stroke: initial;
        stroke-width: initial;
      }
    }
  }

  svg {
    // transition: 0.3s;
    // transform: scale(1) rotate(0deg);
    transition: all ease-in-out;
    path {
      fill: transparent;
      stroke: #aaaaaa;
      stroke-width: 2px;
    }
  }
}

@keyframes bounce {
  10% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }

  100% {
    transform: scale(1);
  }
}
</style>
