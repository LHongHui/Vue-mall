<template>
  <div>
    <div class="bgc">
      <!-- navbar 导航 -->
      <nav-bar>
        <div slot="left" class="lefticon">
          <!-- <img src="@/assets/images/dicon.png"> -->
          <i class="iconfont icon-saoyisao"></i>
        </div>
        <div slot="center" class="search">
          <i class="iconfont icon-sousuo"></i>
          <input
            type="text"
            placeholder="商品5折"
            class="keybox"
            @click="goToSearch"
          />
        </div>
        <div slot="right" class="rightlogin">登录</div>
      </nav-bar>

      <!--  :pullup="true" 是否启用上拉加载  ;@scrollEnd="scrollToEnd" 触发上拉加载-->
      <!-- :data="dataArr"  分页的数据，将来获得新的滚动数据的高度-->
      <!--  class="content" 滚动出不来,去看scrollHeight(高),wrapperHeight .content {
                  position: fixed; /*可视高度*/
                  top: 60px;
                  left: 0;
                  right: 0;
                  bottom: 60px;
                  overflow: hidden;
    }-->
      <!-- :listenScroll="true" 是否启用滚动scroll事件 ; @scroll="_scroll"触发scroll事件 ;配置:probeType="3"-->
      <Scroll
        :pullup="true"
        @scrollEnd="scrollToEnd"
        :data="dataArr"
        class="content"
        ref="scroll"
        :listenScroll="true"
        @scroll="_scroll"
        :probeType="3"
      >
        <div class="content-scroll">
          <!-- 轮播图 -->
          <div class="swiper-container">
            <div class="swiper-wrapper" width="9px">
              <div
                class="swiper-slide"
                v-for="(item, key) in swipers"
                :key="key"
              >
                <img :src="url + item.focus_img" />
              </div>
            </div>
            <!-- Add Pagination:圆圈计数 -->
            <div class="swiper-pagination"></div>
          </div>

          <!-- 二级导航效果 -->
          <ul class="secondNav">
            <li
              class="item"
              v-for="(item, key) in navs"
              :key="key"
              @click="tabClick(item, key)"
            >
              <p>
                <img :src="url + item.cate_img" />
              </p>
              <p>{{ item.title }}</p>
            </li>
          </ul>

          <!-- 抢票播报站开始 -->
          <div class="grabbing" @click="count_down">
            <span>抢票播报站</span>
            <marquee behavior="scroll" direction="up" width="200px">
              音乐补给计划，赢双人票！
            </marquee>
            <hr />
            <img src="@/assets/images/cc.jpg" alt="" />
            <div class="pro">
              <p>
                【深圳】
                <strong
                  >下沉维度-深蓝的呼吸 <br />
                  <pre>  环保可持续新媒体艺术展</pre>
                </strong>
              </p>
              <van-icon name="location" color="#ccc" class="location" />
              <p id="shenzhen">深圳 | One Avenue 卓悦中心</p>
              <p id="date">2020.10.01-2021.02.14</p>
              <p id="like">24797人想看</p>
              <p id="grab_price">￥29</p>
            </div>
          </div>
          <!-- 抢票播报站结束 -->

          <!-- 最新上映  is_new-->
          <div class="recommend" id="new">
            <h3>必看排行榜</h3>

            <ul class="list">
              <li class="recommend_item" id="new1">
                <div class="imgs">
                  <img src="@/assets/images/1.jpg" />
                  <div id="rate">1</div>
                </div>
                <p class="info">
                  <span class="price">¥1099</span>
                  <span class="count">余票:999</span>
                </p>
              </li>

              <li class="recommend_item" id="new1">
                <div class="imgs">
                  <img src="@/assets/images/2.jpg" />
                  <div id="rate">2</div>
                </div>
                <p class="info">
                  <span class="price">¥850</span>
                  <span class="count">余票:32</span>
                </p>
              </li>

              <li class="recommend_item" id="new2">
                <div class="imgs">
                  <img src="@/assets/images/3.png" />
                  <div id="rate">3</div>
                </div>
                <p class="info">
                  <span class="price">¥979</span>
                  <span class="count">余票:58</span>
                </p>
              </li>

              <li class="recommend_item" id="new2">
                <div class="imgs">
                  <img src="@/assets/images/4.jpg" />
                  <div id="rate">4</div>
                </div>
                <p class="info">
                  <span class="price">¥1199</span>
                  <span class="count">余票:999</span>
                </p>
              </li>

              <li class="recommend_item" id="new2">
                <div class="imgs">
                  <img src="@/assets/images/5.jpg" />
                  <div id="rate">5</div>
                </div>
                <p class="info">
                  <span class="price">¥380</span>
                  <span class="count">余票:1999</span>
                </p>
              </li>
            </ul>
          </div>
          <!-- 推荐 :http://app.yiqigoumall.com/index/items/is_best  -->
          <div class="recommend" id="best">
            <h3>为你推荐</h3>
            <ul class="list">
              <li
                class="recommend-item"
                v-for="(item, key) in dataArr"
                :key="key"
              >
                <router-link :to="'/productDetail/' + item._id">
                  <div class="imgs" id="imgs">
                    <img :src="url + item.goods_img" alt />
                    <p class="title">{{ item.title }}</p>
                    <p class="info">
                      <span class="price">¥{{ item.market_price }}.00</span>
                      <span class="count">余票:{{ item.goods_number }}</span>
                      <span
                        class="showtime"
                        v-if="item.goods_time.split(',').length == 1"
                        >{{ item.goods_time.split(",")[0] }}</span
                      >
                      <span class="showtime" v-else>{{
                        item.goods_time.split(",")[0] +
                        "~" +
                        item.goods_time.split(",")[
                          item.goods_time.split(",").length - 1
                        ]
                      }}</span>
                    </p>
                    <p class="place">场馆：{{ item.goods_position }}</p>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </Scroll>
      <div class="g-backtop-container">
        <me-backtop :visible="isBacktopVisible" @backtop="backToTop" />
      </div>
    </div>
  </div>
