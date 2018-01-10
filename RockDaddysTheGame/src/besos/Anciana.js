var AncianaBesos = cc.Class.extend({
    space:null,
    sprite:null,
    besada:false,
    animacionDerecha:null,
    animacionIzquierda:null,
    animacionArriba:null,
    animacionAbajo:null,
    animacionActual:null,
    animacionAnimadora:null,
    shape:null,
    body:null,
    layer:null,
    ctor:function (space,position,layer){

        this.space = space;
        this.layer = layer;

        this.sprite = new cc.PhysicsSprite("#anciana_abajo1.png");

        this.body = new cp.Body(5, cp.momentForBox(1,
                    this.sprite.getContentSize().width,
                    this.sprite.getContentSize().height));

        this.body.setPos(position);
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        this.space.addBody(this.body);

        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setFriction(1);
        this.shape.setElasticity(0);
        this.shape.setCollisionType(tipoAnciana);

        this.space.addShape(this.shape);


        // Crear animación - derecha
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "anciana_derecha" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionDerecha =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - izquierda
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "anciana_izquierda" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionIzquierda =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - arriba
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "anciana_arriba" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionArriba =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - abajo
        var framesAnimacion = [];
        for (var i = 1; i <= 2; i++) {
            var str = "anciana_abajo" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionAbajo =
            new cc.RepeatForever(new cc.Animate(animacion));

        //animacion : animadora
        var framesAnimacion = [];
        for (var i = 1; i <= 10; i++) {
            var str = "animadora" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionAnimadora =
            new cc.RepeatForever(new cc.Animate(animacion));

        this.sprite.runAction(this.animacionAbajo);
        layer.addChild(this.sprite,10);

    }, eliminar: function (){
         this.besada = true;
         this.sprite.stopAllActions();
         this.animacion = this.animacionAnimadora;
         this.shape.setSensor(true);
         this.shape.setCollisionType(tipoAnimadora);
         this.animacion = this.animacionAnimadora;
         this.sprite.runAction(this.animacion);
         this.body.vx = 0;
         this.body.vy = 0;
         this.body.setAngle(0);
      },mover:function(){
        //es muy tarde y no estoy para pensar algoritmos mas guapos
        if(this.besada ==false){
            var aleatorio1 = Math.floor( Math.random()*3);
            var x = 0;
            if(aleatorio1 == 0){
                x = 1;
            }
            if(aleatorio1 == 1){
                x = -1;
            }

            var aleatorio2 = Math.floor( Math.random()*3);
            var y = 0;
            if(aleatorio2 == 0){
                y = 1;
            }
            if(aleatorio2 == 1){
                y = -1;
            }

            this.body.applyImpulse(cp.v(50*x,50*y), cp.v(0,0));
            this.body.setAngle(0);
        }
      }


});