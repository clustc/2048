var HTTPURL = {
    uicUrl: "https://uic-api.beeplay123.com",
    transUrl: "https://trans-api.beeplay123.com",
    platformUrl: "https://platform-api.beeplay123.com",
    shopUrl: "https://shop-api.beeplay123.com",
    opsUrl: "https://ops-api.beeplay123.com",
    openUrl: "https://open-api.beeplay123.com",
    quoitsUrl: "https://quoits-api.beeplay123.com",
    dataUrl: "https://data-api.beeplay123.com",
    adminUrl: "https://admin.beeplay123.com",
    gameUrl: "https://game-api.beeplay123.com",
    // gameUrl: "http://10.33.80.114:8080",
    fileUrl: "https://file.beeplay123.com",
};

var CONFIG = {
    // 平台URL
    urlGetFirstGiftStu: HTTPURL.shopUrl + '/shop/api/mall/feedBackList', //获取首冲商品图标
    urlRequestToken: HTTPURL.uicUrl + '/uic/api/lottery/login', // 金山登录
    urlAccessToken: HTTPURL.uicUrl + '/uic/api/user/login/accessToken', // 获取AcessToken

    urlBuryingPoint: HTTPURL.dataUrl + '/data/api/burying/point', // 埋点
    urlNewBuryingPoint: HTTPURL.dataUrl + '/data/api/behaviorRecord/point', //新埋点

    urlMoneyList: HTTPURL.shopUrl + '/shop/api/mall/list', // 充值列表
    urlActivityList: HTTPURL.shopUrl + '/shop/api/mall/list', // 充值列表
    urlGetBalance: HTTPURL.transUrl + '/trans/api/jsLottery/getBalance', //查询金山帐户余额

	urlFeedbackAutoOpen: HTTPURL.shopUrl + '/shop/api/mall/feedbackAutoOpen', // 充值回馈自动弹出
	urlfeedBackList: HTTPURL.shopUrl + '/shop/api/mall/feedBackList', // 充值回馈列表

    urlTransInfo: HTTPURL.uicUrl + '/uic/api/user/login/transInfo', // 用户状态
    urlUserStatus: HTTPURL.shopUrl + '/shop/api/status/recharge', // 用户附加状态

    urlGameList: HTTPURL.platformUrl + '/wap/api/game/list', // 游戏列表
    urlBannerList: HTTPURL.platformUrl + '/wap/api/banner/list', // 轮播图
   
    urlCatchedawards: HTTPURL.shopUrl + '/shop/api/wap/welfarebag/catchedawards', // 盈利榜转盘获奖记录
    urlSaveAddress: HTTPURL.shopUrl + '/shop/api/wap/welfarebag/saveAddress', // 保存收货地址

    urlProfitList: HTTPURL.platformUrl + '/wap/api/history/profitNew', // 盈利榜
    urlRichList: HTTPURL.platformUrl + '/wap/api/history/rich', // 土豪榜
    urlEraserClear: HTTPURL.platformUrl + '/wap/api/eraser/clear', // 橡皮擦
    urlEraserConfig: HTTPURL.platformUrl + '/wap/api/eraser/config', // 橡皮擦剩余次数
    urlProfitNext: HTTPURL.platformUrl + '/wap/api/history/profitNext', // 奖励进度
    urlHandsel: HTTPURL.platformUrl + '/wap/api/history/handselNew', // 昨日排行榜
    urlProfitRules: HTTPURL.platformUrl + '/wap/api/profit/profitRules', // 区间榜规则

    urlRichwheelBetting1: HTTPURL.opsUrl + '/ops/api/richwheel/lowBetting', // 2W必中转盘投注
    urlRichwheelStatus1: HTTPURL.opsUrl + '/ops/api/richwheel/lowStatus', // 2W必中转盘状态
    urlRichwheelBetting2: HTTPURL.opsUrl + '/ops/api/richwheel/betting', // 20W必中转盘投注
    urlRichwheelStatus2: HTTPURL.opsUrl + '/ops/api/richwheel/status', // 20W必中转盘状态

    urlSignedList: HTTPURL.platformUrl + '/wap/api/signed/list', // 签到列表
    urlSignedSigning: HTTPURL.platformUrl + '/wap/api/signed/signing', // 签到

    urlPrevbackLeafs: HTTPURL.opsUrl + '/ops/api/usercenter/prevback/leafs', // 返水-昨日额度
    urlTodaybackLeafs: HTTPURL.opsUrl + '/ops/api/usercenter/todayback/leafs', // 返水-今日累计

    urlNoticeList: HTTPURL.platformUrl + '/wap/api/notice/list', // 跑马灯-前十
    urlNoticeSend: HTTPURL.platformUrl + '/wap/api/notice/send', // 跑马灯-发布
    urlNoticeHistory: HTTPURL.platformUrl + '/wap/api/notice/history', // 跑马灯-弹出框列表

    urlTaskList: HTTPURL.platformUrl + '/wap/api/usertask/gameTaskList', // 游戏任务
	urlTaskListPlatform: HTTPURL.platformUrl + '/wap/api/usertask/showFestivallist', // 平台任务
    urlTaskFinish: HTTPURL.platformUrl + '/wap/api/usertask/finish', // 领取任务奖励
	
    urlWheelStatus: HTTPURL.opsUrl + '/ops/api/wheelgame/status', // 转盘状态
    urlWheelBetting: HTTPURL.opsUrl + '/ops/api/wheelgame/betting', // 转盘抽奖

    urlFragmentRich: HTTPURL.transUrl + '/trans/api/fragment/rich', // 我的碎片包
    urlFragmentconvertList: HTTPURL.transUrl + '/trans/api/fragment/convertList/', // 可合成的碎片列表
    urlFragmentCombine: HTTPURL.transUrl + '/trans/api/fragment/combine', // 碎片合成
    urlFragmentCombineAwards: HTTPURL.transUrl + '/trans/api/fragment/combineAwards', // 新碎片合成
    urlFragmentRemind: HTTPURL.platformUrl + '/wap/api/plat/remind', // 红点提醒
    urlFragmentFragmentRecord: HTTPURL.transUrl + '/trans/api/fragment/findUserFragmentRecord', // 碎片获取记录
    urlFragmentComposeRecord: HTTPURL.transUrl + '/trans/api/fragment/findUserComposeRecord', // 碎片合成记录
    urlFragmentBuyBackRecord: HTTPURL.transUrl + '/trans/api/fragment/findUserBuyBackRecord', // 碎片回购记录

    //=========碎片转换========
    urlPieceTrans: HTTPURL.transUrl + '/trans/api/fragment/findUserReplaceRecord',

    urlDefaultAddress: HTTPURL.platformUrl + '/wap/api/profit/defaultAddress', // 默认收货地址

    urlReviveGrant: HTTPURL.opsUrl + '/ops/api/revive/grant', // 复活基金

    // 套圈接口
    urlFreeTimes: HTTPURL.quoitsUrl + '/quoits/api/quoitsgame/freeTimes', // 套圈免费次数
    getManitoList: HTTPURL.quoitsUrl + '/quoits/api/quoitsgame/getManitoList', // 大神榜单

    //========付费转盘=======
    urlPayWheelState: HTTPURL.opsUrl + '/ops/api/fee/wheel/status',
    urlPayWheelDraw: HTTPURL.opsUrl + '/ops/api/fee/wheel/betting',

    //========新支付=========
    urlPayOrder: HTTPURL.transUrl + '/trans/api/order/new',
    urlPayWay: HTTPURL.transUrl + '/trans/api/pay/init',
    urlPayState: HTTPURL.transUrl + '/trans/api/pay/status',

    // 视频活动状态
    urlVideoStatus: HTTPURL.opsUrl + '/ops/api/video/status',
    // 开宝箱
    urlVideoReward: HTTPURL.opsUrl + '/ops/api/video/reward',

    //========新人好礼=========
    urlFreshGiftGot: HTTPURL.platformUrl + '/wap/api/newuseraward/isreceive',
    urlFreshGiftList: HTTPURL.platformUrl + '/wap/api/newuseraward/getnewuserawardlog',
    urlFreshGiftAccept: HTTPURL.platformUrl + '/wap/api/newuseraward/receive',

    //签到抽奖
    urlLottery: HTTPURL.platformUrl + '/wap/api/userchecklottery/lottery',//抽奖
    urlCheckAwardList: HTTPURL.platformUrl + '/wap/api/userchecklottery/checkawardlist',//签到奖励列表
    urlLotteryAwardList: HTTPURL.platformUrl + '/wap/api/userchecklottery/lotteryawardlist',//获得抽奖奖品列表
    urlReceiveCheckAward: HTTPURL.platformUrl + '/wap/api/userchecklottery/receivecheckaward',//领取签到奖励

    //流水榜
    AwardRankState: HTTPURL.opsUrl + '/ops/api/ranking/status',
    AwardRankMine: HTTPURL.opsUrl + '/ops/api/ranking/myRecord',
    AwardRankToday: HTTPURL.opsUrl + '/ops/api/ranking/bettingRank',
    AwardRankFlag: HTTPURL.opsUrl + '/ops/api/ranking/awardsFlag',

    //首页前三名排行榜
    topThreeProfit: HTTPURL.platformUrl + '/wap/api/history/topThreeProfit',

    // 今日是否签到
    islottery: HTTPURL.platformUrl + '/wap/api/userchecklottery/islottery',
   
    hourseLamp: HTTPURL.quoitsUrl + "/quoits/api/quoitsgame/hourseLamp",          // 套圈跑马灯

    //限时兑换====================================================================================
    urlexchangelist: HTTPURL.opsUrl + '/ops/api/exchange/list',//兑换列表
    urlexchange: HTTPURL.opsUrl + '/ops/api/exchange/reward',//兑换奖品
    urlexchangemyRecord: HTTPURL.opsUrl + '/ops/api/exchange/myRecord',//我的记录

    //福利宝箱
    urlwelfareboxlist: HTTPURL.opsUrl + "/ops/api/welfarebox/list", //宝箱列表
    urlwelfareboxaccept: HTTPURL.opsUrl + "/ops/api/welfarebox/accept", //领取奖励

	urlPlatIndex: HTTPURL.platformUrl + '/wap/api/history/platIndex', // 前三榜
	
	urlGetMessages: HTTPURL.platformUrl + '/wap/api/wap/usermessage/getMessages', // 消息列表
    urlReadOne: HTTPURL.platformUrl + '/wap/api/wap/usermessage/readOne', // 读取消息
    urlReceiveAward: HTTPURL.platformUrl + '/wap/api/wap/usermessage/receiveAward', // 获取奖励

    urlClubList: HTTPURL.platformUrl + '/wap/api/club/getclublist', // 俱乐部列表
    urlCreateClub: HTTPURL.platformUrl + '/wap/api/club/createclub', // 创建俱乐部
    urlApplyClub: HTTPURL.platformUrl + '/wap/api/club/apply', // 申请加入俱乐部
    urlMemberList: HTTPURL.platformUrl + '/wap/api/club/memberlist', // 俱乐部成员管理
    urlApplyList: HTTPURL.platformUrl + '/wap/api/club/applylist', // 加入俱乐部申请列表
    urlInvitationList: HTTPURL.platformUrl + '/wap/api/club/invitationlist', // 邀请列表
    urlInviteMember: HTTPURL.platformUrl + '/wap/api/club/invite/{userId}', // 邀请会员
    urlUpdateHeadImg: HTTPURL.platformUrl + '/wap/api/club/updateheadimg', // 头像修改
    urlUpdateDescription: HTTPURL.platformUrl + '/wap/api/club/updatedescription', // 简介修改
    urlKickoutMember: HTTPURL.platformUrl + '/wap/api/club/kickout/{userId}', // 部长踢人
    urlExitClub: HTTPURL.platformUrl + '/wap/api/club/exit', // 退出俱乐部
    urlDealApply: HTTPURL.platformUrl + '/wap/api/club/dealapply', // 处理申请和邀请
}

CONFIG.HTTPURL = HTTPURL;

module.exports = CONFIG;


