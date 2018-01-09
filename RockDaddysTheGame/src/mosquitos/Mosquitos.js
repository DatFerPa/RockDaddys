var MosquitosLayer = cc.Layer.extend({
    space: null,
    arrayBloques:[],
    formasEliminar: [],
    spriteFondo: null,
    puntuacion: null,
    segundos: null,
    labelSegundos : null,
    tiempoMaximo : 30,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        this.segundos = new Date();
        this.space = new cp.Space();
        //this.space.gravity = cp.v(0, -350);
        this.puntuacion = new cc.LabelTTF("Quedan " + this.arrayBloques.length + " mosquitos", "Arial", 25);
                // position the label on the center of the screen
                this.puntuacion.x = size.width / 2;
                this.puntuacion.y = size.height - 20;
                // add the label as a child to this layer
                this.addChild(this.puntuacion, 5);
        this.labelSegundos = new cc.LabelTTF("Quedan 30 segundos", "Arial", 25);
                        // position the label on the center of the screen
                        this.labelSegundos.x = size.width / 2;
                        this.labelSegundos.y = 20;
                        // add the label as a child to this layer
                        this.addChild(this.labelSegundos, 5);
        //this.depuracion = new cc.PhysicsDebugNode(this.space);
        //this.addChild(this.depuracion, 10);
        var muroIzquierda = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, 0),// Punto de Inicio
            cp.v(0, size.height),// Punto final
            10);// Ancho del muro
        this.space.addStaticShape(muroIzquierda);

        var muroArriba = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, size.height),// Punto de Inicio
            cp.v(size.width, size.height),// Punto final
            10);// Ancho del muro
        this.space.addStaticShape(muroArriba);

        var muroDerecha = new cp.SegmentShape(this.space.staticBody,
            cp.v(size.width, 0),// Punto de Inicio
            cp.v(size.width, size.height),// Punto final
            10);// Ancho del muro
        this.space.addStaticShape(muroDerecha);

        var muroAbajo = new cp.SegmentShape(this.space.staticBody,
            cp.v(0, 0),// Punto de Inicio
            cp.v(size.width, 0),// Punto final
            10);// Ancho del muro
        this.space.addStaticShape(muroAbajo);

        // Fondo
        this.spriteFondo = cc.Sprite.create(res.fondo_mosquitos_png);
        this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        this.spriteFondo.setScale( size.width / this.spriteFondo.width );
        this.addChild(this.spriteFondo);

        cc.spriteFrameCache.addSpriteFrames(res.mosquito_plist);

        // Evento MOUSE
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown
        }, this);
        this.inicializarBloques();

        this.scheduleUpdate();

        return true;

    },inicializarBloques:function () {
            for(var i = 0; i < 5; i++){
                var spriteBloque = new cc.PhysicsSprite("#mosquito1.png");
                // Masa 1
                var body = new cp.Body(1, cp.momentForBox(1, spriteBloque.width, spriteBloque.height));
                var y = Math.random();
                var x = Math.random();
                console.log("x:" + x + "y:" + y);
                body.p = cc.p(cc.winSize.width*x , cc.winSize.height* y);
                spriteBloque.setBody(body);
                // Este si hay que añadirlo
                this.space.addBody(body);
                var shape = new cp.BoxShape(body, spriteBloque.width, spriteBloque.height);
                this.space.addShape(shape);
                this.addChild(spriteBloque);
                // agregar el Sprite al array Bloques
                this.arrayBloques.push(spriteBloque);
                console.log(i);
                var dir = (Math.random()*-2) + 1;
                spriteBloque.body.applyImpulse(cp.v(100*x*dir,100*y*dir), cp.v(0,0));
            }

      },procesarMouseDown:function(event) {
             // Ambito procesarMouseDown
             var instancia = event.getCurrentTarget();
             var location = event.getLocation();
             // get the location of the touch relative to your button
             for(var i = 0; i < instancia.arrayBloques.length; i++){
                 var nodeSpaceLocation = instancia.arrayBloques[i].getParent().convertToNodeSpace(location);
                 // check if touch is inside node's bounding box
                 if (cc.rectContainsPoint(instancia.arrayBloques[i].getBoundingBox(), nodeSpaceLocation)) {
                   // node has been touched; add code here
                   instancia.formasEliminar.push(instancia.arrayBloques[i].body.shapeList[0]);
                 }
             }


     },update:function (dt) {
        this.space.step(dt);
        var tiempo = Math.round(this.tiempoMaximo + ((this.segundos.getTime()) - new Date().getTime())/1000)
        // Te quedas sin tiempo
        if(tiempo <= 0){
            console.log("Perdido!!");
            cc.audioEngine.stopMusic();
            //cc.director.runScene(new GameOverScene());
        }
        for(var i = 0; i < this.formasEliminar.length; i++) {
                var shape = this.formasEliminar[i];

                for (var j = 0; j < this.arrayBloques.length; j++) {
                  if (this.arrayBloques[j].body.shapeList[0] == shape) {
                      // quita la forma
                      this.space.removeShape(shape);
                      // quita el cuerpo *opcional, funciona igual
                      var spriteMosquito = new cc.PhysicsSprite(res.smack_png);
                      spriteMosquito.setBody(shape.getBody());
                      // quita el sprite
                      this.arrayBloques[j].removeFromParent();
                      // Borrar tambien de ArrayBloques
                      this.arrayBloques.splice(j, 1);
                  }
                }
            }
            this.formasEliminar = [];
        for(var i = 0 ; i < this.arrayBloques.length; i++){
            var mover = Math.random();
            if(mover > 0.5 || this.arrayBloques[i].body.vy < 10){
                var y = Math.random();
                var x = Math.random();
                var dir = (Math.random()*-2) + 1;
                this.arrayBloques[i].body.applyImpulse(cp.v(25*x*dir,25*y*dir), cp.v(0,0));
            }
        }
        this.puntuacion.setString("Quedan " + this.arrayBloques.length + " mosquitos");

        this.labelSegundos.setString("Quedan " + tiempo + " segundos");
        //Se acaba el juego
        if(this.arrayBloques.length == 0){
            console.log("vitoria!");
            cc.audioEngine.stopMusic();
            cc.director.runScene(new KuzcoSceneWin());

        }
     }
});

var MosquitosScene  = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.director.resume();
        //cc.audioEngine.playMusic(res.noseque_wav, true);
        var layer = new MosquitosLayer();
        this.addChild(layer);
    }
});

