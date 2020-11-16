<template>
  <div>
    <div class="history" v-if="historys.length">
      <div class="history-title-box">
        <span class="history-title">历史搜索</span>
        <span class="history-btn"
          ><img src="@/assets/images/del.png" @click="clear"
        /></span>
      </div>
      <transition-group class="g-list" name="list" tag="ul">
        <li class="g-list-text" v-for="item in historys" :key="item">
          <span class="g-list-text-item" @click="serachName(item)">
            {{ item }}</span
          >
          <i class="iconfont icon-guanbi" @click.stop="removeItem(item)"></i>
        </li>
      </transition-group>
    </div>
  </div>
</template>
<script>
import { MessageBox } from "mint-ui";
import storage from "@/assets/js/storage.js"; // set(),get(),remove(),clear()
export default {
  name: "SearchHistory",
  data() {
    return {
      historys: [],
    };
  },
  created() {
    this.getKeyword();
  },
  methods: {
    getKeyword() {
      this.historys = JSON.parse(localStorage.getItem("historys")) || [];
    },
    update() {
      this.getKeyword();
    },
    serachName(item) {
      this.$emit("keywordEnd", item);
      //   1、父组件可以使用 props 把数据传给子组件。
      // 2、$emit子组件调用父组件的方法并传递数据
    },
    removeItem(item) {
      this.historys = this.historys.filter((val) => val !== item);
      storage.set("historys", this.historys);
    },
    clear() {
      // MessageBox.alert("清空历史数据成功").then((action) => {
      storage.clear("historys");
      location.reload();

      // });
    },
  },
};
</script>
<style lang="scss" scoped>
.history {
  background-color: #fff;
  height: 100%;
  margin-bottom: 6px;
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  padding: 6px 6px 6px;
}
.history-title-box {
  display: flex;
}
.history-title {
  font: bold 16px 微软雅黑;
  margin-bottom: 10px;
  flex: 1;
}
.history-btn {
  width: 16px;
  height: 16px;
}
.history-btn img {
  width: 100%;
}

.g-list-text {
  display: inline-block;
  margin: 6px;
  padding: 3px;
  border-radius: 5px;
  font-size: 20px;
  background-color: rgb(238, 240, 239);
}
.icon-guanbi {
  position: relative;
  top: -15px;
  right: -5px;
  color: #fff;
  font-size: 14px;
  margin-left: 10px;
  background-color: red;
  border-radius: 5px;
}
</style>