<template>
  <div class="page">
    <!--购物车navbar 导航-->
    <nav-bar>
      <span slot="left" class="iconfont icon-fanhui" @click="goback()"></span>
      <div slot="center">票夹</div>
      <span slot="right" class="iconfont icon-saoyisao"></span>
    </nav-bar>
    <!--没商品的页面-->
    <div v-if="!hasProduct" class="no-cart">
      <img src="@/assets/images/no-cart.png" />
      <p>
        票夹是空的
        <mt-button type="danger" size="large" @click="gohome">去订票</mt-button>
      </p>
    </div>
    <!--有商品的页面-->
    <div v-if="hasProduct" class="has-cart">
      <!--<i class="iconfont" :class="mycheck?'icon-yigouxuan':'icon-weigouxuan'"></i>-->
      <!-- <Scroll class="content"> -->
      <van-pull-refresh
        class="content"
        v-model="isLoading"
        success-text="刷新成功"
        @refresh="onRefresh"
      >
        <div>
          <h3>
            新视界<van-tag color="red" text-color="#fff">票务专卖</van-tag>
          </h3>
          <!-- <ul class="my-addList">
              <li class="my-item" v-for="(shop, key) in dataList" :key="key"> -->
          <van-swipe-cell
            class="my-item"
            v-for="(shop, key) in dataList"
            :key="key"
          >
            <input
              class="mycheckbox"
              type="checkbox"
              v-model="checkgroup"
              :value="shop"
              @change="handleChange(shop)"
            />

            <div class="image">
              <router-link :to="'/productDetail/' + shop.id">
                <img :src="url + shop.goods_img" />
              </router-link>
            </div>
            <div class="center">
              <div class="info">
                <p class="title">{{ shop.title }}</p>
              </div>
              <div class="proper">
                <p class="position">{{ shop.city }}</p>
                <p class="time">{{ shop.time }}</p>
              </div>
              <div class="bottom">
                <p>
                  ¥<span>{{ shop.price }}</span
                  >.00
                </p>
                <div class="productNum" @click="setcount(shop)">
                  <AdditionAndSubtraction @count="count" :mycount="shop.num" />
                </div>
              </div>
            </div>
            <template #right>
              <van-button
                square
                class="cat-button"
                type="danger"
                text="删除"
                @click="del(shop, key)"
              />
            </template>
          </van-swipe-cell>
          <!-- </li>
            </ul> -->
        </div>
      </van-pull-refresh>
      <!-- </Scroll> -->

      <!--结算-->
      <div class="calc">
        <div class="chooseAll">
          <input
            type="checkbox"
            @change="handleAllChecked()"
            v-model="isAllChecked"
          />
          &nbsp;全选
        </div>

        <p class="price">
          <span>总计:</span>
          <span class="total"
            >¥<span>{{ computedSum }}</span
            >.00</span
          >元
        </p>
        <p class="order" @click="placeOrder">结算</p>
      </div>
    </div>
  </div>
</template>

