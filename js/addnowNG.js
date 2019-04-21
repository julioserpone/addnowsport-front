 "use strict"; 
var app = angular.module('app', ['ui.bootstrap',"ngMap", "angularTrix", "ngResource", "angularFileUpload"], function($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
}).config(["$injector", function ($injector) {
    var $httpProvider = $injector.get('$httpProvider', 'route');
   // var $urlRouterProvider = $injector.get('$urlRouterProvider', 'app');
    }
]);
app.factory("appConfig",['$location',function ($location) {

  var config =  {
     domain: 'http://localhost/pspnew3/public_html/'
  };
  return config;
    }]

    );
app.controller('CompentenciasWizardController',
    [
        '$scope',
        '$injector',
        function ($scope,$injector) {

     $scope.wizard = {
        current: 1,
        nombre: "EJEMPLO",
        last: 5,
        next: function(){
           switch (this.current) {
             case 1:
              
             console.log(this.current);
             this.current++;
             break;
             case 2:
                 if($('#fechas_competencias_dp').length){
                $('#fechas_competencias_dp').datepicker(
                {

                   multidate: false,
                   startDate: new Date()
                }
                );
                $('#fechas_competencias_dp').on("changeDate", function(e) {
                  wizard.dates.push($('#fechas_competencias_dp').datepicker('getFormattedDate'));
                    $('#fechas_competencias').val(
                        $('#fechas_competencias_dp').datepicker('getFormattedDate')
                    );
                });
                  }
             this.current++;
             break;
             case 3:
                         this.refreshMap();  
             //this.current++;
             break;
             case 4:
             //this.current++;
             this.loadDates();
             break;
             default:
                //nothing here
                break;
           }
        },
        back: function(){
          this.current--;
        },
          selectedDates: [],
        selectDates: function(){
          if($scope.wizard.selectedDates.length > 0 && $scope.evento.torneo == false){
                console.log("Solo se permite  una sola fecha");
                window.alert("Solo se permite una fecha");
            }else{
            var date = {
                    fecha: $scope.wizard.fecha, 
                     }
            var isInArray=0;
                     for (var i = $scope.wizard.selectedDates.length - 1; i >= 0; i--) {
                           if($scope.wizard.selectedDates[i].fecha.getTime() == date.fecha.getTime()){
                                  isInArray++;
                           }
                     };
                  if(isInArray == 0){
                    $scope.wizard.selectedDates.push(date);
                  }else{ console.log("Esta fecha ya fue seleccionada");}
          }
        },
        refreshMap: function(){
            var NgMap = $injector.get('NgMap', 'CompentenciasWizardController');//$rootScope, NgMap
                            $scope.types = ['establishment'];
                            
              $scope.placeChanged = function() {
                $scope.place = this.getPlace();
                console.log('location', $scope.place.geometry.location);
                $scope.map.setCenter($scope.place.geometry.location);
                console.log($scope.place.geometry.location);
               }
              NgMap.getMap().then(function(map) {
                $scope.map = map;
              });
              $scope.wizard.current = 4; 
        },
        disablePlaces: function(){
              if($scope.wizard.selectedDates.lenght < 0 || $scope.wizard.fechaselect == {}){
                  return true;
              }else{
                return false;
              }
        },
        loadDates: function(){
            if($scope.evento.fechas.lenght == 0){
                window.alert("Debe seleccionar primero las ubicaciones");
            }else{
                this.current = 5;
            }
        }
     };

         $scope.setMarker = function(){
             $scope.myLatlng = new google.maps.LatLng($scope.place.geometry.location.lat(), $scope.place.geometry.location.lng());
              $scope.mapOptions = {
                          zoom: 4,
                          center: $scope.myLatlng
                        }
              $scope.marker = new google.maps.Marker({
                            position: $scope.myLatlng,
                            title:"Competencia"
                        });

                        // To add the marker to the map, call setMap();
                        $scope.marker.setMap($scope.map);
          };
          $scope.pushAddress = function(){

                  var fecha = {
                    fecha: $scope.wizard.fechaselect.fecha, 
                    direccion: $scope.place.formatted_address, 
                    coordendas: {lat: $scope.place.geometry.location.lat(), lng: $scope.place.geometry.location.lng()},
                    distancias: [
                            {
                                distancia: '', 
                                grupo_etario: {min: 0, max: 0}, 
                                categoria: '',
                                tiempos: [] 
                            }
                        ],
                     };
               $scope.setMarker();
               $scope.evento.fechas.push(fecha);
               console.log($scope.evento.fechas);
          }
     $scope.editorOptions = {
    // settings more at http://docs.ckeditor.com/#!/guide/dev_configuration
        };

       $scope.calendar = {
            opened: {},
            dateFormat: 'dd/MM/yyyy',
            dateOptions: {
                formatYear: 'yy',
                startingDay: 1,
                minDate: new Date(),
            },
            now: new Date(),
            open: function ($event, which) {
                $event.preventDefault();
                $event.stopPropagation();

                angular.forEach($scope.calendar.opened, function (value, key) {
                    $scope.calendar.opened[key] = false;
                });

                $scope.calendar.opened[which] = true;
            },
            disabled: function (date, mode) {
                return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
            }
        };

        $scope.evento = {
            logo:"",//La ruta del logo
            ubicaciones: [],
            torneo: false,
            disciplina: {},
            nombre: '',
            subdominio: '',
            dominio_propio: false,
            solicitar_dominio: false,
            redes_sociales:  {facebook: '', twitter: '', google: ''},
            descripcion: '',
            fechas: [
                /*{
                    fecha: new Date(), 
                    direcion: '', 
                    coordendas: '',
                    distancias: [
                            {
                                distancia: '20k', 
                                grupo_etario: {min: 0, max: 0}, 
                                categoria: '',
                                tiempos: ['vuelta 1', 'vuelta 2', 'vuelta 3'] 
                            }
                        ],
                     }*/
            ],


        }
        $scope.disciplinas = [
          {id:1, nombre: "Disciplina 1"},
          {id:2, nombre:"Disciplina 2"},
          {id:3, nombre:"Disciplina 3"},
          {id:4, nombre:"Disciplina 4"},
          {id:5, nombre:"Disciplina 5"},
          {id:6, nombre:"Disciplina 6"},
           ];
  console.log($scope.wizard);
            /*var NgMap = $injector.get('NgMap', 'run');
              $scope.types = "['establishment']";
              $scope.placeChanged = function() {
                $scope.place = this.getPlace();
                console.log('location', $scope.place.geometry.location);
                $scope.map.setCenter($scope.place.geometry.location);
              }
              NgMap.getMap().then(function(map) {
                $scope.map = map;
              });
*/
                       

}]);
app.controller('ProductoraWizardController',
    [
        '$scope',
        '$injector',
        'productoraModel',
        function ($scope,$injector, productoraModel) {

          $scope.usuario_id = '';
          $scope.productora_id = '';
     $scope.wizard = {
        current: 1,
        file_name: '',
        nombre: "EJEMPLO",
        last: 3,
        handleSuccess: function() {
              this.current++;
          console.log("SE CARGO LA DATA ADECUADAMENTE");
        },
        handleError: function() {
          console.log("OCURRIO ALGUN ERROR AL CARGAR LA DATA :(");
        },
        next: function(){
           switch (this.current) {
             case 1:
             var data = angular.copy($scope.productora);
             var out = {
                      'id': $scope.productora_id,
                      'usuario_id': $scope.usuario_id,
                      'rut': data.cuit_rut,
                      'nombre': data.nombre_comercial,
                      'pais': data.pais.id,
                      'ciudad':data.provincia,
                      'razon_social': data.razon_social,
                      'correo': data.correo,
                      'direccion': data.direccion,
                      'celular': data.telefono,
                      'pin_retiro': data.pin_retiro_cuenta,
                      'descripcion':data.descripcion,
                      'facebook':data.redes_sociales.facebook,
                      'twitter':data.redes_sociales.twitter,
                      'google':data.redes_sociales.google,
                      'website':data.web,
                      'current_step': this.current,
                      'avatar': $scope.wizard.file_name
                    };
                    out.json = JSON.stringify(out);
             var params =  {'step': this.current};
             productoraModel.wizard(params,out).$promise.then(function(res){
                      $scope.wizard.handleSuccess();
              }).catch(function(res){
                    $scope.wizard.handleError();
              });
             break;
             case 2:  
              var data = angular.copy($scope.productora.cuenta_bancaria);

             var out = {
                                'id': data.id,
                                'productora_id': $scope.productora_id,
                                'titular': data.nombre_completo,
                                'rut':data.cuit_cuil,
                                'cbu': data.cbu,
                                'banco': data.banco,
                                'tipo_cuenta': data.tipo_cuenta.id,
                                'correo': data.correo
                    };
                    out.json = JSON.stringify(out);
             var params =  {'step': this.current};
            
             productoraModel.wizard(params,out).$promise.then(function(res){
                      console.log(res);
                      $scope.productora.cuenta_bancaria.is = res.id;
                      $scope.wizard.current++;
              }).catch(function(res){
                    $scope.wizard.handleError();
              });
             break;
             case 3:
             var data = angular.copy($scope.productora);
             console.log(data);
             var out = {
                                
                                'productora_id': $scope.productora_id,
                                'pin_retiro_cuenta': data.pin_retiro_cuenta
                                
                    };
                    out.json = JSON.stringify(out);
             var params =  {'step': this.current};
            
             productoraModel.wizard(params,out).$promise.then(function(res){
                      console.log(res);
                      window.alert("SE COMPLETARON LOS DATOS DE LA PRODUCTORA");
                     // $scope.wizard.handleSuccess();
              }).catch(function(res){
                    $scope.wizard.handleError();
              });
              
             break;
             default:
                //nothing here
                break;
           }
        },
        back: function(){
          this.current--;
        },
        process_file: function (file_up) {
          var $compile = $injector.get('$compile', 'process_file');
          var productoraLogo = $injector.get('productoraLogo', 'process_file');
            if (file_up.length > 0) {

                if(file_up[0].type != 'image/jpeg' && file_up[0].type != 'image/png'){
                    window.alert("Comprueba que el archivo que subes sea un JPG o PNG y vuelve a intentarlo.");
                    return false;
                }

                var file = file_up[0];
                $scope.wizard.file = file_up;
                $scope.wizard.file.progress = 0;
                var progressHtml = '<div class="progress" style="position: absolute;margin-left: 3%;width: 87%;margin-top: 5px;">' +
                    '<div class="progress-bar progress-bar-info progress-bar-striped" role="progressbar" aria-valuenow="{{datos.file.progress}}" aria-valuemin="0" aria-valuemax="100" style="width: {{datos.file.progress}}%">' +
                    '<span>Subiendo... ({{wizard.file.progress}}%)</span>' +
                    '</div>' +
                    '</div>';
                // parseo el string append a html
                var element = angular.element(progressHtml);
                // compilamos el elemento parseado dentro del $scope
                var html = $compile(element)($scope);
                // agregamos el html del progresbar
                angular.element('#content-upload').html(html);
                // ejecutamos la subida del archivo seleccionado
                productoraLogo.upload_logo(file).progress(function (evt) {

                    file.progress = parseInt(100.0 * evt.loaded / evt.total);

                }).success(function (data) {

                    var icon = 'glyphicon glyphicon-ok-sign';

                    if (!data.success)
                        icon = 'glyphicon glyphicon-warning-sign';

                    if (data.success) {
                        //$scope.name_adjunto = data.file_name;
                        $scope.wizard.file_name = data.file_name
                    }

                    // file is uploaded successfully
                    var suceesHtml = '<div style="text-align: left; position: absolute;margin-left: 3%;width: 87%;margin-top: 5px;">' +
                        '<span class="' + icon + '">' + data.message + '</span>' +
                        '</div>';
                    // parseo el string append a html
                    var ele = angular.element(suceesHtml);
                    // compilamos el elemento parseado dentro del $scope
                    var append = $compile(ele)($scope);
                    // agregamos el html
                    angular.element('#content-upload').html(append);
                })
            }
          }
     };

        $scope.productora = {
            logo: "",
            nombre_comercial: "",
            razon_social: "",
            cuit_rut: "",
            pais: {},
            provincia: '',
            direccion: '',
            telefono: '',
            correo: '',
            web: '',
            descripcion: '',
            redes_sociales: {facebook: '', twitter: '', google: ''},
            cuenta_bancaria: {
                            id:'',
                            productora_id:'',
                            nombre_completo: '',
                            cuit_cuil: '',
                            cbu: '', 
                            banco: '', 
                            tipo_cuenta: '',
                            correo: ''
                          },
            pin_retiro_cuenta: '',
            pin_retiro_cuenta_confirm: '',
            usuario_id: '',//Id del usuario asociado a la productora
            current_step: 1
        };
        $scope.paises = [];

        $scope.tipos_cuentas = [
              {id:'corriente', nombre: "Corriente"},
              {id:'ahorros', nombre:"Ahorros"},
             ];
          angular.element(document).ready(function () {
                productoraModel.obtenerDependencias({'productora_id': $scope.productora_id}).$promise.then(function(res){
                      console.log(res, "DEPENDENCIAS DEL WIZARD DE PRODUCTORA"); 
                      var count = 0;
                      Object.keys(res.paises).forEach(function(key) {
                          $scope.paises[count] = {id: key,nombre: res.paises[key]};
                          count++;
                    });
              var productora = res.productora[0];
              var banco = productora.bancos[0];
                      $scope.productora = {
            logo: productora.avatar,
            nombre_comercial: productora.nombre,
            razon_social: productora.razon_social,
            cuit_rut: productora.rut,
            pais: {id: productora.pais},
            provincia: productora.ciudad,
            direccion: productora.direccion,
            telefono: productora.celular,
            correo: productora.correo,
            web: productora.website,
            descripcion: productora.descripcion,
            redes_sociales: {
                              facebook: productora.facebook,
                              twitter: productora.twitter, 
                              google: productora.google
                            },
            cuenta_bancaria: {
                            id: banco.id,
                            nombre_completo: banco.titular,
                            cuit_cuil: banco.rut,
                            cbu: banco.nro_cuenta, 
                            banco: banco.banco, 
                            tipo_cuenta: {id: banco.tipo_cuenta},
                            correo: banco.correo
                          },
            pin_retiro_cuenta: productora.pin_retiro,
            pin_retiro_cuenta_confirm: productora.pin_retiro,
        };
                      console.log(res.productora, "DATA GUARDADA EN DB");
              }).catch(function(res){
                    console.log(res, "HANDLE ERROR");
              });
              /*$scope.xImagen = appConfig.getPathApi() + 'img/avatar.jpg';
        if ($scope.detalles.image_path) {
            var xImagen = appConfig.getPathApi() + '../storage/img_personas/' + $scope.detalles.image_path;
            var $http = $injector.get('$http', 'imageverify');
            $http.get(xImagen).then(function () {
                $scope.xImagen = xImagen;
            });
        }*/
             });
}]);
 app.factory('productoraModel', [
    '$resource',
    'appConfig',
    function ($resource, appConfig) {
      //productora/wizard/{step}
        var _url =  appConfig.domain + 'productora/wizard/:step';
        var data = $resource(_url, null, {

          wizard: {
                method: 'POST',
                url:  appConfig.domain + 'productora/wizard/:step',
                params: {
                    step: '@step'
                },
                isArray: false
            },
            obtenerDependencias: {
                method: 'GET',
                url:  appConfig.domain + 'productora/dependencias-wizard/:productora_id',
                params: {
                    productora_id: '@productora_id'
                },
                isArray: false
            }
        });
        return data;
    }

]);
  app.factory('requestInterceptor', [
    '$resource',
    'appConfig',
    function ($resource, appConfig) {
      //productora/wizard/{step}
        var _url =  appConfig.domain + 'productora/wizard/:step';
        var data = $resource(_url, null, {

          wizard: {
                method: 'POST',
                url:  appConfig.domain + 'productora/wizard/:step',
                params: {
                    step: '@step'
                },
                isArray: false
            },
            obtenerDependencias: {
                method: 'GET',
                url:  appConfig.domain + 'productora/dependencias-wizard/:productora_id',
                params: {
                    productora_id: '@productora_id'
                },
                isArray: false
            }
        });
        return data;
    }

]);
app.factory('productoraLogo', ["appConfig", "$upload", function (appConfig, $upload) {
    return {
        save: function () {
        },
        upload_logo: function (file) {
            var _url = appConfig.domain + 'productora/logo';
            return $upload.upload({
                url: _url,
                headers: {'Content-Type': file.type},
                method: 'POST',
                file: file
                //}).error(function (success, error, progress) {
                //console.log(success, error, progress);
            });
        }
    };
}]);