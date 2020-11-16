<template>
  <!-- 商品评论 -->
  <div class="rate-warp">
    <van-nav-bar title="评价中心" left-arrow @click-left="goback" />
    <div class="goods">
      <img :src="url + goodsOne.goods_img" alt srcset />
      <div>
        <p class="rate-txt">商品评分</p>
        <p class="rate">
          <van-rate color="#e0322b" v-model="rate" />
        </p>
      </div>
    </div>
    <div>
      <van-cell-group>
        <van-field
          v-model="message"
          type="textarea"
          placeholder="说说你的购买感受吧~~"
          rows="6"
          autosize
          maxlength="120"
        />
      </van-cell-group>
      <Upload
        @getFiles="getImageList"
        @removeFiles="removeImage"
        ref="upload"
      />
    </div>
    <div class="checkbox">
      <van-checkbox v-model="checked" checked-color="#e0322b"
        >匿名评价</van-checkbox
      >
    </div>
    <div class="btn">
      <van-button type="primary" size="large" @click="submit">提交</van-button>
    </div>
    <!-- <van-uploader :after-read="onRead">
            <van-icon name="photograph" />
        </van-uploader>-->
  </div>
</template>

<script>
import Upload from "@/components/rate/Upload";
import { vuexData } from "@/assets/js/mixin";
import config from "@/assets/js/config";
export default {
  name: "Rate",
  mixins: [vuexData],
  data() {
    return {
      url: config.api,
      id: "",
      rate: 5,
      message: "",
      checked: false,
      goodsOne: "",
      _id: "", // 数据库订单详情单条_id
      //order_id: "", //  订单id
      imgList: [], //已上传的图片集合
    };
  },

  components: {
    Upload,
  },
  methods: {
    async submit() {
      // console.log(this.imgList);
      if (!this.message) {
        return this.$toast("请输入需要提交的内容");
      }
      const datas = {
        id: this.id,
        rate: this.rate,
        content: this.message,
        anonymous: this.checked,
        image: this.imgList,
        uid: this.userName._id,
        _id: this._id, // 订单编号
      };
      let res = await this.Api.comment(datas);
      if (res.data.success) {
        this.$toast(res.data.message);

        setTimeout(() => {
          this.message = "";
          this.$router.go(-1);
          this.imgList = [];
          this.$refs.upload.clearFiles();
        }, 1500);
      }
    },
    getImageList(files) {
      this.$nextTick(() => {
        for (let i = 0, len = files.length; i < len; i++) {
          this.imgList.push(files[i].src.split("base64,")[1]);
        }
      });
    },
    //删除图片
    removeImage(index) {
      this.imgList.splice(index, 1);
    },
  },

  async created() {
    this.id = this.$route.query.cid; // 商品id
    this._id = this.$route.params._id; // 订单编号（重要重要）
    console.log(this.id, this._id);
    try {
      const { data } = await this.Api.goodsDetail(this.id);
      console.log(data);
      if (data.success) {
        this.goodsOne = data.data.productone;
      } else {
        this.$toast("请先登录");
      }
    } catch (error) {
      this.$toast("网络错误");
    }
  },
};
</script>

<style lang="scss" scoped>
.rate-warp {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 500;
  background: #fff;
}
.rate-warp .goods {
  display: flex;
  padding-top: 10px;
}
.rate-warp .goods img {
  width: 30%;
  height: 80px;
  flex: 0 0 30%;
  object-fit: scale-down;
  margin-right: 10px;
  border-radius: 5px;
}
.rate-warp .goods div {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.rate-warp .goods div .rate-txt {
  margin-top: 10px;
}
.rate-warp .goods div .rate {
  margin-top: 20px;
}
.rate-warp .goods div .van-rate {
  display: flex;
  flex-direction: row;
}
.rate-warp .btn {
  width: 90%;
  margin: 30px auto;
}
.rate-warp .checkbox {
  padding-left: 15px;
}
</style>

