<template>
  <div class="image-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>素材管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </template>

      <!-- 图片列表 -->
      <image-list :is-selected-show="false" />
    </el-card>
  </div>
</template>

<script>
import ImageList from "./childComps/ImageList";

export default {
  name: "imageIndex",
  components: {
    ImageList,
  },
  props: {},
  created() {},
  data() {
    return {};
  },
  methods: {},
};
</script>
<style scoped lang='less'>
</style>