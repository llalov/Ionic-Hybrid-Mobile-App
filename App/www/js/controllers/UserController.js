angular.module('app.user', [])
    .controller('UserCtrl', [
        '$scope',
        '$kinvey',
        '$ionicModal',
        '$rootScope',
        function($scope, $kinvey, $ionicModal,$rootScope) {
          // $scope.$on('$destroy', function() {
          //       $scope.modal.remove();
          //     });
          // var stateChangeStartListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
          //   var activeUser = $kinvey.User.getActiveUser();
          //   var activeUserRequired = toState.data ? toState.data.activeUserRequired : false;

          //   if (activeUserRequired === true && !activeUser) {
          //     var $scope = $rootScope.$new();
          //     $scope.loginData = {};
          //     $scope.errorMessage = null;

          //     // Create the login modal and show it
          //     $ionicModal.fromTemplateUrl('templates/login.html', {
          //       scope: $scope,
          //       animation: 'slide-in-up',
          //       backdropClickToClose: false,
          //       hardwareBackButtonClose: false
          //     }).then(function(modal) {
          //       modal.show();
          //       $scope.modal = modal;
          //     });

          //   }
          // });   
        }
    ]);