<template>
  <el-row id="input-row" maxlength="225" class="demo-autocomplete">
    <el-col id="input-col" :span="24">
      <el-autocomplete
        class="inline-input"
        v-model="state"
        :fetch-suggestions="querySearch"
        placeholder="请输入关键词"
        :trigger-on-focus="false"
        @select="handleSelect"
        :maxlength="maxlength"
        show-word-limit
      ></el-autocomplete>
      <el-button
        id="check-button"
        type="primary"
        icon="el-icon-search"
        @click="searchImage"
        >搜索</el-button
      >
    </el-col>
  </el-row>
</template>

<script>
export default {
  props: ["allKeywordsArray"],
  data() {
    return {
      state: "",
      stateCache: "",
      maxlength: 225,
    };
  },
  methods: {
    handleSelect(item) {
      let stateArray = this.stateCache.split(",");
      if (stateArray.length > 1) {
        stateArray.pop();
        this.state = stateArray.join(",") + "," + item.value;
      }
    },
    querySearch(queryString, cb) {
      this.stateCache = this.state;
      let allKeywordsArray = this.allKeywordsArray;
      let targetKeyword = queryString.trim();
      if (queryString.includes(",")) {
        let keywordsArray = queryString.split(",");
        targetKeyword = keywordsArray[keywordsArray.length - 1].trim();
      }
      var results = targetKeyword
        ? allKeywordsArray.filter(this.createFilter(targetKeyword))
        : [];
      cb(results);
    },
    createFilter(queryString) {
      return (keyword) => {
        return (
          keyword.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    searchImage() {
      this.$emit("searchImage", this.state.split(","));
    },
  },
};
</script>

<style>
#input-row {
  position: fixed;
  z-index: 999;
  text-align: center;
  background-color: white;
  border-bottom: 1px solid gainsboro;
  padding-top: 10px;
  padding-bottom: 10px;
  width: 100%;
  top: 0px;
}

.el-autocomplete {
  width: 500px;
}

#check-button {
  margin-left: 10px;
}
</style>