"use strict";

//El nivel indica la fila en la que se deben de poner los números en la animación de DyV
var nivel = 0;

//Funciones de interacción con el HTML
$(document).ready(function(){

	//Configuración para el editor ACE
	var aceOpciones = {
		maxLines: Infinity,
		readOnly: true
	};

	//Crear editor para la forma normal
	var editNormal = ace.edit("editNormal");
	editNormal.setTheme("ace/theme/iplastic");
	editNormal.getSession().setMode("ace/mode/javascript");
	editNormal.setOptions(aceOpciones);
	editNormal.renderer.$cursorLayer.element.style.display = "none"

	//Crear editor para la forma optimizada
	var editOptima = ace.edit("editOptima");
	editOptima.setTheme("ace/theme/iplastic");
	editOptima.getSession().setMode("ace/mode/javascript");
	editOptima.setOptions(aceOpciones);
	editOptima.renderer.$cursorLayer.element.style.display = "none";

	//Variable que indica la cantidad de números a probar para la prueba de muchos valores
	// 1,000 <= grande <= 1,000,000
	//Menos de 1K no se nota y más de 1M tarda mucho
	var grande = 1000;

	//Aumentar la cantidad de números por 10
	$("#mas").click(function(e){
		if(grande === 1000000){
			return;
		}
		e.preventDefault(); //Al usar <a></a> como botón, esta línea evita que funcione como link
		grande *= 10;
		$("#vgrande").text("Cantidad de números (generados aleatoriamente) a probar: "+grande);
	});

	//Disminuir la cantidad de números por 10
	$("#menos").click(function(e){
		if(grande === 1000){
			return
		}
		e.preventDefault(); //Al usar <a></a> como botón, esta línea evita que funcione como link
		grande /= 10;
		$("#vgrande").text("Cantidad de números (generados aleatoriamente) a probar: "+grande);
	});

	//Resolver el problema para números grandes
	$("#rgrande").click(function(){
		var nums = [];
		//Generar números aleatorios enteros entre -100 y 100
		for(let i = 0; i < grande; i++){
			var num = Math.trunc(Math.random()*200) - 100;
			nums.push(num);
		}

		//Ejecutar ambos algoritmos al mismo tiempo con hilos
		//(Aun no implementado)
		divideMSS(nums, 0, nums.length - 1, false).then(function(resDV){
			$("#resDV").text("Resultado (optimizada): "+resDV);
		});
		alert("Terminó la forma óptima");

		fuerzaBrutaMSS(nums, nums.length, false).then(function(resFB){
			$("#resFB").text("Resultado (normal): "+resFB);
		});
		alert("Terminó la forma normal");
	});

	//Resolver el problema para los números introducidos
	//Forma normal (Fuerza bruta)
	$("#resolverN").click(function(){
		var nums = $("#nums").val();
		nums = nums.split(" ");
		//Obtener los valores, convertirlos a números y agregarlos al arreglo
		for(var i = 0; i < nums.length; i++){
			nums[i] = parseInt(nums[i]);
		}

		//Limpiar el <div></div> de las animaciones
		$(".animado").empty();

		//Limpiar el resultado
		$("#res").text("Resultado: ");

		//Abrir el código de la forma normal
		$("#collapsibleNormal").collapsible("open", 0);

		//Crear los <div></div> para cada elemento del arreglo
		crearAnimFB(nums);

		//Ejecutar la función de forma asíncrona
		fuerzaBrutaMSS(nums, nums.length, true, editNormal).then(function(resFB){

			//Imprimir el resultado
			$("#res").text("Resultado: "+resFB);

			//Cerrar el código de la forma normal
			$("#collapsibleNormal").collapsible("close", 0);
		});
	});

	//Resolver el problema para los números introducidos
	//Forma optimizada (Divide y vencerás)
	$("#resolverO").click(function(){
		var nums = $("#nums").val();
		nums = nums.split(" ");
		
		//Obtener los valores, convertirlos a números y agregarlos al arreglo
		for(var i = 0; i < nums.length; i++){
			nums[i] = parseInt(nums[i]);
		}

		//Limpiar el <div></div> de las animaciones
		$(".animado").empty();

		//Limpiar el resultado
		$("#res").text("Resultado: ");

		//Abrir el código de la forma optimizada
		$("#collapsibleOptima").collapsible("open", 0);

		//Mostrar la parte de resultado izquierda, derecha y centro
		resultadosDV();

		//Crear los <div></div> para cada elemento del arreglo
		crearAnimDV(nums, 0 , nums.length - 1);

		//Ejecutar la función de forma asíncrona
		divideMSS(nums, 0, nums.length - 1, true, editOptima).then(function(resDV){
			//Imprimir el resultado
			$("#res").text("Resultado: "+resDV);

			//Cerrar el código de la forma normal
			$("#collapsibleOptima").collapsible("close", 0);
		});
		
	});
});

