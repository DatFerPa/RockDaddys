
var textoPerder;
var RicardoBarLayer = cc.Layer.extend({
    spriteFondo:null,
    spritePlantilla: null,
    spritePlantillaPapi: null,
    spritePlantillaJugador: null,
    spriteMicky: null,
    personajeLabel: null,
    labelTexto : null,
    labelOpcion1: null,
    labelOpcion2: null,
    cargado: null,
    opcion: false,
    ganar : false,
    perder: false,
    chosenOption: -1,
    karma : 0,
    posDialogo: 0,
    ctor:function () {
        this._super();

        var size = cc.winSize;



        //Fondo
        this.spriteFondo = cc.Sprite.create(res.fondo_png);
        this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        this.spriteFondo.setScale( size.width / this.spriteFondo.width );
        this.addChild(this.spriteFondo);

        //Micky
        this.spriteMicky = cc.Sprite.create(res.ricardo_png);
        this.spriteMicky.setPosition(cc.p(size.width/2 + 190, size.height/2 + 25));
        this.spriteMicky.setScale( 0.25 )
        this.addChild(this.spriteMicky);

        //Plantilla dialogos jugaodr
        this.spritePlantillaJugador = cc.Sprite.create(res.dialogos_jugador);
        this.spritePlantillaJugador.setPosition(cc.p(size.width/2 , size.height/2));
        this.spritePlantillaJugador.setScale( size.width / this.spritePlantillaJugador.width );
        this.spritePlantilla = this.spritePlantillaJugador;
        this.addChild(this.spritePlantilla);

        //Plantilla dialogos personaje
        this.spritePlantillaPapi = cc.Sprite.create(res.dialogos_papito);
        this.spritePlantillaPapi.setPosition(cc.p(size.width/2 , size.height/2));
        this.spritePlantillaPapi.setScale( size.width / this.spritePlantillaJugador.width );


        //Nombre del personaje
        this.personajeLabel = new cc.LabelTTF("", "Arial", 15);
        this.personajeLabel.x = 200;
        this.personajeLabel.y = 170;
        this.addChild(this.personajeLabel, 5);

        //Texto
        this.labelTexto = cc.LabelTTF.create('label text',  'Arial', 12, cc.size(435,100), cc.TEXT_ALIGNMENT_LEFT);
        this.labelTexto.x = 400;
        this.labelTexto.y = 80;
        this.addChild(this.labelTexto, 5);

        //Opcion1
        this.labelOpcion1 = cc.LabelTTF.create('label text',  'Arial', 12, cc.size(500,30), cc.TEXT_ALIGNMENT_LEFT);
        this.labelOpcion1.x = 470;
        this.labelOpcion1.y = 70;
        this.addChild(this.labelOpcion1, 5);
        //Opcion2
        this.labelOpcion2 = cc.LabelTTF.create('label text',  'Arial', 12, cc.size(500,30), cc.TEXT_ALIGNMENT_LEFT);
        this.labelOpcion2.x = 470;
        this.labelOpcion2.y = 40;
        this.addChild(this.labelOpcion2, 5);



        this.cargado = false;
        this.startGame();


        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown
        }, this);
        this.scheduleUpdate();
        return true;

    },procesarMouseDown:function(event) {
         // Ambito procesarMouseDown

          var instancia = event.getCurrentTarget();
          var location = event.getLocation();

          if(instancia.perder){
            cc.director.runScene(new MainMenuScene());
          }
          if(instancia.ganar){
            console.log("eeeeeeeeey");
            cc.director.runScene(new RicardoSceneWin());
          }
          if(instancia.opcion){
            var nodeSpaceLocation = instancia.labelOpcion1.getParent().convertToNodeSpace(location);
            // check if touch is inside node's bounding box
            if (cc.rectContainsPoint(instancia.labelOpcion1.getBoundingBox(), nodeSpaceLocation)) {
               instancia.cargado = false;
               //console.log("opcionA");
               instancia.karma+= texto["dialogo"]["frases"][instancia.posDialogo]["karma"][0];
               instancia.chosenOption= 0;
               instancia.posDialogo ++;

            }
            nodeSpaceLocation = instancia.labelOpcion2.getParent().convertToNodeSpace(location);
            if (cc.rectContainsPoint(instancia.labelOpcion2.getBoundingBox(), nodeSpaceLocation)) {
               instancia.cargado = false;
               //console.log("opcionB");
               instancia.karma+= texto["dialogo"]["frases"][instancia.posDialogo]["karma"][1];
               instancia.chosenOption = 1;
               instancia.posDialogo ++;
            }
          }
          else{
            instancia.cargado = false;
            instancia.posDialogo ++;
            console.log("Dialogo: " + instancia.posDialogo);
            console.log("Frases: " +  texto["dialogo"]["frases"].length);
            if (instancia.posDialogo >= texto["dialogo"]["frases"].length){
               instancia.win();
            }
          }

    },startGame:function(){


    },update: function(dt){
        //console.log(texto);
        if(!this.perder && !this.ganar){
            this.step();
        }else if(!this.ganar){
            this.labelTexto.setString(textoPerder[psj]);
            this.perder = true;
        }


    },step: function(){

        if(!this.cargado){
            var node = texto["dialogo"]["frases"][this.posDialogo];
            if(!node["personaje"]){
               this.personajeLabel.setString(texto["titulo"]);
               this.removeChild(this.spritePlantilla);
               this.spritePlantilla = this.spritePlantillaPapi;
               this.addChild(this.spritePlantilla);

            }
            else{
               this.personajeLabel.setString("Don Julian");
               this.removeChild(this.spritePlantilla);
               this.spritePlantilla = this.spritePlantillaJugador;;
               this.addChild(this.spritePlantilla);
            }
            console.log(this.chosenOption);
            var dialogo = null;
            if(node["content"].length > 1){
                dialogo = node["content"][this.chosenOption];
                this.opcion = false;

            }else{
                 dialogo = node["content"];
                 this.chosenOption = -1;
            }
            if(node["options"].length > 0){
                this.labelOpcion1.setString(node["options"][0]);
                this.labelOpcion2.setString(node["options"][1]);
                this.opcion = true;
            }else{
                this.labelOpcion1.setString("");
                this.labelOpcion2.setString("");
            };
            //console.log(dialogo);
            this.labelTexto.setString(dialogo);
            this.cargado = true;
        }
        if(this.karma < -5){
            this.loose();
        }
    },loose:function(){
        console.log("has perdido");
        this.labelOpcion1.setString("");
        this.labelOpcion2.setString("");
        this.personajeLabel.setString(texto["titulo"]);
        cc.loader.loadJson(res.loose_json ,function(error, data){
            textoPerder = data;
        });
        this.perder = true;
    },win:function(){
        cc.loader.loadJson(res.textos_ricardo_fase2 ,function(error, data){
            texto = data;
        });
        console.log("HAS GANAO, GUAPO");
        this.ganar = true;
        cc.director.runScene(new RicardoSceneWin());

    }

});

var RicardoSceneBar = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new RicardoBarLayer();
        this.addChild(layer);
    }
});