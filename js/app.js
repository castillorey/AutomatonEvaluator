//Vis.js
//----------------------------------------------------------------------------------------
// Crea array de nodos
var nodes = new vis.DataSet([]);

// Crea array de aristas
var edges = new vis.DataSet([]);

// Crea el contenedor del grafo
var container = $('#mynetwork')[0];

// Datos del grafo
var data = {
    nodes: nodes,
    edges: edges
};
var options = {
    "edges": {
        "smooth": {
            "forceDirection": "none",
            "roundness": 1
        }
    }
};

// Inicializa el grafo
var network = new vis.Network(container, data, options);

//-----------------------------------------------------------------------------------------------

var noNodos = 0,
    nodoInicial = "",
    nodosFinal = [],
    nodos = [],
    aristas = [],
    cadena,
    cadenaArray,
    cadenaArrayEval,
    mensaje,
    caracteresOut;

// Deshabilita la tecla enter
$(document).keypress(
    function(event){
        if (event.which == '13') {
            event.preventDefault();
        }
    }
);
// Validaciones
    function validarAlfanumerico(input){
        var patron = /^[a-zA-Z0-9]*$/;
        var idElemento = input.getAttribute("id");
        var elemento = input.value;
        if(elemento.search(patron)){
            $('#'+idElemento+'-box').effect("shake",{times:4,distance:10}, 500);
            return false;
        }

        return true;
    }

    function validarVacios(input){

        var idElemento = input.getAttribute("id");
        var elemento = input.value;
        if(elemento.trim() == ""){
            $('#'+idElemento+'-box').effect("shake",{times:4,distance:10}, 500);
            return false
        }

        return true;
    }


    function validarUnCaracter(input){
        var idElemento = input.getAttribute("id");
        var elemento = input.value;
        if(elemento.length > 1){
            $('#'+idElemento+'-box').effect("shake",{times:4,distance:10}, 500);
            return false;
        }

        return true;
    }
    function existenNodos(input){
        if(!nodos){
            alert("No existen nodos, porfavor ingrese uno");
            input.value = "";
            return false;
        }

        return true;
    }
// Agregar nodos
    function agregarNodo(){
    var inputNodo = $("#nodo")[0];
    var nodo = inputNodo.value;
    //Valida el campo
    if (!validarVacios(inputNodo) || !validarUnCaracter(inputNodo) || !validarAlfanumerico(inputNodo)) return;
    //Busca elemento dentro de un array de objetos
    function encontrarNodo(elem) {
        return elem.nombre === nodo;
    }

    if(nodos.findIndex(encontrarNodo) != -1){
        alert("El nodo ingresado ya existe, porfavor ingrese un nodo diferente");
        return;
    }else{

        //Si el nodo es final
        if($("#nodoFinal").is(":checked")){
            nodos.push({nombre:nodo ,noNodo: noNodos, nodoFinal: 1});
            nodes.add({id: noNodos, label: nodo, color: {border: '#111111', background: '#FFDC00'} });
            nodosFinal.push(nodo);
        }else{
            nodos.push({nombre:nodo ,noNodo: noNodos, nodoFinal: 0});
            nodes.add({id: noNodos, label: nodo, color: '#FFDC00'});
        }
        //Si el nodo es inicial
        if($("#nodoInicial").is(":checked")){

            nodoInicial = nodo;

            $("#nodoInicial").prop("checked",false);
            $("#nodoInicial").prop("disabled",true);
            nodos[nodos.findIndex(encontrarNodo)].nodoInicial = 1;
        }
        inputNodo.value = "";

        noNodos++;
    }
}

// Cantidad de veces en repetirse arista ciclica
    function numeroCiclos(nodoOrigen,nodoDestino){
    var cont = 0;
    for(var i = 0; i < aristas.length ; i++){
        if(aristas[0].origen == nodoOrigen && aristas[0].destino == nodoDestino){
            cont++;
        }
    }
    return cont;
}
// Agregar aristas
    function agregarArista(){
    var inputNodoOrigen = $("#nodoOrigen")[0];
    var inputNodoDestino = $("#nodoDestino")[0];
    var inputValorArista = $("#valorArista")[0];

    //Validacion de los campos
    if (!validarVacios(inputNodoOrigen) || !validarUnCaracter(inputNodoOrigen)|| !validarAlfanumerico(inputNodoOrigen)) return;
    if (!validarVacios(inputNodoDestino) || !validarUnCaracter(inputNodoDestino) || !validarAlfanumerico(inputNodoDestino)) return;
    if (!validarVacios(inputValorArista) || !validarUnCaracter(inputValorArista) || !validarAlfanumerico(inputValorArista)) return;

    //valor de los campos
    var nodoOrigen = inputNodoOrigen.value;
    var nodoDestino = inputNodoDestino.value;
    var valorArista = inputValorArista.value;

    //Encontrar posicion del nodo en el array
    function encontrarNodoOrigen(elem) {
        return elem.nombre === nodoOrigen;
    }
    function encontrarNodoDestino(elem) {
        return elem.nombre === nodoDestino;
    }

    var indexNodoOrigen = nodos.findIndex(encontrarNodoOrigen);
    var indexNodoDestino = nodos.findIndex(encontrarNodoDestino);

    //Validacion de existencia de nodos
    if( indexNodoOrigen == -1){
        alert("El nodo origen ingresado no existe, porfavor ingrese un nodo creado");
        return;
    }
    if(indexNodoDestino == -1){
        alert("El nodo destino ingresado no existe, porfavor ingrese un nodo creado");
        return;
    }

    var numCiclos = numeroCiclos(nodoOrigen,nodoDestino);
    if( numCiclos != 0){
        edges.add(
            {from: indexNodoOrigen, to: indexNodoDestino,label:valorArista, arrows: 'to', color:{color:'#111111'}, selfReferenceSize:(10 * numCiclos) + 20}
        );
        console.log("# ciclos:",numCiclos);
    }else{
        edges.add({from: indexNodoOrigen, to: indexNodoDestino,label:valorArista, arrows: 'to', color:{color:'#111111'}});
    }


    aristas.push({origen: nodoOrigen, destino: nodoDestino, peso:valorArista});
    inputNodoOrigen.value = "";
    inputNodoDestino.value = "";
    inputValorArista.value = "";

}

