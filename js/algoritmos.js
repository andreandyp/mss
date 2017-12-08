"use strict";
$(document).ready(function(){
	$("#resolver").click(function(){
		var nums = $("#nums").val();
		nums = nums.split(" ");
		for(var i = 0; i < nums.length; i++){
			nums[i] = parseInt(nums[i]);
		}
		var resFB = fuerzaBrutaMSS(nums, nums.length);
		var resDV = divideMSS(nums, 0, nums.length - 1);

		$("#resFB").text("Resultado: "+resFB);
		$("#resDV").text("Resultado: "+resDV);
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