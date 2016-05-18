'use strict';

angular.module('metapodApp')
    .directive('modal', function() {
        return {
            templateUrl: 'components/modal/modal.html',
            restrict: 'E',
            link: function(scope, element) {
                element.addClass('modal');
            }
        };
    });
