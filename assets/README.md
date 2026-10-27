# 「明星与连接」demo 图片素材

交付日期：2026-10-28。依据：`../codex-图片生成提示词.md`。本目录只交付素材及素材处理、校验文件，没有修改前端。

## 实际交付

包含 A–G 全部项目（含可选项）：**286 个约定素材文件**，其中 PNG 序列帧 240 张、其余素材 46 个。另附预览、分层配置、生成原图与技术校验记录；这些辅助文件不计入 286。

生成方式：位图使用内置 `imagegen`，以本项目两张参考图为依据；SVG 为原生矢量。PNG 对齐拆层、尺寸统一、WebP 编码和二维动作导出为后期素材处理。WebP 质量均为 85。生成源文件在 `source/`，可追溯路径见 `source/manifest.json`。

### A1 人偶与图层

下表所有文件均为 **1024×1024 RGBA 透明 PNG**，保留绝对画布坐标，不应裁掉各层透明区域。

| 文件 | 内容 |
|---|---|
| `chibi/full.png` | 默认状态完整合成图 |
| `chibi/layers/body.png` | 身体、长裙、双手和花束 |
| `chibi/layers/head.png` | 无眼、无嘴的脸部底图，保留眉鼻 |
| `chibi/layers/hair-back.png` | 后层头发 |
| `chibi/layers/hair-front.png` | 前层头发 |
| `chibi/layers/eye-white-left.png` | 画面左侧眼白、眼眶 |
| `chibi/layers/eye-white-right.png` | 画面右侧眼白、眼眶 |
| `chibi/layers/pupil-left.png` | 画面左侧瞳孔和高光 |
| `chibi/layers/pupil-right.png` | 画面右侧瞳孔和高光 |
| `chibi/layers/eyes-closed.png` | 闭眼替换层 |
| `chibi/layers/mouth-smile.png` | 微笑口型 |
| `chibi/layers/mouth-open.png` | 张嘴口型 |
| `chibi/layers/mouth-o.png` | O 口型 |
| `chibi/layers/blush.png` | 腮红 |
| `chibi/layers/earrings.png` | 白花耳坠 |
| `chibi/layers/butterfly.png` | 淡蓝蝴蝶 |

默认从后到前叠加：`hair-back → body → head → hair-front → earrings → eye-white-left → eye-white-right → pupil-left → pupil-right → blush → mouth-smile → butterfly`。

默认不显示 `eyes-closed`、`mouth-open`、`mouth-o`。眨眼时同时隐藏两只眼白及两只瞳孔，再显示 `eyes-closed`；结束时反向切换。三个口型互斥显示。瞳孔建议在原坐标附近移动不超过 ±3px，并在前端限制于眼睛范围内。左右按画面方向命名。完整配置见 `chibi/rig.json`。

这是面向眼睛、口型和蝴蝶互动的平面拆层，不是可任意大幅转头或换姿的完整角色骨骼。

### A2 循环动作

每段 **2.000 秒，24fps，1024×1024**。WebM 为 VP9，含 AlphaMode 和实际可解码透明通道。每个序列帧目录均有 **48 张 RGBA PNG**，从 `0001.png` 到 `0048.png`，每张 **1024×1024**。

| WebM 文件 | PNG 序列目录 | 动作 |
|---|---|---|
| `chibi/anim/idle.webm` | `chibi/anim/idle/0001.png` … `0048.png` | 呼吸、眨眼 |
| `chibi/anim/wave.webm` | `chibi/anim/wave/0001.png` … `0048.png` | 抬手姿势与手部轻摆 |
| `chibi/anim/think.webm` | `chibi/anim/think/0001.png` … `0048.png` | 点下巴姿势、轻微思考晃动 |
| `chibi/anim/happy.webm` | `chibi/anim/happy/0001.png` … `0048.png` | 眯眼笑、轻跳 |
| `chibi/anim/give-card.webm` | `chibi/anim/give-card/0001.png` … `0048.png` | 双手持空白卡片、轻微向前递送 |

制作方式为**生成动作关键姿势 + 二维局部形变与位移动画**，适合本次 demo；不是视频模型连续动作或逐帧手绘表演。所有动作首尾帧像素一致。不同动作采用各自生成的关键姿势，动作间如需切换建议短暂淡化过渡。透明 WebM 的实际播放能力由目标浏览器决定，PNG 序列可作为回退。

