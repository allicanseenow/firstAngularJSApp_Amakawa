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


app.service('GroceryService', function() {
    const groceryService = {};

    groceryService.groceryItems =  [
        { id: 1, itemName: 'milk', date: '2014-10-01', completed: true },
        { id: 2, itemName: 'cookies', date: '2014-10-01', completed: true },
        { id: 3, itemName: 'ice cream', date: '2014-10-02', completed: false, },
        { id: 4, itemName: 'potatoes', date: '2014-10-02', completed: true },
        { id: 5, itemName: 'cereal', date: '2014-10-03', completed: true },
        { id: 7, itemName: 'bread', date: '2014-10-03', completed: false },
        { id: 8, itemName: 'eggs', date: '2014-10-04', completed: true },
        { id: 10, itemName: 'tortillas', date: '2014-10-04', completed: false }
    ];

    groceryService.findById = (id) => {
        return _.find(groceryService.groceryItems, (item) => {
            return item.id === id;
        });
    };

    groceryService.getNewId = () => {
        if (groceryService.newId) {
            console.log('groceryService.newId is ', groceryService.newId);
            return ++groceryService.newId;
        }
        else {
            let maxId = _.maxBy(groceryService.groceryItems, (item) => { return item.id });
            console.log('maxId is ', maxId);
            groceryService.newId = maxId.id + 1;
            return groceryService.newId;
        }
    };

    groceryService.save = (entry) => {
        const updateItem = groceryService.findById(entry.id);
        console.log('update item is ', updateItem);
        if (updateItem) {
            _.merge(updateItem, entry);
        }
        else {
            entry.id = groceryService.getNewId();
            console.log('entry is ', entry);
            console.log('groceryService.groceryItem is ', groceryService.groceryItem)
            groceryService.groceryItems.push(entry);
            console.log('groceryService.groceryItem after i s ', groceryService.groceryItem)
        }
    };

    return groceryService;
});

app.controller("HomeController", ["$scope", 'GroceryService', function($scope, GroceryService) {
    $scope.groceryItems = GroceryService.groceryItems;
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
        $location.path('/');
    };

    $scope.rp = `Route param value: ${$routeParams.id}`;
}]);