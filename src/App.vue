<template>
  <div id="app">
    <Background @showImageDirs="showImageDirs"></Background>
    <Settings v-show="loadingDir" :settings="settings"></Settings>
    <div>
      <search-input
        @searchImage="searchImage"
        :allKeywordsArray="allKeywordsArray"
      ></search-input>
      <div id="images-wrapper" class="demo-image__preview">
        <el-row :gutter="12">
          <el-col :span="8" v-for="image in images" :key="image.imageUrl">
            <el-card v-show="isShowImage(image)">
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
import Background from "./components/Background.vue";
import Settings from "./components/Settings.vue";
import ImagePreview from "./components/ImagePreview.vue";
import PopOver from "./components/PopOver.vue";
import SearchInput from "./components/SearchInput.vue";

export default {
  name: "App",
  components: {
    Background,
    Settings,
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
      showingError: false,
      loadingDir: false,
      settings: {
        imageDirs: [],
        openNSFW: false,
      },
    };
  },
  mounted() {},
  methods: {
    showImageDirs(imageDirs) {
      for (let imageDir of imageDirs) {
        this.settings.imageDirs.push({
          dirName: imageDir,
          selected: true,
        });
      }
      this.loadingDir = true;
    },
    isShowImage(image) {
      return !this.settings.openNSFW && image.r18;
    },
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

#dir-wrapper {
  margin-top: 20px;
}

#images-wrapper {
  padding-top: 65px;
}
</style>