function evaluarCadena(){
    mensaje = "invalida";
    var inputCadena = $("#cadena")[0];
    cadena = inputCadena.value;
    //Valida el campo
    if(!validarVacios(inputCadena) || !existenNodos(inputCadena)) return;

    cadenaArray = cadena.split("");
    cadenaArrayEval = cadenaArray;
    caracteresOut = [];

    recorridoGrafo(nodoInicial);
    alert(mensaje);
}

//Algoritmo para crear relaciones
var herencia = []

    function agregarHerencia (nodoPadre){

        //Para encontrar padre en el array de objetos
        function encontrarPadre(elem){
            return elem.padre === nodoPadre;
        }
        //Agrega objeto padre con hijos vacios
        herencia.push({padre: nodoPadre, hijos: []});

        var padre = herencia[herencia.findIndex(encontrarPadre)];
        var hijos = padre.hijos;

        //Recorre array de aristas para agregar hijos al padre
        for(var i = 0; i < aristas.length; i++){

            if(aristas[i].origen === nodoPadre ){

                if(hijos.indexOf(aristas[i].destino) == -1){
                    hijos.push(aristas[i].destino) ;
                }
            }
        }
    }
    //Llena el array herencia completo
    function crearHerencia(){
        for(var i = 0; i < nodos.length; i++){
            agregarHerencia(nodos[i].nombre);
        }
    }
//---------------------------------------------------------

// Metodo que recorre el grafo
function obtenerArrayValores(origen,destino){
    var arrayValores = [];

    for(var i = 0; i < aristas.length; i++){
        if(aristas[i].origen == origen && aristas[i].destino == destino){
            arrayValores.push(aristas[i].peso);
        }
    }
    return arrayValores;
}

function recorridoGrafo(ultimoNodo){

    crearHerencia();
    function encontrarNodoEnHerencia(elem){
        return elem.padre === ultimoNodo
    }
    var nodoPadre = herencia[herencia.findIndex(encontrarNodoEnHerencia)];
    var hijosNodo = nodoPadre.hijos;
    var caracterEvaluar = cadenaArrayEval[0];

    for(var i = 0; i < hijosNodo.length; i++){
        var nodoHijo = hijosNodo[i];
        var arrayValoresArista = obtenerArrayValores(nodoPadre.padre,nodoHijo);


        console.log("entrada:","UltimoNodo:",nodoPadre.padre,"hijos",hijosNodo,"cadena",cadenaArrayEval,"cadenaFirst",cadenaArrayEval[0],"Hermano",nodoHijo,"caracterEvaluar",caracterEvaluar,"valoresUnion",arrayValoresArista,"arrayOuts:",caracteresOut);
        if(arrayValoresArista.indexOf(cadenaArrayEval[0]) != -1){
            caracteresOut.unshift(cadenaArrayEval[0]);
            cadenaArrayEval.shift();
            recorridoGrafo(nodoHijo);

            if(nodosFinal.indexOf(nodoHijo) != -1 && cadenaArrayEval.length == 0){
                mensaje = "Valida";
                return true;
            }
            if((cadenaArrayEval.length != 0) || ((nodosFinal.indexOf(nodoHijo) == -1) && (cadenaArrayEval.length == 0))){
                console.log("devolvi caracter fuera del for");
                cadenaArrayEval.unshift(caracteresOut[0]);
                caracteresOut.shift();
            }
        }
        
        /*if(i == (hijosNodo.length - 1)){
            console.log("entre y devolvi caracter");
            cadenaArrayEval.unshift(caracteresOut[0]);
            caracteresOut.shift();
        }*/
        console.log("Despues",cadenaArrayEval);
    }
    /*if((cadenaArrayEval.length != 0) || ((nodosFinal.indexOf(nodoHijo) == -1) && (cadenaArrayEval.length == 0))){
        console.log("devolvi caracter fuera del for");
        cadenaArrayEval.unshift(caracteresOut[0]);
        caracteresOut.shift();
    }*/

    //return false;
}


