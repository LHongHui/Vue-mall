<template>
  <div class="tab">
    <div class="titles menu-wrapper" ref="menuWrapper">
      <ul class="tabtitle">
        <li
          v-for="(item, key) in titles"
          :key="key"
          :class="{ active: curId == key }"
          @click="switchTab(key)"
        >
          {{ item.title }}
        </li>
      </ul>
    </div>
    <div class="contents foods-wrapper" ref="foodsWrapper">
      <ul class="cateProdouct">
        <li
          v-for="(cateInfo, key) in productByCat"
          class="item good-List-hook"
          :key="key"
        >
          {{ cateInfo.title }}
          <div v-for="(item, key) in cateInfo.goodsList" :key="key">
            <router-link :to="'/productDetail/' + item._id" class="link">
              <p class="image">
                <img :src="url + item.goods_img" alt="" />
              </p>
              <p class="title">{{ item.title }}</p>
              <p class="info">
                <span class="price">{{ item.shop_price }}元</span
                ><span class="like">点击:{{ item.click_count }}</span>
              </p>
            </router-link>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import config from "@/assets/js/config.js";

import BScroll from "better-scroll";
export default {
  data() {
    return {
      url: config.api,
      listHeight: [],
      scrollY: 0,
      titles: [],
      productByCat: [],
    };
  },

  methods: {
    async getTitles() {
      var res = await this.Api.getCate();
      console.log(res.data.data);
      if (res.data.success) {
        this.titles = res.data.data;
      }
    },
    async getContent() {
      var res = await this.Api.catesAndGoods();
      console.log(res.data.data);
      if (res.data.success) {
        //console.log(res.data.data);
        this.productByCat = res.data.data;
      }
    },
    initScroller() {
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        click: true,
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3,
        click: true,
      });
      this.foodsScroll.on("scroll", (pos) => {
        this.scrollY = Math.abs(Math.round(pos.y));
        console.log(this.scrollY);
      });
    },
    calculateHeight() {
      let goodsList = this.$refs.foodsWrapper.getElementsByClassName(
        "good-List-hook"
      );
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < goodsList.length; i++) {
        let item = goodsList[i];
        height += item.clientHeight;
        this.listHeight.push(height);
      }
      console.log(this.listHeight);
    },
    scrollToElement() {
      this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments);
    },
    switchTab(index) {
      // 更改动态 curId
      let goodsList = this.$refs.foodsWrapper.getElementsByClassName(
        "good-List-hook"
      );
      console.log(goodsList);
      let el = goodsList[index];
      //console.log(el);
      this.foodsScroll.scrollToElement(el, 500);
    },
  },
  mounted() {
    this.getTitles();
    this.getContent();
    setTimeout(() => {
      this.initScroller();
      this.calculateHeight();
    }, 1000);
  },
  computed: {
    curId() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
  },
};
</script>
<style scoped>
.tab {
  display: flex;
  height: 100%;
}
.tabtitle {
  width: 100px;
}
.tabtitle li {
  text-align: center;
  border-right: 1px solid #ccc;
  border-bottom: 1px solid #ccc;
  font: bold 14px/60px 微软雅黑;
  cursor: pointer;
  height: 60px;
}
.tabtitle li.active {
  color: #ff6600;
  border-right: 0;
}
.tabcontent {
  flex: 1;
  padding: 12px 0 0 12px;
}
.bigtitle {
  font: bold 18px 微软雅黑;
  padding: 0 0 20px 0;
}
.cateProdouct {
  display: flex;
  flex-wrap: wrap; /*折行*/
  justify-content: space-between;
}
.cateProdouct .item {
  width: 100%;
  height: 500px;
}
.cateProdouct .image img {
  width: 100%;
  height: 100%;
}
.cateProdouct .title {
  padding: 6px 0;
  font-size: 14px;
}
.cateProdouct .info {
  display: flex;
  justify-content: space-between;
  padding: 0 3px;
}
.cateProdouct .price {
  color: #f00;
  font-size: 12px;
}
.cateProdouct .like {
  color: #ccc;
  font-size: 12px;
}

.menu-wrapper {
  width: 30%;
  height: 500px;
  overflow: hidden;
}
.foods-wrapper {
  width: 70%;
  height: 500px;
  overflow: hidden;
}
.menu-wrapper ul,
.foods-wrapper ul {
  height: 3000px;
}
</style>