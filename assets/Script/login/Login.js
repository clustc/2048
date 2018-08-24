bp.sound.init();
cc.Class({
    extends: cc.Component,

    properties: {
       btnStart:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {},

    start () {
        this.btnStart.on('click', this.onBtnStart, this);
        bp.sound.playBGM('bgm1.mp3');
    },

    onBtnStart(){
        bp.sound.playChip('button.mp3');
        cc.director.loadScene('game');
    },
});
