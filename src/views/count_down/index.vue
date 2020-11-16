<template>
  <div class="container">
    <!-- 抢票播报 -->
    <nav-bar id="bar">
      <div slot="left">
        <i class="iconfont icon-fanhui" @click="goback()"></i>
      </div>
      <div slot="center" class="tip">抢票播报站</div>
    </nav-bar>
    <Scroll class="content" :pullup="true" :listenScroll="true">
      <div class="jinribiqiang">
        <span id="jinri">今日必抢</span>
        <span id="biqiang"
          >手慢无 <img src="@/assets/images/jinzhi.png" alt=""
        /></span>
        <div class="per" id="necessary">
          <div id="bgc">
            <img src="@/assets/images/biqiang.jpg" alt="" @click="first" />
            <p class="name" id="ftc">
              【深圳】
              <strong>第二十二界中国国际<br />高新技术成果交易会</strong>
            </p>
            <p class="place" id="ftc">深圳 | 深圳会展中心</p>
            <p class="showtime" id="ftc">2020.11.11-11.15</p>
            <p class="like">人气爆棚</p>
            <p class="price" id="ftc">￥50</p>
            <p class="qi" id="ftc">起</p>
            <img src="@/assets/images/fire.svg" alt="" id="fire" />
            <span id="reqiangzhong">正在热抢中...</span>
            <button class="btn" id="btn">去抢票</button>
          </div>
        </div>
      </div>
      <!-- 内容展示 -->
      <div>
        <span id="performance"
          ><span class="now">正在热抢</span>不错过每一个热门演出</span
        >
      </div>

      <div class="per">
        <img src="@/assets/images/cc.jpg" alt="" @click="first" />
        <p class="name">
          【深圳】 <strong>下沉维度-深蓝的呼吸环保可持续新媒体艺术展</strong>
        </p>
        <p class="place">深圳 | One Avenue 卓悦中心</p>
        <p class="showtime">2020.10.01-2021.02.14</p>
        <p class="like">24797人想看</p>
        <p class="price">￥29</p>
        <p class="qi">起</p>
        <van-count-down
          millisecond
          auto-start
          :time="2320000"
          format="HH:mm:ss:SS"
          class="btn"
        />
      </div>

      <div class="per">
        <img src="@/assets/images/fengke.jpg" alt="" />
        <p class="name">【北京】"疯客与舞蹈" Click#15北京音乐会</p>
        <p class="showtime">2020.11.13 周五 19:30</p>
        <p class="place">北京 | 北京展览馆剧场</p>
        <p class="like">5096人想看</p>
        <p class="price">￥180</p>
        <p class="qi">起</p>
        <van-count-down
          millisecond
          auto-start
          :time="259270"
          format="HH:mm:ss:SS"
          class="btn"
        />
      </div>
      <div class="per">
        <img src="@/assets/images/xiaoshuo.jpg" alt="" />
        <p class="name">【上海】 推理音乐剧《小说》</p>
        <p class="showtime">2020.12.24 - 2021.01.10</p>
        <p class="place">上海 | 人民大舞台</p>
        <p class="like">7.1万人想看</p>
        <p class="price">￥100</p>
        <p class="qi">起</p>
        <van-count-down
          millisecond
          auto-start
          :time="25520600"
          format="HH:mm:ss:SS"
          class="btn"
        />
      </div>

      <div class="per">
        <img src="@/assets/images/pianxiang.jpg" alt="" />
        <p class="name">
          【上海】 东野圭吾惊心悬疑舞台剧 《片想》(预演场 限定)
        </p>
        <p class="showtime">2020.11.20 - 11.22</p>
        <p class="place">上海 | 浦东大戏院</p>
        <p class="like">5334人想看</p>
        <p class="price">￥300</p>
        <p class="qi">起</p>
        <van-count-down
          millisecond
          auto-start
          :time="260000"
          format="HH:mm:ss:SS"
          class="btn"
        />
      </div>
      <p class="dibu">只有这么多了，明天再来吧(๑❛ڡ❛๑)☆</p>
    </Scroll>
  </div>
</template>

