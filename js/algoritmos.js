"use strict";
var grande = 1000;
$(document).ready(function(){
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
		$("#res").text("Resultado: "+resDV);
		alert("Terminó la forma rápida");
		var resFB = fuerzaBrutaMSS(nums, nums.length);
		alert("Terminó la forma lenta");
	});


	$("#resolver").click(function(){
		var nums = $("#nums").val();
		nums = nums.split(" ");
		for(var i = 0; i < nums.length; i++){
			nums[i] = parseInt(nums[i]);
		}
		var resDV = divideMSS(nums, 0, nums.length - 1);
		$("#res").text("Resultado: "+resDV);
		alert("Terminó la forma rápida");
		var resFB = fuerzaBrutaMSS(nums, nums.length);
		alert("Terminó la forma lenta");
	});
});

function fuerzaBrutaMSS(arreglo, tam){
	var aux = arreglo[0];
	var cont;
	
	for (var i = 0; i < tam; i++){
		cont = 0;
		for (var j = i; j < tam; j++){
			cont = cont + arreglo[j];
			if (cont > aux){
				aux = cont;
			}
		}
	}
	
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