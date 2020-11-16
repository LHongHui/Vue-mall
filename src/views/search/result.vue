<template>
  <div class="results">
    <div class="filter">
      <!--1.orderBy变量    2.通过点击把需要通过哪个字段排序传过去 到filter方法 -->

      <div
        class="item"
        :class="orderBy == '' ? 'active' : ''"
        @click="filter('')"
      >
        综合
      </div>
      <div
        class="item"
        :class="orderBy == 'is_new' ? 'active' : ''"
        @click="filter('is_new')"
      >
        最新
      </div>
      <div
        class="item"
        :class="orderBy == 'click_count' ? 'active' : ''"
        @click="filter('click_count')"
      >
        销量
      </div>
      <div
        class="item"
        :class="orderBy == 'shop_price' ? 'active' : ''"
        @click="filter('shop_price')"
      >
        价格
      </div>
    </div>
    <!-- <Scroll class="content">
      <div class="content-scroll"> -->
    <div v-if="listType == 1">
      <div v-for="(item, index) in results" :key="index">
        <router-link :to="'/productDetail/' + item._id" class="list1">
          <img :src="url + item.goods_img" width="80" class="img" />
          <div class="goods-info">
            <div class="title ellipsis">{{ item.title }}</div>
            <div class="price">¥ {{ item.shop_price }}</div>
            <div class="buy-info">
              <div class="num">已售出{{ item.click_count }}件</div>
              <img class="car" src="@/assets/svg/car.svg" />
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div v-if="listType == 2" class="list2-box">
      <div class="list2" v-for="(item, index) in results" :key="index">
        <router-link :to="'/productDetail/' + item._id">
          <img :src="url + item.goods_img" width="80" class="img" />
          <div class="goods-info">
            <div class="title">{{ item.title }}</div>
            <div class="price">¥ {{ item.shop_price }}</div>
            <div class="buy-info">
              <div class="num">已购{{ item.click_count }}件</div>
              <img class="car" src="@/assets/svg/car.svg" />
            </div>
          </div>
        </router-link>
      </div>
    </div>
    <div class="no-result" v-show="!results.length">
      <van-empty
        class="custom-image"
        image="https://img.yzcdn.cn/vant/custom-empty-image.png"
        description="没有内容,快去搜索"
      />
    </div>
    <!-- </div>
    </Scroll> -->
  </div>
</template>
<script>
import Scroll from "@/components/Scroll";
import config from "@/assets/js/config";
import { Empty } from "vant";
export default {
  name: "SearchResult",
  components: {
    Scroll,
  },
  data() {
    return {
      results: [], //搜索的结果数据
      url: config.api,
      orderBy: "",
    };
  },
  props: {
    //父传子传过来
    query: {
      type: String,
      default: "",
    },
    listType: {
      type: Number,
      default: 1,
    },
  },
  watch: {
    //监听属性 调用 接口
    query(query) {
      this.getResults(query, ""); //调取搜索结果的ajax
    },
  },
  methods: {
    async getResults(keyword, orderBy) {
      if (!keyword) {
        return;
      }
      console.log(orderBy);
      let res = await this.Api.search(keyword, orderBy);
      this.results = res.data.data;
    },
    async filter(orderBy) {
      this.orderBy = orderBy;
      await this.getResults(this.query, this.orderBy); //根据orderBy排序的值，再次调用接口
    },
  },
};
</script>
<style lang="scss" scoped>
.content {
  position: fixed; /*可视高度*/
  top: 198px;
  left: 0;
  right: 0;
  bottom: 60px;
  overflow: hidden;
}
.results_img {
  height: 100px;
}
.custom-image .van-empty__image {
  width: 90px;
  height: 90px;
}
.filter {
  height: 38px;
  line-height: 38px;
  display: flex;
  justify-content: space-around;
  background-color: #fff;
}

.filter .active {
  color: brown;
  border-bottom: 2px solid red;
}

.list1 {
  margin-top: 8px;
  width: 100%;
  height: 140px;
  display: flex;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
}
.list1 .img {
  width: 110px;
  height: 140px;
  flex-shrink: 0;
}
.list1 .goods-info {
  padding: 8px 16px 0 12px;
  width: 100%;
}
.list1 .goods-info .title {
  color: #333;
  font-size: 15px;
}
.ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.list1 .goods-info .price {
  color: #ff3b30;
  font-size: 17px;
}
.list1 .goods-info .buy-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list1 .goods-info .buy-info .num {
  font-size: 12px;
  color: #999999;
}
.list1 .goods-info .buy-info .car {
  position: absolute;
  right: 20px;
  bottom: 8px;
  width: 25px;
  height: 25px;
}

.list2-box {
  margin: 6px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.list2 {
  margin: 3px 0;
  width: 50%;
  background: #fff;
  border-radius: 15px;
  overflow: hidden;
  position: relative;
  padding: 10px;
}
.list2 .img {
  width: 100%;
  height: 175px;
}
.list2 .goods-info {
  padding: 8px;
}
.list2 .goods-info .title {
  color: #333;
  font-size: 15px;
}
.list2 .goods-info .price {
  color: #ff3b30;
  font-size: 17px;
}
.list2 .goods-info .buy-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list2 .goods-info .buy-info .num {
  font-size: 12px;
  color: #999999;
}
.list2 .goods-info .buy-info .car {
  width: 25px;
  height: 25px;
  position: absolute;
  right: 8px;
  bottom: 8px;
}
</style>