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
                        sessionStorage['currentUser'] = activeUser.data;
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
            
            $scope.uploadFile = function() {
              var metadata = {
                userId: $scope.userInfo._id 
              };

              var file = document.getElementById('file').files[0];
              var promise = $kinvey.Files.upload(file, metadata)
                .then(function(file) {
                    var query = new $kinvey.Query();
                    query.equalTo('userId', $scope.userInfo._id);
                    var promise = $kinvey.Files.find(query)
                        .then(function(file) {
                            console.log("ФАЙЛЧЕТО ДЕЙБА: "+ file);
                            console.log(file['0']._id);
                            var promise = $kinvey.Files.removeById(file['0']._id)
                                .then(function() {
                                    console.log("Старата картинка е махната")
                                 })
                                .catch(function(error) {
                                    console.log("Старата картинка НЕ е махната")
                                });
                        })
                        .catch(function(error) {
                            console.log("НЕВАЛИДНО QUERY");
                        });

                    console.log("Y")
                })
                .catch(function(error) {
                    console.log("N");
              });
            }
            
            $scope.$on('$ionicView.enter', function() {
                $scope.userInfo = [];
                $scope.userImg = "";
                $scope.refresh();
            });

        }
    ]);