<template>
  <div style="padding: 8px">
    <el-popover
      style="padding: 6px"
      placement="top"
      title=""
      width="200"
      trigger="hover"
      :content="keywords"
    >
      <el-button slot="reference">关键词</el-button>
    </el-popover>
    <el-popover
      style="padding: 6px"
      placement="top"
      title=""
      width="200"
      trigger="hover"
      :content="negativeKeywords"
    >
      <el-button slot="reference">过滤词</el-button>
    </el-popover>
    <el-popover
      style="padding: 6px"
      placement="top"
      title=""
      width="230"
      trigger="hover"
    >
      <el-table :data="metadata">
        <el-table-column
          width="80"
          property="name"
          label="类型"
        ></el-table-column>
        <el-table-column
          width="150"
          property="value"
          label="数据"
        ></el-table-column>
      </el-table>
      <el-button slot="reference">图片数据</el-button>
    </el-popover>
  </div>
</template>

<script>
export default {
  props: ["keywords", "negativeKeywords", "metadata"],
};
</script>

<style>
.el-table .el-table__cell {
  padding-top: 3px;
  padding-bottom: 3px;
}
</style>