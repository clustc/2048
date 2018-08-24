// require("AppCall");

var util = require("bpUtil");

var PLATFORM = {
    userAmount: null,
    wapChannelId: '100001',
    userId: null,
    accessToken: null,
    gameType: null,
    appVersion: '1.0.0.0',
    urlAccessToken: 'https://uic-api.beeplay123.com/uic/api/user/login/accessToken', // 获取AcessToken

    // 获取url参数
    getRequest: function () {
        var url = location.search;
        var theRequest = {};
        if (url.indexOf('?') !== -1) {
            var str = url.substr(1);
            var strs = str.split('&');
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
            }
        }
        return theRequest;
    },

    // 初始化登录
    initLogin: function (gameType, cbk) {
        this.gameType = gameType;
        var request = this.getRequest();
        // 拿渠道号（默认金山渠道）
        if (request['channel']) {
            this.wapChannelId = String(request['channel']);
        } else {
            bp.util.log('没有传入channel,使用默认channel:100001');
        }

        console.log('this.wapchannelID==', this.wapChannelId);
        // 全民渠道返回大厅使用newWap判断
        if (request['newWap']) {
            localStorage.setItem('newWap', request['newWap']);
        }
        // 拿token
        var token = request['token'];
        cc.log(token);
        if (token) {
            // bp.platform.accessToken = token;
            this.accessToken = token;
            cbk();
        }
        else if (this.wapChannelId.indexOf('300001') !== -1) { // 兼容IOS玩峰APP
            console.log('appcall');
            AppCall.getAppData(function (cParams) {
                console.log('cparams', cParams);
                bp.platform.accessToken = cParams.token;
                //this.accessToken = cParams.token;
                cbk();
            });
        }
        else {
            bp.util.log('没有token');
            this.gameLogin();
        }
        // 屏幕常量
        if (AppCall) AppCall.keepAlive();
    },

    // 重新授权登录
    gameLogin: function () {
        if (this.wapChannelId.indexOf('100001') !== -1 ||
            this.wapChannelId.indexOf('200001') !== -1 ||
            this.wapChannelId.indexOf('300001') !== -1) {
            // 奖多多彩票 100001
            AppCall.gameLogin();
        }
        else if (this.wapChannelId.indexOf('900001') !== -1) {
            // 球酷 900001
        }
        else if (this.wapChannelId.indexOf('100002') !== -1 ||
            this.wapChannelId.indexOf('100004') !== -1 ||
            this.wapChannelId.indexOf('100005') !== -1) {
            // 逗游 100002
            // 微拓 100005
            WeiXin.reLogin();
        }
        else if (this.wapChannelId.indexOf('100006') !== -1) {
            // 澳客彩票 100006
            localStorage.setItem('originDeffer', window.location.href);
            util.openUrl('http://m.okooo.com/user/login.php?FromUrl=/game?type=jdd');
        }
        else {
            // 自己wap站 100000
            // wap-个推 100003
            // 魅族 100013
            // 全民 100015
            // 爱彩 100016
            localStorage.setItem('originDeffer', window.location.href);
            util.openUrl('/payment/#/login' + '?channel=' + this.wapChannelId + '&token=' + this.accessToken);
        }
    },

    // openShop: function (openCbk, closeCbk) {

    //     localStorage.setItem('originDeffer', window.location.href);
    //     bp.gui.pop('prefab/WebViewPop', null, pop => {
    //         pop.getComponent('WebViewPop').init('/payment/#/gameMall?channel=' + bp.platform.wapChannelId + '&token=' + bp.platform.accessToken, 570, 710);
    //     });
    // },

    openShop: function (openCbk, closeCbk) {
        if (this.wapChannelId.indexOf('200001') !== -1) {
            // 微竞猜Android 200001
            bp.gui.pop('public/RechargePop');
        }
        else if (this.wapChannelId.indexOf('300001') !== -1) {
            // 微竞猜Ios 300001
            setTimeout(function () {
                AppCall.isReviewed(function (result) {
                    var data = JSON.parse(result);
                    if (data.isAudit === 0 || data.isAudit === '0') {
                        bp.gui.showMessage('金叶子不足，可通过签到、游戏、发布分享圈等途径获取，欢迎明天再来体验游戏。');
                    }
                    else {
                        localStorage.setItem('originDeffer', window.location.href);
                        util.openUrl('/appnew/#/shoppingList' + '?channel=' + bp.platform.wapChannelId + '&token=' + bp.platform.accessToken);
                    }
                });
            }, 200);
        }
        else if (this.wapChannelId.indexOf('900001') !== -1) {
            // 球酷 900001
        }
        else if (this.wapChannelId.indexOf('100002') !== -1 ||
            this.wapChannelId.indexOf('100004') !== -1 ||
            this.wapChannelId.indexOf('100005') !== -1) {
            // 逗游 100002
            // 微拓 100005
            WeiXin.pay();
        }
        else if (this.wapChannelId.indexOf('100006') !== -1 ||
            this.wapChannelId.indexOf('100015') !== -1 ||
            this.wapChannelId.indexOf('100001') !== -1 ||
            this.wapChannelId.indexOf('100016') !== -1 ||
            this.wapChannelId.indexOf('100022') !== -1 ||
            this.wapChannelId.indexOf('100000') !== -1) {
            // 奖多多彩票 100001
            // 澳客彩票 100006
            // 全民 100015
            // 爱彩 100016
            // 17 100022
            localStorage.setItem('originDeffer', window.location.href);
            bp.gui.pop('prefab/WebViewPop', null, pop => {
                pop.getComponent('WebViewPop').init('/payment/#/gameMall?channel=' + bp.platform.wapChannelId + '&token=' + bp.platform.accessToken, 570, 710);
            });
        }
        else {
            // 自己wap站 100000
            // wap-个推 100003
            // 魅族 100013
            localStorage.setItem('originDeffer', window.location.href);
            util.openUrl('/payment/#/shopping' + '?channel=' + this.wapChannelId + '&token=' + this.accessToken);
        }
    },

    // onBackHome: function () {
    //     var url;
    //     if (localStorage.getItem('lotteryWap')) {
    //         url = '/jsWap/' + '?channel=' + this.wapChannelId;
    //     } else {
    //         url = '/home/' + '?channel=' + this.wapChannelId;
    //     }
    //     window.location.href = url;
    // },

    onBackHome: function (bIsBag) {
        if (this.wapChannelId.indexOf('100001') !== -1) {
            console.log('奖多多彩票-返回');
            var url;
            if (localStorage.getItem('lotteryWap')) {
                url = '/jsWap/' + '?channel=' + this.wapChannelId;
            } else {
                url = '/home/' + '?channel=' + this.wapChannelId;
            }
            window.location.href = url;
        }
        else if (this.wapChannelId.indexOf('200001') !== -1 ||
            this.wapChannelId.indexOf('300001') !== -1) {
            console.log('微竞猜-返回');
            AppCall.backHome();
        }
        else if (this.wapChannelId.indexOf('100006') !== -1) {
            console.log('澳客彩票-返回');
            util.openUrl('/wap/home/' + '?channel=' + this.wapChannelId);
        }
        else if (this.wapChannelId.indexOf('100002') !== -1 ||
            this.wapChannelId.indexOf('100004') !== -1 ||
            this.wapChannelId.indexOf('100005') !== -1) {
            console.log('微信逗游微拓-返回');
            util.openUrl('../home/' + '?channel=' + this.wapChannelId);
        }
        else if (this.wapChannelId.indexOf('100015') !== -1) {
            if (localStorage.getItem('newWap')) {
                console.log('全民-新平台返回');
                util.openUrl('/newWap/' + '?channel=' + this.wapChannelId);
            }
            else {
                console.log('全民-老平台返回');
                util.openUrl('/qmWap/' + '?channel=' + this.wapChannelId);
            }
        }
        else {
            console.log('其他-返回');
            // 其他
            util.openUrl('/wap/home' + '?channel=' + this.wapChannelId);
        }
    },

    CoinCharge :function (param, OKcbk, NOcbk, bIsRecharge) {
        bp.gui.showLoading(true);
        var orderNumber = null;
        var syncState = function () {
            AppCall.gameBack(function (result) {
                var data = JSON.parse(result);
                //if (data.GameRechargeState === 1 && orderNumber === data.GameOrderNumber) {
                if (data.GameRechargeState == 1) {
                    if (bp.platform.wapChannelId.indexOf('100001') != -1) {// 彩票是否成功都返回失败
                        orderNumber = data.GameOrderNumber;
                        bp.platform.ChargeState(orderNumber, OKcbk, NOcbk, param, bIsRecharge);
                    } else if (bp.platform.wapChannelId.indexOf('200001') != -1 || bp.platform.wapChannelId.indexOf('300001') != -1) {
                        if (data.GameRechangeSuccess == 1) {
                            orderNumber = data.GameOrderNumber;
                            bp.platform.ChargeState(orderNumber, OKcbk, NOcbk, param, bIsRecharge);
                        } else {
                            bp.gui.showLoading(false);
                            if (NOcbk) NOcbk('支付失败');
                        }
                    }
                } else {
                    setTimeout(syncState, 1000);
                }
            });
        };

        if (this.wapChannelId.indexOf('100001') != -1) {
            console.log('奖多多APP充值调起');
            let okcbk = (result) => {
                cc.logEx({
                    GameOrderNumber: result,
                    GameRechargeMoney: param.price
                });
                AppCall.gameRecharge({
                    GameOrderNumber: result,
                    GameRechargeMoney: param.price
                });
                orderNumber = result;
                setTimeout(syncState, 1000);
            }
            let nocbk = (msg) => {
                bp.gui.showLoading(false);
                if (NOcbk) NOcbk(msg);
            }
            bp.http.request(bp.config.urlPayOrder, {
                payType: 8,
                source: 1,
                value: param.bizId
            }, okcbk, nocbk, false, false);
        } else if (this.wapChannelId.indexOf('200001') != -1 || this.wapChannelId.indexOf('300001') != -1) {
            console.log('玩峰APP充值调起');
            // bp.gui.showMessage('productId === '+param.thirdId);
            if (!param.thirdId) {
                param.thirdId = '';
            }
            param.bizTarget = param.bizId;
            param.bizType = param.bizId;
            AppCall.gameRecharge({
                GameOrderNumber: param,
                GameRechargeMoney: param.price,
                productId: param.thirdId
            });
            setTimeout(syncState, 1000);
        }
    },
    ChargeState :function (orderNumber, OKcbk, NOcbk, param, bIsRecharge) {
        var tryTime = 0;
        var syncState = function () {
            let okcbk = (result) => {
                if (result == 0) {
                    if (tryTime++ < 5) {
                        setTimeout(syncState, 1000);
                    } else {
                        bp.gui.showLoading(false);
                        NOcbk && NOcbk('支付成功');
                    }
                }
                else if (result == 1) {
                    bp.gui.showLoading(false);
                    OKcbk && OKcbk('支付成功');
                }
                else {
                    bp.gui.showLoading(false);
                    if (!bIsRecharge && this.wapChannelId.indexOf('100001') != -1) {
                        var rePayPop = bp.gui.showPop('RePayPop');
                        rePayPop.getScript().initReChageParam(param, OKcbk, NOcbk);
                    } else {
                        NOcbk && NOcbk('支付异常');
                    }
                }
            };
            let nocbk = (msg) => {
                bp.gui.showLoading(false);
                NOcbk(msg);
            };
            var showPayState = bp.http.request(bp.config.urlPayState, {
                value: orderNumber
            }, okcbk, nocbk, false, false);

            if (this.wapChannelId.indexOf('100001') != -1) {
                showPayState.showMessage(false);
            }
        };
        syncState();
    },
};

module.exports = PLATFORM;