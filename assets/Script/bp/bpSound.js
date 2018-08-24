var Sound = {
    bgmVolume: 1.0,
    chipVolume: 1.0,
    bgmAudioID: -1,
    bgmAudioUrl: '',
    soundOpen: true,
    chipOpen: true,
    audioBgmID: null,

    init: function () {
        // var bgmV = cc.sys.localStorage.getItem("bgmVolume");
        // if (bgmV != null) {
        //     this.bgmVolume = parseFloat(bgmV);
        // }
        // var chipV = cc.sys.localStorage.getItem("chipVolume");
        // if (chipV != null) {
        //     this.chipVolume = parseFloat(chipV);
        // }
        var value = cc.sys.localStorage.getItem('AUDIO_SWITCH');
        var chipValue = cc.sys.localStorage.getItem('AUDIO_CHIP_SWITCH');
        if (value == null) {
            this.soundOpen = true;
        } else {
            this.soundOpen = (value === '1');
        }
        if (chipValue == null) {
            this.chipOpen = true;
        } else {
            this.chipOpen = (chipValue === '1');
        }
    },



    //设置声音开 第二个参数true：背景音乐开关  false：声音片段开关
    setSwitch: function (isOpen, isBG) {
        if (isBG) {
            if (this.soundOpen == isOpen) return;
            this.soundOpen = isOpen;
            if (!isOpen) {
                this.stopBgmAudio();
            }
            cc.sys.localStorage.setItem('AUDIO_SWITCH', isOpen ? '1' : "0");
        } else {
            if (this.chipOpen == isOpen) return;
            this.chipOpen = isOpen;
            if (!isOpen) {
                this.stopChipAudio();
            }
            cc.sys.localStorage.setItem('AUDIO_CHIP_SWITCH', isOpen ? '1' : "0");
        }

    },

    //获取声音开关状态  isBG为true代表背景音乐的 false代表声音片段
    getSwitch: function (isBG) {
        if (isBG) {
            return this.soundOpen;
        } else {
            return this.chipOpen;
        }
    },

    stopBgmAudio: function () {
        this.bgmAudioUrl = '';
        cc.audioEngine.stop(this.audioBgmID);
        this.audioBgmID = null;
    },

    stopChipAudio: function () {
        if (this.audioChipID != undefined) {
            cc.audioEngine.stop(this.audioChipID);
        }
    },

    //播放背景音乐资源
    playBGM: function (url) {
        if (!this.soundOpen) {
            return;
        }
        if (this.bgmAudioUrl === url) {
            return;
        }
        this.bgmAudioUrl = url;
        var audioUrl = this.getUrl(url);
        if(this.audioBgmID != null){
            cc.audioEngine.stop(this.audioBgmID);
        }
        this.audioBgmID = cc.audioEngine.play(audioUrl, true, this.bgmVolume);
    },

    //播放声音片段
    playChip(url) {
        if (!this.chipOpen) {
            return;
        }
        var audioUrl = this.getUrl(url);
        this.audioChipID = cc.audioEngine.play(audioUrl, false, this.chipVolume);
    },

    // //设置声音片段音量
    // setChipVolume: function (volume) {
    //     if (this.chipVolume != volume) {
    //         cc.sys.localStorage.setItem("chipVolume", volume);
    //         this.chipVolume = volume;
    //     }
    // },

    // //设置背景音乐音量
    // setBGMVolume: function (volume, force) {
    //     if (this.bgmAudioID >= 0) {
    //         if (volume > 0) {
    //             cc.audioEngine.resume(this.bgmAudioID);
    //         }
    //         else {
    //             cc.audioEngine.pause(this.bgmAudioID);
    //         }
    //     }
    //     if (this.bgmVolume != volume || force) {
    //         cc.sys.localStorage.setItem("bgmVolume", volume);
    //         this.bgmVolume = volume;
    //         cc.audioEngine.setVolume(this.bgmAudioID, volume);
    //     }
    // },

    getUrl: function (url) {
        return cc.url.raw("resources/sounds/" + url);
    },

}

Sound.init();

module.exports = Sound;