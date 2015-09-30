angular.module('countriesLibrary', [])

  .constant('COUNTRY_INFO', 'http://api.geonames.org/countryInfoJSON?')
  .constant('SEARCH_PATH', 'http://api.geonames.org/searchJSON?name_equals={{ capital }}')
  .constant('NEIGHBOURS', 'http://api.geonames.org/neighboursJSON?')
  .constant('USERNAME', '&username=edoecohen')
  .constant('COUNTRY_PATH', '&country={{ id }}')
  .constant('FIND_COUNTRY_PATH', '/?q={{ q }}')
  .constant('CAPITALS', 'app/capitals.json')
  
// GET ALL COUNTRIES FOR THE COUNTRIES LIST
  .factory('allCountries', ['$rootScope', '$http', '$q', 'COUNTRY_INFO', 'USERNAME',
    function($rootScope, $http, $q, COUNTRY_INFO, USERNAME) {
      return function() {
        var defer = $q.defer();
        $rootScope.isLoading = true;
        $http.get(COUNTRY_INFO + USERNAME, { cache: true })
        .success(function(data) {
          defer.resolve(data);
          $rootScope.isLoading = false;
        })
        return defer.promise;
      }
    }])

// GET COUNTRIES FOR THE HOMEPAGE
  .factory('homeCapitals', ['$http', '$q', 'CAPITALS',
   function($http, $q, CAPITALS) {
    return function() {
      var defer = $q.defer();
      $http.get(CAPITALS, { cache : true })
      .success(function(data) {
        defer.resolve(data);
      });
      return defer.promise;
    }
  }])

// REQUEST INFO ABOUT 1 COUNTRY
  .factory('countryRequest', ['$http', '$q', '$interpolate', 'COUNTRY_INFO', 'USERNAME', 'COUNTRY_PATH',
    function($http, $q, $interpolate, COUNTRY_INFO, USERNAME, COUNTRY_PATH) {
    return function(query) {
      var defer = $q.defer();

      var path = $interpolate(COUNTRY_PATH)({
        id : query
      });

      $http.get(COUNTRY_INFO + USERNAME + path, { cache: true })
        .success(function(data) {
          defer.resolve(data);
        })
      return defer.promise;
    }
  }])

// FIND INFO ABOUT THE CAPITAL
  .factory('capitalInfo', ['$rootScope', '$http', '$q', '$interpolate', 'SEARCH_PATH', 'USERNAME', 'COUNTRY_PATH',
    function($rootScope, $http, $q, $interpolate, SEARCH_PATH, USERNAME, COUNTRY_PATH) {
      return function(city, countryID) {
        var defer = $q.defer();

        var path = $interpolate(SEARCH_PATH)({
          capital : city
        });

        var country = $interpolate(COUNTRY_PATH)({
          id : countryID
        });

        $rootScope.isLoading = true;

        $http.get(path + USERNAME + country, { cache: true })
          .success(function(data) {
            defer.resolve(data);
            $rootScope.isLoading = false;
          })
        return defer.promise;
      }
    }])

// GET A COUNTRIES NEIGHBORS
  .factory('findNeighbors', ['$rootScope', '$http', '$q', '$interpolate', 'NEIGHBOURS', 'USERNAME', 'COUNTRY_PATH',
    function($rootScope, $http, $q, $interpolate, NEIGHBOURS, USERNAME, COUNTRY_PATH) {
    return function(country) {
      var defer = $q.defer();

      var path = $interpolate(COUNTRY_PATH)({
        id : country
      });

      $rootScope.isLoading = true;

      $http.get(NEIGHBOURS + USERNAME + path, { cache: true })
        .success(function(data) {
          defer.resolve(data);
          $rootScope.isLoading = false;
        })
      return defer.promise;
    }
  }]);



/*
  .factory('findCountry', ['countryRequest', '$interpolate', 'FIND_COUNTRY_PATH', 'COUNTRY_PATH',
    function(countryRequest, $interpolate, FIND_COUNTRY_PATH, COUNTRY_PATH) {
    return function(q) {
      var path;
      path = '&country=' + q;

      /*if(q.match(/^\d+$/)) {
        path = $interpolate('country=' + COUNTRY_PATH)({
          id : q
        });
      } else {
        path = $interpolate(FIND_COUNTRY_PATH)({
          q : q
        });
      }
      return countryRequest(path);
    }
  }])*/