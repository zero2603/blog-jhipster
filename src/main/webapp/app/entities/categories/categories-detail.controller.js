(function() {
    'use strict';

    angular
        .module('blogApp')
        .controller('CategoriesDetailController', CategoriesDetailController);

    CategoriesDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'DataUtils', 'entity', 'Categories', 'postbycategories'];

    function CategoriesDetailController($scope, $rootScope, $stateParams, previousState, DataUtils, entity, Categories, postbycategories) {
        var vm = this;

        vm.postbycategories = postbycategories;
        vm.categories = entity;
        vm.previousState = previousState.name;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        var unsubscribe = $rootScope.$on('blogApp:categoriesUpdate', function(event, result) {
            vm.categories = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