</template>

<script>
// 标签栏
import Vue from "vue";
import { Tab, Tabs } from "vant";
Vue.use(Tab);
Vue.use(Tabs);

import MeBacktop from "@/components/backtop";
import { vuexData, page } from "@/assets/js/mixin";
import Scroll from "@/components/Scroll";
import storage from "@/assets/js/storage.js";
import navBar from "@/components/navbar.vue";
import Swiper from "swiper"; //安装模块和导入
import config from "@/assets/js/config.js";
// 下拉刷新
import { PullRefresh } from "vant";

Vue.use(PullRefresh);

import { Icon } from "vant";
Vue.use(Icon);

export default {
  name: "home",
  mixins: [vuexData, page],
  components: {
    navBar,
    Scroll,
    MeBacktop,
  },
  data() {
    return {
      swipers: [],
      navs: [],
      dataArr: [],
      dataArr_new: [],
      url: config.api,
      page: 1,
      isBacktopVisible: false,
    };
  },
  methods: {
    tabClick(item, key) {
      storage.set("categoryId", item._id);
      storage.set("categoryTitle", key);
      this.$router.push("/category");
    },
    count_down() {
      this.$router.push("/count_down");
    },

    goToSearch() {
      this.$router.push("/search");
    },
    _scroll(pos) {
      //console.log(pos.y);
      this.isBacktopVisible = pos.y < 0 && -pos.y > 200; //通过指定坐标范围来实现backtop子组件的显示隐藏
    },
    backToTop() {
      this.$refs.scroll && this.$refs.scroll.scrollTo(0, 0);
    },
    scrollToEnd() {
      if (this.dataArr.length >= 2) {
        if (this.hasMore()) {
          // ?算法在哪判断是否所有数据加载完了吗
          this.page++;
          this.recommend(true);
        } else {
          this.$toast("没有很多数据了~~");
        }
      }
    },
    //调用swiper方法
    async getSwiper() {
      let res = await this.Api.carousels();
      console.log(res.data.data);
      if (res.data.success) {
        this.swipers = res.data.data;
        this.$nextTick(() => {
          new Swiper(".swiper-container", {
            pagination: {
              el: ".swiper-pagination",
            },
            loop: true,
            autoplay: {
              delay: 2500,
              disableOnInteraction: false,
            },
          });
        });
      }
    },
    async getCate() {
      let res = await this.Api.getCate();
      console.log(res.data.data);
      if (res.data.success) {
        this.navs = res.data.data;
      }
    },
    // 调用推荐商品
    async recommend(flag) {
      try {
        if (this.isLocked()) return; // 必须等待上一次请求完成
        this.locked(); //开始请求之前锁住

        let res = await this.Api.recommend(this.page);
        console.log(res);
        if (res.data.success) {
          this.setTotal(res.data.totals); // 总条数
          this.unLocked(); // 解锁
          if (flag) {
            this.setNewData(res.data.data); //分页累连的数据 concat
          } else {
            this.dataArr = res.data.data; // 第一次加载的数据
          }
        }
      } catch (error) {
        this.unLocked(); // 解锁
        this.$toast("网络错误");
      }
    },
  },
  mounted() {
    this.getSwiper();
    this.getCate();
    this.recommend(false);
  },
};
</script>

