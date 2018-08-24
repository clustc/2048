const MOVE_LR_SPAN = 80;        
const MOVE_DOWN_SPAN = 120;

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this._start_pos = null;


        this.node.on('touchstart', this.onTouchStart, this);
        this.node.on('touchmove', this.onTouchMove, this);
        this.node.on('touchend', this.onTouchEnd, this);
        this.node.on('touchcancel', this.onTouchEnd, this);

        this.preDir = 0;
    },

    onTouchStart(event){
        this._start_pos = event.getLocation();
        this.preDir = 0;
    },

    onTouchMove(event){
        let curDir = event.getLocation().x - event.getPreviousLocation().x;
        if(this.preDir * curDir < 0){
            //左右滑动方向发生变化
            this.preDir = curDir;
            this._start_pos = event.getLocation();
        }
        

        let cur_pos = event.getLocation();
        if(Math.abs(cur_pos.x - this._start_pos.x) > MOVE_LR_SPAN ){
                  if(cur_pos.x - this._start_pos.x > 0){
                bp.event.emit('right');
            }else{
                bp.event.emit('left');
            }
            this._start_pos = cur_pos;
        }else if(Math.abs(cur_pos.y - this._start_pos.y) > MOVE_DOWN_SPAN){
                 if(cur_pos.y < this._start_pos.y){
                bp.event.emit('down');
            }
            this._start_pos = cur_pos;
        }

    },

    onTouchEnd(event){
        // cc.log('touch_end');
    },
});
