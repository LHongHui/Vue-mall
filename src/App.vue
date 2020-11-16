<template>
  <div class="container">
    <van-skeleton
      title
      avatar
      :row="4"
      :loading="loading2"
      v-for="item in 4"
      :key="item"
    >
    </van-skeleton>
    <div class="container-body" v-if="!loading2">
      <transition :name="animate">
        <keep-alive v-if="$route.meta.keepAlive">
          <router-view></router-view>
        </keep-alive>
        <router-view v-else></router-view>
      </transition>
    </div>

    <div class="footer" v-show="isTabbarShow">
      <tab-bar></tab-bar>
    </div>
  </div>
</template>
<script>
import { vuexData } from "@/assets/js/mixin";
import tabBar from "@/components/tabbar.vue";
export default {
  name: "App",
  mixins: [vuexData],
  data() {
    return {
      animate: "",
      //isShow: true
    };
  },
  components: {
    tabBar,
  },
  mounted() {
    setTimeout(() => {
      this.loading2 = false;
    }, 500);
  },
  watch: {
    $route(to, from) {
      let ani = this.$router.animate; // 全局路由animate属性值

      let tabPages = ["Home", "Category", "Cart", "My"];
      console.log(to.name);
      if (tabPages.includes(to.name)) {
        this.animate = "fade";
      } else {
        this.animate = "slide-left";
      }
      console.log(to, "|", ani);
      if (ani == 1) {
        this.animate = "slide-right";
      }
      this.$router.animate = 0; // 注意，将值恢复为 0
    },
  },
};
</script>
<style lang="scss">
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.slide-left-enter {
  transform: translateX(-100%);
}
.slide-left-enter-active {
  transition: transform 0.2s;
}
.slide-left-enter-to {
  transform: translateX(0);
}
.slide-left-leave {
  transform: translateX(0);
}
.slide-left-leave-active {
  transition: transform 0.3s;
}
.slide-left-leave-to {
  transform: translateX(-100%);
}
.slide-right-enter {
  transform: translateX(100%);
}
.slide-right-enter-active {
  transition: transform 0.2s;
}
.slide-right-enter-to {
  transform: translateX(0);
}
.slide-right-leave {
  transform: translateX(0);
}
.slide-right-leave-active {
  transition: transform 0.3s;
}
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>