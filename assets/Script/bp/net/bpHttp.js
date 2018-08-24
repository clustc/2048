var config = require("config");
var platform = require("bpPlatform");

var http = {

    /**
     * 
     */
    getRequest: function () {
        var url = location.search;
        var theRequest = new Object();
        if (url.indexOf("?") != -1) {
            var str = url.substr(1);
            var strs = str.split("&");
            for (var i = 0; i < strs.length; i++) {
                theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
            }
        }
        cc.log('获取url参数', theRequest);
        return theRequest;
    },

    /**
     * http请求
     */
    request: function (url, params, sucCbk, errCbk, bShowLoading, bShowErrorMsg) {
        if (!url) {
            bp.util.log('url is null');
            return;
        }
        bShowErrorMsg = !!bShowErrorMsg;
        bShowLoading = !!bShowLoading;

        var success = (data) => {
            sucCbk && sucCbk(data);
        };

        var error = (errStr, code) => {
            if(errCbk){
                errCbk(errStr, code);
            }else{
                if(bShowErrorMsg) {
                    bp.gui.showMessage("", errStr, null, null, true);
                }
            }
        };

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.setRequestHeader("Authorization", platform.accessToken);
        xhr.setRequestHeader("App-Version", platform.appVersion);
        xhr.setRequestHeader("Repeated-Submission", String(new Date().getTime()));
        xhr.setRequestHeader("App-Channel", platform.wapChannelId);
        xhr.timeout = 15 * 1000; // 15秒超时

        xhr.ontimeout = () => {
            bShowLoading && bp.gui.showLoading(false);
            error && error("连接超时");
        };

        xhr.onerror = () => {
            bShowLoading && bp.gui.showLoading(false);
            error && error("未连接到网络，请检查您的网络设置");
        };

        xhr.onreadystatechange = () => {
            bShowLoading && bp.gui.showLoading(false);
            if (xhr.readyState !== 4) return ;
            if (xhr.status >= 200 && xhr.status <= 207) {
                if (xhr.responseText) {
                    cc.log("receiveURL = ", url, xhr.responseText);
                    var result = JSON.parse(xhr.responseText);
                    if (result.code === 200) {
                        success(result.data);
                    }
                    else if (result.code === 401) {
                        cc.sys.localStorage.setItem(platform.token, ""); // 删除accessToken
                        // LinkUtil.gameLogin(); // 发起登录
                    }
                    else {
                        error && error(result.message, result.code);
                    }
                }
                else {
                    error && error("其他错误", xhr.status);
                }
            }
            else {
                error && error("主公，您的网络有点小异常", xhr.status);
            }
        };

        bShowLoading && bp.gui.showLoading(true);

        if (params) {
            xhr.send(JSON.stringify(params));
        } else {
            xhr.send();
        }
    },

   

    /**
     * 老埋点
     */
    buryingPoint: function (buryingType) {
        this.request(config.urlBuryingPoint, {
            buryingType: buryingType,
            gameType: platform.gameType
        });
    },

    /**
     * 新埋点
     */
    newBuryingPoint: function (behaviorId) {
        this.request(config.urlNewBuryingPoint, {
            behaviorEventId: behaviorId
        });
    },

    /**
     * 大数据埋点
     */
    urlBigData: "https://hadoop-data.beeplay123.com",
    // urlBigData: "http://10.33.85.73",
    bigDataUpload: function (params) {
        let obj1 = {
            channel_id: bp.util.toNumber(platform.wapChannelId),
            project_id: 35,
            project_name: '去玩斗地主',
            user_id: bp.util.toNumber(platform.userId),
            residual_gold: bp.platform.userAmount,
            generate_date: bp.util.timeHandle1(),
            generate_time: bp.util.timeHandle2(),
        };
        for (let key in params) {
            obj1[key] = params[key];
        }
        this.request(this.urlBigData, obj1);
    },

};

module.exports = http;