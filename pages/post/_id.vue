<template>
  <div class="flex justify-center w-full sm:p-8">
    <!--Posts section-->
    <div class="flex items-center flex-col w-full sm:max-w-lg">
      <post-creator-dialog
        ref="postCreator"
        @onPostEdited="onPostEdited"
      ></post-creator-dialog>

      <transition-group
        v-if="posts.length > 0"
        :key="componentKey"
        name="fade"
        tag="div"
        class="w-full"
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
          @onDeleteComplete="onPostDeleteComplete"
        />
      </transition-group>
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
import post from '@/components/post/index';
import widget from '@/components/widget/index';
import { EPrivacy } from '@/server/types/post';
import postCreatorDialog from '@/components/postCreatorDialog/index';

export default {
  components: { post, widget, postCreatorDialog },
  async asyncData({ redirect, params, $axios }) {
    try {
      const resp = await $axios.get(`/posts/${params.id}`);

      const posts = [resp.data];
      //Test id: 6054774cae14ff0a001239c5
      console.log(params.id);

      console.log(posts);

      return { posts };
    } catch (err) {
      redirect('/');
    }
  },
  data() {
    return {
      componentKey: 0,
      posts: [],
    };
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

    //Rerender the post array
    forceRerender() {
      this.componentKey += 1;
    },

    onPostDeleteComplete() {
      this.$router.push('/');
    },
  },
  head() {
    return {
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content:
            this.posts[0]?.privacy === EPrivacy.PUBLIC
              ? 'index'
              : 'noindex, noarchive, nofollow',
        },
      ],
      title: this.posts[0]?.user?.username,
    };
  },
};
</script>
