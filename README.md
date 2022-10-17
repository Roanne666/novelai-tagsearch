# novelai-tagserach

## 离线版使用说明
1. 在网盘下载项目，将后缀改为.zip(也可以直接在release中下载)
2. 打开目录中的index.html即可正常使用  
链接: <https://pan.baidu.com/s/1Zyfz2zZXFdriBDa6ynkwFA> 提取码: afbe  

## 项目使用说明
1. 安装node.js
2. 下载项目并解压
3. 在终端(项目根目录中)输入以下代码
```
npm install
npm run build
npm start
```
4. 如果你使用了vpn下载图片，请耐心等待图片下载完成，下载完成后终端会有提示（没有使用vpn可以直接进行下一步）
5. 在浏览器中输入<http://localhost:3000>
6. 如果你添加了图片，等待图片下载完成后，需要再次输入npm run build将图片数据打包(不需要关闭服务器，只需要刷新网页即可)

## 如何获取pixiv/推特上的图片
1. 打开config.json
2. 将use_proxy改为true，
3. 在vpn设置中查看HTTP代理端口，将proxy_port改为相对应的端口

## FAQ
Q:可以自行添加图片吗？  
A:可以开启本地服务器后使用后台添加图片，离线版不能添加图片  
  
Q:为什么有些网站的图打不开？  
A:目前国外只适配了pixiv和推特，国内尚未做适配  