<script>
import { Dialog } from "vant";
import AdditionAndSubtraction from "@/components/AdditionAndSubtraction";
import { getaddGoodsByGoodsId, getCartIndexById } from "@/assets/js/util.js";
import storage from "@/assets/js/storage.js";
import navBar from "@/components/navbar.vue";
import config from "@/assets/js/config.js";
import { vuexData } from "@/assets/js/mixin";
import Scroll from "@/components/Scroll";
export default {
  name: "cart",
  filters: {
    getColor(x, colorResult) {
      // 获得颜色和尺寸数据

      for (var k in colorResult) {
        if (colorResult[k]._id == x) {
          return colorResult[k].color_name;
        }
      }
    },
    getSize(x, sizeResult) {
      // 获得颜色和尺寸数据

      for (var k in sizeResult) {
        if (sizeResult[k]._id == x) {
          return sizeResult[k].size_value;
        }
      }
    },
  },
  data() {
    return {
      colorResult: [],
      sizeResult: [],
      newCount: 1,
      checked: false,
      url: config.api,
      hasProduct: false,
      checkgroup: [], // 勾选的商品，勾选商品才结算(重要)
      isAllChecked: false,
      sum: 0,
      dataList: [],
      addGoods: [], // 本地存储的商品数据，num,id
      isLoading: false, //下拉刷新
    };
  },
  mixins: [vuexData],
  components: {
    navBar,
    AdditionAndSubtraction,
    Scroll,
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      // console.log(from.name);
      if (from.name == "login") {
        vm.addShopDataList(); // 同步数据库
      }
      // 通过 `vm` 访问组件实例
    });
  },
  methods: {
    onRefresh() {
      setTimeout(() => {
        this.isLoading = false;
        location.reload();
      }, 1000);
    },
    getAddCart() {
      this.addGoods = storage.get("addGoods") || [];
      if (this.addGoods.length != 0) {
        this.hasProduct = true;
        this.getProducts();
      } else {
        this.hasProduct = false;
      }
    },
    async delShop(shop) {
      await this.Api.deleteShop(
        this.userName._id,
        shop.id,
        shop.color,
        shop.size,
        shop.city,
        shop.time,
        shop.price
      );
      this.getShop(); // 重新调用 远程的购物车数据
      this.getShopNum(); //重新渲染徽标数量
    },
    async getShop() {
      let res = await this.Api.getShop(this.userName._id);
      // 获得购物车的数据：
      if (res.data.success) {
        this.dataList = res.data.data;
        if (this.dataList != 0) {
          this.hasProduct = true;
          this.getProducts();
        } else {
          this.hasProduct = false;
        }
      }
      this.getShopNum(); //重新渲染徽标数量
    },
    // 提交订单
    placeOrder() {
      // 判断用户是否登录？
      if (this.computedSum <= 0) {
        this.$dialog.alert({
          message: "请至少选择一个产品去结算",
          className: "zindex",
        });
      } else if (!storage.get("token")) {
        this.$dialog
          .alert({
            message: "您尚未登录",
            className: "zindex",
          })
          .then(() => {
            this.$router.push("/login");
          });
      } else {
        let shopList = [];
        // 调转到确认订单
        this.$router.push("/confirmOrder");
        this.dataList.forEach((item) => {
          if (item.check) {
            shopList.push(item);
          }
        });
        this.setShopList(shopList);
        // vuex 将购物车中购买的商品存入 shopOrderList
        // vuex 将来在其他页面中可以 获得到  this.shopOrderList
      }
    },
    async addShopDataList() {
      if (!this.addGoods) {
        return;
      }
      if (storage.get("token")) {
        this.addGoods = storage.get("addGoods") || [];
        console.log(this.addGoods);
        // 登录后同步购物车
        for (let i = 0; i < this.addGoods.length; i++) {
          //  size,color,id
          console.log(this.addGoods[i]);
          this.Api.addShop(
            this.userName._id,
            this.addGoods[i].id, //商品id

            this.addGoods[i].num,
            this.addGoods[i].check,
            this.addGoods[i].color,
            this.addGoods[i].size,
            this.addGoods[i].city,
            this.addGoods[i].time,
            this.addGoods[i].price
          );
        }
        storage.remove("addGoods");
      }
      this.getShopNum(); //重新渲染徽标数量
    },
    gohome() {
      this.$router.push("/home");
    },
    async del(shop, key) {
      let index = getCartIndexById(this.addGoods, shop);
      // 删除本地存储中this.addGoods(删除对应商品)
      if (!storage.get("token")) {
        // 查找商品id在本地存储的下标
        this.$dialog
          .alert({
            message: "删除成功",
            className: "zindex",
          })
          .then(() => {
            window.location.reload();
            this.addGoods.splice(index, 1);
            storage.set("addGoods", this.addGoods);
            // this.getAddCart(); // addGoods
          });
        this.getShopNum(); //重新渲染徽标数量
      } else {
        this.$dialog
          .alert({
            message: "删除成功",
            className: "zindex",
          })
          .then(() => {
            // this.dataList.splice(key, 1);
            this.delShop(shop);
          });
        this.getShopNum(); //重新渲染徽标数量
      }
    },
    async handleAllChecked() {
      console.log("处理多选按钮", this.isAllChecked);

      if (this.isAllChecked) {
        this.checkgroup = this.dataList;
        if (!storage.get("token")) {
          for (let i = 0; i < this.addGoods.length; i++) {
            this.addGoods[i].check = true;
            storage.set("addGoods", this.addGoods);
          }
        }

        for (let i = 0; i < this.dataList.length; i++) {
          this.dataList[i].check = true;
          let shop = this.dataList[i];
          if (storage.get("token")) {
            await this.Api.editCart(
              this.userName._id,
              shop.num,
              shop.id,
              shop.check,
              shop.color,
              shop.size,
              shop.city,
              shop.time,
              shop.price
            );
            this.getShopNum(); //重新渲染徽标数量
          }
        }
      } else {
        this.checkgroup = [];
        if (!storage.get("token")) {
          for (let i = 0; i < this.addGoods.length; i++) {
            this.addGoods[i].check = false;
            storage.set("addGoods", this.addGoods);
          }
        }
        for (let i = 0; i < this.dataList.length; i++) {
          this.dataList[i].check = false;
          let shop = this.dataList[i];
          if (storage.get("token")) {
            await this.Api.editCart(
              this.userName._id,
              shop.num,
              shop.id,
              shop.check,
              shop.color,
              shop.size,
              shop.city,
              shop.time,
              shop.price
            );
            this.getShopNum(); //重新渲染徽标数量
          }
        }
      }
    },
    async handleChange(shop) {
      // console.log("111")
      // 查找商品id在本地存储的下标
      if (!storage.get("token")) {
        let index = getCartIndexById(this.addGoods, shop);
        if (shop.check == true) {
          this.addGoods[index].check = false;
          shop.check = false;
        } else {
          this.addGoods[index].check = true;
          shop.check = true;
        }
        storage.set("addGoods", this.addGoods);
      } else {
        if (shop.check == true) {
          shop.check = false;
        } else {
          shop.check = true;
        }

        await this.Api.editCart(
          this.userName._id,
          shop.num,
          shop.id,
          shop.check,
          shop.color,
          shop.size,
          shop.city,
          shop.time,
          shop.price
        );
      }

      if (this.checkgroup.length === this.dataList.length) {
        console.log("全选中");
        this.isAllChecked = true;
      } else {
        console.log("没全选");
        this.isAllChecked = false;
      }
    },

    count(num) {
      this.newCount = num;
    },
    async setcount(shop) {
      //  购物车的本地存储数量和 远程数据库的数量的更新
      shop.num = this.newCount;
      console.log(shop.num);
      if (!storage.get("token")) {
        // 查找商品id在本地存储的下标
        let index = getCartIndexById(this.addGoods, shop);
        this.addGoods[index].num = shop.num;
        storage.set("addGoods", this.addGoods);
        this.getShopNum(); //重新渲染徽标数量
      } else {
        await this.Api.editCart(
          this.userName._id,
          shop.num,
          shop.id,
          shop.check,
          shop.color,
          shop.size,
          shop.city,
          shop.time,
          shop.price
        );
        this.getShopNum(); //重新渲染徽标数量
      }
    },
    async getProducts() {
      if (!storage.get("token")) {
        // 未登录的购物车：
        let ids = "";
        for (var k in this.addGoods) {
          ids += this.addGoods[k].id + ",";
        }
        console.log(ids);
        let res = await this.Api.getProducts(ids);

        let datas = res.data.data;
        for (let i = 0; i < datas.length; i++) {
          let dataone = datas[i]; // 每个商品
          // 通过 同一个商品的 _id  找对应的 addGoods商品的下标(多个)
          //  indexs = [0,1];
          var indexs = getaddGoodsByGoodsId(this.addGoods, dataone._id);
          console.log(indexs);
          for (var key in indexs) {
            this.$set(
              this.addGoods[indexs[key]],
              "goods_img",
              dataone.goods_img
            );
            this.$set(this.addGoods[indexs[key]], "title", dataone.title);
            this.$set(
              this.addGoods[indexs[key]],
              "market_price",
              dataone.market_price
            );
            this.dataList.push(this.addGoods[indexs[key]]);
          }
        }
      }
      // 重要，循环遍历 this.dataList check 如果是true this.checkgroup添加对应数据复选框就勾选了
      for (let i = 0; i < this.dataList.length; i++) {
        if (this.dataList[i].check == true) {
          this.checkgroup.push(this.dataList[i]);
        }
      }
      if (this.checkgroup.length === this.dataList.length) {
        console.log("全选中");
        this.isAllChecked = true;
      } else {
        console.log("没全选");
        this.isAllChecked = false;
      }
    },
  },
  computed: {
    computedSum() {
      console.log("重新计算总金额，关注已经勾选的数据，累加计算就可以了");
      var mysum = 0;
      for (var i = 0; i < this.checkgroup.length; i++) {
        //一个商品= 单价*数量
        mysum += this.checkgroup[i].num * this.checkgroup[i].price;
        console.log(this.checkgroup[i].num, this.checkgroup[i].price);
      }

      return mysum;
    },
  },
  async mounted() {
    // 获得本地存储的 addGoods 如果有商品 将 this.hasProduct = true

    if (!storage.get("token")) {
      this.getAddCart();
    } else {
      setTimeout(() => {
        this.getShop();
      }, 200);
    }
    let resInfo = await this.Api.getColorSize();
    // 获得颜色和尺寸：
    if (resInfo.data.success) {
      this.colorResult = resInfo.data.colorResult;
      this.sizeResult = resInfo.data.sizeResult;
    }
  },
};
</script>

