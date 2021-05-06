<template>
  <div class="fans-container">
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to="/home">首页</el-breadcrumb-item>
            <el-breadcrumb-item>粉丝管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </template>

      <template>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane label="粉丝列表" name="list">
            <div class="fans-list">
              <div class="fans-item" v-for="(fan,index) in fansList" :key="index">
                <el-avatar :size="80" :src="fan.photo"></el-avatar>
                <p>{{fan.name}}</p>
                <el-button type="primary" plain size="small">+关注</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="粉丝画像" name="second">
            <!-- 1 准备画布容器 -->
            <div ref="main" style="width: 600px;height:400px;"></div>
          </el-tab-pane>
        </el-tabs>
      </template>
    </el-card>
  </div>
</template>

<script>
// 加载echarts
import * as echarts from "echarts";

import { getFansData } from "@/api/fans";

export default {
  name: "fansIndex",
  components: {},
  props: {},
  created() {
    this.loadFansData();
  },
  mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main);

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: "ECharts 入门示例",
      },
      tooltip: {},
      legend: {
        data: ["销量"],
      },
      xAxis: {
        data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
      },
      yAxis: {},
      series: [
        {
          name: "销量",
          type: "bar",
          data: [5, 20, 36, 10, 10, 20],
        },
      ],
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
  },
  data() {
    return {
      activeName: "list",
      fansList: [],
    };
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    loadFansData() {
      getFansData().then((res) => {
        console.log(res);
        this.fansList = res.data.data.results;
      });
    },
  },
};
</script>
<style scoped lang='less'>
.fans-list {
  .fans-item {
    width: 120px;
    height: 170px;
    border: 1px dashed #ddd;
    text-align: center;
    padding-top: 10px;
    display: inline-block;
    margin-right: 30px;
    margin-bottom: 30px;
    p {
      margin: 10px 0;
    }
  }
}
</style>