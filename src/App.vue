<template>
  <div id="app">
    <!-- 路由出口 -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      num: 6,
    };
  },
};
</script>

<style lang="less">
</style>
