var TiempoBesosLayer = cc.Layer.extend({
    etiquetaTiempo:null,
    tiempo:0,
    ctor:function () {
        this._super();
        var size = cc.winSize;

        this.tiempo = 3000;
        this.etiquetaTiempo = new cc.LabelTTF("Tiempo restante: " +this.tiempo, "Helvetica", 20);
        this.etiquetaTiempo.setPosition(cc.p(size.width - 120, size.height - 20));
        this.etiquetaTiempo.fillStyle = new cc.Color(255, 255, 255, 0);
        this.addChild(this.etiquetaTiempo);

        return true;

    }, actualizarTiempo:function(){
         this.tiempo--
         this.etiquetaTiempo.setString("Tiempo restante: " + this.tiempo);
         if(this.tiempo <0){
            console.log("perdiste");
            this.etiquetaTiempo.setString("Tiempo restante: 0");
            //cc.director.pause();
            cc.audioEngine.stopMusic();

            cc.director.runScene(new GameOverLayer());
            //this.getParent().addChild(new GameOverLayer());
         }

    }
});
