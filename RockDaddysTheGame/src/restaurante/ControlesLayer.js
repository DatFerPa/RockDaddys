// Capa con el menu para seleccionar la comida que el camarero tiene que llevar a la mesa
var ControlesLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        var size = cc.winSize;

        // BotonComida1
        var botonComida1 = new cc.MenuItemSprite(
            new cc.Sprite(res.comida1_bt_png), // IMG estado normal
            new cc.Sprite(res.comida1_bt_pres_png), // IMG estado pulsado
            this.pulsaComida.bind(this, 1), this);

        // BotonComida2
        var botonComida2 = new cc.MenuItemSprite(
            new cc.Sprite(res.comida2_bt_png), // IMG estado normal
            new cc.Sprite(res.comida2_bt_pres_png), // IMG estado pulsado
            this.pulsaComida.bind(this, 2), this);

        // BotonComida3
        var botonComida3 = new cc.MenuItemSprite(
            new cc.Sprite(res.comida3_bt_png), // IMG estado normal
            new cc.Sprite(res.comida3_bt_pres_png), // IMG estado pulsado
            this.pulsaComida.bind(this, 3), this);

        // BotonComida4
        var botonComida4 = new cc.MenuItemSprite(
            new cc.Sprite(res.comida4_bt_png), // IMG estado normal
            new cc.Sprite(res.comida4_bt_pres_png), // IMG estado pulsado
            this.pulsaComida.bind(this, 4), this);

        // Creamos el menu con los cuatro botones de comida
        var menu = new cc.Menu(botonComida1, botonComida2, botonComida3, botonComida4);
        menu.alignItemsHorizontallyWithPadding(10);
        menu.setPosition(cc.p(size.width / 2, size.height * 0.1));
        this.addChild(menu);

        this.scheduleUpdate();
        return true;

    }, pulsaComida:function(id){
        var camarero = this.getParent().getChildByTag(idCapaJuego).camarero;
        camarero.recogerComida(id);

    }
});
