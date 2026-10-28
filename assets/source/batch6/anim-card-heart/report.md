# 小桐 give-card / heart 动画交付

使用内置 image_gen，以小桐 sheet 定稿图先生成 give-card01，再基于01逐张编辑；heart01基于give-card01，其他heart帧基于heart01。

- give-card：10/10帧；heart：8/8帧。无减帧，无复制静帧，无插值造帧。
- 每帧原生PNG及提示词记录保留在本目录；交付目录均1024×1024真alpha。
- 依任务要求做等比尺寸归一和居中对齐；alpha>12包围盒头顶y91、脚底y940，组内脚底偏差0px。bbox尺寸无剧烈突变。
- 两组10fps GIF位于上级preview目录；拼板位于本目录。
- 肉眼审查：脸、服装、头发、发夹保持可辨一致；give-card07–09卡片宽度/透视存在轻微非单调变化，是本组连续性弱项。heart03–04指节与合心过渡有轻微变化。
- 此为生成与技术/初步视觉检查，不代表先生approved。
