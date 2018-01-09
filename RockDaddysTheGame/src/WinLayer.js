var WinLayer = cc.LayerColor.extend({
    ctor:function () {
        this._super();
        this._super(cc.color(0, 0, 0, 100));
    
        var size = cc.winSize;

        // Fondo
        var spriteFondoTitulo= new cc.Sprite(res.win_png);
        // Asigno posición central
        spriteFondoTitulo.setPosition(cc.p(size.width / 2, size.height / 2));
        // Lo escalo porque es más pequeño que la pantalla
        spriteFondoTitulo.setScale(size.height / spriteFondoTitulo.height);
        // Añado Sprite a la escena
        this.addChild(spriteFondoTitulo);

        return true;
    }
});
