var ctrl = require('GameCtrl');
var cfg = require('GameConfig');
var ITEM_TYPE = cfg.ITEM_TYPE;
const MAX_COL = cfg.MAX_COL;
const MAX_ROW = cfg.MAX_ROW;
const CELL_WIDTH = cfg.CELL_WIDTH;
const CELL_HEIGHT = cfg.CELL_HEIGHT;
const MOVE_DURATION = cfg.MOVE_DURATION;
const DELAY_MOVE_DOWN = cfg.DELAY_MOVE_DOWN;
const DELAY_MOVE_DONE = cfg.DELAY_MOVE_DONE;


var CELL_STATUS = cfg.CELL_STATUS;

const value_2_idx = {
    2: 0,
    4: 1,
    8: 2,
    16: 3,
    32: 4,
    64: 5,
    128: 6,
    256: 7,
    512: 8,
    1024: 9,
    2048: 10,
}

cc.Class({
    extends: cc.Component,

    properties: {
        cell_sprite: [cc.SpriteFrame],
        cell_num: [cc.SpriteFrame],

        cell: cc.Sprite,
        num: cc.Sprite,

        shaizi: cc.SpriteFrame,
        chuizi: cc.SpriteFrame,
        itemBg: cc.SpriteFrame,

        row: {
            default: 0,
            visible: false,
        },

        col: {
            default: 0,
            visible: false,
        },


        cur_status: {
            default: CELL_STATUS.NONE,
            visible: false,
        },

        value: {
            default: 0,
            visible: false,
        }

    },


    onLoad() { },

    start() {

    },

    init(value) {
        this.setRowCol(0, 0);
        this.setValue(value);

        this.cur_status = CELL_STATUS.NONE;
        this.node.comp = this;
    },

    setRowCol(row, col) {
        ctrl.updateMatrix(this.row, this.col, null);
        this.row = row;
        this.col = col;
        ctrl.updateMatrix(this.row, this.col, this.node);
        let pos = ctrl.calcPosition(row, col);
        this.node.setPosition(pos);
    },

    setValue(value) {
        this.value = value;
        if (value == ITEM_TYPE.CHUI_ZI) {
            //锤子
            this.num.spriteFrame = this.chuizi;
            this.cell.spriteFrame = this.itemBg;
        } else if (value == ITEM_TYPE.SHAI_ZI) {
            //筛子
            this.num.spriteFrame = this.shaizi;
            this.cell.spriteFrame = this.itemBg;
        } else {
            //数值
            value = Math.min(value, cfg.MAX_VALUE);
            this.value = value;
            let idx = value_2_idx[value];
            if (typeof idx == 'number') {
                this.cell.spriteFrame = this.cell_sprite[idx];
                this.num.spriteFrame = this.cell_num[idx];
            } else {
                cc.log("invalid value : ", value);
                this.cell.spriteFrame = this.itemBg;
            }
        }
    },

    startDrop() {
        let row = MAX_ROW;
        let col = Math.ceil(MAX_COL / 2);
        this.setRowCol(row, col);

        this.delay(DELAY_MOVE_DOWN);
    },

    delay(duration) {
        this.cur_status = CELL_STATUS.DELAY_MOVE_DOWN;
        let act1 = cc.delayTime(duration);
        let act2 = cc.callFunc(() => {
            this.moveDown();
        })
        this.node.runAction(cc.sequence([act1, act2]));
    },


    moveTo(row, col) {
        let pos = ctrl.calcPosition(row, col);
        let act1 = cc.moveTo(MOVE_DURATION, pos);
        let cbk1 = cc.callFunc(() => {
            if(!ctrl.isEmpty(row-1, col)){
                bp.sound.playChip('landing.mp3');
            }
            this.setRowCol(row, col);
            this.delay(DELAY_MOVE_DOWN);
        })
        this.node.runAction(cc.sequence([act1, cbk1]));
    },

    /**
     * 下移一格
     */
    moveDown() {
        let to_row = this.row - 1;
        let to_col = this.col;

        // ctrl.dumpMatrix();

        let bEmpty = ctrl.isEmpty(to_row, to_col);
        if (!bEmpty) {
            // ctrl.newCellNode();
            this.cur_status = CELL_STATUS.DROP_DONE;
            ctrl.oneCellDropDone();
        } else {
            this.moveTo(to_row, to_col);
            this.cur_status = CELL_STATUS.DROP_DOWN;
        }
    },

    /**
     * 左移一格
     */
    moveLeft() {
        if (this.cur_status != CELL_STATUS.DELAY_MOVE_DOWN) return;

        let to_row = this.row;
        let to_col = this.col - 1;
        let bEmpty = ctrl.isEmpty(to_row, to_col);
        if (bEmpty) {
            this.setRowCol(to_row, to_col);
        }
    },

    /**
     * 右移一格
     */
    moveRight() {
        if (this.cur_status != CELL_STATUS.DELAY_MOVE_DOWN) return;

        let to_row = this.row;
        let to_col = this.col + 1;
        let bEmpty = ctrl.isEmpty(to_row, to_col);
        if (bEmpty) {
            this.setRowCol(to_row, to_col);
        }
    },

    /**
     * 快速下降
     */
    fastDown() {
        let row = this.row;
        let col = this.col;
        let to_row = null;
        for (let _row = 1; _row < row; ++_row) {
            if (ctrl.isEmpty(_row, col)) {
                to_row = _row;
                break;
            }
        }

        if (to_row) {
            this.node.stopAllActions();
            let pos = ctrl.calcPosition(to_row, col);
            let act1 = cc.moveTo(MOVE_DURATION, pos);
            let cbk1 = cc.callFunc(() => {
                bp.sound.playChip('landing.mp3');
                this.setRowCol(to_row, col);
                this.cur_status = CELL_STATUS.DROP_DONE;
            })
            let delay = cc.delayTime(DELAY_MOVE_DOWN/4);
            let cbk2 = cc.callFunc(()=>{
                ctrl.oneCellDropDone();
            })
            this.node.runAction(cc.sequence([act1, cbk1, delay, cbk2]));
        }
    },

});
