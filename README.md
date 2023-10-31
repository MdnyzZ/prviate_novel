# novel

An Electron application with Vue and TypeScript



✅ utf-8的txt文件导入识别目录并分割文件

✅ 文本基础阅读

✅ shief模式



### todoList

- 日志系统
- 内部静默选项持久化设置
  - 阅读器的字体、间距、翻页模式、样式等
  - 窗口resize后下次打开时的大小（shief窗口大小独立配置）
- 设置选项支持
  - 是否小偷模式
  - dark/light模式
- 兼容多格式的txt导入识别
- 兼容EPUB、PDF、TXT格式
- 文本阅读器的优化
  - 字体、间距、翻页模式支持设置
  - 支持tts语音阅读
  -  shief模式的阅读器优化
- 支持全网搜书识别
  - 书源规则逻辑
  - 根据网页选中自动适配书源规则
- 优化书架页面
  - 书籍右键功能
  - 自动查找封面功能
- 书籍详情功能
- 优化整体界面展示
- 任务栏按键功能
  - mac/window
- 动画
  - 书籍打开到阅读界面动画
  - 菜单切换路由动画

​	

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

## Project Setup

### Install

```bash
$ npm run install --registry=https://registry.npm.taobao.org
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

