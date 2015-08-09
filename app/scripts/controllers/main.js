'use strict';

/**
 * @ngdoc function
 * @name newsApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newsApp
 */
var app = angular.module('newsApp', []);

/**
 *Controller
 */
app.controller('MainCtrl', function($scope, $http, FeedService) {
  console.log("in MainCtrl");
  $scope.newsItems = FeedService.getFeeds($http);
});

/**
 *service
 */
app.service('FeedService', function($http) {
  console.log("in MainCtrl service");
  return {
    getFeeds: function() {
      return getFeedData($http);
    }
  };
});

/**
 *directive
 */
app.directive('newsItem', function() {
  console.log("in MainCtrl directive");
  return {
    restrict :'EA',
    templateUrl :'templates/newsItem.html'
  };
});

/**
 * NewsData class
 */
function NewsItem(author, categories, content, contentSnippet, link, publishedDate, title) {
  this.author = author;
  this.categories = categories;
  this.content = content;
  this.contentSnippet = contentSnippet;
  this.link = link;
  this.publishedDate = publishedDate;
  this.title = title;
}

/**
 * fetches feed info from google news
 * returns newsData
 */
function getFeedData($http) {
  var newsData = [];
  var url = 'https://news.google.com/?output=atom';
  var prefix = '//ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&callback=JSON_CALLBACK&q=';
  $http.jsonp(prefix + encodeURIComponent(url)).success(function(response) {
    createNewsData(newsData, response.responseData.feed.entries);
  });
  return newsData;
}

/**
 *creates newsItem and adds it to newsItems
 */
function createNewsData(newsData, dataItems) {
  angular.forEach(dataItems, function(val, key) {
    var cats = "";
    angular.forEach(val.categories, function(val, key) {
      cats = cats + "  " + val;
    });
    var newsItem = new NewsItem(val.author, cats, val.content, val.contentSnippet, val.link, val.publishedDate, val.title);
    newsData.push(newsItem);
  });
}
