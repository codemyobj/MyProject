<template>
  <el-container class="layout-container">
    <el-aside class="aside" width="auto">
      <app-aside class="aside-menu" :iscollapse="iscollapse" />
    </el-aside>
    <el-container>
      <el-header class="header">
        <app-header class="app-header" @clickCollapse="clickCollapse" :isIconChange="iscollapse" />
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import AppAside from "./childComps/Aside";
import AppHeader from "./childComps/Header";

export default {
  name: "LayoutIndex",
  props: {},
  data() {
    return {
      iscollapse: false, //侧边菜单栏展开状态
    };
  },
  components: {
    AppAside,
    AppHeader,
  },
  methods: {
    clickCollapse(isIconChange) {
      this.iscollapse = !this.iscollapse;
      isIconChange = !isIconChange;
    },
  },
};
</script>
<style scoped lang='less'>
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.header {
  padding: 0;
  .app-header {
    padding: 0 20px;
  }
}
.aside {
  .aside-menu {
    height: 100%;
  }
}
.main {
  background-color: #e8eef4;
}
</style>
