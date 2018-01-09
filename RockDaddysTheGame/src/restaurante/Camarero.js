var Camarero = cc.Class.extend({
    space:null,
    sprite:null,
    shape:null,
    shapeColision:null,
    body:null,
    layer:null,
    animacionQuieto:null,
    animacionDerecha:null,
    animacionIzquierda:null,
    animacionArriba:null,
    animacionAbajo:null,
    animacion:null, // Actual

    // Comida recogida 
    comida:[],

    ctor:function (space, posicion, layer) {
        this.space = space;
        this.layer = layer;

        // Crear Sprite - Cuerpo y forma
        this.sprite = new cc.PhysicsSprite("#camarero_abajo_01.png");

        // Cuerpo dinamico, SI le afectan las fuerzas
        this.body = new cp.Body(5, Infinity);

        this.body.setPos(posicion);
        //body.w_limit = 0.02;
        this.body.setAngle(0);
        this.sprite.setBody(this.body);

        // Se añade el cuerpo al espacio
        this.space.addBody(this.body);

        // Forma
        this.shape = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height);

        this.shape.setCollisionType(tipoCamarero);
        this.shape.setSensor(true);
        this.space.addShape(this.shape);

        // Forma mas pequeña que es la que verdaderamente colisiona 
        // TODO: CAMBIARLE POSICION AL FONDO DEL BODY
        this.shapeColision = new cp.BoxShape(this.body,
            this.sprite.getContentSize().width,
            this.sprite.getContentSize().height/3);

        this.shapeColision.setFriction(1);
        this.shapeColision.setElasticity(0);
        this.space.addShape(this.shapeColision);

        // Crear animación - quieto
        var framesAnimacion = [];
        var str = "camarero_abajo_01";
        var frame = cc.spriteFrameCache.getSpriteFrame(str);
        framesAnimacion.push(frame);
        var animacion = new cc.Animation(framesAnimacion, 0.1);
        this.animacionQuieto =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - derecha
        var framesAnimacion = [];
        for (var i = 1; i <= 4; i++) {
            var str = "camarero_derecha_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionDerecha =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - izquierda
        var framesAnimacion = [];
        for (var i = 1; i <= 4; i++) {
            var str = "camarero_izquierda_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionIzquierda =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - arriba
        var framesAnimacion = [];
        for (var i = 1; i <= 4; i++) {
            var str = "camarero_arriba_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionArriba =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Crear animación - abajo
        var framesAnimacion = [];
        for (var i = 1; i <= 4; i++) {
            var str = "camarero_abajo_0" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            framesAnimacion.push(frame);
        }
        var animacion = new cc.Animation(framesAnimacion, 0.2);
        this.animacionAbajo =
            new cc.RepeatForever(new cc.Animate(animacion));

        // Ejecutar la animación
        this.sprite.runAction(this.animacionQuieto);
        this.animacion = this.animacionQuieto;
        layer.addChild(this.sprite,10);

    }, moverIzquierda:function() {
        if (this.animacion != this.animacionIzquierda){
            this.sprite.stopAllActions();
            this.animacion = this.animacionIzquierda;
            this.sprite.runAction(this.animacion);
        }

        this.body.vy = 0;
        if ( this.body.vx > -150){
            this.body.applyImpulse(cp.v(-150, 0), cp.v(0, 0));
        }

    }, moverDerecha:function() {
        if (this.animacion != this.animacionDerecha){
            this.sprite.stopAllActions();
            this.animacion = this.animacionDerecha;
            this.sprite.runAction(this.animacion);
        }

        this.body.vy = 0;
        if ( this.body.vx < 150){
            this.body.applyImpulse(cp.v(150, 0), cp.v(0, 0));
        }

    }, moverArriba:function() {
        if (this.animacion != this.animacionArriba){
            this.sprite.stopAllActions();
            this.animacion = this.animacionArriba;
            this.sprite.runAction(this.animacion);
        }

        this.body.vx = 0;
        if ( this.body.vy < 150){
            this.body.applyImpulse(cp.v(0, 150), cp.v(0, 0));
        }

    }, moverAbajo:function() {
        if (this.animacion != this.animacionAbajo){
            this.sprite.stopAllActions();
            this.animacion = this.animacionAbajo;
            this.sprite.runAction(this.animacion);
        }

       this.body.vx = 0;
       if ( this.body.vy > -150){
            this.body.applyImpulse(cp.v(0, -150), cp.v(0, 0));
       }

    }, detener:function() {
      if (this.animacion != this.animacionQuieto){
         this.sprite.stopAllActions();
         this.animacion = this.animacionQuieto;
         this.sprite.runAction(this.animacion);
       }

        this.body.vx = 0;
        this.body.vy = 0;

    }, recogerComida:function(id) {
        this.comida.push(id);

        var capaUI = this.layer.getParent().getChildByTag(idCapaUI);
        capaUI.agregarComida(id);

    }, entregarComida:function(pedido) {
        var capaUI = this.layer.getParent().getChildByTag(idCapaUI);

        // Comprobamos que lo que habia pedido es igual a lo seleccionado, si es asi sumamos una mesa
        // Si se ha equivocado, restamos una mesa de las entregadas
        if(this.comida.length == pedido.length && this.comida.every(function(v, i) { return v === pedido[i]})){
            capaUI.agregarMesa();
        } else {
            capaUI.quitarMesa();
        }

        // Reseteamos lo que habia cogido y la interfaz
        this.comida = [];
        capaUI.quitarComida();

    }
});
