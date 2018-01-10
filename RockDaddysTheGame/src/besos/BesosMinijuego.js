
var tipoAnciana = 1;
var tipoBeso = 2;
var tipoAnimadora = 3;

var BesosLayer = cc.Layer.extend({
    besos:[],
    formasEliminar:[],
    ancianas:[],//pondremos 4 pero lo planchamos en un array porque si
    animadoras:[],
    jugador:null,
    tecla:0,
    space:null,
    size:null,
    spriteFondo:null,
    ctor:function(){
        this._super();
        this.size = cc.winSize;
        this.space = new cp.Space();

        cc.spriteFrameCache.addSpriteFrames(res.beso_abajo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.beso_arriba_plist);
        cc.spriteFrameCache.addSpriteFrames(res.beso_derecha_plist);
        cc.spriteFrameCache.addSpriteFrames(res.beso_izquierda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caminar_abajo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caminar_arriba_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caminar_derecha_plist);
        cc.spriteFrameCache.addSpriteFrames(res.caminar_izquierda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.anciana_abajo_plist);
        cc.spriteFrameCache.addSpriteFrames(res.anciana_arriba_plist);
        cc.spriteFrameCache.addSpriteFrames(res.anciana_derecha_plist);
        cc.spriteFrameCache.addSpriteFrames(res.anciana_izquierda_plist);
        cc.spriteFrameCache.addSpriteFrames(res.animadora_plist);

        console.log("se ejecuta el minijuego de lanzar besos");

        //depuracion
        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion, 10);

        //fondo
        this.spriteFondo = cc.Sprite.create(res.pista_disco_png);
        this.spriteFondo.setPosition(cc.p(this.size.width/2 , this.size.height/2));
        this.spriteFondo.setScale(this.size.width / this.spriteFondo.width);
        this.addChild(this.spriteFondo,-1);


        //muros para bloquear los movimientos
        var muroDerecha = new cp.SegmentShape(this.space.staticBody,
                    cp.v(this.size.width, 0),// Punto de Inicio
                    cp.v(this.size.width, this.size.height),// Punto final
                    10);// Ancho del muro
        this.space.addStaticShape(muroDerecha);

        var muroIzquierda = new cp.SegmentShape(this.space.staticBody,
                    cp.v(0, 0),// Punto de Inicio
                    cp.v(0, this.size.height),// Punto final
                    10);// Ancho del muro
        this.space.addStaticShape(muroIzquierda);


        var muroArriba = new cp.SegmentShape(this.space.staticBody,
            cp.v(0,0),
            cp.v(this.size.width,0),
            10);
        this.space.addStaticShape(muroArriba);

        var muroAbajo = new cp.SegmentShape(this.space.staticBody,
            cp.v(0,this.size.height),
            cp.v(this.size.width,this.size.height),
            10);
        this.space.addStaticShape(muroAbajo);


        //creamos los participantes
        this.jugador = new JugadorBesos(this.space,
            cc.p(this.size.width/2,this.size.height/2),this);

         var anciana = new AncianaBesos(this.space,
            cc.p(100,100),this);
        this.ancianas.push(anciana);

        var anciana = new AncianaBesos(this.space,
            cc.p(100,300),this);
        this.ancianas.push(anciana);


        var anciana = new AncianaBesos(this.space,
            cc.p(600,300),this);
        this.ancianas.push(anciana);


        var anciana = new AncianaBesos(this.space,
                cc.p(600,100),this);
        this.ancianas.push(anciana);

        this.scheduleUpdate();
        //definimos los controles de movimiento
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada
       }, this);


       //definimos las colisiones
       this.space.addCollisionHandler(tipoAnciana, tipoBeso,
           null, this.colisionAncianaconBeso.bind(this), null, null);

        return true;
    },colisionAncianaconBeso:function(arbiter, space){

              var shapes = arbiter.getShapes();

              this.formasEliminar.push(shapes[0]);
              this.formasEliminar.push(shapes[1]);



    },update:function(dt){
        this.space.step(dt);
            //console.log(this.jugador.body.p);
            this.jugador.actualizarJugador();
            for(var i = 0 ; i < this.ancianas.length;i++){
                this.ancianas[i].mover();
            }

            for(var i = 0 ; i < this.animadoras.length;i++){
                this.animadoras[i].mover();
            }

            // izquierda
           if (this.tecla == 65 ){
                this.jugador.moverIzquierda();
           }
           // derecha
           if (this.tecla == 68 ){
                this.jugador.moverDerecha();
           }
            // arriba
           if (this.tecla == 87 ){
                this.jugador.moverArriba();

           }

           // abajo
           if (this.tecla == 83 ){
                this.jugador.moverAbajo();
           }

           //lanzar beso
           if(this.tecla == 32){
                this.jugador.lanzarBeso();
           }


           // ninguna pulsada
           if( this.tecla == 0 ){
                this.jugador.detener();
           }

           for(var i = 0; i < this.formasEliminar.length; i++) {
                var shape = this.formasEliminar[i];

                for (var r = 0; r < this.ancianas.length; r++) {
                  if (this.ancianas[r].shape == shape) {
                      this.ancianas[r].eliminar();
                      this.animadoras.push(this.ancianas[r]);
                      this.ancianas.splice(r, 1);
                  }
                }

                for (var r = 0; r < this.besos.length; r++) {
                  if (this.besos[r].shape == shape) {
                      this.besos[r].eliminar();
                      this.besos.splice(r, 1);
                  }
                }
            }

            this.formasEliminar = [];

            var capaUI =
                       this.getParent().getChildByTag(idCapaUI);

               capaUI.actualizarTiempo();
            if(this.ancianas.length == 0){
                console.log("ganaste");
                cc.director.runScene(new MickySceneWin());
            }

        },teclaPulsada: function(keyCode, event){
         var instancia = event.getCurrentTarget();

         instancia.tecla = keyCode;

     },teclaLevantada: function(keyCode, event){
           var instancia = event.getCurrentTarget();

           if ( instancia.tecla  == keyCode){
              instancia.tecla = 0;
           }
    }

});

var idCapaJuego = 1;
var idCapaUI = 2;

var BesosScene = cc.Scene.extend({
    onEnter:function(){
        this._super();

        cc.director.resume();
        cc.audioEngine.playMusic(res.party_fiesta_wav, true);

        var layer = new BesosLayer();
        this.addChild(layer,0,idCapaJuego);

        var tiempoBesosLayer = new TiempoBesosLayer();
        this.addChild(tiempoBesosLayer, 0, idCapaUI);


    }


});


