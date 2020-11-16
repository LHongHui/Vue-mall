<template>
  <div>
    <van-nav-bar title="快递信息" left-arrow @click-left="$router.go(-1)" />

    <div
      v-for="(item, index) in wait"
      :key="index"
      :style="{
        marginBottom: '20px',
      }"
    >
      <van-swipe-cell :style="{ overflowY: 'scroll' }">
        <van-card
          :num="item.orderList[0].product_num"
          :price="item.orderList[0].product_price"
          :title="item.orderList[0].product_title"
          class="goods-card"
          :thumb="url + item.orderList[0].product_img"
          @click="jumpToDetail(item._id)"
          :style="{
            borderTopLeftRadius: '20px 20px',
            borderTopRightRadius: '20px 20px',
          }"
        ></van-card>
      </van-swipe-cell>
      <van-steps direction="vertical" :active="1">
        <van-step>
          <h3>【城市】{{ item.address }}</h3>
          <p>2020-11-11 10:25</p>
        </van-step>
        <van-step>
          <h3>【城市】物流状态2</h3>
          <p>2020-11-10 08:40</p>
        </van-step>
        <van-step>
          <h3>快件已发货</h3>
          <p>2020-11-09 09:35</p>
        </van-step>
      </van-steps>
    </div>
  </div>
</template>

<script>
import config from "@/assets/js/config";
import { vuexData } from "@/assets/js/mixin";
export default {
  mixins: [vuexData],
  data() {
    return {
      wait: [],
      url: config.api,
    };
  },
  async created() {
    this.ChangTabbarShow(false);
    const { data } = await this.Api.getOrderNum(this.userName._id);
    data.res.forEach((v, i) => {
      if (v.order_status == 2) {
        this.wait.push(v);
      }
    });
  },
  methods: {},
  mounted() {
    this.ChangTabbarShow(false);
  },
  destroyed() {
    this.ChangTabbarShow(true);
  },
};
</script>

<style>
</style>
