import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'cropperjs/dist/cropper.css';

// 引入全局样式
import '@/assets/css/jd.css'

//引入 swiper.min.css的样式
import 'swiper/css/swiper.min.css'

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
Vue.use(MintUI)


import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

// import mandMobile from 'mand-mobile';
// import 'mand-mobile/lib/mand-mobile.css';
// Vue.use(mandMobile);

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI)

import BaiduMap from 'vue-baidu-map'
Vue.use(BaiduMap, {
  ak: 'S5ae8V4cMWSzBGfqZCzoLhLPzUu4ChDi'
})

Vue.config.productionTip = false

// 引入 axios 封装的 api 接口
import Api from './api'
Vue.prototype.Api = Api

import { Lazyload } from 'vant';
Vue.use(Lazyload);
// 注册时可以配置额外的选项
Vue.use(Lazyload, {
  lazyComponent: true,
  // loading: require("@/assets/images/loading.gif")
});

// 骨架屏
import { Skeleton } from 'vant';
Vue.use(Skeleton);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
