<template>
  <div class="wrap">
    <!-- 插槽 slot ： 占位,替换内容用的 -->
    <div class="left">
      <slot name="left"></slot>
    </div>
    <div class="center">
      <slot name="center"></slot>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "nabbar",
};
</script>

<style  scoped>
.wrap {
  display: flex;
  height: 60px;
  align-items: center;
  background: #fff;
  /* box-shadow: 0px 3px 14px 2px rgba(0, 0, 0, 0.12); */
  /* background: linear-gradient(to bottom, #eee, #ccc); */
  padding: 0 6px;
}
.left {
  width: 45px;
}
.center {
  flex: 1;
  text-align: center;
}
.right {
  width: 45px;
}
</style>
