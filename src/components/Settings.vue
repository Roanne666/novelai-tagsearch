<template>
  <el-tabs id="settings" type="border-card">
    <el-tab-pane label="图库管理">
      <div class="title-wrapper">
        <span>请选择要加载的图库</span>
      </div>
      <el-checkbox
        v-for="imageDir in settings.imageDirs"
        v-model="imageDir.selected"
        :label="imageDir.dirName"
        border
      ></el-checkbox>
    </el-tab-pane>
    <el-tab-pane label="配置管理">
      <el-switch v-model="settings.openNSFW" inactive-text="是否显示R18内容">
      </el-switch>
    </el-tab-pane>
    <el-button type="primary" @click="confirmSettings">确认</el-button>
  </el-tabs>
</template>

<script>
export default {
  props: ["settings"],
  methods: {
    confirmSettings() {
      this.$axios({
        method: "post",
        url: "/getImagesData",
        data: settings,
      }).then();
    },
  },
};
</script>

<style>
.title-wrapper {
  margin-top: 10px;
  margin-bottom: 15px;
}

#settings {
  margin-top: 80px;
}
</style>