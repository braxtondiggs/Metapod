'use strict';

angular.module('metapodApp', [
        'metapodApp.constants',
        'ngRoute',
        'ngAnimate',
        'ngMessages',
        'ngDialog',
        'ngStorage',
        'angular-progress-button-styles',
        'angularPayments',
        'credit-cards',
        'angulartics',
        'mgo-angular-wizard',
        '720kb.socialshare',
        'oitozero.ngSweetAlert',
        'dsl-paypal-button'
    ])
    .config(function($routeProvider, $locationProvider) {
        $routeProvider
            .otherwise({
                redirectTo: '/'
            });

        $locationProvider.html5Mode(true);
    })
    .config(function (stripe) {
        window.Stripe.setPublishableKey(stripe);
    });
