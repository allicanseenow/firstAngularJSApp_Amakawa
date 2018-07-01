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
            controller: 'HomeController'
        })
        .when('/addItem', {
            templateUrl: 'views/addItem.html',
            controller: 'GroceryListItemsController'
        })
        .when('/addItem/:id', {
            templateUrl: 'views/addItem.html',
            controller: 'GroceryListItemsController'
        })
        .when('/addItem/edit/:id', {
            templateUrl: 'views/addItem.html',
            controller: 'GroceryListItemsController'
        })
        .otherwise({
            redirectTo: '/',
        });
});


app.service('GroceryService', function($http) {
    const groceryService = {};

    groceryService.groceryItems =  [];

    $http.get('data/server_data1.json')
        .then((res) => {
            groceryService.groceryItems = res.data;
            _.forEach(groceryService.groceryItems, (item, index) => {
                groceryService.groceryItems[index].date = new Date(item.date);
            });
        }, (res) => {
            alert("HTTP Get error");
        });

    groceryService.findById = (id) => {
        return _.find(groceryService.groceryItems, (item) => {
            return item.id === id;
        });
    };

    groceryService.removeItem = function(entry) {
        const index = groceryService.groceryItems.indexOf(entry);
        groceryService.groceryItems.splice(index, 1);
    };

    groceryService.getNewId = () => {
        if (groceryService.newId) {
            return ++groceryService.newId;
        }
        else {
            if (_.isEmpty(groceryService.groceryItems)) {
                groceryService.newId = 1;
                return groceryService.newId;
            }
            let maxId = _.maxBy(groceryService.groceryItems, (item) => { return item.id });
            groceryService.newId = maxId.id + 1;
            return groceryService.newId;
        }
    };

    groceryService.save = (entry) => {
        const updateItem = groceryService.findById(entry.id);
        if (updateItem) {
            _.merge(updateItem, entry);
        }
        else {
            entry.id = groceryService.getNewId();
            groceryService.groceryItems.push(entry);
            console.log('groceryService.groceryItem after i s ', groceryService.groceryItem)
        }
    };

    groceryService.markCompleted = (entry) => {
        entry.completed = !entry.completed;
    };

    return groceryService;
});

app.controller("HomeController", ["$scope", 'GroceryService', function($scope, GroceryService) {
    $scope.groceryItems = GroceryService.groceryItems;

    $scope.removeItem = function(entry) {
        GroceryService.removeItem(entry);
    };

    $scope.markCompleted = function(entry) {
        GroceryService.markCompleted(entry);
    };

    // Used after the HTTP request is given a response and the callback is triggered
    $scope.$watch(function() {
        return GroceryService.groceryItems;
    }, (groceryItems) => {
        $scope.groceryItems = groceryItems;
    });
}]);

app.controller("GroceryListItemsController", ["$scope", '$routeParams', '$location', 'GroceryService', function($scope, $routeParams, $location, GroceryService){
    $scope.groceryItems = GroceryService.groceryItems;

    if (!$routeParams.id) {
        $scope.groceryItem = {
            id: 0,
            completed: false,
            date: new Date(),
            itemName: '',
        }
    }
    else {
        $scope.groceryItem = _.clone(GroceryService.findById(parseInt($routeParams.id)));
    }

    $scope.save = function() {
        console.log('$scope.groceryItem is ', $scope.groceryItem);
        GroceryService.save($scope.groceryItem);
        console.log('call here ', GroceryService.findById($routeParams.id))
        $location.path('#! /');
    };

    $scope.rp = `Route param value: ${$routeParams.id}`;
}]);

app.directive('tbGroceryItem', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/groceryItem.html'
    };
});