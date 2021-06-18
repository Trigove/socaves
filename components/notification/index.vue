<template>
  <div>
    <!-- Notibox -->
    <!-- notiitem-like-post-->
    <div v-if="display" ref="box" class="absolute right-14 z-50">
      <div class="rounded-2xl shadow-md max-w-xs bg-white p-2">
        <div
          class="flex items-center bg-white hover:bg-gray-100 p-3 rounded-xl"
        >
          <img width="45" height="45" src="~/assets/img/noticon/noticon.png" />
          <div class="ml-3">
            <span>@kaaheiikj liked your post.</span>
            <p class="text-xs text-gray-400">15 mins</p>
          </div>
        </div>

        <!-- notiitem-follow-back-->
        <div class="bg-white hover:bg-gray-100 p-3 rounded-xl mt-5">
          <div class="items-center flex">
            <img
              width="45"
              height="45"
              src="~/assets/img/noticon/noticon2.png"
            />
            <div class="ml-3">
              <span>@pkpkpkpkpkpkpk2021 started following you.</span>
              <span class="text-xs text-gray-400"> 20mins</span>
            </div>
          </div>
          <!-- button -->
          <div class="ml-14">
            <button
              class="
                text-white
                font-bold
                bg-orange-500
                rounded-xl
                px-14
                py-1
                border-orange-500 border-2
              "
            >
              Follow Back
            </button>
          </div>
        </div>

        <!-- notiitem-following -->
        <div class="bg-white hover:bg-gray-100 p-3 rounded-xl mt-5">
          <div class="items-center flex">
            <img
              width="45"
              height="45"
              src="~/assets/img/noticon/noticon3.png"
            />
            <div class="ml-3">
              <span>@hellosocaves started following you.</span>
              <span class="text-xs text-gray-400"> 1w</span>
            </div>
          </div>
          <!-- button -->
          <div class="ml-14">
            <button
              class="
                text-orange-500
                font-bold
                rounded-xl
                px-16
                py-1
                bg-white
                border-orange-500 border-2
              "
            >
              Following
            </button>
          </div>
        </div>

        <!-- muti-user-follow -->
        <div
          class="
            flex
            items-center
            mt-5
            bg-white
            hover:bg-gray-100
            p-3
            rounded-xl
          "
        >
          <img width="45" height="45" src="~/assets/img/noticon/noticon4.png" />
          <div class="ml-3">
            <span>@jkchan19 and 54 others liked your post.</span>
            <span class="text-xs text-gray-400">2w</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      display: false,
    };
  },
  methods: {
    displayComponent() {
      this.display = true;
    },
    hideComponent() {
      this.display = false;
    },
  },
};
</script>
