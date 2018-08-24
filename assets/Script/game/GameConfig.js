var cfg = {
    MAX_COL: 5,
    MAX_ROW: 7,
    CELL_WIDTH: 115,
    CELL_HEIGHT: 115,

    MOVE_DURATION: 0.1,
    DELAY_MOVE_DOWN: 1,     //掉落延迟
    DELAY_MOVE_DONE: 0.5,   //掉落到底部后的延迟

    VALUES: [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048],
    
    ORIGINAL_CEIL_VALUE: 32,                         //初始卡点值

    CELL_STATUS : cc.Enum({
        NONE : 0,                   //初始状态
        DROP_DOWN : 1,              //正常下移
        FAST_DOWN : 4,              //快速掉落
        DROP_DELAY : 5,             //相邻两次移动之间的时间缓冲
        DROP_DONE : 6,              //移动结束
    }),
};

cfg.MAX_VALUE = cfg.VALUES[cfg.VALUES.length - 1];
cfg.MAX_CEIL_VALUE = cfg.VALUES[cfg.VALUES.length - 2];

var ITEM_TYPE = cc.Enum({
    CHUI_ZI: cfg.MAX_VALUE + 1,        //锤子标识
    SHAI_ZI: cfg.MAX_VALUE + 2,        //筛子标识
});

cfg.ITEM_TYPE = ITEM_TYPE;

module.exports = cfg;
