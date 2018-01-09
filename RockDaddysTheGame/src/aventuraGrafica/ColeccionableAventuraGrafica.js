

var ColeccionableAventuraGrafica = cc.Class.extend({
    cogido:false,
    sprite:null,
    sprite:null,
    shape:null,
    body:null,
    gameLayer:null,
    eliminado:false,
    ctor:function(gameLayer, posicion,item){

        this.gameLayer = gameLayer;

        this.sprite = new cc.PhysicsSprite(item);
        this.body = new cp.Body(5,cp.momentForBox(1,
                  this.sprite.getContentSize().width,
                  this.sprite.getContentSize().height));

        this.body.setPos(posicion);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);
        this.gameLayer.space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body
            ,this.sprite.getContentSize().width + 20
            ,this.sprite.getContentSize().height + 20);

        this.shape.setCollisionType(tipoColeccionable);

        this.shape.setSensor(true);

        this.gameLayer.space.addShape(this.shape);

        this.gameLayer.addChild(this.sprite,10);

    },eliminar: function(){
         this.eliminado = true;
         this.gameLayer.space.removeShape(this.shape);
         this.gameLayer.removeChild(this.sprite);
     }


});