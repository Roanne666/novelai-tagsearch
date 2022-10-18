<template>
  <div>
    <el-upload
      class="upload-demo"
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
      :before-upload="beforeUpload"
    >
      <el-button size="small" type="primary">上传json文件</el-button>
    </el-upload>
    <el-button
      id="upload-finish"
      type="success"
      size="small"
      :disabled="buttonDisabled"
      @click="$emit('uploadJson', imagesData)"
      >加载图片数据</el-button
    >
  </div>
</template>

<script>
export default {
  data() {
    return {
      buttonDisabled: true,
      imagesData: [],
    };
  },
  methods: {
    beforeUpload(file) {
      if (file.type != "application/json") {
        this.$message({
          message: "不要上传奇奇怪怪的东西！",
          type: "warning",
        });
        return false;
      }
      this.buttonDisabled = true;
      let reader = new FileReader(); //这里是核心！！！读取操作就是由它完成的。
      reader.readAsText(file); //读取文件的内容

      reader.onload = () => {
        this.imagesData = this.imagesData.concat(JSON.parse(reader.result));
        this.buttonDisabled = false;
        this.$message({
          message: "上传成功，可以上传多个文件哦",
          type: "success",
        });
      };
      return false;
    },
  },
};
</script>

<style>
#upload-finish {
  margin-top: 5px;
}
</style>