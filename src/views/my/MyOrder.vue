
<template>
  <!-- 我的订单列表 -->
  <div class="order-warp">
    <van-nav-bar title="我的订单" left-arrow @click-left="goback" />
    <van-tabs v-model="currentActive" @change="change">
      <van-tab :title="val" v-for="(val, index) in tabs" :key="index">
        <Scroll v-show="!showFlag" class="scroll">
          <div class="wap">
            <div v-for="value in list" :key="value.order_id">
              <!--  0,待付款 1，待发货 2，待收货 3，评价 4，已完成 -->
              <div
                v-if="
                  currentActive == 0 ||
                  (currentActive == 4 && value.order_status == currentActive) ||
                  value.order_status + 1 == currentActive
                "
                class="list-warp"
              >
                <div class="top border-bottom">
                  <div>订单编号: {{ value.order_id }}</div>
                  <div class="order-ok">{{ status(value.order_status) }}</div>
                </div>
                <div class="list" v-for="val in value.orderList" :key="val._id">
                  <img
                    class="good-img"
                    :src="url + val.product_img"
                    :onerror="defaultImg"
                  />
                  <div class="good-title">{{ val.product_title }}</div>
                  <div class="good-count">
                    <p>￥{{ val.product_price }}</p>
                    <p class="count">x{{ val.product_num }}</p>
                  </div>
                </div>
                <div class="timre bottom border-top">
                  订单时间: {{ value.add_time | formatDate }}
                </div>
                <div class="bottom">收货地址: {{ value.address }}</div>
                <div class="bottom">
                  共 {{ value.orderList.length }} 件商品 合计:￥
                  <span style="color: red; font-size: 20px"
                    >{{ value.mallPrice }}.00</span
                  >
                </div>
                <div
                  class="timre bottom border-top"
                  v-if="value.order_status == 2"
                >
                  <button
                    @click="changeStatus(value._id)"
                    style="
                      width: 100px;
                      background: linear-gradient(to right, #ff6034, #ee0a24);
                      padding: 5px;
                      border-radius: 20px;
                      color: #fff;
                    "
                    ref="myOk"
                  >
                    确认收货
                  </button>
                </div>
                <div
                  class="timre bottom border-top"
                  v-if="value.order_status == 0"
                >
                  <button
                    @click="goPay(value.order_id)"
                    style="
                      width: 100px;
                      background: linear-gradient(to right, #ff6034, #ee0a24);
                      padding: 5px;
                      border-radius: 20px;
                      color: #fff;
                    "
                    ref="myOk"
                  >
                    去支付
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div v-if="!list.length && !showFlag" class="null">
            {{ userName && !showFlag ? "暂无订单~~" : "请先登录噢~~" }}
          </div>
        </Scroll>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import Scroll from "@/components/Scroll";
import { vuexData } from "@/assets/js/mixin";
import config from "@/assets/js/config";
export default {
  name: "MyOarder",
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
      url: config.api,
      currentActive: 0,
      list: "",
      defaultImg: "",
      tabs: ["全部", "待支付", "待发货", "待收货", "已完成"],
    };
  },
  components: {
    Scroll,
  },

  methods: {
    async changeStatus(_id) {
      const { data } = await this.Api.orderchangeToFinished2(_id);
      if (data.success) {
        this.$toast("确认收货");
        //this.$refs.myOk.innerHTML = "已完成";
      }
      window.location.reload();
    },
    goPay(orderId) {
      this.$router.push({
        name: "payment",
        query: { orderId: orderId },
      });
    },
    change(i) {
      this.currentActive = i;
    },

    status(status) {
      if (status == 0) {
        return "待支付";
      } else if (status == 1) {
        return "待发货";
      } else if (status == 2) {
        return "待收货";
      } else if (status == 4) {
        return "已完成";
      }
    },
    async getMyOrder() {
      try {
        this.showFlag = true;
        const { data } = await this.Api.getMyOrder(this.userName._id);

        if (data.success) {
          this.showFlag = false;
          this.list = data.list;
          console.log(this.list);
        } else {
          this.showFlag = false;
        }
      } catch (error) {
        this.$toast("网络错误");
        this.showFlag = false;
      }
    },
  },

  created() {
    let status = this.$route.query.status; // 接收 index.vue中的 status
    if (status) {
      this.currentActive = status;
    }
    this.getMyOrder();
  },
};
</script>
<style lang="scss" scoped>
.order-warp {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  background: #fff;
}
.order-warp .scroll {
  position: fixed;
  top: 84px;
  bottom: 0px;
  left: 0;
  right: 0;
  overflow: hidden;
  background: #f2f2f2;
}
.order-warp .scroll .wap {
  padding: 5px 0;
}
.order-warp .scroll .wap .list-warp {
  margin: 10px;
  box-sizing: border-box;
  padding: 15px 10px;
  background: #fff;
  border-radius: 10px;
}
.order-warp .scroll .wap .list-warp .top {
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
}
.order-warp .scroll .wap .list-warp .top .order-ok {
  color: #d2591b;
}
.order-warp .scroll .wap .list-warp .list {
  display: flex;
  height: 80px;
  margin-top: 15px;
  font-size: 0;
}
.order-warp .scroll .wap .list-warp .list .good-img {
  flex: 0 0 80px;
  width: 80px;
  height: 100%;
  border-radius: 10px;
  margin-right: 10px;
  border: 1px solid #eee;
}
.order-warp .scroll .wap .list-warp .list .good-title {
  flex: 1;
  margin-top: 3px;
  line-height: 1.4;
  font-size: 13px;
  letter-spacing: 0.5px;
  margin-right: 10px;
}
.order-warp .scroll .wap .list-warp .list .good-count {
  float: 0 0 15%;
  text-align: right;
  margin-top: 5px;
  font-size: 13px;
}
.order-warp .scroll .wap .list-warp .list .good-count .count {
  margin-top: 5px;
  color: #bbb;
}
.order-warp .scroll .wap .list-warp .bottom {
  text-align: right;
  margin-top: 10px;
}
.order-warp .scroll .wap .list-warp .timre {
  margin-top: 10px;
  padding-top: 10px;
}
</style>

