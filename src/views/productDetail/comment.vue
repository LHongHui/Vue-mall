<template>
  <div class="active-1">
    <h1 class="h1_title">观众热评(6888万+)</h1>
    <div class="comment" v-for="val of dataArr" :key="val._id">
      <div class="comment-content">
        <div class="avatar">
          <img
            v-if="!val.anonymous"
            :src="val.user[0].avatar"
            :onerror="defaultImg"
            alt
            srcset
          />
          <img v-else :src="val.comment_avatar" alt srcset />
        </div>

        <div class="desc border-bottom">
          <p class="fist">
            <span class="name" v-if="!val.anonymous"
              >{{ val.user[0].nickname || val.user[0].username }}：</span
            >
            <span class="name" v-else>{{ val.nickname }}：</span>
            <span class="num">{{ val.comment_time }}</span>
          </p>
          <p class="timer">
            <van-rate v-model="val.rate" readonly :size="12" color="#e0322b" />
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
              :src="img"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-if="!dataArr.length" class="nocomment">
      <h1 class="h1_title">该商品暂无评论噢~~</h1>
      <!-- <img src="@/assets/svg/nocomment.svg" style="padding: 50px" /> -->
    </div>
  </div>
</template>

<script>
import config from "@/assets/js/config.js";
export default {
  name: "comment",
  data() {
    return {
      url: config.api,
    };
  },
  props: {
    //父传子传过来
    dataArr: {
      default: "",
    },
  },
  methods: {
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

      if (this.dataArr.length >= 5) {
        this.page++;
        if (this.hasMore()) {
          this.goodsItem(this.id, true);
        } else {
          this.$toast("没有更多评论了~~");
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.h1_title {
  font-weight: 700;
  margin-left: 6px;
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
      margin-right: 10px;
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
</style>