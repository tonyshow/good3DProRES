import { _decorator, Component, Touch,systemEvent, SystemEventType, Vec2, Vec3, Quat } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ComRotate3D')
export class ComRotate3D extends Component {
  private tempQuat = new Quat();
  onLoad() {
    systemEvent.on(SystemEventType.TOUCH_MOVE, this.touchMove, this);
    systemEvent.on(SystemEventType.TOUCH_END, this.touchEnd, this);
  }
  touchMove(touch: Touch){
    const delta = touch.getDelta();
    const axis = new Vec3(-delta.y, delta.x, 0); //旋转轴
    const rad = delta.length() * 0.002; //旋转角度
    const quat_cur = this.node.getRotation();
    Quat.rotateAround(this.tempQuat, quat_cur, axis.normalize(), rad);
    this.node.setRotation(this.tempQuat);
  }
  touchEnd(touch: Touch){

  }
}
