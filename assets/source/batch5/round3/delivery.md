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
