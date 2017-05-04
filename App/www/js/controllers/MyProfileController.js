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
                    .then(function(){
                         var query = new $kinvey.Query();
                        query.equalTo('userId', $scope.userInfo._id);
                        var promise = $kinvey.Files.find(query)
                        .then(function(files) {
                            $scope.userImg = files[0]._downloadURL;
                            $scope.$digest();
                        })
                        
                        .catch(function(error) {
                            
                        });
                    })
                    .catch(function(error) {
                        return error.data;
                    })
                
            }
            
            $scope.$on('$ionicView.enter', function() {
                $scope.userInfo = [];
                $scope.userImg = "";
                $scope.refresh();
            });

        }
    ]);