<template>
  <div>
    <nav-bar>
      <div slot="left" class="lefticon">
        <i class="iconfont icon-fanhui" @click="goback"></i>
      </div>
      <div slot="center" class="search">
        <form action="/">
          <van-search
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @cancel="onCancel"
            ref="input"
            v-model="query"
            @change="searchHistory(item)"
            background="#fff"
          />
        </form>
      </div>
      <span slot="right">
        <div v-if="listType == 1">
          <img
            class="show-type"
            src="@/assets/icon/list1.svg"
            @click="changeShowType"
          />
        </div>
        <div v-else>
          <img
            class="show-type"
            src="@/assets/icon/list2.svg"
            @click="changeShowType"
          />
        </div>
      </span>
    </nav-bar>

    <search-history ref="history" @keywordEnd="getkeyword" />
    <search-result :query="query" v-show="query" :listType="listType" />
    <!-- 父向子传值 -->
    <van-empty
      class="custom-image"
      image="https://img.yzcdn.cn/vant/custom-empty-image.png"
      description="没有内容,快去搜索"
    />
  </div>
</template>

<script>
import { Toast } from "vant";
import { Search } from "vant";
import navBar from "@/components/navbar.vue";
import SearchResult from "./result";
import SearchHistory from "./history";
import { vuexData } from "@/assets/js/mixin";
import { Empty } from "vant";
export default {
  name: "home",
  mixins: [vuexData],
  components: {
    navBar,
    SearchResult,
    SearchHistory,
  },
  data() {
    return {
      query: "",
      listType: 1,
    };
  },
  methods: {
    // 搜索插件开始
    onSearch(val) {
      Toast(val);
    },
    onCancel() {
      Toast("取消");
    },
    // 搜索插件结束
    getkeyword(x) {
      this.query = x;
    },
    changeShowType() {
      if (this.listType == 1) {
        this.listType = 2;
      } else {
        this.listType = 1;
      }
    },
    searchHistory(item) {
      var keyword = this.query;
      console.log(keyword);
      // 先拿本地存储
      let keywords = JSON.parse(localStorage.getItem("historys")) || []; //以historys键名称的形式存到本地存储中
      if (keywords.length !== 0) {
        // 将keywords在旧的值中过滤，将相同的值去掉，重新添加keyword(放到最前面)
        keywords = keywords.filter((val) => val !== keyword);
      }
      keywords.unshift(keyword);
      // 存本地存储
      localStorage.setItem("historys", JSON.stringify(keywords));
    },
    goback() {
      this.$router.back();
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
<style lang="scss" scoped >
.custom-image .van-empty__image {
  width: 90px;
  height: 90px;
}
.show-type {
  width: 20px;
  height: 20px;
  margin-left: 16px;
}
</style>