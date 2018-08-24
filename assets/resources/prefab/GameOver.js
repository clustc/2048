const ctrl = require('GameCtrl');
cc.Class({
    extends: cc.Component,

    properties: {
        lblScore : cc.Label,
        lblRecord : cc.Label,

        btnHome: cc.Node,
        btnReplay: cc.Node,
        btnShare: cc.Node,

        cup: cc.Node,
    },

    start () {

    },

    onLoad(){
        this.btnHome.on('click', this.backHome, this);
        this.btnReplay.on('click', this.replay, this);
        this.btnShare.on('click', this.share, this);
        
        this.lblRecord.string = '历史最高得分：' + ctrl._scoreRecord;

        if(ctrl.__bNewRecord){
            //新记录
            this.cup.getComponent(cc.Animation).play();
        }
    },

    updateScore(score){
        this.lblScore.string = score;
    },

    backHome(){
        bp.sound.playChip('button.mp3');
        ctrl.backHome();
    },

    replay(){
        bp.sound.playChip('button.mp3');
        this.node.destroy();
        ctrl.play();
    },

    share(){
        bp.sound.playChip('button.mp3');
    },


});
