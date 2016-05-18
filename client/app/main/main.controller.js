'use strict';

(function() {

    class MainController {

        constructor($scope, $location, $rootScope, $route, $sessionStorage, $filter, $routeParams, ngDialog) {
            $scope.isCartOpen = false;
            $scope.showAction = false;
            $scope.location = $location.absUrl();
            $scope.dynamicLocation = $scope.location;
            $scope.socialText = 'Rap Magnets';
            $scope.title = 'Rap Magnets';
            $scope.subTitle = '';
            $scope.active = 'preload';
            $scope.$storage = $sessionStorage.$default({
                cartItems: []
            });
            $scope.artists = [{
                id: 'hello',
                url: 'wiz-khalifa',
                name: 'Wiz Khalifa',
                price: 8.99,
                descrip: 'Add instant style to lockers, dorm rooms, workspace or the fridge while keeping your notes and reminders in view with an attention-grabbing Rectangle Magnet.',
                info: ['Measures 2.125" x 3.125', 'Metal shell', 'Mylar/UV protecting cover', 'Flat magnetic back.'],
                image: '/assets/images/wiz.png',
                cuts: false,
                color: '#1bbc9b',
                active: true

            }, {
                id: 'whatup',
                url: 'riff-raff',
                name: 'Riff Raff',
                price: 9.99,
                descrip: 'Add instant style to lockers, dorm rooms, workspace or the fridge while keeping your notes and reminders in view with an attention-grabbing Rectangle Magnet.',
                info: ['Measures 2.125" x 3.125', 'Metal shell', 'Mylar/UV protecting cover', 'Flat magnetic back.'],
                image: '/assets/images/riff.png',
                cuts: false,
                image_cuts: {
                    head: '/assets/images/' + this.url + '/head.png'
                },
                color: '#4AA0D5',
                active: true

            }];
            $scope.scrollTop = function() {
                $.fn.fullpage.moveTo(1);
                return false;
            };
            $scope.scrollDown = function() {
                $.fn.fullpage.moveTo(2);
                return false;
            };
            $scope.openCart = function() {
                $scope.isCartOpen = true;
                return false;
            };
            $scope.closeCart = function() {
                $scope.isCartOpen = false;
                return false;
            };
            $scope.digitCheck = function(n) {
                return n > 9 ? '' + n : '0' + n;
            };
            $scope.calculateTotal = function() {
                var total = 0;
                if (!angular.isUndefined($scope.$storage.cartItems)) {
                    angular.forEach($scope.$storage.cartItems, function(value) {
                        total += value.price * value.quantity;
                    });
                }
                return total;
            };
            $scope.calculateQuantity = function() {
                if (!angular.isUndefined($scope.$storage.cartItems)) {
                    return $scope.$storage.cartItems.length;
                }
            };
            $scope.removeItem = function(i) {
                $scope.$storage.cartItems.splice(i, 1);
                $scope.cart = $scope.calculateQuantity();
                $scope.total = $scope.calculateTotal();
            };
            $scope.checkout = function() {
                $scope.closeCart();
                ngDialog.open({
                    template: '/app/modal/checkoutTmpl.html'
                });
            };
            $scope.checkout();
            $rootScope.$on('ngDialog.opened', function(e, $dialog) {
                /*setTimeout(function() {
                    $('input').on('focus', function() {
                        $(this).prev('label').addClass('input--filled');
                    }).on('blur', function() {
                        $(this).prev('label').removeClass('input--filled');
                    })
                }, 500);*/
            });
            $scope.grid = function() {
                //$.fn.fullpage.setMouseWheelScrolling(false);
                //$.fn.fullpage.setKeyboardScrolling(false);
                //$.fn.fullpage.setAllowScrolling(true);
                $scope.active = 'grid';
                $('.grid').height($(window).height());
                return false;
            };
            $scope.gotoMain = function(i) {
                if (i !== -1) {
                    $.fn.fullpage.moveTo(i + 2);
                }
                //$.fn.fullpage.setAllowScrolling(true);
                //$.fn.fullpage.setKeyboardScrolling(true);
                //$.fn.fullpage.setMouseWheelScrolling(true);
                $scope.active = 'main';
                return false;
            };
            $scope.progressFunction = function(artist) {
                var newOrder = {
                    id: artist.id,
                    name: artist.name,
                    price: artist.price,
                    quantity: 1
                };
                if (!angular.isUndefined($scope.$storage.cartItems)) {
                    var found = $filter('filter')($scope.$storage.cartItems, {
                        id: artist.id
                    }, true);
                    if (found.length) {
                        angular.forEach($scope.$storage.cartItems, function(value, index) {
                            if (found[0].id === value.id) {
                                $scope.$storage.cartItems[index].quantity++;
                            }
                        });
                    } else {
                        $scope.$storage.cartItems.push(newOrder);
                    }
                } else {
                    $scope.$storage.cartItems = [newOrder];
                }
                $scope.cart = $scope.calculateQuantity();
                $scope.total = $scope.calculateTotal();
            };
            $scope.cart = $scope.calculateQuantity();
            $scope.total = $scope.calculateTotal();

            var lastRoute = $route.current;
            $scope.$on('$locationChangeSuccess', function() {
                if ($route.current.$$route.controller === 'MainController') {
                    $route.current = lastRoute;
                }
            });

            function intializeFullScreen() {
                $('#fullpage').fullpage({
                    //keyboardScrolling: false,
                    scrollingSpeed: 1000,
                    lockAnchors: true,
                    recordHistory: false,
                    afterLoad: function(anchorLink, index) {
                        if ($scope.active === 'main') {
                            if (index !== 1 && index !== $scope.artists.length + 2) {
                                if (!angular.isUndefined($scope.artists[index - 2])) {
                                    $location.url('/r/' + $scope.artists[index - 2].url);
                                    $scope.dynamicLocation = $location.absUrl();
                                    document.getElementsByTagName('title')[0].innerHTML = 'Rap Magnets - ' + $scope.artists[index - 2].name;
                                }
                            } else {
                                if (angular.isUndefined($routeParams.name) || index === $scope.artists.length + 2) {
                                    document.getElementsByTagName('title')[0].innerHTML = 'Rap Magnets';
                                    $location.url('');
                                }
                            }
                            $scope.$apply();
                        }
                    },
                    afterRender: function() {
                        if ($scope.active === 'main' || $scope.active === 'preload') {
                            angular.forEach($scope.artists, function(value, i) {
                                if ($routeParams.name === value.url) {
                                    setTimeout(function() {
                                        $.fn.fullpage.moveTo(i + 2);
                                    }, 250);
                                }
                            });
                        }
                        $scope.active = 'main';
                        $scope.$apply();
                    },
                    onLeave: function(index, nextIndex) {
                        if ($scope.active === 'main') {
                            if (nextIndex > 1) {
                                $scope.showAction = true;
                            } else {
                                $scope.showAction = false;
                            }
                            $scope.$apply();
                        }
                    }
                });

            }
            $(document).ready(function() {
                setTimeout(function() {
                    intializeFullScreen();
                }, 1500);

            });
        }
    }

    class FormController {

        constructor($scope) {

            var vm = this;

            vm.exitValidation = function(form) {
                return form && !form.$invalid;
            };
        }

    }

    angular.module('metapodApp')
        .controller('MainController', MainController)
        .controller('FormController', FormController)

})();
