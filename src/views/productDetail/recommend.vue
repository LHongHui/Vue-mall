<template>
  <!-- 推荐商品 -->
  <Scroll
    :pullup="true"
    @scrollEnd="scrollToEnd"
    :data="dataArr"
    class="content"
    ref="scroll"
    :listenScroll="true"
    :probeType="3"
  >
    <div class="recommend" style="background-color: #fff">
      <h3>为你推荐</h3>

      <div class="content-scroll">
        <ul class="list">
          <li class="recommend-item" v-for="(item, key) in dataArr" :key="key">
            <router-link :to="'/productDetail/' + item._id">
              <div class="imgs">
                <img :src="url + item.goods_img" />
              </div>
              <div class="item-info">
                <p class="title">{{ item.title }}</p>
                <div class="info">
                  <span class="count">售票时间:{{ item.goods_time }}</span>
                  <span class="count">演出地点:{{ item.goods_time }}</span>
                  <span class="count yupiao">余票:{{ item.goods_number }}</span>
                  <div class="count_bottom">
                    <div>
                      <span class="price">￥{{ item.market_price }}</span
                      ><span>起</span>
                    </div>
                    <div class="hotsellbox">
                      <img class="hotsellimg" src="@/assets/svg/hotsell.svg" />
                      <span>热销{{ item.click_count }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </li>
          <div class="jzgdbtn">
            <van-tag plain type="primary">点击上滑加载更多</van-tag>
          </div>
        </ul>
      </div>
    </div>
  </Scroll>
</template>

<script>
import { Tag } from "vant";
import Scroll from "@/components/Scroll";
import config from "@/assets/js/config.js";
import { vuexData, page } from "@/assets/js/mixin";
export default {
  name: "recommend",
  mixins: [vuexData, page],
  components: {
    Scroll,
  },
  data() {
    return {
      url: config.api,
      products: [],
      isBacktopVisible: false,
      dataArr: [],
      page: 1,
      products: [],
    };
  },
  methods: {
    load() {
      this.count += 2;
    },
    scrollToEnd() {
      if (this.dataArr.length >= 2) {
        if (this.hasMore()) {
          //判断所有数据是否加载完了
          this.page++;
          this.recommend(true);
        } else {
          // this.$toast("没有很多数据了");
          console.log("没有很多数据了");
        }
      }
    },
    async recommend(flag) {
      try {
        if (this.isLocked()) return; // 必须等待上一次请求完成
        this.locked(); //开始请求之前锁住

        let res = await this.Api.recommend(this.page);
        console.log(res);
        if (res.data.success) {
          console.log("总条数" + res.data.totals);
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
    this.recommend(false);
  },
};
</script>

<style lang="scss" scoped>
// .content {
//   position: fixed; /*可视高度*/
//   top: 60px;
//   left: 0;
//   right: 0;
//   bottom: 60px;
//   overflow: hidden;
// }
.jzgdbtn {
  width: 100%;
  margin: 10px 100px;
}
.recommend {
  background-color: #fff;
}
.recommend h3 {
  padding: 10px;
  font-size: 20px;
  font-weight: 700;
}
.list {
  height: 100%;
}
.recommend-item {
  position: relative;
  margin: 8px;
}
.imgs {
  width: 40%;
  height: 100%;
}
.item-info {
  position: absolute;
  width: 58%;
  top: 0;
  right: 0;
  height: 100%;
}
.title {
  color: #333;
  font-size: 15px;
  padding-bottom: 20px;
}
.info {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.info .count {
  font-size: 10px;
  color: rgb(136, 137, 138);
  height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.count_bottom {
  display: flex;
  justify-content: space-between;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10px;
}
.hotsellbox{
  text-align: end;
}
.hotsellimg {
  width: 18px;
  height: 18px;
}
.price {
  color: #ff1368;
  font-size: 20px;
  padding-right: 2px;
}
</style>