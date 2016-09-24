angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout, $cordovaVibration) {
  
    //Creo un objeto referencia a la BD en Firebase, a la 'tabla' de Preguntas
    var preguntasRef = new Firebase('https://triviapp-c9b77.firebaseio.com/preguntas');
    var partidasRef = new Firebase('https://triviapp-c9b77.firebaseio.com/partidas');
    
    //Recupero de Firebase todas las preguntas, almacenándolas en un array que contiene objetos pregunta.
    $scope.infofirebase = [];
    $scope.respuestasCorrectas = {};
    $scope.pregunta = {};
    $scope.preguntasHechas = [];
    
    //Banderas de estado
    $scope.mostrarBotonEmpezar = true;
    $scope.sePuedeEmpezar = false;
    $scope.acierto = false;

    //Contadores de puntuación
    var contadorAciertos = 0;
    var contadorPreguntas = 0;
    
    preguntasRef.on('child_added', function(snapshot){
        $timeout(function(){
            var pregunta = snapshot.val();
            $scope.infofirebase.push(pregunta);
            $scope.respuestasCorrectas[pregunta.id] = pregunta.respuesta;
            $scope.sePuedeEmpezar = true;
        });
    });    

    //Tomo al azar una pregunta y la hago
    $scope.HacerPregunta = function(){
      $scope.mostrarBotonEmpezar = false;
      $scope.acierto = false;
      $scope.respuestaIncorrecta = false;

      if($scope.preguntasHechas.length < 4){
        //No sé cómo hacer para esperar a que se carguen todas las preguntas del Firebase y así sacar el length.
        var aleatoria;
        do{
          aleatoria = Math.floor((Math.random() * 4)) //Entre 0 y 3
          console.info("Id: ",aleatoria);
        }while($scope.Evaluar(aleatoria, $scope.preguntasHechas));
        //Se lo asigno a la variable $scope.pregunta
        $scope.pregunta = $scope.infofirebase[aleatoria];
        //Muestro que tomé el JSON de una pregunta, que lo asigné correctamente, y que ahora está cargada con una pregunta aleatoria
        console.info($scope.pregunta);
        //Guardo el id de la pregunta que salió, para que no se repita
        $scope.preguntasHechas.push(aleatoria);
        console.info($scope.preguntasHechas.length);
      }
      else{
        console.log("Juego terminado");
        $scope.Finalizar();
      }
    }

    $scope.Evaluar = function(valor, array){
      var existe = false;
      array.forEach(function(value){
        if(value===valor){
          existe = true;
        }
      })
      return existe;
    };
    
    //Creo un objeto de respuestas elegidas, donde dinámicamente voy a ir almacenando las respuestas seleccionadas.
    $scope.respuestasElegidas = {};
    
    
    //Programo el botón Enviar evaluando las respuestas elegidas con las correctas
    $scope.Enviar = function(opcion){
        
        //Muestro la opción elegida
        console.info(opcion);
        //Pinto de verde la correcta (independientemente si acertó)
        $scope.acierto = $scope.pregunta.respuesta;
        //Incremento en una las preguntas jugadas
        contadorPreguntas ++;
        
        //Evalúo si fue correcta
        if($scope.pregunta.respuesta === opcion){
            //CORRECTA
            console.log("Correcta");
            //Hago vibrar una vez
            try{
                $cordovaVibration.vibrate(200);
            }catch (err){ console.log("No es un dispositivo", err); }
            //Sumo una correcta
            contadorAciertos ++;
        }
        else{
            //INCORRECTA
            console.log("Incorrecta");
            //Vibrar
            try{
                $cordovaVibration.vibrate([150, 100, 100]);
            }catch (err){ console.log("No es un dispositivo", err); }
            //La pinto de rojo
            $scope.respuestaIncorrecta = opcion;
        }

        //Lanzo una nueva pregunta que no se repita
        $timeout(function(){
            $scope.HacerPregunta();
        },1500);
    };

    $scope.Finalizar = function(){
        //Muestro resultados
        alert("Juego terminado\nCantidad de aciertos: "+contadorAciertos+"/"+contadorPreguntas);
        //Guardar los resultados y subirlos al Firebase
        var resultados = {};
        resultados.nombre = "Lautaro"
        resultados.puntaje = contadorAciertos;
        resultados.porcentaje = contadorAciertos/contadorPreguntas*100;
        resultados.timestamp = Firebase.ServerValue.TIMESTAMP;
        alert(JSON.stringify(resultados));
        partidasRef.push(resultados);
        //Pongo en cero las variables necesarias para volver a empezar
        contadorAciertos = 0;
        contadorPreguntas = 0;
        $scope.preguntasHechas = [];
        $scope.mostrarBotonEmpezar = true;
    };
})

.controller('ChatsCtrl', function($scope, $timeout) {
    var partidasRef = new Firebase('https://triviapp-c9b77.firebaseio.com/partidas');

    $scope.partidas = [];

    partidasRef.on('child_added', function(snapshot){
        $timeout(function(){
            var partida = {};
            partida = snapshot.val();
            partida.fecha = new Date(partida.timestamp);
            partida.dia = partida.fecha.getDate()+"/"+partida.fecha.getMonth()+"/"+partida.fecha.getFullYear();
            partida.hora = partida.fecha.getHours()+":"+(partida.fecha.getMinutes()<10?'0':'')+partida.fecha.getMinutes();
            partida.porcentaje = Math.round(partida.porcentaje * 100) / 100;
            console.log(partida);
            $scope.partidas.push(partida);
        });
    }); 
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('LoginCtrl', function($scope, $state) {
    $scope.usuario = {};
    $scope.usuario.nombre = "";
   
    $scope.$watch('usuario.nombre', function(newVal, oldVal){
        console.log('changed');
    });
    
    
    
    
    $scope.Ingresar = function(){
        console.log($scope.usuario.nombre);
        $state.go('tab.dash', {usuario: $scope.usuario});
    }
});