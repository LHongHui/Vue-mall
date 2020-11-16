<template>
  <div>
    <van-nav-bar title="订单结算" class="nav" left-arrow @click-left="goback" />
    <div class="list-warp" v-if="orderResult">
      <div class="top border-bottom">
        <div>订单编号: {{ orderResult.order_id }}</div>
      </div>
      <div class="payment_list" v-for="val in orderItemResult" :key="val._id">
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
      <div class="bottom">运费：￥{{ orderResult.freight }}</div>
      <div class="bottom">优惠：￥{{ orderResult.discount }}</div>
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

    <!-- <div class="section section-payment">
      <div class="cash-title">选择以下支付方式付款</div>
      <div class="payment-box">
        <div class="payment-body">
          <ul class="payment-list">
            <li class="J_bank" id="alipay">
              <a target="_blank" @click="payment">
                <img
                  src="@/assets/images/payOnline_zfb.png"
                  alt="支付宝"
                  style="margin-left: 0"
                />
              </a>
            </li>
            <li id="weixinPay">
              <img
                src="@/assets/images/weixinpay0701.png"
                alt="微信支付"
                style="margin-left: 0"
              />
            </li>
          </ul>
        </div>
      </div>
    </div> -->
    <div class="md-example-child md-example-child-cashier">
      <md-button @click="isCashierhow = !isCashierhow">订单支付</md-button>
      <md-cashier
        ref="cashier"
        v-model="isCashierhow"
        :channels="cashierChannels"
        :channel-limit="2"
        maxlength="6"
        :payment-amount="cashierAmount"
        payment-describe="关于支付金额的特殊说明"
        large-radius
        @select="onCashierSelect"
        @pay="onCashierPay"
        @cancel="onCashierCancel"
      ></md-cashier>
    </div>
  </div>
