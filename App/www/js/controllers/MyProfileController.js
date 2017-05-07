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

                $scope.changeProfilePic = function() {
                
                    var metadata = {
                        userId: $scope.userInfo._id,
                        _acl: {
                            w: [$scope.userInfo._id]
                        },
                        _public: "true"
                    };

                    var file = document.getElementById('file').files[0];
                    
                    //   Uploading the image in the database
                    var promise = $kinvey.Files.upload(file, metadata)
                        .then(function(file) {
                            //  Finding old profile picture id by the used Id
                            var query = new $kinvey.Query();
                            query.equalTo('userId', $scope.userInfo._id);
                            var promise = $kinvey.Files.find(query)
                                .then(function(file) {
                                    console.log("Old profile pic: "+ file);
                                    console.log(file['0']._id);
                                    //  Removing the old image from the database
                                    var promise = $kinvey.Files.removeById(file['0']._id)
                                        .then(function() {
                                            console.log("Old picture is replaced by the new one")
                                        })
                                        .catch(function(error) {
                                            console.log("Error in upload: " + error)
                                        });
                                })
                                .catch(function(error) {
                                    console.log("Invalid QUERY");
                                });

                            console.log("Successfull upload")
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