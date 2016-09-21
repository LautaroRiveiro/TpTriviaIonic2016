var app = angular.module('miApp', []);

app.controller('miController', function($scope, $timeout){
	
    //Creo un objeto referencia a la BD en Firebase, a la 'tabla' de Preguntas
    var preguntasRef = new Firebase('https://triviapp-c9b77.firebaseio.com/preguntas');
    
    
    //Recupero de Firebase todas las preguntas, almacenándolas en un array que contiene objetos pregunta.
    $scope.infofirebase = [];
    $scope.respuestasCorrectas = {};
    
    preguntasRef.on('child_added', function(snapshot){
        $timeout(function(){
            var pregunta = snapshot.val();
            $scope.infofirebase.push(pregunta);
            $scope.respuestasCorrectas[pregunta.id] = pregunta.respuesta;
        });
    });    
    
    
    //Creo un objeto de respuestas elegidas, donde dinámicamente voy a ir almacenando las respuestas seleccionadas.
    $scope.respuestasElegidas = {};
    
    
    //Programo el botón Enviar evaluando las respuestas elegidas con las correctas
    $scope.Enviar = function(){
        //alert("Sus respuestas fueron: " + JSON.stringify($scope.respuestasElegidas));
        var contadorAciertos = 0;
        var contadorPreguntas = 0;
        
        for(var respuesta in $scope.respuestasCorrectas){
            
            contadorPreguntas ++;
            
            if ($scope.respuestasCorrectas[respuesta] === $scope.respuestasElegidas[respuesta]){
                alert("Respuesta "+respuesta+": BIEN");
                contadorAciertos ++;
            }
            else{
                alert("Respuesta "+respuesta+": MAL");   
            }
        }
        
        alert("Cantidad de aciertos: "+contadorAciertos+"/"+contadorPreguntas);
    }
});