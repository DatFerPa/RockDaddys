var PuntuacionLayer = cc.Layer.extend({
    monedasRecogidas:null,
    monedas:0,
    ctor:function(){
        this._super();
         var size = cc.winSize;
         this.monedasRecogidas = new cc.LabelTTF("Monedas: 0", "Helvetica", 40);
         this.monedasRecogidas.setPosition(cc.p(size.width - 150, size.height - 20));
         this.monedasRecogidas.fillStyle = new cc.Color(255, 255, 255, 0);
         this.addChild(this.monedasRecogidas);
         return true;
    },update:function (dt) {

     },agregarMoneda:function(){
        this.monedas++;
        this.monedasRecogidas.setString("Monedas: " + this.monedas);

     }

});