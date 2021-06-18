<template>
  <nuxt-link
    to="/signup"
    class="
      overflow-hidden
      bg-white
      h-80
      w-[250px]
      rounded-2xl
      shadow-base
      flex flex-col
      items-center
      justify-items-center
    "
  >
    <div class="pt-6">
      <img src="~/assets/img/icon.png" width="48" height="48" />
    </div>

    <h3 class="text-orange-500 font-extrabold text-2xl">
      {{ $t('join_us_now') }}
    </h3>

    <p class="font-bold text-sm">{{ $t('take_few_min') }}</p>

    <div class="mt-4 pl-20">
      <img src="~/assets/img/phone.png" height="206" width="170" alt="" />
    </div>
  </nuxt-link>
</template>