//Función para crear los <div></div> de cada número. Recibe el arreglo de elementos
function crearAnimFB(numeros){

	//Iterar a través del arreglo y agregar cada elemento a un div
	for(var i = 0; i <= numeros.length; i++){
		var espacioFB = document.createElement("div");
		espacioFB.classList.add("espacio");

		//Identificar cada número con su posición
		espacioFB.setAttribute("id","fb"+i);

		//Si hay un número en el arreglo, se pone como texto
		if(numeros[i]){
			espacioFB.innerText = numeros[i];
		}

		//Si no, se agrega el <div></div> del resultado final
		else{
			espacioFB.innerText = "Resultado: 0";
			$("#normal").append("<br>");
		}
		$("#normal").append(espacioFB);
	}

	//Aquí se agrega el cuadrito de resultados parciales
	var parcial = document.createElement("div");
	parcial.classList.add("espacio");
	parcial.setAttribute("id","parcialfb");
	parcial.innerText = "Resultado actual: 0";
	$("#normal").append(parcial);
}

function crearAnimDV(numeros, inicio, fin){

	//El método sólo se ejecuta cuando el número de elementos que va a crear son más de uno
	if(inicio != fin){

		//Es necesario utilizar un <div></div> contenedor el cual corresponde con el nivel actual
		$("#optimizada").append("<br>");
		var contenedor = document.createElement("div");
		contenedor.classList.add("cont");
		contenedor.setAttribute("id","n"+nivel);
		$("#resIzq").before(contenedor);
		
		//Al igual que en crearAnimDV
		for(var i = inicio; i <= fin; i++){
			var espacioDV = document.createElement("div");
			espacioDV.classList.add("espacio");
			espacioDV.setAttribute("id","dv"+i+nivel);
			espacioDV.innerText = numeros[i];
			$("#n"+nivel).append(espacioDV);
		}
	}
}

//Agregar los <div></div> de resultados
function resultadosDV(){
	var resIzq = document.createElement("div"),
		resDer = document.createElement("div"),
		resCen = document.createElement("div");
	
	resIzq.setAttribute("id","resIzq");
	resDer.setAttribute("id","resDer");
	resCen.setAttribute("id","resCen");

	resIzq.classList.add("espacio");
	resDer.classList.add("espacio");
	resCen.classList.add("espacio");
	
	resIzq.innerText = "Resultado izquierda: 0";
	resDer.innerText = "Resultado derecha: 0";
	resCen.innerText = "Resultado central: 0";

	$("#optimizada").append(resIzq);
	$("#optimizada").append(resDer);
	$("#optimizada").append(resCen);
}

//Algoritmo de fuerza bruta
//Si animar === true, todas las líneas a la derecha del operador && se van a ejecutar
//Si no, no se van a ejecutar
//La función se ejecuta de forma asíncrona, excepto donde se llame a uan función con await
//Las funciones que se llaman con await son bloqueantes
//editNormal es el editor en el que está el código de la forma normal

