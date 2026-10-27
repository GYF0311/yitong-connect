# 第三层「明星与连接」demo

李一桐本人使用的粉丝连接后台（网页版 + 手机版自适应）。所有数据为虚构演示数据。

## 运行
纯静态网页，没有构建步骤。本地预览：

```sh
python3 -m http.server 8848
# 打开 http://127.0.0.1:8848/
```

## 部署说明（给 Codex）
- 入口：`index.html`；整个目录原样部署即可（`refs/`、`assets/source/`、`assets/tools/` 不需要上线）。
- 麦克风录音和摄像头自拍要求 HTTPS。
- 支持直达链接：`#today` `#reply` `#cards` `#insight` `#more`。

## 文件
| 文件 | 作用 |
|---|---|
| `index.html` | 页面骨架：侧栏、顶栏、抽屉、助手面板 |
| `styles.css` | 全部样式，含手机端（≤860px） |
| `data.js` | 演示数据 + `window.api` 数据接口层 |
| `app.js` | 页面渲染与交互 |
| `assets/` | Codex 生成的素材（横幅、小卡底图、人物插画、Q 版分层、logo） |
| `codex-图片生成提示词.md` | 素材生成要求 |

## 接数据库 / MCP
页面只通过 `data.js` 里的 `window.api` 读写数据（`getOverview`、`searchComments`、`sendReply`、`saveCard`、`approve`、`bless` 等）。
接入真实后端时，只需把这些函数换成接口调用，函数签名保持不变，页面代码不用改。
目前状态存在浏览器 localStorage，仅当前浏览器可见；`demo.reset()` 可清空。

## 在线预览
GitHub Pages：https://gyf0311.github.io/yitong-connect/
