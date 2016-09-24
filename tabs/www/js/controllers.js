angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout) {
  
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
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
