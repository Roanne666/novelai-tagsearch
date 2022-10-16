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
import transImagesData from "./assets/transImages.json";
import ImagePreview from "./components/ImagePreview.vue";
import PopOver from "./components/PopOver.vue";
import SearchInput from "./components/SearchInput.vue";

export default {
  name: "App",
  components: { ImagePreview, PopOver, SearchInput },
  data() {
    return {
      images: transImagesData,
      imagesCache: transImagesData,
      allKeywordsArray: [],
      errorUrls: [],
    };
  },
  computed: {
    isError() {
      return function (image) {
        return this.errorUrls.includes(image.imageUrl);
      };
    },
  },
  mounted() {
    this.allKeywordsArray = this.getAllKeywordsArray();
  },
  methods: {
    getAllKeywordsArray() {
      let data = [];
      for (let imageData of transImagesData) {
        for (let keyword of imageData.keywordsArray) {
          let lowerKeyword = keyword.toLowerCase();
          if (!data.includes(lowerKeyword)) {
            data.push({ value: lowerKeyword });
          }
        }
      }
      return data;
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
