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

      <div class="images-check">
        <el-radio-group v-model="collect" size="mini" @change="loadImages(1)">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>

        <el-button size="mini" type="success" class="upload" @click="dialogUploadVisible=true">上传素材</el-button>
      </div>

      <!-- 素材列表 -->
      <el-row :gutter="10" class="gutter">
        <el-col
          class="image-item"
          v-for="(img,index) in images"
          :key="index"
          :md="6"
          :lg="4"
          :xs="12"
          :sm="6"
        >
          <el-image style="height: 100px" :src="img.url" fit="cover"></el-image>
          <div class="image-action">
            <el-button
              type="warning"
              size="small"
              circle
              :icon="img.is_collected ?'el-icon-star-on' : 'el-icon-star-off'"
              :loading="img.loading"
              @click="onCollect(img)"
            ></el-button>
            <!-- <i
              :class="{
              'el-icon-star-on' : img.is_collected,
              'el-icon-star-off' :!img.is_collected
              }"
              @click="onCollect(img)"
            ></i>-->
            <el-button
              type="danger"
              icon="el-icon-delete"
              circle
              size="small"
              :loading="img.loading"
              @click="onDelete(img)"
            ></el-button>
          </div>
        </el-col>
      </el-row>

      <!-- 数据分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
        @current-change="onPageChange"
        class="pagi"
      ></el-pagination>
      <!-- /数据分页 -->
    </el-card>

    <!-- 上传图片弹出层 -->
    <el-dialog title="上传素材" :visible.sync="dialogUploadVisible" append-to-body>
      <!-- upload组件本身就支持请求提交上传操作
          使用它无需自己发请求，它自己会发
          请求方法 post
          请求路径 action
          请求头 headers
      -->
      <el-upload
        class="upload-demo"
        drag
        :headers="uploadHeaders"
        action="http://api-toutiao-web.itheima.net/mp/v1_0/user/images"
        multiple
        name="image"
        :on-success="onUploadSuccess"
        :on-error="onUploadError"
        :show-file-list="false"
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">只能上传 jpg/png 文件，且不超过 500kb</div>
        </template>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from "@/api/image";

export default {
  name: "imageIndex",
  components: {},
  props: {},
  created() {
    this.loadImages(1, false);
  },
  data() {
    const user = JSON.parse(window.localStorage.getItem("user"));
    return {
      collect: false, //默认查询全部
      images: [], //图片素材列表
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`,
      },
      totalCount: 0, //总数居大小
      pageSize: 20, //每页大小
      page: 1, //当前页码
    };
  },
  methods: {
    loadImages(page) {
      //重置高亮页码 防止数据页码不对应
      this.page = page;
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize,
      }).then((res) => {
        const results = res.data.data.results;
        results.forEach((img) => {
          //img对象本来没有loading数据
          //这里手动的往里面添加该数据是用来控制每一个收藏按钮的loading状态
          img.loading = false;
        });
        this.images = results;
        this.totalCount = res.data.data.total_count;
      });
    },
    onUploadSuccess() {
      // 关闭对话框
      this.dialogUploadVisible = false;
      //更新素材列表
      this.loadImages(this.page);

      this.$message.success("上传成功");
    },
    onUploadError() {
      this.$message.error("文件上传失败!");
    },
    onPageChange(page) {
      this.loadImages(page);
    },
    onCollect(img) {
      //展示loading
      img.loading = true;
      //已收藏 取消
      collectImage(img.id, !img.is_collected).then((res) => {
        img.is_collected = !img.is_collected;
        //关闭loading
        img.loading = false;
      });
      //未收藏 收藏
    },

    onDelete(img) {
      img.loading = true;
      deleteImage(img.id).then((res) => {
        //重新加载数据列表
        this.loadImages(this.page);
        img.loading = false;
      });
    },
  },
};
</script>
<style scoped lang='less'>
.gutter {
  margin-top: 20px;
}
.images-check {
  display: flex;
  justify-content: space-between;
}
.image-item {
  position: relative;
  .image-action {
    font-size: 25px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: rgb(0, 0, 0);
    height: 40px;
    background-color: rgba(204, 204, 204, 0.4);
    position: absolute;
    bottom: 4px;
    left: 5px;
    right: 5px;
  }
}
.pagi {
  margin-top: 15px;
}
</style>