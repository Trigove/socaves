<template>
  <div class="w-full bg-black">
    <div class="flex justify-between px-5 py-4">
      <div>
        <vs-button
          class="text-2xl bg-gray-500"
          flat
          circle
          icon
          :color="$color.gray[100]"
        >
          <iconify-icon icon="chat" class="text-white" />
        </vs-button>
      </div>

      <div class="flex">
        <vs-button
          class="text-2xl bg-black"
          flat
          circle
          icon
          :color="$color.gray[100]"
        >
          <iconify-icon icon="userPlus" class="text-white" />
        </vs-button>
        <vs-button
          class="text-2xl bg-black"
          flat
          circle
          icon
          :color="$color.gray[100]"
        >
          <iconify-icon icon="settings" class="text-white" />
        </vs-button>
        <vs-button
          class="text-2xl bg-black"
          flat
          circle
          icon
          :color="$color.gray[100]"
        >
          <iconify-icon icon="fullscreen" class="text-white" />
        </vs-button>
      </div>
    </div>

    <div
      class="
        flex flex-col
        items-center
        self-center
        justify-items-center
        pt-60
        min-w-max
      "
    >
      <!-- middle part -->
      <img class="h-32 rounded-full" src="~/assets/img/usericon.png" />
      <p class="pt-4 text-2xl text-white">{{ $t('voiceMessage.username') }}</p>
      <p class="text-sm text-white font-extralight">
        {{ $t('voiceMessage.message') }}
      </p>
    </div>

    <!-- bottom part -->
    <div
      class="fixed bottom-0 flex items-center p-6 left-50 justify-items-center"
    >
      <div class="flex flex-col items-center justify-items-center">
        <img src="~/assets/img/videoCall.png" class="w-60 md:w-80 max-w-min" />
        <button class="pb-8 focus:outline-none">
          <svg
            width="41"
            height="41"
            viewBox="0 0 41 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20.1247 32.9158L5.52591 18.818C5.40826 18.7019 5.26875 18.6103 5.11546 18.5485C4.96217 18.4867 4.79814 18.4559 4.63287 18.4579C4.46761 18.4599 4.30437 18.4946 4.15263 18.5601C4.00088 18.6256 3.86363 18.7206 3.74882 18.8395C3.63401 18.9584 3.54392 19.0989 3.48376 19.2528C3.4236 19.4068 3.39457 19.5711 3.39835 19.7363C3.40212 19.9016 3.43863 20.0644 3.50576 20.2155C3.57288 20.3665 3.6693 20.5027 3.78942 20.6162L19.2631 35.5574C19.4973 35.7836 19.8105 35.9094 20.1361 35.9082C20.4617 35.9069 20.7739 35.7787 21.0064 35.5508L36.3659 20.4922C36.4851 20.3777 36.5805 20.2408 36.6464 20.0892C36.7124 19.9377 36.7477 19.7746 36.7502 19.6093C36.7527 19.444 36.7224 19.2799 36.6611 19.1264C36.5998 18.973 36.5086 18.8332 36.3929 18.7151C36.2772 18.5971 36.1392 18.5032 35.987 18.4389C35.8347 18.3745 35.6713 18.341 35.506 18.3403C35.3407 18.3395 35.1769 18.3716 35.0241 18.4346C34.8713 18.4975 34.7325 18.5902 34.6157 18.7071L20.1247 32.9174L20.1247 32.9158Z"
              fill="white"
            />
          </svg>
        </button>
      </div>
    </div>
    <div class="fixed bottom-0 right-0 flex p-6 mb-8 md:pb-3 md:mb-0">
      <div class="mx-1">
        <vs-button
          class="text-2xl bg-gray-500"
          flat
          circle
          icon
          :color="$color.gray[100]"
        >
          <iconify-icon icon="volume" class="text-white" />
        </vs-button>
      </div>

      <div class="mx-1">
        <vs-button
          class="text-2xl bg-gray-500"
          flat
          circle
          icon
          :color="$color.gray[100]"
        >
          <iconify-icon icon="video" class="text-white" />
        </vs-button>
      </div>

      <div class="pr-2 mx-1">
        <vs-button
          class="text-2xl bg-gray-500"
          flat
          circle
          icon
          :color="$color.gray[100]"
        >
          <iconify-icon icon="mic" class="text-white" />
        </vs-button>
      </div>

      <button
        class="
          flex
          self-center
          bg-red-500
          rounded-full
          focus:outline-none
          w-max
        "
      >
        <span class="my-3 ml-2 text-xs font-semibold text-white">{{
          $t('voiceMessage.disconnect')
        }}</span>
        <iconify-icon icon="phoneCall" class="my-3 mr-2 text-white" />
      </button>
    </div>
  </div>
</template>