<style lang="scss" scoped>
.doge {
  width: 140px;
  height: 72px;
  margin-top: 8px;
  border-radius: 4px;
}
.pullrefresh {
  width: 140px;
  height: 72px;
  margin-top: 8px;
  border-radius: 4px;
}
.place {
  width: 80%;
  margin-left: 175px;
}
// 演出时间showtime
.showtime {
  width: 200px;
  position: absolute;
  left: 175px;
  top: 38px;
  font-size: 16px;
}
// 抢票播报站
.grabbing {
  width: 92%;
  height: 180px;
  border: 2px solid #ccc;
  border-radius: 9px;
  background-color: rgb(241, 236, 236);
  margin: 20px auto;
  position: relative;
}
.grabbing span {
  font-family: "方正舒体";
  font-size: 22px;
  font-weight: 800;
  margin-top: 3px;
  margin-left: 8px;
  margin-right: 3px;
  background: linear-gradient(to right, #ce237f, #ec1c49, #f16b41);
  background-clip: text;
  color: transparent;
}
hr {
  height: 2px;
  border: none;
  border-top: 2px dotted #ec1c49;
  margin-top: 5px;
}
.grabbing img {
  width: 94px;
  height: 124px;
  margin: 9px;
}
.grabbing p {
  position: absolute;
  left: 103px;
  top: 42px;
  font-size: 16px;
  color: #3a3333;
  font-weight: 700;
}
.location {
  position: absolute;
  top: 85px;
  left: 108px;
}
#shenzhen {
  position: absolute;
  top: 85px;
  left: 125px;
  font-family: 宋体;
  font-size: 16px;
  color: darkgrey;
}
#date {
  position: absolute;
  top: 104px;
  left: 110px;
  font-family: 宋体;
  font-size: 16px;
  color: darkgrey;
}
#grab_price {
  color: #ce237f;
  font-weight: 700;
  font-size: 20px;
  position: absolute;
  top: 137px;
  left: 108px;
}
#like {
  position: absolute;
  top: 122px;
  left: 110px;
  font-family: 宋体;
  font-size: 16px;
  color: darkgrey;
}
// 热门榜单

#hot h3 {
  position: relative;
  text-align: center;
  font: bold 16px/50px 微软雅黑;
  color: red;
  margin: 0 8px;
}
// #list{
//   width:500%;

// }
// #list li{
//   width:100%;
//   float: left;
// }
// #list li .imgs{
//   width: 100px;
// }
// 最新上映
#new1 {
  width: 48%;
  margin-left: 4px;
}
#new2 {
  width: 31%;
  margin-left: 6px;
}
#new .recommend-item:first-of-type {
  width: 55%;
}
#new .recommend-item:nth-child(2) {
  width: 42%;
}
#new .recommend-item:nth-child(2) img {
  height: 137%;
}

