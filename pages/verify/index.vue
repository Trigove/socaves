<template>
  <!-- gray background -->
  <div
    class="
      flex flex-col
      items-center
      bg-bg
      justify-items-center
      min-h-screen-real
    "
  >
    <!-- while background -->
    <div class="flex flex-col items-center m-auto bg-bg justify-items-center">
      <!-- tick svg -->
      <div
        class="
          z-50
          flex flex-col
          items-center
          w-32
          h-32
          -mb-20
          bg-transparent
          sm:-mb-32
          justify-items-center
          sm:w-48 sm:h-48
        "
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 260 260"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g filter="url(#filter0_dd)">
            <rect x="66" y="63" width="135" height="90" fill="white" />
            <path
              d="M130 5C72.1053 5 25 52.1053 25 110C25 167.895 72.1053 215 130 215C187.895 215 235 167.895 235 110C235 52.1053 187.895 5 130 5ZM188.684 82.3684L121.579 148.947C117.632 152.895 111.316 153.158 107.105 149.211L71.5789 116.842C67.3684 112.895 67.1053 106.316 70.7895 102.105C74.7368 97.8947 81.3158 97.6316 85.5263 101.579L113.684 127.368L173.684 67.3684C177.895 63.1579 184.474 63.1579 188.684 67.3684C192.895 71.5789 192.895 78.1579 188.684 82.3684Z"
              fill="#F97316"
            />
          </g>
          <defs>
            <filter
              id="filter0_dd"
              x="0"
              y="0"
              width="260"
              height="260"
              filterUnits="userSpaceOnUse"
              color-interpolation-filters="sRGB"
            >
              <feFlood flood-opacity="0" result="BackgroundImageFix" />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="10" />
              <feGaussianBlur stdDeviation="5" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
              />
              <feBlend
                mode="normal"
                in2="BackgroundImageFix"
                result="effect1_dropShadow"
              />
              <feColorMatrix
                in="SourceAlpha"
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              />
              <feOffset dy="20" />
              <feGaussianBlur stdDeviation="12.5" />
              <feColorMatrix
                type="matrix"
                values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
              />
              <feBlend
                mode="normal"
                in2="effect1_dropShadow"
                result="effect2_dropShadow"
              />
              <feBlend
                mode="normal"
                in="SourceGraphic"
                in2="effect2_dropShadow"
                result="shape"
              />
            </filter>
          </defs>
        </svg>
      </div>
      <!-- end of tick -->
      <div class="bg-white rounded-md">
        <div
          class="
            flex flex-col
            items-center
            px-8
            pt-8
            mt-8
            ustify-items-center
            sm:px-20 sm:pt-20 sm:mt-10
          "
        >
          <p class="text-2xl font-medium sm:text-3xl">
            {{ $t('email.congratulation') }}
          </p>
          <p class="sm:text-base text-sm text-gray-400 pt-1.5 pb-12">
            {{ $t('email.success') }}
          </p>
        </div>
        <div
          class="flex flex-col items-center pb-2 ustify-items-center sm-pb-6"
        >
          <nuxt-link
            to="/"
            class="
              flex
              items-center
              justify-center
              w-48
              h-10
              bg-orange-500
              border-0
              rounded-full
              sm:w-60
              hover:opacity-80
              focus:outline-none
            "
          >
            <span class="font-semibold text-white sm:text-lg text-normal">
              {{ $t('email.back') }}
            </span>
          </nuxt-link>
        </div>
        <div class="w-8 h-8 mt-6 ml-auto mr-2">
          <img src="~/assets/img/icon.png" />
        </div>
        <div class="flex flex-col w-full mr-auto bg-orange-500 rounded-b-md">
          <span class="m-2 text-lg font-bold text-white">{{
            $t('title')
          }}</span>
        </div>
      </div>
    </div>
  </div>
  <!-- end of gray background -->
</template>

<script>
export default {
  layout: 'account',
  created() {
    if (this.$nuxt.$route.query.id) {
      this.verify();
    } else {
      // warnning
    }
  },

  methods: {
    async verify() {
      try {
        await this.$axios.get(`verify?id=${this.$nuxt.$route.query.id}`);
      } catch (err) {
        const { message, type } = err.response.data;
        this.$vs.notification({
          duration: 'none',
          color: this.$color.orange[500],
          position: 'bottom-right',
          title: this.$t('error'),
          text: this.$t(`account.${type}`) ?? message,
        });
      }
      // this.$router.back();
    },
  },
};
</script>
