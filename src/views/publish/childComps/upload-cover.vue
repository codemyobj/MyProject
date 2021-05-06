<template>
  <div class="upload-cover" @click="showCoverSelect">
    <div class="cover-wrap">
      <img class="cover-image" ref="cover-image" :src="value" />
    </div>

    <el-dialog title="选择封面" :visible.sync="dialogVisible" append-to-body>
      <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
        <el-tab-pane label="素材库" name="first">
          <image-list :is-show-add="false" :isShowAction="false" ref="image-list" />
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="second">
          <input type="file" @change="onFileChange" ref="file" />
          <img width="100" ref="preview-image" />
        </el-tab-pane>
      </el-tabs>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="onCoverConfirm">确 定</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import ImageList from "@/views/image/childComps/ImageList";
import { uploadImage } from "@/api/image";

export default {
  name: "UploadCover",
  components: {
    ImageList,
  },
  props: {
    value: {
      type: String,
    },
  },
  data() {
    return {
      dialogVisible: false,
      activeName: "first",
    };
  },
  methods: {
    showCoverSelect() {
      this.dialogVisible = true;
    },
    handleClick() {},
    onFileChange() {
      //获取文件对象
      const file = this.$refs.file.files[0];

      //图片预览
      const blob = window.URL.createObjectURL(file);

      this.$refs["preview-image"].src = blob;

      //防止用户选择同一个文件不触发change事件
      // this.$refs.file.value = "";
    },
    onCoverConfirm() {
      //如果tab是上传图片并且input file有选择的文件 才执行上传图片的操作
      if (this.activeName === "second") {
        const file = this.$refs.file.files[0];
        if (!file) {
          this.$message.info("请选择文件");
          return;
        }
        //上传文件
        const fd = new FormData();
        fd.append("image", file);
        uploadImage(fd).then((res) => {
          console.log(res);
          this.dialogVisible = false;
          this.$refs["cover-image"].src = res.data.data.url;

          //将图片地址发送给父组件
          this.$emit("input", res.data.data.url);
          // this.$emit("updata-cover", res.data.data.url);
        });
      } else if (this.activeName === "first") {
        //还有一种组件
        const imageList = this.$refs["image-list"];
        const selected = imageList.selected;
        if (selected === null) {
          this.$message.info("请选择封面图片");
          return;
        }
        this.dialogVisible = false;
        this.$emit("input", imageList.images[selected].url);
      }

      // this.dialogVisible = false;
    },
  },
};
</script>

<style scoped lang='less'>
.upload-cover {
  .default-cover {
    width: 150px;
    height: 120px;
  }
  .cover-wrap {
    float: left;
    margin-right: 20px;
    width: 150px;
    height: 120px;
    border: 1px dashed #000;
    .cover-image {
      height: 120px;
      min-width: 100%;
    }
  }
}
</style>