#new .recommend-item:nth-child(2) .title {
  margin-top: 51px;
}
#new .recommend-item:nth-child(3) {
  width: 30%;
  margin-left: 8px;
}
#new .recommend-item:nth-child(4) {
  width: 30%;
  margin-left: 10px;
}
#new .recommend-item:nth-child(5) {
  width: 30%;
  margin-left: 10px;
}
.bgc {
  background-color: red;
}
.content {
  position: fixed; /*可视高度*/
  top: 60px;
  left: 0;
  right: 0;
  bottom: 60px;
  overflow: hidden;
}

/*轮播图样式*/
.swiper-container {
  width: 100%;
  height: 200px;
  background: linear-gradient(to bottom, #f00, #fff);
}
.swiper-container img {
  width: 82%;
  height: 85%;
  margin: 10px 30px;
  border-radius: 20px;
}

.swiper-slide {
  border-radius: 30%;
}
.wrap {
  background: none;
}
.lefticon .iconfont {
  color: #fff;
  font-size: 22px;
}
.rightlogin {
  color: #fff;
  cursor: pointer;
  font-size: 16px;
}
.search {
  position: relative;
  display: flex;
  height: 38px;
  margin: 0 14px 0 2px;
}
.search .iconfont {
  position: absolute;
  left: 15px;
  top: 12px;
}
.keybox {
  flex: 1;
  height: 38px;
  background: #fff;
  border-radius: 25px 30px 30px 5px;
  padding-left: 50px;
  color: #666;
}
/*二级导航样式*/
.secondNav {
  display: flex; /*默认行显示*/
  flex-wrap: wrap; /*允许折行*/
  padding: 12px 0;
}

.theam {
  font-size: 10px;
  font-weight: 700;
}
.item {
  width: 20%;
  display: flex;
  flex-direction: column; /*列显示*/
  align-items: center; /*水平对齐*/
  padding: 4px 0;
}
.item img {
  width: 100%;
}
.item p:nth-of-type(2) {
  font-size: 13px;
  padding-top: 5px;
}

/*推荐商品的样式*/
.recommend {
  padding: 10px 0;
}
.recommend h3 {
  position: relative;
  text-align: center;
  font: bold 16px/50px 微软雅黑;
  color: red;
  margin: 0 8px;
}
.recommend h3::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  width: 35%;
  height: 1px;
  background: #f00;
}
.recommend h3::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 0;
  width: 35%;
  height: 1px;
  background: #f00;
}
.recommend .list {
  display: flex;
  flex-wrap: wrap;
}

.recommend .recommend-item {
  width: 98%;
  background: #fff;
  margin-bottom: 6px;
  margin-left: 1%;
}
.recommend .recommend-item .imgs {
  position: relative;
}
#rate {
  color: #fff;
  font-size: 24px;
  position: absolute;
  bottom: 0px;
  left: 9px;
  background: linear-gradient(to right, #da2369, #da2369, #e72d2d);
  width: 40px;
  height: 40px;
  text-align: center;
  line-height: 40px;
  border-radius: 25px, 25px, 25px, 0px;
}
.recommend .imgs {
  position: relative;
  padding-top: 100%; /*将图像100%放进父级盒子中*/
  width: 100%;
}
.recommend img {
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 9px;
  width: 90%;
  height: 100%;
}
.recommend .title {
  font-family: "微软雅黑";
  font-weight: 700;
  font-size: 16px;
  padding: 6px 0;
  line-height: 22px;
  /* text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap; */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.recommend .info {
  height: 30px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.recommend .price {
  color: #f00;
  font: 14px JDZhengHT-EN-Regular;
  text-align: left;
}
.recommend .count {
  font: bold 12px arial;
}
#best {
  clear: both;
}
#imgs {
  width: 300px;
  height: 100px;
  margin-top: 10px;
  padding-top: 50%;
}
#best img {
  width: 50%;
  height: 95%;
  margin-left: 10px;
}
#best .title {
  width: 240px;
  margin-left: 172px;
  margin-top: -220px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
#best .price {
  width: 100px;
  position: absolute;
  left: 180px;
  bottom: 15px;
  color: red;
  font-size: 24px;
}
#best .count {
  width: 100px;
  position: absolute;
  left: 320px;
  bottom: 19px;
  font-size: 16px;
}
</style>