<style lang="scss" scoped>
.content {
  // height: 500px;
  height: 84vh;
  overflow: hidden;
  // overflow-y: scroll;
  box-sizing: border-box;
}
.navbar {
  // background: linear-gradient(#eee, #ddd) !important; /*渐变*/
  background: #fff;
}
/*没商品的样式*/
.no-cart {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 50px 0 10px;
}
.no-cart img {
  width: 50%;
  height: 50%;
}
.no-cart p {
  padding: 30px 0;
  font: 20px 微软雅黑;
}
.has-cart {
  padding: 10px;
}
.has-cart h3 {
  padding: 10px 0;
  font: bold 14px 微软雅黑;
  border-radius: 8px;
  background: #fff;
  margin-bottom: 10px;
  padding-left: 17px;
}
.my-item {
  // display: flex;
  height: 100px;
  background: #fff;
  // padding: 10px 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 1px 3px 5px #979797;
}
.my-item .cat-button {
  height: 100px;
}
.mycheckbox {
  width: 10%;
  margin-top: 28px;
  zoom: 1.4;
  float: left;
}
.image {
  width: 20%;
  float: left;
  padding: 10px 0;
}
.image img {
  height: 80px;
}
.center {
  width: 70%;
  padding: 10px 10px;
  float: right;
}

