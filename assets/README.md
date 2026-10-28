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


## 第三批：应援色调整

2026-10-28，按 `../codex-图片生成提示词-第三批-应援色.md` 执行。所有替换前原文件已按目录结构备份到 `source/backup-royal-blue/`，包含原动画帧和 README。

- **重新生成**：`banner/banner-1.webp`（花墙）、`banner/banner-2.webp`（冰雪）、`banner/banner-3.webp`（云朵）。使用内置 image_gen，生成后裁切重采样为 3200×900，WebP quality 85。原图和提示词见 `source/batch3/`。
- **蓝色区域调色**：`cards/card-*.webp` 4 张、`portraits/portrait-*.webp` 3 张、`live-cover.webp`；`chibi/` 的全部 21 张静态/分层 PNG 和 240 张动画 PNG 序列帧；第二批 `pet/*.png` 19 张、`icons3d/*.png` 12 张、`bg/*.webp` 3 张、`orb/*.png` 3 张。
- 方法：只选 HSV 色相 200°–260°、饱和度 >0.15 的蓝色像素，蒙版内缘平滑过渡至约 205°；小卡、背景与直播封面同时提亮、降低蓝色饱和度。非蓝色像素和原 Alpha 均逐像素保持不变。PNG 画布与坐标不变；调色 WebP 使用无损编码，避免二次有损压缩改变肤色等保护区域（体积会增加）。
- **动画重新导出**：`chibi/anim/idle.webm`、`wave.webm`、`think.webm`、`happy.webm`、`give-card.webm`，由调色后帧序列导出透明 VP9，保持 1024×1024、24fps、48 帧、2 秒；实际解码检查透明通道，首尾帧一致。
- 技术核验覆盖 309 张图片及 5 段动画；尺寸保持一致，所有调色图片的非蓝像素与 Alpha 改变量均为 0。按 `rig.json` 重合成后，Alpha 与完整图逐像素一致、无坐标错位。独立调色图层与完整图在 371 个半透明叠加边缘像素存在色彩舍入差异；重合成预览为 `source/batch3/rig-recomposed.png`。
- `logo/*.svg`、`deco/*.svg` 未修改。此次工具只写入 `assets/`；执行期间发现其他进程更新前端，相关前端改动保留且不纳入本次素材提交。

文件清单、SHA-256、尺寸和校验结果：`source/batch3/verification.json`。新版总览：`source/batch3/preview.jpg`。原有 `verification.json` 和 `preview.jpg` 是旧批次记录，不代表本批最新状态。

视觉检查未见明显发灰、发脏或人物肤色偏移。胶片人物图按原图保留较深背景，仅调整蓝色色相；未对人物图整体提亮。最终审美及白字在实际页面上的可读性仍由页面接入后确认，本次未修改页面或宣称完成浏览器接入验收。


## 第五批：桐铃 logo / 新小桐 / 肉肉

2026-10-28，仅完成第一步：logo 正式交付，角色仅为待先生选择的风格候选。未执行第二步的分层、动作、小尺寸及动画；现有 chibi/、pet/ 与 rig.json 未替换。前端四个代码文件未修改。

| 文件 | 尺寸与说明 |
|---|---|
| `logo/logo-a.svg` | 256×256，正方形 viewBox，水蓝实心桐叶与深蓝铃铛 |
| `logo/logo-b.svg` | 256×256，深蓝线稿版 |
| `logo/logo-c.svg` | 256×256，反白版 |
| `logo/logo-a-512.png` | 512×512，RGBA 真实透明 |
| `source/batch5/options/xiaotong-1-vinyl.png` | 1536×1024，潮玩软胶候选 |
| `source/batch5/options/xiaotong-2-plush.png` | 1536×1024，毛绒候选 |
| `source/batch5/options/xiaotong-3-clay.png` | 1536×1024，柔和动画电影候选 |
| `source/batch5/options/xiaotong-4-flat.png` | 1536×1024，扁平色块插画候选 |
| `source/batch5/options/rourou-1-vinyl.png` | 1536×1024，软胶与毛发候选 |
| `source/batch5/options/rourou-2-plush.png` | 1536×1024，毛绒候选 |
| `source/batch5/options/overview.png` | 1800×920，六款编号对比 |

候选图按第一步特别要求使用浅灰白不透明背景；原文通用透明 PNG 要求留待第二步执行。候选由内置 image_gen 逐款生成；各款脸型、服饰细节有自然差异，肉肉软胶款毛发较多，均未获得最终审美批准。第4款初版偏二次元，已重做为扁平色块风格，初版保留于 source/batch5/rejected/。

