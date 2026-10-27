/* 演示数据：全部为虚构。
   页面只通过下方 api 读写数据；之后接入数据库 / MCP 时只需替换 api 的实现。 */
(function () {
  const PLATFORMS = {
    wb: { name: '微博', short: '微', color: '#338BC9' },
    dy: { name: '抖音', short: '抖', color: '#4F9BD1' },
    xhs: { name: '小红书', short: '红', color: '#A1CFF0' },
    mp: { name: '小程序', short: '程', color: '#C4DFF3' }
  };

  const overview = {
    syncedAt: '2 小时前',
    totalFans: 12864300,
    todayNew: 12340,
    todayComments: 1286,
    platforms: [
      { id: 'wb', fans: 6120000, delta: 6420 },
      { id: 'dy', fans: 4380000, delta: 3980 },
      { id: 'xhs', fans: 1710000, delta: 1660 },
      { id: 'mp', fans: 654300, delta: 280 }
    ],
    trend: [ // 近 7 天互动量（千）与正向情绪占比
      { d: '10.22', v: 38, pos: 0.82 }, { d: '10.23', v: 42, pos: 0.84 },
      { d: '10.24', v: 40, pos: 0.81 }, { d: '10.25', v: 55, pos: 0.86 },
      { d: '10.26', v: 61, pos: 0.88 }, { d: '10.27', v: 58, pos: 0.87 },
      { d: '10.28', v: 72, pos: 0.89 }
    ],
    fiveThings: [
      { t: '期待《云秀行》下周播出', n: 312 },
      { t: '想听宋一梦一人两角的幕后', n: 241 },
      { t: '问肉肉最近好不好', n: 198 },
      { t: '分享考试、面试前的紧张', n: 156 },
      { t: '希望多一些日常 vlog', n: 133 }
    ]
  };

  const keywords = [
    { w: '云秀行', n: 312 }, { w: '宋一梦', n: 241 }, { w: '肉肉', n: 198 }, { w: '加油', n: 176 },
    { w: '面试', n: 156 }, { w: 'vlog', n: 133 }, { w: '陪伴', n: 121 }, { w: '演技', n: 108 },
    { w: '插画', n: 86 }, { w: '生日', n: 74 }, { w: '片场', n: 69 }, { w: '毕业', n: 52 },
    { w: '手账', n: 41 }, { w: '直播', n: 38 }, { w: '古装', n: 33 }
  ];

  const tiers = [
    { id: 'chuyu', name: '初遇', desc: '近 30 天新来的朋友', pct: 34, color: '#C4DFF3' },
    { id: 'changban', name: '常伴', desc: '持续回访、常来互动', pct: 38, color: '#A1CFF0' },
    { id: 'changqing', name: '长情', desc: '陪伴三年以上', pct: 21, color: '#4F9BD1' },
    { id: 'gongchuang', name: '共创', desc: '投稿作品、参与活动', pct: 7, color: '#3076A8' }
  ];

  const audience = {
    gender: [{ k: '女', v: 78 }, { k: '男', v: 22 }],
    age: [{ k: '18 岁以下', v: 6 }, { k: '18–24', v: 41 }, { k: '25–30', v: 32 }, { k: '31–40', v: 16 }, { k: '40+', v: 5 }],
    region: [{ k: '广东', v: 13 }, { k: '江苏', v: 9 }, { k: '浙江', v: 8 }, { k: '北京', v: 7 }, { k: '四川', v: 6 }]
  };

  const personas = [
    { name: '剧集粉', pct: 46, want: '期待新剧、讨论角色与剧情', tip: '播出期多聊角色幕后' },
    { name: '成长粉', pct: 27, want: '从她身上获得努力的力量', tip: '分享真实的低谷与坚持' },
    { name: '创作者', pct: 9, want: '作品被看见、被回应', tip: '定期点评几件投稿' },
    { name: '生活粉', pct: 18, want: '想看日常、看肉肉', tip: '一张生活照就是回应' }
  ];

  const insightsTips = [
    '本周「成长粉」留言增长 23%，多与考试、面试有关，适合录一段鼓励语音。',
    '《云秀行》播出前一周讨论量最高，可提前准备 2–3 条角色幕后。',
    '共创粉丝虽然只占 7%，贡献了 41% 的高赞内容，值得每周固定回应。'
  ];

  // 留言：cat = 分类；prio = 是否高优
  const comments = [
    { id: 'c1', fan: '晚风来信', av: '晚', p: 'wb', tier: 'changqing', cat: '情感', prio: true, likes: 326, time: '09:42',
      text: '从大学宿舍听你的歌，到现在一个人在新的城市工作。昨天加班回家的路上又听到那首歌，好像又有了往前走的力气。谢谢你，一直在。',
      sum: '加班路上被一首歌治愈，谢谢一直在',
      why: '长评 · 近 30 天 4 天有互动 · 尚未回应',
      days: 1286, total: 86, firstSeen: '2023.04',
      history: ['2023.04 第一次留言', '2025.11 分享第一份工作', '2026.10 分享新城市生活'],
      draft: '看到你说加班回家的路上又听到那首歌，那条路应该挺长的吧。新城市一切从头开始不容易，能被一首歌陪着走一段，我也很开心。照顾好自己，按时吃饭，慢慢来。' },
    { id: 'c2', fan: '橘子汽水', av: '橘', p: 'dy', tier: 'changban', cat: '工作学业', prio: true, likes: 189, time: '08:16',
      text: '最近在准备一场很重要的面试，紧张得睡不着。你第一次站上舞台之前，也会害怕吗？想听听你是怎么鼓励自己的。',
      sum: '面试前紧张，问她怎么鼓励自己',
      why: '具体提问 · 同类问题本周 27 次',
      days: 236, total: 24, firstSeen: '2026.03',
      history: ['2026.03 第一次留言', '2026.09 分享备考心情', '2026.10 连续回来互动'],
      draft: '会怕的。【这里可以写一个你自己真实的紧张时刻】后来我发现，紧张是因为在乎。把注意力放回眼前要做的第一件小事，其他的交给已经准备好的自己。面试加油！' },
    { id: 'c3', fan: '一颗柠檬糖', av: '柠', p: 'dy', tier: 'changban', cat: '角色讨论', prio: false, likes: 2341, time: '昨天',
      text: '看《书卷一梦》宋一梦切换的那场戏，前一秒还在笑后一秒眼神就变了，想知道你是怎么找到两个状态的开关的？',
      sum: '想知道宋一梦一人两角怎么切换',
      why: '本周点赞最高的提问',
      days: 412, total: 37, firstSeen: '2025.09',
      history: ['2025.09 第一次留言', '2026.02 参与剧集讨论', '2026.10 提问角色切换'],
      draft: '谢谢你看得这么细！那场戏我给两个状态各找了一个【身体上的小习惯】，切换的时候先换身体，眼神就跟着变了。之后找机会好好讲讲这场戏。' },
    { id: 'c4', fan: '小岛放映室', av: '岛', p: 'xhs', tier: 'gongchuang', cat: '创作', prio: false, likes: 1204, time: '昨天',
      text: '把这几年你舞台上望向观众的瞬间画成了一组插画，名字叫《我们都在》。希望这份小小的创作，能让你看到台下的光。',
      sum: '投稿插画《我们都在》8 张',
      why: '原创插画投稿 · 作者已授权展示',
      days: 682, total: 51, firstSeen: '2024.12',
      history: ['2024.12 第一张舞台插画', '2025.08 参与纪念日共创', '2026.10 投稿《我们都在》'],
      draft: '一张一张看完了，《我们都在》这个名字取得真好。谢谢你把这些瞬间留下来，台下的光我一直看得见。' },
    { id: 'c5', fan: '小满', av: '满', p: 'dy', tier: 'changqing', cat: '情感', prio: true, likes: 876, time: '昨天',
      text: '高考那年是你的剧陪我熬过来的，今天收到研究生录取通知了，第一个想告诉的人是你。',
      sum: '收到研究生录取，第一个想告诉她',
      why: '人生节点分享 · 尚未回应',
      days: 1530, total: 64, firstSeen: '2022.06',
      history: ['2022.06 高考前第一次留言', '2024.09 分享大学生活', '2026.10 研究生录取'],
      draft: '恭喜你！从高考到研究生，这一路你真的很棒。谢谢你第一个告诉我，新的阶段也要好好照顾自己，继续发光。' },
    { id: 'c6', fan: '南方有嘉木', av: '木', p: 'wb', tier: 'changban', cat: '心愿', prio: false, likes: 403, time: '昨天',
      text: '今天带我家猫看你的剧，它盯着屏幕看了十分钟。想问问肉肉最近好吗？',
      sum: '问肉肉最近好不好',
      why: '同类问候本周 198 次',
      days: 301, total: 19, firstSeen: '2026.01',
      history: ['2026.01 第一次留言', '2026.10 问候肉肉'],
      draft: '肉肉最近很好，就是越来越会撒娇了。替我摸摸你家的小猫！' },
    { id: 'c7', fan: '月亮邮差', av: '月', p: 'wb', tier: 'changqing', cat: '角色讨论', prio: false, likes: 542, time: '前天',
      text: '陪你走过了这么多个季节。如果给五年前的自己寄一封信，你最想写下哪一句话？',
      sum: '想知道她会给五年前的自己写什么',
      why: '长期陪伴 · 适合在采访或 vlog 中回应',
      days: 1602, total: 104, firstSeen: '2022.06',
      history: ['2022.06 第一次互动', '2024.06 参加周年活动', '2026.10 分享陪伴纪念'],
      draft: '这个问题我想了很久。【写下你真正想对五年前的自己说的一句话】谢谢你陪我走过这么多个季节。' },
    { id: 'c8', fan: '纸飞机', av: '纸', p: 'xhs', tier: 'gongchuang', cat: '创作', prio: false, likes: 688, time: '前天',
      text: '和几位朋友一起做了一本小小的歌词手账。每一页都是一段被你的作品陪伴过的日子，想把这份记录送给你。',
      sum: '和朋友一起做了歌词手账',
      why: '共创投稿 · 4 件作品',
      days: 415, total: 32, firstSeen: '2025.09',
      history: ['2025.09 第一次分享手账', '2026.05 参加线上共创', '2026.10 手账合集'],
      draft: '翻了好几遍，每一页都好用心。谢谢你们把这些日子认真记下来，我会好好收着。' },
    { id: 'c9', fan: '春天的回声', av: '春', p: 'mp', tier: 'chuyu', cat: '情感', prio: false, likes: 12, time: '前天',
      text: '上周偶然听到了你的现场，被那一刻的真诚打动了。第一次来到这里，很高兴认识你。',
      sum: '第一次来，被现场打动',
      why: '新朋友的第一条留言',
      days: 7, total: 2, firstSeen: '2026.10',
      history: ['2026.10 第一次留言'],
      draft: '欢迎你来！很高兴认识你，以后慢慢了解我的作品，我们常见。' },
    { id: 'c10', fan: '山海不遥', av: '山', p: 'mp', tier: 'changqing', cat: '心愿', prio: false, likes: 233, time: '前天',
      text: '上周的线上观影活动很温暖，大家一起弹幕的感觉像回到了宿舍。希望以后还能有。',
      sum: '希望再办线上观影',
      why: '参加过 5 次活动',
      days: 1120, total: 58, firstSeen: '2023.09',
      history: ['2023.09 第一次参加活动', '2026.10 线上观影反馈'],
      draft: '我也很喜欢那天的感觉！下次有机会，我们再一起看。' }
  ];

  const risky = [
    { id: 'r1', p: 'wb', kind: '恶意评论', level: '中', text: '演技就那样，别再营业了，看着就烦。', advice: '属于情绪化差评，没有具体威胁，建议不回应。', time: '10:21' },
    { id: 'r2', p: 'dy', kind: '越界私信', level: '高', text: '我知道你明天在哪个片场，我会在门口等你，你不出来我就一直等。', advice: '涉及行程与人身安全，建议截图留证，转交工作室，必要时报警。', time: '07:55' }
  ];

  const dms = [
    { id: 'd1', fan: '晴川', av: '晴', p: 'wb', text: '今天是我和男朋友在一起一周年，我们是看你的剧认识的，想跟你说声谢谢。', time: '11:02' },
    { id: 'd2', fan: '鹿角', av: '鹿', p: 'xhs', text: '想问问《云秀行》里范云的那身衣服是不是有特别的设计含义？', time: '09:30' }
  ];

  // 生日：memo 是 AI 从历史互动里整理的「记得的事」，drafts 是按语气起草的祝福
  const birthdays = [
    { id: 'b1', fan: '晚风来信', av: '晚', p: 'wb', tier: 'changqing', date: '今天', qualified: true, days: 1286, age: '26 岁',
      memo: ['大学宿舍里第一次听你的歌', '去年搬到新城市工作', '昨天留言说加班回家路上被治愈'],
      drafts: {
        warm: '晚风，生日快乐。记得你说从大学宿舍开始听我的歌，现在一个人在新的城市也走得很好。新的一岁，别太累，加班回家的路上，也有我在。',
        light: '晚风！生日快乐呀～听说你最近天天加班，今天必须给自己放个假，蛋糕要吃最大块的那种！',
        short: '晚风，生日快乐。谢谢你这 1,286 天，新的一岁也要好好的。'
      } },
    { id: 'b2', fan: '橘子汽水', av: '橘', p: 'dy', tier: 'changban', date: '今天', qualified: false, days: 236, age: '19 岁',
      memo: ['每条视频都会留言', '最喜欢宋一梦这个角色'],
      drafts: {
        warm: '橘子汽水，生日快乐。谢谢你每一次都来留言，新的一岁，愿你像宋一梦一样勇敢。',
        light: '生日快乐橘子汽水！今天的你也是冒着气泡的快乐汽水～',
        short: '橘子汽水，生日快乐，新的一岁继续闪闪发光。'
      } },
    { id: 'b3', fan: '小岛放映室', av: '岛', p: 'xhs', tier: 'gongchuang', date: '10.30', qualified: true, days: 682, age: '23 岁',
      memo: ['画过 12 幅角色插画', '《长安》的手绘海报被转发 3,000 次'],
      drafts: {
        warm: '小岛，生日快乐。你画的每一幅我都看过，《长安》那张海报我存在手机里很久。新的一岁，继续画你喜欢的东西。',
        light: '小岛生日快乐！今年的生日礼物，是我偷偷收藏了你的全部插画（不是）',
        short: '小岛，生日快乐，谢谢你的每一笔。'
      } },
    { id: 'b4', fan: '纸飞机', av: '纸', p: 'mp', tier: 'gongchuang', date: '11.02', qualified: false, days: 415, age: '21 岁',
      memo: ['做过一期角色手账', '首播日会到场应援'],
      drafts: {
        warm: '纸飞机，生日快乐。谢谢你的手账，也谢谢你一直把我们的故事认真记下来。',
        light: '纸飞机生日快乐！愿你今年飞得又高又远～',
        short: '纸飞机，生日快乐。'
      } }
  ];
  // 未达到「亲自祝福」条件的粉丝，在生日当天 0 点自动收到统一祝福
  const bdayAuto = { today: 1286, week: 8420, text: '生日快乐！谢谢你在这里，愿你新的一岁被温柔以待。—— 一桐' };

  // 幸运抽奖（演示：参与者均为虚构昵称）
  const lottery = {
    sources: [
      { id: 'L1', p: 'wb', title: '《云秀行》定档海报 · 转发抽奖', total: 18642, at: '10.25 发布' },
      { id: 'L2', p: 'dy', title: '片场 vlog · 评论区抽奖', total: 9311, at: '10.26 发布' },
      { id: 'L3', p: 'mp', title: '小程序 · 首播应援打卡', total: 4260, at: '进行中' }
    ],
    rules: [
      { id: 'follow', name: '关注满 30 天', cut: 0.18, on: true },
      { id: 'bot', name: '排除疑似机器号、营销号', cut: 0.09, on: true },
      { id: 'risk', name: '排除有越界记录的账号', cut: 0.01, on: true },
      { id: 'repeat', name: '近 3 个月中过奖的不再参与', cut: 0.02, on: true },
      { id: 'once', name: '同一人只算一次', cut: 0.06, on: true }
    ],
    prizes: [
      { id: 'sign', name: '亲笔签名照', n: 3 },
      { id: 'card', name: '定制纪念小卡', n: 10 },
      { id: 'voice', name: '专属语音祝福', n: 5 }
    ],
    pool: ['南风知我意', '月亮邮递员', '一颗柚子', '山海有归期', '橙子味的风', '小熊软糖', '今天也很乖', '雾里看花', '星星打烊了', '鲸落', '松间照', '岛屿心情', '半糖去冰', '慢慢来', '云朵收藏家', '十一月的雨', '夏日限定', '温柔本身', '一只小狐狸', '晚安喵', '海盐芝士', '风吹麦浪', '白鹭', '青柠薄荷', '人间小满', '春日信笺', '栀子', '小鹿乱撞', '日落大道', '桃桃乌龙']
  };

  const applicants = [
    { id: 'a1', name: '星河入梦', score: 95, risk: '低', note: '答题全对，填写了喜欢的三部作品' },
    { id: 'a2', name: '一只鹿', score: 88, risk: '低', note: '主要关注剧集讨论' },
    { id: 'a3', name: 'user_93821', score: 40, risk: '高', note: '答题多处错误，近期在其他平台发布过攻击性言论' },
    { id: 'a4', name: '青柠薄荷', score: 82, risk: '低', note: '共创方向，附了一张插画' },
    { id: 'a5', name: '路过的风', score: 61, risk: '中', note: '答题一般，建议人工看一下' }
  ];

  const ideas = [
    { t: '「片场的一天」vlog', why: '想看日常的留言本周 133 条' },
    { t: '解析宋一梦切换的那场戏', why: '本周最高赞提问 2,341 赞' },
    { t: '给考生录一段鼓励语音', why: '考试、面试相关留言增长 23%' }
  ];

  const calendar = [
    { d: 3, tag: '播出', t: '《云秀行》首播' }, { d: 1, tag: '建议', t: '首播前预热：角色海报' },
    { d: 8, tag: '建议', t: '幕后 vlog' }, { d: 12, tag: '活动', t: '线上观影' }, { d: 20, tag: '建议', t: '粉丝问答' }
  ];

  const cardThemes = [
    { id: 'chuyu', name: '初遇', line: '把这次相遇，留成纪念。', img: 'assets/cards/card-chuyu.webp' },
    { id: 'changban', name: '常伴', line: '谢谢你，常常来看看。', img: 'assets/cards/card-changban.webp' },
    { id: 'changqing', name: '长情', line: '一起走过的日子，值得好好收藏。', img: 'assets/cards/card-changqing.webp' },
    { id: 'gongchuang', name: '共创', line: '谢谢你，让这个故事多了一种表达。', img: 'assets/cards/card-gongchuang.webp' }
  ];

  const portraitStyles = [
    { id: 'watercolor', name: '水彩', img: 'assets/portraits/portrait-watercolor.webp', filter: 'saturate(.75) contrast(.95) brightness(1.08)' },
    { id: 'film', name: '蓝调胶片', img: 'assets/portraits/portrait-film.webp', filter: 'sepia(.15) hue-rotate(185deg) saturate(.9) contrast(1.05)' },
    { id: 'costume', name: '剧集妆造', img: 'assets/portraits/portrait-costume.webp', filter: 'saturate(.85) brightness(1.04)' }
  ];

  // 涨粉看板：按天生成各平台新增粉丝（确定性的演示数据）
  function series(days, base, wave, seed) {
    const out = [];
    for (let i = 0; i < days; i++) {
      const t = i / days, bump = i > days * 0.8 ? 1 + (i - days * 0.8) / (days * 0.2) * 0.6 : 1;
      out.push(Math.round(base * bump * (1 + wave * Math.sin(i * 0.9 + seed) + 0.12 * Math.sin(i * 2.3 + seed * 2) + 0.25 * t)));
    }
    return out;
  }
  const label = (days) => Array.from({ length: days }, (_, i) => { const d = new Date(2026, 9, 28 - (days - 1 - i)); return (d.getMonth() + 1) + '.' + d.getDate(); });
  const growth = {};
  [7, 30, 90].forEach((n) => {
    growth[n] = {
      labels: label(n),
      wb: series(n, 4800, 0.18, 1), dy: series(n, 3200, 0.3, 2), xhs: series(n, 1300, 0.22, 3), mp: series(n, 240, 0.15, 4),
      prevRatio: { wb: 0.86, dy: 0.71, xhs: 0.92, mp: 1.08 } // 上一周期 / 本周期，用于计算环比
    };
  });

  // 分层运营：转化路径、五类粉丝、流失预警（仅内部可见）
  const funnel = [
    { stage: '新粉', n: 4370000, desc: '近 30 天新关注', next: '18% 在 30 天内变为活跃粉' },
    { stage: '活跃粉', n: 2860000, desc: '每月至少 3 天有互动', next: '9% 在 90 天内变为核心粉' },
    { stage: '核心粉', n: 920000, desc: '陪伴一年以上且持续互动', next: '季度留存 86%' },
    { stage: '稳固', n: 790000, desc: '连续两个季度保持互动', next: '' }
  ];
  const moves = [
    { from: '新粉', to: '活跃粉', acts: ['7 天内给第一条留言一个回应', '送一张「初遇」卡', '推荐一部入坑作品和一个活动'] },
    { from: '活跃粉', to: '核心粉', acts: ['记住 TA 的重要时刻并回应', '邀请参与共创征集', '「常伴」卡与生日祝福'] },
    { from: '核心粉', to: '稳固', acts: ['周年纪念与「长情」卡', '私域直播、线上小会优先邀请', '30 天未回访时主动关怀'] }
  ];
  const segments = [
    { name: '新粉', pct: 34, need: '认识她、找到入口', strategy: '欢迎语 + 作品导览，第一条留言尽快得到回应', metric: '7 日留存', color: '#C4DFF3' },
    { name: '老粉', pct: 29, need: '被记得、有情感连接', strategy: '在生日、周年这些节点回应，送纪念卡', metric: '月回访率', color: '#A1CFF0' },
    { name: '事业粉', pct: 17, need: '关心她的作品选择与成长', strategy: '分享角色幕后、表演思考，回应专业讨论', metric: '长评数量', color: '#4F9BD1' },
    { name: '数据粉', pct: 13, need: '为作品出力、看到成果', strategy: '引导到作品口碑和正向讨论，同步官方数据并致谢；不做个人排名', metric: '正向讨论量', color: '#3076A8' },
    { name: '氪金粉', pct: 7, need: '支持被看见', strategy: '用感谢和优先体验回馈，不诱导消费，未成年人不做付费引导', metric: '满意度、投诉率', color: '#235D86' }
  ];
  const churn = { core: 1240, desc: '位核心粉近 30 天没有回访', reasons: ['剧集空窗期', '最近一次留言未被回应', '转向其他平台活跃'] };

  const DATA = { PLATFORMS, growth, funnel, moves, segments, churn, overview, keywords, tiers, audience, personas, insightsTips, comments, risky, dms, birthdays, bdayAuto, lottery, applicants, ideas, calendar, cardThemes, portraitStyles };

  // —— 本地状态（仅当前浏览器，演示用）——
  const KEY = 'yt-connect-demo-v1';
  let state = { replied: {}, sent: [], cards: [], approved: {}, blessed: {}, draws: [] };
  try { const s = localStorage.getItem(KEY); if (s) state = Object.assign(state, JSON.parse(s)); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} };

  // —— 数据接口：之后替换为数据库 / MCP 调用 ——
  const wait = (v) => new Promise((r) => setTimeout(() => r(v), 120));
  window.api = {
    data: DATA,
    state,
    getOverview: () => wait(overview),
    searchComments: ({ cat, kw, q } = {}) => wait(comments.filter((c) =>
      (!cat || cat === '全部' || (cat === '高优' ? c.prio : c.cat === cat)) &&
      (!kw || c.text.includes(kw) || c.sum.includes(kw)) &&
      (!q || (c.fan + c.text).includes(q)))),
    getComment: (id) => comments.find((c) => c.id === id),
    sendReply: ({ id, text, voice, channel, card }) => {
      state.replied[id] = true;
      state.sent.unshift({ id, text, voice: !!voice, channel, card: card || null, at: Date.now() });
      save();
      return wait(true);
    },
    saveCard: (card) => { state.cards.unshift(card); save(); return wait(card); },
    approve: (id, ok) => { state.approved[id] = ok ? 'ok' : 'no'; save(); return wait(true); },
    // 祝福：mode = self（亲自）/ auto（统一）；payload 含文字、是否有语音、定时
    bless: (id, mode, payload) => { state.blessed[id] = mode; if (payload) (state.blessLog = state.blessLog || []).unshift({ id, ...payload, at: Date.now() }); save(); return wait(true); },
    // 抽奖：随机种子 + 时间戳公示，便于事后核验
    draw: ({ source, prize, n, eligible }) => {
      const seed = Math.random().toString(16).slice(2, 10).toUpperCase();
      const pool = [...lottery.pool].sort(() => Math.random() - 0.5);
      const winners = pool.slice(0, n).map((name, i) => ({ name, id: 'U' + (100000 + Math.floor(Math.random() * 899999)), notified: false }));
      const rec = { source, prize, n, eligible, seed, winners, at: Date.now() };
      state.draws.unshift(rec); save(); return wait(rec);
    },
    notifyWinners: (i) => { state.draws[i].winners.forEach((w) => (w.notified = true)); save(); return wait(true); },
    reset: () => { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); }
  };
})();
