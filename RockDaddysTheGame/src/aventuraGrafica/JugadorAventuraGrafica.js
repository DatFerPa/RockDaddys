var quieto = 0;
var correr = 1;

var JugadorAventuraGrafica = cc.Class.extend({
    estado:0,
    gameLayer:null,
    sprite:null,
    shapeObjetos:null,
    shapeColisiones:null,
    aaCaminar:null,
    aaQuieto:null,
    body:null,
    ctor:function(gameLayer,posicion){
        this.gameLayer = gameLayer;
        var framesAnimacion = [];
        for (var i = 1; i <= 8; i++) {
            var str = "playerrunright_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.aaCaminar = new cc.RepeatForever(new cc.Animate(animacion));


        var framesAnimacion = [];
            for (var i = 1; i <= 5; i++) {
                var str = "playeridleright_0" + i + ".png";
                var frame = cc.spriteFrameCache.getSpriteFrame(str);
                framesAnimacion.push(frame);
            }
            var animacion = new cc.Animation(framesAnimacion, 0.2);
            this.aaQuieto = new cc.RepeatForever(new cc.Animate(animacion));


        this.sprite = new cc.PhysicsSprite("#playeridleright_01.png");
        this.sprite.setScale(2.0,2.0);

        this.body = new cp.Body(5, cp.momentForBox(1,
                this.sprite.getContentSize().width,
                this.sprite.getContentSize().height));

        this.body.setPos(posicion);

        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        this.gameLayer.space.addBody(this.body);

        //forma más grande para detectar la colision con los objetos
        this.shapeObjetos = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width + 40,
            this.sprite.getContentSize().height + 40);
        this.shapeObjetos.setCollisionType(tipoJugador);
        this.shapeObjetos.setSensor(true);

        gameLayer.space.addShape(this.shapeObjetos);
        //forma ajustada para la colisión con los bordes del mapa
        this.shapeColisiones = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width+10,
            this.sprite.getContentSize().height - 20 );

        this.shapeColisiones.setFriction(1);


        gameLayer.space.addShape(this.shapeColisiones);

        this.sprite.runAction(this.aaQuieto);

        gameLayer.addChild(this.sprite,10);

        },moverIzquierda: function(){
            if(this.estado != correr){
                this.estado = correr;
                this.sprite.stopAllActions();
                this.sprite.runAction(this.aaCaminar);
            }
            this.sprite.scaleX = -1;

            this.body.applyImpulse(cp.v(-50, 0), cp.v(0, 0));
        },moverDerecha: function(){
            if(this.estado != correr){
                this.estado = correr;
                this.sprite.stopAllActions();
                this.sprite.runAction(this.aaCaminar);
            }
            this.sprite.scaleX = 1;

            this.body.applyImpulse(cp.v(50, 0), cp.v(0, 0));
        },moverArriba: function(){
             if(this.estado != correr){
                 this.estado = correr;
                 this.sprite.stopAllActions();
                 this.sprite.runAction(this.aaCaminar);

             }
             this.sprite.scaleX = 1;

             this.body.applyImpulse(cp.v(0, 50), cp.v(0, 0));
        },moverAbajo: function(){
               if(this.estado != correr){
                   this.estado = correr;
                   this.sprite.stopAllActions();
                   this.sprite.runAction(this.aaCaminar);
               }
               this.sprite.scaleX = 1;

               this.body.applyImpulse(cp.v(0, -50), cp.v(0, 0));
        }, detener : function() {
               if (this.estado != quieto){
                  this.estado = quieto;
                  this.sprite.stopAllActions();
                  this.animacion = this.aaQuieto;
                  this.sprite.runAction(this.animacion);
                }

                this.body.vx = 0;
                this.body.vy = 0;
        }


});