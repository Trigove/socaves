<template>
  <div class="flex justify-center w-full sm:p-8">
    <pull-to-refresh @onRefresh="fetchPosts(true)"></pull-to-refresh>

    <!--Posts section-->
    <div class="flex items-center flex-col w-full sm:max-w-lg">
      <post-creator-placeholder></post-creator-placeholder>

      <post-creator-dialog
        ref="postCreator"
        @onPost="onPost"
        @onPostEdited="onPostEdited"
      ></post-creator-dialog>

      <loading-spinner v-if="!isMounted" class="mt-6"></loading-spinner>

      <client-only>
        <transition-group
          :key="componentKey"
          name="fade"
          tag="div"
          class="flex items-center flex-col w-full"
        >
          <post
            v-for="item in posts"
            :id="item._id"
            :key="item._id"
            :type="item.type"
            :content="item.content"
            :media="item.media"
            :user="item.user"
            :liked-users="item.likedUsers"
            :updated-at="item.updatedAt"
            :author-updated-at="item.authorUpdatedAt"
            :created-at="item.createdAt"
            :num-comments="item.numComments"
            :num-likes="item.numLikes"
            :num-reports="item.numReports"
            :num-shares="item.numShares"
            :num-views="item.numViews"
            :comments="item.comments"
            :privacy="item.privacy"
            :permission="item.permission"
            :shared-post="item.parentID"
            :placeholder="item.placeholder"
            :is-liked="item.isLiked"
            class="mt-5"
            @onDeleteComplete="onPostDeleteComplete"
          />
        </transition-group>

        <infinite-scroll
          loading-class="my-5"
          :is-loading="isPostLoading"
          @isIntersecting="isIntersecting"
        ></infinite-scroll>
      </client-only>
    </div>

    <!--Widget sections-->
    <!--     class="sticky"
        style="top: 75px"-->
    <div class="xl:ml-20 ml-12 lg:block hidden">
      <widget></widget>
    </div>

    <!-- <div>{{ posts }}</div> -->
  </div>
</template>

<script>
import postCreatorDialog from '@/components/postCreatorDialog/index';
import post from '@/components/post/index';
import postCreatorPlaceholder from '@/components/postCreatorDialog/placeholder';
import widget from '@/components/widget/index';
import { EPost } from '@/server/types/post';
import { nanoid } from 'nanoid';

// import postsAPI from '@/server/api/post/fakeBackend';

