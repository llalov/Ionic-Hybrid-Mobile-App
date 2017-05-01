// Kinvey Ionic Starter App

angular.module('app', [
  'kinvey',
  'ionic',
  'app.home',
  'app.events',
  'app.blog',
  'app.me'
])

.run(function($ionicPlatform, $kinvey, $rootScope, $state, $ionicModal, $timeout, $location) {
  // Show a login view if there is not an active user but
  // the toState requires a user to be active.
  var stateChangeStartListener = $rootScope.$on('$stateChangeStart', function(event, toState, toParams) {
    var activeUser = $kinvey.User.getActiveUser();
    var activeUserRequired = toState.data ? toState.data.activeUserRequired : false;

    if (activeUserRequired === true && !activeUser) {
      // Create a new $scope
      var $scope = $rootScope.$new();
      $scope.loginData = {};
      $scope.errorMessageSignup = null;
      $scope.errorMessageLogin = null;

      $scope.showRegForm = function() {
        $scope.signupForm = true;
        $scope.loginForm = false;
        $scope.introTitle = 'Регистрация'
      };
            
      $scope.hideRegForm = function() {
        $scope.signupForm = false;
        $scope.loginForm = true;
        $scope.introTitle = 'Вход'
      };
      
      $scope.hideRegForm();
      
      // Create the login modal and show it
      $ionicModal.fromTemplateUrl('templates/login.html', {
        scope: $scope,
        animation: 'slide-in-up',
        backdropClickToClose: false,
        hardwareBackButtonClose: true
      }).then(function(modal) {
        modal.show();
        $scope.modal = modal;
      });

      // Hide the modal and destroy the $scope
      $scope.closeModal = function() {
        $scope.modal.hide().then(function() {
          $scope.$destroy();
        });
      };

      // Perform the login action when the user submits the login form
      $scope.doLogin = function(data) {
        $scope.errorMessageLogin = null;

        // Login a user and close the modal
        $kinvey.User.login(data).then(function() { 
          $state.go(toState.name, toParams, { reload: true });
          $scope.closeModal();
        }).catch(function(error) {
          $scope.errorMessageLogin = "Грешно потребителско име или парола";
          $scope.$digest();
        });
      };

      //Perform the signup action when the  user submits the signup form
      $scope.doRegister = function(data) {
        $scope.errorMessageSignup = null;

        // Signup user and close the modal
        $kinvey.User.signup(data)
          .then(function() {
            $state.go(toState.name, toParams, { reload: true });
            $scope.closeModal();
          }).catch(function(error) {
            $scope.errorMessageSignup = "Потребителското име е заето";
            $scope.$digest();
          });
      };

      // Remove the modal when the $scope is destroyed
      $scope.$on('$destroy', function() {
        $scope.modal.remove();
      });
    }
  });

  $ionicPlatform.ready(function() {

    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($kinveyProvider, $stateProvider, $urlRouterProvider) {
  $kinveyProvider.init({
    appKey: 'kid_Bk8-_63Tg',
    appSecret: '991dd7fecb474c7cb0cd5b0aca5ecbb3'
  });

  $stateProvider
    .state('logout', {
      url: '/logout',
      controller: function($scope, $state, $kinvey) {
        $scope.$on('$ionicView.enter', function() {
          var user = $kinvey.User.getActiveUser();

          if (user) {
            return user.logout().then(function() {
              $state.go('app.events');
            });
          }

          $state.go('app.events');
        });
      }
    })
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html',
      controller: 'AppCtrl',
      data: {
        activeUserRequired: true
      }
    })
    .state('app.events', {
      url: '/events',
      views: {
        'menuContent': {
          templateUrl: 'templates/events.html',
          controller: 'EventsCtrl'
        }
      }
    })
    .state('app.blog', {
      url: '/blog',
      views: {
        'menuContent': {
          templateUrl: 'templates/blog.html',
          controller: 'EventsCtrl'
        }
      }
    })
    .state('app.me', {
      url: '/me',
      views: {
        'menuContent': {
          templateUrl: 'templates/my-profile.html',
          controller: 'MyProfileCtrl'
        }
      }
    });

  // If none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/events');
});
