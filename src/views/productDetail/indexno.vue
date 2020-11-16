<template>
  <div v-if="bool">
    <van-nav-bar title="产品详情" left-arrow @click-left="goback" />
    <!-- ========== -->
    <img :src="url + productone.productone.goods_img" class="bg_image_path" />
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <div class="board">
        <div class="goods-title">{{ productone.productone.title }}</div>
        <div class="board-info">
          <div class="goods-top border-bottom">
            <img
              :src="url + productone.productone.goods_img"
              class="image_path"
            />
            <div class="goods-right">
              <p class="pic">
                <span>￥</span>
                <span>{{ this.goods_price[0] }}起</span>
              </p>
            </div>
          </div>
          <van-notice-bar
            left-icon="chat-o"
            text="票品为有价证券，非普通商品，其背后承载的文化服务具有时效性，稀缺性等特征，不支持退换。"
          />
          <div class="service_description">
            <van-cell is-link @click="showPopup">
              <div class="description-text">
                <img src="@/assets/svg/gantan.svg" class="gantanimg" />
                不支持退
                <img src="@/assets/svg/gantan.svg" class="gantanimg" />可选坐
                <img src="@/assets/svg/gantan.svg" class="gantanimg" />自助取票
                <img src="@/assets/svg/gantan.svg" class="gantanimg" />电子发票
              </div>
            </van-cell>

            <van-popup
              v-model="show"
              round
              position="bottom"
              :style="{ height: '70%' }"
            >
              <h1 class="sever-title">服务说明</h1>
              <div class="sever-box">
                <h3><img src="@/assets/svg/dui.svg" class="duiimg" />预售</h3>
                <div class="pasg">
                  本商品为预售商品，正式开票后将第一时间为您配票
                </div>
                <h3>
                  <img src="@/assets/svg/dui.svg" class="duiimg" />重要通知
                </h3>
                <div class="pasg">
                  预售期间，由于主办未正式开票，下单后无法立即为您配票。一般于演出前2-6周开票，待正式开票后，请您通过订单详情页或者票夹详情，查看票品信息、取票方式等演出相
                  单详情页或者票夹详情.
                </div>
                <h3>
                  <img src="@/assets/svg/dui.svg" class="duiimg" />不支持退
                </h3>
                <div class="pasg">
                  票品为有价证券，非普通商品，其背后承载的文化服务具有时效性，稀缺性等特征，不支持退换。
                </div>
                <h3><img src="@/assets/svg/dui.svg" class="duiimg" />快递票</h3>
                <div class="pasg">
                  快递票:纸质票会在开票后快递到您留下的收货地址,承担邮寄费用。注:离开演时间仅3天时，不再寄送快递票，支持在指定取票地点取票.
                </div>
                <h3>
                  <img src="@/assets/svg/dui.svg" class="duiimg" />纸质发票
                </h3>
                <div class="pasg">
                  该项目支持开具纸质发票，请您在演出开始前通过订单页补开，发票将在演出结束后1个月左右，统一由主办方提供
                </div>
              </div>
            </van-popup>
          </div>
          <div class="start_data">
            <div class="start_data_info">
              <p class="goods_time">{{ productone.productone.goods_time }}</p>
              <p class="goods_time_text">演出时间长约120min（以现场为准）</p>
            </div>
          </div>
          <router-link
            :to="{
              name: 'location',
              query: {
                goods_location: productone.productone.goods_location,
                goods_position: productone.productone.goods_position,
              },
            }"
          >
            <div class="place">
              <div class="place_info">
                <p class="goods_city">
                  {{ productone.productone.goods_city }}
                </p>
                <p class="goods_position">
                  {{ productone.productone.goods_position }}
                </p>
              </div>

              <div class="place_img_box">
                <img src="@/assets/svg/locat.svg" class="place_img" />
              </div>
            </div>
          </router-link>
          <div class="youhui">
            <!-- 优惠券单元格 -->
            <van-coupon-cell
              :coupons="coupons"
              :chosen-coupon="chosenCoupon"
              @click="showList = true"
            />
            <!-- 优惠券列表 -->
            <van-popup
              v-model="showList"
              round
              position="bottom"
              style="height: 90%; padding-top: 4px"
            >
              <van-coupon-list
                :coupons="coupons"
                :chosen-coupon="chosenCoupon"
                :disabled-coupons="disabledCoupons"
                @change="onChange"
                @exchange="onExchange"
              />
            </van-popup>
          </div>
        </div>
      </div>

      <!-- 须知,推荐，评论 start -->
      <div class="tabbox">
        <div id="tab">
          <div :style="{ position: position, top: top }" class="nav">
            <div class="header-new-title">
              <nav class="detail_anchor">
                <a
                  href="javascript:"
                  dtype="item"
                  :class="{ active: active == 'goods' }"
                  @click="onScrollGoods"
                  ><span>须知</span></a
                >
                <a
                  href="javascript:"
                  dtype="comment"
                  :class="{ active: active == 'comment' }"
                  @click="onScrollComment"
                  ><span>评价</span></a
                >
                <a
                  href="javascript:"
                  dtype="guess"
                  :class="{ active: active == 'recommend' }"
                  @click="onScrollRecommend"
                  ><span>推荐</span></a
                >
                <a
                  href="javascript:"
                  dtype="detail"
                  :class="{ active: active == 'detail' }"
                  @click="onScrollDetail"
                  ><span>详情</span></a
                >
              </nav>
            </div>
          </div>
        </div>
        <div class="goods">
          <notice>购票须知</notice>
        </div>
        <hr />

        <div class="comment" ref="comment" id="comment">
          <comment ref="comment" id="comment" :dataArr="dataArr"
            >精选评价</comment
          >
        </div>

        <div class="recommend" ref="recommend" id="recommend">
          <recommend ref="recommend" id="recommend"></recommend>
        </div>

        <div ref="detail" id="detail">
          <div v-html="productone.productone.goods_content">我是商品详情</div>
        </div>
      </div>
      <!-- 须知,推荐，评论 end -->
    </van-pull-refresh>

    <!-- 底部加购栏开始 -->
    <van-goods-action>
      <van-goods-action-icon
        icon="share-o"
        text="分享"
        @click="showShare = true"
      />
      <van-goods-action-icon icon="cart-o" text="购物车" @click="tocart" />
      <van-goods-action-icon
        icon="star"
        text="已收藏"
        color="#ff5000"
        v-if="isLike"
        @click="userunLike"
      />
      <van-goods-action-icon
        icon="star"
        text="未收藏"
        v-if="!isLike"
        @click="userlike"
      />
      <van-share-sheet
        v-model="showShare"
        title="立即分享给好友"
        :options="options"
        @select="onSelect"
      />

      <van-popup
        v-model="showsku"
        round
        position="bottom"
        :style="{ height: '70%' }"
      >
        <div class="goods-center border-bottom">
          <div class="label-title">场次时间均为演出当地时间</div>
          <div class="size-label-box">
            <div class="label">地点:</div>
            <div class="label-item-box">
              <div
                class="label-item"
                :class="indexactive1 == key ? 'active' : ''"
                v-for="(cityitem, key) in goods_city"
                :key="key"
                @click="changeActive1(key)"
              >
                {{ cityitem }}
              </div>
            </div>
          </div>
          <div class="size-label-box">
            <div class="label">场次:</div>
            <div class="label-item-box">
              <div
                class="label-item"
                :class="indexactive2 == key ? 'active' : ''"
                v-for="(timeitem, key) in goods_time"
                :key="key"
                @click="changeActive2(key)"
              >
                {{ timeitem }}
              </div>
            </div>
          </div>
        </div>
        <div class="display" v-show="aa == false">
          <div class="size-label-box">
            <div class="label">票档:</div>
            <div class="label-item-box">
              <div
                class="label-item"
                :class="indexactive3 == key ? 'active' : ''"
                v-for="(priceitem, key) in goods_price"
                :key="key"
                @click="changeActive3(key)"
              >
                {{ priceitem }}
              </div>
            </div>
          </div>
          <div class="goods-bottom border-bottom">
            <div class="left">
              <p class="num">购买数量：</p>
              <p class="totle">
                剩余 {{ productone.productone.goods_number }} 件
                <span>每笔订单限购5张</span>
              </p>
            </div>
            <AdditionAndSubtraction @count="count" class="count_btn" />
          </div>
        </div>
        <div class="bottom" @click="addCart">添加到购物车</div>
      </van-popup>
      <van-goods-action-button
        type="danger"
        @click="showPopupsku"
        text="立即预定"
      />
    </van-goods-action>

    <!-- 底部加购栏结束 -->
    <!-- 返回顶端 -->
    <vueToTop type="10" bottom="80"></vueToTop>
  </div>