<script>
import navBar from "@/components/navbar.vue";
import { vuexData } from "@/assets/js/mixin";
import Scroll from "@/components/Scroll";

import Vue from "vue";
import { PullRefresh } from "vant";

Vue.use(PullRefresh);

// 倒计时
import { CountDown } from "vant";

Vue.use(CountDown);

export default {
  name: "count_down",
  mixins: [vuexData],
  components: {
    navBar,
    Scroll,
  },
  methods: {
    first() {
      this.$router.push("/first");
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

<style  lang="scss" scoped>
.container {
  overflow: visible;
}
.content {
  height: 100vh;
  overflow: hidden;
}
.tip {
  font-family: 微软雅黑;
  font-weight: 700;
}
#performance {
  margin-left: 12px;
  color: #000;
}
#btn {
  position: absolute;
  top: 208px;
  right: 20px;
}
#reqiangzhong {
  position: absolute;
  top: 215px;
  left: 45px;
}
#fire {
  display: inline-block;
  width: 20px;
  height: 30px;
  position: absolute;
  bottom: -120px;
  left: 0px;
}
#bgc {
  background: linear-gradient(to right, #7476c9, #797ccd, #6d6bbe);
  height: 200px;
  position: relative;
}
#bgc img {
  margin: 20px;
}
#bgc .name {
  position: absolute;
  top: 25px;
  right: 10px;
}
#bgc .showtime {
  position: absolute;
  top: 70px;
  left: 146px;
}
#bgc .place {
  position: absolute;
  top: 90px;
  left: 146px;
}
#bgc .like {
  position: absolute;
  top: 115px;
  left: 146px;
  text-align: center;
}
#bgc .price {
  position: absolute;
  top: 145px;
  left: 146px;
}
#bgc .qi {
  position: absolute;
  top: 152px;
  left: 190px;
}
#jinri {
  display: inline-block;
  font-family: 楷体;
  font-size: 26px;
  color: #000;
  margin: 20px 10px 0px 10px;
}
span {
  background: linear-gradient(to right, #e44a03, #f36bb6, #f20c00);
  background-clip: text;
  color: transparent;
}
.now {
  font-family: 华文楷体;
  font-size: 22px;
  margin-right: 15px;
  color: #000;
}
#necessary {
  height: 250px;
}

#necessary #ftc {
  color: #fff;
}
#necessary img {
  height: 150px;
}
#biqiang {
  margin-left: 10px;
  color: #000;
  font-family: 楷体;
}
#biqiang img {
  width: 20px;
  margin-top: 25px;
}
.per {
  position: relative;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 95%;
  height: 150px;
  margin: 15px auto;
}
.per img {
  width: 28%;
  height: 90%;
  margin: 7px 10px;
}
.per .name {
  width: 60%;
  position: absolute;
  top: 10px;
  right: 20px;
  font-weight: 700;
}
.per .showtime {
  width: 60%;
  position: absolute;
  top: 60px;
  right: 20px;
  color: #afa8a8;
}
.per .place {
  width: 60%;
  position: absolute;
  top: 80px;
  right: 20px;
  color: #afa8a8;
}
.per .like {
  width: 100px;
  height: 25px;
  position: absolute;
  top: 102px;
  left: 135px;
  font-family: 宋体;
  font-size: 16px;
  color: white;
  background: orange;
  padding: 4px;
  border-radius: 1px 15px 15px 1px;
  font-family: 楷体;
}
.per .price {
  position: absolute;
  top: 124px;
  left: 130px;
  color: #f20c00;
  font-weight: 700;
  font-size: 18px;
}
.per .qi {
  position: absolute;
  top: 130px;
  left: 180px;
  font-size: 12px;
  color: #afa8a8;
}
.per .btn {
  position: absolute;
  top: 115px;
  right: 15px;
  background: #f20c00;
  width: 80px;
  height: 30px;
  line-height: 30px;
  border-radius: 12px;
  color: #fff;
}
.dibu {
  text-align: center;
  margin-bottom: 20px;
  font-family: 华文琥珀;
  color: #a3a2a2;
}
</style>