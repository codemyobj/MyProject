<template>
  <div class="publish-container">
    <el-card class="box-card">
      <!-- 面包屑导航 -->
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{$route.query.id ? '修改文章': '发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!-- 表单 -->
      <el-form ref="publishForm" :model="article" :rules="formRules" label-width="60px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>

        <el-form-item label="内容" prop="content">
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            lang="zh"
            height="400"
            placeholder="请输入文章内容"
          ></el-tiptap>
        </el-form-item>

        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel,index) in channels"
              :key="index"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-button type="primary" @click="onPublish(false)">{{$route.query.id? '修改': '发布'}}</el-button>
        <el-button @click="onPublish(true)">存入草稿</el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import "element-tiptap/lib/index.css";
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  TodoItem,
  TodoList,
  HorizontalRule,
  Fullscreen,
  Preview,
  Image,
  CodeBlock,
  TextColor,
} from "element-tiptap";

import {
  getArticleChannels,
  addArticle,
  getArticle,
  updateArticle,
} from "@/api/article";
import { uploadImage } from "@/api/image";

export default {
  name: "publishIndex",
  components: {
    "el-tiptap": ElementTiptap,
  },
  props: {},
  data() {
    return {
      channels: [], //文章频道列表
      article: {
        title: "", //文章标题
        content: "", //文章的内容
        cover: {
          //文章封面
          type: 0, //封面的类型
          images: [], //封面图片的地址
        },
        channel_id: null,
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // render command-button in bubble menu.
        new Image({
          //默认会把图片生成base64
          // 自定义图片上传
          uploadRequest(file) {
            //如果接口要求contenttype是<mul></mul>tipart则请求体必须是FormData
            const fd = new FormData();
            fd.append("image", file);
            return uploadImage(fd).then((res) => {
              return res.data.data.url;
            });
          },
        }),
        new Underline(), // render command-button in bubble menu but not in menubar.
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new TodoItem(),
        new TodoList(),
        new HorizontalRule(),
        new Fullscreen(),
        new Preview(),
        new CodeBlock(),
        new TextColor(),
      ],
      formRules: {
        title: [
          { required: true, message: "请输入文章标题", trigger: "blur" },
          { min: 5, max: 30, message: "长度在5-30个字符", trigger: "blur" },
        ],
        content: [
          {
            validator(rule, value, callback) {
              if (value === "<p></p>") {
                callback(new Error("请输入文章内容"));
              } else {
                //验证通过
                callback();
              }
            },
          },
          { required: true, message: "请输入文章内容", trigger: "blur" },
        ],
        channel_id: [{ required: true, message: "请选择文章频道" }],
      },
    };
  },
  created() {
    this.loadChannels();

    //由于我们让发布和修改使用的同一个组件
    // 所以这里要判断
    //如果路由路径中有id 则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle();
    }
  },
  methods: {
    onPublish(draft) {
      this.$refs.publishForm.validate((valid) => {
        //验证失败
        if (!valid) {
          return;
        }
        //验证通过 提交表单
        //找到数据接口
        //封装请求方法
        //请求提交表单
        // 如果是修改文章则执行修改操作
        // 否则执行添加操作
        const articleId = this.$route.query.id;
        if (articleId) {
          // 执行修改操作
          updateArticle(articleId, this.article, draft).then((res) => {
            console.log(res);
            this.$message.success("修改成功");
          });
          this.$router.push("/article");
        } else {
          //当前的article就是我们需要的请求体data
          addArticle(this.article, draft).then((res) => {
            console.log(res);
            this.$message.success(draft ? "存入草稿成功" : "发布成功");
            // if (draft) {
            //   this.$message.success("发布成功");
            // }
            // this.$message.success("存入草稿成功");
          });
          this.$router.push("/article");
        }
      });

      //处理响应结果
    },
    loadChannels() {
      getArticleChannels().then((res) => {
        this.channels = res.data.data.channels;
      });
    },
    // 修改文章 加载文章内容
    loadArticle() {
      //找到数据接口
      //封装请求方法
      //请求获取数据
      getArticle(this.$route.query.id).then((res) => {
        this.article = res.data.data;
      });
      //模板绑定展示
    },
  },
};
</script>
<style scoped lang='less'>
</style>