</template>

<script>
import Scroll from "@/components/Scroll";
import storage from "@/assets/js/storage.js";
import { vuexData } from "@/assets/js/mixin";
import navBar from "@/components/navbar.vue";
import config from "@/assets/js/config.js";
import comment from "./comment.vue";
import recommend from "./recommend.vue";
import notice from "./notice.vue";
import { Popup } from "vant";
import AdditionAndSubtraction from "@/components/AdditionAndSubtraction";
import { Tab, Tabs } from "vant";
import { ShareSheet } from "vant"; //分享
import { Toast } from "vant"; //分享
import { CouponCell, CouponList } from "vant"; //优惠券
import { NoticeBar } from "vant";
export default {
  name: "productDetail",
  mixins: [vuexData],
  components: {
    navBar,
    comment,
    recommend,
    notice,
    AdditionAndSubtraction,
    Scroll,
  },

  data() {
    return {
      bool: false,
      id: null,
      url: config.api,
      productone: [],
      goods_city: [],
      goods_time: [],
      goods_price: [],
      showBase: false, // 显示sku
      newCount: 1,
      comment: "",
      dataArr: "",
      offsetTop: 0,
      indexactive1: null,
      indexactive2: null,
      indexactive3: null,
      chooseContent1: "",
      chooseContent2: "",
      chooseContent3: "",
      // 收藏
      isLike: false,
      // 弹框
      show: false,
      showsku: false,
      aa: true,
      // 评论详情滚动监听样式
      scrollTop: 0,
      active: "goods",
      position: "",
      top: 0,
      // 分享
      showShare: false,
      options: [
        { name: "微信", icon: "wechat" },
        { name: "微博", icon: "weibo" },
        { name: "复制链接", icon: "link" },
        { name: "分享海报", icon: "poster" },
      ],
      // 优惠券
      showList: false,
      chosenCoupon: -1,
      coupons: [
        {
          available: 1,
          condition: "无使用门槛\n最多优惠12元",
          reason: "",
          value: 150,
          name: "优惠券名称",
          startAt: 1489104000,
          endAt: 1514592000,
          valueDesc: "1.5",
          unitDesc: "元",
        },
      ],
      disabledCoupons: [
        {
          available: 1,
          condition: "无使用门槛\n最多优惠12元",
          reason: "",
          value: 150,
          name: "优惠券名称",
          startAt: 1489104000,
          endAt: 1514592000,
          valueDesc: "1.5",
          unitDesc: "元",
        },
      ],
      // 下拉刷新
      refreshcount: 0,
      isLoading: false,
    };
  },
  methods: {
    tocart() {
      this.$router.push("/cart");
    },
    //是否收藏方法
    async userIsLike() {
      var res = await this.Api.userIsLike(this.id, this.userName._id); //传全局的id,当前商品的
      console.log(res);
      if (res.data.success) {
        this.isLike = true;
      } else {
        this.isLike = false;
      }
    },
    // 用户收藏
    async userlike() {
      if (!storage.get("userName")) {
        this.$dialog
          .alert({
            message: "您尚未登录",
            className: "zindex",
          })
          .then(() => {
            this.$router.push("/login");
          });
      } else {
        let res = await this.Api.userLike(this.id, this.userName._id);
        if (res.data.success) {
          this.isLike = true;
        }
      }
    },
    async userunLike() {
      if (!storage.get("userName")) {
        this.$dialog
          .alert({
            message: "您尚未登录",
            className: "zindex",
          })
          .then(() => {
            this.$router.push("/login");
          });
      } else {
        let res = await this.Api.userunLike(this.id, this.userName._id);
        if (res.data.success) {
          this.isLike = false;
        }
      }
    },
    // 下拉刷新
    onRefresh() {
      setTimeout(() => {
        Toast("刷新成功");
        this.isLoading = false;
        this.refreshcount++;
      }, 1000);
    },
    // 分享
    onSelect(option) {
      Toast(option.name);
      this.showShare = false;
    },
    // 优惠券
    onChange(index) {
      this.showList = false;
      this.chosenCoupon = index;
    },
    onExchange(code) {
      this.coupons.push(coupon);
    },
    // 弹框
    showPopup() {
      this.show = true;
    },
    showPopupsku() {
      this.showsku = true;
    },
    async addCart() {
      if (
        this.chooseContent1 == "" ||
        this.chooseContent2 == "" ||
        this.chooseContent3 == ""
      ) {
        this.$toast({
          message: "你没选择地点、场次或者票档",
          className: "zindex",
        });
      } else {
        this.showsku = false;
        // 本地存储实现添加到购物车
        // 1.从本地存储中获得 商品数据 addGoods 数据
        let bool = true;
        this.addGoods = storage.get("addGoods") || [];
        for (var i = 0; i < this.addGoods.length; i++) {
          let item = this.addGoods[i];
          if (
            item.id == this.productone.productone._id &&
            item.goods_city == this.productone.productone.goods_city &&
            item.goods_time == this.productone.productone.goods_time &&
            item.goods_price == this.productone.productone.goods_price
          ) {
            // 修改商品数量
            var newAddGoodsOne = {
              id: item.id,
              num: item.num + this.newCount, //获得数量的值
              goods_city: this.chooseContent1,
              goods_time: this.chooseContent2,
              goods_price: this.chooseContent3,
              check: false,
            };
            this.addGoods.splice(i, 1); //删除第i(找到的那个商品下标)个,删1个 //删除就数据
            this.addGoods.push(newAddGoodsOne); //在添加修改的数据
            bool = false;
          }
        }
        //  b.如果没有直接添加商品信息
        if (bool) {
          var newAddGoodsOne = {
            id: this.productone.productone._id,
            num: this.newCount,
            goods_city: this.chooseContent1,
            goods_time: this.chooseContent2,
            goods_price: this.chooseContent3,
            check: false,
          };
          this.addGoods.push(newAddGoodsOne);
        }
        // (3)  将addGoods 数据  保存到本地存储中
        storage.set("addGoods", this.addGoods);
      }
      if (storage.get("token")) {
        //  size,color,id
        this.Api.addShop(
          this.userName._id,
          this.id,
          this.newCount,
          false,
          this.chooseContent1,
          this.chooseContent2,
          this.chooseContent3
        );
      }
    },
    async getProductOne() {
      if (!this.productOnes[this.id]) {
        //productOnes是二维数组
        //vuex中this.productOnes[this.id]是否存在,不存在调ajax并且存入vuex中
        let res = await this.Api.goodsDetail(this.id);
        console.log(res);
        this.productone = res.data.data; //productone.productone
        this.dataArr = res.data.data.comment; //评论
        console.log(res.data.data.comment);
        this.bool = true;
        this.productOneAction({
          // 以前访问： this.$store.dispatch('productOneAction,{data,id}) ('触发的方法',传递的数据)
          data: this.productone,
          id: this.id,
        }); // 调用productOneAction方法拿到接口数据
      } else {
        console.log("获得缓存信息");
        this.bool = true;
        this.productone = this.productOnes[this.id]; //productOnes 是vuex的变量 productone 是自己定义的变量
        this.dataArr = this.productone.comment; //评论
      }
      this.goods_city = this.productone.productone.goods_city.split(",");
      this.goods_time = this.productone.productone.goods_time.split(",");
      this.goods_price = this.productone.productone.goods_price.split(",");
    },

    count(newCount) {
      this.newCount = newCount; //子组件中拿到的数量
    },
    changeActive1(key, aa) {
      this.indexactive1 = key;
      this.aa = false;
    },
    changeActive2(key) {
      this.indexactive2 = key;
    },
    changeActive3(key) {
      this.indexactive3 = key;
    },
    // 须知,推荐，评论
    // 监听页面滚动
    handleScroll() {
      // 获取当前的滚动距离
      var scrollTop =
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop;
      console.log(scrollTop);
      if (scrollTop >= 500) {
        this.position = "fixed";
        this.top = "0";
      } else {
        this.position = "";
        this.top = "";
      }

      // 当滚动距离不小于200时，获取三个部分的顶部位置-45。
      let commentTop = this.$refs.comment.offsetTop - 45;
      let recommendTop = this.$refs.recommend.offsetTop - 45;
      let detailTop = this.$refs.detail.offsetTop - 45;
      // 计算滚动距离在哪个区间，修改this.active对应的样式名
      if (scrollTop < commentTop) {
        if (this.active != "goods") this.active = "goods";
      } else if (scrollTop >= commentTop && scrollTop < recommendTop) {
        if (this.active != "comment") this.active = "comment";
      } else if (scrollTop >= recommendTop && scrollTop < detailTop) {
        if (this.active != "recommend") this.active = "recommend";
      } else if (scrollTop >= detailTop) {
        if (this.active != "detail") this.active = "detail";
      }
    },

    // 点击导航栏第一个商品选项卡时，直接滚动到0
    onScrollGoods() {
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    // 点击导航栏其他选项卡时，直接滚动到对应ref的offsetTop-45(导航栏高度)
    onScrollComment() {
      window.scrollTo({
        top: this.$refs.comment.offsetTop - 45,
        behavior: "smooth",
      });
    },
    onScrollRecommend() {
      window.scrollTo({
        top: this.$refs.recommend.offsetTop - 45,
        behavior: "smooth",
      });
    },
    onScrollDetail() {
      window.scrollTo({
        top: this.$refs.detail.offsetTop - 45,
        behavior: "smooth",
      });
    },
  },

  created() {
    this.id = this.$route.params.id; //接收的动态传值的键对应的值
    if (storage.get("userName")) {
      this.userIsLike();
    }
  },
  mounted() {
    this.getProductOne();
    this.ChangTabbarShow(false); //注入 mixin.js

    window.addEventListener("scroll", this.handleScroll, true);
  },

  destroyed() {
    this.ChangTabbarShow(true);
    window.removeEventListener("scroll", this.handleScroll);
  },
  watch: {
    indexactive1() {
      this.chooseContent1 = this.productone.productone.goods_city.split(",")[
        this.indexactive1
      ];
      console.log(this.chooseContent1);
    },
    indexactive2() {
      this.chooseContent2 = this.productone.productone.goods_time.split(",")[
        this.indexactive2
      ];
      console.log(this.chooseContent2);
    },
    indexactive3() {
      this.chooseContent3 = this.productone.productone.goods_price.split(",")[
        this.indexactive3
      ];
      console.log(this.chooseContent3);
    },
  },
};
</script>
<style lang="scss" scoped>
#tab {
  background-color: #fff;
}
.board {
  width: 100%;
  position: relative;
  background-color: rgb(229, 229, 230);
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
}
.bg_image_path {
  position: fixed;
  right: 0;
  top: 0;
  filter: blur(6px);
  transition: all 0.5s ease 0s;
  z-index: -9999;
}
.board-info {
  width: 100%;
  margin-top: 100px;
  background-color: #fff;
  border-top-right-radius: 20px;
  border-top-left-radius: 20px;
  z-index: -22;
}
.goods-title {
  color: rgb(255, 255, 255);
  position: absolute;
  top: -70px;
  left: 130px;
  font-size: 16px;
  width: 55%;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.goods-top {
  height: 50px;
  display: flex;
  .image_path {
    flex: 0 0 80px;
    transform: translate3d(16px, -80px, 0);
    width: 105px;
    height: 120px;
    border-radius: 6px;
  }
  .goods-right {
    padding-left: 30px;
    flex: 1;
    .pic {
      margin-top: 10px;
      color: #ff4444;
      font-size: 14px;
    }
  }
}
.description-box {
  display: flex;
  border-bottom: 1px solid rgb(206, 203, 203);
  width: 100%;
  height: 50px;
  justify-content: space-around;
  align-items: center;
}
.gantanimg {
  width: 15px;
  height: 15px;
  margin-top: 5px;
  margin-right: 1px;
}

.start_data,
.place {
  height: 80px;
  border-bottom: 1px solid rgb(206, 203, 203);
  display: flex;
  justify-content: space-around;
  align-items: center;
}

.start_data {
  border-top: 1px solid rgb(206, 203, 203);
}
.start_data_info,
.place_info {
  padding-left: 15px;
  flex: 9;
}
.goods_city,
.goods_time {
  font-weight: 700;
  font-size: 18px;
}
.goods_time_text {
  margin-top: 6px;
  font-size: 13px;
}
.goods_position {
  margin-top: 6px;
  font-size: 13px;
}
.place_img_box {
  width: 26px;
  height: 26px;
  margin-right: 18px;
}
.place_img {
  width: 100%;
  height: 100%;
}
.tab_box {
  margin-top: 0;
}
.pasg {
  width: 100%;
  padding: 5px;
}
.duiimg {
  width: 20px;
  height: 20px;
}
.sever-box {
  padding: 20px;
}
.sever-box h3 {
  padding-top: 6px;
  padding-bottom: 6px;
  font-weight: 700;
}
.sever-box div {
  padding-left: 22px;
  line-height: 22px;
  font-size: 14px;
}
.sever-title {
  font-weight: 700;
  font-size: 20px;
  margin-left: 20px;
  padding-top: 20px;
  padding-bottom: 10px;
}
.goods-bottom {
  height: 70px;
  padding: 10px 16px 10px 16px;
  box-sizing: border-box;
  display: flex;
  .left {
    flex: 0 0 60%;
    width: 60%;
    .num {
      font-size: 12px;
    }
  }
}
.totle {
  margin-top: 15px;
  color: #999;
  font-size: 12px;
  padding-top: 10px;
  padding-bottom: 10px;
  span {
    color: #f44;
    margin-left: 10px;
    font-size: 12px;
  }
}

// 弹层里的样式
.active-1 {
  min-height: 300px;
}
.label-title {
  margin-top: 50px;
  padding-left: 10px;
  font-size: 14px;
  font-weight: bold;
}
.size-label-box .label {
  font-size: 13px;
  color: #000;
  padding-left: 15px;
  padding: 15px 0 10px 15px;
}
.size-label-box .label-item-box {
  display: flex;
  margin-left: 15px;
  flex-direction: row;
  flex-wrap: wrap;
}
.size-label-box .label-item {
  width: 100px;
  text-align: center;
  font-size: 13px;
  color: #000;
  padding: 7px 10px;
  border: 1px solid #ddd;
  border-radius: 3px;
  margin: 0 10px 10px 0;
}
.size-label-box .label-item.active {
  color: #e64340;
  border: 1px solid #e64340;
}
.bottom {
  height: 50px;
  background: #f44;
  text-align: center;
  line-height: 50px;
  font-size: 16px;
  color: #fff;
  letter-spacing: 2px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.youhui {
  border-bottom: 1px solid #ccc;
}
//评论详情tab切换
.tabbox {
  background-color: #fff;
  // height: 100%;
}
.nav {
  height: 45px;
  width: 100%;
  background-color: #fff;
  z-index: 99;
  opacity: 1;
  border-bottom: 1px solid #ccc;
}

.detail_anchor {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: 14px;
  color: #666;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
  // justify-content: space-evenly;
  justify-content: space-between;
}

.header-new-title {
  margin: 0 20px;
  height: 44px;
  font-size: 16px;
  line-height: 44px;
  text-align: center;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.active {
  color: #e4393c;
  border-bottom: 2px solid #e4393c;
}

.de_btn_bar {
  height: 50px;
  width: 100%;
  background-color: #fff;
  position: fixed;
  z-index: 99;
  bottom: 0;
}
.btn_group {
  /* display: flex;
            justify-content: space-evenly; */
  height: 100%;
}
.btn_group_item {
  display: inline-block;
  height: 100%;
  width: 25%;
  margin-right: -5px;
  padding: 0;
  text-align: center;
  line-height: 50px;
}
.add_cart {
  color: #fff;
  background: linear-gradient(138deg, #ffa600, #ffb000 77%, #ffbc00);
}
.now_buy {
  color: #fff;
  background: linear-gradient(-41deg, #ff4f18, #ff2000 24%, #f10000);
}

/*产品详情页*/
.productInfo {
  display: flex;
  height: 35px;
  justify-content: space-around;
  align-items: center;
  text-align: center;
  margin: 6px 0;
  background: #fff;
  border-bottom: 1px solid #ccc;
}
.productInfo li {
  flex: 1;
}
.productInfo li:nth-of-type(1) {
  border-right: 1px solid #ccc;
}
</style>
