
var textoPerder;
var MickyWinLayer = cc.Layer.extend({
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
    perder: false,
    aventura: false,
    minijuego : false,
    chosenOption: -1,
    karma : 0,
    posDialogo: 0,
    ctor:function () {
        this._super();
        if(auxTextPosition){
            this.posDialogo = auxTextPosition;
        }
        var size = cc.winSize;



        //Fondo
        this.spriteFondo = cc.Sprite.create(res.fondo_micky_fase2);
        this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        this.spriteFondo.setScale( size.width / this.spriteFondo.width );
        this.addChild(this.spriteFondo);

        //Micky
        this.spriteMicky = cc.Sprite.create(res.micky_png);
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
        this.labelTexto = cc.LabelTTF.create('label text',  'Arial', 15, cc.size(420,100), cc.TEXT_ALIGNMENT_LEFT);
        this.labelTexto.x = 400;
        this.labelTexto.y = 80;
        this.addChild(this.labelTexto, 5);

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
            cc.director.runScene(new MainMenuScene());
          }

            instancia.cargado = false;
            instancia.posDialogo ++;
            console.log("Dialogo: " + instancia.posDialogo);
            console.log("Frases: " +  texto["dialogo"]["frases"].length);
            if (instancia.posDialogo >= texto["dialogo"]["frases"].length){
               instancia.win();
            }

          if(instancia.aventura){
            instancia.launchAventura();
          }
          if(instancia.minijuego){
            instancia.launchMinijuego();
          }


    },startGame:function(){


    },update: function(dt){
        if(!this.perder && !this.ganar){
            this.step();
        }else if(!this.ganar){
            this.labelTexto.setString(textoPerder[psj]);
            this.perder = true;
        }


    },step: function(){

        if(!this.cargado){
            var node = texto["dialogo"]["frases"][this.posDialogo];
            if(node["estado"] == 2){
                this.aventura = true;
            }
            if(node["estado"] == 3){
                this.minijuego = true;
            }
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
            var dialogo = node["content"];


            //console.log(dialogo);
            this.labelTexto.setString(dialogo);
            this.cargado = true;
        }
    },win:function(){
        console.log("HAS GANAO, GUAPO");
        stage = psj + "_win";
        this.ganar = true;


    },launchAventura:function(){
        console.log("HORA DE AVENTURAS!");
        this.aventura = false;
        auxTextPosition = this.posDialogo;
        //llamese aquí a la fantabulosa aventura

    },launchMinijuego:function(){
        console.log("STEVEN!");
        this.minijuego = false;
        auxTextPosition = this.posDialogo;
        //llamese aquí al rimbombante minijuego
    }

});

var MickySceneWin = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MickyWinLayer();
        this.addChild(layer);
    }
});