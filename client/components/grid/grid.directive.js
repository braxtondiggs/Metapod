'use strict';

angular.module('metapodApp')
    .directive('gridview', function() {
        return {
            templateUrl: 'components/grid/grid.html',
            restrict: 'E',
            controller: 'MainController'//,
    		//controllerAs: 'main'
        };
    });