</template>
<script>
import config from "@/assets/js/config";
import { vuexData } from "@/assets/js/mixin";
import Scroll from "@/components/Scroll";
import storage from "@/assets/js/storage";
import "mand-mobile/lib/mand-mobile.css";
import {
  Button,
  RadioList,
  Field,
  FieldItem,
  InputItem,
  Switch,
  Cashier,
  Toast,
} from "mand-mobile";
export default {
  name: "payment",
  mixins: [vuexData],
  components: {
    Scroll,
    [Button.name]: Button,
    [RadioList.name]: RadioList,
    [Field.name]: Field,
    [FieldItem.name]: FieldItem,
    [InputItem.name]: InputItem,
    [Switch.name]: Switch,
    [Cashier.name]: Cashier,
  },
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

      isCashierhow: false,
      isCashierCaptcha: true,
      cashierAmount: "100.00",
      cashierResult1: "success",
      cashierResult2: "fail",
      cashierResults: [
        {
          text: "支付成功",
          value: "success",
        },
        {
          text: "支付失败",
          value: "fail",
        },
      ],
      cashierChannels: [
        {
          icon: "rmb",
          text: "招商银行(0056)",
          value: "001",
        },
        {
          icon: "rmb",
          text: "支付宝支付",
          value: "002",
        },
        {
          icon: "rmb",
          text: "微信支付",
          value: "003",
        },
        {
          icon: "rmb",
          text: "QQ钱包支付",
          value: "004",
        },
        {
          icon: "rmb",
          text: "一网通支付",
          value: "005",
        },
      ],
    };
  },
  computed: {
    cashier() {
      return this.$refs.cashier;
    },
  },
  mounted() {
    if (!storage.get("token")) {
      this.orderList = [];
    } else {
      this.getConfirmInfo();
    }
    this.ChangTabbarShow(false); //注入 mixin.js
  },
  methods: {
    async getConfirmInfo() {
      const { data } = await this.Api.confirm(this.$route.query.orderId);
      console.log(data.data);
      if (data.success) {
        this.orderResult = data.data.orderResult;
        this.orderItemResult = data.data.orderItemResult;
        this.cashierAmount =
          data.data.orderResult.mallPrice +
          data.data.orderResult.freight -
          data.data.orderResult.discount +
          ".00";
      }
    },
    async getEditConfirmInfo() {
      try {
        const { data } = await this.Api.changeOrderInfo(
          this.$route.query.orderId
        );
        if (data.success) {
          console.log("订单支付成功");
        }
      } catch (error) {
        console.log("网络错误");
      }
    },
    // async payment() {
    //   if (!storage.get("token")) {
    //     this.orderList = [];
    //   } else {
    //     const { data } = await this.Api.alipaypay(this.$route.query.orderId);
    //     if (data.success) {
    //       console.log(data.data);
    //       location.href = data.data; // 拿到拉取支付的地址并且打开支付界面
    //     }
    //   }
    // },

    doPay() {
      if (this.isCashierCaptcha) {
        this.cashier.next("captcha", {
          text: "请输入支付密码",
          autoCountdown: false,
          maxlength: 6,
          count: 0,
          Mask: true,
          onSubmit: (code) => {
            console.log(`[Mand Mobile] Send Submit ${code}`);
            this.checkCaptcha(code).then((res) => {
              if (res) {
                this.createPay().then(() => {
                  if (code == 123456) {
                    this.getEditConfirmInfo();
                    this.cashier.next(this.cashierResult1, {
                      buttonText: "确定",
                      handler: () => {
                        this.isCashierhow = false;
                        this.$router.push({
                          name: "success",
                          query: { orderId: this.$route.query.orderId },
                        });
                      },
                    });
                  } else {
                    this.cashier.next(this.cashierResult2, {
                      buttonText: "确定",
                      handler: () => {
                        this.isCashierhow = false;
                      },
                    });
                  }
                });
              }
            });
          },
        });
      } else {
        this.createPay().then(() => {
          this.cashier.next(this.cashierResult, {
            buttonText: "确定",
            handler: () => {
              this.isCashierhow = false;
              Toast.info(`${this.cashierResult}点击`);
            },
          });
        });
      }
    },
    // Create a pay request & check pay result
    createPay() {
      this.cashier.next("loading");
      return new Promise((resolve) => {
        this.timer = setTimeout(() => {
          resolve();
        }, 3000);
      });
    },
    // Create a captcha sending request
    sendCaptcha() {
      return new Promise((resolve) => {
        this.timer = setTimeout(() => {
          resolve();
        }, 200);
      });
    },
    // Create a captcha checking request
    checkCaptcha(code) {
      return new Promise((resolve) => {
        this.timer = setTimeout(() => {
          resolve(!!code);
        }, 200);
      });
    },
    onCashierSelect(item) {
      console.log(`[Mand Mobile] Select ${JSON.stringify(item)}`);
    },
    onCashierPay(item) {
      console.log(`[Mand Mobile] Pay ${JSON.stringify(item)}`);
      this.doPay();
    },
    onCashierCancel() {
      // Abort pay request or checking request
      this.timer && clearTimeout(this.timer);
    },
  },
};
</script>

