var tipoColeccionable = 1;
var tipoJugador = 2;
var micky = 0;
var kuzco = 1;
var ricardo = 2;
var bonifacio = 3;
var AventuraGrafica = cc.Layer.extend({
    mapa: null,
    size: null,
    nivelSeleccionado:null,
    mapaAncho: null,
    mapaAlto:null,
    jugador:null,
    teclaIzquierda:false,
    teclaDerecha:false,
    teclaArriba:false,
    formasEliminar: [],
    teclaAbajo:false,
    teclaBarra:false,
    coleccionable1: null,
    coleccionable2: null,
    coleccionable1Colected:false,
    coleccionable2Colected:false,
    space:null,
    ctor:function(nivelSeleccionado ){
        this._super();
        this.size = cc.winSize;

        this.nivelSeleccionado = nivelSeleccionado;

        cc.spriteFrameCache.addSpriteFrames(res.playeridleright_plist)
        cc.spriteFrameCache.addSpriteFrames(res.playerrunright_plist);
        this.space = new cp.Space()

        //Depuration mode
       // this.depuracion = new cc.PhysicsDebugNode(this.space);
       // this.addChild(this.depuracion, 10);

        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: this.teclaPulsada,
            onKeyReleased: this.teclaLevantada
        }, this);

        this.space.addCollisionHandler(tipoJugador, tipoColeccionable,
                      null, this.collisionJugadorConColeccionable.bind(this), null, null);
        this.cargarMapa();
        this.scheduleUpdate();

        return true;
    },update:function(dt){
        this.space.step(dt);

        this.jugador.body.setAngle(0);

        if ( this.teclaArriba ){
            this.jugador.moverArriba();
        }
        if (this.teclaIzquierda){
            this.jugador.moverIzquierda();
        }
        if( this.teclaDerecha ){
            this.jugador.moverDerecha();
        }
        if(this.teclaAbajo){
            this.jugador.moverAbajo();
        }
        if ( !this.teclaIzquierda && !this.teclaDerecha ){
            this.jugador.body.vx = 0;
        }
        if(!this.teclaArriba && !this.teclaAbajo){
            this.jugador.body.vy = 0;
        }
        if(!this.teclaIzquierda && !this.teclaDerecha &&
            !this.teclaArriba && !this.teclaAbajo){
            this.jugador.detener();
        }

        if(this.coleccionable1Colected && this.coleccionable2Colected){
            console.log("ganada aventura");
        }

        for(var i = 0; i < this.formasEliminar.length; i++) {
            var shape = this.formasEliminar[i];

            if(this.coleccionable1Colected == false){
                if(this.coleccionable1.shape == shape){
                    this.coleccionable1.eliminar();
                    this.coleccionable1Colected = true;
                }
            }

            if(this.coleccionable2Colected == false){
                if(this.coleccionable2.shape == shape){
                    this.coleccionable2.eliminar();
                    this.coleccionable2Colected = true;
                }
            }
        }
        this.formasEliminar = [];


    },cargarMapa: function(){
        var coleccionableRes1 = null;
        var coleccionableRes2 = null;
        if(this.nivelSeleccionado == micky){
            this.mapa = new cc.TMXTiledMap(res.mapa_micky);
            coleccionableRes1 = res.pastilla_png;
            coleccionableRes2 = res.tacataca_png;
        }
        if(this.nivelSeleccionado == kuzco){
            this.mapa = new cc.TMXTiledMap(res.mapa_kuzco);
            coleccionableRes1 = res.escopeta_png;
            coleccionableRes2 = res.acondicionador_png;
        }
        if(this.nivelSeleccionado == ricardo){
            this.mapa = new cc.TMXTiledMap(res.mapa_ricardo);
            coleccionableRes1 = res.calzoncillo_png;
            coleccionableRes2 = res.parchePirata_png;
        }
        if(this.nivelSeleccionado == bonifacio){
            this.mapa = new cc.TMXTiledMap(res.mapa_albon);
            coleccionableRes1 = res.anillo_png;
            coleccionableRes2 = res.espatula_png;
        }

        this.addChild(this.mapa);
        this.mapaAncho = this.mapa.getContentSize().width;

        var grupoColisiones = this.mapa.getObjectGroup("colisiones");
        var colisionesArray = grupoColisiones.getObjects();

        for (var i = 0; i < colisionesArray.length; i++) {
              var colision = colisionesArray[i];
              var puntos = colision.polylinePoints;
              for(var j = 0; j < puntos.length - 1; j++){
                  var bodyColision = new cp.StaticBody();

                  var shapeColision = new cp.SegmentShape(bodyColision,
                      cp.v(parseInt(colision.x) + parseInt(puntos[j].x),
                          parseInt(colision.y) - parseInt(puntos[j].y)),
                      cp.v(parseInt(colision.x) + parseInt(puntos[j + 1].x),
                          parseInt(colision.y) - parseInt(puntos[j + 1].y)),
                      3);


                  this.space.addStaticShape(shapeColision);
              }
        }




        var grupoColeccionables1 = this.mapa.getObjectGroup("coleccionable1");
        var coleccionable1Array1 = grupoColeccionables1.getObjects();
        this.coleccionable1 = new ColeccionableAventuraGrafica(this,
                cc.p(coleccionable1Array1[0]["x"],coleccionable1Array1[0]["y"]),
                coleccionableRes1);
        console.log("Coleccionable 1 creado");


        var grupoColeccionables2 = this.mapa.getObjectGroup("coleccionable2");
                var coleccionable1Array2 = grupoColeccionables2.getObjects();
        this.coleccionable2 = new ColeccionableAventuraGrafica(this,
                 cc.p(coleccionable1Array2[0]["x"],coleccionable1Array2[0]["y"]),
                 coleccionableRes2);
        console.log("Coleccionable 2 creado");

         var grupoJugador = this.mapa.getObjectGroup("jugador");
         var jugadorArray = grupoJugador.getObjects();
         this.jugador = new JugadorAventuraGrafica(this,
                    cc.p(jugadorArray[0]["x"],jugadorArray[0]["y"]));
         console.log("Jugador creado");



        },collisionJugadorConColeccionable:function (arbiter, space) {
            if(this.teclaBarra){
                var shapes = arbiter.getShapes();
                this.formasEliminar.push(shapes[1]);
            }


         },teclaPulsada: function(keyCode, event){
         var instancia = event.getCurrentTarget();
        console.log("Tecla pulsada "+keyCode);
         // a
         if( keyCode == 65){
             instancia.teclaIzquierda = true;
         }
         // d
         if( keyCode == 68){
             instancia.teclaDerecha = true;
         }
         // w
         if( keyCode == 87){
             instancia.teclaArriba = true;
         }
         // s
         if( keyCode == 83){
             instancia.teclaAbajo = true;
          }
         // Barra espaciadora
         if( keyCode == 32){
             instancia.teclaBarra = true;
         }
     },teclaLevantada:function(keyCode,event){
        var instancia = event.getCurrentTarget();
        console.log("Tecla levantada "+keyCode);
         // a
         if( keyCode == 65){
             instancia.teclaIzquierda = false;
         }
         // d
         if( keyCode == 68){
             instancia.teclaDerecha = false;
         }
         // w
         if( keyCode == 87){
             instancia.teclaArriba = false;
         }
         // s
         if( keyCode == 83){
             instancia.teclaAbajo = false;
          }
         // Barra espaciadora
         if( keyCode == 32){
             instancia.teclaBarra = false;
         }
     }

});

var AventuraGraficaScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        cc.director.resume();
        var layer = new AventuraGrafica(bonifacio);
        this.addChild(layer);
    }
});

var AventuraGraficaSceneMicky = cc.Scene.extend({
    onEnter:function(){
        this._super();
        cc.director.resume();
        var layer = new AventuraGrafica(micky);
        this.addChild(layer);
    }
});

var AventuraGraficaSceneBonifacio = cc.Scene.extend({
    onEnter:function(){
        this._super();
        cc.director.resume();
        var layer = new AventuraGrafica(bonifacio);
        this.addChild(layer);
    }
});

var AventuraGraficaSceneRicardo = cc.Scene.extend({
    onEnter:function(){
        this._super();
        cc.director.resume();
        var layer = new AventuraGrafica(ricardo);
        this.addChild(layer);
    }
});

var AventuraGraficaSceneKuzco = cc.Scene.extend({
    onEnter:function(){
        this._super();
        cc.director.resume();
        var layer = new AventuraGrafica(kuzco);
        this.addChild(layer);
    }
});