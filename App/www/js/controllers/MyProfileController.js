angular.module('app.me', [])
    .controller('MyProfileCtrl', [
        '$scope',
        '$kinvey',
        '$q',
        function($scope, $kinvey, $q) {
            var activeUser = $kinvey.User.getActiveUser();

            $scope.refresh = function() {
                var promise = $q.resolve(activeUser);

                if (activeUser !== null) {
                    promise = activeUser.me();
                }

                promise
                    .then(function(activeUser) {
                        $scope.userInfo = activeUser.data;
                        $scope.$digest();
                    })
                    .catch(function(error) {
                        return error.data;
                    })
            }
            
            $scope.$on('$ionicView.enter', function() {
                $scope.userInfo = [];
                $scope.refresh();
            });

        }
    ]);