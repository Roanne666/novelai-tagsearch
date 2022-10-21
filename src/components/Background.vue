<template>
  <div></div>
</template>

<script>
export default {
  mounted() {
    this.checkImageDirs();
  },
  methods: {
    checkImageDirs() {
      this.$axios.get("/checkImageDirs").then((res) => {
        let { isFirstUse, platform, imageDirs } = res.data;

        if (isFirstUse) {
          let content = {
            confirmNameContent: `
          <p>
          您好，来自platform系统的不知名魔导师，欢迎你打开这本万法之书
          <br>
          在正式开始您的魔法之路前，请先跟随指引来为这本魔法书附魔
          </p>`,
            dirCreateContent: "",
            lastContent: `
          <p>
          恭喜您完成了基础引导！
          <br>
          随后您只需要选择您想学习的目录即可开始学习魔咒
          </p>
          `,
          };

          if (platform == "darwin") {
            content.confirmNameContent = content.confirmNameContent.replace(
              "platform",
              "mac"
            );
            content.dirCreateContent = `
          <p>
          您好，魔法师
          <br>
          由于您的魔法系统保护机制过于强大，需要您在万法之书的运行目录创建一个名为images文件夹
          <br>
          创建后把装有AI绘制图片的文件夹放进运行目录中的images文件夹即可
          </p>`;
          }

          if (platform == "win32") {
            content.confirmNameContent.replace("platform", "windows");
            content.dirCreateContent = `
          <p>
          您好，魔法师
          <br>
          万法之书已经帮您做好初始化工作，请继续引导
          <br>
          您只需要把装有AI绘制图片的文件夹放进运行目录中的images文件夹即可
          </p>`;
          }

          this.$alert(content.confirmNameContent, "万法之书的新手引导", {
            showCancelButton: false,
            closeOnPressEscape: false,
            closeOnClickModal: false,
            dangerouslyUseHTMLString: true,
            showClose: false,
            confirmButtonText: "开始引导",
          }).then(() => {
            this.$alert(content.dirCreateContent, "万法之书的新手引导", {
              showCancelButton: false,
              closeOnPressEscape: false,
              closeOnClickModal: false,
              dangerouslyUseHTMLString: true,
              showClose: false,
              confirmButtonText: "下一步",
            }).then(() => {
              this.$alert(content.lastContent, "万法之书的新手引导", {
                showCancelButton: false,
                closeOnPressEscape: false,
                closeOnClickModal: false,
                dangerouslyUseHTMLString: true,
                showClose: false,
                confirmButtonText: "完成引导",
              }).then(() => {
                this.checkImageDirs();
              });
            });
          });
        } else {
          this.$emit("showImageDirs", imageDirs);
        }
      });
    },
  },
};
</script>

<style>
</style>