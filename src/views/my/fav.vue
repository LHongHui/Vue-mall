<template>
  <!-- 我的收藏 -->
  <div class="browse-warp">
    <van-nav-bar title="我的收藏" left-arrow @click-left="goback" />
    <Scroll
      :pullup="true"
      @scrollEnd="scrollToEnd"
      :data="dataArr"
      class="scroll"
      :probeType="3"
    >
      <div class="dataArr2-box">
        <div class="dataArr2" v-for="(item, key) in dataArr" :key="key">
          <router-link :to="'/productDetail/' + item._id" class="link">
            <img class="img" :src="url + item.goods_img" alt />
          </router-link>
          <div class="goods-info">
            <router-link :to="'/productDetail/' + item._id"
              ><div class="title ellipsis">{{ item.title }}</div>
            </router-link>
            <img
              class="delete-btn"
              src="@/assets/icon/delete.svg"
              @click="removeFavOne(item, item._id)"
            />
          </div>
        </div>
      </div>
      <div v-if="!dataArr.length" class="null">
        {{ userName ? "暂无收藏~~" : "请先登录噢~~" }}
      </div>
    </Scroll>
  </div>
</template>

<script>
import config from "@/assets/js/config";
import storage from "@/assets/js/storage";
import Scroll from "@/components/Scroll";
import { page, vuexData } from "@/assets/js/mixin";
export default {
  name: "fav",
  mixins: [page, vuexData],
  components: {
    Scroll,
  },

  data() {
    return {
      url: config.api,
      dataArr: [],
      page: 1,
    };
  },

  created() {
    this.getCollection(false); // 初始获得收藏的列表
  },
  methods: {
    async getCollection(flag) {
      if (!storage.get("token")) {
        this.$toast({
          message: "您尚未登录",
          className: "zindex",
        });
        this.showFlag = false;
        this.$router.push("/login");
        return;
      }

      try {
        if (this.isLocked()) return; // 必须等待上一次请求完成
        this.locked(); //开始请求之前锁住

        let res = await this.Api.getCollection(this.page, this.userName._id);
        console.log(res.data);
        if (res.data.success) {
          this.setTotal(res.data.totals); // 总条数
          this.unLocked(); // 解锁
          if (flag) {
            this.setNewData(res.data.data);
            console.log(this.dataArr);
          } else {
            this.dataArr = res.data.data;
          }
        }
      } catch (error) {
        this.unLocked(); // 解锁
        this.$toast("网络错误");
      }
    },
    // 这里是取消收藏
    async removeFavOne(item, index) {
      try {
        let res = await this.Api.userunLike(item._id, this.userName._id);
        if (res.data.success) {
          window.location.reload();
          setTimeout(() => {
            this.dataArr.splice(index, 1);
          }, 500);
        }
      } catch (error) {
        this.$toast("网络错误");
      }
    },

    // 上拉加载
    scrollToEnd() {
      if (this.dataArr.length >= 6) {
        if (this.hasMore()) {
          this.page++;
          this.getCollection(true);
        } else {
          this.$toast({ message: "没有很多数据了~~", className: "zindex" });
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.browse-warp {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  background: #fff;

  .scroll {
    position: fixed;
    top: 40px;
    bottom: 0px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
}

.ellipsis {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  word-break: break-all;
}
.dataArr2-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  flex-wrap: wrap;
}
.dataArr2 {
  margin: 8px 0 8px 15px;
  width: 42%;
  background: #fff;
}
.dataArr2 .img {
  width: 100%;
  height: 160px;
  border-radius: 30px;
  overflow: hidden;
}
.dataArr2 .goods-info {
  padding: 8px;
}
.dataArr2 .goods-info .title {
  color: #333;
  font-size: 13px;
}
.dataArr2 .goods-info .price {
  color: #ff3b30;
  font-size: 17px;
}
.delete-btn {
  width: 27px;
  height: 27px;
  margin: auto;
  margin-top: 16px;
}
</style>

