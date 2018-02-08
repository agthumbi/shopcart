var passed = false;
angular.module('app.controllers', [])


        .controller('menuCtrl', function ($scope, $rootScope, $http, sharedCartService,sharedFilterService,$ionicPopup) {

            var dontLoad = false;


            //put cart after menu
            var cart = sharedCartService.cart;



            $scope.slide_items = [{"p_id": "1",
                    "p_name": "New Chicken Maharaja",
                    "p_description": "Product Description",
                    "p_image_id": "slide_1",
                    "p_price": "183"},

                {"p_id": "2",
                    "p_name": "Big Spicy Chicken Wrap",
                    "p_description": "Product Description",
                    "p_image_id": "slide_2",
                    "p_price": "171"},

                {"p_id": "3",
                    "p_name": "Big Spicy Paneer Wrap",
                    "p_description": "Product Description",
                    "p_image_id": "slide_3",
                    "p_price": "167"}
            ];




            $scope.noMoreItemsAvailable = false; // lazy load list




            //loads the menu----onload event
           

            // Loadmore() called inorder to load the list 
            $scope.loadMore = function () {



            //   var str =sharedFilterService.getURL();//s sharedFilterService.getUrl();
            sharedFilterService.till+=5;
            sharedFilterService.str=sharedFilterService.str+sharedFilterService.till;
                console.log("URL", sharedFilterService.till);
                $http.get(sharedFilterService.str).success(function (response) {

                    var query = response.query;
					
                    sharedFilterService.ptype = response.ptype;
                    $scope.menu_items = response.records;

                    sessionStorage.setItem('query', query);

                    $scope.hasmore = response.has_more;	//"has_more": 0	or number of items left
                    console.log(response.quer);
                    //alert($scope.hasmore)
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    

                });




                //more data can be loaded or not
                if ($scope.hasmore == 0) {
                    $scope.noMoreItemsAvailable = true;
                }
            };


            //show product page
            $scope.showProductInfo = function (id, desc, img, name, price) {
                sessionStorage.setItem('product_info_id', id);
                sessionStorage.setItem('product_info_desc', desc);
                sessionStorage.setItem('product_info_img', img);
                sessionStorage.setItem('product_info_name', name);
                sessionStorage.setItem('product_info_price', price);
                window.location.href = "#/page13";
            };

            //add to cart function
            $scope.addToCart = function (id, image, name, price) {
                var link = '  https://ea0fa089.ngrok.io/ionic/cart.php';

                var frmdata = {id: id, image: image, name: name, price: price, qty: 1, uid: sessionStorage.getItem('loggedin_id')};



                $http.post(link, frmdata)
                        .then(function (res) {

                        });
                cart.add(id, image, name, price, 1);
                $rootScope.totalcart = cart.length;







            };
        })

        .controller('cartCtrl', function ($scope, $http, $rootScope, sharedCartService, $ionicPopup, $state) {

            //onload event-- to set the values
            $scope.$on('$stateChangeSuccess', function () {

                //if(sharedCartService.cart.length>0){

                $scope.cart = sharedCartService.cart;
                $scope.total_qty = sharedCartService.total_qty;

                $scope.total_amount = sharedCartService.total_amount;
                //}
                /*else{
                 $scope.total_qty=0;
                 $scope.total_amount=0;
                 $scope.cart.length=0;
                 
                 
                 }	*/
            });

            //remove function
            $scope.removeFromCart = function (c_id) {
                $scope.cart.drop(c_id);
                $scope.total_qty = sharedCartService.total_qty;
                $rootScope.totalcart = sharedCartService.total_qty;
                $scope.total_amount = sharedCartService.total_amount;
                var link = '  https://ea0fa089.ngrok.io/ionic/cartdel.php';
                var frmdata = {id: c_id, uid: sessionStorage.getItem('loggedin_id')};



                $http.post(link, frmdata)
                        .then(function (res) {

                        });

            };

            $scope.inc = function (c_id) {
                $scope.cart.increment(c_id);
                $scope.total_qty = sharedCartService.total_qty;

                $scope.total_amount = sharedCartService.total_amount;
                var link = '  https://ea0fa089.ngrok.io/ionic/cartupdate.php';
                var frmdata = {id: c_id, uid: sessionStorage.getItem('loggedin_id'), type: 'inc'};

                $http.post(link, frmdata)
                        .success(function (res) {

                        });
            };

            $scope.dec = function (c_id) {
                $scope.cart.decrement(c_id);

                $scope.total_qty = sharedCartService.total_qty;

                $scope.total_amount = sharedCartService.total_amount;
                var link = '  https://ea0fa089.ngrok.io/ionic/cartupdate.php';
                var frmdata = {id: c_id, uid: sessionStorage.getItem('loggedin_id'), type: 'del'};

                if (sessionStorage.getItem('loggedin_id') != null) {
                    $http.post(link, frmdata)
                            .success(function (res) {
                                console.log(JSON.stringify(res));
                                $rootScope.totalcart = res.cqty;
                                if (res.cqty == 0) {

                                    $scope.total_qty = 0;
                                }

                            });
                } else {
                    $rootScope.totalcart = $scope.cart.length;
                }
            };

            $scope.checkout = function () {
                if ($scope.total_amount > 0) {
                    $state.go('checkOut');
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'No item in your Cart',
                        template: 'Please add Some Items!'
                    });
                }
            };

        })

        .controller('checkOutCtrl', function ($scope) {
            $scope.loggedin = function () {
                if (sessionStorage.getItem('loggedin_id') == null) {
                    return 1;
                } else {
                    $scope.loggedin_name = sessionStorage.getItem('loggedin_name');
                    $scope.loggedin_id = sessionStorage.getItem('loggedin_id');
                    $scope.loggedin_phone = sessionStorage.getItem('loggedin_phone');
                    $scope.loggedin_address = sessionStorage.getItem('loggedin_address');
                    $scope.loggedin_pincode = sessionStorage.getItem('loggedin_pincode');
                    return 0;
                }
            };



        })

        .controller('indexCtrl', function ($scope, $rootScope, $http, sharedCartService,sharedFilterService, $state) {

            var cart = sharedCartService.cart==undefined?0:sharedCartService.cart;
    sharedFilterService.str=" https://ea0fa089.ngrok.io/ionic/food_menu.php?till=";
    sharedFilterService.till=3;
    alert(sharedFilterService.sort)
   
    
    
   
    //console.log("URL", sharedFilterService.getUrls(sharedFilterService.str));

            var amount = 0;
            var qty = 0;
            str = "  https://ea0fa089.ngrok.io/ionic/savedcart.php?userid=" + sessionStorage.getItem('loggedin_id');
            if (!passed) {
                passed = true;
                $http.get(str)
                        .success(function (response) {
                            //$rootScope.totalcart=0;
                            cart.length = 0;
                            $rootScope.totalcart = 0;
                            records = response.records;
                            if (records != null) {
                                sharedCartService.total_qty = 0;
                                sharedCartService.total_amount = 0;
                                records.forEach(function (results) {

                                    cart.add(results.id, results.image, results.name, results.price, results.qty);
                                    amount += parseInt(results.qty) * parseInt(results.price);
                                    qty += parseInt(results.qty);

                                    $rootScope.totalcart = cart.length;

                                    //
                                });
                                sharedCartService.total_amount = amount;
                                sharedCartService.total_qty = qty;
                                $state.go('profile', {}, {location: "replace", reload: true});





                            }
                            return;
                        });

            }

            $scope.checkAlert = function () {
                var cart = sharedCartService.cart;

                var amount = 0;
                var qty = 0;
                str = " https://ea0fa089.ngrok.io/ionic/savedcart.php?userid=" + sessionStorage.getItem('loggedin_id');
                if (!passed) {
                    passed = true;
                    $http.get(str)
                            .success(function (response) {
                                cart.length = 0;
                                $rootScope.totalcart = 0;
                                records = response.records;
                                if (records != null) {
                                    sharedCartService.total_qty = 0;
                                    sharedCartService.total_amount = 0;
                                    records.forEach(function (results) {

                                        cart.add(results.id, results.image, results.name, results.price, results.qty);
                                        amount += parseInt(results.qty) * parseInt(results.price);
                                        qty += parseInt(results.qty);

                                        $rootScope.totalcart = cart.length;

                                        //
                                    });
                                    sharedCartService.total_amount = amount;
                                    sharedCartService.total_qty = qty;
                                    $state.go('profile', {}, {location: "replace", reload: true});





                                }
                                return;
                            });

                }
            };

        })

        .controller('loginCtrl', function ($scope, $rootScope, sharedCartService, $http, $ionicPopup, $state, $ionicHistory) {
            var passed = false;
            var cart = sharedCartService.cart;
            $scope.user = {};
            if (sessionStorage.getItem('loggedin_id') != '') {
                $state.go('profile', {}, {location: "replace", reload: true});

            }

            $scope.login = function () {
                var amount = 0;
                var qty = 0;
                str = "  https://ea0fa089.ngrok.io/ionic/user-details.php?e=" + $scope.user.email + "&p=" + $scope.user.password;

                $http.get(str)

                        .success(function (response) {
                            cart.length = 0;
                            $rootScope.totalcart = 0;
                            $scope.user_details = response.records;

                            sessionStorage.setItem('loggedin_name', $scope.user_details.u_name);
                            sessionStorage.setItem('loggedin_id', $scope.user_details.u_id);
                            sessionStorage.setItem('loggedin_phone', $scope.user_details.u_phone);
                            sessionStorage.setItem('loggedin_address', $scope.user_details.u_address);
                            sessionStorage.setItem('loggedin_pincode', $scope.user_details.u_pincode);
                            str = "  https://ea0fa089.ngrok.io/ionic/savedcart.php?userid=" + $scope.user_details.u_id;

                            if (!passed) {
                                passed = true;
                                $http.get(str)
                                        .success(function (response) {


                                            //$rootScope.totalcart=0;
                                            sharedCartService.total_qty = 0;
                                            sharedCartService.total_amount = 0;
                                            records = response.records;
                                            if (records != null) {

                                                records.forEach(function (results) {
                                                    amount += parseInt(results.qty) * parseInt(results.price);
                                                    qty += parseInt(results.qty);
                                                    cart.add(results.id, results.image, results.name, results.price, results.qty);
                                                    $rootScope.totalcart = cart.length;
                                                })

                                                sharedCartService.total_amount = amount;
                                                sharedCartService.total_qty = qty;




                                            }
                                            return;
                                        });

                            }


                            $ionicHistory.nextViewOptions({
                                disableAnimate: true,
                                disableBack: true
                            });
                            lastView = $ionicHistory.backView();
                            console.log('Last View', lastView);
                            //BUG to be fixed soon
                            /*if(lastView.stateId=="checkOut"){ $state.go('checkOut', {}, {location: "replace", reload: true}); }
                             else{*/
                            $state.go('profile', {}, {location: "replace", reload: true});
                            //}

                        }).error(function () {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Login failed!',
                        template: 'Please check your credentials!'
                    });
                });
            };

        })

        .controller('signupCtrl', function ($scope, $http, $ionicPopup, $state, $ionicHistory) {

            $scope.signup = function (data) {
                var link = ' https://ea0fa089.ngrok.io/ionic/signup.php';

                var frmdata = {n: data.name, un: data.username, ps: data.password, ph: data.phone, add: data.address, pin: data.pincode};



                $http.post(link, frmdata)
                        .success(function (res) {



                            $scope.response = res;



                            if ($scope.response.created == "1") {
                                $scope.title = "Account Created!";
                                $scope.template = "Your account has been successfully created!";

                                //no back option
                                $ionicHistory.nextViewOptions({
                                    disableAnimate: true,
                                    disableBack: true
                                });
                                $state.go('login', {}, {location: "replace", reload: true});

                            } else if ($scope.response.exists == "1") {
                                $scope.title = "Email Already exists";
                                $scope.template = "Please click forgot password if necessary";

                            } else {
                                $scope.title = "Failed";
                                $scope.template = "Contact Our Technical Team";
                            }

                            var alertPopup = $ionicPopup.alert({
                                title: $scope.title,
                                template: $scope.template
                            });


                        });

            }
        })

        .controller('filterByCtrl', function ($scope, sharedFilterService) {

            /* $scope.Categories = [
             {id: 1, name: 'Foods'},
             {id: 2, name: 'Clothes'},
             {id: 3, name: 'Furniture'}
             
             ];*/
            $scope.Categories = sharedFilterService.ptype;

            $scope.getCategory = function (cat_list) {
                categoryAdded = cat_list;

                var c_string = ""; // will hold the category as string

                for (var i = 0; i < categoryAdded.length; i++) {
                    c_string += (categoryAdded[i].id + "||");
                }

                c_string = c_string.substr(0, c_string.length - 2);
                sharedFilterService.category = c_string;

                window.location.href = "#/page1";
            };


        })

       .controller('navPageCtrl', function ($scope, sharedFilterService) {

            $scope.carttype = function (categorytype) {

                sharedFilterService.categorytype = categorytype;
                sharedFilterService.category = '';
                sharedFilterService.sort = '';
                console.log('nav', categorytype);
                window.location.href = "#/page1";
            };
        })
	
      .controller('sortByCtrl', function ($scope, sharedFilterService,sharedCartService) {
            $scope.sort = function (sort_by) {
                sharedFilterService.sort = sort_by;
                alert(sessionStorage.getItem('query'))
                if (sessionStorage.getItem('query') != 'undefined')
                    sharedFilterService.query = sessionStorage.getItem('query');
                console.log('sort', sort_by);
                window.location.href = "#/page1";
            };
            $scope.checkAlert = function () {
                var cart = sharedCartService.cart;

                var amount = 0;
                var qty = 0;
                str = " https://ea0fa089.ngrok.io/ionic/savedcart.php?userid=" + sessionStorage.getItem('loggedin_id');
                if (!passed) {
                    passed = true;
                    $http.get(str)
                            .success(function (response) {
                                //$rootScope.totalcart=0;
                                cart.length = 0;
                                $rootScope.totalcart = 0;
                                records = response.records;
                                if (records != null) {
                                    sharedCartService.total_qty = 0;
                                    sharedCartService.total_amount = 0;
                                    records.forEach(function (results) {

                                        cart.add(results.id, results.image, results.name, results.price, results.qty);
                                        amount += parseInt(results.qty) * parseInt(results.price);
                                        qty += parseInt(results.qty);

                                        $rootScope.totalcart = cart.length;

                                        //
                                    });
                                    sharedCartService.total_amount = amount;
                                    sharedCartService.total_qty = qty;
                                    $state.go('profile', {}, {location: "replace", reload: true});





                                }
                                return;
                            });

                }
            };
        })

        .controller('paymentCtrl', function ($scope) {

        })

        .controller('profileCtrl', function ($scope, $rootScope, sharedCartService, $ionicHistory, $state) {
            var cart = sharedCartService.cart;
            $scope.loggedin_name = sessionStorage.getItem('loggedin_name');
            $scope.loggedin_id = sessionStorage.getItem('loggedin_id');
            $scope.loggedin_phone = sessionStorage.getItem('loggedin_phone');
            $scope.loggedin_address = sessionStorage.getItem('loggedin_address');
            $scope.loggedin_pincode = sessionStorage.getItem('loggedin_pincode');


            $scope.logout = function () {
                delete sessionStorage.loggedin_name;
                delete sessionStorage.loggedin_id;
                delete sessionStorage.loggedin_phone;
                delete sessionStorage.loggedin_address;
                delete sessionStorage.loggedin_pincode;
                sharedCartService.total_qty = 0;
                sharedCartService.total_amount = 0;
                cart.length = 0;
                sharedCartService.length = 0;
                $rootScope.totalcart = 0;

                console.log('Logoutctrl', sessionStorage.getItem('loggedin_id'));

                $ionicHistory.nextViewOptions({
                    disableAnimate: true,
                    disableBack: true
                });
                $state.go('menu', {}, {location: "replace", reload: true});
            };
        })

        .controller('myOrdersCtrl', function ($scope) {

        })

        .controller('editProfileCtrl', function ($scope) {

        })

        .controller('favoratesCtrl', function ($scope) {

        })

        .controller('productPageCtrl', function ($scope) {

            //onload event
            angular.element(document).ready(function () {
                $scope.id = sessionStorage.getItem('product_info_id');
                $scope.desc = sessionStorage.getItem('product_info_desc');
                $scope.img = "img/" + sessionStorage.getItem('product_info_img') + ".jpg";
                $scope.name = sessionStorage.getItem('product_info_name');
                $scope.price = sessionStorage.getItem('product_info_price');
            });


        })

        .service("sharedCartService", function () {

            var _xxx = {};

            return {
                getXxx: function () {
                    return _xxx;
                },
               
                setXxx: function (value) {
                    _xxx = value;
                }
            };

        })
         .service("sharedFilterService", function () {
   
        });
        