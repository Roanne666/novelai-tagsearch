<template>
  <div style="padding: 8px">
    <el-popover
      style="padding: 8px"
      placement="top"
      title=""
      width="200"
      trigger="hover"
      :content="keywords"
    >
      <el-button slot="reference">关键词</el-button>
    </el-popover>
    <el-popover
      placement="top"
      title=""
      width="200"
      trigger="hover"
      :content="negativeKeywords"
    >
      <el-button slot="reference">过滤词</el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: ["keywords", "negativeKeywords"],
};
</script>

<style>
</style>