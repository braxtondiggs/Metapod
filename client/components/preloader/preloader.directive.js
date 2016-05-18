'use strict';

angular.module('metapodApp')
    .directive('preloader', function() {
        return {
            templateUrl: 'components/preloader/preloader.html',
            restrict: 'E',
            link: function(scope, element) {
                element.addClass('preloader');
            }
        };
    });
