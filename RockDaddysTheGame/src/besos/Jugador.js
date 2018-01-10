var JugadorBesos = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    body:null,
    layer:null,
    posX:1,
    posY:0,
    tiempoBeso:150,
    animacionActual:null,
    animacionQuieto:null,
    animacionDerecha:null,
    animacionIzquierda:null,
    animacionArriba:null,
    animacionAbajo:null,
    animacionBesoArriba:null,
    animacionBesoAbajo:null,
    animacionBesoDerecha:null,
    animacionBesoIzquierda:null,

    ctor:function (space,position,layer){
        this.space = space;
        this.layer = layer;

        this.sprite = new cc.PhysicsSprite("#caminar_derecha1.png");

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

        this.space.addShape(this.shape);
        //no hace falta ponerle un tipo de colision

        //animacion quieto

        var framesAnimacion = [];
        var frame = cc.spriteFrameCache.getSpriteFrame("#caminar_derecha1.png");
        framesAnimacion.push(frame);
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionQuieto =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - derecha
        var framesAnimacion = [];
        for (var i = 1; i <= 8; i++) {
            var str = "caminar_derecha" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionDerecha =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - izquierda
        var framesAnimacion = [];
        for (var i = 1; i <= 8; i++) {
            var str = "caminar_izquierda" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionIzquierda =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - arriba
        var framesAnimacion = [];
        for (var i = 1; i <= 8; i++) {
            var str = "caminar_arriba" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionArriba =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - abajo
        var framesAnimacion = [];
        for (var i = 1; i <= 8; i++) {
            var str = "caminar_abajo" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionAbajo =
            new cc.RepeatForever(new cc.Animate(animacion));

        // ejecutar la animación
        this.sprite.runAction(this.animacionQuieto);
        this.animacion = this.animacionQuieto;
        layer.addChild(this.sprite,10);

    }, moverIzquierda:function() {
         if (this.animacion != this.animacionIzquierda){
             this.sprite.stopAllActions();
             this.animacion = this.animacionIzquierda;
             this.sprite.runAction(this.animacion);
         }

         this.posX = -1;
         this.posY = 0;

         this.body.vy = 0;
         if ( this.body.vx > -200){
             this.body.applyImpulse(cp.v(-200, 0), cp.v(0, 0));
         }

     }, moverDerecha:function() {
         if (this.animacion != this.animacionDerecha){
             this.sprite.stopAllActions();
             this.animacion = this.animacionDerecha;
             this.sprite.runAction(this.animacion);
         }

         this.posX = 1;
          this.posY = 0;

         this.body.vy = 0;
         if ( this.body.vx < 200){
             this.body.applyImpulse(cp.v(200, 0), cp.v(0, 0));
         }

     }, moverArriba:function() {
         if (this.animacion != this.animacionArriba){
             this.sprite.stopAllActions();
             this.animacion = this.animacionArriba;
             this.sprite.runAction(this.animacion);
         }

         this.posX = 0;
          this.posY = 1;

         this.body.vx = 0;
         if ( this.body.vy < 200){
             this.body.applyImpulse(cp.v(0, 200), cp.v(0, 0));
         }

     }, moverAbajo:function() {
         if (this.animacion != this.animacionAbajo){
             this.sprite.stopAllActions();
             this.animacion = this.animacionAbajo;
             this.sprite.runAction(this.animacion);
         }

         this.posX = 0;
          this.posY = -1;

        this.body.vx = 0;
        if ( this.body.vy > -200){
             this.body.applyImpulse(cp.v(0, -200), cp.v(0, 0));
        }

     }, detener : function() {
       if (this.animacion != this.animacionQuieto){
          this.sprite.stopAllActions();
          this.animacion = this.animacionQuieto;
          this.sprite.runAction(this.animacion);
        }

        this.body.vx = 0;
        this.body.vy = 0;
     }, lanzarBeso : function(){
        if(this.tiempoBeso > 150){
            var beso = new Beso(this.layer,cc.p(this.body.p.x+50*this.posX,this.body.p.y+50*this.posY));
            this.layer.besos.push(beso);
            cc.audioEngine.playEffect(res.beso_wav);
            beso.body.applyImpulse(cp.v(1000*this.posX, 1000*this.posY), cp.v(0, 0));
            this.tiempoBeso = 0;
        }
     },actualizarJugador:function(){
            this.body.setAngle(0);
            this.tiempoBeso++;
            //console.log(this.tiempoBeso);
     }



});