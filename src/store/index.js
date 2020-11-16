import Vue from 'vue'
import Vuex from 'vuex'
import * as type from './mutations-type.js'
import storage from '@/assets/js/storage'
Vue.use(Vuex)
export default new Vuex.Store({
  state: { // 定义数据
    isTabbarShow: true,  // 非父子通信
    productOnes: [],//产品详情页的接口数据,
    shopnum: 0,
    userName: null,
    token: null,
    shopOrderList: [], // 购物车购买的数据
    addressInfo: '',//  保存要修改的地址

  },
  getters: {  // 过滤的方法, 类似computed
    isTabbarShow(state) {
      return state.isTabbarShow;
    },
    productOnes(state) {
      return state.productOnes;
    },
    shopnum(state) {
      state.shopnum = storage.get('shopnum') || 0;
      return state.shopnum;
    },
    userName(state) {
      state.userName = storage.get('userName') || ''; // 获得本地存储用户信息
      console.log(state.userName)
      return state.userName;
    },
    token(state) {
      state.token = storage.get('token') || ''; // 获得本地存储用户信息
      return state.token;
    },
    addressInfo(state) { // 获得修改的地址数据
      state.addressInfo = storage.get('ADDRESS') || '';
      return state.addressInfo
    },
    shopOrderList(state) { return state.shopOrderList },

  },
  mutations: { // 同步的提交方法(唯一修改state的方法)
    // ChangTabbarShow
    [type.CHANGE_TABBAR_SHOW](state, data) {
      state.isTabbarShow = data;
    },
    //productOneMutations
    [type.PRODUCTONE_MUTAIONS](state, newData) {
      state.productOnes = newData;
    },
    [type.SETSHOPNUM](state, newData) {
      storage.set('shopnum', newData)
      state.shopnum = newData;
    },
    [type.USERNAME](state, userName) {
      state.userName = userName;
      storage.set('userName', state.userName); //本地存储
    },
    // storage.remove("userName");
    [type.REMOVENAME](state) {
      state.userName = '';
      storage.remove("userName"); //本地存储 userName 的键
    },
    [type.SETTOKEN](state, token) {
      state.token = token;
      storage.set('token', state.token); //本地存储
    },

    [type.REMOVETOKEN](state) {
      state.token = '';
      storage.remove("token"); //本地存储 userName 的键
    },
    [type.ADDRESS_INFO](state, addressInfo) { // 保存修改的地址数据
      state.addressInfo = addressInfo
    },
    //  setShopList 存储购买的商品数据
    [type.SHOP_ORDER_LIST](state, shopOrderList) {
      state.shopOrderList = shopOrderList
    }
  },
  actions: { // 异步方法
    productOneAction(store, { data, id }) { // Action 提交的是 mutations，而不是直接变更状态
      let newData = store.state.productOnes;  // 拿旧的存储的值
      if (!newData[id]) {
        newData[id] = data // 加新数据
        store.commit(type.PRODUCTONE_MUTAIONS, newData);  // payload ajax结果
      }
    },
    // 保存要修改的地址
    setAddress(store, list) {
      storage.set('ADDRESS', list)
      store.commit(type.ADDRESS_INFO, list)
    },

    // 清楚要修改的地地址
    clearAddress(store) {
      storage.remove('ADDRESS')
      store.commit(type.ADDRESS_INFO, '')
    }
  }
})
