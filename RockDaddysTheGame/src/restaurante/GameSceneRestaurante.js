var numMesas = 10;
var numMaxPedido = 5;

// Las zonas de las mesas son el indice (mesa 1, 1; mesa 2, 2 y asi hasta el 10)
var tipoCamarero = 11;
var tipoZonaComida = 12;

var RestauranteGameLayer = cc.Layer.extend({
    camarero:null,
    space:null,
    tecla:0,
    mapa:null,
    mapaAncho:0,
    mapaAlto:0,
    mesas:[],
    mesasLibres:[],
    segundo:60, //frames
    contadorSegundos:0,

    // Indica si esta en la zona de la barra para poder recoger comida
    zonaComida:false,

    // Indica si esta en la zona de alguna de las mesas para atenderla/servirla
    zonaMesa:false,
    // Indica la mesa donde se encuentra
    zonaMesaID:null,

    tiempoOcuparMesa:0,
    tiempoOcuparMesaAux:0,

    ctor:function () {
        this._super();
        var size = cc.winSize;

        cc.spriteFrameCache.addSpriteFrames(res.camarero_plist);

        // Inicializar Space (sin gravedad)
        this.space = new cp.Space();

        // DEPURACION
        //this.depuracion = new cc.PhysicsDebugNode(this.space);
        //this.addChild(this.depuracion, 10);

        this.cargarMapa();
        this.cargarMesas();
        this.tiempoOcuparMesa = this.tiempoOcuparMesaAux = 7; // en segundos

        for(var i=0; i<numMesas; i++) {
            this.mesasLibres[i] = i+1;
        }

        this.scheduleUpdate();

        // La posicion del personaje esta definida en el mapa TMX
        var personajePos = this.mapa.getObjectGroup("Personaje").getObjects()[0];
        this.camarero = new Camarero(this.space, cc.p(personajePos["x"], personajePos["y"]), this);

        // COLISIONES
        
        // Zona barra
        this.space.addCollisionHandler(tipoCamarero, tipoZonaComida,
                                this.inicioZonaComida.bind(this), null, null, this.finZonaComida.bind(this));

        // Zona mesa
        for(var i=1; i<=numMesas; i++) {
            this.space.addCollisionHandler(tipoCamarero, i,
                                    this.inicioZonaMesa.bind(this, i), null, null, this.finZonaMesa.bind(this));
        }
        
        // Teclado
        cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,
                onKeyPressed: this.teclaPulsada,
                onKeyReleased: this.teclaLevantada
        }, this);

        return true;

    },update:function (dt) {
        // Para saber cuando pasa un seguno y actualizar la interfaz
        this.contadorSegundos++;
        if(this.contadorSegundos == this.segundo) {
            this.contadorSegundos=0;

            var capaUI = this.getParent().getChildByTag(idCapaUI);
            capaUI.actualizarTiempo();

            this.tiempoOcuparMesaAux--;
        }

        // Cada x segundos ocupamos una mesa
        if(this.tiempoOcuparMesaAux <= 0) {
            this.tiempoOcuparMesaAux = this.tiempoOcuparMesa;
            this.ocuparMesa();
        }

        this.space.step(dt);

        // MOVIMIENTO CAMARA

        var posicionXCamara = this.camarero.body.p.x - this.getContentSize().width/2;
        var posicionYCamara = this.camarero.body.p.y - this.getContentSize().height/2;

        if ( posicionXCamara < 0 ){
            posicionXCamara = 0;
        }
        if ( posicionXCamara > this.mapaAncho - this.getContentSize().width ){
            posicionXCamara = this.mapaAncho - this.getContentSize().width;
        }

        if ( posicionYCamara < 0 ){
            posicionYCamara = 0;
        }
        if ( posicionYCamara > this.mapaAlto - this.getContentSize().height ){
            posicionYCamara = this.mapaAlto - this.getContentSize().height ;
        }

        this.setPosition(cc.p( - posicionXCamara , - posicionYCamara));

        // MOVIMIENTO PERSONAJE (W, A, S, D)

        // izquierda (a)
        if (this.tecla == 65 ){
                if( this.camarero.body.p.x > 0){
                    this.camarero.moverIzquierda();
                } else {
                    this.camarero.detener();
                }
        }
        
        // derecha (d)
        if (this.tecla == 68 ){
                if( this.camarero.body.p.x < this.mapaAncho){
                    this.camarero.moverDerecha();
                } else {
                    this.camarero.detener();
                }
        }
        
        // arriba (w)
        if (this.tecla == 87 ){
                if( this.camarero.body.p.y < this.mapaAlto){
                    this.camarero.moverArriba();
                } else {
                    this.camarero.detener();
                }
        }

        // abajo (s)
        if (this.tecla == 83 ){
                if( this.camarero.body.p.y > 0){
                    this.camarero.moverAbajo();
                } else {
                    this.camarero.detener();
                }
        }

        // ACCIONES PERSONAJE (Q, E, R)

        // atender mesa (q)
        if (this.tecla == 81 ){
            if(this.zonaMesa) {
                var mesa = this.mesas[this.zonaMesaID-1];

                if(mesa.puedeAtenderse()) {
                    cc.audioEngine.playEffect(res.sonido_atender_wav);
                    mesa.atenderMesa();
                }
            }
        }

        // recoger comida (r de recoger)
        if (this.tecla == 82 ){
            if(this.zonaComida) {
                cc.audioEngine.playEffect(res.sonido_recoger_wav);

                var capaControles = this.getParent().getChildByTag(idCapaControles);
                capaControles.setVisible(true);
            }
        }

        // servir comida en mesa (e de entregar)
        if (this.tecla == 69 ){
            if(this.zonaMesa) {
                var mesa = this.mesas[this.zonaMesaID-1];

                if(mesa.puedeServirse()) {
                    this.camarero.entregarComida(mesa.comida);
                    mesa.servirMesa();
                }
            }
        }

        // ninguna pulsada
        if( this.tecla == 0 ){
            this.camarero.detener();
        }

    }, cargarMapa:function () {
       this.mapa = new cc.TMXTiledMap(res.cafe_tmx);

       // Añadirlo a la Layer
       this.addChild(this.mapa);

       // Ancho del mapa
       this.mapaAncho = this.mapa.getContentSize().width;
       this.mapaAlto = this.mapa.getContentSize().height;

        // Solicitar los objeto dentro de la capa Limites
        var grupoLimites = this.mapa.getObjectGroup("Limites");
        var limitesArray = grupoLimites.getObjects();

        // Los objetos de la capa limites: formas estáticas de Chipmunk ( SegmentShape ).
        for (var i = 0; i < limitesArray.length; i++) {
              var limite = limitesArray[i];
              var puntos = limite.polylinePoints;
              for(var j = 0; j < puntos.length - 1; j++){
                  var bodyLimite = new cp.StaticBody();

                  var shapeLimite = new cp.SegmentShape(bodyLimite,
                      cp.v(parseInt(limite.x) + parseInt(puntos[j].x),
                          parseInt(limite.y) - parseInt(puntos[j].y)),
                      cp.v(parseInt(limite.x) + parseInt(puntos[j + 1].x),
                          parseInt(limite.y) - parseInt(puntos[j + 1].y)),
                      1);

                  shapeLimite.setFriction(1);
                  shapeLimite.setElasticity(0);

                  this.space.addStaticShape(shapeLimite);
              }
        }

        // Los objetos que delimitan las zonas de interaccion (zona barra y zona mesas)
        var limitesZonaComida = this.mapa.getObjectGroup("ZonaComida").getObjects()[0];

        var bodyLimite = new cp.StaticBody();
        bodyLimite.setPos(cc.p(limitesZonaComida["x"]*2,limitesZonaComida["y"]+20));

        var shapeLimite = new cp.BoxShape(bodyLimite,
                    limitesZonaComida["width"],
                    limitesZonaComida["height"]);

        shapeLimite.setFriction(1);
        shapeLimite.setElasticity(0);
        shapeLimite.setSensor(true);
        shapeLimite.setCollisionType(tipoZonaComida);

        this.space.addStaticShape(shapeLimite);

        for(var i=1; i<=numMesas; i++) {
            var limitesMesa = this.mapa.getObjectGroup("ZonaMesa"+i).getObjects()[0];

            var bodyLimite = new cp.StaticBody();
            bodyLimite.setPos(cc.p(limitesMesa["x"]+50,limitesMesa["y"]+50));

            var shapeLimite = new cp.BoxShape(bodyLimite,
                        limitesMesa["width"],
                        limitesMesa["height"]);

            shapeLimite.setFriction(1);
            shapeLimite.setElasticity(0);
            shapeLimite.setSensor(true);
            shapeLimite.setCollisionType(i);

            this.space.addStaticShape(shapeLimite);
        }

    },cargarMesas: function() {
        // Creamos los objetos mesa
        for(var i=1; i<=numMesas; i++) {
            this.mapa.getLayer("ClientesMesa" + i).setVisible(false);
            this.mapa.getLayer("PedidoMesa" + i).setVisible(false);
            
            var tamPedido = this.randomBetween(1, numMaxPedido);
            var mesa = new Mesa(i, this, tamPedido);

            this.mesas.push(mesa);
        }
    },ocuparMesa: function() {
        if(this.mesasLibres.length>0) {
            cc.audioEngine.playEffect(res.sonido_nuevo_cliente_wav);

            // De las mesas que quedan libres escojo una
            var pos = this.randomBetween(0, this.mesasLibres.length-1);
            var mesaId = this.mesasLibres[pos];

            // La ocupo
            this.mesas[mesaId-1].ocuparMesa();

            // La quito de las mesas libres
            this.mesasLibres.splice(pos, 1);
        }

    },teclaPulsada: function(keyCode, event){
         var instancia = event.getCurrentTarget();

         instancia.tecla = keyCode;

    },teclaLevantada: function(keyCode, event){
           var instancia = event.getCurrentTarget();

           if ( instancia.tecla  == keyCode){
              instancia.tecla = 0;
           }

    },inicioZonaComida:function (arbiter, space) {
        // El camarero entra en la zona de la barra (puede recoger comida)
        this.zonaComida = true;

    },finZonaComida:function (arbiter, space) {
        // El camarero sale de la zona de la barra
        this.zonaComida = false;

        var capaControles = this.getParent().getChildByTag(idCapaControles);
        capaControles.setVisible(false);

    },inicioZonaMesa:function (id, arbiter, space) {
        // El camarero entra en la zona de una mesa con id x
        this.zonaMesaID = id;
        this.zonaMesa = true;

    },finZonaMesa:function (arbiter, space) {
        if(this.zonaMesa) {
            var capaUI = this.getParent().getChildByTag(idCapaUI);
            capaUI.noMostrarComida();
        }

        // El camarero sale de la zona de la mesa con id x
        this.zonaMesaID = null;
        this.zonaMesa = false;

    },randomBetween:function (min,max) {
        return Math.floor(Math.random()*(max-min+1)+min);

    }
});

var idCapaJuego = 1;
var idCapaUI = 2;
var idCapaControles = 3;

var RestauranteGameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.audioEngine.playMusic(res.sonido_restaurante_wav, true);

        var layer = new RestauranteGameLayer();
        this.addChild(layer, 0, idCapaJuego);

        var uiLayer = new UILayer();
        this.addChild(uiLayer, 0, idCapaUI);

        var controlesLayer = new ControlesLayer();
        this.addChild(controlesLayer, 0, idCapaControles);
        controlesLayer.setVisible(false);
    }
});
