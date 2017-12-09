"use strict";

$(document).ready(function(){
	var grande = 1000;

	$("#mas").click(function(e){
		if(grande === 100000){
			return;
		}
		e.preventDefault();
		grande *= 10;
		$("#vgrande").text("Valor a probar: "+grande);
	});

	$("#menos").click(function(e){
		if(grande === 1000){
			return
		}
		e.preventDefault();
		grande /= 10;
		$("#vgrande").text("Valor a probar: "+grande);
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
		var resFB = fuerzaBrutaMSS(nums, nums.length, true);
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

async function fuerzaBrutaMSS(arreglo, tam, animar){
	var aux = arreglo[0];
	var cont;

	animar && $("#fb"+tam).removeClass("resultado");
	animar && $("#fb0").addClass("actual");
	animar && $("#fb"+tam).text("Resultado: "+aux);
	animar && await esperar(1000);
	
	for (var i = 0; i < tam; i++){
		animar && $("#fb"+(tam - 1)).removeClass("actual");
		cont = 0;
		animar && $("#parcialfb").text("Resultado actual: "+cont);
		for (var j = i; j < tam; j++){
			animar && $("#fb"+(j-1)).removeClass("actual");
			animar && $("#fb"+j).addClass("actual");
			animar && $("#parcialfb").text("Resultado actual: "+cont+" + "+arreglo[j]);
			cont = cont + arreglo[j];
			animar && await esperar(1000);
			animar && $("#parcialfb").text("Resultado actual: "+cont);
			animar && await esperar(1000);
			if (cont > aux){
				aux = cont;
				animar && $("#fb"+tam).addClass("resultado");
				animar && $("#fb"+tam).text("Resultado: "+aux);
				animar && await esperar(1000);
				animar && $("#fb"+tam).removeClass("resultado");
			}
		}
	}
	animar && $("#fb"+(tam - 1)).removeClass("actual");
	animar && $("#fb"+tam).addClass("resultado");
	return aux;
}

function divideMSS(arreglo, inicio, fin){
	if(inicio == fin){
		return arreglo[inicio];
	}
	var mitad = Math.trunc((inicio+fin)/2);
  
	var prefijo = 0,
		sufijo = 0,
		suma, izq, der, centro;
	var izq = divideMSS(arreglo, inicio, mitad);
	var der = divideMSS(arreglo, mitad+1, fin);
  
	suma = 0;
	sufijo = arreglo[mitad];
	for (var i = mitad; i >= inicio ; i--){
		suma += arreglo[i];
		if(suma > sufijo){
			sufijo = suma;
		}
	}

	suma = 0;
	prefijo = arreglo[mitad + 1];
	for (var i = mitad + 1; i <= fin; i++){
		suma += arreglo[i];
		if(suma > prefijo){
			prefijo = suma;
		}
	}
	centro = sufijo + prefijo;
	return Math.max(izq, der, centro);
}