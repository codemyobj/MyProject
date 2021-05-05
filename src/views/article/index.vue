<template>
  <div class="article-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="45px" size="small">
        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <!-- 
              radio默认把label作为文本和选中的value值
            -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
          <el-select v-model="channelId" placeholder="请选择">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(item,index) in channels"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :disabled="loading" @click="loadArticles(1)">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到
        {{totalCount}}条结果
      </div>

      <!-- table表格组件
      1 把需要展示的数据列表数据绑定给table组件的data属性
        组件无需遍历 自己会遍历 
      2 设计表格列
      prop用来设定要渲染的列表项数据字段
      3 表格默认只能渲染文本 如果需要展示其他 则需要自定义表格列模板
      -->
      <!-- 数据列表 -->
      <el-table
        :data="articles"
        style="width: 100%"
        stripe
        size="small"
        class="list-table"
        v-loading="loading"
      >
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image
              style="width: 100px; height: 100px"
              :src="scope.row.cover.images[0]"
              fit="cover"
              lazy
            >
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
            </el-image>
            <!-- <img
              class="article-cover"
              v-if="scope.row.cover.images[0]"
              :src="scope.row.cover.images[0] "
              alt
            />
            <img class="article-cover" v-else src="../../assets/img/article/error.gif" alt />-->
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="状态">
          <!-- 如果需要在自定义列模板中获取当前遍历项数据 那么就给tempalate上声明slot 
          scope用来获取数据
          scope.row获取索引数据
          -->
          <template v-slot="scope">
            <el-tag
              :type="articleStatus[scope.row.status].type"
            >{{articleStatus[scope.row.status].text}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>

        <el-table-column label="操作">
          <!-- 如果需要自定义表格列模板 则把自定义的内容放到template里 -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              circle
              icon="el-icon-edit"
              type="primary"
              @click="$router.push('/publish?id=' + scope.row.id)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              circle
              icon="el-icon-delete"
              @click="onDeleteArticle(scope.row.id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 数据分页 -->
      <!-- total用来设定总数居的条数
      它默认按照10条每页计算
      page-size默认显示每条个数 默认每页10条
      -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :disabled="loading"
        :current-page.sync="page"
        @current-change="loadArticles"
      />
    </el-card>
  </div>
</template>

<script>
import { getArticles, getArticleChannels, deleteArticle } from "@/api/article";

export default {
  name: "ArticleIndex",
  components: {},
  props: {},
  data() {
    return {
      form: {
        name: "",
        region: "",
        delivery: false,
        type: [],
        desc: "",
      },
      articles: [], //文章数据列表
      articleStatus: [
        { status: 0, text: "草稿" },
        { status: 1, text: "待审核", type: "warning" },
        { status: 2, text: "审核通过", type: "success" },
        { status: 3, text: "审核失败", type: "danger" },
        { status: 4, text: "已删除", type: "info" },
      ],
      totalCount: 0, //请求的数据条数
      pageSize: 10, //每页大小
      status: null, //查询文章的状态 不传就是全部
      channels: [], //文章频道列表
      channelId: null, //查询文章的频道
      rangeDate: null, //筛选的日期
      loading: true, //表格数据加载中
      page: 1, //当前页码
    };
  },
  created() {
    this.loadArticles();
    this.loadChannels();
  },
  methods: {
    onSubmit() {
      this.loadArticles(1);
    },
    loadArticles(page = 1) {
      //展示加载中
      this.loading = true;
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null, //开始日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null, //  截至日期
      }).then((res) => {
        const { results, total_count } = res.data.data;
        this.articles = results;
        this.totalCount = total_count;

        //关闭加载的loading
        this.loading = false;
      });
    },
    loadChannels() {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
    onDeleteArticle(articleId) {
      //找到数据接口
      //封装请求方法
      //删除请求调用
      //处理响应结果
      this.$confirm("确认删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          //确认执行
          deleteArticle(articleId.toString()).then((res) => {
            //删除成功 更新当前页的文章数据列表
            this.loadArticles(this.page);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>
<style scoped lang='less'>
.filter-card {
  margin-bottom: 30px;
}
.list-table {
  margin-bottom: 20px;
}

.article-cover {
  width: 100px;
  background-size: cover;
}
</style>