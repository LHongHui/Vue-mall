import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)
VueRouter.prototype.animate = 0
const routes = [
  {
    path: '/home',
    name: 'home',
    meta: { keepAlive: true },
    component: () => import('../views/home/index.vue')
  },
  {
    path: '/category',
    name: 'Category',
    component: () => import('../views/category/index.vue')
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('../views/cart/index.vue')
  },
  {
    path: '/confirmOrder',
    name: 'confirmOrder',
    component: () => import('../views/order/confirmOrder.vue')
  },
  {
    path: '/payment',
    name: 'payment',
    component: () => import('../views/order/payment.vue')
  },
  {
    path: '/success',
    name: 'success',
    component: () => import('../views/order/success.vue')
  },
  {
    path: "/Address",
    name: "Address",
    component: () => import('../views/address/Address.vue')
  },
  {
    path: "/AddressEdit",
    name: "AddressEdit",
    component: () => import('../views/address/AddressEdit.vue')
  },
  {
    path: '/my',
    name: 'My',

    component: () => import('../views/my/index')
  },
  {
    path: '/comment',
    name: 'comment',

    component: () => import('../views/my/comment.vue')
  },
  {
    path: '/commented',
    name: 'commented',

    component: () => import('../views/my/commented.vue')
  },
  {
    path: '/rate',
    name: 'Rate',
    //props: (route) => ({ id: route.query.id }),
    component: () => import('../views/my/rate.vue')
  },
  {
    path: '/MyOrder',
    name: 'MyOrder',
    component: () => import('../views/my/MyOrder.vue')
  },
  {
    path: '/login',
    name: 'login',

    component: () => import('../views/my/login')
  },
  {
    path: '/fav',
    name: 'fav',

    component: () => import('../views/my/fav.vue')
  },
  {
    path: '/productDetail/:id',
    name: 'productDetail',
    // 异步写法
    component: () => import('../views/productDetail/index.vue'),
  },
  {
    path: '/location',
    name: 'location',
    // 异步写法
    component: () => import('../views/location/index.vue'),
  },
  {
    path: '/count_down',
    name: 'count_down',

    component: () => import('../views/count_down/index.vue')
  },
  {
    path: '/search',
    name: 'Search',

    component: () => import('../views/search/index.vue')
  },
  {
    path: '/myFoot',
    name: 'myFoot',
    component: () => import('../views/my/myfoot.vue')
  },
  {
    path: '/express',
    name: 'express',
    component: () => import('../views/my/express.vue')
  },
  {
    path: '*',
    redirect: '/home'
  }
]

const router = new VueRouter({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
