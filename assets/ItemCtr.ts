
import { _decorator, Component, Node, Label, Button } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ItemCtr')
export class ItemCtr extends Component {

  @property({ type: Label, displayName: "父节点" })
  itemParentLabel: Label = null;
  @property({ type: Label, displayName: "个数" })
  idxLabel: Label = null;
  cb:Function=null;

  name :string="";
  setLb(txt:string,idx:any){
    this.itemParentLabel.string = txt;
    this.idxLabel.string = idx+"";

    this.name = txt;
  }

  onLoad(){
    this.addComponent(Button);
    this.node.on(Button.EventType.CLICK,()=>{
      this.cb(this.name)
    },this)
  }

  registerb(cb:Function){
    this.cb=cb;
  }
}

/**
 * [1] Class member could be defined like this.
 * [2] Use `property` decorator if your want the member to be serializable.
 * [3] Your initialization goes here.
 * [4] Your update function goes here.
 *
 * Learn more about scripting: https://docs.cocos.com/creator/3.0/manual/en/scripting/
 * Learn more about CCClass: https://docs.cocos.com/creator/3.0/manual/en/scripting/ccclass.html
 * Learn more about life-cycle callbacks: https://docs.cocos.com/creator/3.0/manual/en/scripting/life-cycle-callbacks.html
 */
