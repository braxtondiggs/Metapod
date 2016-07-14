'use strict';

(function() {
    class MainController {
        constructor($scope, $location, $rootScope, $route, $sessionStorage, $filter, $routeParams, ngDialog, WizardHandler) {
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
                id: 'prod_8nlhrtrvUjkyYJ',
                url: 'wiz-khalifa',
                name: 'Wiz Khalifa',
                sku: 'sku_8nll4K1IDKJIoX',
                price: 8.99,
                descrip: 'Add instant style to lockers, dorm rooms, workspace or the fridge while keeping your notes and reminders in view with an attention-grabbing Rectangle Magnet.',
                info: ['Measures 2.125" x 3.125', 'Metal shell', 'Mylar/UV protecting cover', 'Flat magnetic back.'],
                image: '/assets/images/wiz.png',
                cuts: false,
                color: '#1bbc9b',
                active: true

            }, {
                id: 'prod_8nlmvxymTj85pW',
                url: 'riff-raff',
                name: 'Riff Raff',
                sku: 'sku_8nlmuEzvcQTnMu',
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
            $scope.getItems = function() {
                var items = [];
                if (!angular.isUndefined($scope.$storage.cartItems)) {
                    angular.forEach($scope.$storage.cartItems, function(value) {
                        if (_.indexOf(items, value.sku) > -1) {
                            items[_.indexOf(items, value.sku)].quantity++;
                        }else {
                            items.push({
                                amount: parseFloat(value.price) * 100,
                                currency: 'usd',
                                quantity: value.quantity,
                                type: 'sku',
                                parent: value.sku,
                                title: value.name,
                                image: value.image
                            });
                        }
                    });
                }
                return items;
            };
            $scope.checkout = function() {
                $scope.closeCart();
                $rootScope.items = $scope.getItems();
                ngDialog.open({
                    template: 'app/modal/checkoutTmpl.html'
                });
            };
            function pageScroll(action) {
                $.fn.fullpage.setMouseWheelScrolling(action);
                $.fn.fullpage.setKeyboardScrolling(action);
                $.fn.fullpage.setAllowScrolling(action);
            }
            $rootScope.$on('ngDialog.opened', function() {
                pageScroll(false);
                /*$('form#paymentForm').card({
                    container: '.card-wrapper',
                    formSelectors: {
                        nameInput: 'input[name="card"], input[name="expiry"], input[name="cvc"]'
                    }
                });*/
            });
            $rootScope.$on('ngDialog.closing', function() {
                pageScroll(true);
                if (WizardHandler.wizard().currentStepTitle() === 'Confirm') {
                    $sessionStorage.$reset();
                }
            });
            $scope.grid = function() {
                $scope.active = 'grid';
                $('.grid').height($(window).height());
                return false;
            };
            $scope.gotoMain = function(i) {
                if (i !== -1) {
                    $.fn.fullpage.moveTo(i + 2);
                }
                $scope.active = 'main';
                return false;
            };
            $scope.progressFunction = function(artist) {
                var newOrder = {
                    id: artist.id,
                    name: artist.name,
                    image: artist.image,
                    price: artist.price,
                    sku: artist.sku,
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
        constructor($scope, $rootScope, $http, WizardHandler, SweetAlert, countries) {
            var vm = this;
            vm.user =  {};
            vm.countries = countries;
            vm.paypal = function() {
                vm.closeThisDialog('val');
            };
            vm.submitCustomer = function() {
                if (vm.customerInfo && vm.customerInfo.$valid) {
                    WizardHandler.wizard().next();
                }
            };
            vm.submitAddress = function() {
                if (vm.addressInfo && vm.addressInfo.$valid) {
                    /*var address = vm.addressInfo.address1.$viewValue + ' ' +
                        vm.addressInfo.city.$viewValue + ' ' +
                        vm.addressInfo.state.$viewValue + ', ' +
                        vm.addressInfo.zip.$viewValue + ' ' +
                        vm.addressInfo.country.$viewValue.name;

                    $http.get('http://nominatim.openstreetmap.org/search', {
                        params: {
                            q: address,
                            format: 'json',
                            addressdetails: 1
                        }
                    }).then(function(response) {
                        if (response.data.length) {*/
                            WizardHandler.wizard().next();
                        /*}else {
                            SweetAlert.swal({
                               title: 'Address Error...',
                               text: 'It seems we could not find an address that corresponds with what you have inputted. Please review and resubmit a correct address.',
                               type: 'error'
                            });
                        }
                    });*/
                }
            };
            $scope.stripeCallback = function (code, result) {
                if (result.error) {
                    SweetAlert.swal({
                       title: 'Oops...',
                       text: result.error.message,
                       type: 'error'
                    });
                } else {
                    var items = $rootScope.items;
                    delete items.image;
                    delete items.title;
                    $http.post('/api/payments', {
                        params: {
                            stripeToken: result.id,
                            items: items,
                            user: {
                                name: vm.customerInfo.name.$viewValue,
                                email: vm.customerInfo.email.$viewValue,
                                address1: vm.addressInfo.address1.$viewValue,
                                address2: vm.addressInfo.address2.$viewValue,
                                city: vm.addressInfo.city.$viewValue,
                                state: vm.addressInfo.state.$viewValue,
                                country: vm.addressInfo.country.$viewValue.name
                            }
                        }
                    }).then(function(response) {
                        if (response && response.status === 'paid') {
                            WizardHandler.wizard().next();
                        }else {
                            SweetAlert.swal({
                               title: 'Oops...',
                               text: 'It seems we have are currently having issues processing your card. Please try another payment method or try again later.',
                               type: 'error'
                            });
                        }
                    });
                }
            };
            vm.onReturn = function (args) {
                console.log(args);
            };
            vm.onCancel = function (args) {
                console.log(args);
            };
        }
    }

    angular.module('metapodApp')
        .controller('MainController', MainController)
        .controller('FormController', FormController);
})();
