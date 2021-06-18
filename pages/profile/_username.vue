<template>
  <div class="flex justify-center w-full sm:p-8">
    <pull-to-refresh @onRefresh="fetchPosts(true)"></pull-to-refresh>

    <!--Posts section-->
    <div class="flex items-center flex-col w-full sm:max-w-lg">
      <post-creator-dialog
        ref="postCreator"
        @onPostEdited="onPostEdited"
      ></post-creator-dialog>

      <profile-stat :user="user"></profile-stat>

      <loading-spinner v-if="!isMounted" class="mt-6"></loading-spinner>

      <client-only>
        <transition-group
          v-if="posts.length > 0"
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
            :user="user"
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

        <div v-else class="flex flex-col items-center justify-center mt-10">
          <span class="text-2xl font-medium uppercase"
            >{{ $t('no_post') }} 😕
          </span>
        </div>

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
import profileStat from '@/components/profileStat/index';
import postCreatorDialog from '@/components/postCreatorDialog/index';
import post from '@/components/post/index';
import widget from '@/components/widget/index';
import { EPost } from '@/server/types/post';
import { nanoid } from 'nanoid';

// import postsAPI from '@/server/api/post/fakeBackend';

export default {
  name: 'Home',
  components: {
    profileStat,
    postCreatorDialog,
    post,
    widget,
  },

  async asyncData({ $axios, $auth, params, redirect }) {
    try {
      let userRes, user;

      const username = params.username;

      if (params.username === $auth.user?.username) {
        userRes = await $axios.get('/user/profile');
        user = userRes.data.user;
      } else {
        userRes = await $axios.get(`/users/${params.username}`);
        user = userRes.data.user;
      }
      const posts = userRes.data.combinePosts;

      return { posts, user, username };
    } catch (e) {
      console.log(e);
      redirect('/');
    }
  },

  data() {
    return {
      username: '',
      page: 1,
      componentKey: 0,
      posts: [],
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
        } else {
          res = await this.$axios.put(`posts/t/${editObj._id}`, {
            oldPost: editObj,
            post: cleanPost,
            media,
          });

          res = res.data;
        }

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

      console.log(content, selectedPermission);
      console.log('repostObj', repostObj);

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
      } catch (err) {
        //Remove the placeholder error occur
        this.posts = this.posts.filter((item) => item._id !== tmpId);
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
        this.posts = [];
        this.page = 0;
      }

      const res = await this.$axios.get(
        `/users/${this.user._id}/posts?page=${this.page}`
      );

      const { combinePosts } = res.data;

      console.log('combinePosts', combinePosts);

      for (let i = 0; i < combinePosts.length; i++) {
        this.posts.push(combinePosts[i]);
      }

      this.page = combinePosts.length > 0 ? ++this.page : -1;
      console.log('Load new post now');
      this.isPostLoading = false;
    },

    isIntersecting() {
      if (this.page !== -1 && this.posts.length > 9) {
        this.fetchPosts();
      }
    },
  },
  head() {
    return {
      title: this.username,
    };
  },
};
</script>
