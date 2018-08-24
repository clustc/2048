/**
 * 掉落流程
 * 1,随机一个掉落节点(如果使用道具优先掉落道具)
 * 2,掉落 缓冲时间  掉落 缓冲时间 
 */
var ctrl = require('GameCtrl');
var cfg = require('GameConfig');
var ITEM_TYPE = cfg.ITEM_TYPE;

cc.Class({
    extends: cc.Component,

    properties: {
        
        cell_prefab:cc.Prefab,
        previewNode:cc.Node,
        container:cc.Node,

        btnChuizi:cc.Node,
        btnShaizi:cc.Node,
        btnPause:cc.Node,

        lblScore:cc.Label,
        lblChuiZi:cc.Label,
        lblShaiZi:cc.Label,

        lblScoreForClone : cc.Node,
    },

    
    onLoad () {
        // bp.sound.playBGM('bgm2.mp3');
        this.cell_pool = new cc.NodePool();
        this.score_pool = new cc.NodePool();

        bp.event.on('left', ()=>{
            ctrl.toLeft();
        }, this);
        bp.event.on('right', ()=>{
            ctrl.toRight();
        }, this);
        bp.event.on('down', ()=>{
            ctrl.fastDown();
        }, this);


        this.btnChuizi.on('click', this.useChuizi, this);
        this.btnShaizi.on('click', this.useShaizi, this);
        this.btnPause.on('click', this.pauseGame, this);

        ctrl._view = this;
        ctrl.play();

    },

    start () {

    },

    onDestroy(){
        bp.event.offTarget(this);
    },

    updateScore(value){
        this.lblScore.string = value;
    },

    showScorePlus(score, pos, isCombo){
        let lbl = this.newScoreLabel(score);
        lbl.getComponent(cc.Label).string = isCombo ? ('Combo +' + score) : ('+'+score);
        lbl.setPosition(pos);

        this.container.addChild(lbl, 10);

        lbl.setScale(0.2);
        let act1 = cc.scaleTo(0.2,1.2);
        let act2 = cc.scaleTo(0.1,1);
        let act3 = cc.delayTime(0.3);
        let act4 = cc.spawn([
            cc.moveBy(1, cc.p(0,200)),
            cc.fadeOut(1),
        ]);
        let act5 = cc.callFunc(()=>{
            this.recyleScoreLabel(lbl);
        });

        lbl.runAction(cc.sequence([act1,act2,act3,act4,act5]))
    },

    useChuizi(){
        bp.sound.playChip('button.mp3');
        ctrl.useItem(ITEM_TYPE.CHUI_ZI);
    },

    useShaizi(){
        bp.sound.playChip('button.mp3');
        ctrl.useItem(ITEM_TYPE.SHAI_ZI);
    },

    updateChuiZiNum(){
        this.lblChuiZi.string = '消除锤锤×' + ctrl._chuiziNum;
    },

    updateShaiZiNum(){
        this.lblShaiZi.string = '万能砖块×' + ctrl._shaiziNum;
    },

    pauseGame(){
        bp.sound.playChip('button.mp3');
        ctrl.pause();
        bp.gui.pop('prefab/pause');
    },

    /**
     * 创建
     * @param {Number} score 
     */
    newScoreLabel(score){
        let lblNode = this.score_pool.get();
        if(!lblNode){
            lblNode = cc.instantiate(this.lblScoreForClone);
        }

        lblNode.opacity = 255;

        lblNode.getComponent(cc.Label).string = '+' + score
        return lblNode;
    },

    /**
     * 回收
     * @param {Node} lblNode 
     */
    recyleScoreLabel(lblNode){
        this.score_pool.put(lblNode);
    },

    /**
     * 创建
     * @param {Number} value 
     */
    newCell(value){
        let cell = this.cell_pool.get();
        if(!cell){
            cell = cc.instantiate(this.cell_prefab);
        }

        let comp = cell.getComponent("Cell");
        if(comp){
            comp.init(value);
        }

        return cell;
    },

    /**
     * 回收
     * @param {Node} cell 
     */
    recyleCell(cell){
        this.cell_pool.put(cell);
    },

    newDropCell(value){
        let cell = this.newCell(value);
        this.container.addChild(cell);
        return cell;
    },

    newNextCell(value){
        let cell = this.newCell(value);
        this.previewNode.removeAllChildren(true);
        this.previewNode.addChild(cell);
    },

    showGameOver(score){
        bp.gui.pop('prefab/gameover', null, node=>{
            let comp = node.getComponent('GameOver');
            if(comp){
                comp.updateScore(score);
            }
        });
    },

    showTip(str){
        let lbl = this.newScoreLabel(0);
        let lblComp = lbl.getComponent(cc.Label);
        // lblComp.fontSize = 40;
        lblComp.string = str;
        lbl.setPosition(cc.p(0,0));

        this.node.addChild(lbl, 10);

        let act1 = cc.delayTime(0.3);
        let act2 = cc.spawn([
            cc.moveBy(1, cc.p(0,200)),
            cc.fadeOut(1),
        ]);
        let act3 = cc.callFunc(()=>{
            this.recyleScoreLabel(lbl);
        });

        lbl.runAction(cc.sequence([act1,act2,act3]))
    },      


});
