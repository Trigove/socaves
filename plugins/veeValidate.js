import Vue from 'vue';
import { ValidationProvider, ValidationObserver } from 'vee-validate';

//https://medium.com/js-dojo/connect-i18n-and-vee-validate-nuxt-js-i18n-and-vee-validate-works-greate-together-d086edd4ca22
//Custom
//https://logaretm.github.io/vee-validate/guide/basics.html#messages
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

// extend('min', min);

// console.log(Vue.i18n);
