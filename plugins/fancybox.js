import '@fancyapps/fancybox/dist/jquery.fancybox.min.js';
import '@fancyapps/fancybox/dist/jquery.fancybox.min.css';

$.fancybox.defaults.buttons = ['zoom', 'download', 'close'];
$.fancybox.defaults.hash = false;
$.fancybox.defaults.backFocus = false;
$.fancybox.defaults.onInit(() => {
  console.log('hi');
});
