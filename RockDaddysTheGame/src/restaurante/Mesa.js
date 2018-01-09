var Mesa = cc.Class.extend({
    layer:null,

    id:null,

    comida:null,

    ocupada:null,
    atendida:null,
    servida:null,

    // Recibe como parametros el id de la mesa (de 1 a 10), la capa y el tamaño del pedido
    ctor:function (id, layer, tam) {
        this.id = id;
        this.layer = layer;

        this.ocupada = false;
        this.atendida = false;
        this.servida = false;

        this.comida = [];
        // Generar un array de x numeros (tam) aleatorios entre 1 y 4
        for(var i=0; i<tam; i++) {
            this.comida[i] = this.layer.randomBetween(1, 4);
        }

    }, ocuparMesa: function() {
       this.ocupada = true;

       // Muestro clientes 
       this.layer.mapa.getLayer("ClientesMesa" + this.id).setVisible(true);

       // Muestro icono
       this.layer.mapa.getLayer("PedidoMesa" + this.id).setVisible(true);

    }, atenderMesa: function() {
        this.atendida=true;

        // Mostrar comida
        var capaUI = this.layer.getParent().getChildByTag(idCapaUI);
        capaUI.mostrarComida(this.comida);

        // Dejo de mostrar icono
        this.layer.mapa.getLayer("PedidoMesa" + this.id).setVisible(false);

    }, servirMesa: function() {
        this.servida = true;
        this.desocuparMesa();
        
    }, desocuparMesa: function() {
        this.ocupada = this.servida = this.atendida = false;

        // Vuelvo a meter la mesa en el array de mesas libres
        this.layer.mesasLibres.push(this.id);
 
        // Quito a los clientes
        this.layer.mapa.getLayer("ClientesMesa" + this.id).setVisible(false);
 
    }, puedeAtenderse: function() {
       return this.ocupada && !this.atendida && !this.servida;

    }, puedeServirse: function() {
       return this.ocupada && this.atendida && !this.servida;

    }
});
