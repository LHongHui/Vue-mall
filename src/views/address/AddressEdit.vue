<template>
  <!-- 新增和编辑地址 -->
  <div class="address-edit">
    <van-nav-bar title="编辑地址" left-arrow @click-left="mygoBack" />
    <div v-if="addressInfo">
      <van-address-edit
        :area-list="areaList"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        :addressInfo="addressInfo"
        :show-delete="showDelete"
        show-set-default
        @save="onSave"
        @delete="onDelete"
      />
    </div>
    <div v-else>
      <van-address-edit
        :area-list="areaList"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        :show-delete="showDelete"
        show-set-default
        @save="onSave"
        @delete="onDelete"
      />
    </div>
  </div>
</template>

<script>
import { vuexData } from "@/assets/js/mixin";
import { $toast } from "vant";
export default {
  name: "AddressEdit",
  mixins: [vuexData],
  data() {
    return {
      areaList: require("@/assets/js/area.js").default,
      showDelete: false,
    };
  },

  created() {
    if (this.addressInfo) {
      this.showDelete = true;
    }
  },
  methods: {
    async onSave(val) {
      // 以下参数在api接口查看详情
      try {
        const { data } = await this.Api.postAddress({
          uid: this.userName._id,
          name: val.name,
          tel: val.tel,
          address: val.province + val.city + val.county + val.addressDetail,
          isDefault: val.isDefault,
          province: val.province,
          city: val.city,
          county: val.county,
          addressDetail: val.addressDetail,
          id: this.addressInfo ? this.addressInfo._id : undefined,
          // 修改地址时候要传id(重要重要重要)
        });
        if (data.success) {
          this.$toast(data.msg);
          setTimeout(() => {
            // this.$router.go(-1)
            this.mygoBack();
            this.clearAddress("");
          }, 1000);
        } else {
          this.$router.push({ name: "Login" });
        }
      } catch (error) {
        this.$toast("网络错误");
      }
    },
    async onDelete(val) {
      try {
        const { data } = await this.Api.deleteAddress(
          val._id,
          this.userName._id
        );
        if (data.success) {
          this.$toast(data.msg);
          setTimeout(() => {
            // this.$router.go(-1)
            this.mygoBack();
            this.clearAddress("");
          }, 1000);
        }
      } catch (error) {
        this.$toast("网络错误");
      }
    },

    mygoBack() {
      this.$router.go(-1);
      setTimeout(() => {
        this.clearAddress(""); // 将vuex addressInfo 全局数据清空
      }, 300);
    },
  },
};
</script>

<style lang="scss" scoped>
.address-edit {
  position: fixed;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 200;
  background: #fff;
}

.bounce2-enter-active {
  animation: bounce-in 0.3s;
}

.bounce2-leave-active {
  animation: bounce-in 0.3s reverse;
}

@keyframes bounce-in {
  0% {
    transform: translate3d(-100%, 0, 0);
  }

  100% {
    transform: translate3d(0, 0, 0);
  }
}
</style>