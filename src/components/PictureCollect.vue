<template>
  <div>
    <div>
      <label for="">关键词</label>
      <textarea rows="5" cols="50" type="text" v-model="keywords"></textarea>
    </div>
    <div>
      <label for="">负面关键词</label>
      <textarea
        rows="5"
        cols="50"
        type="text"
        v-model="negativeKeywords"
      ></textarea>
    </div>
    <div>
      <label for="">图片链接(首张)</label>
      <textarea rows="10" cols="50" v-model="imageUrl"></textarea>
    </div>
    <div>
      <label for="">图片数(仅限pixiv)</label>
      <input type="number" v-model="count" />
    </div>
    <button @click="addImage">添加图片</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      keywords: "",
      negativeKeywords: "",
      imageUrl: "",
      count: 1,
    };
  },
  methods: {
    addImage() {
      if (this.keywords == "" || this.imageUrl == "") return;
      if (!this.imageUrl.includes("png") && !this.imageUrl.includes("jpg"))
        return;

      let keywordsArray = [];
      for (let keyword of this.keywords.split(",")) {
        while (keyword.includes("{")) {
          keyword = keyword.replace("{", "");
        }
        while (keyword.includes("}")) {
          keyword = keyword.replace("}", "");
        }
        keyword = keyword.trim();
        if (keyword != "" && !keywordsArray.includes(keyword)) {
          keywordsArray.push(keyword);
        }
      }

      let negativeKeywordsArray = [];
      for (let negativeKeyword of this.negativeKeywords.split(",")) {
        while (negativeKeyword.includes("{")) {
          negativeKeyword = negativeKeyword.replace("{", "");
        }
        while (negativeKeyword.includes("}")) {
          negativeKeyword = negativeKeyword.replace("}", "");
        }
        negativeKeyword = negativeKeyword.trim();
        if (
          negativeKeyword != "" &&
          !negativeKeywordsArray.includes(negativeKeyword)
        ) {
          negativeKeywordsArray.push(negativeKeyword);
        }
      }
      let imageUrlsArray = [this.imageUrl];
      if (this.count > 1) {
        for (let i = 2; i <= this.count; i++) {
          let imageUrl = this.imageUrl.replace("p0", "p" + (i - 1));
          imageUrlsArray.push(imageUrl);
        }
      }
      fetch({
        method: "POST",
        url: "/novelAI/addImages",
        data: { keywordsArray, negativeKeywordsArray, imageUrlsArray },
      }).then((res) => {
        if (res.data) {
          this.imageUrl = "";
          this.count = 1;
        } else {
          alert("添加失败");
        }
      });
    },
  },
};
</script>

<style>
</style>