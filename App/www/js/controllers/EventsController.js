angular.module('app.events', [])
    .controller('EventsCtrl', [
        '$scope',
        '$kinvey',
        function($scope, $kinvey) {
            var store = $kinvey.DataStore.collection('events');
            store.useDeltaFetch = false;

            $scope.refresh = function() {
                store.find().subscribe(function(events) {
                $scope.events = events;
                $scope.$digest();
                });
            };

            $scope.$on('$ionicView.enter', function() {
                $scope.events = [];
                $scope.refresh();
            });
        }
    ]);