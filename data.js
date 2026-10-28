/* 演示数据：全部为虚构。
   页面只通过下方 api 读写数据；之后接入数据库 / MCP 时只需替换 api 的实现。 */
(function () {
  const PLATFORMS = {
    wb: { name: '微博', short: '微', color: '#3C9CFA' },
    dy: { name: '抖音', short: '抖', color: '#8E9CEB' },
    xhs: { name: '小红书', short: '红', color: '#7FD0FF' },
    mp: { name: '小程序', short: '程', color: '#C9C4F2' }
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
    { id: 'chuyu', name: '初遇', desc: '近 30 天新来的朋友', pct: 34, color: '#D6EBFF' },
    { id: 'changban', name: '常伴', desc: '持续回访、常来互动', pct: 38, color: '#C9C4F2' },
    { id: 'changqing', name: '长情', desc: '陪伴三年以上', pct: 21, color: '#7FD0FF' },
    { id: 'gongchuang', name: '共创', desc: '投稿作品、参与活动', pct: 7, color: '#3C9CFA' }
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

  // 小卡版式：拼贴手账系列（撕纸边 + 胶片框 + 胶带 + 金属心 + 手写签名），每个配色一套
  const cardLayouts = [
    { id: 'classic', name: '经典', desc: '留白 + 寄语', sw: ['#EAF4FC', '#A1CFF0'] },
    { id: 'aqua', name: '桐铃水蓝', desc: '应援色 · 雪花', sw: ['#EAF4FC', '#3B9AE1'] },
    { id: 'mist', name: '雾蓝花信', desc: '干花 · 薰衣草', sw: ['#E7EAF2', '#7F8FB5'] },
    { id: 'cafe', name: '午后绿', desc: '街角 · 胶片', sw: ['#EFEBDD', '#8FA27F'] },
    { id: 'daisy', name: '夏日雏菊', desc: '阳光 · 雏菊', sw: ['#EEF2E4', '#7FA37A'] },
    { id: 'race', name: '赛道橙', desc: '棋盘格 · 23 号', sw: ['#F2E9DC', '#E2662C'] }
  ];

  // 平台新发图：小卡 Agent 监听她自己账号的新发布，挑出适合做卡的图并给出建议
  const newPosts = [
    { id: 'np1', p: 'wb', time: '2 小时前', text: '周末和肉肉晒太阳，今天的风是甜的。', imgs: ['assets/portraits/portrait-watercolor.webp', 'assets/portraits/portrait-film.webp', 'assets/cards/card-changban.webp'], likes: 186000, cmts: 12800,
      ai: { pick: 0, layout: 'cafe', hand: '周末快乐呀', series: '午后绿 · 周末', limit: 500, who: '评论过这条的粉丝中随机 50 位', why: '户外暖光、画面偏绿，适合「午后绿」版式；肉肉出镜，收藏意愿高' } },
    { id: 'np2', p: 'xhs', time: '昨天', text: '《云秀行》定妆，第一次穿这么多层的衣服。', imgs: ['assets/portraits/portrait-costume.webp', 'assets/cards/card-chuyu.webp'], likes: 92000, cmts: 6100,
      ai: { pick: 0, layout: 'mist', hand: '首播见', series: '雾蓝花信 · 定妆', limit: 300, who: '首播当晚线上观影的粉丝', why: '剧集妆造 + 冷色调，配「雾蓝花信」；建议首播当天作为观影纪念发放' } },
    { id: 'np3', p: 'dy', time: '3 天前', text: '片场的夏天，西瓜管够。', imgs: ['assets/portraits/portrait-film.webp', 'assets/cards/card-changqing.webp'], likes: 240000, cmts: 18500,
      ai: { pick: 0, layout: 'daisy', hand: '夏天快乐', series: '夏日雏菊 · 片场', limit: 800, who: '本周第一次评论的新粉', why: '笑容明亮、氛围轻松，适合给新粉做「初遇」纪念' } }
  ];

  // 发卡系统：在什么场景发、怎么编号限量、粉丝端怎么收藏，以及护栏
  const cardIssue = {
    rules: [
      { id: 'bday', name: '粉丝生日当天', desc: '生日祝福自动附一张卡', on: true, n: 23 },
      { id: 'anniv', name: '陪伴纪念日', desc: '关注满 100 / 365 / 1000 天', on: true, n: 41 },
      { id: 'reply', name: '回复留言时附卡', desc: '高优留言回复可附卡', on: true, n: 36 },
      { id: 'post', name: '新发图联动', desc: '发图后 24 小时内互动的粉丝中抽取', on: true, n: 50 },
      { id: 'lucky', name: '幸运儿抽奖', desc: '抽中即得限定编号卡', on: false, n: 10 }
    ],
    series: [
      { name: '午后绿 · 周末', layout: 'cafe', limit: 500, sent: 128 },
      { name: '雾蓝花信 · 定妆', layout: 'mist', limit: 300, sent: 0 },
      { name: '桐铃水蓝 · 常驻', layout: 'aqua', limit: 2000, sent: 1264 }
    ],
    month: { sent: 1392, open: 91, keep: 78 },
    guard: ['每张卡都有唯一编号，粉丝存进「我的纪念册」', '不可交易、不可转卖，平台不提供二级市场', '发放不看消费：不和购买、打榜、充值挂钩', 'AI 处理过的照片自动标「AI 生成」', '每次发出前由你确认，不会自动群发']
  };

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
    { name: '事业粉', pct: 17, need: '关心她的作品选择与成长', strategy: '分享角色幕后、表演思考，回应专业讨论', metric: '长评数量', color: '#4AA5FF' },
    { name: '数据粉', pct: 13, need: '为作品出力、看到成果', strategy: '引导到作品口碑和正向讨论，同步官方数据并致谢；不做个人排名', metric: '正向讨论量', color: '#1A6FD0' },
    { name: '氪金粉', pct: 7, need: '支持被看见', strategy: '用感谢和优先体验回馈，不诱导消费，未成年人不做付费引导', metric: '满意度、投诉率', color: '#235D86' }
  ];
  const churn = { core: 1240, desc: '位核心粉近 30 天没有回访', reasons: ['剧集空窗期', '最近一次留言未被回应', '转向其他平台活跃'] };

  // 分层运营中心：转化引擎 / 五类粉丝 / 陪伴值 / 流失预警 / 合规护栏（全部为演示数据）
  const fanOps = {
    engine: [
      { from: '新粉', to: '活跃粉', pool: 186400, rate: 18, goal: 22,
        trigger: '关注 ≤ 30 天，且已留言或点赞 ≥ 1 次',
        steps: [['D0', '第一条留言 24 小时内得到回应（AI 草稿，她确认）'], ['D3', '推送入坑导览：一部代表作 + 一个正在进行的活动'], ['D7', '仍有互动 → 自动送「初遇」电子卡']],
        metric: '30 日转活跃率', run: '给 1,286 位新粉回应第一条留言', act: 'reply' },
      { from: '活跃粉', to: '核心粉', pool: 42300, rate: 9, goal: 12,
        trigger: '近 30 天互动 ≥ 3 天，且有长评、投稿或连续 3 周互动',
        steps: [['每周', '从长评里挑 3 条亲自回复，记住 TA 提过的事'], ['节点', '生日、陪伴满 100 天送「常伴」卡'], ['每月', '邀请参与共创征集（剧照描述、海报、vlog 选题）']],
        metric: '90 日转核心率', run: '向 420 位活跃粉发出共创征集邀请', act: 'cocreate' },
      { from: '核心粉', to: '稳固', pool: 920000, rate: 86, goal: 90,
        trigger: '陪伴 ≥ 1 年，且近 60 天持续互动',
        steps: [['周年', '陪伴周年当天送「长情」卡 + 一句亲笔寄语'], ['每季', '私密直播 / 线上小会优先邀请'], ['预警', '30 天未回访 → 助手起草关怀，她确认后发出']],
        metric: '季度留存率', run: '给 1,240 位未回访核心粉发关怀', act: 'care' }
    ],
    types: [
      { id: 'new', name: '新粉', pct: 34, n: '437 万', color: '#C4DFF3',
        signals: ['关注 ≤ 30 天', '只看过 1–2 部作品', '提问多、留言短'],
        need: '认识她、找到入口，第一次留言被看见',
        do: ['第一条留言 24 小时内回应', '置顶「入坑导览」：代表作 + 角色 + 正在进行的活动', '欢迎语里给一个可以马上参与的小动作（猜台词、选海报）'],
        self: '每周亲自回 3 条新粉的第一条留言',
        avoid: '不要一上来推付费内容或打榜任务',
        kpi: [['7 日留存', '41%', '目标 50%'], ['30 日转活跃', '18%', '目标 22%']],
        ask: '帮我写一段给新粉的欢迎语', cta: ['看新粉留言', 'reply'] },
      { id: 'old', name: '老粉', pct: 29, n: '373 万', color: '#A1CFF0',
        signals: ['陪伴 ≥ 1 年', '在生日、周年节点固定出现', '会提起很早的作品'],
        need: '被记得，有长期的情感连接',
        do: ['生日、陪伴周年这些节点主动回应', '送「长情」卡，寄语里提到 TA 说过的具体的事', '分享只有老粉懂的回忆（旧剧花絮、早期合照）'],
        self: '每月一次「老朋友」专场回信',
        avoid: '不要只顾拉新而冷落；不要用模板化群发代替回应',
        kpi: [['月回访率', '68%', '目标 75%'], ['季度留存', '86%', '目标 90%']],
        ask: '帮我给陪伴 3 年以上的老粉写一封信', cta: ['送「长情」卡', 'cards'] },
      { id: 'data', name: '数据粉', pct: 13, n: '167 万', color: '#4AA5FF',
        signals: ['播出期集中转评赞', '关心播放量、热度', '常在超话做数据'],
        need: '为作品出力，看到努力有结果',
        do: ['把力气引导到作品口碑：长评、正向讨论、二创', '播出节点同步官方数据并真诚致谢', '设「好评安利」类活动替代刷量'],
        self: '剧集收官时亲自感谢大家的安利',
        avoid: '不做个人排名、不组织打榜刷量、不鼓励未成年人投票',
        kpi: [['正向讨论量', '2.3 万/周', '目标 3 万'], ['长评占比', '12%', '目标 18%']],
        ask: '帮我写一段播出期感谢大家安利的话', cta: ['看口碑讨论', 'reply'] },
      { id: 'pay', name: '氪金粉', pct: 7, n: '90 万', color: '#1A6FD0',
        signals: ['购买代言产品、周边', '参与线下活动', '常晒支持记录'],
        need: '支持被看见，被真诚感谢',
        do: ['用感谢和体验回馈：一句手写感谢、纪念卡', '活动中奖、互动权益与消费金额完全脱钩', '理性消费提示常驻'],
        self: '代言上线时感谢大家，同时提醒量力而行',
        avoid: '不按消费金额分级、不设消费门槛、未成年人不做任何付费引导',
        kpi: [['满意度', '4.7 / 5', '保持'], ['消费相关投诉', '0', '保持为 0']],
        ask: '帮我写一段感谢支持、同时提醒理性消费的话', cta: ['查看抽奖规则', 'lucky'] },
      { id: 'career', name: '事业粉', pct: 17, n: '219 万', color: '#235D86',
        signals: ['讨论剧本、角色、表演', '关注作品选择和口碑', '长评多、专业度高'],
        need: '看到她的作品选择和成长',
        do: ['分享角色幕后、表演思考、准备过程', '回应高质量的专业讨论，可以引用到 vlog', '新作官宣时讲清楚「为什么选这个角色」'],
        self: '每部剧一篇「角色手记」',
        avoid: '不回应拉踩、对比其他艺人的讨论',
        kpi: [['长评数量', '860/周', '目标 1,000'], ['专业讨论回应率', '23%', '目标 35%']],
        ask: '帮我把宋一梦这个角色的幕后整理成一篇手记', cta: ['看内容灵感', 'today'] }
    ],
    points: [
      ['日常留言', '+1', '每天最多 +3'], ['长评（100 字以上）', '+5', '被 AI 识别为认真讨论'], ['留言被她回应', '+3', '鼓励真诚表达'],
      ['共创投稿被采用', '+30', '插画、vlog 选题、剧照描述'], ['生日 / 周年签到', '+10', '每年一次'], ['参与公益应援', '+10', '按次计，不看金额'],
      ['购买、充值、打榜', '0', '消费与数据行为不计入陪伴值']
    ],
    levels: [['初遇', '0–99', '欢迎语 · 入坑导览'], ['常伴', '100–599', '生日祝福 · 「常伴」卡'], ['长情', '600+', '周年寄语 · 私密直播邀请'], ['共创', '有作品被采用', '署名展示 · 线上小会']],
    risk: [
      { lv: '高', n: 1240, who: '核心粉', sig: '近 30 天没有回访，此前每周都来', act: '助手起草关怀，她确认后私信', btn: '起草关怀', tone: 'rose' },
      { lv: '中', n: 8420, who: '活跃粉', sig: '互动频率比上月下降一半以上', act: '推一条 TA 关心话题的新内容', btn: '推送内容', tone: 'amber' },
      { lv: '低', n: 36000, who: '新粉', sig: '关注 7 天内没有第二次互动', act: '回应 TA 的第一条留言', btn: '去回应', tone: 'sky' }
    ],
    rfd: [['R 最近互动', '距上次互动天数'], ['F 互动频率', '近 30 天互动天数'], ['D 互动深度', '长评、投稿、被回应次数']],
    guard: ['不设任何消费门槛，抽奖、回应、纪念卡都与消费金额无关', '不组织打榜、刷量、集资，数据粉引导到作品口碑', '未成年人不做付费引导、不参与投票类活动', '分层只用于内部安排回应优先级，不对外展示等级', '所有私信、回应都由她本人确认后再发出']
  };

  const DATA = { PLATFORMS, growth, funnel, moves, segments, churn, fanOps, overview, keywords, tiers, audience, personas, insightsTips, comments, risky, dms, birthdays, bdayAuto, lottery, applicants, ideas, calendar, cardThemes, portraitStyles, cardLayouts, newPosts, cardIssue };

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