.info {
  width: 100%;
  height: 25px;
  font: 15px/20px 微软雅黑;
}
.info .title {
  width: 100px;
  min-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.proper {
  width: 100%;
  height: 25px;
  font: 12px/20px 微软雅黑;
  padding-left: 8px;
}
.proper .position {
  // width: 30%;
  float: left;
  margin-right: 10%;
  border-radius: 3px;
  background: rgb(235, 235, 235);
}
.proper .time {
  // width: 40%;
  float: left;
  border-radius: 3px;
  background: rgb(235, 235, 235);
}
.bottom {
  width: 100%;
  height: 40px;
  padding-left: 8px;
}
.bottom p {
  height: 30px;
  // width: 40%;
  color: #f00;
  float: left;
  line-height: 30px;
  font-weight: 700;
}
.bottom p span {
  font-size: 20px;
}
.productNum {
  // width: 60%;
  height: 30px;
  display: flex;
  align-items: center;
  float: right;
}

.del {
  width: 10%;
}
.del button {
  display: inline-block;
  height: 80px;
  border: 0;
  background: #f00;
  color: #fff;
  padding: 0 3px;
  border-radius: 8px;
}
/*底部 结算*/
.calc {
  display: flex;
  position: fixed;
  left: 0;
  bottom: 60px;
  width: 100%;
  height: 60px;
  background: #fff;
  z-index: 1000 !important;
  line-height: 60px;
  padding: 0 0 0 10px;
}
.chooseAll {
  width: 20%;
  font-size: 15px;
  padding-top: 2px;
}
.chooseAll input {
  margin-top: -3px;
  zoom: 1.4;
  vertical-align: middle;
}
.price {
  width: 50%;
  line-height: 60px;
}
.price .total {
  color: #f00;
  font-weight: 700;
  // font-size: 20px;
}
.price .total span {
  font-size: 20px;
}
.order {
  width: 30%;
  height: 40px;
  margin-top: 10px;
  background: #f00;
  text-align: center;
  color: #fff;
  line-height: 40px;
  border-radius: 20px;
}
</style>
