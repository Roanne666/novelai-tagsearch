<template>
  <div id="app">
    <div id="uploader-wrapper" v-show="!isUpload">
      <el-switch v-model="openNSFW" inactive-text="禁用R18"> </el-switch>
      <uploader-vue id="uploader" @uploadJson="uploadJson"></uploader-vue>
    </div>
    <div v-show="!adminButton.isAdmin">
      <search-input
        @searchImage="searchImage"
        :allKeywordsArray="allKeywordsArray"
      ></search-input>
      <div id="images-wrapper" class="demo-image__preview">
        <el-row :gutter="12">
          <el-col :span="8" v-for="image in images" :key="image.imageUrl">
            <el-card>
              <ImagePreview
                @loadingError="loadingError"
                :imagesUrlArray="getImagesUrlArray()"
                :image="image"
              />
              <PopOver
                :keywords="getKeywordsString(image)"
                :negative-keywords="getNegativeKeywordsString(image)"
                :metadata="getMetadata(image)"
                :imageUrl="image.imageUrl"
              ></PopOver>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import UploaderVue from "./components/Uploader.vue";
import ImagePreview from "./components/ImagePreview.vue";
import PopOver from "./components/PopOver.vue";
import SearchInput from "./components/SearchInput.vue";

export default {
  name: "App",
  components: {
    UploaderVue,
    ImagePreview,
    PopOver,
    SearchInput,
  },
  data() {
    return {
      images: [],
      imagesCache: [],
      allKeywordsArray: [],
      errorUrls: [],
      isUpload: false,
      openNSFW: true,
      showingError: false,
    };
  },
  methods: {
    uploadJson(data) {
      this.isUpload = true;
      this.images = data;
      this.imagesCache = data;
      this.getAllKeywordsArray(this.imagesCache);
    },
    getAllKeywordsArray(imagesData) {
      let data = [];
      for (let imageData of imagesData) {
        for (let keyword of imageData.keywordsArray) {
          let lowerKeyword = keyword.toLowerCase();
          if (!data.includes(lowerKeyword)) {
            data.push(lowerKeyword);
            this.allKeywordsArray.push({ value: lowerKeyword });
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
    getMetadata(image) {
      return [
        {
          name: "sampler",
          value: image.sampler,
        },
        {
          name: "seed",
          value: image.seed,
        },
        {
          name: "steps",
          value: image.steps,
        },
        {
          name: "strength",
          value: image.strength,
        },
        {
          name: "noise",
          value: image.noise,
        },
        {
          name: "scale",
          value: image.scale,
        },
      ];
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
      if (this.showingError) {
        return;
      } else {
        this.showingError = true;
        let message = this.$message({
          showClose: true,
          message: "图片加载出错，请检查图片位置或json文件是否有误！",
          type: "error",
        });
        message.onClose = () => {
          this.showingError = false;
        };
      }
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
body {
  margin: 0;
  padding: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
}

#uploader-wrapper {
  margin-top: 80px;
}

#uploader {
  margin-top: 15px;
}

#enter-admin {
  position: fixed;
  top: 11px;
  right: 10px;
  z-index: 1000;
}

#upload-finish {
  margin-top: 15px;
}

#images-wrapper {
  padding-top: 65px;
}
</style>
