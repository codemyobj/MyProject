<template>
  <div class="header">
    <div>
      <i
        :class="{'el-icon-back':isIconChange,
        'el-icon-right':!isIconChange}"
        @click="clickCollapse"
      ></i>
      <span>欢迎使用本管理系统</span>
    </div>

    <el-dropdown>
      <div class="avatar-wrap">
        <img class="avatar" :src="user.photo" alt />
        <span>{{user.name}}</span>
        <i class="el-icon-arrow-down el-icon--right"></i>
      </div>
      <!-- <span>
        下拉菜单
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>-->
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>设置</el-dropdown-item>
        <!-- 组件默认是不识别原生的事件 除非内部处理 .native -->
        <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
import { getUserProfile } from "@/api/user";
import globalBus from "@/utils/global-bus";

export default {
  name: "AppHeader",
  props: {
    isIconChange: {
      type: Boolean,
    },
  },
  data() {
    return {
      user: {}, // 当前用户登录信息
    };
  },
  created() {
    //组件初始化好 请求获取用户资料
    this.loadUserProfile();

    globalBus.$on("update-user", (data) => {
      this.user.name = data.name;
      this.user.photo = data.photo;
    });
  },
  methods: {
    //除了登录接口 其他所有接口都需要提供令牌才能获取数据
    loadUserProfile() {
      getUserProfile().then((res) => {
        this.user = res.data.data;
      });
    },
    clickCollapse() {
      this.$emit("clickCollapse");
    },
    onLogout() {
      this.$confirm("此操作将退出登录,确认是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //把用户的登录状态清除
          window.localStorage.removeItem("user");
          // 跳转到登录页
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出",
          });
        });
    },
  },
};
</script>
<style scoped lang='less'>
.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  .el-icon-back,
  .el-icon-right {
    margin-right: 5px;
    cursor: pointer;
  }
  .avatar-wrap {
    display: flex;
    align-items: center;
    cursor: pointer;
    .avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
}
</style>