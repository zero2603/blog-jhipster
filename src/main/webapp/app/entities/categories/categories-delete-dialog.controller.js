(function() {
    'use strict';

    angular
        .module('blogApp')
        .controller('CategoriesDeleteController',CategoriesDeleteController);

    CategoriesDeleteController.$inject = ['$uibModalInstance', 'entity', 'Categories'];

    function CategoriesDeleteController($uibModalInstance, entity, Categories) {
        var vm = this;

        vm.categories = entity;
        vm.clear = clear;
        vm.confirmDelete = confirmDelete;

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function confirmDelete (id) {
            Categories.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        }
    }
})();
