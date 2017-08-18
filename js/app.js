(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
    .controller('NarrowItDownController', NarrowItDownController)
    .service('MenuSearchService', MenuSearchService)
    .directive('foundItems', FoundItemsDirective)
    .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

    function FoundItemsDirective() {
        var ddo = {
            templateUrl: 'foundItems.html',
            scope: {
                found: '<',
                onRemove: '&'
            }
        };

        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;

        ctrl.searchTerm = "";
        ctrl.found = [];
        ctrl.msg = "";

        ctrl.search = function() {
            ctrl.msg = "";

            if (ctrl.searchTerm.trim() === "") {
                ctrl.msg = "Nothing found";
                ctrl.found = [];
            } else {
                var promise = MenuSearchService.getMatchedMenuItems(ctrl.searchTerm);

                promise.then(function (response) {
                    ctrl.found = response;

                    if (ctrl.found.length === 0) {
                        ctrl.msg = "Nothing found";
                    }
                });
            }
        }

        ctrl.onRemove = function(index) {
            ctrl.found.splice(index, 1);
        }
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
            method: "GET",
            url: (ApiBasePath + "/menu_items.json")
            }).then(function(result) {

                var allItems = result.data.menu_items;
                var foundItems = [];
                allItems.forEach(function (item) {
                  console.log(item);
                  var desc = item.description.toLowerCase();
                  if (desc.indexOf(searchTerm) >= 0) {
                    foundItems.push(item);
                  }
                });


                return foundItems;
            });
        };
    }
})();