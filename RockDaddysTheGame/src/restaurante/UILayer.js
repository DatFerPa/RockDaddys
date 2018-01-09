var UILayer = cc.Layer.extend({
    // Etiquetas para mostrar los datos
    etiquetaTiempo:null,
    etiquetaMesas:null,
    etiquetaComida:null,
    menuPedido:null,

    // Tiempo que queda
    tiempo:0,
    // Mesas servidas
    mesas:0,
    // Numero maximo de mesas servidas (gana)
    maxMesasServidas:0,

    size:0,

    alturaInicial:0,
    ultimaAltura:0,
    contadorComida:0,

    numPlatosPedido:0,

    ctor:function () {
        this._super();
        this.size = cc.winSize;

        // Tiempo maximo del que dispone el jugador
        this.tiempo = 120;

        // Mesas que tiene que servir el jugador
        this.maxMesasServidas = 3;

        // Icono del reloj
        var reloj = cc.Sprite.create(res.reloj_png);
        reloj.setPosition(cc.p(this.size.width * 0.9, this.size.height * 0.89));
        this.addChild(reloj);

        // Etiqueta que muestra el tiempo que queda
        this.etiquetaTiempo = new cc.LabelTTF("0", "Helvetica", 20);
        this.etiquetaTiempo.setPosition(cc.p(this.size.width * 0.94, this.size.height * 0.89));
        this.etiquetaTiempo.fillStyle = new cc.Color(255, 255, 255, 255);
        this.etiquetaTiempo.setString(this.tiempo);

        this.addChild(this.etiquetaTiempo);

        // Etiqueta que muestra el numero de mesas pedidas
        var mesa = cc.Sprite.create(res.mesa_png);
        mesa.setPosition(cc.p(this.size.width * 0.9, this.size.height * 0.80));
        this.addChild(mesa);

        this.etiquetaMesas = new cc.LabelTTF("0", "Helvetica", 20);
        this.etiquetaMesas.setPosition(cc.p(this.size.width * 0.94, this.size.height * 0.80));
        this.etiquetaMesas.fillStyle = new cc.Color(255, 255, 255, 255);
        this.etiquetaMesas.setString(0);

        this.addChild(this.etiquetaMesas);

        // Altura a la que ir mostrando los iconos de la comida recogida
        this.alturaInicial = this.ultimaAltura = 0.75;

        // Menu que muestra lo que desean los clientes
        this.menuPedido = new cc.Menu();
        this.menuPedido.alignItemsHorizontallyWithPadding(10);
        this.menuPedido.setPosition(cc.p(this.size.width / 2, this.size.height * 0.1));
        this.menuPedido.setTag("pedido");

        this.addChild(this.menuPedido);

        this.scheduleUpdate();
        return true;

    }, agregarComida:function(num){
        // Agega una comida a las recogidas por el camarero
        var comida = this.getSpriteComida(num);

        this.ultimaAltura = this.ultimaAltura - 0.09;
        comida.setPosition(cc.p(this.size.width * 0.93, this.size.height * this.ultimaAltura));

        this.contadorComida++;
        comida.setTag("comida" + this.contadorComida);

        this.addChild(comida);

    }, quitarComida:function(num){
        // Quita todas las comidas (se llama cuando se entrega a la mesa)
        for(var i=1; i<=this.contadorComida; i++) {
            this.removeChildByTag("comida" + i);
        }

        this.ultimaAltura = this.alturaInicial;

    }, actualizarTiempo:function() {
        // Mostrar el nuevo tiempo restante
       if(this.tiempo > 0) {
            this.tiempo--;
            this.etiquetaTiempo.setString(this.tiempo);
       } else {
            // PERDER JUEGO

            cc.director.pause();
            cc.audioEngine.stopMusic();
            cc.audioEngine.playEffect(res.sonido_game_over_wav);

            this.getParent().addChild(new GameOverLayer());
       }

    }, agregarMesa:function() {
        cc.audioEngine.playEffect(res.sonido_pedido_bien_wav);

        // Mostrar el nuevo numero de mesas servidas
        this.mesas++;
        this.etiquetaMesas.setString(this.mesas);

        if(this.mesas == this.maxMesasServidas) {
            // GANAR JUEGO

            //cc.director.pause();
            cc.audioEngine.stopMusic();
            cc.audioEngine.playEffect(res.sonido_win_wav);

            //this.getParent().addChild(new WinLayer());
            console.log(auxTextPosition);
            cc.director.runScene(new BonifacioSceneWin());
        }

    }, quitarMesa:function() {
        cc.audioEngine.playEffect(res.sonido_pedido_mal_wav);

        // Restar una mesa a las servidas y mostrarlo
        if(this.mesas > 0) {
            this.mesas--;
            this.etiquetaMesas.setString(this.mesas);
        }

    }, mostrarComida:function(comida) {
        // Mostrar la comida que el cliente quiere pedir
        this.numPlatosPedido = comida.length;

        for(var i=0; i<this.numPlatosPedido; i++) {
            var plato = new cc.MenuItemSprite(
                        this.getSpriteComida(comida[i]), // IMG estado normal
                        this.getSpriteComida(comida[i]), // IMG estado pulsado
                        function(){}, this);
            plato.setTag("plato"+i);

            this.menuPedido.addChild(plato);
            this.menuPedido.alignItemsHorizontallyWithPadding(10);
        }

    }, noMostrarComida:function() {
        // Dejar de mostrar la comida del pedido (cuando sale de la zona)
        for(var i=0; i<this.numPlatosPedido; i++) {
            this.menuPedido.removeChildByTag("plato"+i);
        }

    }, getSpriteComida:function(id) {
        // Devuelve el sprite correspondiente a la comida deseada
        var comida;

        switch(id) {
            case 1:
                comida = cc.Sprite.create(res.comida1_png);
                break;
            case 2:
                comida = cc.Sprite.create(res.comida2_png);
                break;
            case 3:
                comida = cc.Sprite.create(res.comida3_png);
                break;
            case 4:
                comida = cc.Sprite.create(res.comida4_png);
                break;
        }

        return comida;
    }
});
