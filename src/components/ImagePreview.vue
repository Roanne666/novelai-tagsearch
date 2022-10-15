<template>
  <div>
    <el-image
      style="width: 100%; height: 300px"
      :src="image.imageUrl"
      :preview-src-list="imagesUrlArray"
      fit="cover"
      @error="loadingError"
    >
    </el-image>
  </div>
</template>


<script>
export default {
  props: ["imagesUrlArray", "image"],
  methods: {
    loadingError() {
      this.$emit("loadingError", this.image.imageUrl);
    },
  },
};
</script>

<style>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
</style>