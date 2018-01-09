var tipoCesta = 1;
var tipoMoneda = 2;
var tipoMulta = 3;
var tipoDroga = 4;
var RecolectorMonedasLayer = cc.Layer.extend({
    monedas:[],
    drogas:[],
    multas:[],
    drogado: false,
    recolector:null,
    dateInicioJuego:null,
    spriteFondo:null,
    monedasRecogidas:0,
    space: null,
    dateInicioDroga:null,
    size:null,
    drogaEfecto:null,
    formasEliminar:[],
    ctor:function(){
        this._super();
        console.log("Se ejecuta el minijuego de recolectar monedas");
        var size = cc.winSize;
        //cacheamos los plist
        cc.spriteFrameCache.addSpriteFrames(res.moneda_plist);

        this.dateInicioJuego = Date.now();
        this.node = cc.Node.create();
        this.addChild(this.node);

        //definiendo la gravedad
        this.space = new cp.Space();
        this.space.gravity = cp.v(0,-300);

        this.spriteFondo = cc.Sprite.create(res.fondo_jungla);
        this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        this.spriteFondo.setScale(size.width / this.spriteFondo.width);
        this.addChild(this.spriteFondo,-1);

        //this.drogaEfecto = cc.Waves3D(3,size,5,40);

        //muros para bloquear la gorra
        var muroDerecha = new cp.SegmentShape(this.space.staticBody,
                    cp.v(size.width, 0),// Punto de Inicio
                    cp.v(size.width, size.height),// Punto final
                    10);// Ancho del muro
        this.space.addStaticShape(muroDerecha);

        var muroIzquierda = new cp.SegmentShape(this.space.staticBody,
                    cp.v(0, 0),// Punto de Inicio
                    cp.v(0, size.height),// Punto final
                    10);// Ancho del muro
        this.space.addStaticShape(muroIzquierda);


        //this.space.gravity = cp.v(0,0);

        this.depuracion = new cc.PhysicsDebugNode(this.space);
        this.addChild(this.depuracion,10);

        this.recolector = new Cesta(this,cc.p(size.width/2 , size.height*0.1));

        //añadir movimiento a la cesta

        cc.eventManager.addListener({
                    event: cc.EventListener.KEYBOARD,
                    onKeyPressed:  function(keyCode, event){
                        var instancia = event.getCurrentTarget();
                        if(instancia.keyPulsada == keyCode)
                             return;

                        instancia.keyPulsada = keyCode;

                        if( keyCode == 65){
                            //console.log("izquierda keycode");
                            if(instancia.drogado==false){
                                instancia.recolector.izquierda();
                            }else{
                                instancia.recolector.derecha();
                            }
                        }

                        if( keyCode == 68){
                            //console.log("derecha keycode");
                           if(instancia.drogado==false){
                               instancia.recolector.derecha();
                           }else{
                               instancia.recolector.izquierda();
                           }
                        }

                    },
                    onKeyReleased: function(keyCode, event){
                        if(keyCode == 65 || keyCode == 68){
                              var instancia = event.getCurrentTarget();
                              instancia.keyPulsada = null;
                              instancia.recolector.body.vx = 0;
                        }
                    }
                }, this);


        this.size = size;

        //Definir colisiones
        this.space.addCollisionHandler(tipoCesta, tipoMoneda,
          null, this.collisionCestaConMoneda.bind(this), null, null);

        this.space.addCollisionHandler(tipoCesta, tipoDroga,
           null, this.collisionCestaConDroga.bind(this), null, null);

        this.space.addCollisionHandler(tipoCesta, tipoMulta,
           null, this.collisionCestaConMulta.bind(this), null, null);

        //añadir colisiones
        this.generadorMonedas();
        //this.generadorDrogas();
        //activar el update
        this.scheduleUpdate();


        return true;
    },update:function(dt){
        this.space.step(dt);
        this.recolector.body.setAngle(0);

        this.generarItems();

        if(this.recolector.body.vy != 0){
            this.recolector.body.vy = 0;
        }

        if(this.drogado == true){
            if(Date.now()-this.dateInicioDroga>=10000){

                console.log("Se te ha pasado el viaje por las drogas");
                this.drogado = false;
            }
        }


        // Eliminar formas:
        for(var i = 0; i < this.formasEliminar.length; i++) {
             var shape = this.formasEliminar[i];

             for (var i = 0; i < this.monedas.length; i++) {
               if (this.monedas[i].shape == shape) {
                   this.monedas[i].eliminar();
                   this.monedas.splice(i, 1);
               }
             }

             for (var i = 0; i < this.drogas.length; i++) {
                if (this.drogas[i].shape == shape) {
                    this.drogas[i].eliminar();
                    this.drogas.splice(i, 1);
                }
              }

              for (var i = 0; i < this.multas.length; i++) {
              if (this.multas[i].shape == shape) {
                  this.multas[i].eliminar();
                  this.multas.splice(i, 1);
              }
            }
         }
         this.formasEliminar = [];

        var capaControles = this.getParent().getChildByTag(idCapaPuntuacion);

        if(capaControles.monedas == 5){
            cc.director.pause();
             cc.audioEngine.stopMusic();
             this.getParent().addChild(new GameOverLayer());
        }


    },generarItems:function(){
        var tiempoObjetos = Date.now() -this.dateInicioJuego;
        console.log(tiempoObjetos);
        if(tiempoObjetos>=800){
            this.dateInicioJuego = Date.now();
            var itemAGenerar = Math.floor( Math.random()*3);
            if(itemAGenerar==0){
                this.generadorMonedas();
            }else if(itemAGenerar==1){
                this.generadorDrogas();
            }else{
                this.generadorMultas();
            }
        }

    },generadorMonedas:function(){
        var posicionObj = Math.random()*(this.size.width-50)+50
        var moneda = new Moneda(this,cc.p(posicionObj,this.size.height +50));
        this.monedas.push(moneda);
    },generadorDrogas:function(){
        var posicionObj = Math.random()*(this.size.width-50)+50
        var droga = new Droga(this,cc.p(posicionObj,this.size.height +50));
        this.drogas.push(droga);

    },generadorMultas:function(){
        var posicionObj = Math.random()*(this.size.width-50)+50
        var multa = new Multa(this,cc.p(posicionObj,this.size.height +50));
        this.multas.push(multa);
    },collisionCestaConMoneda:function(arbiter,space){
        console.log("choque con moneda");
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[1]);

        var capaControles = this.getParent().getChildByTag(idCapaPuntuacion);
        capaControles.agregarMoneda();

    },collisionCestaConDroga:function(arbiter,space){
        console.log("choque con droga");
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[1]);
        var accion = cc.TintBy.create(10,255,0,255);
        this.spriteFondo.runAction(accion);
        this.recolector.sprite.runAction(cc.Blink.create(10,50));
        this.dateInicioDroga = Date.now();
        this.drogado = true;
    },collisionCestaConMulta:function(arbiter,space){
        console.log("choque con una multa");
        var shapes = arbiter.getShapes();
        this.formasEliminar.push(shapes[1]);

        cc.director.pause();
         cc.audioEngine.stopMusic();
         this.getParent().addChild(new GameOverLayer());
    }



});

var idCapaJuego = 1;
var idCapaPuntuacion = 2;

var RecolectorMonedasScene = cc.Scene.extend({
    onEnter:function(){
        this._super();

        cc.director.resume();
        cc.audioEngine.playMusic(res.musica_fondo_minijuego_RL, true);

        var layer = new RecolectorMonedasLayer();
        this.addChild(layer,0,idCapaJuego);

        var puntuacionLayer = new PuntuacionLayer();
        this.addChild(puntuacionLayer, 0, idCapaPuntuacion);

    }
});