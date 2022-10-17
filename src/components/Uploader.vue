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
      size="small"
      :disabled="buttonDisabled"
      @click="$emit('uploadJson', imagesData)"
      >上传完毕</el-button
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
      if (file.type != "application/json") return false;
      this.buttonDisabled = true;
      let reader = new FileReader(); //这里是核心！！！读取操作就是由它完成的。
      reader.readAsText(file); //读取文件的内容

      reader.onload = () => {
        this.imagesData = this.imagesData.concat(JSON.parse(reader.result));
        this.buttonDisabled = false;
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