import { mapMutations, mapGetters, mapActions } from 'vuex'
import storage from "@/assets/js/storage.js";
export const vuexData = {
    data() {
        return {
            loading2: true
        }
    },
    computed: {
        ...mapGetters([
            'isTabbarShow',
            'productOnes',
            'userName',
            'token',
            'addressInfo',
            'shopOrderList',
            'shopnum'
        ])
    },

    methods: {
        ...mapMutations({
            ChangTabbarShow: "ChangTabbarShow",
            setName: "setName",
            removeName: "removeName",
            setToken: "setToken",
            removeToken: "removeToken",

            setAddress2: 'setAddress2',
            setShopList: "setShopList",
            setShopnum: 'setShopnum'

        }),

        ...mapActions([
            'productOneAction', // 以前访问： this.$store.dispatch('productOneAction,{data,id})
            // 现在访问 this.productOneAction({data,id}),
            'setAddress',
            'clearAddress',
        ]),

        //返回上一页或者首页

        goback() {
            this.$router.animate = 1;
            this.$router.go(-1);
        },
        // 获得 徽标数量
        async getShopNum() {

            if (!storage.get("token")) {
                this.addGoods = storage.get("addGoods") || [];
                let sum = 0;
                for (var key in this.addGoods) {
                    sum += this.addGoods[key].num;
                }
                console.log(sum);
                this.setShopnum(sum); // vuex
            } else {
                const { data } = await this.Api.getShop(this.userName._id);
                console.log(data);
                this.setShopnum(data.totalNumber);
            }
            this.flag = true;
        }

    },
}
export const page = {
    data() {
        return {
            dataArr: [],
            total: null,
            loading: false, // 锁
        }
    },

    methods: {
        // newArr, 第二页请求到的数据
        setNewData(newArr) {
            this.dataArr = this.dataArr.concat(newArr)
        },

        // 起始的记录数
        getCurrentStart() {
            return this.dataArr.length
        },

        // 是否还有更多数据加载
        hasMore() {
            // 说明没有数据要加载了
            if (this.dataArr.length >= this.total) {
                return false
            }
            return true
        },

        // 总条数
        setTotal(total) {
            this.total = total
        },

        // 清空数组
        clearArr() {
            this.setData({
                dataArr: []
            })
            this.total = null
        },

        // 锁的机制
        isLocked() {
            return this.loading ? true : false
        },

        // 加锁
        locked() {
            this.loading = true
        },

        unLocked() {
            this.loading = false
        }
    }
}


