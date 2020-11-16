<template>
  <!-- 订单结算和选择商品页面 -->
  <div class="order">
    <van-nav-bar title="订单结算" class="nav" left-arrow @click-left="goBack" />
    <div class="address-warp">
      <div
        class="address addnull"
        v-if="!defaultAdd || !defaultAdd._id"
        @click="goAddress"
      >
        点击添加收获地址
      </div>
      <div class="address" v-else @click="editAddress">
        <div class="icon"><van-icon name="location" class="location" /></div>
        <div class="address-cont">
          <p class="address-e">
            <van-tag
              mark
              type="primary"
              color="red"
              style="width: 38px; height: 100%"
            >
              默认
            </van-tag>
            {{ defaultAdd.province }}
            {{ defaultAdd.city }}
            {{ defaultAdd.county }}
          </p>
          <p class="address-d">
            {{ defaultAdd.addressDetail }}
          </p>
          <p class="name">
            {{ defaultAdd.name }}
            <span>{{ defaultAdd.tel }}</span>
          </p>
          <p class="no">(收货不便时,可选择免费待收货服务)</p>
        </div>
        <div class="icon2"><van-icon name="arrow" class="location" /></div>
      </div>
      <img :src="caitiao" width="100%" height="2px" alt="" class="caitiao" />
      <Scroll class="scroll">
        <div class="goods-list">
          <div class="orders splitter">
            <div class="item" v-for="(item, key) in shopOrderList" :key="key">
              <div class="image">
                <router-link :to="'/productDetail/' + item.id">
                  <img :src="url + item.goods_img" />
                </router-link>
              </div>
              <div class="center">
                <div class="info">
                  <p class="title">{{ item.title }}</p>
                </div>
                <div class="proper">
                  <p class="position">{{ item.city }}</p>
                  <p class="time">{{ item.time }}</p>
                </div>
                <div class="bottom">
                  <p>
                    ¥<span>{{ item.price }}</span
                    >.00
                  </p>
                  <div class="productNum">{{ item.num }}张</div>
                </div>
              </div>
            </div>
            <div class="service_description">
              <van-cell is-link @click="showPopup" size="large">
                <div class="description-text">
                  <img
                    src="@/assets/svg/gantan.svg"
                    class="gantanimg"
                  />不支持退
                  <img
                    src="@/assets/svg/gantan.svg"
                    class="gantanimg"
                  />可邮寄票
                  <img
                    src="@/assets/svg/gantan.svg"
                    class="gantanimg"
                  />电子发票
                </div>
              </van-cell>

              <van-popup
                v-model="show"
                round
                position="bottom"
                :style="{ height: '70%' }"
              >
                <h1 class="sever-title">服务说明</h1>
                <div class="sever-box">
                  <h3><img src="@/assets/svg/dui.svg" class="duiimg" />预售</h3>
                  <div class="pasg">
                    本商品为预售商品，正式开票后将第一时间为您配票
                  </div>
                  <h3>
                    <img src="@/assets/svg/dui.svg" class="duiimg" />重要通知
                  </h3>
                  <div class="pasg">
                    预售期间，由于主办未正式开票，下单后无法立即为您配票。一般于演出前2-6周开票，待正式开票后，请您通过订单详情页或者票夹详情，查看票品信息、取票方式等演出相
                    单详情页或者票夹详情.
                  </div>
                  <h3>
                    <img src="@/assets/svg/dui.svg" class="duiimg" />不支持退
                  </h3>
                  <div class="pasg">
                    票品为有价证券，非普通商品，其背后承载的文化服务具有时效性，稀缺性等特征，不支持退换。
                  </div>
                  <h3>
                    <img src="@/assets/svg/dui.svg" class="duiimg" />快递票
                  </h3>
                  <div class="pasg">
                    快递票:纸质票会在开票后快递到您留下的收货地址,承担邮寄费用。注:离开演时间仅3天时，不再寄送快递票，支持在指定取票地点取票.
                  </div>
                  <h3>
                    <img src="@/assets/svg/dui.svg" class="duiimg" />纸质发票
                  </h3>
                  <div class="pasg">
                    该项目支持开具纸质发票，请您在演出开始前通过订单页补开，发票将在演出结束后1个月左右，统一由主办方提供
                  </div>
                </div>
              </van-popup>
              <van-coupon-cell
                :coupons="coupons"
                :chosen-coupon="chosenCoupon"
                @click="showList = true"
                title="优惠券"
                size="large"
              />
              <van-popup
                v-model="showList"
                round
                position="bottom"
                style="height: 70%; padding-top: 4px"
              >
                <van-coupon-list
                  :coupons="coupons"
                  :chosen-coupon="chosenCoupon"
                  :disabled-coupons="disabledCoupons"
                  @change="onChange"
                  @exchange="onExchange"
                />
              </van-popup>
              <van-cell-group @click="showExpress = true">
                <div v-if="radio == '1'">
                  <van-cell value="快递免邮" is-link size="large">
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #title>
                      <span class="custom-title">配送方式</span>
                      <van-tag type="danger">可邮寄</van-tag>
                    </template>
                  </van-cell>
                </div>
                <div v-else-if="radio == 2">
                  <van-cell value="次日送达(运费￥30元)" is-link size="large">
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #title>
                      <span class="custom-title">配送方式</span>
                      <van-tag type="danger">可邮寄</van-tag>
                    </template>
                  </van-cell>
                </div>
                <div v-else>
                  <van-cell value="现场自取" is-link size="large">
                    <!-- 使用 title 插槽来自定义标题 -->
                    <template #title>
                      <span class="custom-title">配送方式</span>
                      <van-tag type="danger">可邮寄</van-tag>
                    </template>
                  </van-cell>
                </div>
              </van-cell-group>
              <van-action-sheet
                v-model="showExpress"
                title="配送方式"
                cancel-text="确定"
                close-on-click-action
              >
                <van-radio-group v-model="radio">
                  <van-cell-group>
                    <van-cell title="快递免邮" clickable @click="radio = '1'">
                      <template #right-icon>
                        <van-radio name="1" />
                      </template>
                    </van-cell>
                    <van-cell
                      title="次日送达(运费￥30元)"
                      clickable
                      @click="radio = '2'"
                    >
                      <template #right-icon>
                        <van-radio name="2" />
                      </template>
                    </van-cell>
                    <van-cell title="现场自取">
                      <template #right-icon>
                        <van-radio name="3" disabled />
                      </template>
                    </van-cell>
                  </van-cell-group>
                </van-radio-group>
              </van-action-sheet>
            </div>
          </div>
        </div>
      </Scroll>
    </div>

    <div v-if="shopOrderList && shopOrderList.length">
      <van-submit-bar
        :loading="isLoading"
        :price="price"
        button-text="提交订单"
        @submit="onSubmit"
      />
    </div>
  </div>