//removeClass() y addClass() eliminan y añaden respectivamente clases CSS definidas en estilos.css
//esperar() detiene la ejecución con base en el número de mseg indicados
//gotoLine(fila, columna, animarScroll) mueve el cursor a la línea y columna indicada
//text() Pone el texto indicado dentro del elemento HTML
async function fuerzaBrutaMSS(arreglo, tam, animar, editNormal){
	var aux = arreglo[0];
	var cont;

	animar && editNormal.gotoLine(3, 0, true);
	animar && $("#fb"+tam).removeClass("resultado");
	animar && $("#fb0").addClass("actual");
	animar && $("#fb"+tam).text("Resultado: "+aux);
	animar && await esperar(1000);
	
	for (var i = 0; i < tam; i++){
		animar && $("#fb"+(tam - 1)).removeClass("actual");
		
		cont = 0;

		animar && editNormal.gotoLine(5, 0, true);
		animar && await esperar(1000);
		animar && $("#parcialfb").text("Resultado actual: "+cont);
		for (var j = i; j < tam; j++){
			animar && $("#fb"+(j-1)).removeClass("actual");
			animar && $("#fb"+j).addClass("actual");
			animar && $("#parcialfb").text("Resultado actual: "+cont+" + "+arreglo[j]);

			cont = cont + arreglo[j];

			animar && editNormal.gotoLine(7, 0, true);
			animar && await esperar(1000);
			animar && $("#parcialfb").text("Resultado actual: "+cont);
			animar && await esperar(1000);

			if (cont > aux){
				aux = cont;

				animar && editNormal.gotoLine(9, 0, true);
				animar && $("#fb"+tam).addClass("resultado");
				animar && $("#fb"+tam).text("Resultado: "+aux);
				animar && await esperar(1000);
				animar && $("#fb"+tam).removeClass("resultado");
			}

			animar && editNormal.gotoLine(10, 0, true);
			animar && await esperar(1000);
		}
	}

	animar && $("#fb"+(tam - 1)).removeClass("actual");
	animar && $("#fb"+tam).addClass("resultado");
	animar && editNormal.gotoLine(13, 0, true);
	animar && $("#fb"+tam).text("Resultado final: "+aux);

	return aux;
}

//Algoritmo de divide y vencerás
//Si animar === true, todas las líneas a la derecha del operador && se van a ejecutar
//Si no, no se van a ejecutar
//La función se ejecuta de forma asíncrona, excepto donde se llame a uan función con await
//Las funciones que se llaman con await son bloqueantes
//editOptima es el editor en el que está el código de la forma normal
//Las llamadas recursivas DEBEN ejecutarse con await para funcionar

