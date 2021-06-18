<template>
  <div
    :id="msgId"
    :class="{
      'bg-orange-500 text-white ml-auto rounded-tr-sm': sentByMe,
      'bg-gray-100 text-black mr-auto rounded-tl-sm': !sentByMe,
      'md:pb-1 w-full': media.length > 0 && !isVoiceMessage,
      'md:py-2 px-2 py-0.5': !media.length > 0,
    }"
    data-test="chatBubble"
    class="chat-bubble md:rounded-xl rounded-lg my-1 md:px-3 max-w-[350px]"
  >
    <div class="flex flex-col md:px-0 px-1.5">
      <div
        v-if="media.length > 0"
        :class="{
          'w-full': !media[0].type.includes('audio/'),
        }"
      >
        <div v-if="media[0].type.includes('image/')" class="mt-3 mb-1">
          <a class="outline-none" :data-fancybox="roomId" :href="media[0].src">
            <div class="aspect-w-16 aspect-h-9 rounded-xl">
              <img
                v-lazy-load
                class="
                  object-cover
                  w-full
                  h-full
                  bg-gray-100
                  border-0
                  rounded-lg
                  md:rounded-xl
                "
                :data-src="media[0].src"
                alt=""
              />
            </div>
          </a>
        </div>

        <!--For video-->
        <div
          v-else-if="media[0].type.includes('video/')"
          class="mt-3 mb-1 overflow-hidden rounded-lg md:rounded-xl"
        >
          <a :data-fancybox="roomId" :href="media[0].src"> </a>
          <client-only>
            <plyr>
              <video
                id="swiper-player"
                controls
                playsinline
                :data-type="media[0].type"
              >
                <source :src="media[0].src" :type="media[0].type" />
              </video>
            </plyr>
          </client-only>
        </div>

        <!--For voice message-->
        <div
          v-else-if="media[0].type.includes('audio/')"
          class="flex justify-center items-center"
        >
          <audio class="py-1.5 ml-auto" controls>
            <source :src="media[0].src" :type="media[0].type" />
            {{ $t('chat.warning') }}
          </audio>
        </div>
      </div>

      <read-more
        no-shadow
        :content="
          $xss(content, {
            whiteList: {
              p: [],
              br: [],
              b: [],
              strong: [],
              s: [],
              i: [],
              em: [],
            },
          })
        "
        :max-characters="1500"
        :max-lines="10"
      >
      </read-more>

      <span ref="date" class="ml-auto sm:text-[0.74rem] text-xxs mr-1">
        {{ formatTime(time) }}
      </span>
    </div>
  </div>
</template>

<script>
import { format, isSameDay } from 'date-fns';
export default {
  props: {
    roomId: {
      type: String,
      required: true,
    },
    msgId: {
      type: String,
      required: true,
    },
    sentByMe: {
      type: Boolean,
      required: true,
    },
    time: {
      type: [Date, Number],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    media: {
      type: Array,
      default: () => [],
    },
  },

  computed: {
    isVoiceMessage() {
      if (this.media.length > 0) {
        return this.media[0].type?.includes('audio/');
      }

      return false;
    },
  },

  mounted() {
    try {
      if (this.$el) {
        this.$scrollIntoView(this.$el, {
          time: 200,
          align: { top: 0 },
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  methods: {
    formatTime(time) {
      time = new Date(time);

      if (isSameDay(time, Date.now())) {
        return format(time, 'hh:mm a');
      }

      return format(time, 'yyyy-MM-dd hh:mm a');
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-bubble {
  width: max-content;
}

@media (max-width: theme('screens.sm')) {
  audio {
    transform: scale(0.9);
    max-width: 250px;
  }
}
</style>