</template>

<script>
import config from "@/assets/js/config";
import { vuexData } from "@/assets/js/mixin";
import Scroll from "@/components/Scroll";
import storage from "@/assets/js/storage";
import { Tag } from "vant";
const coupon1 = {
  available: 1,
  condition: "无使用门槛",
  reason: "",
  value: 4000,
  name: "全场通用",
  startAt: 1604223201,
  endAt: 1606901601,
  valueDesc: "40",
  unitDesc: "元",
};
const coupon2 = {
  available: 1,
  condition: "无使用门槛",
  reason: "优惠券已过期",
  value: 4000,
  name: "全场通用",
  startAt: 1598952801,
  endAt: 1601544801,
  valueDesc: "40",
  unitDesc: "元",
};
export default {
  name: "comfirmOrder",
  mixins: [vuexData],
  components: {
    Scroll,
  },

  data() {
    return {
      url: config.api,
      caitiao: require("@/assets/images/caitiao.jpg"),
      isLoading: false,
      list: [],
      defaultAdd: "",
      show: false,

      chosenCoupon: -1,
      coupons: [coupon1],
      disabledCoupons: [coupon2],
      showList: false,
      showExpress: false,
      radio: "1",
      freight: 0,
      discount: 0,
    };
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // this????
      vm.getDefaultAddress();
      if (!vm.shopOrderList.length) {
        vm.$router.push("/cart");
      }
    });
  },
  computed: {
    price() {
      let num = 0;
      if (this.shopOrderList.length) {
        this.shopOrderList.forEach((item) => {
          num += item.price * item.num;
        });
        if (this.radio == "2" && this.coupons[this.chosenCoupon] != null) {
          this.freight = 30;
          this.discount = this.coupons[this.chosenCoupon].value / 100;
          console.log("运费：" + this.freight, "| 优惠：" + this.discount);
          return Number(
            (num + 30 - this.coupons[this.chosenCoupon].value / 100).toFixed(
              2
            ) * 100
          );
        } else if (
          this.radio == "2" &&
          this.coupons[this.chosenCoupon] == null
        ) {
          this.freight = 30;
          this.discount = 0;
          console.log("运费：" + this.freight, "| 优惠：" + this.discount);
          return Number((num + 30).toFixed(2) * 100);
        } else if (
          this.radio != "2" &&
          this.coupons[this.chosenCoupon] != null
        ) {
          this.freight = 0;
          this.discount = this.coupons[this.chosenCoupon].value / 100;
          console.log("运费：" + this.freight, "| 优惠：" + this.discount);
          return Number(
            (num - this.coupons[this.chosenCoupon].value / 100).toFixed(2) * 100
          );
        } else {
          this.freight = 0;
          this.discount = 0;
          console.log("运费：" + this.freight, "| 优惠：" + this.discount);
          return Number(num.toFixed(2) * 100);
        }
      }
    },
  },

  methods: {
    // 查询默认收货地址
    async getDefaultAddress() {
      try {
        const { data } = await this.Api.getDefaultAddress(this.userName._id);
        if (data.success) {
          this.defaultAdd = data.defaultAdd;
        }
      } catch (error) {
        this.$toast("网络错误");
      }
    },

    goBack() {
      this.$router.go(-1);
      setTimeout(() => {
        this.setShopList([]);
        // this.setVuexAddress("");
      }, 300);
    },

    async onSubmit() {
      if (!this.defaultAdd) {
        this.$toast("请添加收获地址");
        return;
      }
      this.isLoading = true;
      // 传地址id，订单id，和总价格

      console.log(this.shopOrderList);
      //  001|5|红|l, 005|3|绿色|s,
      var itemStr = "";
      for (var i = 0; i < this.shopOrderList.length; i++) {
        var itemId = this.shopOrderList[i].id;
        var itemCounts = this.shopOrderList[i].num;
        var color = this.shopOrderList[i].color;
        var size = this.shopOrderList[i].size;
        var city = this.shopOrderList[i].city;
        var time = this.shopOrderList[i].time;
        var price = this.shopOrderList[i].price;
        var singleItem =
          itemId +
          "|" +
          itemCounts +
          "|" +
          color +
          "|" +
          size +
          "|" +
          city +
          "|" +
          time +
          "|" +
          price +
          ",";
        itemStr += singleItem;
      }

      try {
        const { data } = await this.Api.placeOrder({
          userId: this.userName._id,
          itemStr,
          address: this.defaultAdd._id,
          idDirect: this.shopOrderList[0].idDirect, //true 为立即购买
          freight: this.freight,
          discount: this.discount,
        });
        if (data.success) {
          this.isLoading = false;
          let orderId = data.data.orderId;
          setTimeout(() => {
            this.setShopList([]);
            // 将已经生成订单的商品，从本地存储的addGoods中拿走。
            if (!storage.get("token")) {
              let addGoodsList = storage.get("addGoods") || [];
              for (var i = 0; i < this.shopOrderList.length; i++) {
                var itemId = this.shopOrderList[i]._id;
                for (var j = 0; j < addGoodsList.length; j++) {
                  if (itemId == addGoodsList[j].id) {
                    addGoodsList.splice(j, 1);
                  }
                }
              }
              storage.set("addGoods", addGoodsList);
            }
            this.$router.push({
              name: "payment",
              query: { orderId: orderId },
            });
          }, 2000);
        }
      } catch (err) {
        this.isLoading = false;
        this.$toast("网络错误");
      }
    },

    // 添加收货地址
    goAddress() {
      this.$router.push("/Address");
    },

    // 选择地址
    editAddress() {
      this.$router.push("/Address");
    },

    // 弹出框
    showPopup() {
      this.show = true;
    },
    onChange(index) {
      this.showList = false;
      this.chosenCoupon = index;
    },
    onExchange(code) {
      this.coupons.push(coupon);
    },
  },
  mounted() {
    this.ChangTabbarShow(false); //注入 mixin.js
  },
  destroyed() {
    this.ChangTabbarShow(true);
  },
};
</script>

