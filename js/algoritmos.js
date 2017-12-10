"use strict";

var nivel = 0;
$(document).ready(function(){
	var aceOpciones = {
		maxLines: Infinity,
		readOnly: true
	};

	var editNormal = ace.edit("editNormal");
	editNormal.setTheme("ace/theme/iplastic");
	editNormal.getSession().setMode("ace/mode/javascript");
	editNormal.setOptions(aceOpciones);
	editNormal.renderer.$cursorLayer.element.style.display = "none"

	var editOptima = ace.edit("editOptima");
	editOptima.setTheme("ace/theme/iplastic");
	editOptima.getSession().setMode("ace/mode/javascript");
	editOptima.setOptions(aceOpciones);
	editOptima.renderer.$cursorLayer.element.style.display = "none";

	var grande = 1000;

	$("#mas").click(function(e){
		if(grande === 1000000){
			return;
		}
		e.preventDefault();
		grande *= 10;
		$("#vgrande").text("Cantidad de números (generados aleatoriamente) a probar: "+grande);
	});

	$("#menos").click(function(e){
		if(grande === 1000){
			return
		}
		e.preventDefault();
		grande /= 10;
		$("#vgrande").text("Cantidad de números (generados aleatoriamente) a probar: "+grande);
	});

	$("#rgrande").click(function(){
		var nums = [];
		for(let i = 0; i < grande; i++){
			var num = Math.trunc(Math.random()*100) - 50;
			nums.push(num);
		}

		divideMSS(nums, 0, nums.length - 1, false).then(function(resDV){
			$("#resDV").text("Resultado (optimizada): "+resDV);
		});
		alert("Terminó la forma óptima");

		fuerzaBrutaMSS(nums, nums.length, false).then(function(resFB){
			$("#resFB").text("Resultado (normal): "+resFB);
		});
		alert("Terminó la forma normal");
	});

	$("#resolverN").click(function(){
		var nums = $("#nums").val();
		nums = nums.split(" ");
		for(var i = 0; i < nums.length; i++){
			nums[i] = parseInt(nums[i]);
		}

		$(".animado").empty();
		$("#collapsibleNormal").collapsible("open", 0);
		crearAnimFB(nums);
		fuerzaBrutaMSS(nums, nums.length, true, editNormal).then(function(resFB){
			$("#res").text("Resultado: "+resFB);
		});
	});

	$("#resolverO").click(function(){
		var nums = $("#nums").val();
		nums = nums.split(" ");
		for(var i = 0; i < nums.length; i++){
			nums[i] = parseInt(nums[i]);
		}

		$(".animado").empty();
		$("#collapsibleOptima").collapsible("open", 0);
		crearAnimDV(nums, 0 , nums.length - 1);
		divideMSS(nums, 0, nums.length - 1, true, editOptima).then(function(resDV){
			$("#res").text("Resultado: "+resDV);
		});
		
	});
});

function crearAnimFB(numeros){
	for(var i = 0; i <= numeros.length; i++){
		var espacioFB = document.createElement("div");
		espacioFB.classList.add("espacio");
		espacioFB.setAttribute("id","fb"+i);
		if(numeros[i]){
			espacioFB.innerText = numeros[i];
		}
		else{
			espacioFB.innerText = "Resultado: 0";
			$("#normal").append("<br>");
		}
		$("#normal").append(espacioFB);
	}

	var parcial = document.createElement("div");
	parcial.classList.add("espacio");
	parcial.setAttribute("id","parcialfb");
	parcial.innerText = "Resultado actual: 0";
	$("#normal").append(parcial);
}

function crearAnimDV(numeros, inicio, fin){
	if(inicio != fin){
		$("#optimizada").append("<br>");
		var contenedor = document.createElement("contenedor");
		contenedor.classList.add("cont");
		contenedor.setAttribute("id","n"+nivel);
		$("#optimizada").append(contenedor);
	}	
	for(var i = inicio; i <= fin; i++){
		var espacioDV = document.createElement("div");
		espacioDV.classList.add("espacio");
		espacioDV.setAttribute("id","dv"+i+nivel);
		espacioDV.innerText = numeros[i];
		$("#n"+nivel).append(espacioDV);
	}
}

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

async function divideMSS(arreglo, inicio, fin, animar, editOptima){
	animar && editOptima.gotoLine(1, 0, true);
	animar && await esperar(1000);
	if(inicio == fin){
		animar && editOptima.gotoLine(3, 0, true);
		animar && await esperar(1000);
		return arreglo[inicio];
	}
	animar && editOptima.gotoLine(5, 0, true);
	animar && await esperar(1000);
	var mitad = Math.trunc((inicio+fin)/2);
  
	var sumaIzquierda = 0,
		sumaDerecha = 0,
		sumaCentral = 0,
		suma;
	animar && editOptima.gotoLine(11, 0, true);
	animar && await esperar(1000);
	if(animar === true){
		++nivel;
		animar && crearAnimDV(arreglo, inicio, mitad);
		var izq = await divideMSS(arreglo, inicio, mitad, true, editOptima);
	}else{
		var izq = await divideMSS(arreglo, inicio, mitad);
	}
	
	animar && editOptima.gotoLine(12, 0, true);
	animar && await esperar(1000);
	if(animar === true){
		++nivel;
		animar && crearAnimDV(arreglo, mitad+1, fin);
		var der = await divideMSS(arreglo, mitad+1, fin, true, editOptima);
	}else{
		var der = await divideMSS(arreglo, mitad+1, fin);
	}
	
  
	animar && editOptima.gotoLine(14, 0, true);
	animar && await esperar(1000);
	suma = 0;
	animar && editOptima.gotoLine(15, 0, true);
	animar && await esperar(1000);
	sumaIzquierda = arreglo[mitad];
	for (let i = mitad; i >= inicio ; i--){
		animar && editOptima.gotoLine(17, 0, true);
		animar && await esperar(1000);
		suma += arreglo[i];
		if(suma > sumaIzquierda){
			animar && editOptima.gotoLine(19, 0, true);
			animar && await esperar(1000);
			sumaIzquierda = suma;
		}
		animar && editOptima.gotoLine(20, 0, true);
		animar && await esperar(1000);
	}

	animar && editOptima.gotoLine(23, 0, true);
	animar && await esperar(1000);
	suma = 0;
	animar && editOptima.gotoLine(24, 0, true);
	animar && await esperar(1000);
	sumaDerecha = arreglo[mitad + 1];
	for (let i = mitad + 1; i <= fin; i++){
		animar && editOptima.gotoLine(26, 0, true);
		animar && await esperar(1000);
		//animar && $("#dv"+i+nivel).addClass("actual");
		suma += arreglo[i];
		if(suma > sumaDerecha){
			animar && editOptima.gotoLine(28, 0, true);
			animar && await esperar(1000);
			sumaDerecha = suma;
		}
		//animar && $("#dv"+i+nivel).removeClass("actual");
		animar && editOptima.gotoLine(29, 0, true);
		animar && await esperar(1000);
	}

	animar && editOptima.gotoLine(31, 0, true);
	animar && await esperar(1000);
	sumaCentral = sumaIzquierda + sumaDerecha;
	animar && editOptima.gotoLine(32, 0, true);
	animar && await esperar(1000);

	var valorMaximo = Math.max(izq, der, sumaCentral);
	animar && $(".cont").last().remove();
	animar && $("br").last().remove();
	--nivel;
	return valorMaximo;
}

//Función que bloquea el hilo de ejecución actual porque es llamada con await
function esperar(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}