//removeClass() y addClass() eliminan y añaden respectivamente clases CSS definidas en estilos.css
//esperar() detiene la ejecución con base en el número de mseg indicados
//gotoLine(fila, columna, animarScroll) mueve el cursor a la línea y columna indicada
//text() Pone el texto indicado dentro del elemento HTML
//remove() Elimina el elemento seleccionado
async function divideMSS(arreglo, inicio, fin, animar, editOptima){
	
	animar && editOptima.gotoLine(1, 0, true);
	animar && await esperar(1000);

	if(inicio == fin){

		--nivel;
		animar && $("#dv"+inicio+nivel).addClass("actual");
		animar && editOptima.gotoLine(3, 0, true);
		animar && await esperar(1000);
		animar && $("#dv"+inicio+nivel).removeClass("actual");

		return arreglo[inicio];
	}

	animar && editOptima.gotoLine(5, 0, true);
	animar && await esperar(1000);

	var mitad = Math.trunc((inicio+fin)/2);
	var sumaIzquierda = 0,
		sumaDerecha = 0,
		sumaCentral = 0,
		suma;

	$("#resIzq").text("Resultado izquierda: 0");
	$("#resDer").text("Resultado derecha: 0");
	$("#resCen").text("Resultado central: 0");
	$("#resIzq").removeClass("resultado");
	$("#resDer").removeClass("resultado");
	$("#resCen").removeClass("resultado");
	animar && editOptima.gotoLine(11, 0, true);
	animar && await esperar(1000);

	//
	if(animar === true){
		animar && ++nivel;
		animar && crearAnimDV(arreglo, inicio, mitad);

		var izq = await divideMSS(arreglo, inicio, mitad, true, editOptima);
	}else{
		var izq = await divideMSS(arreglo, inicio, mitad);
	}

	$("#resIzq").text("Resultado izquierda: "+izq);
	animar && editOptima.gotoLine(12, 0, true);
	animar && await esperar(1000);

	if(animar === true){
		++nivel;
		animar && crearAnimDV(arreglo, mitad+1, fin);

		var der = await divideMSS(arreglo, mitad+1, fin, true, editOptima);
	}else{
		var der = await divideMSS(arreglo, mitad+1, fin);
	}
	$("#resDer").text("Resultado derecha: "+der);
	animar && editOptima.gotoLine(14, 0, true);
	animar && await esperar(1000);

	suma = 0;

	animar && editOptima.gotoLine(15, 0, true);
	animar && await esperar(1000);

	sumaIzquierda = arreglo[mitad];

	$("#resCen").text("Resultado central: "+sumaIzquierda);
	for (let i = mitad; i >= inicio ; i--){
		animar && editOptima.gotoLine(17, 0, true);
		animar && await esperar(1000);
		animar && $("#dv"+i+nivel).addClass("actual");

		suma += arreglo[i];

		if(suma > sumaIzquierda){
			animar && editOptima.gotoLine(19, 0, true);
			animar && await esperar(1000);

			sumaIzquierda = suma;

			$("#resCen").text("Resultado central: "+sumaIzquierda);
		}

		animar && await esperar(1000);
		animar && $("#dv"+i+nivel).removeClass("actual");
		animar && editOptima.gotoLine(20, 0, true);
		animar && await esperar(1000);
	}
	$("#resCen").text("Resultado central: "+sumaIzquierda);
	animar && editOptima.gotoLine(23, 0, true);
	animar && await esperar(1000);

	suma = 0;

	animar && editOptima.gotoLine(24, 0, true);
	animar && await esperar(1000);

	sumaDerecha = arreglo[mitad + 1];

	$("#resCen").text("Resultado central: "+sumaIzquierda+"+"+sumaDerecha);
	for (let i = mitad + 1; i <= fin; i++){
		animar && editOptima.gotoLine(26, 0, true);
		animar && await esperar(1000);
		animar && $("#dv"+i+nivel).addClass("actual");

		suma += arreglo[i];

		if(suma > sumaDerecha){
			animar && editOptima.gotoLine(28, 0, true);
			animar && await esperar(1000);

			sumaDerecha = suma;

			$("#resCen").text("Resultado central: "+sumaIzquierda+"+"+sumaDerecha);
		}

		animar && await esperar(1000);
		animar && $("#dv"+i+nivel).removeClass("actual");
		animar && editOptima.gotoLine(29, 0, true);
		animar && await esperar(1000);
	}

	$("#resCen").text("Resultado central: "+sumaIzquierda+"+"+sumaDerecha);
	animar && editOptima.gotoLine(31, 0, true);
	animar && await esperar(1000);

	sumaCentral = sumaIzquierda + sumaDerecha;

	$("#resCen").text("Resultado central: "+sumaCentral);
	animar && editOptima.gotoLine(32, 0, true);
	animar && await esperar(1000);

	var valorMaximo;
	//Yo sé que existe Math.max() pero necesito saber exactamente cual es el mayor
    if(izq > der){
        if(izq > sumaCentral){
			$("#resIzq").addClass("resultado");
            valorMaximo = izq;
        }
        else{
			$("#resCen").addClass("resultado");
            valorMaximo = sumaCentral;
        }
    }
    else{
        if(der > sumaCentral){
			$("#resDer").addClass("resultado");
            valorMaximo = der;
        }
        else{
			$("#resCen").addClass("resultado");
            valorMaximo = sumaCentral;
        }
	}
	
	animar && await esperar(1000);
	animar && $(".cont").last().remove();
	animar && $("br").last().remove();
	--nivel;

	return valorMaximo;
}

//Función que bloquea el hilo de ejecución actual porque es llamada con await
//Regresa una promesa que ejecuta una función vacía después de que pasen el número de mseg indicados
function esperar(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}