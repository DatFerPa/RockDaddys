var Droga = cc.Class.extend({
    gameLayer:null,
    sprite:null,
    shape:null,
    body:null,
    ctor:function(gameLayer,position){

        this.gameLayer = gameLayer;

        this.sprite = new cc.PhysicsSprite(res.droga_png);

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

        this.shape.setCollisionType(tipoDroga);

        this.shape.setSensor(true);

        this.gameLayer.space.addShape(this.shape);

        this.gameLayer.addChild(this.sprite,10);
    }, eliminar: function (){
           // quita la forma
           this.gameLayer.space.removeShape(this.shape);

           this.gameLayer.removeChild(this.sprite);
    }

});