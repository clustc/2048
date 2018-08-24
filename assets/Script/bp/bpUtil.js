var config = require("config");

var Util = {

    _debug: true,

    getDebugMode: function () {
        return this._debug;
    },

    setDebugMode: function (bValue) {
        this._debug = !!bValue;
    },

    /**
     * 动态加载远程图片资源
     */
    loadRemoteImage: function (spt, url) {
        if (!spt || !url) return;

        if (url.indexOf('http') === -1) {
            url = config.HTTPURL.fileUrl + url;
        }

        cc.loader.load({ url: url }, (err, texture) => {
            if (err) {
                bp.util.log('load remote image faild!', url);
                return;
            }
            spt.spriteFrame = new cc.SpriteFrame(texture);
        });
    },


    toString: function (num) {
        return "" + num;
    },

    toNumber: function (str) {
        return +str;
    },

    /**
     * 格式化数字，以万为单位，小数点后取两位
     */
    formatNum: function (num) {
        if (num < 10000) return num;
        let integer = Math.floor(num / 10000);
        let decimal = Math.floor((num % 10000) / 100)
    },

    log: function () {
        if (this._debug) {
            return cc.error.apply(cc, arguments);
        }
    },

    /**
     * 
     */
    openUrl: function (url) {
        if (!url) return;
        window.location.href = url;
    },

    processName: function (name) {
        let len = name.length;
        let reg = /^[^\u4e00-\u9fa5]+$/;
        if (reg.test(name)) {
            //非中文    
            if (len > 11) {
                name = name.slice(0, 8) + "...";
            }
        } else {
            //包含中文
            if (len > 4) {
                name = name.slice(0, 4) + "...";
            }
        }
        return name;
    },
    
    //获取两个整数范围内的整数（min<result<max）
    roundNumber: function (min, max) {
        let len = max - min;
        let range = Math.floor(Math.random() * len);
        if (range == 0) {
            range += 1;
        }
        return range;
    },

    /**
     * 前后台监听
     */
    patch: function () {
        if (cc.sys.isNative) return;
        if (typeof document["oHidden"] !== "undefined") {
            document.addEventListener("ovisibilitychange", function (event) {
                let visible = document["oHidden"] || event["hidden"];
                let game = cc.game;
                if (visible) {
                    game.emit(game.EVENT_SHOW, game);
                } else {
                    game.emit(game.EVENT_HIDE, game);
                }
            }, false)
        }

        let ua = navigator.userAgent;
        let isWX = /micromessenger/gi.test(ua);
        let isQQBrowser = /mqq/ig.test(ua);
        let isQQ = /mobile.*qq/gi.test(ua);

        if (isQQ || isWX) {
            isQQBrowser = false;
        }
        if (isQQBrowser) {
            let browser = window["browser"] || {};
            browser.execWebFn = browser.execWebFn || {};
            browser.execWebFn.postX5GamePlayerMessage = function (event) {
                let eventType = event.type;
                if (eventType == "app_enter_background") {
                    game.emit(game.EVENT_HIDE, game);
                }
                else if (eventType == "app_enter_foreground") {
                    game.emit(game.EVENT_SHOW, game);
                }
            };
            window["browser"] = browser;
        }
    },

    //判断一个对象是否为空
    isObjectEmpty: function (obj) {
        if (typeof obj != 'object') return false;
        if (JSON.stringify(obj) == "{}") {
            return true;
        } else {
            return false;
        }

    },

    trace: function (count) {
        var caller = arguments.callee.caller;
        var i = 0;
        count = count || 10;
        cc.log("***----------------------------------------  ** " + (i + 1));
        while (caller && i < count) {
            cc.log(caller.toString());
            caller = caller.caller;
            i++;
            cc.log("***---------------------------------------- ** " + (i + 1));
        }
    },

    //获取指定格式的时间(年月日)
    timeHandle1: function () {
        let nowTime = new Date();
        let year = nowTime.getFullYear();
        let month = this.formatTime(nowTime.getMonth() + 1);
        let date = this.formatTime(nowTime.getDate());
        let result = year + '-' + month + '-' + date;
        return result;
    },

    //获取指定格式的时间(小时分钟秒)
    timeHandle2: function () {
        let nowTime = new Date();
        let hour = this.formatTime(nowTime.getHours())
        let minute = this.formatTime(nowTime.getMinutes());
        let seconds = this.formatTime(nowTime.getSeconds());
        let result = hour + ':' + minute + ':' + seconds;
        return result;
    },

    formatTime: function (time) {
        if (time < 10) {
            return '0' + time;
        } else {
            return time;
        }
    },


};

Util.patch();

module.exports = Util;