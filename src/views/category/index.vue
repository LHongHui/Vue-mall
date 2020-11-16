<template>
  <div class="category">
    <!-- 分类页navbar -->
    <nav-bar>
      <div slot="left">
        <i class="iconfont icon-fanhui" @click="goback"></i>
      </div>
      <div slot="center">分类</div>
    </nav-bar>
    <!-- Tab切换 -->
    <Scroll class="content" :pullup="true">
      <van-tabs @click="switchTab" animated v-model="tabs_index">
        <van-tab v-for="(item, key1) in titles" :key="key1" :title="item.title">
          <!-- 图片展示 -->
          <div class="content">
            <div class="list" v-if="contents.length > 0">
              <ul v-for="(item, key2) in contents" :key="key2">
                <router-link :to="'/productDetail/' + item._id">
                  <!-- <div>点击量{{ item.click_count }}</div> -->
                  <div>
                    <img :src="url + item.goods_img" alt="" />
                  </div>
                  <!-- <li>{{ item.title }}</li> -->
                </router-link>
              </ul>
            </div>
            <div v-else>没有更多数据了</div>
          </div>
        </van-tab>
      </van-tabs>
    </Scroll>
  </div>
</template>

<script>
import storage from "@/assets/js/storage.js";
import config from "@/assets/js/config.js";
import navBar from "@/components/navbar.vue";
import { vuexData } from "@/assets/js/mixin.js";
import Scroll from "@/components/Scroll";

import Vue from "vue";
import { Grid, GridItem } from "vant";
Vue.use(Grid);
Vue.use(GridItem);

export default {
  name: "category",
  components: {
    navBar,
    Scroll,
  },
  data() {
    return {
      categoryId: null,
      categoryTitle: null,
      index: "",
      tabs_index: 0,
      titles: [],
      contents: [],
      url: config.api,
      navBarFixed: false, // bar浮动
    };
  },
  methods: {
    async getCateTitle() {
      let res = await this.Api.getCate();
      console.log(res);
      if (res.data.success) {
        this.titles = res.data.data;
        // 初始化第一次加载分类页时候,标题的分类的编号_id
        if (this.categoryId) {
          this.index = this.categoryId;
        } else {
          this.index = this.titles[0]._id;
        }

        // 并且找到对应的内容
        this.getContent(this.index);
      }
    },
    async getContent(id) {
      console.log(id);
      storage.set("categoryId", id);
      let res = await this.Api.getGoodsByCate(id);
      console.log(res);
      if (res.data.success) {
        this.contents = res.data.data;
      } else {
        this.contents = [];
      }
    },

    getCatIdByindex(index, titles) {
      let _id = null;
      for (var key in titles) {
        if (index == key) {
          _id = titles[key]._id;
        }
      }
      return _id;
    },

    async switchTab(index, title) {
      // index  是索引id, 通过索引id找对应分类的编号(重要)
      console.log(index, title);
      storage.set("categoryTitle", index); // 本地存入当前tabs索引
      let _id = this.getCatIdByindex(index, this.titles);
      // 2. 通过 分类标号找对应的商品内容
      this.getContent(_id);
    },

    // switchTab(item) {
    //   // 1.通过点击事件换标题
    //   this.index = item._id;
    //   // 2. 通过 分类标号找对应的商品内容
    //   this.getContent(this.index);
    // },
    goback() {
      this.$router.back();
    },

    watchScroll() {
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      //  当滚动超过 50 时，实现吸顶效果
      if (scrollTop > 49) {
        this.navBarFixed = true;
      } else {
        this.navBarFixed = false;
      }
    },
  },
  mounted() {
    this.categoryId = storage.get("categoryId") || ""; //获取本地tabs的_id
    this.categoryTitle = storage.get("categoryTitle") || ""; //获取本地tabs的索引
    if (this.categoryId || this.categoryTitle) {
      this.index = this.categoryId;
      this.tabs_index = Number(this.categoryTitle);
      console.log(this.tabs_index);
      // storage.remove("categoryId");
      // storage.remove("categoryTitle");
    }
    this.getCateTitle();

    // 事件监听滚动条
    window.addEventListener("scroll", this.watchScroll);
  },
};
</script>
<style lang="scss" scoped>
.content {
  // position: fixed; /*可视高度*/
  // top: 60px;
  // left: 0;
  // right: 0;
  // bottom: 60px;
  overflow: hidden;
  height: 100vh;
}
.list {
  padding-left: 10px;
}
.list ul {
  width: 43%;
  float: left;
  margin: 10px 10px;
  margin-left: 10px;
  box-shadow: 5px 5px 10px #737373;
}
</style>
