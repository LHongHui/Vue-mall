<template>
  <div>
    <van-nav-bar title="我的足迹" left-arrow @click-left="goback" />
    <van-swipe-cell :style="{ height: '100vh', overflowY: 'scroll' }">
      <div @click="jumpToHome()" v-if="browseFoot.length < 1">
        <van-empty
          class="custom-image"
          image="https://img.yzcdn.cn/vant/custom-empty-image.png"
          description="空空如也  点我去首页"
        />
      </div>

      <van-card
        v-else
        v-for="(item, index) in browseFoot"
        :key="index"
        :num="item.goods_number"
        :price="item.market_price"
        :title="item.title"
        class="goods-card"
        :thumb="url + item.goods_img"
        @click="jumpToDetail(item._id)"
      ></van-card>
    </van-swipe-cell>
  </div>
</template>

<script>
import { vuexData } from "@/assets/js/mixin";
import config from "@/assets/js/config";
export default {
  mixins: [vuexData],
  data() {
    return {
      userFoot: [],
      url: config.api,
      arr: "",
      filterFoot: [],
    };
  },
  async created() {
    this.userFoot = await this.Api.getFoot();
    this.ChangTabbarShow(false);
    this.userFoot = this.userFoot.data.data;
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    jumpToDetail(_id) {
      this.$router.push({ name: "productDetail", parame: _id });
    },

    jumpToHome() {
      this.$router.push("home");
    },
  },
  computed: {
    browseFoot() {
      this.userFoot.forEach((v, i) => {
        if (v.goods.length > 0) {
          this.filterFoot.push(v.goods[0]);
        }
      });
      return this.filterFoot;
    },
  },
  mounted() {
    this.ChangTabbarShow(false);
  },
  destroyed() {
    this.ChangTabbarShow(true);
  },
};
</script>

<style scoped>
.goods-card {
  margin: 0;
  background-color: #fff;
}

.delete-button {
  height: 100%;
}
</style>

