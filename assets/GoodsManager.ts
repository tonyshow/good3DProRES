// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { _decorator, Component, Node, resources, Prefab, instantiate, tween, Collider, RigidBody, ERigidBodyType, Vec3, CameraComponent } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GoodsManager')
export class GoodsManager extends Component {
    @property({ type: CameraComponent, displayName: "相机" })
    camera: CameraComponent = null;
    private offectz = 0; //相机偏移

    start () {
      let cameraHight = this.camera.node.position.y;
      //摄像机旋转角度 _euler
      let cameraRotate = this.camera.node.eulerAngles.x;
      this.offectz = cameraHight / Math.tan((cameraRotate * Math.PI) / 180);
        this.createGoods();
    }

    createGoods(){
      let list = ["chilun_5","mushroom_1","xiaoguaishou_8","yaling_4","youyongquan_6","football_3"]
      list.forEach( (name)=>{
        this.createGood(name);
      } )
    }
    async createGood(name:string){
      let prefab :Prefab=  await this.loadPrefab("Prefab/Goods/"+name);
      if(!!prefab){
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
        nodeTmp.setRotationFromEuler(Math.random()*360,Math.random()*360,Math.random()*360)
        nodeTmp.setParent(this.node);
        let bogidBody =nodeTmp.getComponent(RigidBody);
        if (!!bogidBody) {
          bogidBody.mass = 0.1;
          bogidBody.type = ERigidBodyType.DYNAMIC
          bogidBody.linearDamping = 0.95;
          bogidBody.angularDamping = 0.95;
          bogidBody.addGroup(1);
          bogidBody.useGravity=true;
          bogidBody.allowSleep=true;
          bogidBody.linearFactor = new Vec3(1, 1, 1);//
          bogidBody.angularFactor = new Vec3(0.7, 0.7, 0.7);//
          bogidBody.applyForce(new Vec3(0,-150,0));
        }
        let collider = nodeTmp.getComponent(Collider);
        if (!!collider) {
          collider.enabled = false;
        }
        //to(0.2, { position: new Vec3(initPost.x, 0, initPost.z) })
        tween(nodeTmp).call((nodeTmp: any) => {
          let collider = nodeTmp.getComponent(Collider);
          if (!!collider) {
            collider.enabled = true;
          }
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
