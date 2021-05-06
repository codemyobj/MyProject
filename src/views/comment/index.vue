<template>
  <div class="comment-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>评论管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </template>

      <!-- table区域 -->
      <el-table :data="articles" style="width: 100%" stripe border>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column prop="total_comment_count" label="总评论数"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝总评论数"></el-table-column>
        <el-table-column label="评论状态">
          <template slot-scope="scope">{{scope.row.comment_status ? '正常':'关闭'}}</template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-switch
              :disabled="scope.row.statusDisabled"
              v-model="scope.row.comment_status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="onStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
      </el-table>

      <!-- 绑定页码
          绑定每页大小
         current-change 控制激活的页码
         page-sizes控制可以选的每页大小
      -->
      <!-- 数据分页 -->
      <el-pagination
        background
        class="table-list"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="page"
        :page-sizes="[10, 20, 50]"
        :page-size.sync="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="totalCount"
      />
      <!-- /数据分页 -->
    </el-card>
  </div>
</template>

<script>
import { getArticles, updateCommentStatus } from "@/api/article";

export default {
  name: "commentIndex",
  components: {},
  props: {},
  data() {
    return {
      articles: [], //文章数据列表
      totalCount: 0,
      pageSize: 20,
      page: 1, //当前激活的页码
    };
  },
  created() {
    this.loadArticle();
  },
  methods: {
    handleSizeChange() {
      this.loadArticle(1);
    },
    handleCurrentChange(page) {
      this.loadArticle(page);
    },
    loadArticle(page = 1) {
      this.page = page;
      getArticles({
        response_type: "comment",
        page,
        per_page: this.pageSize,
      }).then((res) => {
        const { results } = res.data.data;
        results.forEach((article) => {
          article.statusDisabled = false;
        });
        this.articles = results;
        this.totalCount = res.data.data.total_count;
      });
    },
    //改变状态请求
    onStatusChange(article) {
      article.statusDisabled = true;
      //发请求提交修改后台数据
      updateCommentStatus(article.id.toString(), article.comment_status).then(
        (res) => {
          article.statusDisabled = false;
          this.$message.success(
            article.comment_status ? "开启文章评论状态" : "关闭文章评论状态"
          );
        }
      );
    },
  },
};
</script>
<style scoped lang='less'>
.table-list {
  margin-top: 20px;
}
</style>