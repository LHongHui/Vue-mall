<template>
  <div>
    <div class="success">
      <div class="top">
        <img class="success_img" src="@/assets/images/success.png" />
        <div class="s_right">
          <h1>支付成功</h1>
          <p>期待您再次光临</p>
        </div>
      </div>
      <div class="button">
        <van-button
          size="small"
          to="home"
          round
          color="linear-gradient(to right, #000, #bbb)"
        >
          回到首页
        </van-button>
        <van-button
          size="small"
          to="my"
          round
          color="linear-gradient(to right, #ff6034, #ee0a24)"
          style="margin-left: 20px"
        >
          查看订单
        </van-button>
      </div>
    </div>

    <div class="list-warp" v-if="orderResult">
      <div class="top border-bottom">
        <div>订单编号: {{ orderResult.order_id }}</div>
      </div>
      <div class="success_list" v-for="val in orderItemResult" :key="val._id">
        <div class="image">
          <router-link :to="'/productDetail/' + val._id">
            <img :src="url + val.product_img" />
          </router-link>
        </div>
        <div class="center">
          <div class="info">
            <p class="title">{{ val.product_title }}</p>
          </div>
          <div class="proper">
            <p class="position">{{ val.product_city }}</p>
            <p class="time">{{ val.product_time }}</p>
          </div>
          <div class="bottom">
            <p>
              ¥<span>{{ val.product_price }}</span
              >.00
            </p>
            <div class="productNum">{{ val.product_num }}张</div>
          </div>
        </div>
      </div>
      <div class="timre bottom border-top">
        订单时间: {{ orderResult.add_time | formatDate }}
      </div>
      <div class="bottom">收货地址：{{ orderResult.address }}</div>
      <div class="bottom">
        收货人：{{ orderResult.name }}
        <span style="margin-left: 10px">{{ orderResult.tel }}</span>
      </div>
      <div class="bottom">共 {{ orderItemResult.length }} 件商品</div>
      <div class="bottom price">
        合计:￥
        <span class="price"
          >{{
            orderResult.mallPrice + orderResult.freight - orderResult.discount
          }}.00</span
        >
      </div>
    </div>
  </div>
</template>


<script>
import { vuexData } from "@/assets/js/mixin";
import config from "@/assets/js/config";
import storage from "@/assets/js/storage";
export default {
  name: "success",
  mixins: [vuexData],
  filters: {
    formatDate: function (value) {
      let date = new Date(value);
      let y = date.getFullYear();
      let MM = date.getMonth() + 1;
      MM = MM < 10 ? "0" + MM : MM;
      let d = date.getDate();
      d = d < 10 ? "0" + d : d;
      let h = date.getHours();
      h = h < 10 ? "0" + h : h;
      let m = date.getMinutes();
      m = m < 10 ? "0" + m : m;
      let s = date.getSeconds();
      s = s < 10 ? "0" + s : s;
      return y + "-" + MM + "-" + d + " " + h + ":" + m + ":" + s;
    },
  },
  data() {
    return {
      orders: [],
      orderResult: null,
      orderItemResult: null,
      url: config.api,
    };
  },

  methods: {
    async getConfirmInfo() {
      const { data } = await this.Api.confirm(this.$route.query.orderId);
      console.log(data.data);
      if (data.success) {
        this.orderResult = data.data.orderResult;
        this.orderItemResult = data.data.orderItemResult;
      }
    },
  },
  mounted() {
    this.getConfirmInfo();
    this.ChangTabbarShow(false); //注入 mixin.js
  },
  destroyed() {
    this.ChangTabbarShow(true);
  },
};
</script>

<style lang="css">
.success {
  margin: 10px;
  border: 1px solid #eee;
  border-radius: 20px;
  background: #fff;
  font-size: 14px;
  padding: 20px 0;
}
.success .top {
  width: 220px;
  height: 85px;
  margin: 0 auto;
}
.success .top h1 {
  font-size: 30px;
  font-weight: 600;
}
.success .top p {
  font-size: 17px;
}
.success .button {
  margin: 0 auto;
  margin-top: 20px;
  width: 150px;
}
.success_img {
  width: 75px;
  height: 75px;
  float: left;
}

.list-warp {
  margin: 10px;
  box-sizing: border-box;
  padding: 15px 10px;
  background: #fff;
  border-radius: 10px;
}
.list-warp .top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}
.list-warp .top .order-ok {
  color: #d2591b;
}
.list-warp .list .good-img {
  flex: 0 0 80px;
  width: 80px;
  height: 100%;
  border-radius: 10px;
  margin-right: 10px;
  border: 1px solid #eee;
}
.list-warp .list .good-title {
  flex: 1;
  margin-top: 3px;
  line-height: 1.4;
  font-size: 13px;
  letter-spacing: 0.5px;
  margin-right: 10px;
}
.list-warp .list .good-count {
  float: 0 0 15%;
  text-align: right;
  margin-top: 5px;
  font-size: 13px;
}
.list-warp .list .good-count .count {
  margin-top: 5px;
  color: #bbb;
}
.list-warp .bottom {
  text-align: right;
  margin-top: 10px;
}
.list-warp .timre {
  margin-top: 10px;
  padding-top: 10px;
}
.navbar {
  background: linear-gradient(#eee, #ddd) !important; /*渐变*/
}
.section-payment {
  display: flex;
  height: 300px;
  flex-direction: column;
  background-color: #f2f5f8;
}
.cash-title {
  font: bold 16px 微软雅黑;
  padding: 30px 0 30px 10px;
}
.payment-list {
  display: flex;
  justify-content: space-around;
}
.payment-list li {
  width: 46%;
}

.success_list {
  height: 100px;
  background: #fff;
  border: 1px solid #dd4264;
  border-radius: 10px;
  margin-bottom: 10px;
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
  min-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
.bottom .price {
  color: red;
  font-size: 25px;
}
.productNum {
  height: 30px;
  display: flex;
  align-items: center;
  float: right;
}
</style>