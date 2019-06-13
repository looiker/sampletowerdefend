import global from './gloabl'

const TowerPosNodeState= {
    Invalid: -1,
    Null: 1,
    BuildMenu: 2 
};

cc.Class({
    extends: cc.Component,

    properties: {
        enemyPathNodes:{
            default: [],
            type: cc.Node
        },
        towerPosNodes:{
            default:[],
            type: cc.Node
        },
        buildMenuPrefab: {
            default: null,
            type: cc.Prefab
        },
    
    },
    onLoad: function () {
      for (let i = 0 ; i < this.towerPosNodes.length; i ++){
          let node = this.towerPosNodes[i];
          this.setState(node, TowerPosNodeState.Null);
          this.setTouchEvent(node);
      };
      global.event.on("build_tower", this.buildTower.bind(this));
       
      },
          setTouchEvent: function (node) {
          node.on(cc.Node.EventType.TOUCH_START, (event)=>{
          cc.log("touch node name = "+ event.target.name);
            this.showBuildMenu(event.target);
          });
        },
          showBuildMenu: function (node) {
            this.closeBuildMenu();
            let menu = cc.instantiate(this.buildMenuPrefab);
            menu.parent = this.node;
            menu.position = node.position;
            this.setState(node, TowerPosNodeState.BuildMenu);
            node.menu = menu;
          },
          closeBuildMenu: function(){
            for(let i=0; i<this.towerPosNodes.length; i++){
                let node = this.towerPosNodes[i];
                if(node.state === TowerPosNodeState.BuildMenu){
                    node.menu.destroy();
                }
            }
          },
          setState: function (node, state)
          {
              if(node.state === state){
              return;
            }
              switch (state)
              {
                case TowerPosNodeState.Null:
                    break;
                case TowerPosNodeState.BuildMenu:
                    break;
                default:
                    break;
              }
        node.state = state;
          },

          buildTower: function(data)
          {  
            cc.log("build tower" + data);
          },
       
          onDestroy: function ()
          {
            global.event.off("build_tower".this.buildTower);
          }

});
