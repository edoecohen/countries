angular.module("CountryApp", ['ngRoute', 'countriesLibrary', 'ui.bootstrap'])

.config(function($routeProvider){

	$routeProvider
	.when('/', {
		templateUrl : './home.html',
		controller : 'HomeCtrl'
	})
	.when('/countries', {
		templateUrl : './countries.html',
		controller : 'CountriesCtrl'
	})
	.when('/countries/:countryID', {
		templateUrl : './country.html',
		controller : 'CountryCtrl'
		/*resolve : {
			country: function(allCountries, $route, $location) {
				var country = $route.current.params.country;
				var countries = allCountries().then(function(data) {
					return data;
				});
				if(countries.indexOf(country) == -1 ) {
					$location.path('/error');
					return;
				}
				return country;
			}
		}*/
	})

	.otherwise({
		redirectTo : '/'
	});
})

.controller("MainCtrl", ['$scope', '$location',
	function($scope, $location){
		$scope.q="";
		$scope.countriesSearch = function() {
			$location.path('/countries/');
			$scope.q = $scope.query;
			$scope.query = null;
		};
		$scope.countriesView = function() {
			$location.path('/countries/');
			$scope.q = "";
			$scope.query = null;
		};
		$scope.clearSearch = function () {
			$scope.query = null;
		};
}])

.controller("HomeCtrl", ['$scope', 'homeCapitals', 'allCountries',
	function($scope, homeCapitals, allCountries) {
  		allCountries()
		.then(function(data) {
			$scope.countries = data.geonames;
		});

  		homeCapitals().
  		then(function(data) {
  			$scope.capitals = data.capitals;
  			shuffleArray($scope.capitals);
  		});
  		$scope.myInterval = 5000;

  		var shuffleArray = function(array) {
			var m = array.length, t, i;
			
			// While there remain elements to shuffle
			while (m) {
				// Pick a remaining element…
		    	i = Math.floor(Math.random() * m--);

				// And swap it with the current element.
				t = array[m];
				array[m] = array[i];
				array[i] = t;
			}

			return array;
		};
}])


.controller("CountriesCtrl", ['$scope', '$location', 'allCountries',
	function($scope, $location, allCountries) {
		allCountries()
		.then(function(data) {
			$scope.countries = data.geonames;
		});
		$scope.selectCountry = function(country) {
			$scope.selected = country;
			$location.path('/countries/' + $scope.selected.countryCode);
		};
}])

.controller("CountryCtrl", ['$scope', '$routeParams', 'countryRequest', 'capitalInfo', 'findNeighbors',
	function($scope, $routeParams, countryRequest, capitalInfo, findNeighbors) {
	$scope.countryID = $routeParams.countryID;
	$scope.idSmall = $scope.countryID.toLowerCase();
	countryRequest($scope.countryID)
	.then(function(data) {
		$scope.country = data.geonames[0];
		capitalInfo($scope.country.capital, $scope.countryID)
		.then(function(data){
			$scope.city = data.geonames[0];
		});
	});
	findNeighbors($scope.countryID)
	.then(function(data){
		$scope.neighbors = data.geonames;
	});
}]);
/*
.run(function($rootScope, $location, $timeout) {
    $rootScope.$on('$routeChangeStart', function() {
        $rootScope.isLoading = true;
    });
    $rootScope.$on('$routeChangeSuccess', function() {
      $timeout(function() {
        $rootScope.isLoading = false;
      }, 1000);
    });
});*/