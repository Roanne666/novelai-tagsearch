<template>
  <div id="app">
    <search-input
      @searchImage="searchImage"
      :allKeywordsArray="allKeywordsArray"
    ></search-input>
    <div id="images-wrapper" class="demo-image__preview">
      <el-row :gutter="12">
        <el-col :span="8" v-for="image in images" :key="image.imageUrl">
          <el-card :body-style="{ padding: '0px' }" v-if="!isError(image)">
            <ImagePreview
              @loadingError="loadingError"
              :imagesUrlArray="getImagesUrlArray()"
              :image="image"
            />
            <PopOver
              :keywords="getKeywordsString(image)"
              :negative-keywords="getNegativeKeywordsString(image)"
            ></PopOver>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import ImagePreview from "./components/ImagePreview.vue";
import PopOver from "./components/PopOver.vue";
import SearchInput from "./components/SearchInput.vue";

export default {
  name: "App",
  components: { ImagePreview, PopOver, SearchInput },
  data() {
    return {
      images: [],
      imagesCache: [],
      allKeywordsArray: [],
      errorUrls: [],
    };
  },
  mounted() {
    this.getAllKeywords();
    this.getImageData();
  },
  computed: {
    isError() {
      return function (image) {
        return this.errorUrls.includes(image.imageUrl);
      };
    },
  },
  methods: {
    getAllKeywords() {
      fetch("/allKeywords")
        .then((res) => res.json())
        .then((data) => {
          for (let keyword of data) {
            this.allKeywordsArray.push({ value: keyword });
          }
        });
    },
    getImageData() {
      fetch("/imagesData")
        .then((res) => res.json())
        .then((data) => {
          for (let imageData of data) {
            if (!imageData.imageUrl.includes("yuque")) {
              this.images.push(imageData);
            }
          }
          this.imagesCache = this.images;
        });
    },
    getKeywordsString(image) {
      return image.keywordsArray.join(",");
    },
    getNegativeKeywordsString(image) {
      return image.negativeKeywordsArray.join(",");
    },
    getImagesUrlArray() {
      let imagesUrlArray = [];
      for (let image of this.imagesCache) {
        imagesUrlArray.push(image.imageUrl);
      }
      return imagesUrlArray;
    },
    loadingError(imageUrl) {
      this.errorUrls.push(imageUrl);
    },
    searchImage(keywordsArray) {
      if (keywordsArray[0] == "") {
        return (this.images = this.imagesCache);
      }
      let matchImages = [];
      for (let imageData of this.imagesCache) {
        let match = true;
        for (let targetKeyword of keywordsArray) {
          if (!imageData.keywordsArray.includes(targetKeyword.trim())) {
            match = false;
            break;
          }
        }
        if (match) matchImages.push(imageData);
      }
      this.images = matchImages;
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#images-wrapper {
  padding-top: 60px;
}
</style>
