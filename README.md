# novelai-tagserach

## 不懂程序，只想看项目成果
将版本切换到offline版本即可

## 使用说明
1. 安装node.js
2. 下载项目并解压
3. 在终端(项目根目录中)输入以下代码
```
npm install
npm run build
npm start
```
4. 如果你使用了vpn获取pixiv图片，请耐心等待图片下载完成，下载完成后终端会有提示（没有使用vpn可以直接进行下一步）
5. 在浏览器中输入<http://localhost:3000>

## 如何获取pixiv上的图片(本项目包含)
1. 打开config.json
2. 将use_proxy改为true，
3. 在vpn设置中查看HTTP代理端口，将proxy_port改为相对应的端口

## FAQ
Q:怎么安装node.js/输入代码等问题  
A:<https://www.baidu.com>  
  
Q:可以自行添加图片吗？  
A:在data/AIImage.json中可以直接添加图片数据，后续会做一个页面直接添加数据  
  
Q:为什么有些网站的图打不开？  
A:目前国外只适配了pixiv，国内尚未做适配  