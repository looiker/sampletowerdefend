const EnemyState = {
    Invalid: -1,
    Running: 1,
    EndPath: 2,
    Dead: 3
};
cc.Class({
    extends: cc.Component,

    properties: {
        spriteFrames: {
            default: [],
            type: cc.SpriteFrame
        },
        spriteNode: {
            default: null,
            type: cc.Sprite
        },
        healthProgressBar: {
            default: null,
            type: cc.ProgressBar
        }
    },

    // use this for initialization
    onLoad: function () {
        this.state = EnemyState.Invalid;
        this.node.opacity = 0;
        this.direction = cc.p(0, 0);
        this.currentPathPointCount = 0;
        this.currentHealthCount = 0;
        this.totalHealthCount = 1;
    }
    ,
    initWithData: function (type, pathPoints) {
        //0 - 6
        this.spriteNode.spriteFrame = this.spriteFrames[type];
        this.pathPoints = pathPoints;
        this.node.position = pathPoints[0].position;
        cc.loader.loadRes("./config/monster_config", (err, result)=>{
            if (err){
                cc.log(err);
            }else {
                // cc.log("enemy result = " + JSON.stringify(result));
                cc.log("canrun");
                let config = result.json["enemy_" + type];
                cc.log(JSON.stringify(result.json.enemy_0));
                this.speed = config.speed;
                cc.log("can1run");
                this.currentHealthCount = config.health;
                this.totalHealthCount = config.health;
                this.setState(EnemyState.Running);
            }
        });

    },
    update: function (dt) {
        if (this.state === EnemyState.Running){
            let distance = this.node.position.sub(this.pathPoints[this.currentPathPointCount].position).mag();
            if (distance < 10){
                this.currentPathPointCount ++;
                if (this.currentPathPointCount === this.pathPoints.length){
                    this.setState(EnemyState.EndPath);
                    return
                }
                this.direction = this.pathPoints[this.currentPathPointCount].position.sub(this.node.position).normalize();
            }else {

                    this.node.position = this.node.position.add(this.direction.mul( this.speed * dt));
                }


        }
        this.healthProgressBar.progress = this.currentHealthCount / this.totalHealthCount;
    },
    setState: function (state) {
        if (this.state === state){
            return ;
        }
        switch (state){
            case EnemyState.Running:
                this.node.opacity = 255;
                break;
            case EnemyState.Dead:
                let action = cc.fadeOut(1);
                let sequence = cc.sequence(action, cc.callFunc(()=>{
                    cc.log("死了");
                    this.node.destroy();
                }));
                this.node.runAction(sequence);


                break;
            case EnemyState.EndPath:
                break;
            default:
                break;
        }
        this.state = state;
    },
    isLiving: function () {
        if (this.state === EnemyState.Running){
            return true;
        }
        return false;
    },
    beAttacked: function (damage) {
        this.currentHealthCount -= damage;
        if (this.currentHealthCount < 0){
            this.currentHealthCount = 0;
            this.setState(EnemyState.Dead);
        }
    },
    isDead: function () {
        if (this.state === EnemyState.Dead){
            return true;
        }
        return false;
    }


});
