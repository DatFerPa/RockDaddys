var texto;
var stage;
var psj;
var auxTextPosition;
var MenuSeleccionLayer = cc.Layer.extend({
    spriteFondo:null,
    spriteAlberto: null,
    spriteBlank: null,
    spriteMicky: null,
    spriteRicardo: null,
    ctor:function () {
        this._super();
        var size = cc.winSize;
        auxTextPosition = 0;
        this.spriteFondo = cc.Sprite.create(res.fondo_png);
        this.spriteFondo.setPosition(cc.p(size.width/2 , size.height/2));
        this.spriteFondo.setScale( size.width / this.spriteFondo.width );
        this.addChild(this.spriteFondo);

        //Alberto
        this.spriteAlberto = cc.Sprite.create(res.alberto_png);
        this.spriteAlberto.setPosition(cc.p(100, 130));
        this.spriteAlberto.setScale( 0.4 )
        this.addChild(this.spriteAlberto);

        //Blank
        this.spriteBlank = cc.Sprite.create(res.blank_png);
        this.spriteBlank.setPosition(cc.p(310, 120));
        this.spriteBlank.setScale( 0.4 )
        this.addChild(this.spriteBlank);

        //Micky
        this.spriteMicky = cc.Sprite.create(res.micky_png);
        this.spriteMicky.setPosition(cc.p(510, 135));
        this.spriteMicky.setScale( 0.23 )
        this.addChild(this.spriteMicky);

        //Ricardo
        this.spriteRicardo = cc.Sprite.create(res.ricardo_png);
        this.spriteRicardo.setPosition(cc.p(710, 127));
        this.spriteRicardo.setScale( 0.20 )
        this.addChild(this.spriteRicardo);

        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: this.procesarMouseDown
        }, this);

        return true;
    },procesarMouseDown:function(event) {
          // Ambito procesarMouseDown
          var instancia = event.getCurrentTarget();
          var location = event.getLocation();
          var nodeSpaceLocation = instancia.spriteAlberto.getParent().convertToNodeSpace(location);
          if (cc.rectContainsPoint(instancia.spriteAlberto.getBoundingBox(), nodeSpaceLocation)) {
            console.log("Alberto");
            cc.loader.loadJson(res.textos_alberto,function(error, data){
               texto = data;
            });
            stage = "alberto_bar";
            psj = "alberto"
            cc.director.runScene(new BonifacioSceneBar());
          }
          nodeSpaceLocation = instancia.spriteBlank.getParent().convertToNodeSpace(location);
          if (cc.rectContainsPoint(instancia.spriteBlank.getBoundingBox(), nodeSpaceLocation)) {
            console.log("Blank");
            cc.loader.loadJson(res.textos_kuzco,function(error, data){
                texto = data;
            });
            stage = "kuzco_bar";
            psj = "kuzco"
            cc.director.runScene(new KuzcoSceneBar());
          }
          nodeSpaceLocation = instancia.spriteMicky.getParent().convertToNodeSpace(location);
          if (cc.rectContainsPoint(instancia.spriteMicky.getBoundingBox(), nodeSpaceLocation)) {
            console.log("Micky");
            cc.loader.loadJson(res.textos_micky,function(error, data){
                 texto = data;
            });
            stage = "micky_bar";
            psj = "micky"
            cc.director.runScene(new MickySceneBar());
          }
           nodeSpaceLocation = instancia.spriteRicardo.getParent().convertToNodeSpace(location);
          if (cc.rectContainsPoint(instancia.spriteRicardo.getBoundingBox(), nodeSpaceLocation)) {
            console.log("Ricardo");
            cc.loader.loadJson(res.textos_ricardo,function(error, data){
                 texto = data;
            });
            stage = "ricardo_bar";
            psj = "ricardo"
            cc.director.runScene(new RicardoSceneBar());
          }


  }
});

var MenuSeleccionScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        cc.audioEngine.playMusic(res.latin_jazz, true);

        var layer = new MenuSeleccionLayer();
        this.addChild(layer);
    }
});

