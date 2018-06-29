/**
 * Created by Thomas on 5/28/2015.
 */
var app = angular.module('groceryListApp', ['ngRoute']);

app.config(function($routeProvider, $locationProvider) {
    // $locationProvider.html5Mode(true);
    // $locationProvider.html5Mode({
    //     enabled: true,
    //     requireBase: false
    // });
    // $locationProvider.hashPrefix('');
    $routeProvider
        .when('/', {
            templateUrl: 'views/groceryList.html',
            controller: 'GroceryListItemsController'
        })
        .when('/addItem', {
            templateUrl: 'views/addItem.html',
            controller: 'GroceryListItemsController'
        })
        .when('/addItem/:id', {
            templateUrl: 'views/addItem.html',
            controller: 'GroceryListItemsController'
        })
        .otherwise({
            redirectTo: '/',
        });
});

app.controller("HomeController", ["$scope", function($scope) {
    $scope.appTitle = "Grocery List Lol";
}]);

app.controller("GroceryListItemsController", ["$scope", '$routeParams', function($scope, $routeParams){
    $scope.groceryItems = [
        {itemName: 'milk', date: '2014-10-01'},
        {itemName: 'cookies', date: '2014-10-01'},
        {itemName: 'ice cream', date: '2014-10-02'},
        {itemName: 'potatoes', date: '2014-10-02'},
        {itemName: 'cereal', date: '2014-10-03'},
        {itemName: 'bread', date: '2014-10-03'},
        {itemName: 'eggs', date: '2014-10-04'},
        {itemName: 'tortillas', date: '2014-10-04'}
    ]

    $scope.rp = `Route param value: ${$routeParams.id}`;
}]);