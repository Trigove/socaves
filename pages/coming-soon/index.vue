<template>
  <div class="flex justify-center items-center w-full flex-col">
    <img
      alt="socaves"
      class="max-w-full w-40 sm:w-56 lg:w-70"
      src="~/assets/img/icon.png"
    />

    <h1 class="text-3xl sm:text-4xl text-orange-500 font-bold uppercase">
      {{ $t('coming_soon') }}
    </h1>

    <vs-button
      class="
        h-10
        bg-orange-500
        font-bold
        rounded-full
        mt-8
        text-base
        max-w-[230px]
        sm:max-w-xs
        capitalize
      "
      color="primary"
      active
      flat
      block
      to="/"
    >
      {{ $t('email.back') }}
    </vs-button>
  </div>
</template>

<script>
export default {
  head() {
    return {
      meta: [
        {
          hid: 'robots',
          name: 'robots',
          content: 'noindex, noarchive, nofollow',
        },
      ],
      title: this.$t('coming_soon'),
    };
  },
};
</script>