替换前 logo 与 README 已按目录结构备份到 `source/backup-batch5/`。SVG 仅用 path，无文字、位图、渐变或滤镜；已检查24/40px预览，见 `source/batch5/logo-preview.png`。提示词见 `source/batch5/xiaotong-prompts.json`、`source/batch5/rourou-generation.md`；文件尺寸与 SHA-256 见 `source/batch5/verification.json`。


## 第五批第二轮：修长手办风格候选

2026-10-28，按提示词末节与先生追加的参考映射执行，内置 image_gen 多路生成。已实际查看并输入本地脸部照片及对应手办参考。参考照片没有拼入交付图。此前通用设定调用被中断，未获得可保存的 generic 成品；因此没有虚构 -generic 文件。已返回的参考版过程稿保留在 source/batch5/intermediate/ 与 rejected/。第一轮文件完整保留。

所有下列单张均1536×1024，浅灰白/白色不透明背景（本阶段特定要求）：

| 文件（位于 source/batch5/options/） | 风格 |
|---|---|
| xiaotong-5-pvc.png | PVC 手办，叉腰比V |
| xiaotong-6-clay-slim.png | 哑光雕塑/黏土方向，低马尾 |
| xiaotong-7-street.png | 街头潮玩，白卫衣与水蓝工装裤 |
| xiaotong-8-toon3d.png | 三渲二，侧身回头 |
| xiaotong-9-film.png | 动画电影风格化3D |
| rourou-3-figure.png | 长毛雕塑手办 |
| rourou-4-clay.png | 圆块面黏土 |
| rourou-5-toon.png | 色块与细描边 |
| rourou-6-line.png | 蓝色线稿与少量填色 |

另有 overview-2.png（3000×900，上排小桐5–9，下排肉肉3–6）及 pairs-2.png（2700×1320，5+3、6+4、8+5三组完整图对比）。配对图为候选图排版，未重新生成合照。

视觉评估：

| 小桐 | 接近参考的部分 | 仍有差异的部分 |
|---|---|---|
| 5 PVC | 杏眼卧蚕、笑嘴弧度、柔和脸型 | 眼睛偏动漫放大，下巴偏收，月牙笑眼不足 |
| 6 黏土 | 重画后平眉、杏眼、卧蚕、圆润下巴、微笑更接近 | 仍是精致雕塑材质，衣料细节较多，未达到粗块手捏黏土的强简化；笑眼不够弯 |
| 7 街头 | 上扬嘴角、杏眼、圆润脸型 | 眼睛稍大，表情仍偏通用潮玩脸，五官辨识被风格化削弱 |
| 8 三渲二 | 眼尾走向、眉形、鼻唇轮廓 | 下颌鼻唇较利落，笑容克制，月牙笑眼弱 |
| 9 电影3D | 鹅蛋脸与柔和鼻唇、眼形 | 眼睛略大，脸偏理想化动画角色，苹果肌和笑眼弧度不足 |

以上为对照参考后的主观判断，属于候选，不是先生已批准的身份/审美验收。第6已针对身份、遮眼与材质多次重画后采用当前版，并明确保留剩余差异。

未执行第二步分层、动作、小尺寸、动画，未替换正式 chibi/、pet/ 或 logo，前端未改。提示词和输入路径：round2-a.json、round2-a-clay-final.json、round2-b.json、round2-dog.json；尺寸及SHA-256：round2-verification.json（均位于 source/batch5/）。


## 第五批第三轮：风格化手办脸与统一飞书档案

2026-10-28，按第三轮补充任务执行。仅候选，内置 image_gen 多路生成；实际查看并使用 style-face01/02/03，照片仅提取月牙笑眼与卧蚕、小鹅蛋圆下巴、长黑发。手办风格优先。未使用禁止的西装、格纹裙、领带、堆堆袜、乐福鞋、卫衣配工装裤。

第二轮的 xiaotong-5-pvc.png、xiaotong-7-street.png 已按指示移至 source/batch5/rejected/ 并加 -rejected 后缀；旧总览、提示词和校验记录保留作历史，不代表当前认可。历史总览构建工具已兼容退回路径。

新候选均在 source/batch5/options/，单张1536×1024、浅灰白不透明背景：

