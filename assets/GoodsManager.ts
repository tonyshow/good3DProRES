// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, resources, Prefab, instantiate, tween, Collider, RigidBody, ERigidBodyType, Vec3, CameraComponent, assetManager, RigidBodyComponent, log, error } from 'cc';
import { ItemCtr } from './ItemCtr';
const { ccclass, property } = _decorator;

@ccclass('GoodsManager')
export class GoodsManager extends Component {
  @property({ type: CameraComponent, displayName: "相机" })
  camera: CameraComponent = null;
  private offectz = 0; //相机偏移
  private bundle: any = null;
  private mapList: Array<string> = [];
  private N=100
  private idx=-1;
  private size = 1;
  @property({ type: Prefab, displayName: "预制体" })
  itemPrefab: Prefab = null;

  @property({ type: Node, displayName: "父节点" })
  itemParentNode: Node = null;


  @property({ type: Node, displayName: "父节点" })
  goodsParent: Node = null;

  start() {
    let cameraHight = this.camera.node.position.y;
    //摄像机旋转角度 _euler
    let cameraRotate = this.camera.node.eulerAngles.x;
    this.offectz = cameraHight / Math.tan((cameraRotate * Math.PI) / 180);
    this.createGoods();
  }

  eveTouchItemCB(name:string){
    this.createGood(name)
  }
  //下载子包
  loadSubpackage() {
    return new Promise<Bundle>((resolve, reject) => {
      assetManager.loadBundle("http://localhost:7456/assets/model", (err: any, bundle: Bundle) => {
        let _map = bundle.config.paths._map;
        let listInfo=""
        for (let k in _map) {
          if (k.indexOf("Prefab/") != -1) {
            let itemName = k.replace("Prefab/", "")
            listInfo+=itemName+"#"
            this.mapList.push(itemName)
            let itemNode = instantiate(this.itemPrefab);
            this.itemParentNode.addChild(itemNode)
            let ctr = itemNode.getComponent("ItemCtr");
            (ctr as ItemCtr).setLb(itemName);
            (ctr as ItemCtr).registerb(this.eveTouchItemCB.bind(this) )
          }
        }

        this.N=this.mapList.length;
        log(listInfo)
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
  public loadRemotePrefabByBundle(
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

  eveClearAll(){
    this.goodsParent.removeAllChildren();
    this.idx=-1;
  }
  eveLoadAll(){
   this.mapList.forEach((name) => {
      this.createGood(name);
    })
  }
  async createGoods() {
    this.bundle = await this.loadSubpackage();
    //let list = ["aixin", "huoche", "juzi_half", "kouhong"]
    //list.forEach((name) => {
    //  this.createGood(name);
    //})
  }
  async createGood(name: string) {

    let inc = Math.PI * (3.0 - Math.sqrt(5.0));
    let off = 2.0 / (this.N * 2);//注意保持数值精度
    let newIdxCnt = ++this.idx;
    let y = newIdxCnt * off - 1.0 + (off / 10.0);
    let r = Math.sqrt(1 - y * y);
    let phi = newIdxCnt * inc;
    let pos: Vec3 = new Vec3(Math.cos(phi) * r * this.size, y * this.size, Math.sin(phi) * r * this.size);

    let prefab: Prefab = await this.loadRemotePrefabByBundle("Prefab/" + name);
    if (!!prefab) {
      let nodeTmp = instantiate(prefab);
      this.goodsParent.addChild(nodeTmp);

      let x = Math.random() > 0.5 ? -1 : 1;
      let y = Math.random() > 0.5 ? -1 : 1;
      let z = Math.random() > 0.5 ? -1 : 1;
      let initPost = new Vec3(
        x * Math.random() * 5,
        7,
        z * Math.random() * 9 + this.offectz
      );
      initPost=  pos;
      nodeTmp.setPosition(initPost);
      nodeTmp.scale = new Vec3(0.15, 0.15, 0.15);
      nodeTmp.setRotationFromEuler(Math.random() * 360, Math.random() * 360, Math.random() * 360)
      tween(nodeTmp).call((nodeTmp: any) => {
      }).start();
    }else{
      error("加载失败"+name)
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
