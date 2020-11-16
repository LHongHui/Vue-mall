<template>
  <div>
    <!-- 分类页的头部 -->
    <nav-bar>
      <div slot="left">
        <i class="iconfont icon-fanhui" @click="goback()"></i>
      </div>
      <div slot="center">分类页</div>
    </nav-bar>
    <Scroll class="content2">
      <div>
        <!-- Tab切换 -->
        <div class="tab">
          <ul class="title">
            <li
              v-for="(item, key) in titles"
              :key="key"
              :class="{ active: item._id == index }"
              @click="switchTab(item)"
            >
              {{ item.title }}
            </li>
          </ul>
          <div class="content">
            <div v-if="contents.length > 0">
              <ul class="list">
                <li
                  class="recommend-item"
                  v-for="(item, key) in contents"
                  :key="key"
                >
                  <router-link :to="'/productDetail/' + item._id">
                    <div class="imgs">
                      <img :src="url + item.goods_img" alt />
                    </div>
                    <p class="title">{{ item.title }}</p>
                    <p class="info">
                      <span class="price">¥{{ item.market_price }}</span>
                      <span class="count">点击量{{ item.click_count }}</span>
                    </p>
                  </router-link>
                </li>
              </ul>
            </div>
            <div v-else>没有商品数据</div>
          </div>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script>
import config from "@/assets/js/config.js";
import navBar from "@/components/navbar.vue";
import { vuexData } from "@/assets/js/mixin.js";
import Scroll from "@/components/Scroll";
export default {
  name: "category",
  mixins: [vuexData],
  components: {
    navBar,
    Scroll,
  },
  data() {
    return {
      index: "",
      titles: [],
      contents: [],
      url: config.api,
    };
  },
  methods: {
    // goback(){
    //   this.$router.go(-1);
    // },
    switchTab(item) {
      // 1.通过点击事件换标题
      this.index = item._id;
      // 2. 通过 分类标号找对应的商品内容
      this.getContent(this.index);
    },
    async getTitle() {
      let res = await this.Api.getCate();
      console.log(res.data.data);
      if (res.data.success) {
        this.titles = res.data.data;
        // 初始化第一次加载分类页时候,标题的分类的编号_id,
        this.index = this.titles[0]._id;
        // 并且找到对应的内容
        this.getContent(this.index);
      }
    },
    async getContent(id) {
      console.log(id);
      let res = await this.Api.getGoodsByCate(id);
      console.log(res.data.data);
      if (res.data.success) {
        this.contents = res.data.data;
      } else {
        this.contents = [];
      }
    },
  },
  mounted() {
    this.getTitle();
  },
};
</script>

<style lang="scss" scoped>
.content2 {
  position: fixed; /*可视高度*/
  top: 60px;
  left: 0;
  right: 0;
  bottom: 60px;
  overflow: hidden;
}
.tab {
  display: flex;
}
.title {
  width: 80px;
  margin-right: 8px;
}
.title li {
  text-align: center;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  font: bold 12px 微软雅黑;
  line-height: 30px;
}
.title li.active {
  color: #900;
  border-right: 0;
}
.content {
  flex: 1;
  margin-top: 8px;
}
/*tab对应的内容*/
.content .list {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.content .recommend-item {
  width: 48%;
  background: #fff;
  margin-bottom: 6px;
}
.content .recommend-item:nth-of-type(1) {
  margin-right: 8px;
}
.content .imgs {
  position: relative;
  padding-top: 100%; /*将图像100%放进父级盒子中*/
  width: 100%;
}
.content img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.content .title {
  font-size: 12px;
  padding: 6px 0;
  line-height: 22px;
  /* text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap; */
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 2;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.content .info {
  height: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.content .price {
  color: #f00;
  font: 14px JDZhengHT-EN-Regular;
}
.content .count {
  font: bold 12px arial;
}
</style>