<style lang="css" scoped>
.nav {
  /* background-color: #dd4264; */
  height: 60px;
}
.order {
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0px;
  z-index: 500;
  /* background-color: #dd4264; */
}
.order .scroll {
  position: fixed;
  top: 180px;
  bottom: 50px;
  left: 0;
  right: 0;
  overflow: hidden;
  z-index: 200;
}
.order .address-warp .caitiao {
  height: 5px;
}
.order .address-warp .addnull {
  align-items: center;
  padding: 0 !important;
  justify-content: center;
  font-size: 14px;
}
.order .address-warp .address {
  display: flex;
  height: 100px;
  padding: 10px;
  padding-bottom: 0;
  background: #fff;
}
.order .address-warp .address .icon {
  flex: 0 0 30px;
  width: 30px;
  align-self: center;
  margin-right: 8px;
}
.order .address-warp .address .icon .location {
  font-size: 24px;
}
.order .address-warp .address .address-cont {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.order .address-warp .address .address-cont .name {
  font-size: 15px;
}
.order .address-warp .address .address-cont .name span {
  margin-left: 10px;
}
.order .address-warp .address .address-cont .address-e {
  font-size: 14px;
  margin-right: 5px;
  line-height: 1.4;
}
.order .address-warp .address .address-cont .address-d {
  font-size: 18px;
  margin-right: 5px;
  font-weight: bold;
  line-height: 1.4;
  width: 100px;
  min-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.order .address-warp .address .address-cont .no {
  color: #f9cc9d;
  font-size: 12px;
  letter-spacing: 1px;
  margin-top: -5px;
}
.order .address-warp .address .icon2 {
  flex: 0 0 10px;
  align-self: center;
}
.orders {
  display: flex;
  flex-direction: column;
}
.item {
  /* height: 100px; */
  background: #fff;
  margin-bottom: 15px;
  border-radius: 40px 0 40px 0;
  box-shadow: 2px 2px 5px #dd4264;
  overflow: hidden;
}
.image {
  width: 20%;
  float: left;
  padding: 10px 0;
  margin-left: 5%;
}
.image img {
  height: 80px;
}
.center {
  width: 75%;
  padding: 10px 10px;
  float: right;
}

.info {
  width: 100%;
  height: 25px;
  font: 15px/20px 微软雅黑;
}
.info .title {
  width: 100px;
  min-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.proper {
  width: 100%;
  height: 25px;
  font: 12px/20px 微软雅黑;
  padding-left: 8px;
}
.proper .position {
  float: left;
  margin-right: 10%;
  border-radius: 3px;
  background: rgb(235, 235, 235);
}
.proper .time {
  float: left;
  border-radius: 3px;
  background: rgb(235, 235, 235);
}
.bottom {
  width: 100%;
  height: 40px;
  padding-left: 8px;
}
.bottom p {
  height: 30px;
  color: #f00;
  float: left;
  line-height: 30px;
  font-weight: 700;
}
.bottom p span {
  font-size: 20px;
}
.productNum {
  height: 30px;
  display: flex;
  align-items: center;
  float: right;
}
.service_description {
  border-radius: 20px;
  overflow: hidden;
}
.description-box {
  display: flex;
  border-bottom: 1px solid rgb(206, 203, 203);
  width: 100%;
  height: 50px;
  justify-content: space-around;
  align-items: center;
}
.gantanimg {
  width: 15px;
  height: 15px;
  margin-top: 5px;
  margin-right: 1px;
}
.pasg {
  width: 100%;
  padding: 5px;
}
.duiimg {
  width: 20px;
  height: 20px;
}
.sever-box {
  padding: 20px;
}
.sever-box h3 {
  padding-top: 6px;
  padding-bottom: 6px;
  font-weight: 700;
}
.sever-box div {
  padding-left: 22px;
  line-height: 22px;
  font-size: 14px;
}
.sever-title {
  font-weight: 700;
  font-size: 20px;
  margin-left: 20px;
  padding-top: 20px;
  padding-bottom: 10px;
}
</style>
