<template>
  <main>
    <Nuxt />
    <!-- <footer class="w-full p-8 bg-gray-900 text-white h-16 flex items-center">
      <span class="text-xs">
        &copy; Copyright {{ new Date().getFullYear() }}, Socaves
      </span>
    </footer> -->
  </main>
</template>

<script>
import realHeight from '@/mixins/realHeight';

export default {
  name: 'Account',
  mixins: [realHeight],
  mounted() {
    const perfEntries = performance.getEntriesByType('navigation');
    if (perfEntries[0].type === 'reload') {
      const sheet = document.styleSheets[0];
      sheet.insertRule('* { pointer-events: none; }', sheet.cssRules.length);
      // console.info('TYPE_RELOAD');
    }
    const last = document.styleSheets[0].cssRules.length - 1;
    document.styleSheets[0].cssRules[last].style.removeProperty(
      'pointer-events'
    );
  },
};
</script>
