var MenuPrincipalLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // Fondo
        var spriteFondoTitulo= new cc.Sprite(res.menu_titulo_png);
        // Asigno posición central
        spriteFondoTitulo.setPosition(cc.p(size.width / 2, size.height / 2));
        // Lo escalo porque es más pequeño que la pantalla
        spriteFondoTitulo.setScale(size.height / spriteFondoTitulo.height);
        // Añado Sprite a la escena
        this.addChild(spriteFondoTitulo);

        //MenuItemSprite para cada botón
        var menuBotonJugar = new cc.MenuItemSprite(
            new cc.Sprite(res.boton_jugar_png), // IMG estado normal
            new cc.Sprite(res.boton_jugar_pulsado_png), // IMG estado pulsado
            this.pulsarBotonJugar, this);

        // creo el menú pasándole los botones
        var menu = new cc.Menu(menuBotonJugar);
        // Asigno posición central
        menu.setPosition(cc.p(size.width / 2.05, size.height * 0.2));
        // Añado el menú a la escena
        this.addChild(menu);

        return true;
    }, pulsarBotonJugar : function(){
        cc.audioEngine.stopMusic();
        cc.director.runScene(new MenuSeleccionScene());
    }
});

var MenuPrincipalScene = cc.Scene.extend({
    onEnter:function () {
        this._super();

        cc.director.setDisplayStats(false);
        cc.audioEngine.playMusic(res.sonido_inicio_wav, true);

        var layer = new MenuPrincipalLayer();
        this.addChild(layer);
    }
});