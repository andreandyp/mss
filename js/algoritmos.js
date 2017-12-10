"use strict";

$(document).ready(function(){
	var aceOpciones = {
		maxLines: Infinity
	};

	var editNormal = ace.edit("editNormal");
	editNormal.setTheme("ace/theme/iplastic");
	editNormal.getSession().setMode("ace/mode/javascript");
	editNormal.setOptions(aceOpciones);
	editNormal.renderer.$cursorLayer.element.style.display = "none"

	var editOptima = ace.edit("editOptima");
	editOptima.setTheme("ace/theme/iplastic");
	editOptima.getSession().setMode("ace/mode/javascript");
	editNormal.setOptions(aceOpciones);
	editNormal.renderer.$cursorLayer.element.style.display = "none"

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

		var resDV = divideMSS(nums, 0, nums.length - 1);
		$("#resDV").text("Resultado (optimizada): "+resDV);
		alert("Terminó la forma rápida");
		
		fuerzaBrutaMSS(nums, nums.length, false).then(function(resFB){
			$("#resFB").text("Resultado (normal): "+resFB);
		});
		alert("Terminó la forma lenta");
		
	});


	$("#resolver").click(function(){
		var nums = $("#nums").val();
		nums = nums.split(" ");
		for(var i = 0; i < nums.length; i++){
			nums[i] = parseInt(nums[i]);
		}

		$(".animado").empty();
		crearAnimDV(nums);

		var resDV = divideMSS(nums, 0, nums.length - 1);
		$("#res").text("Resultado: "+resDV);

		crearAnimFB(nums);
		var resFB = fuerzaBrutaMSS(nums, nums.length, true, editNormal);
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

//Función que bloquea el hilo de ejecución actual porque es llamada con await
function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function crearAnimDV(numeros){
	for(var i = 0; i <= numeros.length; i++){
		var espacioDV = document.createElement("div");
		espacioDV.classList.add("espacio");
		espacioDV.setAttribute("id","dv"+i);
		if(numeros[i]){
			espacioDV.innerText = numeros[i];
		}
		else{
			espacioDV.innerText = "Resultado: 0";
			espacioDV.classList.add("resultado");
		}
		$("#optimizada").append(espacioDV);
	}
}

async function fuerzaBrutaMSS(arreglo, tam, animar, editNormal){
	var aux = arreglo[0];
	var cont;

	animar && editNormal.gotoLine(2, 0, true);
	animar && $("#fb"+tam).removeClass("resultado");
	animar && $("#fb0").addClass("actual");
	animar && $("#fb"+tam).text("Resultado: "+aux);
	animar && await esperar(1000);
	
	for (var i = 0; i < tam; i++){
		animar && $("#fb"+(tam - 1)).removeClass("actual");
		cont = 0;
		animar && editNormal.gotoLine(4, 0, true);
		animar && await esperar(1000);
		animar && $("#parcialfb").text("Resultado actual: "+cont);
		for (var j = i; j < tam; j++){
			animar && $("#fb"+(j-1)).removeClass("actual");
			animar && $("#fb"+j).addClass("actual");
			animar && $("#parcialfb").text("Resultado actual: "+cont+" + "+arreglo[j]);
			cont = cont + arreglo[j];
			animar && editNormal.gotoLine(6, 0, true);
			animar && await esperar(1000);
			animar && $("#parcialfb").text("Resultado actual: "+cont);
			animar && await esperar(1000);
			if (cont > aux){
				aux = cont;
				animar && editNormal.gotoLine(8, 0, true);
				animar && $("#fb"+tam).addClass("resultado");
				animar && $("#fb"+tam).text("Resultado: "+aux);
				animar && await esperar(1000);
				animar && $("#fb"+tam).removeClass("resultado");
			}
			animar && editNormal.gotoLine(9, 0, true);
			animar && await esperar(1000);
		}
	}
	animar && $("#fb"+(tam - 1)).removeClass("actual");
	animar && $("#fb"+tam).addClass("resultado");
	animar && editNormal.gotoLine(12, 0, true);
	return aux;
}

function divideMSS(arreglo, inicio, fin){
	if(inicio == fin){
		return arreglo[inicio];
	}
	var mitad = Math.trunc((inicio+fin)/2);
  
	var sumaIzquierda = 0,
		sumaDerecha = 0,
		sumaCentral = 0,
		suma;
	var izq = divideMSS(arreglo, inicio, mitad);
	var der = divideMSS(arreglo, mitad+1, fin);
  
	suma = 0;
	sumaIzquierda = arreglo[mitad];
	for (let i = mitad; i >= inicio ; i--){
		suma += arreglo[i];
		if(suma > sumaIzquierda){
			sumaIzquierda = suma;
		}
	}

	suma = 0;
	sumaDerecha = arreglo[mitad + 1];
	for (let i = mitad + 1; i <= fin; i++){
		suma += arreglo[i];
		if(suma > sumaDerecha){
			sumaDerecha = suma;
		}
	}
	sumaCentral = sumaIzquierda + sumaDerecha;
	return Math.max(izq, der, sumaCentral);
}