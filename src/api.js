import axios from './assets/js/axios'
// 所有接口的api封装
export default class Api {
    /**
     * 首页(Home)所有接口
     * recommend            首页的默认数据
     *
     *
     */
    static recommend(page) {
        return axios(`/api/index/items/is_best?page=${page}`, 'get')
    }
    static carousels() {
        return axios('/api/index/carousels', 'get')
    }
    // ===============================================================================================================
    /**
     * 产品详情页
     * 通过商品_id查询  参数itemId
     */
    static goodsDetail(id) {
        return axios(`/api/items/searchById?itemId=${id}`, 'get')
    }

    /**
     * 产品分类
     * /cats
     * /items/searchByCat
     */
    static getCate() {
        return axios('/api/cats', 'get')
    }
    static getGoodsByCate(id) {
        return axios(`/api/items/searchByCat?catId=${id}`, 'get')
    }


    ///api/catesAndGoods  所有分类对应的商品

    static catesAndGoods() {
        return axios(`/api/catesAndGoods`, 'get')
    }
    /**
    * 搜索商品
    * /index/search
    *
    */
    static search(keyword, orderBy) {
        return axios(`/api/index/search?keyword=${keyword}&orderBy=${orderBy}`, 'get')
    }

    /**
   *通过多个 id 查找多个商品
   *
   */
    static getProducts(ids) {
        return axios(`/api/item/queryItems?itemIds=${ids}`, 'get')
    }


    // 通过color的id号找对应图库的图
    static getImageStore(_id, goodsId) {
        return axios(`/api/getImageStore?_id=${_id}&goodsId=${goodsId}`, 'get')
    }

    // 获得颜色和尺寸的值
    static getColorSize() {
        return axios(`/api/getColorSize`, 'get')
    }

    /* 登录或注册的接口*/
    static login(phone, password, verify,) {
        return axios('/api/login', 'post', {
            phone,
            password,
            verify
        })
    }

    /* 验证码接口*/
    static getAverify() {
        return `/api/verify?mt=${Math.random()}`
    }
    /**
     * 会员中心(My)所有接口
     * loginOut 退出登录
     * user     获取用户信息
     * saveUser 修改保存用户信息
     *
     */
    static loginOut() {
        return axios(`/api/loginOut`)
    }

    static user(_id) {
        return axios(`/api/queryUser?_id=${_id}`)
    }

    static saveUser({ ...args }) {
        return axios(`/api/saveUser`, 'post', args)
    }



    /*会员操作*/
    // 1. 收藏
    static userIsLike(itemId, _id) {
        return axios(`/api/item/userIsLike?itemId=${itemId}&_id=${_id}`, 'post')
    }
    static userLike(itemId, _id) {
        return axios(`/api/item/like?itemId=${itemId}&_id=${_id}`, 'post')
    }

    static userunLike(itemId, _id) {
        return axios(`/api/item/unlike?itemId=${itemId}&_id=${_id}`, 'post')
    }

    static getCollection(page, _id) {
        return axios(`/api/items/goodsFavList?page=${page}&_id=${_id}`, 'post')
    }

    //  评论


    static comment({ ...args }) {
        return axios(`/api/goodsOne/comment`, 'post', args)
    }

    static alreadyEvaluated(_id, page = 1) {
        return axios(`/api/alreadyEvaluated?page=${page}&_id=${_id}`, 'post')
    }

    static tobeEvaluated(_id, page = 1) {
        return axios(`/api/tobeEvaluated?page=${page}&_id=${_id}`, 'post')
    }

    static evaluateOne(_id) { // 评论编号id
        return axios('/api/evaluateOne', 'post', {
            _id
        })
    }


    //浏览历史
    static addFoot(_id) {
        return axios(`/api/addFoot`, 'post', { _id })
    }
    static getFoot() {
        return axios(`/api/getFoot`, 'post')
    }


    // 购物车接口
    static getShop(_id) {
        return axios(`/api/getShop?_id=${_id}`, 'post')
    }

    static addShop(_id, id, num, check, color, size, city, time, price) {
        return axios(`/api/addShop?_id=${_id}`, 'post', { id, color, size, city, time, price, num, check })
    }

    static editCart(_id, num, id, check, color, size, city, time, price) {
        return axios(`/api/editCart?_id=${_id}`, 'post', {
            num,
            id,
            check,
            color,
            size,
            city,
            time,
            price
        })
    }

    static deleteShop(_id, id, color, size, city, time, price) {
        return axios(`/api/deleteShop?_id=${_id}`, 'post', { id, color, size, city, time, price })
    }

    // 地址管理
    static getAddress(uid) {
        return axios(`/api/getAddress?uid=${uid}`, 'get')
    }

    static getDefaultAddress(uid) {
        return axios(`/api/getDefaultAddress?uid=${uid}`, 'get')
    }

    static setDefaultAddress(id, uid) {
        return axios(`/api/setDefaultAddress?uid=${uid}`, 'post', { id })
    }

    static postAddress({ ...args }) {
        return axios(`/api/address`, 'post', args)
    }

    static deleteAddress(id, uid) {
        return axios(`/api/deleteAddress?uid=${uid}`, 'post', {
            id
        })
    }

    //生成訂單

    // ===============================================================================================================
    /**
     * 购物车支付页面(ShoppingPayMent)所有接口
     * placeOrder 提交订单 itemStr( 001|5|红|l, 005|3|绿色|s,) ,userId, idDirect:用来判断是购物车结算还是直接购买
     */
    static placeOrder({ ...args }) { //生成订单
        return axios('/api/order', 'post', args)
    }

    static getMyOrder(uid) {
        return axios(`/api/myOrder?uid=${uid}`, 'get')
    }
    static getOrderNum(uid) {
        return axios(`/api/orderNum?uid=${uid}`, 'get')
    }

    /*
       支付管理
    */
    static confirm(id) {
        return axios(`/api/confirm?id=${id}`, 'get')
    }
    static alipaypay() {
        return axios(`/api/alipay/pay`, 'get')
    }
    static alipayReturn() {
        return axios(`/api/alipay/alipayReturn`, 'get')
    }


    static changeOrderInfo(order_id) {
        return axios(`/api/alipay/changeOrderInfo?order_id=${order_id}`, 'get')
    }
    // /api/alipay/orderchangeToFinished2

    static orderchangeToFinished2(_id) {
        return axios(`/api/alipay/orderchangeToFinished2?orderId=${_id}`, 'get')
    }

}