export default {
  name: 'Home',
  components: {
    postCreatorPlaceholder,
    postCreatorDialog,
    post,
    widget,
  },
  async asyncData({ $axios }) {
    // await $axios.put('/utils/user/online');
    let res;
    const posts = [];
    let lastItem = {};

    try {
      res = await $axios.get('/posts');

      for (let i = 0; i < res.data.length; i++) {
        posts.push(res.data[i]);
      }

      [lastItem] = posts.slice(-1);

      // console.log(res.data[0]);
    } catch (err) {
      console.error(err);
    }

    return { posts, lastItem };
  },
  data() {
    return {
      page: 1,
      componentKey: 0,
      posts: [],
      lastItem: {},
      isPostLoading: false, //Is post fetching
      isMounted: false,
    };
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    //Handle after post being edited
    async onPostEdited({
      type,
      editObj,
      // selectedPrivacy,
      selectedPermission,
      getHTML,
      getFiles,
    }) {
      try {
        console.log('onPostEdited', getFiles());
        const content = getHTML();

        //Update placeholder element, replace it with new data
        this.posts.map((item, i) => {
          if (item._id === editObj._id) {
            this.posts[i] = {
              ...this.posts[i],
              content,
              placeholder: true,
              media: getFiles(),
              updatedAt: new Date(),
              permission: selectedPermission,
            };
          }
        });

        this.forceRerender();

        const formData = new FormData();

        const Post = {
          user: this.$auth.user._id,
          content,
          tags: null,
          privacy: editObj.privacy,
          permission: selectedPermission,
          deleteAt: null,
          type,
        };

        const cleanPost = Object.fromEntries(
          Object.entries(Post).filter(([_, v]) => v != null)
        );

        formData.append('oldPost', JSON.stringify(editObj));
        formData.append('post', JSON.stringify(cleanPost));

        const media = getFiles();
        let res;
        let haveNewMedia = false;
        media.forEach((element) => {
          if (typeof element.name === 'string') {
            haveNewMedia = true;
          }
        });

        if (media.length && haveNewMedia) {
          console.log('t1');
          getFiles().map((file) => {
            formData.append('media', file);
          });
          const diff = editObj.media.filter((obj) => {
            return !media.some((obj2) => {
              return obj.fileName === obj2.fileName;
            });
          });
          formData.append('diff', JSON.stringify(diff));
          res = await this.$axios.put(`posts/${editObj._id}`, formData);

          res = res.data;

          console.log('editObj', editObj);
        } else {
          console.log('t2');
          res = await this.$axios.put(`posts/t/${editObj._id}`, {
            oldPost: editObj,
            post: cleanPost,
            media,
          });

          res = res.data;
          console.log('editObj', editObj);
        }

        console.log('res', res);

        console.log('res.data', res);

        delete res.post.content;
        this.posts.map((item, i) => {
          if (item._id === editObj._id) {
            this.posts[i] = {
              ...res.post,
              content,
              placeholder: false,
              user: this.$auth.user,
            };
          }
        });

        this.forceRerender();

        console.log(res);
      } catch (err) {
        console.log(err);
      }
    },

    async onPost({
      type,
      selectedPrivacy,
      selectedPermission,
      getHTML,
      getFiles,
      repostObj,
    }) {
      const tmpId = 'tmpId' + nanoid();
      const content = getHTML();

      console.log('repostObj', repostObj);
      console.log(content, selectedPermission);
      try {
        this.$scrollIntoView(this.$refs.postCreator.$el, {
          align: { top: 0 },
        });

        //Add temp post
        this.posts.unshift({
          _id: tmpId,
          user: this.$auth.user,
          type,
          content,
          placeholder: true,
          media: getFiles(),
          updatedAt: new Date(),
          createdAt: new Date(),
          privacy: selectedPrivacy,
          permission: selectedPermission,
        });

        const formData = new FormData();

        const Post = {
          user: this.$auth.user._id,
          content,
          tags: null,
          privacy: selectedPrivacy,
          permission: selectedPermission,
          deleteAt: null,
          type,
        };

        if (type === EPost.SHARE && repostObj) {
          Post.parentID = repostObj._id ?? repostObj.id;
        }

        const cleanPost = Object.fromEntries(
          Object.entries(Post).filter(([_, v]) => v != null)
        );

        formData.append('post', JSON.stringify(cleanPost));

        getFiles().map((file) => {
          // formData.append('media[]', file);
          formData.append('media', file);
        });

        let res = await this.$axios.put('posts', formData);
        res = res.data.newPost;
        res.user = this.$auth.user;
        delete res.content;

        //Update placeholder element, replace it with new data
        this.posts.map((item, i) => {
          if (item._id === tmpId) {
            this.posts[i] = {
              ...res,
              content,
              placeholder: false,
              parentID: type === EPost.SHARE ? repostObj : item.parentID,
            };
          }
        });

        this.forceRerender();

        console.log(res);
      } catch (err) {
        //Remove the placeholder error occur
        this.posts = this.posts.filter((item) => item._id !== tmpId);
        this.$vs.notification({
          duration: 2500,
          color: this.$color.orange[500],
          position: 'bottom-right',
          title: this.$t('error'),
          text: err.response?.data?.message ?? this.$t('error'),
        });
        console.log(err);
      }
    },

    onPostDeleteComplete(id) {
      console.log('Post del:', id);
      //Remove it from array after delete
      this.posts = this.posts.filter((item) => item._id !== id);
    },

    //Rerender the post array
    forceRerender() {
      this.componentKey += 1;
    },

    /**
     * @param {Boolean} refreshAll Refresh all posts from start
     */
    async fetchPosts(refreshAll = false) {
      if (this.isPostLoading) {
        return;
      }

      this.isPostLoading = true;

      if (refreshAll) {
        this.lastItem = {};
      }

      const res = await this.$axios.get(
        `posts?postDate=${this.lastItem.createdAt}`
      );

      if (refreshAll) {
        this.posts = [];
      }

      for (let i = 0; i < res.data.length; i++) {
        this.posts.push(res.data[i]);
      }

      if (this.posts) {
        [this.lastItem] = this.posts.slice(-1);
      }
      console.log('Load new post now');
      this.isPostLoading = false;
    },

    //TODO: Will change to page number api
    isIntersecting() {
      if (this.lastItem._id !== '6032995506f903ea2983857b') {
        this.fetchPosts();
      }
    },
  },
  head() {
    return {
      title: this.$t('home'),
    };
  },
};
</script>
