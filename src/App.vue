<template>
  <div id="app">
    <div id="nsfw" class="flex justify-space-between mb-4 flex-wrap gap-4">
      <el-switch v-model="openNSFW" inactive-text="禁用R18"> </el-switch>
    </div>
    <div
      id="enter-admin"
      class="flex justify-space-between mb-4 flex-wrap gap-4"
    >
      <el-button id="admin-button" @click="adminButtonClick">{{
        adminButton.text
      }}</el-button>
    </div>
    <PictureCollect v-show="adminButton.isAdmin"></PictureCollect>
    <uploader-vue
      id="uploader"
      @uploadJson="uploadJson"
      v-if="!isUpload"
    ></uploader-vue>
    <div v-show="!adminButton.isAdmin">
      <search-input
        @searchImage="searchImage"
        :allKeywordsArray="allKeywordsArray"
      ></search-input>
      <div id="images-wrapper" class="demo-image__preview">
        <el-row :gutter="12">
          <el-col :span="8" v-for="image in images" :key="image.imageUrl">
            <el-card :body-style="{ padding: '0px' }" v-show="isShow(image)">
              <ImagePreview
                @loadingError="loadingError"
                :imagesUrlArray="getImagesUrlArray()"
                :image="image"
              />
              <PopOver
                :keywords="getKeywordsString(image)"
                :negative-keywords="getNegativeKeywordsString(image)"
                :imageUrl="image.imageUrl"
                :r18="image.r18"
                @switchR18="switchR18"
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
import PictureCollect from "./components/PictureCollect.vue";
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
    PictureCollect,
  },
  data() {
    return {
      adminButton: {
        isAdmin: false,
        text: "后台",
      },
      images: [],
      imagesCache: [],
      allKeywordsArray: [],
      errorUrls: [],
      isUpload: false,
      openNSFW: true,
    };
  },
  computed: {
    isShow() {
      return function (image) {
        if (this.errorUrls.includes(image.imageUrl)) return false;
        if (image.r18 && this.openNSFW) return false;
        return true;
      };
    },
  },
  methods: {
    uploadJson(data) {
      this.isUpload = true;
      this.images = this.images.concat(data);
      this.imagesCache = this.imagesCache.concat(data);
      this.getAllKeywordsArray(this.imagesCache);
    },
    // R18标识
    switchR18(imageUrl) {
      for (let imageData of this.imagesCache) {
        if (imageData.imageUrl == imageUrl) {
          this.$axios({
            method: "POST",
            url: "/switchR18",
            data: { imageUrl },
          }).then((res) => {
            console.log(res.data);
          });
        }
      }
    },
    adminButtonClick() {
      this.adminButton.isAdmin = !this.adminButton.isAdmin;
      if (this.adminButton.isAdmin === true) {
        this.adminButton.text = "前台";
      } else {
        this.getImageData();
        this.adminButton.text = "后台";
      }
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

#uploader {
  margin-top: 80px;
}

#enter-admin {
  position: fixed;
  top: 11px;
  right: 10px;
  z-index: 1000;
}

#nsfw {
  position: fixed;
  top: 20px;
  right: 100px;
  z-index: 1001;
}

#images-wrapper {
  padding-top: 60px;
}
</style>
