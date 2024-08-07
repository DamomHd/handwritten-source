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
3、 热更新处理
- webpack 依赖模块更新时,整个项目需要重新编译
- vite 只需要浏览器重新请求对应模块即可
  es module特性,利用浏览器缓存,针对源码模块做了协商缓存,针对三方依赖模块做了强缓存
4、构建方式不同
- webpack 基于node 单线程
- vite 基于esbuild
    esbuild优势:
    采用Go语言,纳秒级别,而node是毫秒级别.
    Go语言重度依赖内存,更快
    多核CPU
5、http2
vite 并发多个请求同时加载多个模块

关于vite webpack打包不一致的问题讨论: rollDown

### 为什么不适用 vite 上生产
vite开发环境适用esbuild,虽然快,但输出在构建资源优化方面有非常有限的控制能力,没太多方法控制代码拆分.

#### 什么是 ES module
通过 export import 语句, 允许在浏览器端导入导出模块


## Webpack hmr实现原理,热更新具体实现

- 修改代码后,生成新的hash值、新的json文件、新的js文件,即输出热更新的表示
- 触发重新编译后, 浏览器会触发2个请求,即本次新生成的文件(json+js文件),h代表hash表示,c代表热更新文件对应的index模块(如没变更,则c为空对象)

热更实现原理核心 - webpack-dev-server
本地启动后,再启动websocket服务,来建立本地服务和浏览器的双向通信
监听每次webpack编译完成,调用sendStats 通过websocket给浏览器发通知,拿到hash值后做对应更新逻辑
利用hash 调用hotDownloadManifest,发送XXX/hash.hot-update.json的请求,获取热更模块以及下次热更hash标识,进入热更准备(DOM中添加script标签方式动态请求update.js - JSONP)
  解释下为什么是JSONP的形式:
    新编译的代码在一个webpackHotUpdate函数体内,需要立即执行
hotApply热更新模块替换
  删除过期模块
  添加新模块到modules
  通过__webpack_require__执行相关模块代码

### 监听本地文件变化 - webpack-dev-middleware
通过compiler.watch 监听

### JSONP
事先定义一个用于获取跨域相应数据的回调函数, 并通过没有同源策略限制的script标签发起一个请求,然后服务端返回这个回调函数执行,并将需要响应的数据放到回调参数里,前端script请求到这个执行函数回调后立即执行,拿到执行结果

  - 兼容性更好
  - 只支持get 不支持post
  - 只支持跨域http请求,不能解决不同域两个页面之间的相互调用

client
```
function onResponse(data) {
  console.log('接受到的回调结果', data)
}


var script = document.createElement('script')
script.src = 'https://a.a.a.a/?callback=onResponse'
document.head.appendChild(script)
```

server
```
app.get('/a', function (request,response) {
  var data = getData();
  var callback = request.query.callback;
  var res = `${callback}(${JSON.stringify(data)});`
  response.send(res)
})
```

#### 安全问题
- CSRF攻击
  验证调用来源 Referer
- XSS漏洞
  严格定义Content-type: application/json、限制callback长度、字符转译



## useEffect useLaoutEffect

- 执行时机
  useEffect: 在浏览器完成DOM更新后异步执行,不会阻塞页面渲染
  useLayoutEffect: 在浏览器渲染DOM之前同步执行,阻塞页面渲染

- 使用场景
  useEffect: 数据获取、设置定时器、操作DOM(不影响页面布局、用户体验)
  useLayoutEffect:
    DOM操作(会影响用户体验、页面布局)
      DOM元素尺寸,确保DOM更新后获取准确的尺寸
      进行动画或者过度,可以同步更新DOM,防止视觉上的闪烁、不流畅

## 实现 useState

```
function useState(initialValue) {
  let state = initialValue;
  function setState(newState) {
    state = newState;

  }
  return [state, setState]
}
```

## 为什么要移除umi 是有什么能力做不到吗

- 体积过大: 为了提供丰富的功能、插件,依赖的库和代码非常庞大,导致打包后体积过大
- 配置复杂: umi配置项非常多,本为了方便开发大型项目,但也增加了学习成本,对于面向C端的移动端项目而言,过于重
- 偏企业级: umi主要正对企业级应用场景设计,比如微前端、权限管理等,对于C端h5功能是冗余的,无形增加了项目复杂度

umi限制webpack自定义,umi构建流程是固定的,无法完成特定的代码转化等额外操作
umi偏向约定大于配置
umi并不是webpack的替代品


## 模块联邦
模块加载
代码复用
版本管理


## 性能优化的几个方向
- webview 预加载
- 渲染优化
  预置离线包
  并行加载
  预加载
  延迟加载
  页面静态直出
  复用webview
- 容器优化
  预置离线包
- http缓存策略
- DNS 优化
- CDN 加速
- 代码逻辑优化
- 打包构建优化
  code spliting
  tree shaking
  happypack
  dll
