import Vue from 'vue';
import dialogHeader from '@/components/global/dialogHeader';
import loadingSpinner from '@/components/global/loadingSpinner';
import readMore from '@/components/global/readMore';
import avatar from '@/components/global/avatar';
import pullToRefresh from '@/components/global/pullToRefresh';
import infiniteScroll from '@/components/global/infiniteScroll';

Vue.component('dialog-header', dialogHeader);
Vue.component('loading-spinner', loadingSpinner);
Vue.component('read-more', readMore);
Vue.component('avatar', avatar);
Vue.component('pull-to-refresh', pullToRefresh);
Vue.component('infinite-scroll', infiniteScroll);
