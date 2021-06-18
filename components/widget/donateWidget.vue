<template>
  <div
    class="
      overflow-hidden
      bg-white
      h-24
      w-[250px]
      rounded-2xl
      shadow-base
      flex flex-col
      items-center
      justify-items-center
    "
  >
    <h3
      class="
        text-orange-500 text-xl
        font-bold
        mt-4
        whitespace-nowrap
        overflow-hidden
      "
    >
      {{ $t('give_coffee') }}
    </h3>

    <vs-button
      class="
        bg-orange-500
        text-sm
        w-28
        h-6
        rounded-full
        text-white
        mt-1.5
        font-medium
        max-w-[140px]
      "
    >
      <a
        rel="noopener"
        target="_blank"
        href="https://www.buymeacoffee.com/socaves"
      >
        {{ $t('donate') }}</a
      >
    </vs-button>
  </div>
</template>
