## ActionView front-end

![](https://img.shields.io/badge/framework-reactjs+redux-brightgreen.svg) ![](https://img.shields.io/badge/license-apache2.0-brightgreen.svg)  

ActoionView前端代码库，基于Reactjs＋Redux。后端代码库：[actionview](https://github.com/lxerxa/actionview)。

# Demo

https://actionview.cn  

## How to install

环境要求：
> 安装 node ~4.2.6, npm ~3.5.2

下载代码：  
> git clone https://github.com/lxerxa/actionview-fe.git  
> cd actionview-fe  
> npm install  

依赖包：  
> 1. 修改node_modules/react-image-lightbox下的react-image-lightbox.js: 830行去掉close class。  
> 2. 确认node_modules下是否有dropzone文件夹，若没有请将react-dropzone-component/node_modules下的dropzone拷贝值该node_modules下。    
> 3. 确认node_modules下是否有cropperjs文件夹，若没有请将react-cropper/node_modules下的cropperjs拷贝值该node_modules下。  

运行Demo：  
> npm run dev  
> http://localhost:3002/   

发布部署：  
> npm run build  
> sh ./deploy.sh  

## Contributing

谢谢您能参与ActionView的前端开发当中。如果您对系统有一些疑惑，或发现了一些bug，或建议增加新的feature，或对系统有一些改进时，欢迎在[issue board](https://github.com/lxerxa/actionview-fe/issues)中讨论。如果发现有重大安全问题可发Email至：actionview@126.com。 

## License

ActionView 遵从许可证 [ Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)

The ActionView is open-sourced software licensed under the [ Apache License Version 2.0](https://www.apache.org/licenses/LICENSE-2.0)
