// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, resources, Prefab, instantiate, tween, Collider, RigidBody, ERigidBodyType, Vec3, CameraComponent, assetManager, RigidBodyComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GoodsManager')
export class GoodsManager extends Component {
  @property({ type: CameraComponent, displayName: "相机" })
  camera: CameraComponent = null;
  private offectz = 0; //相机偏移
  private bundle:any =null;
  start() {
    let cameraHight = this.camera.node.position.y;
    //摄像机旋转角度 _euler
    let cameraRotate = this.camera.node.eulerAngles.x;
    this.offectz = cameraHight / Math.tan((cameraRotate * Math.PI) / 180);
    this.createGoods();
  }

  //下载子包
  loadSubpackage() {
    return new Promise<Bundle>((resolve, reject) => {
      assetManager.loadBundle("http://localhost:7456/assets/model", (err: any, bundle: any) => {
      if (err) {
        resolve(null);
      } else {
        resolve(bundle);
      }
    });
    });
  }

   /**
   * 从远程中的bundle中获取预制体
   * @param bundle
   * @param name
   */
  public   loadRemotePrefabByBundle(
    prefabName: string,
  ) {
    return new Promise<Prefab>((resolve, reject) => {
      this.bundle.load(prefabName + "", Prefab, (err: string, data: Prefab) => {
        if (!!err) {
          reject(null);
        } else {
          resolve(data);
        }
      });
    });
  }

  async createGoods() {
    this.bundle =   await this.loadSubpackage();
    let list = ["Cube", "xiaoguaishou_8", "yaling_4", "youyongquan_6", "football_3","mushroom_1","dapao"]
    list.forEach((name) => {
      this.createGood(name);
    })
  }
  async createGood(name: string) {
    let prefab: Prefab = await this.loadRemotePrefabByBundle("Prefab/" + name);
    if (!!prefab) {
      let nodeTmp = instantiate(prefab);
      this.node.addChild(nodeTmp);

      let x = Math.random() > 0.5 ? -1 : 1;
      let y = Math.random() > 0.5 ? -1 : 1;
      let z = Math.random() > 0.5 ? -1 : 1;
      let initPost = new Vec3(
        x * Math.random() * 4,
        7,
        z * Math.random() * 8 + this.offectz
      );
      nodeTmp.setPosition(initPost);
      nodeTmp.setRotationFromEuler(Math.random() * 360, Math.random() * 360, Math.random() * 360)
      nodeTmp.setParent(this.node);
      let bogidBody = nodeTmp.getComponent(RigidBodyComponent);
      if (!!bogidBody) {
        bogidBody.mass = 0.1;
        bogidBody.enabled=false
        bogidBody.useGravity = false;

      }
      let collider = nodeTmp.getComponent(Collider);
      if (!!collider) {
        collider.enabled = false;
      }
      tween(nodeTmp).call((nodeTmp: any) => {
      }).start();
    }
  }
  loadPrefab(strPrefab: string) {
    return new Promise<Prefab>((resovle, reeject) => {
      resources.load(strPrefab, Prefab, (err, prefab: Prefab) => {
        if (err) {
          resovle(null);
          return;
        }
        resovle(prefab);
      });
    });
  }
}
