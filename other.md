## Bridge底层如何实现

### JS 调用 Native
三种方式:
1、拦截 Scheme
2、注入js上下文
  iOS内置 JavaScriptCore,可实现执行JS以及注入Native对象等功能
    WKWebView: 通过addScriptMessageHandler 注入对象上下文, 前端调用注入方法后,通过didReceiveSCriptMessage 来接收前端的参数
    (window.webkit.messageHandlers.callNative.postMessage())
  Android addJavascriptInterface
    (window.AppFunctions.callNative)

### Native 调用 JS
Android:
  evaluateJavascript
UIWebView
  stringByEvaluatingJavaScriptFromString
WKWebView
  evaluateJavaScript

### 流程
JS 调用后, 生成唯一CallbackId,存入callbacks, 待回调后执行callback并从callbacks删除



## webpack为什么比vite慢
1、开发模式的差异
- webpack先打包后启动服务, vite则直接启动,再按需变异依赖文件
2、对 ES module 的支持
- 现代浏览器天然支持es module,直接在浏览器执行而不需要先打包再执行
3、底层语言差异
- webpack基于node构建,vite基于esbuild预构建依赖
  esbuild优势:
    采用Go语言,纳秒级别,而node是毫秒级别.
    Go语言重度依赖内存,更快
#### 什么是 ES module
通过 export import 语句, 允许在浏览器端导入导出模块


## Webpack hmr实现原理,热更新具体实现

- 修改代码后,生成新的hash值、新的json文件、新的js文件,即输出热更新的表示
- 触发重新编译后, 浏览器会触发2个请求,即本次新生成的文件(json+js文件),h代表hash表示,c代表热更新文件对应的index模块(如没变更,则c为空对象)

热更实现原理核心 - webpack-dev-server
本地启动后,再启动websocket服务,来建立本地服务和浏览器的双向通信
监听每次webpack编译完成,调用sendStats 通过websocket给浏览器发通知,拿到hash值后做对应更新逻辑
利用hash 调用hotDownloadManifest,发送XXX/hash.hot-update.json的请求,获取热更模块以及下次热更hash标识,进入热更准备
  解释下为什么是JSONP的形式:
    新编译的代码在一个webpackHotUpdate函数体内,需要立即执行
hotApply热更新模块替换
  删除过期模块
  添加新模块到modules
  通过__webpack_require__执行相关模块代码

### 监听本地文件变化 - webpack-dev-middleware
通过compiler.watch 监听