<style lang="scss" scoped>
.nav {
  height: 60px;
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
// .list-warp .list {
//   display: flex;
//   height: 100px;
//   margin-top: 15px;
//   font-size: 0;
// }
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
  margin-top: 20px;
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

.payment_list {
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
  height: 30px;
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

.md-example-child-cashier {
  width: 90%;
  border-radius: 20px;
  margin: 0 5%;
  margin-bottom: 5px;
  overflow: hidden;
  position: fixed;
  bottom: 0;
}
.md-button {
  height: 40px;
  line-height: 40px;
  width: 100%;
  background-color: #ee0a24;
  color: #fff;
  border-radius: 20px;
  font-size: 16px;
}
.md-cashier .md-popup-title-bar {
  height: 60px;
}
.md-example-child-cashier .md-cashier-channel-item .item-icon.cashier-icon-1 {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAABHklEQVR4Ae2WgUYEURSGh70oQIB6gh6gHmBsqhfqHdq2hAJTUYAACMCytqQISUDAVpsEsWi09TX/XFcxYeJ0E/vzMf4z7uc6cJMQWi6l1egU5AUYkfszXZp8TVFmBfwyWbhZU0UcXKrbdWMJ5ZLwNaIwl5CY1BPen8HgAtoT1dn6pJ/dnRoKn64p01mpztQpj1eGwsNlyuTPsDX92W/P+A70j6FQ3BxR5nI3dP4bNDPeochmYZTD+xvsz8HBvP8evWhmLvScb1Cm3/Mo6sLcXLg5BcMHQhgO1BkL+8fUjP6NLLw9MRB+R0h19h+F4x3WYSystVe/rx/zJ0+MXtxHVNstxBO6ZqKw2tiLINxJQrzULenKxjvVWV3W3GLwfAD9KR4TBA12SgAAAABJRU5ErkJggg==);
  background-size: 26px;
}
.md-example-child-cashier .md-cashier-channel-item .item-icon.cashier-icon-2 {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAB7ElEQVR4Ac2WA6weQRSFb62gtuPajetGtW0FNcO6cVK7XdRu2Ia149R2Z6bP9r6T+yb5bZ7k/Bh9gzt3l1hXfzUiS+4iU36GK2AnTq6AP/PYJ/42JhZ+oPAp7CTWYDDUVHu4IDneCaD8kkTgV4r4zA5+akBuivhMI56llyLv768wXkpfYNK3NGXAaHQhpxlHY9KAlpwc6Qojt6W2urZYnYoFWA5XhWhTSaf/dmHYDqc2/v+NFPiZDLmKzv7pxAPAZIvWZPwbjrqN8B242LU6edUtgMZGGjS3XI8R6IRTj/yI2xhiPNofA7CPCyiuRAL8wM9FUy6AH8I5urwE/gwb8FSdS311+ldz1KsIgGIpmWpNGEGSQYbaC7f1gWIyPClD3uaJBgWeld3x/S3MyCwkWwz1AfqsWCzV8EIfIAeJqd6GAcuHx7oFylz4AVlqGl116gQ/c3HABTTkFH1pywPD1Esy//V0wdQMlJe6Rex3MtQ2OvO/fRgZXbziGVqqP+CmXm0m/AED2WT9G0GOU4sg/sYVCZLCyngrLTHRJ9K9Gl4jWzShYDoj+5Ih7keQiSQWcwgTHqKBPrP8wanK/D+QLzwOH4DeOgDu+maeiPwmBS9RuFNJA1pyV9JfhF33BHS9vZVxhFTWjCn2kYZVAyRlGm3AoxGeAAAAAElFTkSuQmCC")
    center no-repeat;
  background-size: 26px;
}
.md-example-child-cashier .md-cashier-channel-item .item-icon.cashier-icon-3 {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAYCAYAAADpnJ2CAAABiklEQVR4AbWVAWRCURSGf8gIGQyYgUEAgyAAbCCAAAQQGBAYIGAwAAgIwAMJGIsqRTAgQPAQEsKDu//kXHLddV+v+w6f0HnvP/e8/5yLYPzgAXN0yICsSUoyZUeW+l/nlFs45miSRF9scpKRBDM0rhGqacXmRobhE8/wwsQtMZHYyjv/E2swYU9MZPZW1DVGWoLYEQt88ffR/W7DyEIHCn3ab4gVKpjhzbayHlOI9K2QHqZFNsSctKSSCEI78oE17h1PTJy8PnRwjYdNjlanpEdqsLHC04XnltA2+KuWiudoe9y7xQLvWKF6JlSVE5DjxZZf3CRs91nV3zqjXYxw55iuk9PlGQKJGaZ4hoR123lM8cqc3yu+dSqC40BS4lkSdf9zQcY4tSic2LQLQgc5K+jmrl3Wu0DiUkxy4+o72LEJnDISUrDjtKREwTHc0DkalSA2sfPqE62oKWKJDWRmgzd+BKENaUGjLMGjzmbbLoiigmvSk/tMnKa3y0DQ9vdIM9S6gKCK6FqLGX+Ik2Cgy7oRZQAAAABJRU5ErkJggg==")
    center no-repeat;
  background-size: 26px;
}
.md-example-child-cashier .md-cashier-channel-item .item-icon.cashier-icon-4 {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAcCAYAAAB75n/uAAADaElEQVR4AWIgADiAOAaI1wDxUxZAadUA5GoTBCd59Wzbtm3btm3btm3btm3btt/5+v/6uLXRl/q7qu+SRc/OzKbXIhAh5ZXB1QZLyf8ANz+noAseNZhc3ETb4NOaocUiX+JFlYJiEuU1cdNBzGQSjbVWN3bu3BkHDx5EgQIFQsb69u2LjRs3IkWKFHqgE+ICndUNFCB27drFIBxDoUKFcP/+fZLj9rIpL05wVV1co0YNEBQdP3484sWLx9OjXbt2JD5//mwvwBaHV1KvPctCsEyLFy9GxIgRQeErV67g2rVrePz4sf1eOEBGLtB56tQpEPPmzQO/x4gRAx8+fADRvXt3R02PJnaQw97inKnCYkiLTBjf2IJ5bQTkxJax0KdpdiSPK44CxBcdk5LE7qqWaGxDwZv5AmxyzjtTLKiVP3QfNfakTVBZdDzOHHPDhESREBxkQA3Br4Vh8WlyJAr568Leq634MC4yPs63onz2UPEVySL7vswcc6LoeJIx+vPXmWNgW8ooSBs+DDcgY2LBoYEWvBoaDVeaJMSNlvFD+G5sZJYLsaMGlTJiGOxPFRXUuJ8x+nnREO16+ui+nAzm4qSRUT5qWES2Bpbg7OCwuNcjJok1nawMzjlUix4Oq5NHhrr3WJqonnqj5/HUJ9IEnkAnx5n6rMSRQFLQ0VpmkSSslVlNkyAkD647/y8pkx9vC6XiYrf4tnh6dEocHapWsDdNVK/Y/Pnz8XvdYlOiH6rlx7fh3eFx8iDg54uyZcvq13W8jT1s3boVPyYPVYXg/+8vfJ4/htedayT42d/TAzoaNmyoB7gquj3QJXkqNQBPZwZ6gCBtgcpp06bZBPD79QMmQFNUhYMpj4M+dOYEHdT3y0f8nDsBX3u3wpdujU1l4OHhgQgRIsBqld+K7VNbBgU1mlhNx6SZuYtVq1ZRUL2e04TaGuLTbmnP7uDv379Ily4dxZ/bOqkGPt5Mk802i+bNm4MHy5ZccokzYJOMN/jn6WxBscxhwVfM29sbjsBSsmclMoc47x9q2BffLP00x/TfM0DQvkYqjB45BHyT+Q7zNeNvpWuntmhUIgq4RtsHaokObJS2nHRAf2a1s5/s3NFXtvOzauE6qeWoRHUMHjT4mQJBfGpws8HKyrrKHOOcso57DlJDFPwHtUxGlWBNgLkAAAAASUVORK5CYII=")
    center no-repeat;
  background-size: 26px;
}
.md-example-child-cashier .md-cashier-channel-item .item-icon.cashier-icon-5 {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAABPlBMVEUAAAC/AEDIFS3GFS3HFS3HFS3HFS3MADPGFC7GFS3FFSvHFS3GFS3HFS3HFS3KIjnooKnmmKPJHDTMLELqqLHmlaDIGjHONEnssLjkjJjHFi7////hgI3rqrLdcoDwwsjUS17KITjed4T44+XIGC/LJz3++fr119vQPFD//v7NMEXgf43ca3r78PLZX3DVUWPpoavut77IGTD44+bxxszmlqHxw8nHFy/44OPttr3LJjz99/jaZXXXWWrhgY7+/P3//f3XV2jzzdPgf4zut7/nmqTxxMrllJ/yyM7dcH/++vvMK0HWUmTQO0/ZYXHba3r77vDJHTTts7v22Nzxxcv55OffdoXed4XRP1PedIPaZHThg5D11dnVTmDJHzb77e/55+rLJj377/Hqp7DkjprTRlnlkZzRPlLNL0TXVmdZnHwTAAAAD3RSTlMABEqUzPH/BXDmMNZV+P145yZGAAABMklEQVR4AXTQ02KcARCG4Z/v2t5vVdv2to1t2/d/BcnEfE7H45xxPT8IIQx8z3WuikRjnItFI5dj8QRXJOIXsWSKa1LJ81iaG9Kn0XiKW6TiFoskuFXCtopyh+jRfTFMJpvLA4ViqQxUqrU6MdfxwJSkBtCUWkBb6oDn+Jh796UHD3n0WHoCT6Vnz8F3AsyLl6+k1zQk6Q1vpXdA4IQWe//h4yfp85evFvz2/YdlQOhgfkq/nkm/pT9S96/1NifBf9L/HpnePql/QIMYa0tHGhoekRkdk16NT0yCtQ2AKalIfVrSDO9npbl5TGCnPO9KC7AoaQmWpRUwvj1hVWoDa+vaKMPmlrbBePa+LzvVCsDu3j7AweEyxSAJghFfwOONMnyRjS+Z4Etg+JIm4USNNzsAAPHdK2mIKv4bAAAAAElFTkSuQmCC")
    center no-repeat;
  background-size: 26px;
}
</style>
