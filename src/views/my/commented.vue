<template>
  <!-- 查看已评价 -->
  <div class="aevaluated-warp">
    <van-nav-bar title="评价详情" left-arrow @click-left="goback" />
    <div v-if="evaluateOne" class="evaluateOne">
      <img :src="url + evaluateOne.user[0].avatar" alt srcset />
      <div class="middle">
        <span class="name" v-if="evaluateOne.anonymous == true">匿名用户</span>
        <span class="name" v-else>{{
          evaluateOne.user[0].nickname || evaluateOne.user[0].username
        }}</span>
        <p class="rate">
          <van-rate
            color="#e0322b"
            :size="size"
            readonly
            v-model="evaluateOne.rate"
          />
        </p>
      </div>
      <div class="time">{{ evaluateOne.comment_time }}</div>
    </div>
    <div class="content border-bottom">评价内容：{{ evaluateOne.content }}</div>
    <div class="img-content">
      图片：
      <img
        v-for="img of evaluateOne.images"
        class="img"
        :key="img"
        :src="url + img"
      />
    </div>
    <div class="goods" v-if="evaluateOne.goods">
      <img :src="url + evaluateOne.goods[0].goods_img" alt srcset />
      <p class="name">{{ evaluateOne.goods[0].title }}</p>
      <p class="cart" @click="addCard(evaluateOne.cid)">
        <van-icon name="cart" />
      </p>
    </div>
    <div class="btn">
      <van-button type="primary" size="large" @click="goback">返回</van-button>
    </div>
  </div>
</template>

<script>
import { vuexData } from "@/assets/js/mixin";
import config from "@/assets/js/config";
export default {
  mixins: [vuexData],
  name: "commented",
  data() {
    return {
      url: config.api,
      _id: "",
      evaluateOne: "",
      size: 14,
    };
  },

  methods: {
    async addCard(id) {
      if (!this.userName) {
        this.$router.push({ name: "Login" });
        return;
      }
      try {
        const { data } = await this.Api.addShop(id);
        if (data.code == 200) {
          this.$toast(data.msg);
        }
      } catch (error) {
        this.$toast("网络错误");
      }
    },
  },

  async created() {
    this._id = this.$route.query._id;
    try {
      let res = await this.Api.evaluateOne(this._id);
      console.log(res.data.data);
      if (res.data.success) {
        this.evaluateOne = res.data.data;
      }
    } catch (error) {
      this.$toast("网络错误");
    }
  },
};
</script>

<style lang="scss" scoped>
.aevaluated-warp {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  background: #fff;
}
.aevaluated-warp .evaluateOne {
  display: flex;
  padding: 0 10px;
  align-items: center;
  margin-top: 10px;
}
.aevaluated-warp .evaluateOne .middle {
  flex: 1;
}
.aevaluated-warp .evaluateOne img {
  width: 50px;
  margin-right: 15px;
  flex: 0 0 50px;
  height: 50px;
  border: 1px solid #eee;
  border-radius: 50%;
}
.aevaluated-warp .evaluateOne .name {
  display: block;
  margin-bottom: 10px;
}
.aevaluated-warp .evaluateOne .time {
  float: right;
  color: #666;
}
.aevaluated-warp .content {
  margin: 15px 10px 10px 10px;
  padding-bottom: 15px;
  line-height: 1.4;
  letter-spacing: 1px;
}
.aevaluated-warp .goods {
  display: flex;
  padding: 0 10px;
}
.aevaluated-warp .goods img {
  width: 55px;
  height: 50px;
  flex: 0 0 55px;
  margin-right: 10px;
}
.aevaluated-warp .goods .name {
  flex: 1;
  line-height: 1.6;
}
.aevaluated-warp .goods .cart {
  flex: 0 0 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  text-align: center;
  background: #ffe6e2;
  margin-left: 10px;
}
.aevaluated-warp .goods .cart i {
  font-size: 18px;
  color: #f00;
}
.aevaluated-warp .btn {
  width: 90%;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
}
.img-content {
  margin-left: 10px;
}
.img-content img {
  width: 150px;
  margin-bottom: 20px;
}
</style>

