# Dia Tab Titles

让 Dia 浏览器的侧边栏显示网页**标题**，而不是一串区分度很低的网址。

> Makes Dia's sidebar show page titles instead of bare domains: strips invisible
> formatting characters from titles and gives titleless pages a title.

## 为什么需要它

Dia 侧边栏遇到标题里带隐形格式字符（零宽空格、文字方向控制符等）的网页时，会改为只显示
域名。例如部分飞书文档的标题前带有几十个这样的字符（疑似隐形水印），在 Chrome、Arc 里
显示正常，在 Dia 侧边栏里却变成了 `bytedance.larkoffice.com`。

本扩展在所有网站上：

- 去掉网页标题里的隐形格式字符；网页反复把它们加回去时也会持续处理；
- 网页本身没有标题时，用页面的分享标题（`og:title`）或主标题（`h1`）补上；
- 保留 emoji 组合（如 👨‍👩‍👧）、旗帜、以及部分文字（如波斯语）需要的连接字符。

点工具栏里的扩展图标可以随时关闭。

> 注意：这会去掉这些页面标题中的隐形水印（只影响浏览器里的标签页标题、历史记录、收藏等，
> 不影响网页或文档内容）。如所在组织对此有要求，请先确认。

## 安装

1. 下载本仓库：点页面上方绿色的 **Code → Download ZIP** 并解压，或者 `git clone` 到本地
   （放在不会被误删的位置，扩展会一直从这个文件夹加载）；
2. 在 Dia 地址栏打开 `chrome://extensions`，打开右上角的 **开发者模式**；
3. 点 **加载已解压的扩展程序**，选择解压出来的文件夹（里面有 `manifest.json`）。

装好后已打开的网页也会立刻生效，不需要刷新。Dia 放到后台休眠的标签页里网页没有在运行，
插件没法修改，点开它时会自动修好。

## 许可

[MIT](LICENSE)
