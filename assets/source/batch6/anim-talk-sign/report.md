# 小桐 talk / sign 动画交付

- 内置 image_gen，逐帧单独生成：talk 6/6、sign 8/8；无减帧、无静帧复制、无插值假帧。
- 身份与服装母版：`assets/xiaotong/sheet.png`。各组第2帧起均基于第1帧编辑。
- talk 第1次生成带背景光晕，保留在 `talk-01-native.png` 作为未采用稿；使用 image_gen 去背景后的清稿作为正式基准。
- 原生输出保存在本目录；按完整主体包围盒等比例缩放并平移到1024×1024画布。仅做导出、缩放、平移，未用代码重画人物。透明通道来自 image_gen。
- 14张均1024×1024 RGBA，alpha范围0–255，包围盒脚底全部y=940（alpha>0与alpha>12结果一致）。talk头顶91，sign头顶231，坐姿未放大填满画布。
- talk包围盒宽329–337px，变化主要为手势及发丝；sign宽310–313px。无突然体型缩放。
- 肉眼检查拼板：角色身份、白花领、珍珠扣、发夹铃铛和裙装一致；talk/05与06比基准略宽，sign/05抬眼笑时脸部变化最大，属本组优先审查帧。手部与细节存在生成式轻微变化，未声称逐像素动画锁定。
- 动画预览：`source/batch6/preview/xiaotong-talk.gif`、`xiaotong-sign.gif`，各10fps、循环。
- `verification.json`为本线程14张记录；`outputs.json`记录生成原始路径；`plan.json`为中文动作计划。
- 本线程技术检查完成；最终人工视觉批准由先生审阅后确定。
