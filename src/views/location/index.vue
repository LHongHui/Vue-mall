<template>
  <div>
    <nav-bar>
      <div slot="left">
        <i class="iconfont icon-fanhui" @click="goback()"></i>
      </div>
      <div slot="center">{{goods_position}}</div>
    </nav-bar>
    <baidu-map class="map" :center="center" :zoom="15" @ready="handler">
      <bm-marker
        :position="center"
        animation="BMAP_ANIMATION_BOUNCE"
        @click="infoWindowOpen"
        :icon="{url: 'https://api.map.baidu.com/images/marker_red_sprite.png', size: {width: 39, height: 25}}"
        :offset="{width: 19.5, height: -12.5}">
        <bm-info-window :show="show" @close="infoWindowClose" @open="infoWindowOpen" :offset="{width: 0, height: -12.5}">{{goods_position}}</bm-info-window>
      </bm-marker>
      <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
      <div class="setCenter" @click="setCenter()">
        <img src="https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1603704090742&di=82b01af061cf86c57f9bdcaefcfc9da3&imgtype=0&src=http%3A%2F%2Fpic.51yuansu.com%2Fpic3%2Fcover%2F03%2F05%2F87%2F5b2adf4287ae3_610.jpg" />
      </div>
    </baidu-map>
  </div>
</template>

<script>
import navBar from "@/components/navbar.vue";
import { vuexData } from "@/assets/js/mixin";
import Map from "@/map";
export default {
  name:"location",
  components: {
    navBar,
  },
  mixins: [vuexData],
  data(){
    return {
      show: true,
      id: null,
      map: null,
      BMap: null,
      goods_position: "",
      goods_location: "",
      center:{lng: 0, lat: 0},
    }
  },
  methods: {
    goback () {
      this.$router.go(-1)
    },
    // async getProductOne() {
    //     //vuex中this.productOnes[this.id]是否存在,不存在调ajax并且存入vuex中
    //     res = await this.Api.goodsDetail(this.id);
    //     // console.log(res.data.data);
    //     this.productone = res.data.data; //  当前商品信息:this.productone.productone
    //     this.goods_position = this.productone.productone.goods_position;
    //     this.center.lng = this.productone.locationResult[0];
    //     this.center.lat = this.productone.locationResult[1];
    // },
    handler ({BMap, map}) {
      // this.center.lng = this.productone.locationResult[0];
      // this.center.lat = this.productone.locationResult[1];
      this.center.lng = this.goods_location.split(',')[0];
      this.center.lat = this.goods_location.split(',')[1];
      this.map = map;
      this.BMap = BMap;
    },
    setCenter(){
      this.map.panTo(new BMap.Point(this.goods_location.split(',')[0], this.goods_location.split(',')[1]));
    },
    infoWindowClose () {
      this.show = false
    },
    infoWindowOpen () {
      this.show = true
    },
  },
  created() {
    this.goods_location = this.$route.query.goods_location; //接收的动态传值的键对应的值
    this.goods_position = this.$route.query.goods_position;
  },
  mounted() {
    // this.getProductOne();
    this.ChangTabbarShow(false);
    Map.init().then((BMap) => {
        console.log(BMap)
        console.log("加载成功...")
    })
  },
}
</script>

<style>
.map {
  width: 100vw;
  height: 100vh;
}
bm-marker{
  padding-bottom: 12.5px;
  padding-left: 19.5px;
}
.setCenter{
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 40px;
  right: 10px;
}
</style>
