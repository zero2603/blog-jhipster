(function() {
    'use strict';

    angular
        .module('blogApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('categories', {
            parent: 'entity',
            url: '/categories',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'blogApp.categories.home.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/categories/categories.html',
                    controller: 'CategoriesController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('categories');
                    $translatePartialLoader.addPart('global');
                    return $translate.refresh();
                }]
            }
        })
        .state('categories-detail', {
            parent: 'categories',
            url: '/categories/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'blogApp.categories.detail.title'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/categories/categories-detail.html',
                    controller: 'CategoriesDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('categories');
                    return $translate.refresh();
                }],
                entity: ['$stateParams', 'Categories', function($stateParams, Categories) {
                    return Categories.get({id : $stateParams.id}).$promise;
                }],
                postbycategories: ['entity', 'Post', function(entity, Post){
                    return Post.postbycategories({id: entity.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'categories',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('categories-detail.edit', {
            parent: 'categories-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/categories/categories-dialog.html',
                    controller: 'CategoriesDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Categories', function(Categories) {
                            return Categories.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('categories.new', {
            parent: 'categories',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/categories/categories-dialog.html',
                    controller: 'CategoriesDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                name: null,
                                avatar: null,
                                avatarContentType: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('categories', null, { reload: 'categories' });
                }, function() {
                    $state.go('categories');
                });
            }]
        })
        .state('categories.edit', {
            parent: 'categories',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/categories/categories-dialog.html',
                    controller: 'CategoriesDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Categories', function(Categories) {
                            return Categories.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('categories', null, { reload: 'categories' });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('categories.delete', {
            parent: 'categories',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/categories/categories-delete-dialog.html',
                    controller: 'CategoriesDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Categories', function(Categories) {
                            return Categories.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('categories', null, { reload: 'categories' });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
