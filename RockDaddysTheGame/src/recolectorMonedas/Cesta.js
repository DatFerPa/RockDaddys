var Cesta = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    body:null,
    ctor:function(gameLayer,position){


        this.gameLayer = gameLayer;

        this.sprite = new cc.PhysicsSprite(res.cesta_png);


        this.body = new cp.Body(5, cp.momentForBox(1,
                this.sprite.getContentSize().width,
                this.sprite.getContentSize().height));

        this.body.setPos(position);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        this.gameLayer.space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body,
        this.sprite.getContentSize().width,
        this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoCesta);

       this.shape.setFriction(1);

        this.gameLayer.space.addShape(this.shape);
        //se podria activar una animacion

        this.gameLayer.addChild(this.sprite,10);
    },derecha:function(){
        console.log("derecha");
        this.body.applyImpulse(cp.v(1500,0),cp.v(0,0));
    },izquierda:function(){
        console.log("izquierda");
        this.body.applyImpulse(cp.v(-1500,0),cp.v(0,0));
    }
});