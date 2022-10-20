<template>
  <div id="app">
    <div
      id="enter-admin"
      class="flex justify-space-between mb-4 flex-wrap gap-4"
      v-show="false"
    >
      <el-button id="admin-button" @click="adminButtonClick">{{
        adminButton.text
      }}</el-button>
    </div>
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
      showingError: false,
    };
  },
  mounted() {
    let userName = "";
    // this.$axios.get("/getImageDirs").then((res) => {
    // let { isFirstUse, imageDirs, platform } = res.data;

    let content = {
      confirmNameContent:
        "<p>您好，来自platform系统的不知名魔导师，欢迎你打开这本万法之书<br>在正式开始您的魔法之路前，请先输入您的名号</p>",
      dirCreateContent: "",
    };
    // if (isFirstUse) {
    //   if (platform == "darwin") {
    //     content.confirmNameContent = content.confirmNameContent.replace(
    //       "platform",
    //       "mac"
    //     );
    //     content.dirCreateContent =
    //       "<p>您好，name<br>由于您的魔法系统保护机制过于强大，需要您本人在万法之书的运行目录创建一个名为images文件夹</p>";
    //   }
    //   if (platform == "win32") {
    //     content.confirmNameContent.replace("platform", "windows");
    //     content.dirCreateContent =
    //       "<p>您好，name<br>万法之书已经帮您做好初始化工作<br>您只需要把装有AI绘制图片的文件夹放进运行目录中的images文件夹即可</p>";
    //   }
    // }
    content.dirCreateContent =
      "<p>您好，name<br>由于您的魔法系统保护机制过于强大，需要您本人在万法之书的运行目录创建一个名为images文件夹</p>";

    this.$prompt(content.confirmNameContent, "万法之书的新手引导", {
      showCancelButton: false,
      closeOnPressEscape: false,
      closeOnClickModal: false,
      dangerouslyUseHTMLString: true,
      showClose: false,
      confirmButtonText: "下一步",
    }).then(({ value }) => {
      userName = value;
      content.dirCreateContent = content.dirCreateContent.replace(
        "name",
        value
      );
      this.$alert(content.dirCreateContent, "万法之书的新手引导", {
        dangerouslyUseHTMLString: true,
      });
    });
    // });
  },
  methods: {
    uploadJson(data) {
      this.isUpload = true;
      this.images = data;
      this.imagesCache = data;
      this.getAllKeywordsArray(this.imagesCache);
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
