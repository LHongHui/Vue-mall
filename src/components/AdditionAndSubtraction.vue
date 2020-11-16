<template>
  <!-- 商品数量的加减 -->
  <div class="right">
    <button
      class="van-stepper__minus add"
      @click="minus"
      :class="{ 'van-stepper__minus--disabled': count == 1 }"
    ></button>
    <input type="number" disabled class="van-stepper__input" v-model="count" />
    <button
      class="van-stepper__plus"
      @click="plus"
      :class="{ 'van-stepper__plus--disabled': count == 20 }"
    ></button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: 1,
    };
  },
  props: {
    mycount: {
      //  不能改变的值
      type: Number,
      default: 1,
    },
  },
  created() {
    this.count = this.mycount;
  },
  methods: {
    // 减少数量
    minus() {
      if (this.count == 1) {
        this.$toast({ message: "至少选择1件~~", className: "zindex" });
        return;
      }
      this.count--;
    },

    // 增加数量
    plus() {
      if (this.count >= 20) {
        this.$toast({ message: "最多选择20件噢~~", className: "zindex" });
        return;
      }
      this.count++;
    },
  },

  watch: {
    count(newCount) {
      this.$emit("count", newCount);
    },
  },
};
</script>

<style scoped>
.right {
  flex: 1;
  font-size: 0;
}
botton {
  display: inline-block;
  width: 40px;
}
</style>
