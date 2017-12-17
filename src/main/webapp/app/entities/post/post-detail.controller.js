(function() {
    'use strict';

    angular
        .module('blogApp')
        .controller('PostDetailController', PostDetailController);

    PostDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'DataUtils', 
    'entity', 'Post', 'Categories', 'postbydate', 'allCategories'];

    function PostDetailController($scope, $rootScope, $stateParams, previousState, DataUtils, 
        entity, Post, Categories, postbydate, allCategories) {
       
        var vm = this;

        vm.postbydate = postbydate;
        vm.allCategories = allCategories;
        vm.post = entity;
        vm.previousState = previousState.name;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        var unsubscribe = $rootScope.$on('blogApp:postUpdate', function(event, result) {
            vm.post = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