### A3 头像和胸像

| 文件 | 尺寸 | 格式 |
|---|---|---|
| `chibi/avatar-256.png` | 256×256 | 圆形构图、透明 PNG |
| `chibi/bust-hello.png` | 512×512 | 透明 PNG，打招呼 |
| `chibi/bust-think.png` | 512×512 | 透明 PNG，思考 |
| `chibi/bust-happy.png` | 512×512 | 透明 PNG，开心 |
| `chibi/bust-card.png` | 512×512 | 透明 PNG，举空白卡片 |

### B–G 其余素材

| 文件 | 像素尺寸 / SVG 画布 | 格式与内容 |
|---|---|---|
| `banner/banner-1.webp` | 3200×900 | WebP，水蓝花束与白纱 |
| `banner/banner-2.webp` | 3200×900 | WebP，珍珠、白羽毛与蝴蝶 |
| `banner/banner-3.webp` | 3200×900 | WebP，白蕾丝与蓝白花瓣 |
| `cards/card-chuyu.webp` | 1200×1800 | WebP，单朵初绽小花与晨光 |
| `cards/card-changban.webp` | 1200×1800 | WebP，两只蝴蝶 |
| `cards/card-changqing.webp` | 1200×1800 | WebP，盛开花束与薄纱 |
| `cards/card-gongchuang.webp` | 1200×1800 | WebP，画笔、空白纸与花瓣 |
| `portraits/portrait-watercolor.webp` | 1200×1500 | WebP，水彩半身插画 |
| `portraits/portrait-film.webp` | 1200×1500 | WebP，蓝调胶片插画 |
| `portraits/portrait-costume.webp` | 1200×1500 | WebP，原创交领汉服插画 |
| `logo/logo-a.svg` | 256×256 | SVG，蝴蝶方案 |
| `logo/logo-b.svg` | 256×256 | SVG，双叶方案 |
| `logo/logo-c.svg` | 256×256 | SVG，相对花瓣方案 |
| `deco/butterfly.svg` | 256×256 | SVG，蝴蝶 |
| `deco/flower.svg` | 256×256 | SVG，花朵 |
| `deco/pearl.svg` | 256×256 | SVG，珍珠 |
| `deco/ribbon.svg` | 256×256 | SVG，缎带 |
| `deco/star.svg` | 256×256 | SVG，星星 |
| `deco/leaf.svg` | 256×256 | SVG，叶子 |
| `live-cover.webp` | 1600×900 | WebP，人偶、麦克风与花束的小房间 |

全部 SVG 为纯路径/基本图形，单色 `#4366AE`，无文字或嵌入位图。

## 验收记录

- 文件名、数量、像素尺寸与格式已核验：286/286。
- 15 张分层与完整图同画布；按上述默认状态叠加与 `full.png` **逐像素完全一致**。
- 五段动作各 48 帧、24fps、2 秒；每段首尾帧一致。
- 已用 `libvpx-vp9` 实际解码 WebM，核验透明背景，非仅检查文件标签。
- 已查看静态总览、面部放大与眨眼样本；素材未见可见文字、logo 或水印。透明素材保留原生 Alpha，没有添加贴纸式白色描边。
- 当前是已生成、技术核验通过的 demo 交付；审美定稿由先生判断。未修改任何前端文件。

`verification.json` 保存每个约定素材的尺寸、字节数、SHA-256 以及合成/循环检查结果。技术通过不等于已经在目标网页或浏览器中实测接入。

## 辅助文件

- `preview.jpg`：静态素材总览，1600×1300；文件名只出现在该预览的标注中，正式素材无字。
- `source/`：生成母图、空白脸修补图、动作关键姿势、原尺寸位图与检查图。
- `source/generation-notes.md`：提示词与修订说明。
- `tools/`：素材对齐、编码、二维动作、预览和检查脚本，可供复核。脚本没有前端功能。

当前工作目录不在 Git 仓库内，因此未创建 commit。

## 第二批素材

2026-10-28：使用内置 image_gen 生成，原图与实际提示词保存在 `source/batch2/`。只交付素材，本轮未修改网页代码。

