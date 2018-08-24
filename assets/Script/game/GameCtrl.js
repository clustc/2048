var cfg = require('GameConfig');
const MAX_COL = cfg.MAX_COL;
const MAX_ROW = cfg.MAX_ROW;
const CELL_WIDTH = cfg.CELL_WIDTH;
const CELL_HEIGHT = cfg.CELL_HEIGHT;

//卡点
const VALUES = cfg.VALUES;
const MAX_VALUE = cfg.MAX_VALUE;
const ORIGINAL_CEIL_VALUE = cfg.ORIGINAL_CEIL_VALUE;                         //初始卡点值
const MAX_CEIL_VALUE = cfg.MAX_CEIL_VALUE;                                  //最大卡点值 1024
const MOVE_DURATION = cfg.MOVE_DURATION;

//道具
const ITEM_TYPE = cfg.ITEM_TYPE;

var matrix = null;    //当前矩阵

var GameCtrl = {
    _view: null,
    _dropCell: null,
    _curScore: 0,  //当前总得分 
    _scoreRecord: null,       //历史得分最高纪录
    _curCeilValue: ORIGINAL_CEIL_VALUE,
    _chuiziNum: 0,         //剩余锤子数量    
    _shaiziNum: 0,         //剩余筛子数量
    _bNewRecord: false,     //是否产生新记录

    _valueQueue: [],       //数值列表

    /**
     * 使用道具，非立即体现,插入数值列表，等待下次取出
     * @param {Number} item_id 
     */
    useItem(item_id) {
        if (item_id == ITEM_TYPE.CHUI_ZI) {
            if (this._chuiziNum <= 0) {
                this._view && this._view.showTip('道具不足');
                return;
            }
            this.updateChuiZiNum(this._chuiziNum - 1);
        } else if (item_id == ITEM_TYPE.SHAI_ZI) {
            if (this._shaiziNum <= 0) {
                this._view && this._view.showTip('道具不足');
                return;
            }
            this.updateShaiZiNum(this._shaiziNum - 1);
        } else {
            return;
        }
        // this._valueQueue.push(item_id);
        this._valueQueue[0] = item_id;
        this._view && this._view.newNextCell(item_id);
    },

    updateChuiZiNum(value) {
        this._chuiziNum = value;
        this._view && this._view.updateChuiZiNum(value);
    },

    updateShaiZiNum(value) {
        this._shaiziNum = value;
        this._view && this._view.updateShaiZiNum(value);
    },

    getScore() {
        return this._curScore;
    },

    /**
     * 更新当前得分
     * @param {Number} score 
     */
    setScore(score) {
        this._curScore = score;
        this._view && this._view.updateScore(score);

        if (this._curScore > this.getRecord()) {
            this.updateRecord(score);
        }
    },
    /**
     * 获取记录
     */
    getRecord() {
        if (this._scoreRecord == null) {
            this._scoreRecord = + cc.sys.localStorage.getItem('record_2048');
        }
        return this._scoreRecord;
    },

    /**
     * 更新记录
     * @param {Number} score 
     */
    updateRecord(score) {
        this._bNewRecord = true;
        this._scoreRecord = score;
        cc.sys.localStorage.setItem('record_2048', '' + score);
    },


    /**
     * 初始 重置矩阵
     */
    initMatrix() {
        if (matrix != null) {
            for (let row = 1; row <= MAX_ROW; ++row) {
                for (let col = 1; col <= MAX_COL; ++col) {
                    let node = matrix[row][col];
                    this.removeCellNode(node);
                }
            }
        }
        matrix = [];
        for (let row = 1; row <= MAX_ROW; ++row) {
            matrix[row] = [];
            for (let col = 1; col <= MAX_COL; ++col) {
                matrix[row][col] = null;
            }
        }
    },

    removeCellNode(node) {
        if (!node) return;

        this._view && this._view.recyleCell(node);
        node.comp.setRowCol(0, 0);
    },

    /**
     * 
     * @param {Number} row 行
     * @param {Number} col 列
     * @param {cc.Node} node 节点 
     */
    updateMatrix(row, col, node) {
        if (row >= 1 && row <= MAX_ROW
            && col >= 1 && col <= MAX_COL) {
            matrix[row][col] = node;
        }
    },

    /**
     * 获取指定格子内Cell节点
     * @param {Number} row 
     * @param {Number} col 
     */
    getCellNode(row, col) {
        if (row >= 1 && row <= MAX_ROW
            && col >= 1 && col <= MAX_COL) {
            return matrix[row][col];
        }
        return null;
    },


    /**
     * 计算格子坐标 左下角索引(1,1) 右上角(MAX_ROW, MAX_COL)
     * @param {Number} row  [1, MAX_ROW]
     * @param {Number} col  [1, MAX_COL]
     */
    calcPosition(row, col) {
        if (row >= 1 && row <= MAX_ROW
            && col >= 1 && col <= MAX_COL) {
            let x = (col - 0.5) * CELL_WIDTH;
            let y = (row - 0.5) * CELL_HEIGHT;
            return cc.p(x, y);
        }
        return cc.p(0, 0);
    },

    isEmpty(row, col) {
        if (row >= 1 && row <= MAX_ROW
            && col >= 1 && col <= MAX_COL
            && matrix[row][col] == null) {
            return true;
        }
        return false;
    },


    /**
     * 计算合并得分
     * @param {Number} value 当前合并值 
     * @param {Number} count 当前合并的格子数[2,4]
     */
    calcScore(value, count) {
        let ratio = Math.pow(2, count - 1);
        return value * ratio;
    },

    doubleCeilValue() {
        this._curCeilValue *= 2;
        this._curCeilValue = Math.min(this._curCeilValue, MAX_CEIL_VALUE);
    },

    /**
     * 获取首个元素
     * @param {Boolean} needPop 是否需要弹出首个元素 
     */
    getNextValue(needPop) {
        if (this._valueQueue.length == 0) {
            let idx = VALUES.indexOf(this._curCeilValue);
            let randIdx = Math.floor(Math.random() * 1000) % (idx + 1);
            this._valueQueue.push(VALUES[randIdx]);
        }
        if (needPop) {
            let value = this._valueQueue.shift();
            return value;
        } else {
            return this._valueQueue[0];
        }
    },

    /**
     * 调试用，用于直观展示当前矩阵数值
     */
    dumpMatrix() {
        let format = function (str) {
            switch (str.length) {
                case 1:
                    str = '   ' + str + '   ';
                    break;
                case 2:
                    str = '  ' + str + '   ';
                    break;
                case 3:
                    str = '  ' + str + '  ';
                    break;
                case 4:
                    str = ' ' + str + '  ';
                    break;
            }
            return str;
        };

        let str = '\n';
        for (let row = MAX_ROW; row >= 1; row--) {

            for (let col = 1; col <= MAX_COL; col++) {
                let node = this.getCellNode(row, col);
                if (node) {
                    str += format('' + node.comp.value);
                } else {
                    str += format('0');
                }
            }
            str += '\n';
        }
        cc.log(str);
    },


    /**
     * 游戏开始
     */
    play() {
        this._curScore = 0;
        this._bNewRecord = false;
        this._curCeilValue = ORIGINAL_CEIL_VALUE;
        this._valueQueue = [];

        this.setScore(0);
        this.initMatrix();
        this.updateChuiZiNum(1);
        this.updateShaiZiNum(1);

        this.scheduleStart();

        this.newCellNode();
    },

    scheduleStart() {
        this._view && this._view.schedule(GameCtrl.scheduleHandler, 3 * 60);
    },

    scheduleHandler() {
        cc.log('xxxx')
        GameCtrl.doubleCeilValue();
    },

    scheduleEnd() {
        this._view && this._view.unschedule(GameCtrl.scheduleHandler);
    },

    newCellNode() {
        if (this.checkGameOver()) {
            this.gameOver()
            return;
        }
        let view = this._view;
        let value = this.getNextValue(true);

        this._dropCell = view.newDropCell(value);
        let comp = this._dropCell.comp;
        comp.startDrop();

        value = this.getNextValue(false);
        view.newNextCell(value);
    },

    toLeft() {
        this._dropCell && this._dropCell.comp.moveLeft();
    },

    toRight() {
        this._dropCell && this._dropCell.comp.moveRight();
    },

    fastDown() {
        this._dropCell && this._dropCell.comp.fastDown();
    },

    /**
     * 当前新掉落的方块移动到底部结束，判断合并
     */
    oneCellDropDone() {
        cc.log('one cell move done!')
        //判断当前掉落方块是否道具
        let comp = this._dropCell.comp;
        if (comp.value == ITEM_TYPE.CHUI_ZI) {
            this.useChuiZi();
        } else if (comp.value == ITEM_TYPE.SHAI_ZI) {
            this.useShaiZi();
        } else {
            this.merge([this._dropCell]);
        }
    },

    useChuiZi() {
        let row = this._dropCell.comp.row;
        let col = this._dropCell.comp.col;

        let nodes_to_remove = [];

        let left = this.getCellNode(row, col - 1);
        left && nodes_to_remove.push(left);

        let right = this.getCellNode(row, col + 1);
        right && nodes_to_remove.push(right);

        let down = this.getCellNode(row - 1, col);
        down && nodes_to_remove.push(down);

        nodes_to_remove.push(this._dropCell);

        nodes_to_remove.forEach(element => {
            element.runAction(cc.sequence([
                cc.blink(0.6, 2),
                cc.callFunc(() => {
                    GameCtrl.removeCellNode(element);
                })
            ]));
        });

        this._view.node.runAction(cc.sequence([
            cc.delayTime(1),
            cc.callFunc(() => {
                GameCtrl.dropBegin();
            }),
        ]));
    },

    useShaiZi() {
        let row = this._dropCell.comp.row;
        let col = this._dropCell.comp.col;

        let value = 2;

        let left = this.getCellNode(row, col - 1);
        if (left && left.comp.value > value) {
            value = left.comp.value;
        }

        let right = this.getCellNode(row, col + 1);
        if (right && right.comp.value > value) {
            value = right.comp.value;
        }

        let down = this.getCellNode(row - 1, col);
        if (down && down.comp.value > value) {
            value = down.comp.value;
        }

        this._dropCell.runAction(cc.sequence([
            cc.blink(0.8, 2),
            cc.callFunc(() => {
                GameCtrl._dropCell.comp.setValue(value);
            }),
            cc.delayTime(0.5),
            cc.callFunc(() => {
                GameCtrl.merge([GameCtrl._dropCell]);
            })
        ]));

    },

    checkGameOver() {
        let row = MAX_ROW;
        let col = Math.ceil(MAX_COL / 2);
        let node = this.getCellNode(row, col);
        if (node) {
            return true;
        }
        return false;
    },

    gameOver() {
        this.scheduleEnd();
        this._view.showGameOver(this._curScore);
    },

    /**
     * 待合并节点，递归调用
     * @param {Array} toMergeNodes  待监测是否需要合并的节点
     */
    merge(toMergeNodes, comboCount) {
        if (!comboCount) {
            comboCount = 1;
        }
        // cc.log('start merge');
        // this.dumpMatrix();
        let list = [];
        while (toMergeNodes.length > 0) {
            let cellNode = toMergeNodes.shift();
            let ret = this.getLinkList(cellNode);
            if (ret.length > 0) {
                list.push(ret);

                ret.forEach(element => {
                    let idx = toMergeNodes.indexOf(element);
                    if (idx >= 0) {
                        toMergeNodes.splice(idx, 1);
                    }
                });
            }
        }

        let count = list.length;
        let _list = [];
        let cbk = function () {
            if (--count == 0) {
                GameCtrl.merge(_list, comboCount + 1);
            }
        }
        if (count > 0) {
            list.forEach(element => {
                let target = this.getMergeTarget(element);
                _list.push(target);
                this.doMergeAni(target, element, cbk, comboCount);
            });
        } else {
            this.mergeEnd();
        }
    },

    mergeEnd() {
        this.dropBegin();
    },

    doMergeAni(target, list, cbk, comboCount) {
        cc.log('combo num : ', comboCount);
        let row = target.comp.row;
        let col = target.comp.col;
        let value = target.comp.value;

        let newValue = value * Math.pow(2, list.length - 1);

        if (newValue == MAX_VALUE) {
            bp.sound.playChip('2048.mp3');
        } else {
            if (comboCount > 1) {
                bp.sound.playChip('combo.mp3');
            } else {
                bp.sound.playChip('clear.mp3');
            }
        }

        //得分
        let score = newValue * comboCount;

        this.setScore(this._curScore + score);

        let pos = target.getPosition();
        this._view.showScorePlus(score, pos, comboCount > 1);

        for (let i = 0; i < list.length; ++i) {
            let node = list[i];
            if (node != target) {
                let comp = node.comp;
                node.zIndex = -1;
                let act1 = cc.moveTo(0.05, pos);
                let callback = cc.callFunc(() => {
                    this.removeCellNode(node);
                    target.comp.setValue(newValue);
                });
                node.runAction(cc.sequence([act1, callback]));
            }
        }

        target.runAction(cc.sequence([
            cc.delayTime(0.2),
            cc.callFunc(cbk),
        ]))
    },

    getMergeTarget(list) {
        if (list.length == 2) {
            return list[0];
        } else if (list.length == 3) {
            let row = 0;
            let col = 0;
            list.forEach(element => {
                row += element.comp.row;
                col += element.comp.col;
            })
            row = Math.ceil(row / list.length);

            if (list[0].comp.row == list[1].comp.row && list[1].comp.row == list[2].comp.row) {
                col = col / list.length;
            } else if (list[0].comp.col == list[1].comp.col) {
                col = list[0].comp.col;
            } else if (list[0].comp.col == list[2].comp.col) {
                col = list[0].comp.col;
            } else {
                col = list[1].comp.col;
            }
            return this.getCellNode(row, col);
        } else if (list.length == 4) {
            let row = 0;
            let col = 0;
            list.forEach(element => {
                row += element.comp.row;
                col += element.comp.col;
            })
            row = Math.ceil(row / list.length);
            col = Math.ceil(col / list.length);
            return this.getCellNode(row, col);
        } else {
            alert('invalid merge list');
            return list[0];
        }
    },

    getLinkList(cellNode) {
        let ret = [];
        let row = cellNode.comp.row;
        let col = cellNode.comp.col;
        let value = cellNode.comp.value;

        if (value == MAX_VALUE) {
            //2048不再合并
            return ret;
        }

        //left
        let node_l = this.getCellNode(row, col - 1);
        if (node_l && node_l.comp.value == value) {
            ret.push(node_l);

            //left left
            let node_ll = this.getCellNode(row, col - 2);
            if (node_ll && node_ll.comp.value == value) {
                ret.push(node_ll);
            }
        }

        //right
        let node_r = this.getCellNode(row, col + 1);
        if (node_r && node_r.comp.value == value) {
            ret.push(node_r);

            //right right
            let node_rr = this.getCellNode(row, col + 2);
            if (node_rr && node_rr.comp.value == value) {
                ret.push(node_rr);
            }
        }

        //down
        let node_d = this.getCellNode(row - 1, col);
        if (node_d && node_d.comp.value == value) {
            ret.push(node_d);
        }

        if (ret.length > 0) {
            ret.unshift(cellNode);

            let str = '';
            ret.forEach(element => {
                let comp = element.comp;
                str += '(' + comp.row + ',' + comp.col + ')';
            });
            cc.log('link', str);
        }

        return ret;
    },

    /**
     * 开始掉落，此掉落非新创建的数字节点，而是合并后产生空隙，悬空节点掉落填充
     */
    dropBegin() {
        // cc.log('drop_begin');
        this.dropNodes = [];
        this.drop();
    },

    drop() {
        let canDrop = false;
        // cc.log('before drop');
        // this.dumpMatrix();
        for (let col = 1; col <= MAX_COL; ++col) {
            for (let row = 1; row <= MAX_ROW; ++row) {
                let node = this.getCellNode(row, col);
                if (node && this.isEmpty(row - 1, col)) {
                    canDrop = true;
                    if (GameCtrl.dropNodes.indexOf(node) < 0) {
                        GameCtrl.dropNodes.push(node);
                    }
                    let comp = node.comp;
                    comp.setRowCol(row - 1, col);   //该方法会修改节点的位置，下面需还原为当前位置

                    let curPos = this.calcPosition(row, col);
                    let toPos = this.calcPosition(row - 1, col);
                    node.setPosition(curPos);
                    node.runAction(cc.moveTo(MOVE_DURATION, toPos));
                }
            }
        }
        if (canDrop) {
            let delay = cc.delayTime(MOVE_DURATION + 0.5);
            let cbk = cc.callFunc(() => {
                GameCtrl.drop();
            });
            this._view.node.runAction(cc.sequence([delay, cbk]));
        } else {
            GameCtrl.dropEnd();
        }
    },

    dropEnd() {
        // cc.log('drop end');
        // this.dumpMatrix();
        if (this.dropNodes.length > 0) {
            this.merge(this.dropNodes);
        } else {
            this.newCellNode();
        }
    },

    pause() {
        for (let row = 1; row <= MAX_ROW; ++row) {
            for (let col = 1; col <= MAX_COL; ++col) {
                let node = this.getCellNode(row, col);
                node && node.pauseAllActions();
            }
        }
        this._view.node.pauseAllActions();
    },

    resume() {
        for (let row = 1; row <= MAX_ROW; ++row) {
            for (let col = 1; col <= MAX_COL; ++col) {
                let node = this.getCellNode(row, col);
                node && node.resumeAllActions();
            }
        }
        this._view.node.resumeAllActions();
    },

    backHome() {
        this.scheduleEnd();
        this.initMatrix();
        this._view = null;
        cc.director.loadScene('login');
    },

};

module.exports = GameCtrl;
