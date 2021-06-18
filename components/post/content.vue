<!--eslint-disable vue/no-v-html-->
<template>
  <div>
    <!--Media section-->
    <!--padding for the pagination-bullet-->

    <!--Media Placeholder for ssr and tmp post use-->
    <div
      v-if="
        (!isMounted && media.length > 0) || (placeholder && media.length > 0)
      "
      class="swiper-slide"
    >
      <div class="aspect-w-16 aspect-h-9">
        <div
          class="skeleton-loading object-cover block bg-gray-200 h-full w-full"
        />
      </div>
    </div>

    <div class="px-3">
      <div
        v-if="media.length > 0 && !placeholder"
        ref="mySwiper"
        v-swiper:mySwiper="swiperOptions"
        class="swiper w-full h-full"
        :class="{ 'pb-[30px]': media.length > 1 }"
      >
        <div v-show="isMounted" class="swiper-wrapper">
          <div
            v-for="(file, i) in media"
            :key="i"
            class="swiper-slide overflow-hidden rounded-xl"
          >
            <!-- <a :href="file.src" itemprop="contentUrl"> -->
            <!--For image-->
            <a
              v-if="file.type.includes('image/')"
              class="outline-none"
              aria-label="image"
              :data-fancybox="id"
              :href="withQuery(file.src, privacy, '/tr:w-2000')"
            >
              <div class="aspect-w-16 aspect-h-9">
                <img
                  class="swiper-lazy object-cover border-0"
                  :data-srcset="`
                  ${withQuery(file.src, privacy, '/tr:w-225,ar-16-9')} 225w,
                  ${withQuery(file.src, privacy, '/tr:w-300,ar-16-9')} 300w,
                  ${withQuery(file.src, privacy, '/tr:w-500,ar-16-9')} 500w,
                  ${withQuery(file.src, privacy, '/tr:w-800,ar-16-9')} 800w`"
                  :data-src="withQuery(file.src, privacy, '/tr:w-2000')"
                  :data-type="file.type"
                  alt=""
                />
                <div
                  class="
                    loading
                    skeleton-loading
                    object-cover
                    block
                    bg-gray-200
                    h-full
                    w-full
                  "
                />
              </div>
            </a>

            <!--For video-->
            <div
              v-else-if="file.type.includes('video/')"
              class="overflow-hidden rounded-xl"
            >
              <a :data-fancybox="id" :href="withQuery(file.src, privacy, '')">
              </a>
              <client-only>
                <plyr
                  for-swiper
                  @ready="updateSwiperHeight"
                  @canPlay="updateSwiperHeight"
                  @exitFullscreen="updateSwiperHeight"
                >
                  <video
                    :id="file.fileName"
                    crossorigin="anonymous"
                    controls
                    playsinline
                    :data-type="file.type"
                  >
                    <source
                      :src="withQuery(file.src, privacy, '')"
                      :type="file.type"
                    />
                  </video>
                </plyr>
              </client-only>
            </div>
          </div>
        </div>
        <div class="swiper-pagination" :class="{ hidden: media.length < 2 }" />
      </div>
    </div>

    <!--Control section if have media-->
    <slot v-if="media.length > 0" name="control"></slot>

    <!--Content section-->
    <div class="px-3 mt-2 text-sm z-10">
      <!--If seetins is  read more then use read more comp else div-->
      <read-more class="editor__content" :content="content"></read-more>
    </div>

    <!--Share post placeholder-->
    <div
      v-if="type === EPost.SHARE && placeholder"
      :class="{ 'mt-3': content.length > 0 }"
      class="h-44 mx-2 border-gray-200 border rounded-2xl p-3"
    >
      <div class="w-full">
        <div class="flex items-center">
          <div>
            <div
              class="skeleton-loading rounded-full w-8 h-8 bg-gray-200"
            ></div>
          </div>

          <!--Name and time placeholder-->
          <div class="ml-2 w-full">
            <div
              class="skeleton-loading max-w-full h-2 bg-gray-200 w-[15%]"
            ></div>
            <div
              class="skeleton-loading max-w-full h-2 mt-2 bg-gray-200 w-[10%]"
            ></div>
          </div>
        </div>

        <div
          v-for="i in 5"
          :key="i"
          class="skeleton-loading max-w-full h-2 bg-gray-200 mt-3"
          :class="i % 2 === 0 ? 'w-[80%]' : 'w-[30%]'"
        ></div>
      </div>
    </div>

    <!--For share post preview (recursive)-->
    <div
      v-if="type === EPost.SHARE && sharedPost"
      class="flex items-center justify-center"
      :class="{ 'mt-3': content.length > 0 }"
    >
      <post
        :id="sharedPost._id"
        preview-only
        class="max-w-[480px]"
        :type="sharedPost.type"
        :privacy="sharedPost.privacy"
        :permission="sharedPost.permission"
        :content="sharedPost.content"
        :media="sharedPost.media"
        :user="sharedPost.user"
        :liked-users="sharedPost.likedUsers"
        :updated-at="sharedPost.updatedAt"
        :created-at="sharedPost.createdAt"
        :num-comments="sharedPost.numComments"
        :num-likes="sharedPost.numLikes"
        :num-reports="sharedPost.numReports"
        :num-shares="sharedPost.numShares"
        :num-views="sharedPost.numViews"
        :comments="sharedPost.comments"
      />
    </div>

    <!--Control section if without media-->
    <slot v-if="media.length <= 0" name="control"></slot>
  </div>
</template>

<script>
import Plyr from 'plyr';
import linkClickRouting from '@/mixins/linkClickRouting';
import signUrl from '@/mixins/signUrl';
import { EPost, EPrivacy } from '@/server/types/post';

export default {
  name: 'Content',
  components: {
    post: () => import('./index'),
  },
  mixins: [linkClickRouting, signUrl],
  props: {
    id: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      default: EPost.POST,
    },
    placeholder: {
      type: Boolean,
      default: false,
    },
    previewOnly: {
      type: Boolean,
      default: false,
    },
    privacy: {
      type: String,
      default: EPrivacy.PUBLIC,
    },
    media: {
      type: Array,
      default: () => [],
    },
    content: {
      type: String,
      default: '',
    },
    //This is share post object
    sharedPost: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      EPost,
      swiperOptions: {
        autoHeight: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          dynamicBullets: true,
          bulletSize: 5,
          bulletElement: 'div',
          dynamicMainBullets: 3,
        },
        lazy: {
          loadPrevNext: true,
          preloaderClass: 'skeleton-loading',
          loadPrevNextAmount: 2,
        },
        mousewheel: {
          forceToAxis: true,
        },
      },
      isMounted: false,
    };
  },
  mounted() {
    this.isMounted = true;

    this.$nextTick(() => {
      $(this.$el)
        .find('[data-fancybox]')
        .fancybox({
          afterLoad() {
            const player = new Plyr('.fancybox-video', {
              ratio: '16:9',
              fullscreen: {
                enabled: 'force',
                iosNative: true,
              },
            });
            console.log(player);
          },
        });

      if (this.mySwiper) {
        //Run once when init
        this.updateActiveMedia();

        this.mySwiper.pagination.init();

        this.mySwiper.on('slideChangeTransitionStart', () => {
          //Pause all video on swipe
          [...this.mySwiper.el.querySelectorAll('video')].map((vid) =>
            vid.pause()
          );
        });

        this.mySwiper.on('slideChangeTransitionEnd', () => {
          //Update the user viewing media src
          this.updateActiveMedia();
        });
      }
    });
  },
  methods: {
    updateSwiperHeight() {
      //Re clac the height as the video change
      this.mySwiper.updateAutoHeight();
      // console.log('update swiper height');
    },

    //Show the video with time stamp given (in sec)
    navigateToVideo(fileName, time = 0) {
      let index = null;
      console.log(fileName, time);

      //Find swiper index based on the filename
      this.media.map((item, i) => {
        if (item.fileName === fileName) {
          index = i;
        }
      });

      console.log(index);

      this.mySwiper?.slideTo(index, 300);

      //Active slide video is the video we need to show
      const video = this.$el.querySelector('.swiper-slide-active video');

      console.log(video);

      setTimeout(() => {
        //If not ready
        if (video.readyState !== 4) {
          video.play();

          video.addEventListener('canplay', function handler() {
            video.currentTime = time;
            video.pause();
            this.removeEventListener('canplay', handler);
          });

          return;
        }

        video.currentTime = time;
      }, 300);
    },

    // //On video player seeking
    // onSeeking() {
    //   console.log('onSeeking', this.mySwiper);
    //   this.mySwiper.allowTouchMove = false;
    // },

    // //Done seeking
    // seeked() {
    //   console.log('seeked', this.mySwiper);
    //   this.mySwiper.allowTouchMove = true;
    // },

    //Update the active media src
    //The active media src mean that the which media link is the user viewing in swiper
    updateActiveMedia() {
      if (this.mySwiper) {
        const el = this.mySwiper.el;
        const img = el.querySelector('.swiper-slide-active img');
        const video = el.querySelector('.swiper-slide-active video');

        //Set the active src in index.vue
        const activeMedia = this.$parent.activeMedia;
        // activeMedia.isLoaded = false;

        if (img) {
          activeMedia.src = img.src || img.getAttribute('data-src');
          activeMedia.type = img.getAttribute('data-type');
          activeMedia.el = img;

          // if (img.naturalHeight !== 0) {
          //   activeMedia.isLoaded = true;
          // } else {
          //   img.addEventListener('load', () => {
          //     activeMedia.isLoaded = true;
          //   });
          // }
        } else if (video) {
          activeMedia.src = video.currentSrc;
          activeMedia.type = video.getAttribute('data-type');
          activeMedia.el = video;
          //If loaded add loaded attr
          // video.addEventListener('loadeddata', () => {
          //   if (video.readyState === 4) {
          //     video.setAttribute('data-loaded', 'true');
          //   }
          // });
        }

        // console.log(this.activeMedia);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
// ::v-deep .swiper-wrapper {

//   overflow: hidden;
// }

::v-deep .swiper-pagination-bullet {
  width: 6.5px;
  height: 6.5px;
  margin: 0 3.5px !important;
}

::v-deep.swiper-container-horizontal > .swiper-pagination-bullets,
.swiper-pagination-custom,
.swiper-pagination-fraction {
  bottom: 0px !important;
}

::v-deep.swiper-container-horizontal
  > .swiper-pagination-bullets.swiper-pagination-bullets-dynamic
  .swiper-pagination-bullet {
  transition: transform 0ms, left 200ms ease;
  will-change: transform;
}

// ::v-deep .swiper-pagination-bullet {
//   width: 6.5px;
//   height: 6.5px;
//   margin: 0 3px !important;
// }

::v-deep .swiper-container {
  width: 100%;
  height: 100%;
}

::v-deep .swiper-pagination-bullet-active {
  background: $swiper-bullet-color;
}

// ::v-deep .swiper-pagination-bullet:only-child {
//   // visibility: hidden;
// }

::v-deep .video-js {
  width: 100% !important;
}
</style>
