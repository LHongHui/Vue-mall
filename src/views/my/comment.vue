<template>
  <!-- 评价 -->
  <div class="evaluate-warp">
    <van-nav-bar title="评价中心" left-arrow @click-left="goback" />
    <van-tabs v-model="currentActive">
      <van-tab :title="val.title" v-for="val of tabs" :key="val.id">
        <Scroll class="scroll" v-if="currentActive == 0">
          <div class="warp">
            <div
              class="my-item"
              v-for="(val, index) in evaluateList"
              :key="index"
            >
              <div class="image">
                <router-link :to="'/productDetail/' + val.product_id">
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
                  <span @click="rate(val.product_id, val._id)"
                    ><van-icon name="chat" />评论晒单</span
                  >
                </div>
              </div>
            </div>
            <h6 v-if="!evaluateList.length" class="null">
              {{ userName ? "暂无待评价商品~~" : "请先登录噢~~" }}
            </h6>
          </div>
          <div
            v-show="loading"
            class="van-loading van-loading--circular van-loading--white"
            style="color: white"
          >
            <span class="van-loading__spinner van-loading__spinner--circular"
              ><svg viewBox="25 25 50 50" class="van-loading__circular">
                <circle cx="50" cy="50" r="20" fill="none"></circle></svg
            ></span>
          </div>
        </Scroll>

        <Scroll class="scroll" v-if="currentActive == 1">
          <div class="warp">
            <h6 v-if="!dataArr.length" class="noevaluate">
              {{ userName ? "暂无已评价商品~~" : "请先登录" }}
            </h6>
            <div class="my-item" v-for="(val, index) in dataArr" :key="index">
              <div class="image">
                <router-link :to="'/productDetail/' + val.goodList[0]._id">
                  <img :src="url + val.goodList[0].goods_img" />
                </router-link>
              </div>
              <div class="center">
                <div class="info">
                  <p class="title">{{ val.goodList[0].title }}</p>
                </div>
                <div class="proper">
                  <p class="time">{{ val.goodList[0].goods_position }}</p>
                </div>
                <div class="bottom">
                  <span class="span2" @click="aevaluated(val._id)"
                    ><van-icon name="search" />查看评价</span
                  >
                </div>
              </div>
            </div>
          </div>
          <div
            v-show="loading2"
            class="van-loading van-loading--circular van-loading--white"
            style="color: white"
          >
            <span class="van-loading__spinner van-loading__spinner--circular"
              ><svg viewBox="25 25 50 50" class="van-loading__circular">
                <circle cx="50" cy="50" r="20" fill="none"></circle></svg
            ></span>
          </div>
        </Scroll>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import storage from "@/assets/js/storage.js";
import Scroll from "@/components/Scroll";
import { page, vuexData } from "@/assets/js/mixin";
import config from "@/assets/js/config";
export default {
  name: "comment",
  mixins: [page, vuexData],
  components: {
    Scroll,
  },

  data() {
    return {
      url: config.api,
      currentActive: 0,
      tabs: [
        { id: 0, title: "待评价", status: 0 },
        { id: 1, title: "已评价", status: 1 },
      ],
      dataArr: [],
      evaluateList: [],
      count: 0,
      page: 1,
      page2: 1,
      alreadyEvaluatedList: "",
      loading: false,
      loading2: false,
      defaultImg: "",
    };
  },

  methods: {
    // 评价
    rate(cid, _id) {
      //  cid 商品id  _id 订单详情页的编号 (重要重要重要)
      //this.$router.push("/rate?id=" + id,); //商品id
      this.$router.push({
        name: "Rate",
        query: { cid },
        params: { _id },
      });
    },

    // 查看已评价
    aevaluated(_id) {
      this.$router.push("commented?_id=" + _id);
    },
    // 待评价
    async tobeEvaluated() {
      // async
      try {
        let res = await this.Api.tobeEvaluated(this.userName._id, this.page2);
        console.log(res.data.data);
        if (res.data.success) {
          this.evaluateList = res.data.data.list;
        } else {
          this.loading = false;
        }
      } catch (error) {
        this.$toast("网络错误");
      }
    },

    async alreadyEvaluated(flag) {
      this.loading2 = true;
      let res = await this.Api.alreadyEvaluated(this.userName._id, this.page);
      console.log(res.data.data);
      if (res.data.success) {
        this.loading2 = false;
        this.dataArr = res.data.data.list;
      } else {
        this.loading2 = false;
      }
    },
  },
  mounted() {
    if (!storage.get("token")) {
      this.$toast({
        message: "您尚未登录",
        className: "zindex",
      });
      this.showFlag = false;
      this.$router.push("/login");
      return;
    }
    this.tobeEvaluated();
    this.alreadyEvaluated();
  },

  beforeRouteEnter(to, from, next) {
    if (from.name === "Rate") {
      next((vm) => {
        vm.page = 1;
        vm.tobeEvaluated();
        vm.alreadyEvaluated();
      });
    } else {
      next();
    }
  },
};
</script>
<style lang="scss" scoped>
.evaluate-warp {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  background: #fff;
}

.evaluate-warp .scroll {
  position: fixed;
  top: 100px;
  bottom: 0px;
  left: 0;
  right: 0;
  overflow: hidden;
}
.evaluate-warp .scroll .warp {
  padding: 0px 10px;
  box-sizing: border-box;
}
.evaluate-warp .scroll .warp .item {
  display: flex;
  margin-top: 15px;
}
.evaluate-warp .scroll .warp .item:first-child {
  margin-top: 0;
}
.evaluate-warp .scroll .warp .item img {
  width: 30%;
  flex: 0 0 30%;
  height: 80px;
  object-fit: scale-down;
  margin-right: 10px;
  border-radius: 5px;
}
.evaluate-warp .scroll .warp .item div {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 5px 0;
  box-sizing: border-box;
}
.evaluate-warp .scroll .warp .item div p {
  line-height: 1.3;
  letter-spacing: 1px;
}
.evaluate-warp .scroll .warp .my-item .bottom > span {
  align-self: flex-end;
  border: 1px solid #f00;
  color: #f00;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 12px;
  position: relative;
  top: 5px;
  left: 100px;
}
.evaluate-warp .scroll .warp .my-item .bottom > span i {
  vertical-align: -1px;
  margin-right: 5px;
}
.evaluate-warp .scroll .warp .my-item .bottom .span2 {
  color: #333;
  border: 1px solid #666;
  position: relative;
  top: 5px;
  left: 160px;
}

.my-item {
  // display: flex;
  height: 100px;
  background: #fff;
  // padding: 10px 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 1px 3px 5px #979797;
}
.my-item .cat-button {
  height: 100px;
}
.mycheckbox {
  width: 10%;
  margin-top: 28px;
  zoom: 1.4;
  float: left;
}
.image {
  width: 20%;
  float: left;
  padding: 10px 0;
  margin: 0 5%;
}
.image img {
  height: 80px;
}
.center {
  width: 70%;
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
  // width: 30%;
  float: left;
  margin-right: 10%;
  border-radius: 3px;
  background: rgb(235, 235, 235);
}
.proper .time {
  // width: 40%;
  float: left;
  border-radius: 3px;
  background: rgb(235, 235, 235);
}
.bottom {
  width: 100%;
  height: 40px;
  padding-left: 8px;
  position: relative;
}
.bottom p {
  height: 30px;
  // width: 40%;
  color: #f00;
  float: left;
  line-height: 30px;
  font-weight: 700;
}
.bottom p span {
  font-size: 20px;
}
.productNum {
  // width: 60%;
  height: 30px;
  display: flex;
  align-items: center;
  float: right;
}
</style>

