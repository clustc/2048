var ctrl = require('GameCtrl');

cc.Class({
    extends: cc.Component,

    properties: {
       btnHome : cc.Node,
       btnResume: cc.Node,
       btnSoundOn: cc.Node,
       btnSoundOff: cc.Node,
    },

  
    start () {
        this.btnHome.on('click', this.onBtnHome, this);
        this.btnResume.on('click', this.onBtnResume, this);
        this.btnSoundOff.on('click', this.onBtnSoundOff, this);
        this.btnSoundOn.on('click', this.onBtnSoundOn, this);

        this.switchSound(bp.sound.getSwitch());
    },

    onBtnHome(){
        bp.sound.playChip('button.mp3');
        ctrl.backHome();
    },

    onBtnResume(){
        bp.sound.playChip('button.mp3');
        this.node.destroy();
        ctrl.resume();
    },

    onBtnSoundOff(){
        bp.sound.playChip('button.mp3');
        this.switchSound(true);
        bp.sound.playBGM('bgm1.mp3');
    },

    onBtnSoundOn(){
        bp.sound.playChip('button.mp3');
        this.switchSound(false);  
    },


    switchSound(on){
        this.btnSoundOn.active = on;
        this.btnSoundOff.active = !on;

        bp.sound.setSwitch(on);
        bp.sound.setSwitch(on, true);
    }


   
});