| 文件 | 像素尺寸 | 格式 |
|---|---|---|
| `pet/idle.png` | 1024×1024 | 透明 PNG（RGBA） |
| `pet/idle-256.png` | 256×256 | 透明 PNG（RGBA） |
| `pet/wave.png` | 1024×1024 | 透明 PNG（RGBA） |
| `pet/wave-256.png` | 256×256 | 透明 PNG（RGBA） |
| `pet/think.png` | 1024×1024 | 透明 PNG（RGBA） |
| `pet/think-256.png` | 256×256 | 透明 PNG（RGBA） |
| `pet/sleep.png` | 1024×1024 | 透明 PNG（RGBA） |
| `pet/sleep-256.png` | 256×256 | 透明 PNG（RGBA） |
| `pet/cheer.png` | 1024×1024 | 透明 PNG（RGBA） |
| `pet/cheer-256.png` | 256×256 | 透明 PNG（RGBA） |
| `pet/card.png` | 1024×1024 | 透明 PNG（RGBA） |
| `pet/card-256.png` | 256×256 | 透明 PNG（RGBA） |
| `pet/listen.png` | 1024×1024 | 透明 PNG（RGBA） |
| `pet/listen-256.png` | 256×256 | 透明 PNG（RGBA） |
| `pet/mic.png` | 1024×1024 | 透明 PNG（RGBA） |
| `pet/mic-256.png` | 256×256 | 透明 PNG（RGBA） |
| `pet/heart.png` | 1024×1024 | 透明 PNG（RGBA） |
| `pet/heart-256.png` | 256×256 | 透明 PNG（RGBA） |
| `pet/sheet.png` | 2048×1024 | PNG，浅灰白底 |
| `icons3d/today.png` | 512×512 | 透明 PNG（RGBA） |
| `icons3d/reply.png` | 512×512 | 透明 PNG（RGBA） |
| `icons3d/card.png` | 512×512 | 透明 PNG（RGBA） |
| `icons3d/insight.png` | 512×512 | 透明 PNG（RGBA） |
| `icons3d/more.png` | 512×512 | 透明 PNG（RGBA） |
| `icons3d/birthday.png` | 512×512 | 透明 PNG（RGBA） |
| `icons3d/live.png` | 512×512 | 透明 PNG（RGBA） |
| `icons3d/review.png` | 512×512 | 透明 PNG（RGBA） |
| `icons3d/heart.png` | 512×512 | 透明 PNG（RGBA） |
| `icons3d/star.png` | 512×512 | 透明 PNG（RGBA） |
| `icons3d/plus.png` | 512×512 | 透明 PNG（RGBA） |
| `icons3d/send.png` | 512×512 | 透明 PNG（RGBA） |
| `bg/mist-agent.webp` | 1200×800 | WebP，质量 85 |
| `bg/mist-wide.webp` | 3200×900 | WebP，质量 85 |
| `bg/mist-card.webp` | 1200×1800 | WebP，质量 85 |
| `orb/orb-1.png` | 1024×1024 | 透明 PNG（RGBA） |
| `orb/orb-2.png` | 1024×1024 | 透明 PNG（RGBA） |
| `orb/orb-3.png` | 1024×1024 | 透明 PNG（RGBA） |

本批必做交付共 37 个文件：宠物三视图 1 张、9 个动作的 1024 与 256 版本共 18 张、图标 12 张、背景 3 张、雾球 3 张。

- 宠物以同一三视图为角色依据；原生 Alpha 保留，等比缩放并居中留白；256 小图从对应 1024 交付图导出。
- 图标统一为蓝白果冻 3D，左上柔光、圆润边缘与珍珠白高光。不同图形的几何结构和投影存在自然差异。
- 交付尺寸通过重采样统一，并非全部为模型原生输出尺寸；三视图从约 2:1 原图重采样到精确 2048×1024。
- 可选 `pet/anim/idle.webm`、`pet/anim/think.webm` 与 `orb/orb-loop.webm` 未制作。
- 技术核验和视觉检查不等于先生已经审美批准，也不代表已在网页中接入或实测。

核验结果：37/37 文件名、尺寸与格式通过；33 张透明 PNG 均为 RGBA，含真正透明与可见像素，四角全透明。已逐组查看宠物与图标预览、三张背景及三张雾球。`source/batch2/verification.json` 记录逐文件尺寸、字节数与 SHA-256。
