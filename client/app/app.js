'use strict';

angular.module('metapodApp', [
        'metapodApp.constants',
        'ngResource',
        'ngRoute',
        'ngAnimate',
        'angular-progress-button-styles',
        'ngStorage',
        '720kb.socialshare',
        '720kb.fx',
        'angular-svg-round-progress',
        'ngDialog',
        'mgo-angular-wizard'
    ])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    });