| 文件 | 内容 |
|---|---|
| xiaotong-10-clay-a.png | 黏土清冷半眯，白衬衫长裙，背手前倾 |
| xiaotong-11-clay-b.png | 黏土月牙笑眼，水蓝毛衣与白长裙，捧铃铛 |
| xiaotong-12-pvc-a.png | PVC月牙笑眼，开衫与A字裙，眼边比V |
| xiaotong-13-pvc-b.png | PVC清冷，水蓝长大衣，侧身回头 |
| xiaotong-14-street.png | 潮玩，防风夹克牛仔裤，饮料与OK手势 |
| xiaotong-15-toon3d.png | 三渲二，背心衬衫灰长裤，坐方块托腮 |
| rourou-7-clay.png | 哑光圆块黏土马尔济斯 |
| rourou-8-pvc.png | 简洁PVC豆豆眼马尔济斯 |
| overview-3.png | 3600×900，8款编号总览 |
| pairs-3.png | 1800×1320，10+7、12+8配对 |

过程原图在 round3/clay-steps/ 与 round3/process/。四份 *-process.json 保留每次prompt、参考角色、原始路径、问题、修正原因、效果和剩余不足；尺寸与SHA见 round3/verification.json。主要修正：10桐叶；11桐叶与比例；12比例与桐叶；13比例；14蝴蝶换桐叶；15长裙改长裤、三渲二色块、花胸针换桐叶。狗两款首稿满足方向，没有额外重画。

相似度评估：11/12的月牙笑眼最明确，但闭眼隐藏具体眼型，仍属符号化联想；10/13清冷半眯、14/15偏通用手办脸，身份辨识较弱。风格化画法通过自检，不代表先生已批准神似程度。

统一飞书档案：https://lcnqs3974j2m.feishu.cn/docx/ZZfkdTmMwoXuZMxswYHcqYRinkd 。第一轮、第二轮、找回的原始过程图及第三轮均在同一文档，包含原图、退回原因、渐进步骤、完整提示词附件；上传队列与逐项回执位于 feishu-archive/。第三轮反向强调照片写实与服装复制的问题，历史说明保留当时观点并注明后续退回。

未执行正式分层、动作、小尺寸或动画；本次没有修改前端文件、chibi/、pet/ 与 rig.json。仍停在选款阶段。


## 第六批：小桐定稿 + 肉肉

2026-10-28，内置 image_gen 多线程生成；正式素材共155张PNG，14组10fps动作预览。旧宠物已备份至 source/backup-batch6/pet/；仅本批素材改动，前端接入由 Claude 负责。

| 目录 | 文件清单 |
|---|---|
| xiaotong/ | sheet.png（2048×1024）、full.png（1024×1024）、avatar-256.png（256×256） |
| xiaotong/pose/ | idle、hello、happy、think、read、reply、write、card、listen、mic、heart、cake、gift、shh、sleep、hug-rourou，均.png、1024×1024透明 |
| xiaotong/bust/ | gaze-c/l/r/u/d/ul/ur/dl/dr、blink-1/2、talk-1/2/3、hello、happy、think、card，均.png、1024×1024透明 |
| xiaotong/anim/ | idle、wave、happy、heart、sign各01–08.png；think、nod、talk各01–06.png；give-card/01–10.png |
| pet/ | sheet.png（2048×1024）；idle、wave、think、sleep、cheer、card、listen、mic、heart、lick，各.png和-256.png |
| pet/anim/ | idle、wag、lick各01–06.png；hop/01–07.png；sleep/01–04.png |

肉肉hop由8减为7帧，其他无缺失。小桐idle与wave复用闭合端点，idle04/06为对称半眨眼，分别6/7幅独立画面。全身接地脚底小桐940、肉肉动画870；跳跃按预定离地10–20px，最终校验无超过4px的非预期偏差。尺寸和真实透明通道检查0问题。

优先复审肉肉hop04–06、wag04，以及小桐idle07、wave03/06、happy05、give-card07–09。半身眨眼/说话的肩胸仍有约2.52%–2.75%像素灰度差>20，尚未达到严格的仅眼嘴像素变化。图像存在轻微生成重绘漂移，不代表人工审美已批准。

检查件：source/batch6/contact-xiaotong-poses.png、contact-xiaotong-bust.png、contact-rourou.png；preview/下14组角色动作GIF。完整文件清单见 source/batch6/delivered-files.json；尺寸/alpha/bbox/脚底/SHA-256见 verification.json；减帧、弱项与复审结论见 delivery-report.md。逐张提示词、原生稿、退回稿和导出过程保留在各线程子目录。
