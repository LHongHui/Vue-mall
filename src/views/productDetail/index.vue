<template>
  <div v-if="bool">
    <!-- 分类页的头部 -->
    <van-nav-bar title="产品详情" left-arrow @click-left="goback" />
    <img :src="url + productone.productone.goods_img" class="bg_image_path" />
    <Scroll
      class="content"
      ref="scroll"
      :pullup="true"
      @scrollToEnd="scrollToEnd"
    >
      <div class="scroll_board">
        <!-- xia -->
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
                  <span>{{ productone.productone.shop_price }}起</span>
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
                  <img
                    src="@/assets/svg/gantan.svg"
                    class="gantanimg"
                  />自助取票
                  <img
                    src="@/assets/svg/gantan.svg"
                    class="gantanimg"
                  />电子发票
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
                  <h3>
                    <img src="@/assets/svg/dui.svg" class="duiimg" />快递票
                  </h3>
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
          </div>
        </div>
        <!-- shang -->
        <!-- 产品详情和评论tab -->
        <div class="tabbox">
          <van-tabs
            v-model="currentActive"
            class="datails-tabs"
            animated
            swipeable
          >
            <van-tab v-for="val in item" :title="val.title" :key="val.id">
              <div
                v-show="currentActive == 0"
                v-html="productone.productone.goods_content"
                class="active-0"
              ></div>
              <div v-show="currentActive == 1" class="active-1">
                <div class="comment" v-for="val of dataArr" :key="val._id">
                  <div class="comment-content">
                    <div class="avatar">
                      <img
                        v-if="!val.anonymous"
                        :src="url + val.user[0].avatar"
                        :onerror="defaultImg"
                        alt
                        srcset
                      />
                      <img v-else :src="val.comment_avatar" alt srcset />
                    </div>
                    <div class="desc border-bottom">
                      <p class="fist">
                        <span class="name" v-if="!val.anonymous"
                          >{{
                            val.user[0].nickname || val.user[0].username
                          }}：</span
                        >
                        <span class="name" v-else>{{ val.nickname }}：</span>
                        <span class="num">{{ val.comment_time }}</span>
                      </p>
                      <p class="timer">
                        <van-rate
                          v-model="val.rate"
                          readonly
                          :size="12"
                          color="#e0322b"
                        />
                      </p>
                      <p class="cont">{{ val.content }}</p>
                      <div
                        class="img-content"
                        :class="setImgContentClass(val.images.length)"
                      >
                        <img
                          v-for="img of val.images"
                          class="img"
                          :class="setImgClass(val.images.length)"
                          :key="img"
                          :src="url + img"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-if="!dataArr.length" class="nocomment">
                  该商品暂无评论噢~~
                </div>
              </div>
            </van-tab>
          </van-tabs>
        </div>
      </div>
    </Scroll>

    <!-- 商品购买导航 -->
    <van-goods-action>
      <van-goods-action-icon
        icon="share-o"
        text="分享"
        @click="showShare = true"
      />
      <van-share-sheet
        v-model="showShare"
        title="立即分享给好友"
        :options="options"
        @select="onSelect"
      />
      <van-goods-action-icon
        icon="cart-o"
        text="购物车"
        :info="shopnum"
        @click="toLinkCart"
      />

      <van-goods-action-icon
        icon="star"
        text="未收藏"
        v-if="!isLike"
        @click="userlike"
      />
      <van-goods-action-icon
        icon="star"
        text="已收藏"
        color="#ff5000"
        v-if="isLike"
        @click="userunLike"
      />
      <van-goods-action-button
        type="warning"
        text="加入购物车"
        @click="purchase"
      />
      <van-goods-action-button
        type="danger"
        @click="nowchase"
        text="立即购买"
      />
    </van-goods-action>
    <!-- 规格 -->
    <transition name="bounce2">
      <div class="sku" v-show="showBase">
        <van-icon name="close" class="close" @click="gclose()" />
        <!-- <div class="goods-top border-bottom">
          <div class="goods-right">
            <p class="goods-name">{{ productone.productone.title }}</p>
            <p class="pic">
              <span>￥</span>
              <span>{{ productone.productone.market_price * newCount }}</span>
            </p>
            <p class="goods-name">
              <span
                v-if="
                  chooseContent1 != '' &&
                  chooseContent2 != '' &&
                  chooseContent3 != ''
                "
              >
                选择的是:{{
                  chooseContent1 + "," + chooseContent2 + "," + chooseContent3
                }}
              </span>
              <span v-else> 请选择 </span>
            </p>
          </div>
        </div> -->
        <div class="goods-center border-bottom">
          <div class="label-title">选择规格</div>

          <!-- <div class="size-label-box">
            <div class="label">颜色:</div>
            <div class="label-item-box">
              <div
                class="label-item"
                :class="indexactive1 == key ? 'active' : ''"
                v-for="(coloritem, key) in productone.colorResult"
                :key="key"
                @click="changeActive1(key)"
              >
                {{ coloritem.color_name }}
              </div>
            </div>
          </div>
          <div class="size-label-box">
            <div class="label">尺寸:</div>
            <div class="label-item-box">
              <div
                class="label-item"
                :class="indexactive2 == key ? 'active' : ''"
                v-for="(sizeitem, key) in productone.sizeResult"
                :key="key"
                @click="changeActive2(key)"
              >
                {{ sizeitem.size_value }}
              </div>
            </div>
          </div> -->

          <div class="size-label-box">
            <div class="label">地点:</div>
            <div class="label-item-box">
              <div
                class="label-item"
                :class="indexactive1 == key ? 'active' : ''"
                v-for="(cityitem, key) in productone.cityResult"
                :key="key"
                @click="changeActive1(key)"
              >
                {{ cityitem }}
              </div>
            </div>
          </div>
          <div class="size-label-box" v-show="aa">
            <div class="label">场次:</div>
            <div class="label-item-box">
              <div
                class="label-item"
                :class="indexactive2 == key ? 'active' : ''"
                v-for="(timeitem, key) in productone.timeResult"
                :key="key"
                @click="changeActive2(key)"
              >
                {{ timeitem }}
              </div>
            </div>
          </div>
          <div class="size-label-box" v-show="bb">
            <div class="label">票档:</div>
            <div class="label-item-box">
              <div
                class="label-item"
                :class="indexactive3 == key ? 'active' : ''"
                v-for="(priceitem, key) in productone.priceResult"
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
                <span>每人限购5件</span>
              </p>
            </div>
            <AdditionAndSubtraction @count="count" />
          </div>
          <div class="bottom btn1" @click="addCart" v-if="!flag">
            添加到购物车
          </div>
          <div class="bottom btn2" @click="PurchaseImmediately" v-if="flag">
            立即购买
          </div>
        </div>
      </div>
    </transition>

    <transition name="fade">
      <div class="sku-layer" v-show="showBase" @click="showBase = false"></div>
    </transition>
  </div>
