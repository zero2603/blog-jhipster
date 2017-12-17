(function() {
    'use strict';

    angular
        .module('blogApp')
        .factory('CategoriesSearch', CategoriesSearch);

    CategoriesSearch.$inject = ['$resource'];

    function CategoriesSearch($resource) {
        var resourceUrl =  'api/_search/categories/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true}
        });
    }
})();
