var GameOverLayer = cc.LayerColor.extend({
    ctor:function () {
        this._super();
        this._super(cc.color(0, 0, 0, 100));

        var size = cc.winSize;

        // Fondo game_over_reducido

        var botonGameOver = new cc.MenuItemSprite(
             new cc.Sprite(res.game_over_reducido),
             new cc.Sprite(res.game_over_reducido),
             this.gameOverCLick, this);

        var menu = new cc.Menu(botonGameOver);
        this.addChild(menu);
        return true;
    },gameOverCLick:function(){
        cc.director.runScene(new MenuSeleccionScene());
    }
});