</template>

<script>
import storage from "@/assets/js/storage.js"; // set(),get(),remove(),clear()
import { vuexData } from "@/assets/js/mixin";
import Swiper from "swiper";
import navBar from "@/components/navbar.vue";
import config from "@/assets/js/config.js";
import AdditionAndSubtraction from "@/components/AdditionAndSubtraction";
import Scroll from "@/components/Scroll";
import { ShareSheet } from "vant"; //分享
import { Toast } from "vant"; //分享
export default {
  name: "productDetail",
  mixins: [vuexData],
  components: {
    navBar,
    AdditionAndSubtraction,
    Scroll,
  },
  data() {
    return {
      flag: false,
      swiper2: [],
      defaultImg: "",
      comment: "",
      isLike: false,
      bool: false,
      id: null,
      swipers: [],
      url: config.api,
      productone: [],
      currentActive: 0,
      item: [
        {
          id: 0,
          title: "商品详情",
        },
        {
          id: 1,
          title: "商品评论",
        },
      ],
      showBase: false, // 显示sku
      newCount: 1,
      indexactive1: null,
      indexactive2: null,
      indexactive3: null,
      chooseContent1: "",
      chooseContent2: "",
      chooseContent3: "",

      // 弹框
      show: false,
      showsku: false,
      aa: false,
      bb: false,
      // 分享
      showShare: false,
      options: [
        { name: "微信", icon: "wechat" },
        { name: "微博", icon: "weibo" },
        { name: "复制链接", icon: "link" },
        { name: "分享海报", icon: "poster" },
      ],
    };
  },
  methods: {
    // 弹框
    showPopup() {
      this.show = true;
    },
    showPopupsku() {
      this.showsku = true;
    },
    // 分享
    onSelect(option) {
      Toast(option.name);
      this.showShare = false;
    },

    gclose() {
      this.showBase = false;
      this.flag = false;
    },
    async nowchase() {
      this.flag = true;
      this.showBase = true;
    },
    // 立即购买
    PurchaseImmediately() {
      if (
        this.chooseContent1 == "" ||
        this.chooseContent2 == "" ||
        this.chooseContent3 == ""
      ) {
        this.$toast({
          message: "你没选择完整",
          className: "zindex",
        });
      } else {
        // 立即购买必须登录到确认comfirmOrder订单页中
        if (!this.token) {
          this.$router.push("/login");
          return;
        }
        let goods = [
          {
            check: true,
            num: this.newCount,
            id: this.id,
            goods_img: this.productone.productone.goods_img,
            mallPrice: this.productone.productone.market_price * this.newCount,
            market_price: this.productone.productone.market_price,
            title: this.productone.productone.title,
            idDirect: true, // 重要重要重要(判断是否是从立即购买中来的)
            color: "5f6410249dc94371204b5f5e",
            size: "5f7142eac55ffd89a572b219",
            city: this.productone.cityResult[this.indexactive1],
            time: this.productone.timeResult[this.indexactive2],
            price: this.productone.priceResult[this.indexactive3],
          },
        ];
        this.$router.push("/confirmOrder");
        this.setShopList(goods); // vuex  shopOrderList中
      }
    },
    // async getColorSwiper2() {
    //   //console.log(this.productone.colorResult[this.indexactive1]._id, this.id);
    //   let res = await this.Api.getImageStore(
    //     this.productone.colorResult[this.indexactive1]._id,
    //     this.id
    //   );
    //   this.swiper2 = res.data.data;
    //   console.log(this.swiper2);
    // },
    setImgClass(len) {
      return `img${len}`;
    },

    setImgContentClass(len) {
      return `img-content${len}`;
    },

    scrollToEnd() {
      setTimeout(() => {
        this.$refs.scroll.refresh();
      }, 20);
      // 评论分页
      if (this.currentActive == 1) {
        if (this.dataArr.length >= 5) {
          this.page++;
          if (this.hasMore()) {
            this.goodsItem(this.id, true);
          } else {
            this.$toast("没有更多评论了~~");
          }
        }
      }
    },
    async userIsLike() {
      var res = await this.Api.userIsLike(this.id, this.userName._id);
      console.log(res);
      if (res.data.success) {
        this.isLike = true;
      } else {
        this.isLike = false;
      }
    },
    async userlike() {
      if (!storage.get("token")) {
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
      if (!storage.get("token")) {
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
    toLinkCart() {
      this.$router.push("/cart");
    },
    async addCart() {
      if (
        this.chooseContent1 == "" ||
        this.chooseContent2 == "" ||
        this.chooseContent3 == ""
      ) {
        this.$toast({
          message: "你没选择完整",
          className: "zindex",
        });
      } else {
        // this.showsku = false;
        this.showBase = false;
        //  本地存储实现添加到购物车
        // 1.从本地存储中获得 商品数据 addGoods 数据
        if (!storage.get("token")) {
          let bool = true;
          this.addGoods = storage.get("addGoods") || [];

          for (var i = 0; i < this.addGoods.length; i++) {
            let item = this.addGoods[i];
            if (
              item.id == this.productone.productone._id &&
              item.city == this.productone.cityResult[this.indexactive1] &&
              item.time == this.productone.timeResult[this.indexactive2] &&
              item.price == this.productone.priceResult[this.indexactive3]
            ) {
              // 修改商品数量
              var newAddGoodOne = {
                id: item.id,
                num: item.num + this.newCount, //获得数量的值
                color: "5f6410249dc94371204b5f5e",
                size: "5f7142eac55ffd89a572b219",
                city: this.productone.cityResult[this.indexactive1],
                time: this.productone.timeResult[this.indexactive2],
                price: this.productone.priceResult[this.indexactive3],
                check: false,
              };
              this.addGoods.splice(i, 1); //删除旧数据
              this.addGoods.push(newAddGoodOne); //在添加修改的数据
              bool = false;
            }
          }
          //  b.如果没有直接添加商品信息
          if (bool) {
            // 添加新商品
            var newAddGoodOne = {
              id: this.productone.productone._id,
              num: this.newCount,
              color: "5f6410249dc94371204b5f5e",
              size: "5f7142eac55ffd89a572b219",
              city: this.productone.cityResult[this.indexactive1],
              time: this.productone.timeResult[this.indexactive2],
              price: this.productone.priceResult[this.indexactive3],
              check: false,
            };
            this.addGoods.push(newAddGoodOne);
          }
          // (3)  将addGoods 数据  保存到本地存储中
          storage.set("addGoods", this.addGoods);

          this.addGoods = storage.get("addGoods") || [];
          if (!storage.get("token")) {
            let sum = 0;
            for (var key in this.addGoods) {
              sum += this.addGoods[key].num;
            }
            this.setShopnum(sum); //徽标数量更改
          }
        }
        if (storage.get("token")) {
          //  size,color,id
          this.Api.addShop(
            this.userName._id,
            this.id,
            this.newCount,
            false,
            "5f6410249dc94371204b5f5e",
            "5f7142eac55ffd89a572b219",
            this.productone.cityResult[this.indexactive1],
            this.productone.timeResult[this.indexactive2],
            this.productone.priceResult[this.indexactive3]
          );
          const { data } = await this.Api.getShop(this.userName._id);
          this.setShopnum(data.totalNumber + this.newCount); //徽标数量更改
        }
      }
    },
    changeActive1(key, aa) {
      this.indexactive1 = key;
      this.aa = true;
    },
    changeActive2(key, bb) {
      this.indexactive2 = key;
      this.bb = true;
    },
    changeActive3(key) {
      this.indexactive3 = key;
    },
    // 立即购买弹出sku
    purchase() {
      this.flag = false;
      this.showBase = true;
    },

    count(newCount) {
      this.newCount = newCount; // 子组件中拿到的数量
    },
    async getProductOne() {
      if (!this.productOnes[this.id]) {
        //vuex中this.productOnes[this.id]是否存在,不存在调ajax并且存入vuex中
        let res = await this.Api.goodsDetail(this.id);
        console.log(res.data.data);
        this.productone = res.data.data; //  当前商品信息:this.productone.productone
        this.dataArr = res.data.data.comment;
        this.bool = true; //手段为了让 ajax 拿到数据，然后渲染标记。
        this.productOneAction({
          // 以前访问： this.$store.dispatch('productOneAction,{data,id})
          data: this.productone,
          id: this.id,
        }); // 调用productionOneAction方法拿到接口数据
      } else {
        console.log("获得缓存信息");
        this.productone = this.productOnes[this.id];
        this.dataArr = this.productone.comment;
        this.bool = true;
      }
      this.swipers = this.productone.goodsImageResult;
      this.swiper2 = this.productone.goodsImageResult;
      console.log(this.swipers, this.swiper2);
      this.$nextTick(() => {
        new Swiper(".swiper-container", {
          pagination: {
            // 圆圈
            el: ".swiper-pagination",
          },
          loop: true, // 循环
          autoplay: {
            delay: 2500, // 每隔2.5秒播放一张图
            disableOnInteraction: false, // true默认手动轮播停止后，自动播放会停止
            // 设置 为 false ,手动轮播停止后，自动播放继续使用
          },
        });
      });
    },
  },
  created() {
    this.id = this.$route.params.id; //接收的动态传值的键对应的值
    this.Api.addFoot(this.id); //浏览历史
    if (this.userName) {
      this.userIsLike();
    }
  },
  mounted() {
    this.getProductOne();
    this.ChangTabbarShow(false);
    this.getShopNum(); // mixins 里  this.getShopNum
    console.log(this.flag);
  },
  destroyed() {
    this.ChangTabbarShow(true);
  },
  watch: {
    indexactive1() {
      this.chooseContent1 = this.productone.cityResult[this.indexactive1];
    },
    indexactive2() {
      this.chooseContent2 = this.productone.timeResult[this.indexactive2];
    },
    indexactive3() {
      this.chooseContent3 = this.productone.priceResult[this.indexactive3];
    },
  },
};
</script>

<style lang="scss" scoped>
.content {
  position: fixed;
  /*可视高度*/
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0px;
  overflow: hidden;
}
.scroll_board {
  padding-top: 1px;
}

/*轮播图样式*/
.swiper-container {
  width: 100%;
  height: 200px;
}

.swiper-container img {
  width: 100%;
  height: 100%;
}

.router-link-active {
  color: #f60;
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

/*商品信息*/
.productOne > div {
  padding: 5px 20px;
}

.mytitle {
  overflow: hidden;
  text-overflow: ellipsis;
  line-clamp: 1;
  display: -webkit-box;
  text-overflow: -o-ellipsis-lastline;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  font: bold 40rpx 微软雅黑；;
}

.info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info .priceone {
  color: #f00;
  font: 20px 微软雅黑；;
}

.info .number {
  color: #aaa;
  font: 12px arial；;
}

.brand {
  color: #333;
  font: 12px arial；;
}

.sku {
  height: 55%;
  background: #fff;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;

  .close {
    position: absolute;

    right: 0%;
    top: 0%;
    font-size: 18px;
    z-index: 200;
    padding: 10px;
  }

  .goods-top {
    position: relative;

    height: 90px;
    display: flex;

    .image_path {
      position: relative;

      top: 10px;
      flex: 0 0 120px;
      width: 120px;
      height: 120px;
      border: 1px solid #eee;
    }

    .van-swipe-item {
      z-index: 99999999 !important;
    }

    .goods-right {
      padding-left: 30px;
      flex: 1;

      .goods-name {
        font-size: 14px;
        margin-top: 10px;
        padding-right: 35px;
        line-height: 1.4;
      }

      .pic {
        margin-top: 10px;
        color: #ff4444;
        font-size: 14px;
      }
    }
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

      .totle {
        margin-top: 15px;
        color: #999;
        font-size: 12px;

        span {
          color: #f44;
          margin-left: 10px;
          font-size: 12px;
        }
      }
    }
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
  .btn1 {
    background: linear-gradient(to right, #ffd01e, #ff8917);
    border-radius: 25px;
  }
  .btn2 {
    background: linear-gradient(to right, #ff6034, #ee0a24);
    border-radius: 25px;
  }
}

.sku-layer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1;
}

.goods {
  padding-bottom: 50px;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;

  // overflow: auto;
  &-swipe {
    img {
      width: 100%;
      height: 400px;
      display: block;
    }
  }

  &-title {
    font-size: 16px;
  }

  &-price {
    color: #f44;
  }

  &-express {
    color: #999;
    font-size: 12px;
    padding: 5px 15px;
  }

  &-cell-group {
    margin: 15px 0;

    .van-cell__value {
      color: #999;
    }
  }

  &-tag {
    margin-left: 5px;
  }
}

.active-1 {
  min-height: 300px;
}

.label-title {
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

.comment {
  margin-top: 15px;

  .comment-content {
    display: flex;
    margin: 12px;

    &-first-child {
      margin-top: 50px;
    }

    .avatar {
      flex: 0 0 35px;
      width: 35px;
      margin-right: 20px;

      img {
        width: 38px;
        height: 38px;
        border: 1px solid #eee;
        border-radius: 50%;
      }
    }

    .desc {
      flex: 1;
      padding-bottom: 8px;
      display: flex;
      flex-direction: column;

      &-last-child::before {
        border: 0;
      }

      .fist {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .name {
          font-size: 14px;
          color: grey;
        }

        .num {
          color: gray;
          font-size: 14px;
        }
      }

      .timer {
        color: grey;
        margin-top: 8px;
      }

      .cont {
        margin-top: 8px;
        color: #333;
        overflow: hidden;
        word-wrap: break-word;
        word-break: break-all;
        text-align: justify;
        font-size: 14px;
        line-height: 1.6;
      }

      .img-content {
        display: flex;
        width: 100%;
        flex-wrap: wrap;

        .img {
          flex: 0 0 80px;
          width: 90px;
          flex-wrap: wrap;
          object-fit: cover;
          height: 90px;
          border-radius: 3px;
          margin-bottom: 5px;
          margin-right: 6px;
        }

        .img1 {
          flex: 1;
          height: 200px;
          margin-top: 10px;
        }

        .img2 {
          flex: 0 0 49%;
          height: 110px;
          margin: 0;
          margin-top: 10px;
        }
      }
    }
  }
}

.like {
  position: relative;
  display: flex;
  align-items: center;

  .like-o {
    font-size: 20px;
    position: absolute;
    right: 35%;
  }

  .like2 {
    font-size: 20px;
    position: absolute;
    right: 8%;
    color: red;
  }
}

.nocomment {
  text-align: center;
  color: #333;
  margin-top: 50px;
}

//zxy
.tabbox {
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
  margin-top: 200px;
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
//
</style>
