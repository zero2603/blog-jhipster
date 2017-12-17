(function() {
    'use strict';

    angular
        .module('blogApp')
        .controller('CategoriesDialogController', CategoriesDialogController);

    CategoriesDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'DataUtils', 'entity', 'Categories'];

    function CategoriesDialogController ($timeout, $scope, $stateParams, $uibModalInstance, DataUtils, entity, Categories) {
        var vm = this;

        vm.categories = entity;
        vm.clear = clear;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.categories.id !== null) {
                Categories.update(vm.categories, onSaveSuccess, onSaveError);
            } else {
                Categories.save(vm.categories, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('blogApp:categoriesUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }


        vm.setAvatar = function ($file, categories) {
            if ($file && $file.$error === 'pattern') {
                return;
            }
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        categories.avatar = base64Data;
                        categories.avatarContentType = $file.type;
                    });
                });
            }
        };

    }
})();
