<template>
  <div>
    <!-- 分类页的头部 -->
    <nav-bar>
      <div slot="center">账号登录</div>
    </nav-bar>
    <!-- 表单 -->
    <van-panel>
      <div class="box">
        <van-field
          v-model="phone"
          type="tel"
          label="手机号:"
          maxlength="16"
          autocomplete="off"
          placeholder="请输入手机"
        />
        <van-field
          v-model="password"
          type="password"
          label="密码:"
          maxlength="16"
          autocomplete="off"
          placeholder="请输入密码"
        />
      </div>
      <div class="form-group verify">
        <label for="inputEmail3">验证码:</label>
        <input
          type="text"
          placeholder="请输入验证码"
          v-model="verifyTxt"
          class="verify-input"
          maxlength="4"
          autocomplete="off"
        />
        <div class="col3">
          <img
            :src="verify"
            ref="eleVerify"
            @click="replaceVerify"
            title="看不清？点击刷新"
          />
        </div>
      </div>
      <div slot="footer">
        <van-button size="big" type="danger" style="width: 100%" @click="login"
          >登录/注册</van-button
        >
      </div>
    </van-panel>
  </div>
</template>

<script>
import config from "@/assets/js/config.js";
import navBar from "@/components/navbar.vue";
import { vuexData } from "@/assets/js/mixin.js";
export default {
  name: "login",
  mixins: [vuexData],
  components: {
    navBar,
  },
  data() {
    return {
      phone: "",
      password: "",
      verify: config.api + this.Api.getAverify(),
      verifyTxt: "",
    };
  },
  methods: {
    // 更换验证码
    async replaceVerify() {
      this.$refs.eleVerify["src"] = config.api + this.Api.getAverify();
    },
    async login() {
      //  注册和登录
      try {
        const { data } = await this.Api.login(
          this.phone,
          this.password,
          this.verifyTxt
        );
        if (data.code == 200) {
          this.setName(data.userInfo); // vuex 实现 setName 的存储
          this.setToken(data.token); // vuex 实现 setToken 的存储
          setTimeout(() => {
            this.$router.go(-1);
          }, 1000);
        } else {
          setTimeout(() => {
            this.verifyTxt = "";
            this.replaceVerify();
          }, 600);
        }
        this.$toast(data.message);
      } catch (error) {
        console.log(error);
        this.$toast("网络错误");
        this.replaceVerify();
      }
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

<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: column;
  height: 120px;
  justify-content: space-around;
}
.verify {
  display: flex;
  align-items: center;
  margin-top: 20px;
}
label {
  flex: 2;
  padding-left: 10px;
  color: gray;
}
.verify-input {
  flex: 1;
  padding-left: 20px;
  margin-right: 10px;
  height: 40px;
}
.col3 {
  flex: 3;
}
</style>