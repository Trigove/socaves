//Define global variables here
import Vue from 'vue';
import tailwindConfig from '@/tailwind.config';

//Tailwind colors set
Vue.prototype.$color = tailwindConfig.theme.colors;
