//Sanitize un-trusted HTML (to prevent XSS) with a configuration specified by a whitelist
//https://github.com/leizongmin/js-xss
//https://juejin.cn/post/6847902221770686478
import Vue from 'vue';
import xss from 'xss';

Vue.prototype.$xss = xss;
