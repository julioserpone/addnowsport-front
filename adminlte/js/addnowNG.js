var app = angular.module('app', [
]);
app.controller('CompentenciasWizardController',
    [
        '$scope',
        function ($scope) {

     $scope.wizard = {
        current: 0,
        next: function(){
           switch (self.current) {
             case 0:
             console.log(self.curren);
             self.current++;
             brake;
             case 1:
             $scope.wizard.current++;
             brake;
             case 2:
             $scope.wizard.current++;
             brake;
           }
        },
        back: function(){
          self.current--;
        }
     };
  console.log($scope.wizard);

}]);