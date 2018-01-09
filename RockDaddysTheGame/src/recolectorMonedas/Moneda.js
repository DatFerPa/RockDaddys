var Moneda = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    body:null,
    ctor:function(gameLayer,position){

        this.gameLayer = gameLayer;

        var framesAnimacion = [];
        for (var i = 1; i <= 6; i++) {
            var str = "moneda" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        var actionAnimacionBucle =
            new cc.RepeatForever(new cc.Animate(animacion));


        this.sprite = new cc.PhysicsSprite("#moneda1.png");

        //body circular
        this.body = new cp.Body(5, cp.momentForCircle(1, 0, this.sprite.width/2, cp.vzero));

        this.body.setPos(position);
        this.body.setAngle(0);

        this.sprite.setBody(this.body);
        this.gameLayer.space.addBody(this.body);

        this.shape = new cp.CircleShape(this.body , this.sprite.width/2,cp.vzero);
        this.shape.setCollisionType(tipoMoneda);

        this.shape.setSensor(true);

        this.gameLayer.space.addShape(this.shape);

        this.sprite.runAction(actionAnimacionBucle);

        this.gameLayer.addChild(this.sprite,10);

        console.log("moneda generada");


    }, eliminar: function (){
          // quita la forma
          this.gameLayer.space.removeShape(this.shape);

          this.gameLayer.removeChild(this.sprite);
      }


});