angular.module('app.me', [])
    .controller('MyProfileCtrl', [
        '$scope',
        '$kinvey',
        '$q',
        '$loading',
        function($scope, $kinvey, $q, $loading) {
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

                $scope.changeProfilePic = function() {
                    $loading.start('uploadPic');

                    //  Finding old profile picture if any and deleting it
                    var query = new $kinvey.Query();
                    query.equalTo('userId', $scope.userInfo._id);
                    console.log("USER ID: "+ $scope.userInfo._id);
                    var promise = $kinvey.Files.find(query)
                        .then(function(file) {
                            var promise = $kinvey.Files.removeById(file['0']._id)
                                .then(function() {
                                    console.log("Old picture is replaced by the new one.")
                                })
                                .catch(function(error) {
                                    console.log("Error in upload: " + error)
                                });
                        })
                        .catch(function(error) {
                            console.log("No old picture found.");
                    });

                    //   Uploading the image in the database
                    var metadata = {
                        userId: $scope.userInfo._id,
                        _acl: {
                            w: [$scope.userInfo._id]
                        },
                        _public: true
                    };

                    var file = document.getElementById('file').files[0];
                    
                    var promise = $kinvey.Files.upload(file, metadata)
                        .then(function(file) {
                            console.log("Successfull upload");
                            $loading.finish('uploadPic');
                        })
                        .catch(function(error) {
                            console.log("Upload error: "+ error);
                    });
                }
            }
        
            $scope.$on('$ionicView.enter', function() {
                $scope.userInfo = [];
                $scope.userImg = "";
                $scope.refresh();
            });

        }
    ]);