<template>
  <el-menu
    class="nav-menu"
    :default-active="$route.path"
    text-color="#fff"
    active-text-color="#ffd04b"
    background-color="#413f3f"
    router
    :collapse="iscollapse"
  >
    <div class="logo">
      <img src="~@/assets/img/login/logo_admin.png" alt />
    </div>
    <el-menu-item index="/home">
      <i class="iconfont iconhome"></i>
      <span slot="title">首页</span>
    </el-menu-item>
    <el-menu-item index="/article">
      <i class="iconfont iconmanage"></i>
      <span slot="title">内容管理</span>
    </el-menu-item>
    <el-menu-item index="/image">
      <i class="iconfont iconimage"></i>
      <span slot="title">素材管理</span>
    </el-menu-item>
    <el-menu-item index="/publish">
      <i class="iconfont iconpublish"></i>
      <span slot="title">发布文章</span>
    </el-menu-item>
    <el-menu-item index="/comment">
      <i class="iconfont iconcomment"></i>
      <span slot="title">评论管理</span>
    </el-menu-item>
    <el-menu-item index="/fans">
      <i class="iconfont iconziyuan191"></i>
      <span slot="title">粉丝管理</span>
    </el-menu-item>
    <el-menu-item index="/settings">
      <i class="iconfont iconsetting"></i>
      <span slot="title">个人设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: "AppAside",
  props: {
    iscollapse: {
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang='less'>
.nav-menu {
  .iconfont {
    margin-right: 9px;
    padding-left: 3px;
  }

  .logo {
    transform: scale(0.9);
    margin: 10px 16px;
  }
}
</style>