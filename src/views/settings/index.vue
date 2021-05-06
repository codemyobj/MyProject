<template>
  <div class="settings-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人设置</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </template>

      <el-row>
        <el-col :span="15">
          <el-form ref="userForm" :rules="userRulers" :model="user" label-width="80px">
            <el-form-item label="编号">{{user.id}}</el-form-item>
            <el-form-item label="手机">{{user.mobile}}</el-form-item>
            <el-form-item label="媒体名称" prop="name">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍" prop="intro">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onUpdateUser" :loading="updateProfileLoading">保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
          <!-- <p @click="$refs.file.click()">点击修改头像</p> -->
          <label for="file">
            <el-avatar shape="square" :size="150" fit="cover" :src="user.photo"></el-avatar>
          </label>
          <p>点击切换头像</p>
          <input id="file" type="file" hidden ref="file" @change="onFileChange" />
        </el-col>
      </el-row>
    </el-card>

    <el-dialog title="修改头像" :visible.sync="dialogVisible" append-to-body @opened="onDialogOpened">
      <div class="preview-img-wrap">
        <img class="preview-image" :src="previewImage" ref="preview-image" />
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onUpdatePhoto" :loading="updatePhotoLoading">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getUserProfile, updateUserPhoto, updateUserProfile } from "@/api/user";
import "cropperjs/dist/cropper.css";
import Cropper from "cropperjs";

import globalBus from "@/utils/global-bus";

export default {
  name: "settingsIndex",
  components: {},
  props: {},
  data() {
    return {
      user: {
        email: "",
        id: null,
        intro: "",
        mobile: "",
        name: "",
        photo: "",
      }, //用户资料
      dialogVisible: false, //控制上传图片裁切预览的显示状态
      previewImage: "", // 预览图片
      cropper: null,
      updatePhotoLoading: false, //更新用户头像loading状态
      userRulers: {
        name: [
          { required: true, message: "请输入媒体名称", trigger: "blur" },
          { min: 5, max: 30, message: "长度在5-30个字符", trigger: "blur" },
        ],
        intro: [
          { required: true, message: "请输入媒体介绍", trigger: "blur" },
          { min: 5, max: 30, message: "长度在5-30个字符", trigger: "blur" },
        ],
      },
      updateProfileLoading: false, //更新基本信息的loading状态
    };
  },
  created() {
    this.loadUser();
  },
  methods: {
    onUpdateUser() {
      this.$refs.userForm.validate((valid) => {
        if (!valid) {
          return;
        }
        this.updateProfileLoading = true;
        const { name, intro, email } = this.user;
        updateUserProfile({
          name,
          intro,
          email,
        }).then((res) => {
          this.$message.success("修改用户信息成功");
          this.updateProfileLoading = false;
          //发布通知用户信息已修改
          globalBus.$emit("update-user", this.user);
        });
      });
    },
    loadUser() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    onFileChange() {
      //处理图片预览
      const file = this.$refs.file;
      const blobData = window.URL.createObjectURL(file.files[0]);
      this.previewImage = blobData;
      console.log(blobData);
      //展示弹层 预览用户选择的图片
      this.dialogVisible = true;

      //解决相同文件不触发change事件问题
      this.$refs.file.value = "";
    },
    onDialogOpened() {
      //图片裁切器必须基于image进行初始化
      // 注意image必须是可见状态才能正常完成初始化
      // 因为要在对话框里面初始化裁切器
      // 所以务必要在对话框完全打开的状态进行初始化
      const image = this.$refs["preview-image"];
      //第一次初始化好以后 如果预览以后的图片发生了变化，裁切器默认不会更新
      // 如果需要预览图片发生变化更新
      // 方法1 裁切器repalce方法
      // 方法2  或销毁裁切器 重新初始化
      if (this.cropper) {
        this.cropper.replace(this.previewImage);
        return;
      }
      this.cropper = new Cropper(image, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: "move",
        cropBoxResizable: false,
        movable: true,
      });
    },
    onUpdatePhoto() {
      this.updatePhotoLoading = true;
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob((file) => {
        const fd = new FormData();
        fd.append("photo", file);
        //请求提交
        updateUserPhoto(fd).then((res) => {
          this.dialogVisible = false;
          // 更新视图
          this.user.photo = window.URL.createObjectURL(file);
          this.updatePhotoLoading = false;
          // 把服务端返回的图片进行展示有点慢
          // this.user.photo = res.data.data.photo;
        });
      });
      // 请求更新用户头像
      // 关闭对话框
      // 更新视图的展示
    },
  },
};
</script>
<style scoped lang='less'>
.preview-img-wrap {
  preview-image {
    display: block;
    max-width: 100%;
    height: 200px;
  }
}
</style>